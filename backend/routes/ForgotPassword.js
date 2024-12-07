const express = require("express");
const {
  sendResetLink,
  resetPassword,
} = require("../controllers/ForgotPassword");

const router = express.Router();

router.post("/forgot-password", sendResetLink); // Send reset link
router.post("/reset-password/:token", resetPassword);
module.exports = router;
