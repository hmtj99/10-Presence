const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');
const mongoose = require("mongoose");

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};


router.get('/course',authCheck,(req,res)=>{
    res.render('findCourse');
});

router.get('/lecture',authCheck,(req,res)=>{
    res.render('findLecture');
});

router.post('/course',(req,res)=>{
    Course.findOne({ _id: req.body.Cid }).lean().
    then(course => res.json({ course })).
    catch(error => res.json({ error: error.message }));

});


router.post('/lecture',(req,res)=>{
    Lecture.findOne({ _id: req.body.Lid }).lean().
    then(lecture => res.json({ lecture })).
    catch(error => res.json({ error: error.message }));

});


module.exports = router;