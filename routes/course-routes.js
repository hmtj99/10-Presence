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

router.get('/:id',authCheck, (req, res) => {
    const id = req.params.id;
    console.log(id);
    Course.findById(id)
      .then(result => {
        res.render('NewLecture',{Course : result});
      })
      .catch(err => {
        console.log(err);
      });
  });

router.post('/NewLecture',async (req,res)=>{
  const array = await Course.findById(req.body.course);
  console.log(array); 
  if(array){
      const newLec =await Lecture.create({
      course:array._id,
      title: req.body.Ltitle,
      start_of_lecture: req.body.start_of_lecture,
      end_of_lecture: req.body.end_of_lecture,
    });
    array.lectures.push(newLec._id);
    console.log(array);
    array.save();
  
  }
  res.send("all done");


        /*
    const id = req.body.course;
    console.log("this post",id);
    Course.findById(id)
    .then(result => {
            console.log("this is result",result)
            const newLec =Lecture.create({
            course:result._id,
            title: req.body.Ltitle,
            start_of_lecture: req.body.start_of_lecture,
            end_of_lecture: req.body.end_of_lecture,
        });
            result.lectures.push(newLec._id);
            result.save();
            res.send("all done");
        })
      .catch(err => {
        console.log(err);
      });
    */});

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
});

module.exports = router;

