const Order = require("../Model/ConfirmbModel");

const getAllOrders = async (req, res, next) => {

    let orders;
    //get all users
    try{
        orders = await Order.find();
    }catch(err) {
        console.log(err);
    }
        //not found 
        if(!orders){
            return res.status(404).json({message:"Order not found"});
        }
    //display all users
    return res.status(200).json({orders});
};

//data insert
  const addOrders = async (req, res, next) =>{

    const {buyerId, farmerId, cropId,pricePerKg, quantity,unit, totalPrice,paymentMethod,deliveryaddress,orderdate} = req.body;

    let orders;

    try{
        orders = new Order({buyerId, farmerId, cropId,pricePerKg,quantity,unit, totalPrice,paymentMethod,deliveryaddress,orderdate});
        await orders.save();
    }catch (err){
        console.log(err);
    }

    // not insert users
    if(!orders){
        return res.status(404).send({message:"unable to add orders"});
    }
    return res.status(200).json({ orders });
  }

//Get by Id
const getById = async (req, res, next) =>{

    const id = req.params.id;

    let order;
     try{
        order = await Order.findById(id);
     }catch (err){
        console.log(err);
     }

     // not avaialabe users
     if(!order){
        return res.status(404).send({message:"order not found"});
    }
    return res.status(200).json({ order });
}


//UPdate user details 
   
     const updateOrders = async (req, res, next) => {

        const id = req.params.id;
        const {buyerId, farmerId, cropId,pricePerKg, quantity,unit, totalPrice,paymentMethod,deliveryaddress,orderdate} = req.body;

        let orders;

        try {
            orders = await Order.findByIdAndUpdate(id,
                {buyerId:buyerId, farmerId:farmerId, cropId:cropId,pricePerKg:pricePerKg, quantity:quantity,unit:unit, totalPrice:totalPrice,paymentMethod:paymentMethod,deliveryaddress:deliveryaddress,orderdate:orderdate});
                orders = await orders.save();
        }catch(errr){
            console.log(err);
        }
   if(!orders){
        return res.status(404).send({message:"unable to update orders"});
    }
    return res.status(200).json({ orders });

     };



    // Delete user details
    const deleteOrder = async (req, res, next) => {
       const id = req.params.id;
       
       let order;

       try{
        order = await Order.findByIdAndDelete(id)
       }catch(err){
        console.log(err);
      }
       if(!order){
        return res.status(404).send({message:"Unable to delete order"});
    }
    return res.status(200).json({ order });

};


exports.getAllOrders = getAllOrders;
exports.addOrders = addOrders;
exports.getById = getById;
exports.updateOrders = updateOrders;
exports.deleteOrder= deleteOrder;