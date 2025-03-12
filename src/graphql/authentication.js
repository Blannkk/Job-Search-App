import { User } from "../db/model/user.model.js";
import { verifyToken } from "../utils/index.js";

export const isAuthenticated = async (context) => {
  const { authorization } = context;

  if (!authorization)
    throw new Error("token is required", { cause: 400 });

  if (!authorization.startsWith("Bearer"))
    throw new Error("invalid bearer token", { cause: 400 });

  const token = authorization.split(" ")[1];
  const result = verifyToken({ token });

  // if (result.error) return next(result.error);

  const userExist = await User.findById(result.id);
  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }

  if (userExist.isDeleted === true) {
    throw new Error("user is deleted or not found", {
      cause: 400,
    });
  }

  if (userExist.deletedAt?.getTime() > result.iat * 1000) {
    throw new Error("destroyed token", { cause: 401 });
  }

  context.user = userExist;
};
