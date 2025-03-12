import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { attachmentType } from "../../../utils/graphql/attachment.type.js";
import { User } from "../../../db/model/user.model.js";
import { userType } from "../../user/graphql/user.type.js";

export const companyType = new GraphQLObjectType({
  name: "company",
  fields: {
    companyName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    industry: {
      type: GraphQLString,
    },
    address: {
      type: GraphQLString,
    },
    numberOfEmployees: {
      type: GraphQLString,
    },
    companyEmail: {
      type: GraphQLString,
    },
    createdBy: {
      type: userType,
      resolve: async (parent) => {
        const user = await User.findById(parent.createdBy);
        return user;
      },
    },
    logo: { type: attachmentType },
    coverPic: { type: attachmentType },
    HRs: { type: new GraphQLList(userType) },
    bannedAt: {
      type: GraphQLString,
    },
    isDeleted: {
      type: GraphQLBoolean,
    },
    deletedAt: {
      type: GraphQLBoolean,
    },
    createdBy: {
      type: userType,
    },
    legalAttachment: { type: attachmentType },
    approvedByAdmin: {
      type: GraphQLBoolean,
    },
    rejectedByAdmin: {
      type: GraphQLBoolean,
    },
  },
});
