import { pool } from "../../../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../../config/config";

const SignIn = async (email: string, password: string) => {
  const formatttedEmail = email.trim().toLowerCase();
  const result = await pool.query(` SELECT * FROM users WHERE email=$1`, [
    formatttedEmail,
  ]);
  if (result.rows.length == 0) {
    return {
      status: 404,
      message: "User not found",
      errors: "Not Found",
    };
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return {
      status: 400,
      message: "You have entered incorrect password",
      errors: "Bad Request",
    };
  }
  // everything is ok now lets send token also
  const payLoad = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  const token = jwt.sign(payLoad, config.jwt_secret as string, {
    expiresIn: "7d",
  });
  return {
    status: 200,
    token,
    user: payLoad,
  };
};

export const SignInServices = {
  SignIn,
};
