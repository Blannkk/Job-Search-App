import { application, Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../utils/enums/index.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as jobValidation from "./job.validation.js";
import * as jobService from "./job.service.js";
import { asyncHandler } from "../../utils/index.js";
import applicationRouter from "../application/application.controller.js";

const router = Router({
  mergeParams: true,
});

router.use("/:jobId/applications", applicationRouter);

/**
 * @route   POST /job
 * @desc    Create job
 * @access  Private
 */
router.post(
  "/",
  isAuthenticated,
  isAuthorized(roles.OWNER, roles.HR),
  isValid(jobValidation.createJob),
  asyncHandler(jobService.createJob)
);
router.get(
  "/:id?",
  isAuthenticated,
  isAuthorized(roles.USER),
  isValid(jobValidation.getJobs),
  asyncHandler(jobService.getJobs)
);

/**
 * @route   PUT /job/:id
 * @desc    Update job
 * @access  Private
 * @params  id => job id
 */
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized(roles.OWNER, roles.HR),
  isValid(jobValidation.updateJob),
  asyncHandler(jobService.updateJob)
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(roles.HR),
  isValid(jobValidation.deleteJob),
  asyncHandler(jobService.deleteJob)
);

router.get(
  "/:filter?",
  isAuthenticated,
  asyncHandler(jobService.getJobs)
);

export default router;
