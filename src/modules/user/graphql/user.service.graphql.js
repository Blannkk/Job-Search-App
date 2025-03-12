import { User } from "../../../db/model/user.model.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";

export const getUsers = async (_, args, context) => {
  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);
  const users = await User.find().select("-password  ");

  return users;
};

export const banUser = async (_, args, context) => {
  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);

  const bannedUser = await User.findByIdAndUpdate(
    { _id: args._id },
    {
      bannedAt: Date.now(),
      bannedByAdmin: true,
    },
    { new: true }
  ).select("-password  ");

  return bannedUser;
};
export const unbannedUser = async (_, args, context) => {
  await isAuthenticated(context);
  isAuthorized(context, ["admin"]);

  const unbannUser = await User.findByIdAndUpdate(
    { _id: args._id },
    {
      bannedAt: 0,
      bannedByAdmin: false,
      bannedBy: context.id,
    },
    { new: true }
  ).select("-password  ");

  return unbannUser;
};
