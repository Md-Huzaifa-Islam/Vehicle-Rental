import "./config/config";
import { config } from "./config/config";
import express, { Request, Response } from "express";
import { initDb } from "./config/db";
import { ApiRoute } from "./api/api.routes";

const app = express();

app.use(express.json());

app.use("/api", ApiRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("This is server for vehicle rental");
});

//initialize db
initDb();

app.listen(config, () => {
  console.log("the server is running on port:", config.port);
});
