import { Response } from "express";
import jwt from "jsonwebtoken";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const createToken = (res: Response, userId: string): AuthTokens => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET || "access_secret",
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    {
      expiresIn: "7d",
    },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export default createToken;
