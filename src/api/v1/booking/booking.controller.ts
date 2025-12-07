import { Request, Response } from "express";
import { BookingServices } from "./booking.service";
import { VehicleServices } from "../vehicle/vehicle.service";
import { UserServices } from "../user/user.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    if (req.user && req.user.role == "customer" && req.user.id != customer_id) {
      res.status(403).json({
        success: false,
        message: "Valid token but insufficient permissions",
        errors: "Forbidden",
      });
    }

    // code to get the vehicle
    const vehicleResult = await VehicleServices.GetAVehicleById(
      Number(vehicle_id)
    );
    if (!vehicleResult.rows || !(vehicleResult.rows.length == 1))
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
        errors: "Not Found",
      });
    if (vehicleResult.rows[0].availability_status == "booked") {
      res.status(400).json({
        success: false,
        message: "Vehicle already booked",
        errors: "Bad Request",
      });
    }

    // code to get the user
    const userResult = await UserServices.getUser(Number(customer_id));
    if (!userResult.rows || !(userResult.rows.length == 1))
      res.status(404).json({
        success: false,
        message: "User not found",
        errors: "Not Found",
      });

    // verify date
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (startDate >= endDate) {
      res.status(400).json({
        success: false,
        message: "End date must be after start date",
        errors: "Bad Request",
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
      res.status(500).json({
        success: false,
        message: "Failed to create bookings",
        errors: "Internal Server Error",
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

const getBookings = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user && req.user.role === "admin" ? true : false;
    const userId = req.user && req.user.id;
    const result = await BookingServices.getBookings(isAdmin, Number(userId));
    if (!result.rows || result.rows.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: "Internal Server Error",
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // Validate status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
        errors: "Bad Request",
      });
    }

    // Get booking details
    const bookingResult = await BookingServices.getBookingById(
      Number(bookingId)
    );

    if (!bookingResult.rows || bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
        errors: "Not Found",
      });
    }

    const booking = bookingResult.rows[0];

    // Role-based logic
    if (userRole === "customer") {
      // Customer can only cancel bookings
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customers can only cancel bookings",
          errors: "Forbidden",
        });
      }

      // Customer can only cancel their own booking
      if (booking.customer_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Valid token but insufficient permissions",
          errors: "Forbidden",
        });
      }

      // Check if booking start date is in the future
      const currentDate = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (currentDate >= startDate) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel booking after start date",
          errors: "Bad Request",
        });
      }

      // Cancel booking
      const result = await BookingServices.updateBooking(
        Number(bookingId),
        status
      );

      // Update vehicle availability
      await VehicleServices.UpdateVehicle(booking.vehicle_id, {
        availability_status: "available",
      });

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result.rows[0],
      });
    } else if (userRole === "admin") {
      // Admin can only mark booking as "returned"
      if (status !== "returned") {
        return res.status(403).json({
          success: false,
          message: "Admins can only mark bookings as returned",
          errors: "Forbidden",
        });
      }

      // Mark booking as returned
      const result = await BookingServices.updateBooking(
        Number(bookingId),
        status
      );

      // Update vehicle availability
      const vehicleUpdateResult = await VehicleServices.UpdateVehicle(
        booking.vehicle_id,
        {
          availability_status: "available",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...result.rows[0],
          vehicle: {
            availability_status:
              vehicleUpdateResult.rows[0].availability_status,
          },
        },
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
        errors: "Forbidden",
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

export const BookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
