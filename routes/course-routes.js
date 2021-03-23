const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');
const mongoose = require("mongoose");
const csv=require('csvtojson');
const { Router, json } = require("express");

const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'tmp/csv/'});


const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};
router.get('/NewCourse',authCheck,(req,res) => {
    res.render('NewCourse');
})

router.get('/AllCourse',authCheck,(req,res) => {
    Course.find({ instructor: req.user._id }).sort({ createdAt: -1 })
    .then(result => {
      res.render('AllCourse', { Courses: result });
    })
    .catch(err => {
      console.log(err);
    });
})


router.post('/',upload.single('EligibleStudent'),async (req,res) =>{
const array =await csv().fromFile(req.file.path);
console.log(array);
let Es=[];
for(const n of array){
    console.log(n.Gmail);
    const user =await User.findOne({email : n.Gmail}).exec();
    if(user){
        Es.push(user._id);
    }
}
console.log(Es);
console.log("this es",Es);
const newCourse =await Course.create({
    instructor: req.user.id,
    title: req.body.Ctitle,
    start_of_class: req.body.start_of_class,
    end_of_class: req.body.end_of_class,
    lectures: [],
    studentsEnrolled: [],
    studentsEligibleToEnroll:Es,
    criteria:req.body.criteria,
});
fs.unlinkSync(req.file.path);
res.send("done");
})



module.exports = router;

/*
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
*/
