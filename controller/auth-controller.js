import AppSuccess from "../utilities/app-success.js";
import { getEmailVerificationDetailsService, sendOtpService } from "../service/auth-service.js";

// controllers for email verification
export const sendOtpController = async (req, res) => {
    const email = req.body.email;
    await sendOtpService(email);
    res.status(201).json(new AppSuccess(true, `Otp sent to ${email} succesfully`, null));
}

export const getEmailVerificationDetails = async (req, res) => {
    const email=req.params.email;
    const data = await getEmailVerificationDetailsService(email);
    res.status(200).json(new AppSuccess(true, "Details retrieved succesfully", data));
}

// controller for registration
const register = (req, res, next) => {
    const registerBody = req.body();
}