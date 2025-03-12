import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { companyQuery } from "./modules/company/graphql/company.query.js";
import { userQuery } from "./modules/user/graphql/user.query.js";
import { companyMutation } from "./modules/company/graphql/company.mutation.js";
import { userMutation } from "./modules/user/graphql/user.mutaion.js";

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    /**
     * all users
     * all companies
     *
     */
    ...companyQuery,
    ...userQuery,
  },
});
const mutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    /**
     * all users
     * all companies
     *
     */
    ...companyMutation,
    ...userMutation,
    // ...userQuery,
  },
});

export const schema = new GraphQLSchema({
  query,
  mutation,
});
