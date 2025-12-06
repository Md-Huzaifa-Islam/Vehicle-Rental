import { Router } from "express";
import { SignUpControllers } from "./signup.controller";

const router = Router();

router.post("/", SignUpControllers.SignUpUser);

export const SignUpRoute = router;
