import { OTP } from "../../db/model/otp.model.js";
import { User } from "../../db/model/user.model.js";
import {
  compare,
  generateToken,
  hash,
  sendEmail,
  sendEmailEvent,
  verifyToken,
} from "../../utils/index.js";
import { messages } from "../../utils/messages/index.js";
import Randomstring from "randomstring";
import { OAuth2Client } from "google-auth-library";

export const sendOtp = async (req, res, next) => {
  const { otp_type } = req.params;
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (otp_type === "confirm-email" && user) {
    return next(new Error(messages.user.alreadyExists), {
      cause: 400,
    });
  }
  if (otp_type === "forgetPassword" && !user) {
    return next(
      new Error(messages.user.notFound, {
        cause: 404,
      })
    );
  }
  const code = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  sendEmailEvent.emit(
    "sendOtpEmail",
    email,
    otp_type,
    code
  );
  const hashedCode = hash(code, 10);
  await OTP.create({
    email,
    code: hashedCode,
    otp_type,
    expiresIn: new Date(Date.now() + 10 * 60 * 1000),
  });

  return res.status(200).json({
    success: true,
    message: messages.otp.created,
  });
};

export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    role,
    otp,
    gender,
    dob,
    profilePic,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !mobileNumber
  ) {
    return next(
      new Error(messages.user.fieldsAreRequired, {
        cause: 400,
      })
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new Error(messages.user.alreadyExists, {
        cause: 400,
      })
    );
  }

  const otpRecord = await OTP.findOne({
    email: email.toLowerCase(),
    otp_type: "confirm-email",
    expiresIn: { $gt: Date.now() },
  });

  if (!otpRecord) {
    return next(
      new Error(messages.otp.invalid, { cause: 400 })
    );
  }

  const isMatch = compare({
    Value: otp,
    hashedValue: otpRecord.code,
  });

  if (!isMatch) {
    return next(
      new Error(messages.otp.invalid, { cause: 400 })
    );
  }

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    role,
    otp: [
      { code: otpRecord.code, otp_type: "confirm-email" },
    ],
    gender,
    dob,
    profilePic,
    isConfirmed: true,
  });

  const isSent = await sendEmail({
    to: email,
    subject: "welcome to job search app",
    html: `<p>Your account has been successfully verified.</p>`,
  });

  if (!isSent) {
    return next(
      new Error(messages.email.notSent, { cause: 500 })
    );
  }

  return res.status(201).json({
    success: true,
    message: messages.user.created,
    data: createdUser,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("invalid credentials "), {
      cause: 401,
    });
  }

  const isPasswordMatch = compare({
    Value: password,
    hashedValue: user.password,
  });

  if (!isPasswordMatch) {
    return next(new Error("invalid credentials "), {
      cause: 401,
    });
  }
  if (user.isConfirmed == false) {
    return next(new Error("please activate your account"), {
      cause: 401,
    });
  }

  if (user.isDeleted == true) {
    await User.updateOne(
      { _id: user._id },
      { isDeleted: false }
    );
  }
  const accessToken = generateToken({
    payload: { id: user._id },
    Options: { expiresIn: "1h" },
  });

  const refreshToken = generateToken({
    payload: { id: user._id },
    Options: { expiresIn: "7d" },
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken,
    refreshToken,
  });
};

const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
};

export const googleLogin = async (req, res, next) => {
  const { idToken } = req.body;
  const { email, name, picture } = await verifyGoogleToken(
    idToken
  );
  // console.log(email, name, picture);

  let userExist = await User.findOne({ email });
  // console.log(user);
  if (!userExist) {
    userExist = await User.create({
      userName: name,
      email,
      profilePic: picture,
      provider: "google",
      isConfirmed: true,
    });
    const accessToken = generateToken({
      payload: { id: userExist._id },
      Options: { expiresIn: "1h" },
    });
    const refreshToken = generateToken({
      payload: { id: userExist._id },
      Options: { expiresIn: "7d" },
    });
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    });
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new Error("refresh token is required"));
  }

  const result = verifyToken({ token: refreshToken });
  if (result.error) {
    return next(result.message);
  }
  const user = await User.findById(result.id);
  if (!user) {
    return next(
      new Error("User not found", { cause: 404 })
    );
  }

  const issuedAt = new Date(result.iat * 1000);
  if (user.changeCredentialsAt > issuedAt) {
    return next(
      new Error(
        "Token is expired due to credential change",
        { cause: 401 }
      )
    );
  }
  await user.updateOne({
    changeCredentialsAt: new Date(),
  });

  const accessToken = generateToken({
    payload: { id: result.id },
    Options: { expiresIn: "1h" },
  });
  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken,
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if ((!email, !otp, !newPassword)) {
    return next(
      new Error(messages.user.fieldsAreRequired, {
        cause: 400,
      })
    );
  }

  const otpRecord = await OTP.findOne({
    email,
    otp_type: "reset-password",
    expiresIn: { $gt: Date.now() },
  });
  console.log(otpRecord.code);

  if (!otpRecord) {
    return next(
      new Error(messages.otp.invalid, { cause: 400 })
    );
  }

  const isMatch = compare(otp, otpRecord.code);
  if (!isMatch) {
    return next(
      new Error(messages.otp.invalid, { cause: 400 })
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new Error(messages.user.notFound, {
        cause: 404,
      })
    );
  }
  user.password = newPassword;
  user.changeCredentialsAt = Date.now();
  await user.save();

  return res.status(200).json({
    success: true,
    message: messages.user.passwordChanged,
  });
};
