import { generateOtpAndHash, sendVerificationMail, createVerificationToken, createLoginToken } from "../helpers/auth-helpers.js"
import { isEmpty } from "../helpers/validate-helpers.js";
import { createEmailVerification, createUser, getExistingEmailVerificationDetails, getUserDetails, updateEmailVerification } from "../repository/auth-repository.js";
import AppError from "../utilities/app-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const sendOtpService = async (userEmail) => {
    const { otp, otpHash } = await generateOtpAndHash();
    const existingDbDetails = await getExistingEmailVerificationDetails(userEmail);
    const existingUserDetails = await getUserDetails(userEmail);

    // business rule check
    if(existingUserDetails){
        throw new AppError(400, "Email already registered");
    }
    if (
        existingDbDetails?.isVerified &&
        new Date(existingDbDetails.lastVerifiedTime).getTime() + 60 * 60 * 1000 >
        Date.now()
    ) {
        throw new AppError(400, "Email already verified");
    }

    // Send email FIRST
    try {
        await sendVerificationMail(userEmail, otp);
    } catch (err) {
        throw new AppError(500, "Failed to send OTP email");
    }

    // Only if email succeeded, update DB
    if (existingDbDetails) {
        await updateEmailVerification(userEmail, {
            otpHash,
            otpGeneratedTime: new Date(),
            isVerified: false
        });
    } else {
        await createEmailVerification(userEmail, otpHash);
    }
};


export const verifyOtpService = async (email, otp) => {
    const existingDbDetails = await getEmailVerificationDetailsService(email);
    if (!existingDbDetails) {
        return { isVerified: false };
    }

    const isOtpMatch = await bcrypt.compare(otp, existingDbDetails.otpHash);
    const isOtpExpired = new Date(existingDbDetails.otpGeneratedTime).getTime + 10 * 60 * 60 * 1000 < Date.now();
    const isVerified = isOtpMatch && !isOtpExpired;
    if (isVerified) {
        const updated = await updateEmailVerification(email, {
            isVerified: true,
            lastVerifiedTime: Date.now()
        })
        const verificationToken = createVerificationToken(email);
        return {
            isVerified: updated.isVerified,
            verificationToken: verificationToken
        }
    }
    return { isVerified: false };
}

export const getEmailVerificationDetailsService = async (existingEmail) => {
    if (isEmpty(existingEmail)) return null;
    const existingDbDetails = await getExistingEmailVerificationDetails(existingEmail);
    if (!existingDbDetails) return null;
    const { email, otpHash, otpGeneratedTime, isVerified, lastVerifiedTime } = existingDbDetails;
    return {
        email, otpHash, otpGeneratedTime, isVerified, lastVerifiedTime
    };
}

export const testVerificationStatusService = async (userEmail) => {
    const existingVerificationData = await getEmailVerificationDetailsService(userEmail);

    if (!existingVerificationData) return AppError(400, "Verification data not found");
    if (!existingVerificationData.isVerified) {
        throw new AppError(400, "Email not verified yet");
    }
    if (existingVerificationData.isVerified && (new Date(existingVerificationData.lastVerifiedTime).getTime() + 60 * 60 * 1000) < Date.now()) {
        throw new AppError(400, "Email verification expired");
    }
}

export const createVerificationTokenService = async (email) => {
    await testVerificationStatusService(email)
    return createVerificationToken(email);
}

export const validateVerificationTokenService = async (verificationToken) => {
    try {
        const userData = jwt.verify(verificationToken, process.env.VERIFICATION_JWT_SECRET_KEY);
        if (userData == null) {
            throw new AppError(401, "Invalid token");
        }
        await testVerificationStatusService(userData?.email);
        return userData.email;
    } catch (err) {
        if (err.name == "TokenExpiredError") throw new AppError(401, "Token Expired, Please verify again");
        if (err.name == "JsonWebTokenError") throw new AppError(401, "Invalid token")
        else throw new AppError(400, "Token verification unsuccesfull");
    }
}

export const registerService = async (registerDataAndToken) => {
    const { registerData, verificationToken } = registerDataAndToken;
    await validateVerificationTokenService(verificationToken);
    const existingUserData = await getUserDetails(registerData.email);
    if (existingUserData) throw new AppError(400, "User already registered");
    const hashedPassword = await bcrypt.hash(registerData.password,10);
    registerData.password = hashedPassword;
    await createUser(registerData);
}

export const getUserDetailsService = async (existingEmail) => {
    if (isEmpty(existingEmail)) return null;
    const existingDbDetails = await getUserDetails(existingEmail);
    if (!existingDbDetails) return null;
    const { email, username, password } = existingDbDetails;
    return {
        email, username, password
    };
}

export const loginService = async (email, password) => {
    const existingDbDetails = await getUserDetailsService(email);
    if(isEmpty(existingDbDetails)){
        throw new AppError(404, "User not registered yet");
    }
    const match = await bcrypt.compare(password, existingDbDetails.password);
    if(!match){
        throw new AppError(401, "Incorrect password");
    }
    const loginToken = createLoginToken(email);
    return loginToken;
}