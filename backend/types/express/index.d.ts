import { Express } from "express-serve-static-core";
import { Multer } from "multer";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            id?: number;
            role?: string;
            file?: any;
        }
    }
}
