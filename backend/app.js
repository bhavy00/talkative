const express = require('express');

const app = express();


// ROUTES
app.use('/api/v1/users');
app.use('/api/v1/posts');
app.use('api/v1/comments');

module.exports = app