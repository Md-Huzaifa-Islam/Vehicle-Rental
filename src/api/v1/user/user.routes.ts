import { Router } from "express";
import auth from "../../../middleware/auth";
import { UserControllers } from "./user.controller";

const router = Router();

//get all users
router.get("/", auth("admin"), UserControllers.getAllUsers);

// update user data
router.put("/:userId", auth("admin", "customer"), UserControllers.UpdateUser);

// delete a user
router.delete("/:userId", auth("admin"), UserControllers.deleteUser);

export const UserRoute = router;
