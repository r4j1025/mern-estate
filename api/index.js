import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to Mongodb");
}).catch((err)=>{console.log(err);}) ;

const app= express();
app.use(express.json()); //allows to send json to the server

app.use(cookieParser()); //used for checking the token inside the cookie in verifyUser.js


app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
}
//scripts and type was added in package.json .
);

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

//middleware creation to handle error

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500; //if no code then assign 500
    const message=err.message || 'Internal server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
})