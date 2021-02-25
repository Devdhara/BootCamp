const mongoose= require('mongoose');
const { default: slugify } = require('slugify');
const sulgify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootCampSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please enter name'],
        unique: true,
        trim: true,
        maxlength: [50,'Name cannot be more than 50 characters' ]
    },
    slug: String,
    description: {
        type: String,
        required: [true,'Please enter description'],
        maxlength: [500,'Name cannot be more than 50 characters' ]
    },
    website: {
        type: String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
               'Please use a valid server(HTTP or HTTPS)']
    },
    phone: {
        type: String,
        maxlength:[15,'Phone number cannot be more than 10 digits' ]
    },
     email: {
         type: String,
         match:[ /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Please enter a valid email']
     },
     address: {
         type: String,
         maxlength:[100,'Address should not be less than 100 characters']
     },
    location: 
    {
        //GeoJSON
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
        formattedAddress: String,
        street: String,
        city: String,
        state:String,
        zipcode: String,
        country: String 
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type:Number,
        min: [1,'Rating must be atleast 1'],
        max: [10,'Rating cannot be more than 10']
    },
    averageCost:Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'

    },
    housing:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGuarentee:{
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});
// create bootcamp slug from the name

/*   BootCampSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true});
}); */  

//Geocode and create location field
 BootCampSchema.pre('save', async function(next) {
 const loc = await geocoder.geocode(this.address);
 console.log(loc);
 this.location={
     type: 'Point',
     coordinates: [loc[0].longitude,loc[0].latitude],
     formattedAddress: loc[0].formattedAddress,
     street:loc[0].streetName,
     city: loc[0].city,
     state: loc[0].stateCode,
     zipcode: loc[0].zipcode,
     country: loc[0].countryCode

    };
    next();   
});
   //do not save address to DB
   this.address=undefined;
 

module.exports=mongoose.model('bootcamps',BootCampSchema);

