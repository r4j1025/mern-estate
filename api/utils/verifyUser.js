import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req,res,next) =>{
    const token =req.cookies.access_token;

    if (!token) return next(errorHandler(401,"Unauthorized")); //if no token then returning the error

    jwt.verify(token,process.env.JWT_SECRET, (err,user)=>{
        if (err) return next(errorHandler(403,'Forbidden'));

        req.user = user;
        next(); //sending the info to the next function "router.post('/update/:id',verifyToken,updateUser);"
        // which is 'updateUser' in the user.router.js.

    })

} 
// user to verify if the user authenticated using the token inside the cookie.