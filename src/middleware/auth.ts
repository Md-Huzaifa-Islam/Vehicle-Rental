import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Missing authentication token",
          error: "Unauthorized",
        });
      }
      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;
      req.user = decoded;
      if (roles.length && roles.includes(decoded.role as string)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "Valid token but insufficient permissions",
          error: "Forbidden",
        });
      }
    } catch (error: any) {
      if (error.message == "invalid signature") {
        res.status(401).json({
          success: false,
          message: "Invalid authentication token",
          error: "Unauthorized",
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message,
          error: "Internal Server Error",
        });
      }
    }
  };
};

export default auth;
