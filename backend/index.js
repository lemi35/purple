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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const users_1 = require("./routes/users");
const posts_1 = require("./routes/posts");
const topics_1 = require("./routes/topics");
const comments_1 = require("./routes/comments");
const follows_1 = require("./routes/follows");
const chats_1 = require("./routes/chats");
const messages_1 = require("./routes/messages");
const authentication_1 = require("./routes/authentication");
const images_1 = require("./routes/images");
const communities_1 = require("./routes/communities");
const bcrypt_1 = __importDefault(require("bcrypt"));
const allowedOrigins = [
    "https://snazzy-platypus-6381f4.netlify.app",
    "http://localhost:5173",
];
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.static("uploads"));
const PORT = 3001;
const prisma = new client_1.PrismaClient();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Purple",
            version: "1.0.0",
            description: "",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    in: "header",
                    name: "Authorization",
                    description: "Bearer token to access these api endpoints",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [{ url: "https://purple-lfdw.onrender.com" }],
    },
    apis: ["./routes/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/users", users_1.router);
app.use("/posts", posts_1.router);
app.use("/topics", topics_1.router);
app.use("/comments", comments_1.router);
app.use("/follows", follows_1.router);
app.use("/chats", chats_1.router);
app.use("/messages", messages_1.router);
app.use("/auth", authentication_1.router);
app.use("/images", images_1.router);
app.use("/communities", communities_1.router);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Variables for testing
        const username = "";
        const posts = 2;
        const follows = 6;
        // Check if a user with the given username already exists
        const existingAdminUser = yield prisma.user.findFirst({
            where: {
                username: "adminuser",
            },
        });
        if (existingAdminUser) {
            console.log(`
    User with username '${username}' already exists.
    `);
            // Fetch all users and their data
            // Exit the function or handle the scenario accordingly
        }
        else {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash("admin", salt);
            yield prisma.user.create({
                data: {
                    username: "adminuser",
                    password: hashedPassword,
                    role: "admin",
                },
            });
            console.log(`
		User with username 'admin' created successfully.
		`);
        }
        // Fetch all users and their data
        const allUsers = yield fetchAllUsers();
    });
}
// Function to fetch all users and their data
function fetchAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findMany();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
