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
exports.topicsRouter = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.router = express_1.default.Router();
exports.topicsRouter = exports.router;
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "topic_at_" + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
exports.router.use(express_1.default.json());
/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         topic_id:
 *           type: number
 *         title:
 *           type: string
 *         created_at:
 *           type: string
 *       example:
 *         topic_id: 1
 *         title: General Discussion
 *         created_at: 2024-04-10T12:00:00Z
 */
/**
 * @swagger
 * tags:
 *   name: Topic
 *   description: API endpoints for managing topics
 */
/**
 * @swagger
 * /topics:
 *   get:
 *     summary: Get all topics
 *     tags: [Topic]
 *     responses:
 *       200:
 *         description: A list of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 */
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.query.title)
    if (!req.query.title) {
        try {
            const topics = yield prisma.topic.findMany({
                include: {
                    owner: true,
                    posts: {
                        include: {
                            user: true
                        }
                    }
                },
            });
            res.send(topics);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Internal server error");
        }
    }
    else {
        try {
            const topics = yield prisma.topic.findMany({
                where: {
                    title: req.query.title
                },
                include: {
                    owner: true,
                    posts: {
                        include: {
                            user: true
                        }
                    }
                },
            });
            console.log(topics);
            res.send(topics);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Internal server error");
        }
    }
}));
/**
 * @swagger
 * /topics/{id}:
 *   get:
 *     summary: Get a topic by ID
 *     tags: [Topic]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the topic to get
 *     responses:
 *       200:
 *         description: A single topic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 */
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield prisma.topic.findUnique({
            where: { topic_id: Number(req.params.id) },
        });
        if (topic) {
            res.send(topic);
        }
        else {
            res.status(404).send("Topic not found");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}));
/**
 * @swagger
 * /topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topic]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       200:
 *         description: The created topic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       500:
 *         description: Internal server error
 */
exports.router.post("/", upload.single("image"), authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //console.log(req.id, req.user)
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newTopic = yield prisma.topic.create({
            data: {
                title: req.body.title,
                ownerId: Number(req.id),
                image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                description: req.body.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac massa et nulla feugiat iaculis. Donec tellus sapien, molestie vel massa vitae, scelerisque eleifend urna",
            },
        });
        res.json(newTopic);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}));
/**
 * @swagger
 * /topics/{id}:
 *   put:
 *     summary: Update a topic by ID
 *     tags: [Topic]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the topic to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Topic'
 *     responses:
 *       200:
 *         description: The updated topic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 */
exports.router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedTopic = yield prisma.topic.update({
            where: { topic_id: Number(req.params.id) },
            data: { title: req.body.name },
        });
        res.json(updatedTopic);
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Topic not found");
    }
}));
/**
 * @swagger
 * /topics/{id}:
 *   delete:
 *     summary: Delete a topic by ID
 *     tags: [Topic]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the topic to delete
 *     responses:
 *       200:
 *         description: The deleted topic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 */
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTopic = yield prisma.topic.delete({
            where: Object.assign({ topic_id: Number(req.params.id) }, (req.role == "admin" ? {} : { ownerId: req.id })),
        });
        res.send(deletedTopic);
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Topic not found");
    }
}));
