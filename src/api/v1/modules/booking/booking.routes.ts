import { Router } from "express";
import { BookingControllers } from "./booking.controller";

const router = Router();

// post a booking route
router.post("/", BookingControllers.createBooking);

// get all bookings
router.get("/", BookingControllers.getBookings);

// update a booking
// router.put('/:bookingId',)

export const BookingRoute = router;
