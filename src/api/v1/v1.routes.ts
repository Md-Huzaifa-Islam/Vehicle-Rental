import { Request, Response, Router } from "express";
import { AuthRoute } from "./auth/auth.routes";
import { BookingRoute } from "./booking/booking.routes";
import { UserRoute } from "./user/user.routes";
import { VehicleRoute } from "./vehicle/vehicle.routes";

const router = Router();

//auth routes
router.use("/auth", AuthRoute);

// api routes
router.use("/users", UserRoute);

// vehicle routes
router.use("/vehicles", VehicleRoute);

// booking routes
router.use("/bookings", BookingRoute);

export const v1ApiRoute = router;
