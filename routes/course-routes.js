const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');
const mongoose = require("mongoose");

// Work in progress - Code for testing 
router.get('/', async (req,res) => {
    if(!req.user){
        res.redirect('/auth/login');
        return;
    }
    try{
        const doc = await Course.create({
            instructor: req.user.id,
            title: 'test course 1',
            lectures: []
        });
        const currentUser = await User.findById(req.user.id);
        currentUser.coursesTeaching.push(doc._id);
        currentUser.save();
        res.send("Course created");
    }
    catch(error){
        console.log(error);
    }
})

router.get('/lecture', async (req,res) => {
    if(!req.user){
        res.redirect('/auth/login');
        return;
    }
    try{
        const course = await Course.findOne();
        const doc = await Lecture.create({
            course: course._id,
            title: 'test lecture 1',
            studentsEnrolled: [],
            studentEligibleToEnroll: [],
        });
        course.lectures.push(doc._id);
        course.save();
        res.send("Lecture created");
    }
    catch(error){
        console.log(error);
    }
})


module.exports = router;