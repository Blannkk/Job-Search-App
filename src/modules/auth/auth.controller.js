import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { asyncHandler } from "../../utils/index.js";

const router = Router();

router.post(
  "/send-otp/:otp_type",
  isValid(authValidation.sendOtp),
  asyncHandler(authService.sendOtp)
);

router.post(
  "/register",
  isValid(authValidation.register),
  asyncHandler(authService.register)
);

router.post(
  "/login",
  isValid(authValidation.login),
  asyncHandler(authService.login)
);

router.post(
  "/google-login",
  isValid(authValidation.googleLogin),
  asyncHandler(authService.googleLogin)
);

router.post(
  "/refresh-token",
  isValid(authValidation.refreshToken),
  asyncHandler(authService.refreshToken)
);
router.post(
  "/reset-password",
  isValid(authValidation.resetPassword),
  asyncHandler(authService.resetPassword)
);

export default router;
