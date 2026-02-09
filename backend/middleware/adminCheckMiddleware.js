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
exports.adminCheckMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateAccessToken = (user) => {
    if (process.env.ACCESS_TOKEN_SECRET)
        return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
const adminCheckMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accesstoken;
    const token = accessToken;
    if (process.env.ACCESS_TOKEN_SECRET)
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const isAdmin = yield prisma.user.findUnique({
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
        }
        catch (error) {
            if (req.cookies.refreshtoken) {
                try {
                    const user = yield prisma.user.findFirst({
                        where: {
                            token: req.cookies.refreshtoken
                        }
                    });
                    if (user) {
                        const newAccessToken = generateAccessToken({ name: user.username });
                        const isAdmin = yield prisma.user.findUnique({
                            where: {
                                username: user.username
                            }
                        });
                        if (isAdmin) {
                            if (isAdmin.role == "admin") {
                                res.cookie("accesstoken", newAccessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
                                next();
                            }
                            else {
                                res.json(403).send();
                            }
                        }
                        else {
                            res.json(403).send();
                        }
                    }
                    else {
                        res.json(403).send();
                    }
                }
                catch (error) {
                    res.status(401).send();
                }
            }
        }
});
exports.adminCheckMiddleware = adminCheckMiddleware;
