import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test = (req,res) => {
        res.json({
            message:"hello bro",
        })
}
//a test function is exported

export const updateUser = async (req,res,next)=>{
    if (req.user.id !== req.params.id) return next(errorHandler(403,'Forbidden'));
    // req.user.id - received from verifyUser func
    // req.params.id - received from endpoint's parameter "router.post('/update/:id',verifyToken,updateUser);"

    try {
        if (req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{   //set is used to avoid people to send other data which is not inside the form like 'isadmin:true', So it only accepts the mentioned values.
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar,
            }
        },{new:true} );  //It will save user with updated info otherwise we will get previous info for our response.
        
        const {password,...rest} = updatedUser._doc;
        
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

}

export const deleteUser = async (req,res,next) =>{   // 
    if (req.user.id !== req.params.id) return next(errorHandler(403,'Forbidden'));
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted!");
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req,res,next)=>{
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef:req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    }else{
        return next(errorHandler(401,'forbidden'));
    }
}

export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };