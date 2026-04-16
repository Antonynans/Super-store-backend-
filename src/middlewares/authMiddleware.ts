import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate: RequestHandler = asyncHandler(
  async (req: any, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : cookieToken;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token.");
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || "access_secret",
      ) as { userId: string };

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, token invalid.");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  },
);

const authorizeAdmin: RequestHandler = (req: any, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

export { authenticate, authorizeAdmin };
