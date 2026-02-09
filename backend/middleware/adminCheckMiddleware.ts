import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const generateAccessToken = (user : {name : string} ) => {
	if(process.env.ACCESS_TOKEN_SECRET) return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
};

export const adminCheckMiddleware = async (req:Request,res:Response,next:NextFunction) => {
	const accessToken = req.cookies.accesstoken;
	const token = accessToken; 
	if (process.env.ACCESS_TOKEN_SECRET) 
		try {
			const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
			const isAdmin = await prisma.user.findUnique({
				where: {
					username: decoded.name
				}
			});
			if (isAdmin) {
				if (isAdmin.role == "admin") {
					next();
				}
				else {
					res.json(403).send();
				}
			}
			else {
				res.json(403).send();
			}
		} catch (error) {
			if (req.cookies.refreshtoken) {
				try {
					const user = await prisma.user.findFirst({
						where: {
							token : req.cookies.refreshtoken
						}
					});
					if (user) {
						const newAccessToken = generateAccessToken( {name: user.username});

						const isAdmin = await prisma.user.findUnique({
							where: {
								username: user.username
							}
						});
						if (isAdmin) {
							if (isAdmin.role == "admin") {
								res.cookie("accesstoken", newAccessToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: false});
								next();
							}
							else {
								res.json(403).send();
							}
						}
						else {
							res.json(403).send();
						}
					} else {
						res.json(403).send();
					}
				}	
				catch (error) {
					res.status(401).send();
				}
			}

		}
};


