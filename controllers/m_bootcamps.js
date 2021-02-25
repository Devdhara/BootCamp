const Bootcamp=require('../models/m_bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const geocoder =require('../utils/geocoder');
//@des      Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps= async (req,res,next) => {
    let query;
    
    let queryStr=JSON.stringify(req.query);
    queryStr =queryStr.replace(/\b(gt|get|lt|lte|in)\b/g,match => `$${match}`) ;
    
    query=Bootcamp.find(JSON.parse(queryStr));
    
    const bootcamps=await query;
    res.status(200).json({success:true, count: bootcamps.length ,data: bootcamps});
   
};

//@des      Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp= asyncHandler( async (req,res,next) => {
    
        const bootcamps= await Bootcamp.findById(req.params.id);
        if(!bootcamps)
        {
            return next(new ErrorResponse(`Resource not found with id of ${req.parms.id}`,404));
        }
        res.status(200).json({success: true, data: bootcamps});
    
});

//@des      Create/display new/all bootcamp
//@route    POST /api/v1/bootcamps/
//@access   Private
exports.createBootcamp= asyncHandler(async (req,res,next) => {
     console.log(req.body);
    
        const bootcamp =await Bootcamp.create(req.body);
         console.log('done contr');
        res.status(201).json({
        success: true,
        data: bootcamp
        });
    
});

//@des      update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp= asyncHandler(async (req,res,next) => {
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
       
        if(!bootcamp)
            {
                return next(new ErrorResponse(`Resource not found with id of ${req.parms.id}`,404));
            }
            res.status(200).json({success : true, data : bootcamp}); 
});
//@des      Delete a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp= asyncHandler(async (req,res,next) => {
    
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
               
        if(!bootcamp)
            {
                return next(new ErrorResponse(`Resource not found with id of ${req.parms.id}`,404));
            }
            res.status(200).json({success : true,count: bootcamp.count, data : {}}); 
 
});
//@des      Get a bootcamp within a radius
//@route    GET /api/v1/bootcamps/radius/:distance
//@access   Private
 exports.getBootcampsInRadius= asyncHandler(async (req,res,next) => {
    
   const {zipcode,distance}=req.params;
   //Get lat.lng from geocoder
   const loc =await geocoder.geocode(zipcode);
   const lat =loc[0].latitude;
   const lng =loc[0].longitude;

   //cal radius radians
   //divide distance by radius of earth
   //earth Radius=3,963 mi / 6,378.1 km
   const radius =distance / 3963;

   const bootcamps = await Bootcamp.find({
       location: {$geoWithin: {$centerSphere: [ [lng,lat],radius]}}
    });
    res.status(200).json({
        success: true,
        count:  bootcamps.length,
        data: bootcamps

    });
}); 