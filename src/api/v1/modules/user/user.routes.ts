import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

//get all users
router.get("/", userControllers.getAllUsers);

// update user data
router.put("/:userId", userControllers.UpdateUser);

// delete a user
router.delete("/:userId", userControllers.deleteUser);

export const UserRoute = router;
