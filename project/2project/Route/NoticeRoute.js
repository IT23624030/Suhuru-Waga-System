const express = require("express");
const router = express.Router();
//Insert Model
const Notice = require("../Model/NoticeModel");
//Insert Notice controller
const NoticeController = require("../Controller/NoticeControl");

router.get("/",NoticeController.getAllNotices);
router.post("/",NoticeController.addNotices);
router.get("/:id",NoticeController.getById);
router.put("/:id",NoticeController.updateNotices);
router.delete("/:id",NoticeController.deleteNotice);

//export
module.exports = router;