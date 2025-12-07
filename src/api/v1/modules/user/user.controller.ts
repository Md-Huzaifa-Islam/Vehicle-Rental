import { Request, Response } from "express";
import { UserServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsers();
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const filteredUpdates = Object.entries(updates).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    const result = await UserServices.updateUser(
      Number(userId),
      filteredUpdates
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await UserServices.deleteUser(Number(userId));
    if (result.rowCount && result.rowCount == 1)
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        dataforme: result,
      });
    else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UserControllers = {
  getAllUsers,
  UpdateUser,
  deleteUser,
};
