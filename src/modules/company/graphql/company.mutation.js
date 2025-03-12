import {
  approveCompany,
  banCompany,
  unbannedCompany,
} from "./company.service.graphql.js";
import {
  approveCompanyResponse,
  banCompanyResponse,
  unbannedCompanyResponse,
} from "./company.response.js";
import { GraphQLID, GraphQLNonNull } from "graphql";

export const companyMutation = {
  approveCompany: {
    type: approveCompanyResponse,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: approveCompany,
  },

  bannedCompany: {
    type: banCompanyResponse,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: banCompany,
  },

  unbannedCompany: {
    type: unbannedCompanyResponse,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: unbannedCompany,
  },
};
