import EmailVerification from "../model/email-verification-model.js";
import User from "../model/user-model.js";
import AppError from "../utilities/app-error.js";

// Function to create email verification row
export const createEmailVerification = (email, otpHash) => {
    return EmailVerification.create({
        email: email,
        otpHash: otpHash,
        otpGeneratedTime: new Date(),
        isVerified: false
    }).catch((err) => {
        // Duplicate key error (unique index)
        if (err.code === 11000) {
            throw new AppError(409, "Email already exists");
        }

        // Mongoose validation error
        if (err.name === "ValidationError") {
            throw new AppError(400, "Invalid data provided");
        }

        // Fallback
        throw new AppError(500, "Database operation failed");
    })
}

// Function to update data data by email
export const updateEmailVerification = async (email, updatedData) => {
    try {
        const updated = await EmailVerification.findOneAndUpdate({ email }, { $set: updatedData }, { new: true });
        if (!updated) {
            throw new AppError(404, "Existing data for email not found");
        }
        return updated;
    } catch (err) {
        // Mongoose validation error
        if (err.name === "ValidationError") {
            throw new AppError(400, "Invalid data provided");
        }

        // Fallback
        throw new AppError(500, "Database operation failed");
    }
}

// Function to get existing email verfication details
export const getExistingEmailVerificationDetails = (email) => {
    return EmailVerification.findOne({ email: email });
}

// Function to create user row
export const createUser = (registerData) => {
    return User.create(registerData)
        .catch((err) => {
            // Duplicate key error (unique index)
            if (err.code === 11000) {
                throw new AppError(409, "Email already exists");
            }

            // Mongoose validation error
            if (err.name === "ValidationError") {
                throw new AppError(400, "Invalid data provided");
            }

            // Fallback
            throw new AppError(500, "Database operation failed");
        })
}

export const getUserDetails = (email) => {
    return User.findOne({email});
}