import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { BookingServices } from "../booking/booking.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      errors: "Internal Server Error",
      message: error.message,
    });
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (req.user && req.user.role === "customer" && userId != req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Valid token but insufficient permissions",
        errors: "Forbidden",
      });
    }

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
        message: "User Not Found",
        errors: "Not Found",
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
      errors: "Internal Server Error",
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const bookingResult = await BookingServices.getBookingsForUser(
      Number(userId)
    );

    if (bookingResult.rows && bookingResult.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: "Can not delete user who have active bookings",
        errors: "Bad Request",
      });
    }

    const result = await UserServices.deleteUser(Number(userId));
    if (result.rowCount && result.rowCount == 1)
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    else {
      res.status(404).json({
        success: false,
        message: "User not found",
        errors: "Not Found",
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

export const UserControllers = {
  getAllUsers,
  UpdateUser,
  deleteUser,
};
