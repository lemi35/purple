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
import { router as communityRouter } from "./routes/communities";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ------------------- CORS -------------------
// Allow localhost during dev, and your deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://snazzy-platypus-6381f4.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("uploads"));

// ------------------- Swagger -------------------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Purple API",
      version: "1.0.0",
      description: "",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [{ url: "http://localhost:3001" }], // only for local Swagger testing
  },
  apis: ["./routes/*.ts"],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// ------------------- Routes -------------------
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/topics", topicsRouter);
app.use("/comments", commentsRouter);
app.use("/follows", followsRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use("/auth", authenticationRouter);
app.use("/images", imageRouter);
app.use("/communities", communityRouter);

// ------------------- Admin Setup -------------------
async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { username: "adminuser" } });
  if (!existingAdmin) {
    console.log("Creating admin user...");
    const bcrypt = await import("bcrypt");
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash("admin", salt);
    await prisma.user.create({
      data: { username: "adminuser", password: hashedPassword, role: "admin" }
    });
    console.log("Admin created!");
  }
}
main().catch(e => {
  console.error(e);
}).finally(() => prisma.$disconnect());

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 3001; // <-- Use Render's port in production
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
