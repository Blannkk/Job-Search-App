import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../utils/enums/index.js";
import {
  cloudUpload,
  fileValidation,
} from "../../utils/file-upload/multer-cloud.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as applicationValidation from "./application.validation.js";
import * as applicationService from "./application.service.js";
import { asyncHandler } from "../../utils/index.js";

const router = Router({
  mergeParams: true,
});

// router.use("/:jobId/applications", jobRouter);

router.post(
  "/apply",
  isAuthenticated,
  isAuthorized(roles.USER),
  cloudUpload(fileValidation.files).single("cv"),
  isValid(applicationValidation.applyForJob),
  asyncHandler(applicationService.applyForJob)
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized(roles.OWNER, roles.HR),
  isValid(applicationValidation.getApplications),
  asyncHandler(applicationService.getApplications)
);

router.patch(
  "/:applicationId/status",
  isAuthenticated,
  isAuthorized(roles.OWNER, roles.HR),
  // isValid(applicationValidation.acceptOrRejectApplication),
  asyncHandler(applicationService.acceptOrRejectApplication)
);
export default router;
