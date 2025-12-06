import { Request, Response } from "express";
import { pool } from "../../../../config/db";

const SignUpUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO users(name, email ,password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
      [name, email, password, phone, role]
    );
    if (result.rows && result.rows.length > 0) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result.rows[0],
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to registere user",
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const SignUpControllers = { SignUpUser };
