import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import  Jwt  from "jsonwebtoken";

export const signup = async (req,res,next)=>{
const {username, email, password } = req.body;
const hashedPassword = bcryptjs.hashSync(password,10); //hachSync=hash+async and 10 for salting
const newUser = new User( {username, email, password:hashedPassword });
try {
    await newUser.save();
res.status(201).json('User created successfully!');
} catch (error) {
   next(error); // to initiate middleware inside index.js
}
};

export const signin = async (req,res,next)=>{
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404,"User not found!"));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if (!validPassword) return next(errorHandler(401,'Wrong credentials!'));//JWT_SECRET is the salting key for hashing
        const token = Jwt.sign({id:validUser._id},process.env.JWT_SECRET)//add info (here ._id is used) that is unique for the user.
        const {password:pass,...rest}= validUser._doc; //destructuring password and rest of the other details for constructing json response
        res.cookie("access_token",token,{httpOnly:true}) // this cookie i'll be saved inside browser we can also add expire here
            .status(200)
            .json(rest);//returning rest of the details except paswd
    } catch (error) {
        next(error);
    }
}
export const google= async (req,res,next) =>{  //checking the google signed in user.
    try {
        const user = await User.findOne({email:req.body.email})   // we are passing the email in the frontend
        if (user) {
            const token =Jwt.sign({id: user._id},process.env.JWT_SECRET);
            const {password:pass,...rest}= user._doc; //destructuring password and rest of the other details for constructing json response
            res.cookie("access_token",token,{httpOnly:true}) // this cookie i'll be saved inside browser we can also add expire here
                .status(200)
                .json(rest);
        } else{ // In the user model the passwd value is required, so generate a pass to authenticate or create a new user.
            const generatedPassword = Math.random().toString(36).slice(-8)+ Math.random().toString(36).slice(-8);
            //tostring(36)= 0-9 & a-z // output will be = 0. 21212nibme //slice = 212nibme (8 digit password) // 8+8=16 digit strong password
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4) , email:req.body.email, password:hashedPassword, avatar : req.body.photo});
            await newUser.save();
            const token =Jwt.sign({id: newUser._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} = newUser._doc;
            res.cookie("access_token",token,{httpOnly:true}) // this cookie i'll be saved inside browser we can also add expire here
                .status(200)
                .json(rest);
        }// if user name is Karthik Bot then karthikbot83j3 will be generated
    } catch (error) {
        next(error) // to send the error
    }
}

export const signout = async (req,res,next) =>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!'); // this response will be showed in network tab.
    } catch (error) {
        next(error)
    }
}