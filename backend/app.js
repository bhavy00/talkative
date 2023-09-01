const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const postRouter = require('./routes/postsRouter');
const userRouter = require('./routes/userRouter');
const commentRouter = require('./routes/commentRouter');
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `can't find ${req.originalUrl} on this server`
    // })

    const err = new Error(`can't find ${req.originalUrl} on this server`)
    err.statusCode = 404
    err.status = 'fail'

    next(new AppError(err));
})

app.use(globalErrorHandler)

module.exports = app