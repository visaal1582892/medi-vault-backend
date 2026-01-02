import express from "express";

// Creating express router
const router=express.Router();

// Sub routes for auth
router.post("/sendOtp", sendOtp);
router.post("/verifyEmail", verifyEmail);
router.post("/register", register);
router.post("/login", login);