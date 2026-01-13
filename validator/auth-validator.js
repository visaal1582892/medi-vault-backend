import { isEmpty, validateConfirmPassword, validateEmail, validateOtp, validatePassword, validateUsername } from "../helpers/validate-helpers.js";
import AppError from "../utilities/app-error.js";

export const sendOtpAndCreateVerificatioTokenValidator = (req, res, next) => {
    const {email} = req.body;
    validateEmail(email);
    next();
}

export const verifyEmailValidator = (req, res, next) => {
    const {email, otp} = req.body;
    validateEmail(email);
    validateOtp(otp);
    next();
}

export const registerValidator = (req, res, next) => {
    const { verifiedEmail, username, password, confirm_password } = req.body;
    const authorizationHeader = req.get("Authorization");
    if(isEmpty(authorizationHeader)) throw new AppError(401, "Authorization header not provided");
    const verificationToken = authorizationHeader?.split(" ")[1];
    if (isEmpty(verificationToken)) {
        throw new AppError(400, "Verification token provided is empty");
    }
    validateEmail(verifiedEmail);
    validateUsername(username);
    validatePassword(password);
    validateConfirmPassword(confirm_password, password);
    next();
}

export const validateVerificationTokenValidator = (req, res, next) => {
    const authorizationHeader = req.get("Authorization");
    if(isEmpty(authorizationHeader)) throw new AppError(401, "Authorization header not provided");
    const verificationToken = authorizationHeader?.split(" ")[1];
    if (isEmpty(verificationToken)) {
        throw new AppError(400, "Verification token provided is empty");
    }
    next();
}

export const loginValidator = (req, res, next) => {
    const {email, password} = req.body;
    validateEmail(email);
    validatePassword(password);
    next();
}