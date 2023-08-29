// import model
const Posts = require("../models/postsModel");

// import other functions and classes
const catchAsync = require("../utils/catchAsync")
const APIFeature = require("../utils/apiFeature");
const AppError = require("../utils/appError");


/******************** API Functions *********************/

/********** Create Post **************/
const createPost = catchAsync(async (req, res, next) => {
  const {user_id} = req.params;
  const newPost = await Posts.create({
    user: user_id,
    ...req.body
  });
  res.status(201).json({
    status: "success",
    msg: newPost,
  });
});

/*********** Update Post ************/
const updatePost = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Posts.findByIdAndUpdate(post_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post){
      return next(new AppError("No post found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: { post },
    });
});

/*********** Delete Post ************/
const deletePost = catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Posts.findByIdAndDelete(post_id);
    if (!post){
      return next(new AppError("No post found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
    });
});

/*********** Get Trending Posts **************/
const getTrendPosts = catchAsync(async (req, res, next) => {
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
});

/*********** Get User Posts **************/
const getUserPosts = catchAsync(async (req, res, next) => {
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
});

/*********** Get Post **************/
const getPost = catchAsync(async (req, res, next) => {
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
});

/*********** Get Search Post **************/
const getSearchPost = catchAsync(async (req, res, next) => { 
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
});

/*********** Aggregation Pipeline **************/
const getPostsStats = catchAsync(async (req, res, next) => {
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
});


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
