const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack    
        })
    // Programming or other unkown error: don't leak error details
    } else {
        // 1. log error
        console.error('Error\n', err);

        // 2. send generic message
        res.status(500).json({
            status: 'error',
            message: "something went wrong"
        })
    }
}

const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,  
    })
}

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateErrorDB = err => {
    const val = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${val}. Please use another value.`
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data ${errors.join('. ')}`;
    return new AppError(message, 400);
}

module.exports = ((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production'){
        let error = {...err}
        if (error.name === 'CastError') error = handleCastErrorDB(error); 
        if (error.code === 11000) error = handleDuplicateErrorDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        
        sendErrorProd(error, res);
    }
})
