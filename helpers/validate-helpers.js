import AppError from "../utilities/app-error.js";

export const isEmpty = (input) => {
    return input=='undefined' || input==undefined || input==null || input=="";
}

export const validateEmail = (email) => {
    if(isEmpty(email)) throw new AppError(400, "Email is mandatory field");
    if(email.length<5 || email.length>100) throw new AppError(400, "Email size must be between 5 and 100");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError(400, "Enter valid email");
}

export const validateUsername = (username) => {
    if(isEmpty(username)) throw new AppError(400, "Username is mandatory field");
    if(username.length<3 || username.length>100) throw new AppError(400, "Username size must be between 3 and 100");;
    if(!/^(?=.{3,100}$)[a-zA-Z][a-zA-Z0-9._ ]*$/.test(username)) throw new AppError(400, "Enter vaid username");
}

export const validatePassword = (password) => {
    if(isEmpty(password)) throw new AppError(400, "Password cannot be empty");
    if(password.length<5 || password.length>100) throw new AppError(400, "Username size must be between 3 and 100");
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/.test(password)) throw new AppError(400, "Enter strong password");
}

export const validateConfirmPassword = (confirmPassword, password) => {
    if(confirmPassword!=password) throw new AppError(400, "Confirm passowrd must be same as password");
}

export const validateOtp = (otp) => {
    if(isEmpty(otp)) throw new AppError(400, "Otp is a mandatory field");
    if(!/^\d{6}$/.test(otp)) throw new AppError(400, "Enter valid otp");
}