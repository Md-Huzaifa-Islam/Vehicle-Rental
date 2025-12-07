import { Router } from "express";
import { SignInControllers } from "./signin.controller";

const router = Router();

// singIn route
router.post("/", SignInControllers.SignIn);

export const SignInRoute = router;
