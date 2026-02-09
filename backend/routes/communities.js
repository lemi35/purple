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
exports.communityRouter = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.router = express_1.default.Router();
exports.communityRouter = exports.router;
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "community_at_" + Date.now() + path_1.default.extname(file.originalname));
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
 *         community_id:
 *           type: number
 *         title:
 *           type: string
 *         created_at:
 *           type: string
 *       example:
 *         community_id: 1
 *         title: Title
 *         created_at: 2024-04-10T12:00:00Z
 */
/**
 * @swagger
 * tags:
 *   name: Community
 *   description: API endpoints for managing community
 */
/**
 * @swagger
 * /communities:
 *   get:
 *     summary: Get all communities
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: A list of communities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Community'
 */
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const communityName = req.query.name as string | undefined;
    try {
        const communities = yield prisma.community.findMany({
            include: {
                topics: {
                    include: {
                        posts: { include: { user: true } }
                    }
                }
            }
        });
        res.json(communities);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const community = yield prisma.community.findUnique({
            where: {
                community_id: Number(req.params.id),
            },
            include: {
                topics: {
                    include: {
                        posts: {
                            include: {
                                user: { select: { username: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!community) {
            return res.status(404).send("Community not found");
        }
        res.json(community);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
}));
/**
 *
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
/**
 * @swagger
 * /communities:
 *   post:
 *     summary: Create a new community
 *     tags: [Community]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Community'
 *     responses:
 *       200:
 *         description: The created community
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Community'
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
        const newCommunity = yield prisma.community.create({
            data: {
                name: req.body.title,
                image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
                description: req.body.description || "Community description here.",
            },
        });
        res.json(newCommunity);
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
        const updatedCommunity = yield prisma.community.update({
            where: { community_id: Number(req.params.id) },
            data: { name: req.body.name },
        });
        res.json(updatedCommunity);
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
        const deletedCommunity = yield prisma.community.delete({
            where: Object.assign({ community_id: Number(req.params.id) }, (req.role == "admin" ? {} : { ownerId: req.id })),
        });
        res.send(deletedCommunity);
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Community not found");
    }
}));
