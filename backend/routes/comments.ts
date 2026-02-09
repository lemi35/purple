import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";

const prisma = new PrismaClient();
export const router = express.Router();

router.use(express.json());

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
router.post("/", authenticationMiddleware, async (req, res) => {
	try {
		const { user_id, post_id, content } = req.body;
		const newComment = await prisma.comment.create({
			data: {
				user_id: Number(req.id),
				post_id: post_id,
				content: content,
			},

		});
		res.status(201).json(newComment);
	} catch (error) {
		console.error("Error creating comment:", error);
		res.status(500).json({ error: "Unable to create comment" });
	}
});

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
router.get("/", async (req, res) => {
	try {
		const comments = await prisma.comment.findMany();
		res.status(200).json(comments);
	} catch (error) {
		console.error("Error fetching comments:", error);
		res.status(500).json({ error: "Unable to fetch comments" });
	}
});

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
router.get("/user/:userId", async (req, res) => {
	try {
		const userId = parseInt(req.params.userId);
		const userComments = await prisma.comment.findMany({
			where: {
				user_id: userId,
			},
		});
		res.status(200).json(userComments);
	} catch (error) {
		console.error("Error fetching user comments:", error);
		res.status(500).json({ error: "Unable to fetch user comments" });
	}
});

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
router.get("/post/:postId", async (req, res) => {
	try {
		const postId = parseInt(req.params.postId);
		const postComments = await prisma.comment.findMany({
			where: {
				post_id: postId,
			},
		});
		res.status(200).json(postComments);
	} catch (error) {
		console.error("Error fetching post comments:", error);
		res.status(500).json({ error: "Unable to fetch post comments" });
	}
});


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

router.delete("/:id", authenticationMiddleware, async (req, res) => {
	//console.log("req params", req.params.id)
	try {
		const postComments = await prisma.comment.delete({
			where: {
				comment_id: Number(req.params.id),
				...(req.role == "admin" ? {} : { user_id: req.id })
			},
		});
		res.status(200).json(postComments);
	} catch (error) {
		console.error("Error fetching post comments:", error);
		res.status(500).json({ error: "Unable to fetch post comments" });
	}
});

module.exports = { router };
