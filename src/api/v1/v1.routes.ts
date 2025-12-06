import { Request, Response, Router } from "express";
import { UserRoute } from "./modules/user/user.routes";
import { AuthRoute } from "./auth/auth.routes";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("This is v1 api route");
});

//auth routes
router.use("/auth", AuthRoute);

// api routes
router.use("/users", UserRoute);

export const v1ApiRoute = router;
