const express = require('express');

const signup = require('../controllers/auth/signup');
const verifyEmailOTP = require("../controllers/auth/verifyEmailOTP");
const resendOTP = require('../controllers/auth/resendOTP');
const login = require('../controllers/auth/login');
const googleLogin = require('../controllers/auth/googleLogin.js');
const logout = require("../controllers/user/logout");
const forgotPassword = require('../controllers/auth/forgotPassword');
const newPasswordOTP = require('../controllers/auth/verifyPasswordOTP');

// const forgotPassword = require('../controllers/users/forgotPassword');
// const resetPassword = require('../controllers/users/resetPassword');    

const router = express.Router();
router.post('/signup', signup);
router.post("/verify-email/:otpId", verifyEmailOTP);
router.post("/resend-otp/:otpId", resendOTP);              
router.post('/login', login);
router.post('/google', googleLogin);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/new-password/:otpId", newPasswordOTP);


// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

module.exports = router;