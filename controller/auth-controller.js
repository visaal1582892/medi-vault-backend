import AppSuccess from "../utilities/app-success.js";
import { createVerificationTokenService, getEmailVerificationDetailsService, getUserDetailsService, registerService, sendOtpService, validateVerificationTokenService, verifyOtpService } from "../service/auth-service.js";

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

export const createVerificationTokenController = async (req, res) => {
    const { email } = req.body;
    const verificationToken = await createVerificationTokenService(email);
    res.status(200).json(new AppSuccess(true, "Verification token generated succesfully", { verificationToken }));
}

export const validateVerificationTokenController = async (req, res) => {
    const authorizationHeader = req.get("Authorization");
    const verificationToken = authorizationHeader?.split(" ")[1];
    const email = await validateVerificationTokenService(verificationToken);
    res.status(200).json(new AppSuccess(true, "Verification token validated succesfully", {email}));
}

// controller for registration
export const registerController = async (req, res) => {
    const authorizationHeader = req.get("Authorization");
    const verificationToken = authorizationHeader?.split(" ")[1];
    const {verifiedEmail, username, password} = req.body;
    await registerService({registerData: {email: verifiedEmail, username, password}, verificationToken});
    res.status(201).json(new AppSuccess(true, "User registration succesful"), null);
}

// controller to get registered user details
export const getUserDetailsController = async (req, res) => {
    const email=req.params?.email;
    const data = await getUserDetailsService(email);
    res.status(200).json(new AppSuccess(true, "Details retrieved succesfully", data));
}

// controller to login
export const loginController = async (req, res) => {
    const { email, password } = req.body;
    res.status(200).json(new AppSuccess(true, "User loggedin succesfully", null));
}