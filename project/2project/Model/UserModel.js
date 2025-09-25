const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname:{type:String,required:true,},
    age:{ type:Number,required:true,},
    gender:{type:String,required:true,},
    NIC:{type:String,required:true,},
    contact_number:{type:Number,required:true,},
    email:{type:String,required:true,},
    address:{type:String,required:true,},
    distric:{type:String, required:true,},
    city:{type:String,required:true,},
    experience:{type:Number, required:true,},
    agri_activities:{type:String,},
    password:{type:String, required:true,},
});

module.exports = mongoose.model(
    "UserModel",//file name
    userSchema // function name
)