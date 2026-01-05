import { generateOtpAndHash, sendVerificationMail } from "../helpers/auth-helpers.js"
import { createEmailVerification, getExistingEmailVerificationDetails, updateEmailVerification } from "../repository/auth-repository.js";
import AppError from "../utilities/app-error.js";

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
    else{
        await createEmailVerification(userEmail, otpAndHash.otpHash)
    }

    await sendVerificationMail(userEmail, otpAndHash.otp);
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