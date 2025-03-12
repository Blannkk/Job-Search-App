import { GraphQLList } from "graphql";
import { companyType } from "./company.type.js";

export const getCompaniesResponse = new GraphQLList(
  companyType
);

export const approveCompanyResponse = companyType;
export const banCompanyResponse = companyType;
export const unbannedCompanyResponse = companyType;
