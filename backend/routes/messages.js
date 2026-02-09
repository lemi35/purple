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
 *     Message:
 *       type: object
 *       required:
 *         - chat_id
 *         - sender_id
 *         - content
 *       properties:
 *         message_id:
 *           type: number
 *         chat_id:
 *           type: number
 *         sender_id:
 *           type: number
 *         content:
 *           type: string
 *         created_at:
 *           type: string
 *       example:
 *         message_id: 1
 *         chat_id: 1
 *         sender_id: 1
 *         content: Hello!
 *         created_at: 2024-05-03T09:32:32.787Z
 */
/**
 * @swagger
 * tags:
 *   name: Message
 *   description: API endpoints for managing messages
 */
/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: The created message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat_id, sender_id, content } = req.body;
        const newMessage = yield prisma.message.create({
            data: {
                chat_id,
                sender_id,
                content,
            },
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Unable to create message" });
    }
}));
/**
 * @swagger
 * /messages/{chatId}:
 *   get:
 *     summary: Get messages by chat ID
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the chat
 *     responses:
 *       200:
 *         description: A list of messages for the specified chat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
exports.router.get("/:chatId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = parseInt(req.params.chatId);
        const messages = yield prisma.message.findMany({
            where: {
                chat_id: chatId,
            },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Unable to fetch messages" });
    }
}));
module.exports = { router: exports.router };
