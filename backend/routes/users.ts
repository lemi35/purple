import express from "express";
export const router = express.Router();
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
const prisma = new PrismaClient();
import multer from "multer";
import bcrypt from "bcrypt";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, "upload_at_" + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });


import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import { adminCheckMiddleware } from "../middleware/adminCheckMiddleware";
import path from "path";

router.use(express.json());

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
router.get("/", async (req: Request, res: Response) => {
	const username = req.query.username as string;
	if (username) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					username: username
				}
			});
			if (user) {
				return res.send(user);
			} else {
				return res.status(404).send("User not found");
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send("Internal server error");
		}
	}
	//console.log(req.cookies);
	const users = await prisma.user.findMany({});
	res.send(users);
});

router.get("/authenticatedtest", authenticationMiddleware, async (req: Request, res: Response) => {
	console.log("middleware user:", req.user)
	const users = await prisma.user.findMany({});
	res.send(users);
}
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the current logged-in user
 *     tags: [User]
 *     security:
 *       - cookieAuth: []   # indicates it uses cookies (accessToken)
 *     responses:
 *       200:
 *         description: The current user's info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, no valid access token
 */

router.get("/users/me", authenticationMiddleware, async (req: Request, res: Response) => {
	console.log("Cookies:", req.cookies);
	console.log("User from middleware:", req.user);
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { username: req.user },
      select: {
        id: true,
        username: true,
        role: true,
        profileText: true,
        profileImage: true,
        profileBanner: true
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
	"/admintest",
	adminCheckMiddleware,
	async (req: Request, res: Response) => {
		const users = await prisma.user.findMany({});
		res.send(users);
	}
);


router.get("/:id", async (req: Request, res: Response) => {
	const users = await prisma.user.findUnique({
		where: {
			id: Number(req.params.id)
		}
	});
	if (users) {
		console.log(users);
		res.send(users);
	} else {
		res.status(404).send("User not found");
	}
});




router.put("/update", upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), authenticationMiddleware, async (req: Request, res: Response) => {

	const user = await prisma.user.findUnique({
		where: {
			username: req.user,
		},
	});
	if (user == null) {
		return res.status(400).send("Cannot find user");
	}



	if (req.body.currentPassword) {
		try {
			if (await bcrypt.compare(req.body.currentPassword, user.password)) {
				const decodedUser = { name: req.body.username };

			} else {
				res.status(400).send("Wrong username or password");
				return;
			}
		} catch (error) {
			console.log(error)
		}
	}





	let hashedPassword;
	let salt;

	if (req.body.password) {
		salt = await bcrypt.genSalt();
		hashedPassword = await bcrypt.hash(req.body.password, salt);

	}
	if (validationResult(req)) {
		try {
			const updatedUser = await prisma.user.update({
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
					profileImage: (req.files as any)?.['profileImage']?.[0]?.filename,
					profileBanner: (req.files as any)?.['profileBanner']?.[0]?.filename,
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
		} catch (error) {
			console.log(error);
			res.status(404).send("User not found");
		}
	}

});

router.put("/:id", upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'profileBanner', maxCount: 1 }]), async (req: Request, res: Response) => {

	if (validationResult(req)) {
		try {
			const updatedUser = await prisma.user.update({
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
					profileImage: (req.files as any)?.['profileImage']?.[0]?.filename,
					profileBanner: (req.files as any)?.['profileBanner']?.[0]?.filename,
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
		} catch (error) {
			console.log(error);
			res.status(404).send("User not found");
		}
	}

});

router.delete("/remove", authenticationMiddleware, async (req: Request, res: Response) => {
	console.log(req.user)
	try {
		const users = await prisma.user.delete({
			where: {
				username: req.user
			}
		});
		res.send(users);
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
});


router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.delete({
			where: {
				id: Number(req.params.id),
				...(req.role == "admin" ? {} : { id: req.id })
			}
		});
		res.send(users);
	} catch (error) {
		console.log(error);
		res.status(404).send(error);
	}
});



module.exports = { router };

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
