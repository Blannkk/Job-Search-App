import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const applyForJob = joi
  .object({
    jobId: generalFields.id,
    cv: generalFields.attachment,
    userId: generalFields.id,
  })
  .required();

export const getApplications = joi
  .object({
    jobId: generalFields.id,
    userId: generalFields.id,
  })
  .required();
