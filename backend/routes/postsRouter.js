const express = require('express');
const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(postsController.getTrendPosts)

router  
    .route('/post-stats').get(postsController.getPostsStats)

router  
    .route('/:post_id')
    .get(postsController.getPost)
    .patch(postsController.updatePost)
    .delete(postsController.deletePost)

router  
    .route('/user/:user_id')
    .get(authController.protect, postsController.getUserPosts)
    .post(authController.protect, postsController.createPost)

module.exports = router;