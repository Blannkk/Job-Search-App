import { Router } from "express";
import { isAuthenticated } from "./../../middleware/auth.middleware.js";
import { isAuthorized } from "./../../middleware/authorization.middleware.js";
import { roles } from "../../utils/enums/index.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as CompanyValidation from "./company.validation.js";
import * as CompanyService from "./company.service.js";
import {
  cloudUpload,
  fileValidation,
} from "../../utils/file-upload/multer-cloud.js";
import { asyncHandler } from "../../utils/index.js";
import { fileUpload } from "../../utils/file-upload/multer.js";
import jobRouter from "../job/job.controller.js";

const router = Router();

router.use("/:companyId/jobs", jobRouter);

router.post(
  "/",
  isAuthenticated,
  isAuthorized(roles.OWNER),
  isValid(CompanyValidation.createCompany),
  CompanyService.createCompany
);
router.post(
  "/legal-attachment",
  isAuthenticated,
  isAuthorized(roles.OWNER),
  cloudUpload(fileValidation.images).single(
    "legalAttachment"
  ),
  isValid(CompanyValidation.uploadLegalAttachment),
  CompanyService.uploadLegalAttachment
);

router.put(
  "/",
  isAuthenticated,
  isAuthorized(roles.OWNER, roles.ADMIN),
  isValid(CompanyValidation.updateCompany),
  asyncHandler(CompanyService.updateCompany)
);
router.delete(
  "/",
  isAuthenticated,
  isAuthorized(roles.OWNER),
  asyncHandler(CompanyService.deleteCompany)
);
router.delete(
  "/media/:pic_type",
  isAuthenticated,
  isAuthorized(roles.OWNER),
  isValid(CompanyValidation.deleteLogoOrCover),
  asyncHandler(CompanyService.deleteLogoOrCover)
);

router.get(
  "/search-by-name",
  isAuthenticated,
  // isAuthorized(roles.USER),
  isValid(CompanyValidation.searchCompany),
  asyncHandler(CompanyService.searchCompany)
);

router.post(
  "/media/:pic_type",
  isAuthenticated,
  isAuthorized(roles.OWNER),
  fileUpload(fileValidation.images).single("image"),
  isValid(CompanyValidation.uploadCompanyLogoOrCover),
  asyncHandler(CompanyService.uploadCompanyLogoOrCover)
);

export default router;
