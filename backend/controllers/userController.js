// import model 
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

/******************** API Functions *********************/ 

const getAllUser = catchAsync(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).send({
        status: "success",
        result: users.length,
        data: {
            users
        }
    })
})

module.exports = {
    getAllUser
}