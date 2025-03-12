import bcrypt from "bcrypt";
export const compare = ({ Value, hashedValue }) => {
  return bcrypt.compareSync(Value, hashedValue);
};
