import { Request, Response } from "express";
import { BookingServices } from "./booking.service";
import { VehicleServices } from "../vehicle/vehicle.service";
import { UserServices } from "../user/user.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    // code to get the vehicle
    const vehicleResult = await VehicleServices.GetAVehicleById(
      Number(vehicle_id)
    );
    if (!vehicleResult.rows || !(vehicleResult.rows.length == 1))
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    if (vehicleResult.rows[0].availability_status == "booked") {
      res.status(400).json({
        success: false,
        message: "Vehicle already booked",
      });
    }

    // code to get the user
    const userResult = await UserServices.getUser(Number(customer_id));
    if (!userResult.rows || !(userResult.rows.length == 1))
      res.status(404).json({
        success: false,
        message: "User not found",
      });

    // verify date
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (startDate >= endDate) {
      res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const diffTime = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // book the vehicle
    const result = await BookingServices.createBooking(
      Number(customer_id),
      Number(vehicle_id),
      startDate,
      endDate,
      totalDays * Number(vehicleResult.rows[0].daily_rent_price),
      "active"
    );

    const statusChangeVehicle = await VehicleServices.UpdateVehicle(
      Number(vehicle_id),
      { availability_status: "booked" }
    );

    if (
      result.rows &&
      result.rows.length == 1 &&
      statusChangeVehicle.rows &&
      statusChangeVehicle.rows.length == 1
    ) {
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          ...result.rows[0],
          vehicle: {
            vehicle_name: vehicleResult.rows[0].vehicle_name,
            daily_rent_price: Number(vehicleResult.rows[0].daily_rent_price),
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create bookings",
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await BookingServices.getBookings();
    if (!result.rows || result.rows.length == 0) {
      res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const BookingControllers = {
  createBooking,
  getBookings,
};
