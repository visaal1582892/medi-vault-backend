import express from "express";
import { createVerificationTokenController, getEmailVerificationDetailsController, sendOtpController, validateVerificationTokenController, verifyEmailController } from "../controller/auth-controller.js";
import catchAsync from "../utilities/catch-async.js";
import rateLimit from "express-rate-limit";

// Creating express router
const router=express.Router();

// Sub routes for auth
router.get(["/getVerificationDetails/:email", "/getVerificationDetails"], getEmailVerificationDetailsController);
const sendOtpRequestRateLimiter = rateLimit({
    max: 1,
    windowMs: 1*60*1000,
    message: {
        status: false,
        message: "Otp sent already wait 1 minute to resend otp"
    }
})
router.post("/sendOtp", sendOtpRequestRateLimiter, catchAsync(sendOtpController));
const verifyEmailRateLimiter = rateLimit({
    max: 5,
    windowMs: 5*60*1000,
    message: {
        status: false,
        message: "Too many verification requests. You can try again in 5 minutes"
    }
}) 
router.post("/verifyEmail", catchAsync(verifyEmailController));
router.post("/createVerificationToken", catchAsync(createVerificationTokenController));
router.post("/validateVerificationToken", catchAsync(validateVerificationTokenController));
// router.post("/register", register);
// router.post("/login", login);

export default router;