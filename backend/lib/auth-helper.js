import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  if (!password) throw new Error("Password is required");
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
