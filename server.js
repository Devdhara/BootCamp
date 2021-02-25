const express= require('express');
const dotenv=require('dotenv');
const connectDB= require('./config/db');
const errorHandler= require('./middleware/error');

//load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//route files
const bootcamps = require('./routes/bootcamps');
const { json } = require('express');

//mount router
app.use('/api/v1/bootcamps',bootcamps);

//error handler
app.use(errorHandler);
const PORT= process.env.PORT || 5000;

const server=app.listen(
    PORT,
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
 );

 //handle unhandled promise rejections
 process.on('unhandledRejection', (err,promise) => {
     console.log(`Error Message: ${err.message}`);
     //close server & exit process
     server.close(() => process.exit(1));
 });