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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.router = express_1.default.Router();
exports.router.use(express_1.default.json());
/**
 * @swagger
 * components:
 *   schemas:
 *     Follow:
 *       type: object
 *       required:
 *         - follower_id
 *         - followed_user_id
 *       properties:
 *         follow_id:
 *           type: number
 *         follower_id:
 *           type: number
 *         followed_user_id:
 *           type: number
 *         created_at:
 *           type: string
 *       example:
 *         follow_id: 1
 *         follower_id: 1
 *         followed_user_id: 2
 *         created_at: 2024-05-03T09:32:32.787Z
 */
/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: API endpoints for managing follows
 */
/**
 * @swagger
 * /follows:
 *   post:
 *     summary: Create a new follow
 *     tags: [Follow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Follow'
 *     responses:
 *       201:
 *         description: The created follow
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Follow'
 *       500:
 *         description: Internal server error
 */
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follower_id, followed_user_id } = req.body;
        // Make sure that the user cannot follow themselves
        if (follower_id === followed_user_id) {
            return res.status(400).json({ error: "A user cannot follow themselves" });
        }
        const newFollow = yield prisma.follow.create({
            data: {
                follower_id,
                followed_user_id,
            },
        });
        res.status(201).json(newFollow);
    }
    catch (error) {
        console.error("Error creating follow:", error);
        res.status(500).json({ error: "Unable to create follow" });
    }
}));
/**
 * @swagger
 * /follows/{id}:
 *   delete:
 *     summary: Stop following a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the follow relationship to delete
 *     responses:
 *       200:
 *         description: The follow relationship has been deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Follow'
 *       404:
 *         description: Follow relationship not found
 *       500:
 *         description: Internal server error
 */
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followId = parseInt(req.params.id);
        const deletedFollow = yield prisma.follow.delete({
            where: {
                follow_id: followId,
            },
        });
        if (!deletedFollow) {
            return res.status(404).json({ error: "Follow relationship not found" });
        }
        res.status(200).json(deletedFollow);
    }
    catch (error) {
        console.error("Error deleting follow:", error);
        res.status(500).json({ error: "Unable to delete follow" });
    }
}));
/**
 * @swagger
 * /follows:
 *   get:
 *     summary: Get all follows
 *     tags: [Follow]
 *     responses:
 *       200:
 *         description: A list of follows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Follow'
 */
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const follows = yield prisma.follow.findMany();
        res.status(200).json(follows);
    }
    catch (error) {
        console.error("Error fetching follows:", error);
        res.status(500).json({ error: "Unable to fetch follows" });
    }
}));
/**
 * @swagger
 * /follows/userFollows/{userId}:
 *   get:
 *     summary: Get follows by user ID (followers)
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of follows for the specified user (followers)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Follow'
 *       500:
 *         description: Internal server error
 */
exports.router.get("/userFollows/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const userFollowers = yield prisma.follow.findMany({
            where: {
                followed_user_id: userId,
            },
        });
        res.status(200).json(userFollowers);
    }
    catch (error) {
        console.error("Error fetching user followers:", error);
        res.status(500).json({ error: "Unable to fetch user followers" });
    }
}));
/**
   * @swagger
   * /follows/userFollowing/{userId}:
   *   get:
   *     summary: Get follows by user ID (following)
   *     tags: [Follow]
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the user
   *     responses:
   *       200:
   *         description: A list of follows for the specified user (following)
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Follow'
   *       500:
   *         description: Internal server error
   */
exports.router.get("/userFollowing/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const userFollowing = yield prisma.follow.findMany({
            where: {
                follower_id: userId,
            },
        });
        res.status(200).json(userFollowing);
    }
    catch (error) {
        console.error("Error fetching user following:", error);
        res.status(500).json({ error: "Unable to fetch user following" });
    }
}));
module.exports = { router: exports.router };
