import { User } from "../db/model/user.model.js";
import { verifyToken } from "../utils/index.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, no token provided",
      });
    }
    if (!authorization.startsWith("Bearer"))
      return res.status(401).json({
        success: false,
        message: "Unauthorized, invalid barer token",
      });
    const token = authorization.split(" ")[1];
    const result = verifyToken({ token });

    if (result.error) return next(result.error);

    const userExist = await User.findById(result.id);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userExist.isDeleted === true) {
      return next(
        new Error(
          "User account is deleted or freezed, login first to continue ",
          { cause: 400 }
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

    req.user = userExist;
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};
