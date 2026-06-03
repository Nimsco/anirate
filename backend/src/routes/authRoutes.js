const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();


router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/get-user", authController.getUser);

router.get("/refresh-token", authController.refreshToken);

router.get("/logout", authController.logoutUser);

router.get("/logout-all", authController.logoutAll);

router.post("/verify-email", authController.verifyEmail);

module.exports = router;
