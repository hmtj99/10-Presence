const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');
const mongoose = require("mongoose");
const csvtojson = require('csvtojson');
const { Router, json } = require("express");

var fs = require('fs');
var multer = require('multer');
var csv = require('fast-csv');
var upload = multer({dest: 'tmp/csv/'});


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

router.post('/',upload.single('file'),async (req,res) => {
  //  console.log(req.body);
     // create new course
 /*    var fileRows = [], fileHeader;

     // open uploaded file
     csv.fromPath(req.body.file.path)
       .on("data", function (data) {
         fileRows.push(data); // push each row
       })
       .on("end", function () {
         fs.unlinkSync(req.file.path);   // remove temp file
         //process "fileRows"
       });
*/
        console.log(req.body);
        const newCourse = await Course.create({
        instructor: req.user.id,
        title: req.body.Ctitle,
        start_of_class: req.body.start_of_class,
        end_of_class: req.body.end_of_class,
        lectures: [],
        studentsEnrolled: [],
        studentsEligibleToEnroll: [],
        criteria:req.body.criteria,

    });

  //  console.log(req.files)
    /** convert req buffer into csv string , 
*   "EligleStudent" is the name of my file given at name attribute in input tag */
   

    newCourse.save()
    .then(result => {
        res.send('save data to course');
       // res.render('profile',{user : req.user }); 
    })
    .catch(err => {
      console.log(err);
    });

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
