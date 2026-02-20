import express from 'express';
import bookRouter from './app/books.mjs';
import authRouter from './app/auth.mjs';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './docs/openapi.mjs';


const app = express();
const PORT = 4000;

app.use(express.json());

// Swagger (public)
app.get('/docs.json', (req, res) => res.json(openapiSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/auth", authRouter);
app.use("/books", bookRouter);

//ทดสอบการส่งข้อมูล
// app.get ('/test', (req, res) => {
//     return res.json('server API is working !!');
// });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});