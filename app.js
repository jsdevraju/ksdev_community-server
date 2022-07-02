import express from 'express'
import morgan from 'morgan'
import { config } from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/error.js'
import cookieParser from 'cookie-parser'

config();


const app =  express();

// App Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))


// All Routes Here
import auth from './routes/authRoute.js'
import friend from './routes/friendRoute.js'

app.use('/api/v1', auth)
app.use('/api/v1', friend)

// Error Middleware
app.use(errorHandler)

export default app;