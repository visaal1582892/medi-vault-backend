import { generateOtpAndHash, sendVerificationMail, createVerificationToken } from "../helpers/auth-helpers.js"
import { createEmailVerification, getExistingEmailVerificationDetails, updateEmailVerification } from "../repository/auth-repository.js";
import AppError from "../utilities/app-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const sendOtpService = async (userEmail) => {
    const otpAndHash = await generateOtpAndHash();
    const existingDbDetails = await getExistingEmailVerificationDetails(userEmail);
    if (existingDbDetails) {
        const { isVerified, lastVerifiedTime } = existingDbDetails;
        if (isVerified && (new Date(lastVerifiedTime).getTime() + 60 * 60 * 1000) > Date.now()) {
            throw new AppError(400, "Email already verified");
        }
        else {
            await updateEmailVerification(userEmail, {
                otpHash: otpAndHash.otpHash,
                otpGeneratedTime: new Date(),
                isVerified: false
            })
        }
    }
    else {
        await createEmailVerification(userEmail, otpAndHash.otpHash)
    }

    await sendVerificationMail(userEmail, otpAndHash.otp);
}

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
    if (!existingEmail || existingEmail == "") return null;
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
    if (verificationToken === "undefined") {
        throw new AppError(400, "Token provided is empty");
    }
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

