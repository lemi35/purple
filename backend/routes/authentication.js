"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       example:
 *         username: string
 *         password: string
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 * /auth/register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 * /auth/token:
 *   post:
 *     summary: Get a new access token if your refresh token is valid.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: string
 *               token: string
 *             example:
 *               username: username you used to log in
 *               token: insert your REFRESH token here (you can get it by logging in)
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       401:
 *         description: Some server error
 */
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    if (req.body.username == null || req.body.password == null) {
        res.status(500).send();
    }
    */
    try {
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const userExists = yield prisma.user.findFirst({
            where: {
                username: req.body.username,
            },
        });
        if (userExists != null) {
            return res.status(400).json({
                message: "This username already exists"
                });
        }
        const prismaUser = yield prisma.user.create({
            data: {
                username: req.body.username,
                password: hashedPassword,
                role: "user",
                profileText: "profile text",
                profileImage: "url to profile image",
            },
        });
        console.log(`Created a new user: ${req.body.username} `);
        res.status(200).send(prismaUser);
    }
    catch (error) {
        res.status(500).send();
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=== LOGIN REQUEST RECEIVED ===");
    console.log("Username:", req.body.username);
    console.log("Password provided:", !!req.body.password);
    const prismaUser = yield prisma.user.findUnique({
        where: {
            username: req.body.username,
        },
    });
    if (prismaUser == null) {
        console.log("User not found:", req.body.username);
        return res.status(400).send("Cannot find user");
    }
    console.log("User found, comparing passwords...");
    try {
        if (yield bcrypt_1.default.compare(req.body.password, prismaUser.password)) {
            console.log("Password correct! Generating tokens...");
            console.log("prismauser", prismaUser);
            const user = { name: prismaUser.username, id: prismaUser.id, role: prismaUser.role };
            if (process.env.ACCESS_TOKEN_SECRET) {
                console.log("ACCESS_TOKEN_SECRET exists, generating tokens...");
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                //const accessToken = generateAccessToken(user);
                const refreshToken = yield generateRefreshToken(user);
                console.log("Tokens generated, setting cookies...");


                res.cookie("accessToken", accessToken, {
                httpOnly: true,
  		        secure: process.env.NODE_ENV === "production", // only HTTPS in production
                sameSite: "none",  // required for Pages → Render
                maxAge: 15 * 60 * 1000
                });
                res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
  		        secure: process.env.NODE_ENV === "production", // only HTTPS in production
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
                });


                res.cookie("username", req.body.username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
                res.cookie("role", prismaUser.role, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
                console.log("Sending success response...");
                res.json({ accessToken: accessToken, refreshToken: refreshToken, username: prismaUser.username, role: prismaUser.role });
            }
            else {
                console.log("ERROR: Access token is not defined");
                res.status(500).send("Server configuration error");
            }
        }
        else {
            console.log("Password incorrect");
            res.send("Incorrect password");
        }
    }
    catch (error) {
        console.log("ERROR in login:", error);
        res.json(error);
    }
}));
const generateAccessToken = (user) => {
    if (process.env.ACCESS_TOKEN_SECRET)
        return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        console.log("missing REFRESH_TOKEN_SECRET");
        return;
    }
    const refreshToken = jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET);
    //const prismaUser = await prisma.users.findUnique({where: {username: user}});
    const tokenExpires = new Date(new Date());
    tokenExpires.setHours(tokenExpires.getHours() + 1);
    tokenExpires.toISOString();
    try {
        const prismaUser = yield prisma.user.update({
            where: {
                username: user.name
            },
            data: {
                token: refreshToken,
                tokenExpire: tokenExpires
            }
        });
        return prismaUser.token;
    }
    catch (error) {
        console.log(error);
    }
});
router.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.sendStatus(403);
    }
    try {
        const prismaUser = yield prisma.user.findUnique({
            where: {
                username: req.body.username
            }
        });
        if (prismaUser && prismaUser.tokenExpire) {
            if (new Date() < prismaUser.tokenExpire) {
                const user = { name: req.body.username, id: prismaUser.id, role: prismaUser.role };
                const accessToken = generateAccessToken(user);
                res.json({ accessToken: accessToken });
            }
            else {
                return res.status(403).send("Your token has expired, please login to get a new token");
            }
        }
        else {
            return res.status(403).send("Invalid token, please login to get a new token");
        }
    }
    catch (error) {
        console.log(error);
    }
}));

export default router;
