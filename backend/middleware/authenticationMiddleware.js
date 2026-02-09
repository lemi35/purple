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
exports.authenticationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateAccessToken = (user) => {
    if (process.env.ACCESS_TOKEN_SECRET)
        return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
const authenticationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("auth middleware");
    console.log("Cookies received:", req.cookies);
    const accessToken = req.cookies.accesstoken;
    console.log("Access token:", accessToken);
    const token = accessToken; //authenticationHeader.split(" ")[1];
    if (process.env.ACCESS_TOKEN_SECRET) {
        try {
            //console.log("trying to decode")
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            //console.log("decoding succesful");
            /*res.cookie("token", token, {
                httpOnly: true
            });*/
            console.log(decoded);
            req.id = decoded.id;
            req.user = decoded.name;
            req.role = decoded.role;
            console.log(req.id, req.user, req.role);
            next();
        }
        catch (error) {
            if (req.cookies.refreshtoken) {
                //console.log("access token decoding failed, checking refresh token validity")
                try {
                    const user = yield prisma.user.findFirst({
                        where: {
                            token: req.cookies.refreshtoken
                        }
                    });
                    if (user) {
                        const newAccessToken = generateAccessToken({ name: user.username, id: user.id, role: user.role });
                        //console.log(newAccessToken)
                        res.cookie("accesstoken", newAccessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
                        //console.log("new access token generated");
                        req.user = user.username;
                        req.id = user.id;
                        req.role = user.role || undefined;
                        next();
                    }
                }
                catch (error) {
                    //console.log("error1");
                    res.status(401).send();
                }
            }
            else {
                //console.log("error2");
                res.status(401).send();
            }
        }
    }
});
exports.authenticationMiddleware = authenticationMiddleware;
