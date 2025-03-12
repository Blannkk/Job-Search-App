import { GraphQLID, GraphQLNonNull } from "graphql";
import { banUsersResponse } from "./user.response.js";
import {
  banUser,
  unbannedUser,
} from "./user.service.graphql.js";

export const userMutation = {
  banUser: {
    type: banUsersResponse,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: banUser,
  },
  unbannedUser: {
    type: banUsersResponse,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: unbannedUser,
  },
};
