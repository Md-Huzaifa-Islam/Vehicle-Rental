import { Router } from "express";
import { BookingControllers } from "./booking.controller";
import auth from "../../../middleware/auth";

const router = Router();

// post a booking route
router.post("/", auth("admin", "customer"), BookingControllers.createBooking);

// get all bookings
router.get("/", auth("admin", "customer"), BookingControllers.getBookings);

// update a booking
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  BookingControllers.updateBooking
);

export const BookingRoute = router;
