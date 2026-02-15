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
exports.router = express_1.default.Router();
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const multer_1 = __importDefault(require("multer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "upload_at_" + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const adminCheckMiddleware_1 = require("../middleware/adminCheckMiddleware");
const path_1 = __importDefault(require("path"));
exports.router.use(express_1.default.json());
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *          id:
 *            type: number
 *          username:
 *            type:  string
 *          password:
 *            type: string
 *          role:
 *            type: string
 *          token:
 *            type: string
 *          tokenExpire:
 *            type: string
 *          createdAt:
 *            type: string
 *          profileText:
 *            type: string
 *          profileImage:
 *            type: string
 *          sections:
 *            type: array
 *            items:
 *              type: number
 *          topics:
 *            type: array
 *            items:
 *              type: number
 *          posts:
 *            type: array
 *            items:
 *              type: number
 *          follows:
 *            type: array
 *            items:
 *              type: number
 *       example:
 *         id: d5fE_asz
 *         username: user
 *         password: secret
 *         profileText: string
 *         profileImage: string
 */
/**
 * @swagger
 * tags:
 *   name: User
 * /users:
 *   get:
 *     summary: Lists all the users
 *     tags: [User]
 *     security: []
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *   put:
 *    summary: Update the user by the id
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            example:
 *              profileImage: string
 *              ProfileText: string
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found


 * /users/authenticatedtest:
 *   get:
 *     summary: Same as /users, but only works if you are authorized and have a valid access token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *
 *
 * /users/admintest:
 *   get:
 *     summary: Same as /users, but only works if you are authorized and have a valid access token, and have an admin role
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    if (username) {
        try {
            const user = yield prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (user) {
                return res.send(user);
            }
            else {
                return res.status(404).send("User not found");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("Internal server error");
        }
    }
    //console.log(req.cookies);
    const users = yield prisma.user.findMany({});
    res.send(users);
}));
exports.router.get("/authenticatedtest", authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("middleware user:", req.user);
    const users = yield prisma.user.findMany({});
    res.send(users);
}));
exports.router.get("/admintest", adminCheckMiddleware_1.adminCheckMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({});
    res.send(users);
}));
exports.router.get("/me",
  authenticationMiddleware_1.authenticationMiddleware, // makes sure user is logged in
  async (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
      // req.user comes from the middleware (your JWT decoded username)
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = yield prisma.user.findUnique({
        where: { username: req.user },
        select: {
          id: true,
          username: true,
          role: true,
          profileText: true,
          profileImage: true,
          profileBanner: true,
        },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

exports.router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });
    if (users) {
        console.log(users);
        res.send(users);
    }
    else {
        res.status(404).send("User not found");
    }
}));
exports.router.put("/update", upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const user = yield prisma.user.findUnique({
        where: {
            username: req.user,
        },
    });
    if (user == null) {
        return res.status(400).send("Cannot find user");
    }
    if (req.body.currentPassword) {
        try {
            if (yield bcrypt_1.default.compare(req.body.currentPassword, user.password)) {
                const decodedUser = { name: req.body.username };
            }
            else {
                res.status(400).send("Wrong username or password");
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    let hashedPassword;
    let salt;
    if (req.body.password) {
        salt = yield bcrypt_1.default.genSalt();
        hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
    }
    if ((0, express_validator_1.validationResult)(req)) {
        try {
            const updatedUser = yield prisma.user.update({
                where: {
                    id: Number(user.id),
                },
                data: {
                    //username: req.body.username,
                    password: hashedPassword,
                    //role: req.body.role,
                    //token: req.body.token,
                    //tokenExpire: req.body.tokenExpire,
                    //createdAt: req.body.username,
                    profileText: req.body.profileText,
                    profileImage: (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a['profileImage']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.filename,
                    profileBanner: (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d['profileBanner']) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename,
                    //posts: req.body.posts,
                    //follows: req.body.follows,
                    //post: req.body.post,
                    //comments: req.body.comments,
                    //chats_participant1: req.body.chats_participant1,
                    //chats_participant2: req.body.chats_participant2,
                    //followsAsFollower: req.body.followsAsFollower,
                    //followsAsFollowedUser: req.body.followsAsFollowedUser
                },
            });
            res.json(updatedUser);
        }
        catch (error) {
            console.log(error);
            res.status(404).send("User not found");
        }
    }
}));
exports.router.put("/:id", upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    if ((0, express_validator_1.validationResult)(req)) {
        try {
            const updatedUser = yield prisma.user.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    //username: req.body.username,
                    //password: hashedPassword,
                    //role: req.body.role,
                    //token: req.body.token,
                    //tokenExpire: req.body.tokenExpire,
                    //createdAt: req.body.username,
                    profileText: req.body.profileText,
                    profileImage: (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a['profileImage']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.filename,
                    profileBanner: (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d['profileBanner']) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename,
                    //posts: req.body.posts,
                    //follows: req.body.follows,
                    //post: req.body.post,
                    //comments: req.body.comments,
                    //chats_participant1: req.body.chats_participant1,
                    //chats_participant2: req.body.chats_participant2,
                    //followsAsFollower: req.body.followsAsFollower,
                    //followsAsFollowedUser: req.body.followsAsFollowedUser
                },
            });
            res.json(updatedUser);
        }
        catch (error) {
            console.log(error);
            res.status(404).send("User not found");
        }
    }
}));
exports.router.delete("/remove", authenticationMiddleware_1.authenticationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    try {
        const users = yield prisma.user.delete({
            where: {
                username: req.user
            }
        });
        res.send(users);
    }
    catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
}));
exports.router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.delete({
            where: Object.assign({ id: Number(req.params.id) }, (req.role == "admin" ? {} : { id: req.id }))
        });
        res.send(users);
    }
    catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
}));
module.exports = { router: exports.router };
// add these to swagger setup after routes are done
/*
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *   delete:
 *     summary: Remove the user by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */
