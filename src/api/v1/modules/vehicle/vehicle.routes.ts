import { Router } from "express";
import { VehicleControllers } from "./vehicle.controller";

const router = Router();

//vehicle create route
router.post("/", VehicleControllers.CreateVehicle);

//get all vechicles route
router.get("/", VehicleControllers.GetAllVehicles);

// get a single vehicle
router.get("/:vehicleId", VehicleControllers.GetAVehicleById);

//update a vehicle
router.put("/:vehicleId", VehicleControllers.UpdateVehicle);

//delete a vehicle
router.delete("/:vehicleId", VehicleControllers.DeleteVehicle);

export const VehicleRoute = router;
