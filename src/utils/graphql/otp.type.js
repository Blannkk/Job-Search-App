import { GraphQLObjectType, GraphQLString } from "graphql";

export const otpType = new GraphQLObjectType({
  name: "OTP",
  fields: {
    code: { type: GraphQLString },
    otp_type: { type: GraphQLString },
    expiresIn: { type: GraphQLString },
  },
});
