import { NextFunction, Request, Response } from "express";
import {
    NotFoundException,
    TokenExpiredException,
    UnauthorizedException
} from "../utils/exceptions/exceptions";
import { verifyToken } from "../utils/jtw";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser | null;
        }
    }
}

export const authMiddleware = async(req: Request, _res: Response, next: NextFunction) => {
    try {        
        const { authorization } = req.headers;
        if(!authorization) throw new UnauthorizedException('Invalid token');

        const token = authorization.replace('Bearer ', '');
        if(!token) throw new UnauthorizedException('Invalid token');
        
        const decoded = verifyToken(token);
        if(!decoded.id) throw new UnauthorizedException('Invalid token');
        
        const user: IUser | null = await User.findById(decoded.id);
        if(!user) throw new NotFoundException('Invalid token');

        req.user = user;
        
        next();
    } catch (error) {        
        if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
            throw error;
        }

        if(error instanceof TokenExpiredException) throw new TokenExpiredException('Token expired');        
        throw new UnauthorizedException('Error de autenticación');
    }
}

