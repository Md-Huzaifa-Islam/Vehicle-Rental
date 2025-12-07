import { Request, Response } from "express";
import { SignInServices } from "./singin.service";

const SignIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await SignInServices.SignIn(email, password);
    if (result.status == 200) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token: result.token,
          user: result.user,
        },
      });
    } else {
      res.status(result.status).json({
        success: false,
        message: result.message,
        errors: result.errors,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: "Internal Server Error",
    });
  }
};

export const SignInControllers = {
  SignIn,
};
