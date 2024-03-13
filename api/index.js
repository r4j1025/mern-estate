import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path'; //used to create dynamic path name

// inside package.json "npm install --prefix client" do npm install inside client folder.

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to Mongodb");
}).catch((err)=>{console.log(err);}) ;

const  __dirname = path.resolve(); //getting the current dir name of the server.

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

app.use(express.static(path.join(__dirname,'/client/dist'))); //joining the built dist folder path with dynamic path

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname,'/client/dist/index.html'));
    // any path on the url other than the above three paths will redirect the user to index.html
})

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