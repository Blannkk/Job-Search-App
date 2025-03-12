export const isAuthorized = (context, roles) => {
  if (!roles.includes(context.user.role)) {
    throw new Error(
      "You are not authorized to access this route",
      { cause: 401 }
    );
  }
};
