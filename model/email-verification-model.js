import mongoose from "mongoose"

const EmailVerificationSchema=mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is a mandatory field"],
        minLegth: [5, "Email must contain atleast 5 characters"],
        maxLength: [100, "Email size cannot exceed 100 characters"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please provide a valid email address"]
    },
    otpHash: {
        type: String,
        required: [true, "Otp hash is a mandatory field"],
        minLegth: [6, "Otp hash value must be of atleast 6 characters"]
    },
    otpGeneratedTime: {
        type: Date,
        required: [true, "Otp Generated Time is a mandatory field"]
    },
    isVerified: {
        type: Boolean,
        required: [true, "Is verified is a mandatory field"]
    },
    lastVerifiedTime: {
        type: Date,
    }
})

const EmailVerification=mongoose.model("EmailVerification", EmailVerificationSchema);
export default EmailVerification;