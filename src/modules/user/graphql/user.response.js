import { GraphQLList } from "graphql";
import { userType } from "./user.type.js";

export const getUsersResponse = new GraphQLList(userType);

export const banUsersResponse = userType;
export const UnbannedUsersResponse = userType;
