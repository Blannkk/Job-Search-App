import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../utils/enums/index.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/index.js";
import {
  fileUpload,
  fileValidation,
} from "../../utils/file-upload/multer.js";
import { cloudUpload } from "../../utils/file-upload/multer-cloud.js";

const router = Router();

router.put(
  "/profile",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(userValidation.updateProfile),
  asyncHandler(userService.updateProfile)
);

router.get(
  "/profile",
  isAuthenticated,
  isAuthorized(roles.USER),
  asyncHandler(userService.getMyProfile)
);

router.patch(
  "/change-password",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(userValidation.changePassword),
  asyncHandler(userService.changePassword)
);

router.post(
  "/profile/:pic_type",
  isAuthenticated,
  cloudUpload(fileValidation.images).single("image"),
  asyncHandler(userService.uploadProfileOrCoverPicCloud)
);

router.delete(
  "/profile/:pic_type",
  isAuthenticated,
  isValid(userValidation.deleteProfileOrCoverPic),
  asyncHandler(userService.deleteProfilePic)
);
// router.delete(
//   "/cover-pic",
//   isAuthenticated,
//   // isValid(userValidation.deleteProfileOrCoverPic),
//   asyncHandler(userService.deleteCoverPic)
// );

router.delete(
  "/freeze-account",
  isAuthenticated,
  asyncHandler(userService.freezeAccount)
);

router.get(
  "/profile/:id",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(userValidation.getProfile),
  asyncHandler(userService.getProfile)
);

export default router;
