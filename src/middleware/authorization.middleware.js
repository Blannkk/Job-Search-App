export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error(
          "You are not authorized to access this route",
          {
            cause: 401,
          }
        )
      );
    }
    return next();
  };
};
