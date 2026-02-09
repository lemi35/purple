import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware";
import multer from "multer";
import path from "path";

export const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, "community_at_" + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });

router.use(express.json());

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
router.get("/", async (req: Request, res: Response) => {
  //const communityName = req.query.name as string | undefined;

  try {
      const communities = await prisma.community.findMany({
        include: {
          topics: {
            include: {
              posts: { include: { user: true } }
            }
          }
        }
      });
      res.json(communities);
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const community = await prisma.community.findUnique({
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
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});


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
router.post("/", upload.single("image"), authenticationMiddleware, async (req: Request, res: Response) => {
	//console.log(req.id, req.user)
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const newCommunity = await prisma.community.create({
			data: {
				name: req.body.title,
				image: req.file?.filename,
				description: req.body.description || "Community description here.",
			},
		});
		res.json(newCommunity);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
});

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
router.put("/:id", async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const updatedCommunity = await prisma.community.update({
			where: { community_id: Number(req.params.id) },
			data: { name: req.body.name },
		});
		res.json(updatedCommunity);
	} catch (error) {
		console.log(error);
		res.status(404).send("Topic not found");
	}
});

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
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const deletedCommunity = await prisma.community.delete({
			where: {
				community_id: Number(req.params.id),
				...(req.role == "admin" ? {} : { ownerId: req.id })
			},
		});
		res.send(deletedCommunity);
	} catch (error) {
		console.log(error);
		res.status(404).send("Community not found");
	}
});

export { router as communityRouter };
