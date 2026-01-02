import EmailVerification from "../model/email-verification-model";
import crypto from "crypto";
import bcrypt from "bcrypt";

// controllers for email verification
const sendOtp = (req, res, next) => {
    const email=req.email;
    const otp=crypto.randomInt(100000, 1000000);
    const hashedOtp=bcrypt.hash(otp,10);
    EmailVerification.create({
        email: email
    })
}

// controller for registration
const register = (req, res, next) => {
    const registerBody=req.body();
}