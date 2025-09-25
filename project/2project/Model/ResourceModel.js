const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pdfSchema = new Schema({
    title:{
        type:String, //datatype
        required:true, //validate
    },
    pdf:{
        type:String, //datatype
        required:true, //validate
    }
});

module.exports = mongoose.model(
    "ResourceModel",  //filename
    pdfSchema //function name
)