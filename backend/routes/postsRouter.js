const express = require('express');
const postsController = require('../controllers/postsController');

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
    .get(postsController.getUserPosts)
    .post(postsController.createPost)

module.exports = router;