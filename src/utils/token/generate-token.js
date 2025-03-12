import jwt from "jsonwebtoken";
export const generateToken = ({
  payload,
  secretKey = process.env.JWT_SECRET_KEY,
  Options = {},
}) => {
  return jwt.sign(payload, secretKey, Options);
};
