import { pool } from "../../../../config/db";
import bcrypt from "bcryptjs";
const SignUpUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users(name, email ,password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [name, email, hashPassword, phone, role]
  );
  return result;
};

export const SignUpServices = {
  SignUpUser,
};
