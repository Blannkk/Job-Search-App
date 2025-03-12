export const notFound = (req, res, next) => {
  return next(new Error("Invalid url", { cause: 404 }));
};
