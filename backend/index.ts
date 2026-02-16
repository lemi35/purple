import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://purple-b.pages.dev"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


import { router as usersRouter } from "./routes/users";
import { router as postsRouter } from "./routes/posts";
import { router as topicsRouter } from "./routes/topics";
import { router as commentsRouter } from "./routes/comments";
import { router as followsRouter } from "./routes/follows";
import { router as chatsRouter } from "./routes/chats";
import { router as messagesRouter } from "./routes/messages";
import { router as authenticationRouter } from "./routes/authentication";
import { router as imageRouter } from "./routes/images";
import { router as communityRouter } from "./routes/communities";

import bcrypt from "bcrypt";

dotenv.config();

const prisma = new PrismaClient();

/**
 *  REQUIRED FOR RENDER + SECURE COOKIES
 */
app.set("trust proxy", 1);

/**
 *  ORDER MATTERS — MIDDLEWARE FIRST
 */


app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

/**
 * Swagger
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Purple",
      version: "1.0.0",
    },
    servers: [{ url: "https://purple-lfdw.onrender.com" }],
  },
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Purple API is running",
  });
});
/**
 *  ROUTES LAST
 */
app.use("/auth", authenticationRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/topics", topicsRouter);
app.use("/comments", commentsRouter);
app.use("/follows", followsRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use("/images", imageRouter);
app.use("/communities", communityRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});


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
