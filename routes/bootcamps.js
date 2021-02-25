const express=require('express');

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/m_bootcamps');
const router = express.Router();
//for get and post all bootcamps
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
.route('/')
.get(getBootcamps)
.post(createBootcamp);

//for single bootcamps or with id
router
.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

module.exports=router;