const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();


router.post("/register", authController.registerUser);

router.get("/get-user", authController.getUser);

router.get("/refresh-token", authController.refreshToken);

module.exports = router;
