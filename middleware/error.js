const ErrorResponse = require('../utils/errorResponse');

 const errorHandler= (err,req,res,next) =>{
    let error= { ...err };
    error.message=error.message;
    //mongoose bad objectID
     if(err.name === 'CastError'){
        const message = `Resource not found with id of ${err.name}`;
        error = new ErrorResponse(message,404);
     }
   res.status(error.statusCode || 500).json({
       success: false,
       error: error.message || 'Server Error'
   }); 
 };
 module.exports= errorHandler;