import { Request, Response } from "express";
import { VehicleServices } from "./vehicle.service";
import { BookingServices } from "../booking/booking.service";

const CreateVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  try {
    const result = await VehicleServices.CreateVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    if (result.rows && result.rows.length === 1) {
      res.status(201).json({
        success: true,
        message: "Vehicle created successfully",
        data: result.rows[0],
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create vehicle",
      });
    }
  } catch (error: any) {
    if (
      (error.message =
        'duplicate key value violates unique constraint "vehicles_registration_number_key"')
    ) {
      res.status(400).json({
        success: false,
        message: "You can not create vehicle with same registration number. ",
        errors: "Bad Request",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      errors: "Internal Server Error",
    });
  }
};

const GetAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await VehicleServices.GetAllVehicles();
    if (result.rows && result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
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

const GetAVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await VehicleServices.GetAVehicleById(Number(vehicleId));
    if (result.rows && result.rows.length == 1) {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found",
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

const UpdateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
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

    const result = await VehicleServices.UpdateVehicle(
      Number(vehicleId),
      filteredUpdates
    );

    if (result.rows && result.rows.length === 1) {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    } else
      [
        res.status(404).json({
          success: false,
          message: "Vehicle Not found",
          errors: "Not Found",
        }),
      ];
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: "Internal Server Error",
    });
  }
};

const DeleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const bookingResult = await BookingServices.getBookingsForVehicles(
      Number(vehicleId)
    );

    if (bookingResult.rows && bookingResult.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: "You can not delete a vehicle if it has active bookings",
        errors: "Bad Request",
      });
    }

    const result = await VehicleServices.DeleteVehicle(Number(vehicleId));
    if (result.rowCount && result.rowCount == 1) {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found",
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

export const VehicleControllers = {
  CreateVehicle,
  GetAllVehicles,
  GetAVehicleById,
  UpdateVehicle,
  DeleteVehicle,
};
