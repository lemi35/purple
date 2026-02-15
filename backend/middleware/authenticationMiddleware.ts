import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateAccessToken = (user: { name: string; id: number; role?: string | null }) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET not set");
  }

  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log("Cookies:", req.cookies);
  console.log("Access token:", req.cookies.accessToken);

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token" });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as any;

    req.id = decoded.id;
    req.user = decoded.name;
    req.role = decoded.role;

    return next();
  } catch (error) {
    console.log("Access token invalid or expired");

    // 🔁 Try refresh token
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    try {
      const user = await prisma.user.findFirst({
        where: { token: refreshToken },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken({
        name: user.username,
        id: user.id,
        role: user.role,
      });

      // ✅ Set NEW access token cookie (IMPORTANT: proper options)
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
  		secure: process.env.NODE_ENV === "production", // only HTTPS in production
        sameSite: "none",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });

      req.user = user.username;
      req.id = user.id;
      req.role = user.role || undefined;

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Refresh failed" });
    }
  }
};
