import AppSuccess from "../utilities/app-success.js";
import { getEmailVerificationDetailsService, sendOtpService, verifyOtpService } from "../service/auth-service.js";

// controllers for email verification
export const sendOtpController = async (req, res) => {
    const email = req.body.email;
    await sendOtpService(email);
    res.status(201).json(new AppSuccess(true, `Otp sent to ${email} succesfully`, null));
}

export const getEmailVerificationDetailsController = async (req, res) => {
    const email=req.params?.email;
    const data = await getEmailVerificationDetailsService(email);
    res.status(200).json(new AppSuccess(true, "Details retrieved succesfully", data));
}

export const verifyEmailController = async (req, res) => {
    const { email, otp } = req.body;
    const result = await verifyOtpService(email, otp);
    res.status(200).json(new AppSuccess(true, "Otp verification succesfull", result));
}

// controller for registration
const register = (req, res, next) => {
    const registerBody = req.body();
}