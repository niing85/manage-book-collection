import express from 'express';
import bookRouter from './app/books.mjs';
import authRouter from './app/auth.mjs';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/auth", authRouter);
app.use("/books", bookRouter);

//ทดสอบการส่งข้อมูล
// app.get ('/test', (req, res) => {
//     return res.json('server API is working !!');
// });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});