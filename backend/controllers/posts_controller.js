// import model 
const Posts = require('../models/postsModel');

/******************** API Functions *********************/ 

/********** Create Post **************/
const createPost = async (req, res) => {
    try {
        const newPost = await Posts.create(req.body);
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

/*********** Update Post ************/

/*********** Delete Post ************/

/*********** Like Post **************/

/*********** Get Trending Post **************/


