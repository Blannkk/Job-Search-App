import {
  Company,
  defaultLogoPublicId,
  defaultLogoSecureUrl,
} from "../../db/model/company.model.js";
import { messages } from "./../../utils/messages/index.js";
import cloudinary from "./../../utils/file-upload/cloud-config.js";

export const createCompany = async (req, res, next) => {
  // const{id} = req.user
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs,
  } = req.body;

  const companyExists = await Company.findOne({
    companyName,
    companyEmail,
  });

  if (companyExists) {
    return next(
      new Error(messages.company.alreadyExists, {
        cause: 400,
      })
    );
  }

  const company = await Company.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    createdBy: req.user._id,
    HRs,
  });

  return res.status(201).json({
    success: true,
    messages: messages.company.created,
    data: company,
  });
};
export const uploadLegalAttachment = async (
  req,
  res,
  next
) => {
  const { id } = req.user;

  const company = await Company.findOne({ createdBy: id });
  if (!company) {
    return next(
      new Error(messages.company.notFound, {
        cause: 404,
      })
    );
  }

  const { secure_url, public_id } =
    await cloudinary.uploader.upload(req.file.path, {
      folder: `JobSearchApp/companies/${company.id}/legalAttachment`,
    });

  company.legalAttachment = {
    secure_url,
    public_id,
  };
  company.updatedBy = id;
  await company.save();

  return res.status(200).json({
    success: true,
    messages: messages.company.updated,
    data: company,
  });
};
export const updateCompany = async (req, res, next) => {
  const { id, role } = req.user;

  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    logo,
    coverPic,
    HRs,
  } = req.body;

  const company = await Company.findOne({ createdBy: id });
  if (!company) {
    return next(
      new Error(messages.company.notFound, {
        cause: 404,
      })
    );
  }

  const isOwner =
    company.createdBy.toString() === id.toString();

  if (!isOwner && role !== "admin") {
    return next(
      new Error(
        "You are not authorized to update this company",
        {
          cause: 401,
        }
      )
    );
  }

  company.companyName = companyName || company.companyName;

  company.description = description || company.description;
  company.industry = industry || company.industry;
  company.address = address || company.address;
  company.numberOfEmployees =
    numberOfEmployees || company.numberOfEmployees;
  company.companyEmail =
    companyEmail || company.companyEmail;
  company.logo = logo || company.logo;
  company.coverPic = coverPic || company.coverPic;
  company.HRs = HRs || company.HRs;

  company.updatedBy = id;

  await company.save();

  return res.status(200).json({
    success: true,
    messages: messages.company.updated,
    data: company,
  });
};
export const deleteCompany = async (req, res, next) => {
  const { id, role } = req.user;

  const company = await Company.findOne({
    createdBy: id,
    isDeleted: false,
  });
  if (!company) {
    return next(
      new Error(messages.company.notFound, {
        cause: 404,
      })
    );
  }

  const isOwner =
    company.createdBy.toString() === id.toString();

  if (!isOwner && role !== "admin") {
    return next(
      new Error(
        "You are not authorized to delete this company",
        {
          cause: 401,
        }
      )
    );
  }

  company.deletedAt = new Date();
  company.isDeleted = true;
  await company.save();

  return res.status(200).json({
    success: true,
    messages: messages.company.deleted,
    data: company,
  });
};

export const searchCompany = async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(
      new Error(messages.company.fieldsAreRequired, {
        cause: 400,
      })
    );
  }
  const companies = await Company.find({
    companyName: { $regex: name, $options: "i" },
    isDeleted: false,
  });
  if (!companies || companies.length === 0) {
    return next(
      new Error(messages.company.notFound, {
        cause: 404,
      })
    );
  }
  return res.status(200).json({
    success: true,
    messages: messages.company.fetched,
    data: companies,
  });
};

export const uploadCompanyLogoOrCover = async (
  req,
  res,
  next
) => {
  const { id } = req.user;
  const { pic_type } = req.params;

  const company = await Company.findOne({ createdBy: id });
  if (!company) {
    return next(
      new Error(messages.company.notFound, { cause: 404 })
    );
  }

  let folderPath = `JobSearchApp/companies/${company.id}/Logo`;
  let updateField = "logo";

  if (pic_type === "cover-pic") {
    folderPath = `JobSearchApp/companies/${company.id}/CoverPic`;
    updateField = "coverPic";
  } else if (pic_type !== "logo") {
    return next(
      new Error("Invalid logo type", { cause: 400 })
    );
  }

  if (
    company[updateField] &&
    company[updateField].public_id
  ) {
    await cloudinary.uploader.destroy(
      company[updateField].public_id
    );
  }

  const { secure_url, public_id } =
    await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
    });

  company[updateField] = { secure_url, public_id };
  company.updatedBy = id;

  await company.save();
  return res.status(200).json({
    success: true,
    messages: messages.company.updated,
    data: company,
  });
};
export const deleteLogoOrCover = async (req, res, next) => {
  const { id } = req.user;

  const company = await Company.findOne({ createdBy: id });
  if (!company) {
    return next(
      new Error(messages.company.notFound, { cause: 404 })
    );
  }

  let folderPath = `JobSearchApp/companies/${company.id}/Logo`;
  let deletedField = "logo";

  if (req.params.pic_type === "cover-pic") {
    folderPath = `JobSearchApp/companies/${company.id}/CoverPic`;
    deletedField = "coverPic";
  } else if (req.params.pic_type !== "logo") {
    return next(
      new Error("Invalid logo type", { cause: 400 })
    );
  }

  if (
    company[deletedField] &&
    company[deletedField].public_id
  ) {
    await cloudinary.uploader.destroy(
      company[deletedField].public_id
    );
  }

  company[deletedField] = {
    secure_url: defaultLogoSecureUrl,
    public_id: defaultLogoPublicId,
  };

  company.updatedBy = id;
  await company.save();
  return res.status(200).json({
    success: true,
    messages: messages.company.deleted,
  });
};
