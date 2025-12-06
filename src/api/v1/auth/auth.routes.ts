import { Router } from "express";
import { SignInRoute } from "./signin/signin.routes";
import { SignUpRoute } from "./signup/signup.routes";

const router = Router();

// singin route
router.use("/signin", SignInRoute);

// signup route
router.use("/signup", SignUpRoute);

export const AuthRoute = router;
