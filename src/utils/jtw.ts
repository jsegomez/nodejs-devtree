import jwt, { JwtPayload } from "jsonwebtoken"
import { InvalidTokenException, TokenExpiredException } from "./exceptions/exceptions";

export const generateToken = (id: string):string => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '1800s' });
}

export const verifyToken = (token: string):JwtPayload => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    try{
        return jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] }) as JwtPayload;
    } catch (error){
        if (error instanceof jwt.TokenExpiredError) {
            throw new TokenExpiredException('Token expirado');
        }
        throw new InvalidTokenException('Token inválido');
    }
    
}