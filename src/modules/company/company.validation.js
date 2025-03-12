import { generalFields } from "./../../middleware/validation.middleware.js";
import joi from "joi";

export const createCompany = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.string().required(),
    companyEmail: joi.string().email().required(),
    HRs: joi.array().items(generalFields.id),
  })
  .required();

export const uploadLegalAttachment = joi.object({
  legalAttachment: generalFields.attachment,
});
export const updateCompany = joi
  .object({
    companyName: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string(),
    companyEmail: joi.string().email(),
    HRs: joi.array().items(generalFields.id),
  })
  .required();
export const searchCompany = joi
  .object({
    name: joi.string(),
  })
  .required();

export const uploadCompanyLogoOrCover = joi
  .object({
    pic_type: joi.string().valid("logo", "cover-pic"),
  })
  .required();

export const deleteLogoOrCover = joi
  .object({
    pic_type: joi.string().valid("logo", "cover-pic"),
  })
  .required();
