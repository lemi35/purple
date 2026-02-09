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
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const prisma = new client_1.PrismaClient();
exports.router = express_1.default.Router();
exports.router.use(express_1.default.json());
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - user_id
 *         - post_id
 *         - content
 *       properties:
 *         comment_id:
 *           type: number
 *         user_id:
 *           type: number
 *         post_id:
 *           type: number
 *         content:
 *           type: string
 *         created_at:
 *           type: string
 *       example:
 *         comment_id: 1
 *         user_id: 1
 *         post_id: 1
 *         content: This is a comment.
 *         created_at: 2024-05-03T09:32:32.787Z
 */
/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: API endpoints for managing comments
 */
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
exports.router.post("/", authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, post_id, content } = req.body;
        const newComment = yield prisma.comment.create({
            data: {
                user_id: Number(req.id),
                post_id: post_id,
                content: content,
            },
        });
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Unable to create comment" });
    }
}));
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield prisma.comment.findMany();
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Unable to fetch comments" });
    }
}));
/**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Get comments by user ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
exports.router.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const userComments = yield prisma.comment.findMany({
            where: {
                user_id: userId,
            },
        });
        res.status(200).json(userComments);
    }
    catch (error) {
        console.error("Error fetching user comments:", error);
        res.status(500).json({ error: "Unable to fetch user comments" });
    }
}));
/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
exports.router.get("/post/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.params.postId);
        const postComments = yield prisma.comment.findMany({
            where: {
                post_id: postId,
            },
        });
        res.status(200).json(postComments);
    }
    catch (error) {
        console.error("Error fetching post comments:", error);
        res.status(500).json({ error: "Unable to fetch post comments" });
    }
}));
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Get comments by comment ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
exports.router.delete("/:id", authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("req params", req.params.id)
    try {
        const postComments = yield prisma.comment.delete({
            where: Object.assign({ comment_id: Number(req.params.id) }, (req.role == "admin" ? {} : { user_id: req.id })),
        });
        res.status(200).json(postComments);
    }
    catch (error) {
        console.error("Error fetching post comments:", error);
        res.status(500).json({ error: "Unable to fetch post comments" });
    }
}));
module.exports = { router: exports.router };
