import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router as usersRouter } from "./routes/users";
import { router as postsRouter } from "./routes/posts";
import { router as topicsRouter } from "./routes/topics";
import { router as commentsRouter } from "./routes/comments";
import { router as followsRouter } from "./routes/follows";
import { router as chatsRouter } from "./routes/chats";
import { router as messagesRouter } from "./routes/messages";
import { router as authenticationRouter } from "./routes/authentication";
import { router as imageRouter } from "./routes/images";
import { router as communityRouter} from "./routes/communities"

import bcrypt from "bcrypt";

const allowedOrigins = [
  //"http://localhost:5173",
  "https://snazzy-platypus-6381f4.netlify.app"
];

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.static("uploads"));


const PORT = 3001;
const prisma = new PrismaClient();

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
		servers: [{ url: "http://localhost:3001" }],
	},
	apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/topics", topicsRouter)
app.use("/comments", commentsRouter);
app.use("/follows", followsRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use("/auth", authenticationRouter);
app.use("/images", imageRouter);
app.use("/communities", communityRouter)

async function main() {
	// Variables for testing
	const username = "";
	const posts = 2;
	const follows = 6;

	// Check if a user with the given username already exists
	const existingAdminUser = await prisma.user.findFirst({
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
	} else {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash("admin", salt);

		await prisma.user.create({
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
	const allUsers = await fetchAllUsers();
	console.log("All users:", allUsers);
}

// Function to fetch all users and their data
async function fetchAllUsers() {
	return await prisma.user.findMany();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
