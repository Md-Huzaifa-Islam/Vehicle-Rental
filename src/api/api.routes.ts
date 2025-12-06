import { Request, Response, Router } from "express";
import { v1ApiRoute } from "./v1/v1.routes";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("This is api route");
});

// route versioning
router.use("/v1", v1ApiRoute);

export const ApiRoute = router;
