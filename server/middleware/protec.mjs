import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// JWT Authentication
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization; //token ที่ติดมากับ header

    if (!authHeader) {
        return res.status(401).json({ 
            message: 'Access token is required' 
        });
    }

    if(!authHeader.startsWith('Bearer')){
        return res.status(401).json({
            message: 'Token has invalid format'
        });
    }

    const token = authHeader.split(' ')[1]; //Bearer TOKEN ที่เอา bear ออก

    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Invalid or expired token' 
            });
        }
        
        req.user = payload;
        next();
    });
};