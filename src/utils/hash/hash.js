import bcrypt from "bcrypt";
export const hash = (value, saltRound) => {
  return bcrypt.hashSync(value, saltRound);
};
