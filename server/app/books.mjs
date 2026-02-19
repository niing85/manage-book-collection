import { Router } from "express";
import connectPool from "../utils/db.mjs";
import { validateCreatBookData } from '../middleware/book.validation.mjs';

const bookRouter = Router();

import dotenv from 'dotenv';
dotenv.config(); 

let result;

//เพิ่มหนังสือ
bookRouter.post('/', [validateCreatBookData], async (req, res) => {
    try {
        const newBook = {
            ...req.body,
            created_at: new Date()
        };
        // console.log(newBook);

        await connectPool.query(
            `insert into books (user_id, title, category, created_at)
            values ($1, $2, $3, $4)`,
            [1, newBook.title, newBook.category, newBook.created_at]
        );
        
        return res.status(201).json({message: 'Book created successfully'});

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//ค้นหาหนังสือทั้งหมด ตามหมวดหมู่ ชื่อเรื่อง
bookRouter.get ('/', async (req, res) => {
    // ถ้ามีให้ใส่ % ถ้าไม่มีก็ข้ามไป
    const categoryFind = req.query.category ? `%${req.query.category}%` : null;
    const titleFind = req.query.title ? `%${req.query.title}%` : null;
    const userFind = req.query.user_id ? `${req.query.user_id}` : null;
    
    try {
        // เช็คว่ามี user ในระบบไหม
        if (userFind) {
            const userCheck = await connectPool.query(
                'SELECT user_id FROM users WHERE user_id = $1',
                [userFind]
            );
            
            if (!userCheck.rows[0]) {
                return res.status(404).json({ 
                    message: `User not found (user id: ${userFind})` 
                });
            }
        }
        
        result = await connectPool.query(
            `SELECT * FROM books
                WHERE (category ILIKE $1 or $1 is null or $1 IS NULL)
                AND (title ILIKE $2 OR $2 IS NULL)
                AND (user_id = $3 OR $3 IS NULL)
                ORDER BY title ASC;
            `, [categoryFind, titleFind, userFind]
        );

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    return res.status(200).json(result.rows);
});

//ค้นหาตาม bookId
bookRouter.get ('/:bookId', async (req, res) => {
    const bookIdFromClient = req.params.bookId;
    try {
        result = await connectPool.query('SELECT * FROM books WHERE book_id = $1', [bookIdFromClient]);
        if(!result.rows[0]){
            return res.status(404).json({message: `server could not find a requested book (book id: ${bookIdFromClient})`});
        }

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    return res.status(200).json(result.rows);
});

//แก้ไขข้อมูลหนังสือ
bookRouter.put ('/:bookId', [validateCreatBookData], async (req, res) => {
    const bookIdFromClient = req.params.bookId;
    const updatedBook = {...req.body}
    try {
        result = await connectPool.query(
            `UPDATE books
            SET title = $2, 
                category = $3
            WHERE book_id = $1
            RETURNING* 
            `,[bookIdFromClient, updatedBook.title, updatedBook.category]
            );
        if(result.rowCount === 0){
            return res.status(404).json({message: `server could not find a requested book (book id: ${bookIdFromClient})`});
        }

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    return res.status(200).json({message: "Updated book successfully"});
});

//การลบข้อมูลหนังสือ
bookRouter.delete ('/:bookId', async (req, res) => {
    const bookIdFromClient = req.params.bookId;
    try {
        result = await connectPool.query(
            `DELETE FROM books
            WHERE book_id = $1 
            `,[bookIdFromClient]
            );
        if(result.rowCount === 0){
            return res.status(404).json({message: `server could not find a requested book (book id: ${bookIdFromClient})`});
        }

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    return res.status(200).json({message: "Delete book successfully"});
});

export default bookRouter;