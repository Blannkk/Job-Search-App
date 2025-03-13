import { Company } from "../../../db/model/company.model.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";

export const getCompanies = async (_, args, context) => {
  console.log(context);

  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);

  const companies = await Company.find({
    approvedByAdmin: true,
  })
    .populate({
      path: "createdBy",
      select: "firstName lastName userName email _id",
    })
    .populate({
      path: "HRs",
      select: "firstName lastName userName email _id",
    });
  return {
    success: true,
    data: companies,
  };
};

export const approveCompany = async (_, args, context) => {
  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);

  const approvedCompany = await Company.findByIdAndUpdate(
    { _id: args._id },
    {
      approvedByAdmin: true,
    },
    { new: true }
  );

  return approvedCompany;
};
export const banCompany = async (_, args, context) => {
  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);

  const bannedCompany = await Company.findByIdAndUpdate(
    { _id: args._id },
    {
      bannedAt: Date.now(),
      rejectedByAdmin: true,
      approvedByAdmin: false,
    },
    { new: true }
  );

  return bannedCompany;
};
export const unbannedCompany = async (_, args, context) => {
  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);

  const unbanned = await Company.findByIdAndUpdate(
    { _id: args._id },
    {
      bannedAt: 0,
      rejectedByAdmin: false,
      approvedByAdmin: true,
    },
    { new: true }
  );

  return unbanned;
};
