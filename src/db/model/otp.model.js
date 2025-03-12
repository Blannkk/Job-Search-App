import mongoose, { Schema } from "mongoose";

//otp schema
const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp_type: {
    type: String,
    enum: ["confirm-email", "reset-password"],
  },
  code: {
    type: String,
  },
  expiresIn: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});
otpSchema.index(
  { destroyedAt: 1 },
  { expireAfterSeconds: 600 }
);

//otp model
export const OTP = mongoose.model("otp", otpSchema);
