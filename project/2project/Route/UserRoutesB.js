const express = require("express");
const router = express.Router();

// insert model
const User = require("../Model/UserModelB");
//insert user controller
const Usercontroller = require("../Controlers/UsercontrollersB");

router.get("/",Usercontroller.getAllUsers);
router.post("/",Usercontroller.addUsers);
router.get("/:bid",Usercontroller.getById);
router.put("/:bid",Usercontroller.updateUser);
router.delete("/:bid",Usercontroller.deleteUser);


//export
module.exports = router;