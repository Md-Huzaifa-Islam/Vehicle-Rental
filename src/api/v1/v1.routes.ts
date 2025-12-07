import { Request, Response, Router } from "express";
import { UserRoute } from "./modules/user/user.routes";
import { AuthRoute } from "./auth/auth.routes";
import { VehicleRoute } from "./modules/vehicle/vehicle.routes";
import { BookingRoute } from "./modules/booking/booking.routes";

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
