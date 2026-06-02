const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const sessionModel = require("../models/session.model");


const registerUser = async (req, res) => {
    const { username, password, phone, dob, gender } = req.body;

    if (!username || !password || !phone || !dob || !gender) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 4) {
        return res.status(400).json({ message: "Username must be at least 4 characters long" });
    }

    if (password.length < 4) {
        return res.status(400).json({ message: "Password must be at least 4 characters long" });
    }

    if (phone.length < 10) {
        return res.status(400).json({ message: "Phone number must be at least 10 characters long" });
    }

    if (new Date(dob) >= new Date()) {
        return res.status(400).json({ message: "Date of birth must be in the past" });
    }

    const userExists = await userModel.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        password: hashedPassword,
        phone,
        dob,
        gender
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });


    const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: "true",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
        message: "User registered successfully",
        user: { username: user.username, phone: user.phone, dob: user.dob, gender: user.gender },
        accessToken,
    });
}

const loginUser = async (req, res) => {

    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: "true",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        message: "User logged in successfully",
        user: { username: user.username, phone: user.phone, dob: user.dob, gender: user.gender },
        accessToken,
    });
}

const getUser = async (req, res) => {
    const accesstoken = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    const user = await userModel.findById(decoded.id).select("-password");

    res.status(200).json({ message: "User fetched successfully", user });
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: "true",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: "Access token refreshed successfully", accessToken });
}

const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not found" });
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(400).json({ message: "Invalid refresh token" });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out successfully" });
}

const logoutAll = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    await sessionModel.updateMany({ user: decoded.id, revoked: false }, { revoked: true });

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out from all devices successfully" });
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    refreshToken,
    logoutUser,
    logoutAll
}