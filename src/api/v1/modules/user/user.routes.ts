import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router();

//get all users
router.get("/", UserControllers.getAllUsers);

// update user data
router.put("/:userId", UserControllers.UpdateUser);

// delete a user
router.delete("/:userId", UserControllers.deleteUser);

export const UserRoute = router;
