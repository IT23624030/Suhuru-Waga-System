const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
      buyerid:{
        type:String, //datatype
        required:true, //validate
       },
       firstname:{
        type:String, //datatype
        required:true, //validate
       },
       lastname:{
        type:String, //datatype
        required:true, //validate
       },
        organization:{
        type:String, //datatype
        required:true, //validate
       },
        gmail:{
        type:String, //datatype
        required:true, //validate
       },
        contactNumber:{
        type:Number, //datatype
        required:true, //validate
       },
        address:{
        type:String, //datatype
        required:true, //validate
       }

});

module.exports = mongoose.model(
    "UserModelB", //file name
    userSchema //function name
)