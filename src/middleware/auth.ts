import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Missing authentication token",
          error: "Unauthorized",
        });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;
      req.user = decoded;

      if (roles.length && roles.includes(decoded.role as string)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "Valid token but insufficient permissions",
          errors: "Forbidden",
        });
      }
    } catch (error: any) {
      if (error.message == "invalid signature") {
        res.status(401).json({
          success: false,
          message: "Invalid authentication token",
          errors: "Unauthorized",
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message,
          errors: "Internal Server Error",
        });
      }
    }
  };
};

export default auth;
