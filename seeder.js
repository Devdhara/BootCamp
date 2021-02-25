const fs= require('fs');
const  mongoose  = require('mongoose');
const color = require('colors');
const dotenv = require('dotenv');


//load env vars
dotenv.config({path:'./config/config.env'});

//load models
const BootCampSchema = require('./models/m_bootcamp');

//connect to DB

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}); 

//read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,`utf-8`));

//import into DB
const importData = async() => {
   
    try {
       await BootCampSchema.create(bootcamps);
        console.log('data imported'.green.inverse);
        process.exit();

    } catch (error) {
        console.error(error);
    }

};

//delete data
const deleteData = async() => {
    try {
        await BootCampSchema.deleteMany();
        console.log('Data destroyed'.red.inverse);
        process.exit();
    } catch (error) {
    console.log(error);
    }
};
if(process.argv[2] === '-i')
{
    console.log('heloppp');
    importData();
}
else if(process.argv[2] === '-d')
{
    deleteData();
}