import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const router = express.Router();
const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

// --- Helper functions ---
const generateAccessToken = (user: { name: string; id: number; role: string | null }) =>
  jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = async (user: { name: string; id: number; role: string | null }) => {
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "1h" });
  const tokenExpires = new Date();
  tokenExpires.setHours(tokenExpires.getHours() + 1);

  await prisma.user.update({
    where: { username: user.name },
    data: { token: refreshToken, tokenExpire: tokenExpires }
  });

  return refreshToken;
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Username already exists or missing fields
 *       500:
 *         description: Server error
 */


// --- REGISTER ---
router.post("/register", async (req, res) => {
  console.log("REGISTER BODY:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const userExists = await prisma.user.findFirst({ where: { username } });

    if (userExists) {
      return res.status(400).json({ message: "This username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "user",
        profileText: "profile text",
        profileImage: "url to profile image"
      }
    });

    return res.status(201).json(newUser);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */



// --- LOGIN ---
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Username and password required");

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).send("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send("Incorrect password");

    const tokenData = { name: user.username, id: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenData);
    const refreshToken = await generateRefreshToken(tokenData);

    // --- Set cookies for cross-origin ---
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min
      path: "/"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/"
    });

    res.json({
      message: "Login successful",
      username: user.username,
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// --- REFRESH TOKEN ---
router.post("/token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).send("No refresh token");

  try {
    const user = await prisma.user.findFirst({ where: { token: refreshToken } });
    if (!user) return res.status(403).send("Invalid refresh token");

    if (new Date() > new Date(user.tokenExpire ?? 0)) {
      return res.status(403).send("Refresh token expired");
    }

    const tokenData = { name: user.username, id: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenData);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/"
    });

    res.json({ message: "New access token generated" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// --- LOGOUT ---
router.post("/logout", (req, res) => {
  console.log("Logged out user:", req.user);

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    expires: new Date(0)
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    expires: new Date(0)
  });

  res.status(200).json({ message: "Logout successful" });
});
