import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateProfile = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    mobileNumber: joi.string(),
    dob: joi.string().optional(),
    gender: joi.string(),
  })
  .required();

/**
 * @param {string} id
 */
export const getProfile = joi
  .object({
    id: generalFields.id,
  })
  .required();

// /**
//  * @param {string} id
//  */
// export const deleteProfileOrCoverPic = joi
//   .object({
//     pic_type: joi
//       .string()
//       .valid("profile-pic", "cover-pic"),
//   })
//   .required();

export const changePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
  })
  .required();

export const deleteProfileOrCoverPic = joi
  .object({
    pic_type: joi
      .string()
      .valid("profile-pic", "cover-pic"),
  })
  .required();
