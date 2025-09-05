import jwt, { JwtPayload } from "jsonwebtoken"

export const generateToken = (id: JwtPayload):string => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '180s' });
}

export const verifyToken = (token: string):JwtPayload => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    return jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] }) as JwtPayload;
}