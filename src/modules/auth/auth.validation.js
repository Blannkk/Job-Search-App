import joi from "joi";

export const sendOtp = joi
  .object({
    email: joi.string().email().required(),
    otp_type: joi
      .string()
      .valid("confirm-email", "reset-password"),
  })
  .required();

export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    newPassword: joi.string().required(),
  })
  .required();

export let register = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    mobileNumber: joi.string().required(),
    password: joi.string().required(),
    role: joi.string(),
    gender: joi.string(),
    dob: joi.string(),
    otp: joi.string().required(),
  })
  .required();

export let login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const googleLogin = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();

export const refreshToken = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();
