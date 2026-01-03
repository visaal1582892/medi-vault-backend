import express from "express";
import { getEmailVerificationDetails, sendOtpController } from "../controller/auth-controller.js";
import catchAsync from "../utilities/catch-async.js";
import rateLimit from "express-rate-limit";

// Creating express router
const router=express.Router();

// Sub routes for auth
router.get("/getVerificationDetails/:email", getEmailVerificationDetails);
const sendOtpRequestRateLimiter = rateLimit({
    max: 1,
    windowMs: 1*60*1000,
    message: {
        status: false,
        message: "Otp sent already wait 1 minute to resend otp"
    }
})
router.post("/sendOtp", sendOtpRequestRateLimiter, catchAsync(sendOtpController));
// router.post("/verifyEmail", verifyEmail);
// router.post("/register", register);
// router.post("/login", login);

export default router;