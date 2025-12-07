import { Router } from "express";
import { VehicleControllers } from "./vehicle.controller";
import auth from "../../../middleware/auth";

const router = Router();

//vehicle create route
router.post("/", auth("admin"), VehicleControllers.CreateVehicle);

//get all vechicles route
router.get("/", VehicleControllers.GetAllVehicles);

// get a single vehicle
router.get("/:vehicleId", VehicleControllers.GetAVehicleById);

//update a vehicle
router.put("/:vehicleId", auth("admin"), VehicleControllers.UpdateVehicle);

//delete a vehicle
router.delete("/:vehicleId", auth("admin"), VehicleControllers.DeleteVehicle);

export const VehicleRoute = router;
