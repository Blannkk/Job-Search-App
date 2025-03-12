import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createJob = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().required(),
    workingTime: joi.string().required(),
    seniorityLevel: joi.string().required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi
      .array()
      .items(joi.string())
      .required(),
    softSkills: joi.array().items(joi.string()).required(),
    company: generalFields.id.required(),
  })
  .required();

export const updateJob = joi
  .object({
    id: generalFields.id,
    jobTitle: joi.string(),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .required();

/**
 * @param {string} jobId
 */
export const deleteJob = joi
  .object({
    jobId: generalFields.id,
  })
  .required();

export const getJobs = joi.object({
  id: generalFields.id,
});
