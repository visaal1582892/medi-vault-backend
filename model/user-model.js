import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is a mandatory field"],
        minLegth: [5, "Email must contain atleast 5 characters"],
        maxLength: [100, "Email size cannot exceed 100 characters"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
    },
    username: {
        type: String,
        trim: true,
        required: [true, "Username is a mandatory field"],
        minLength: [3, "Username must contain atleast 3 characters"],
        maxLength: [100, "Username size cannot exceed 100 characters"],
        match: [/^(?=.{3,100}$)[a-zA-Z][a-zA-Z0-9._ ]*$/, "Enter valid username"]
    },
    password: {
        type: String,
        required: [true, "Password is mandatory field"],
        minLegth: [5, "Password must be atleast 5 characters"],
        // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/, "Enter strong password"]
    }
});

const User = mongoose.model("User", UserSchema);
export default User;