// app.js
import express from 'express';
import morgan from './src/configs/morgan.js';
import authRouter from './src/routers/authRoute.js';
import mongoose from 'mongoose'; // Import MongoClient from 'mongodb'
import config from './src/configs/config.js';
import userRouter from './src/routers/userRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan.errorHandler);
app.use(morgan.successHandler);

app.use(express.json());
app.get('/', (req, res) => {
  res.send('I am working');
});

app.use('/auth', authRouter);
app.use('/auth/user', userRouter);



mongoose.connect(config.mongoDbUri).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});