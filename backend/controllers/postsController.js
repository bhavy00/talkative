// import model
const Posts = require("../models/postsModel");

// import other functions and classes
const APIFeature = require("../utils/apiFeature")

/******************** API Functions *********************/

/********** Create Post **************/
const createPost = async (req, res) => {
  try {
    const {user_id} = req.params;
    const newPost = await Posts.create({
      user: user_id,
      ...req.body
    });
    res.status(201).json({
      status: "success",
      msg: newPost,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      msg: err,
    });
  }
};

/*********** Update Post ************/
const updatePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await Posts.findByIdAndUpdate(post_id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(204).json({
      status: "success",
      data: { post },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      msg: error,
    });
  }
};

/*********** Delete Post ************/
const deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    await Posts.findByIdAndDelete(post_id);
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      msg: error,
    });
  }
};

/*********** Get Trending Posts **************/
const getTrendPosts = async (req, res) => {
  try {
    let trendPosts = Posts.find();

    // sorting posts with dates
    trendPosts = trendPosts.sort();
    
    // soritng new posts for no of comments and likes
    trendPosts = trendPosts.sort('comments likes');

    const resultPosts = await trendPosts;

    // send response
    res.status(200).json({
      status: "success",
      results: resultPosts.length,
      data: {
        resultPosts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      msg: err,
    });
  }
};

/*********** Get User Posts **************/
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    // find user by id in database
    const userPosts = await Posts.find({ user: user_id });
    // send reponse
    res.status(200).json({
      status: "success",
      results: userPosts.length,
      data: {
        userPosts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      msg: err,
    });
  }
};

/*********** Get Post **************/
const getPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    // Find post by id in the database
    const post = await Posts.findById(post_id);
    // send response
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      msg: err,
    });
  }
};

/*********** Get Search Post **************/
const getSearchPost = async (req, res) => {
  try {    
    // Execute query
    const features = new APIFeature(Posts.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination() 

    const posts = await features.query;

    // Send Response
    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      msg: err,
    });
  }
};

/*********** Aggregation Pipeline **************/
const getPostsStats = async (req, res) => {
  try {
    // Passing steps to be followed
    const stats = await Posts.aggregate([
      {
        $match: { likes: {$gte: 500}}
      },
      {
        $group: {
          _id: null,
          maxLikes: { $max: "$likes" },
          minLikes: { $min: "$likes" },
        }
      }
    ])

    // send response
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      msg: err,
    });   
  }
}


module.exports = {
  createPost,
  updatePost,
  deletePost,
  getTrendPosts,
  getUserPosts,
  getPost,
  getSearchPost,
  getPostsStats,
};
