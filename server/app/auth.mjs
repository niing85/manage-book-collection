import { Router } from "express";
import connectPool from '../utils/db.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateRegister, validateLogin } from '../middleware/auth.validation.mjs';

import dotenv from 'dotenv';
dotenv.config();

const authRouter = Router();


authRouter.post('/register', [validateRegister], async (req, res) => {
    try {
        const { username, password, firstname, lastname } = req.body;

        //เช็คว่ามี username ซ้ำกับในระบบไหม
        const userCheck = await connectPool.query(
            'SELECT user_id FROM users WHERE username = $1',
            [username]
        );

        if (userCheck.rows[0]) {
            return res.status(409).json({ 
                message: 'Username already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //สร้าง user ใหม่
        const result = await connectPool.query(
            `INSERT INTO users (username, password, firstname, lastname, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, username, firstname, lastname, created_at`,
            [username, hashedPassword, firstname, lastname, new Date()]
        );
        const newUser = result.rows[0];

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                user_id: newUser.user_id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//สร้าง JWT token หมดอายุใน 1 วัน
const generateToken = (user) => {
    return jwt.sign(
        { 
            user_id: user.user_id, 
            username: user.username 
        },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    );
};


authRouter.post('/login', [validateLogin], async (req, res) => {
    try {
        const { username, password } = req.body;

        //ค้นหา username ที่มีอยู่ในระบบ
        const result = await connectPool.query(
            'SELECT user_id, username, password, firstname, lastname FROM users WHERE username = $1',
            [username]
        );
        const user = result.rows[0];

        //ถ้าไม่เจอข้อมูลให้ปฎิเสธ
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid username or password' 
            });
        }

        // ถ้าเจอข้อมูล ต่อไปก็ Verify password (ที่ส่งเข้ามา,รหัสในระบบ)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid password' 
            });
        }

        //เอา token ที่สร้างมาเก็บในนี้
        const token = generateToken(user);

        // Return token
        return res.status(200).json({
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


authRouter.post('/logout', async (req, res) => {
    try {
        //ฝั่ง FE เป็นฝ่ายลบ token เพื่อออกจากระบบ
        return res.status(200).json({ 
            message: 'Logout successful' 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



export default authRouter;