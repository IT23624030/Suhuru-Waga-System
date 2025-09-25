const User = require("../Model/UserModelB");

const getAllUsers = async (req, res, next) => {

    let Usersby;
    //get all users
    try{
        users = await User.find();
    }catch(err) {
        console.log(err);
    }
        //not found 
        if(!users){
            return res.status(404).json({message:"User not found"});
        }
    //display all users
    return res.status(200).json({users});
};

//data insert
  const addUsers = async (req, res, next) =>{

    const {buyerid,firstname, lastname,organization, gmail, contactNumber, address} = req.body;

    let users;

    try{
        users = new User({buyerid,firstname,lastname, organization, gmail, contactNumber, address});
        await users.save();
    }catch (err){
        console.log(err);
    }

    // not insert users
    if(!users){
        return res.status(404).send({message:"unable to add users"});
    }
    return res.status(200).json({ users });
  }

//Get by Id
const getById = async (req, res, next) =>{

    const bid = req.params.bid;

    let user;
     try{
        user = await User.findById(bid);
     }catch (err){
        console.log(err);
     }

     // not avaialabe users
     if(!user){
        return res.status(404).send({message:"users not found"});
    }
    return res.status(200).json({ user });
}
//UPdate user details 
   
     const updateUser = async (req, res, next) => {

        const bid = req.params.bid;
        const {buyerid,firstname, lastname,organization, gmail, contactNumber, address} = req.body;

        let users;

        try {
            users = await User.findByIdAndUpdate(bid,
                {buyerid:buyerid,firstname:firstname, lastname:lastname,organization:organization, gmail:gmail, contactNumber:contactNumber, address:address});
                users = await users.save();
        }catch(errr){
            console.log(err);
        }
   if(!users){
        return res.status(404).send({message:"users not found"});
    }
    return res.status(200).json({ users });

     };



    // Delete user details
    const deleteUser = async (req, res, next) => {
       const bid = req.params.bid;
       
       let user;

       try{
        user = await User.findByIdAndDelete(bid)
       }catch(err){
        console.log(err);
      }
       if(!user){
        return res.status(404).send({message:"Unable to delete user"});
    }
    return res.status(200).json({ user });

};


exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser= deleteUser;