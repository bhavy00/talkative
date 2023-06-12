// import model
const Posts = require("../models/postsModel");

/******************** API Functions *********************/

/********** Create Post **************/
const createPost = async (req, res) => {
  try {
    const newPost = await Posts.create(req.body);
    res.status(201).json({
      status: "success",
      msg: newUser,
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
    const trendPosts = await Posts.find();
    res.status(200).json({
      status: "success",
      results: trendPosts.length,
      data: {
        trendPosts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      mas: err,
    });
  }
};

/*********** Get User Posts **************/
const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userPosts = await Posts.find({ user_id: user_id });
    res.status(200).json({
      status: "success",
      results: userdPosts.length,
      data: {
        userPosts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      mas: err,
    });
  }
};

/*********** Get Post **************/
const getPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await Posts.findById(post_id);
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      mas: err,
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getTrendPosts,
  getUserPosts,
  getPost,
};
