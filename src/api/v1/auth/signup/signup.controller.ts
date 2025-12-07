import { Request, Response } from "express";
import { SignUpServices } from "./signup.service";

const SignUpUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  if (password.trim().length < 6) {
    res.status(400).json({
      success: false,
      message: "Password must be minimum 6 character length",
      error: "Bad Request",
    });
  }
  try {
    const result = await SignUpServices.SignUpUser(
      name,
      email.trim().toLowerCase(),
      password,
      phone,
      role
    );
    if (result.rows && result.rows.length > 0) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to registere user",
        error: "Internal Server Error",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

export const SignUpControllers = { SignUpUser };
