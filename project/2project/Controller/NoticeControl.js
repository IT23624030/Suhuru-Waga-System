const Notice = require("../Model/NoticeModel");

//data display
const getAllNotices = async (req, res, next) => {
    let notices; //N
    try{
        notices = await Notice.find();
    }catch (err){
        console.log(err);
    }
    //not found
    if(!notices){
        return res.status(404).json({message:"User not found"});
    }
    //display all notices
    return res.status(200).json({ notices });
};

//data Insert
const addNotices = async (req, res, next) => {
    const {type,title,content} = req.body;
    let notices;
    try{
        notices = new Notice ({type,title,content});
        await notices.save();
    }catch (err) {
        console.log(err);
    }
    //if not insert
    if(!notices){
        return res.status(404).json({message:"Unable to add notices"});
    }
    return res.status(200).json({notices});
};

//get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let notice;
    try{
        notice = await Notice.findById(id);
    }catch (err){
        console.log(err);
    }
    //not found
    if(!notice){
        return res.status(404).json({message:"Notice not found"});
    }
    return res.status(200).json({ notice });
};

//update Notices
const updateNotices = async (req, res, next) => {
    const id = req.params.id;
    const { type, title, content } = req.body;
    let notices;
    try {
        notices = await Notice.findByIdAndUpdate(id, { type: type, title: title, content: content });
        notices = await notices.save();
    } catch (err) {
        console.log(err);
    }
    //not found
    if (!notices) {
        return res.status(404).json({ message: "Unable to Update Notices" });
    }
    return res.status(200).json({ notices });
};

//Delete Notice
const deleteNotice = async (req, res, next) => {
    const id = req.params.id;
    let notice;
    try {
        notice = await Notice.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    //not found
    if (!notice) {
        return res.status(404).json({ message: "Unable to Delete Notice" });
    }
    return res.status(200).json({ notice });
};

exports.getAllNotices = getAllNotices;
exports.addNotices = addNotices;
exports.getById = getById;
exports.updateNotices = updateNotices;
exports.deleteNotice = deleteNotice;
