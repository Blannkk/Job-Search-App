import { getCompanies } from "./company.service.graphql.js";
import { getCompaniesResponse } from "./company.response.js";

export const companyQuery = {
  getCompanies: {
    type: getCompaniesResponse,
    resolve: getCompanies,
  },
};
