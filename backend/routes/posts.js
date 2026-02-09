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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const prisma = new client_1.PrismaClient();
exports.router = express_1.default.Router();
exports.router.use(express_1.default.json());
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "upload_at_" + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
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
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            include: {
                user: true,
                comments: true
            }
        });
        res.send(posts);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}));
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
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield prisma.post.findUnique({
            where: {
                post_id: Number(req.params.id)
            }
        });
        if (post) {
            res.send(post);
        }
        else {
            res.status(404).send("Post not found");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}));
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
exports.router.post("/", upload.single("image"), authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("=== POST /posts HANDLER REACHED ===");
    //console.log("Request body:", req.body);
    //console.log("User ID from auth:", req.id);
    //console.log("File:", req.file);
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
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
        const newPost = yield prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                user: { connect: { id: Number(req.id) } },
                topic: { connect: { topic_id: Number(req.body.topic_id) } },
                image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename
            }
        });
        //console.log("Post created successfully:", newPost);
        res.json(newPost);
    }
    catch (error) {
        console.log("ERROR creating post:", error);
        res.status(500).send("Internal server error");
    }
}));
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
exports.router.put("/:id", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((0, express_validator_1.validationResult)(req)) {
        try {
            const updatedPost = yield prisma.post.update({
                where: {
                    post_id: Number(req.params.id)
                },
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    topic_id: req.body.topic_id,
                    image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename
                }
            });
            res.json(updatedPost);
        }
        catch (error) {
            console.log(error);
            res.status(404).send("Post not found");
        }
    }
    else {
        res.status(400).send("Invalid request body");
    }
}));
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
exports.router.put("/:id/vote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { upvotes, downvotes } = req.body;
        const updatedPost = yield prisma.post.update({
            where: {
                post_id: Number(req.params.id)
            },
            data: {
                upvotes: upvotes,
                downvotes: downvotes
            }
        });
        res.json(updatedPost);
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Post not found");
    }
}));
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
exports.router.delete("/:id", authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.id)
    // 					//...(test && {post_id: Number(req.params.id)}),
    try {
        yield prisma.comment.deleteMany({
            where: {
                post_id: Number(req.params.id)
            }
        });
        const deletedPost = yield prisma.post.delete({
            where: Object.assign({ post_id: Number(req.params.id) }, (req.role == "admin" ? {} : { user_id: req.id }))
        });
        res.send(deletedPost);
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Post not found");
    }
}));
module.exports = { router: exports.router };
