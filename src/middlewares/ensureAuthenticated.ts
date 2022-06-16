import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if(!authToken) {
        return response.status(401).json({
            message: "Token is missing"
        });
    }

    //Bearder sd13246464646465asdsadsafsdf46
    const [, token] = authToken.split(' ');

    try {
        verify(token, '464add79-8e29-45f3-a6d2-749b7a14d802');
        return next();
    }catch(err) {
        return response.status(401).json({
            message: 'Token invalid'
        })
    }


}