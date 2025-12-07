import express, { Request, Response } from "express";
import { ApiRoute } from "./api/api.routes";
import { initDb } from "./config/db";

const app = express();

app.use(express.json());

app.use("/api", ApiRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("This is server for vehicle rental made with love by Huzaifa");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

//initialize db
initDb();

export default app;
