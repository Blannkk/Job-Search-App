import { User } from "../../db/model/user.model.js";
import { verifyToken } from "../../utils/index.js";

export const authSocket = async (socket, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(
        new Error("Unauthorized, no token provided")
      );
    }
    if (!authorization.startsWith("Bearer"))
      return next(
        new Error("Unauthorized, invalid barer token")
      );
    const token = authorization.split(" ")[1];
    const result = verifyToken({ token });

    if (result.error) return next(result.error);

    const userExist = await User.findById(result.id);
    if (!userExist) {
      return next(new Error("User not found"));
    }

    if (userExist.isDeleted === true) {
      return next(
        new Error(
          "User account is deleted or freezed, login first to continue "
        )
      );
    }

    if (
      userExist.deletedAt?.getTime() >
      result.iat * 1000
    ) {
      return next(
        new Error("destroyed token", { cause: 401 })
      );
    }

    socket.user = userExist;
    socket.id = userExist.id;
    return next();
  } catch (error) {
    return next(error);
  }
};
