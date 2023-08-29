// import model 
const Comments = require('../models/commentsModel');

/******************** API Functions *********************/ 

/********** Create Comment **************/
const createComment = async (req, res) => {
    try {
        const newComment = await Comments.create(req.body);
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

/*********** Update Comment ************/

/*********** Delete Comment ************/

/*********** Like Comment **************/

/*********** Get All Comment **************/


