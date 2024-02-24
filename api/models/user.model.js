import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        required:true,
    },
    avatar:{
        type : String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
},{timestamps:true});
//unique:true for unique username and emails in db.
//timestamps:true to record updation and creation time.

const User =mongoose.model('User',userSchema);
//'User' can be automatically converted into 'Users' by mdb.

export default User;