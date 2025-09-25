const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    type:{
        type:String, //datatype
        required:true, //validate
    },
    title:{
        type:String, //datatype
        required:true, //validate
    },
    content:{
        type:String, //datatype
        required:true, //validate
    }
});

module.exports = mongoose.model(
    "NoticeModel",  //filename
    noticeSchema //function name
)