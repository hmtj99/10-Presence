const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');

const mongoose = require('mongoose');

router.get('/', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    res.render('profile', { user: req.user })
})



//http://localhost:3000/profile/getlecturelist?userId=60319538bc0bc9c95d46a91c

router.get('/getlecturelist', async(req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    try {
        const user_ids = req.query.userId;
        const us = await User.findById(user_ids);

        console.log(us.courseLectureMap);
        //res.send(us);
        /* var course_attend = [];
        us.courseLectureMap.forEach(item => {
            console.log(item);
        });

        */

        Course.find({ studentsEnrolled: user_ids }, function(err, doc) {

            if (err) {
                console.log(err);
            } else {
                console.log(doc);

                doc.forEach(item => {
                    console.log(item);
                });




            }


        });





    } catch (error) {
        console.log(error);
    }
})

module.exports = router;