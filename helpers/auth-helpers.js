import crypto from "crypto";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
import AppError from "../utilities/app-error.js";
configDotenv();

// send otp and create otp row helpers
export const generateOtpAndHash = async () => {
    try {
        const otp = crypto.randomInt(100000, 1000000);
        const otpHash = await bcrypt.hash(otp.toString(), 10);
        return {
            otp: otp,
            otpHash: otpHash
        };
    } catch (error) {
        throw new AppError(500, "Failed to generate otp");
    }
}

export const sendVerificationMail = (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.FROM_EMAIL_APP_PASSWORD
        }
    });
    return transporter.sendMail({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Medi Vault Email Verification OTP",
        html: `<div style="font-family: Arial, Helvetica, sans-serif; color:#111827;">

  <!-- App Name -->
  <h1 style="margin-bottom: 8px; color:#0f172a;">
    MEDI VAULT
  </h1>

  <hr style="border:none; border-top:1px solid #e5e7eb; margin-bottom:16px;" />

  <p>Hello,</p>

  <p>
    Your One-Time Password (OTP) for email verification is:
  </p>

  <h2 style="letter-spacing: 4px; margin: 16px 0;">
    ${otp}
  </h2>

  <p>
    This OTP is valid for <strong>10 minutes</strong>.
  </p>

  <p>
    Please do not share this OTP with anyone.
  </p>

  <p>
    If you did not request this, you can safely ignore this email.
  </p>

  <p>
    Thanks,<br />
    <strong>Medi Vault Team</strong>
  </p>

</div>
`
    }).catch((error) => {
        throw new AppError(500, "Failed to send verification email");
    })
}

