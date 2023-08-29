// import model 
const User = require('../models/userModel');

/******************** API Functions *********************/ 

/********** Create User **************/
const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: "success",
            msg: newUser
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            msg: err
        })
    }

}

/*********** Update User ************/


/*********** Delete User ************/