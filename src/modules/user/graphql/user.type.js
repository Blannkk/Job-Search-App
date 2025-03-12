import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { attachmentType } from "../../../utils/graphql/attachment.type.js";
import { otpType } from "../../../utils/graphql/otp.type.js";

export const userType = new GraphQLObjectType({
  name: "user",
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    provider: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
    bannedAt: { type: GraphQLString },

    changeCredentialsAt: { type: GraphQLString },
    profilePic: {
      type: attachmentType,
    },
    coverPic: {
      type: attachmentType,
    },
    otp: {
      type: new GraphQLList(otpType),
    },
    isDeleted: {
      type: GraphQLBoolean,
    },
    bannedAt: {
      type: GraphQLString,
    },
    bannedByAdmin: { type: GraphQLBoolean },
    bannedBy: {
      type: GraphQLID,
    },
  },
});
