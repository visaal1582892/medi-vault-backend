import { generateOtpAndHash, sendVerificationMail } from "../helpers/auth-helpers.js"
import { createEmailVerification, getExistingEmailVerificationDetails } from "../repository/auth-repository.js";

export const sendOtpService = async (userEmail) => {
    const existingDbDetails = await getExistingEmailVerificationDetails(userEmail);
    if (existingDbDetails) {
        const { email, otpHash, otpGeneratedTime, isVerified, lastVerifiedTime } = existingDbDetails;
        // if(otpGeneratedTime>new Date()+1*60*1000)
    }
    const otpAndHash = await generateOtpAndHash();
    await createEmailVerification(userEmail, otpAndHash.otpHash)
    await sendVerificationMail(userEmail, otpAndHash.otp);
}

export const getEmailVerificationDetailsService = async (existingEmail) => {
    const existingDbDetails = await getExistingEmailVerificationDetails(existingEmail);
    if(!existingDbDetails) return null;
    const { email, otpHash, otpGeneratedTime, isVerified, lastVerifiedTime } = existingDbDetails;
    return {
        email, otpHash, otpGeneratedTime, isVerified, lastVerifiedTime
    };
}