import { getUsersResponse } from "./user.response.js";
import { getUsers } from "./user.service.graphql.js";

export const userQuery = {
  getUsers: {
    type: getUsersResponse,
    resolve: getUsers,
  },
};
