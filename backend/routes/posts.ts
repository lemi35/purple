import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { validationResult } from "express-validator";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";

const prisma = new PrismaClient();
export const router = express.Router();
router.use(express.json());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, "upload_at_" + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });

interface PostParams {
	id: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - user_id
 *         - topic_id
 *       properties:
 *         post_id:
 *           type: number
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         user_id:
 *           type: number
 *         topic_id:
 *           type: number
 *         created_at:
 *           type: string
 *         upvotes:
 *           type: number
 *         downvotes:
 *           type: number
 *         image:
 *           type: string
 *       example:
 *         post_id: 1
 *         title: My First Post
 *         content: This is the content of my first post.
 *         user_id: 1
 *         topic_id: 1
 *         created_at: 2024-04-10T12:00:00Z
 *         upvotes: 0
 *         downvotes: 0
 *         image: upload_at_1615484162439.png
 */

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: API endpoints for managing posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", async (req: Request, res: Response) => {
	try {
		const posts = await prisma.post.findMany({
			include: {
				user: true,
				comments: true
			}
		});
		res.send(posts);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to get
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
	try {
		const post = await prisma.post.findUnique({
			where: {
				post_id: Number(req.params.id)
			}
		});
		if (post) {
			res.send(post);
		} else {
			res.status(404).send("Post not found");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - user_id
 *               - topic_id
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               user_id:
 *                 type: number
 *               topic_id:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.post("/", upload.single("image"), authenticationMiddleware, async (req, res) => {
	//console.log("=== POST /posts HANDLER REACHED ===");
	//console.log("Request body:", req.body);
	//console.log("User ID from auth:", req.id);
	//console.log("File:", req.file);

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Validation errors:", errors.array());
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		if (!req.body.topic_id) {
			console.log("ERROR: topic_id is missing");
			return res.status(400).send("topic_id is required");
		}

		console.log("Creating post with topic_id:", req.body.topic_id);

		const newPost = await prisma.post.create({
			data: {
				title: req.body.title,
				content: req.body.content,
				user: { connect: { id: Number(req.id) } },
				topic: { connect: { topic_id: Number(req.body.topic_id) } },
				image: req.file?.filename
			}
		});

		//console.log("Post created successfully:", newPost);
		res.json(newPost);
	} catch (error) {
		console.log("ERROR creating post:", error);
		res.status(500).send("Internal server error");
	}
});


/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - topic_id
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               topic_id:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.put("/:id", upload.single("image"), async (req: Request<{ id: string }>, res: Response) => {
	if (validationResult(req)) {
		try {
			const updatedPost = await prisma.post.update({
				where: {
					post_id: Number(req.params.id)
				},
				data: {
					title: req.body.title,
					content: req.body.content,
					topic_id: req.body.topic_id,
					image: req.file?.filename
				}
			});
			res.json(updatedPost);
		} catch (error) {
			console.log(error);
			res.status(404).send("Post not found");
		}
	} else {
		res.status(400).send("Invalid request body");
	}
});

/**
 * @swagger
 * /posts/{id}/vote:
 *   put:
 *     summary: Update upvotes and downvotes for a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to update votes for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               upvotes:
 *                 type: number
 *               downvotes:
 *                 type: number
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.put("/:id/vote", async (req: Request<{ id: string }>, res: Response) => {
	try {
		const { upvotes, downvotes } = req.body;
		const updatedPost = await prisma.post.update({
			where: {
				post_id: Number(req.params.id)
			},
			data: {
				upvotes: upvotes,
				downvotes: downvotes
			}
		});
		res.json(updatedPost);
	} catch (error) {
		console.log(error);
		res.status(404).send("Post not found");
	}
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: The deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.delete("/:id", authenticationMiddleware, async (req: Request<{ id: string }>, res: Response) => {
	//console.log(req.params.id)
	// 					//...(test && {post_id: Number(req.params.id)}),

	try {
		await prisma.comment.deleteMany({
			where: {
				post_id: Number(req.params.id)
			}
		});

		const deletedPost = await prisma.post.delete({
			where:
			{
				post_id: Number(req.params.id),
				...(req.role == "admin" ? {} : { user_id: req.id })

			}
		});

		res.send(deletedPost);
	} catch (error) {
		console.log(error);
		res.status(404).send("Post not found");
	}
});



module.exports = { router };

