// import model
const Posts = require("../models/postsModel");

/******************** API Functions *********************/

/********** Create Post **************/
const createPost = async (req, res) => {
  try {
    const newPost = await Posts.create(req.body);
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
      msg: err,
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
      msg: err,
    });
  }
};

/*********** Get Search Post **************/
const getSearchPost = async (req, res) => {
  try {
    // Build Query
    // 1. Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el=> delete queryObj[el]);

    // 2. Advance filtering 
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Posts.find(JSON.parse(queryStr));
    
    // 3. Sorting 
    if (req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy)
    } else {
      query = query.sort('-date')
    }

    // 4. Field limiting 
    if (req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v')
    }

    // Pagination 
    const page = req.query.page*1||1;
    const limit = req.query.limit*1||100;
    const skip = (page-1)*limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numPosts = await Posts.countDocuments()
      if (skip >= numPosts) throw new Error('This page does not exist')
    }
    
    // Execute query
    const post = await query 
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

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getTrendPosts,
  getUserPosts,
  getPost,
  getSearchPost,
};
