const router = require("express").Router();
const User = require('../models/user.model');
const Course = require('../models/course.model');

router.get('/', async (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }

    const enrolled_courses = [];
    const taught_courses = [];
    for (const courseId of req.user.coursesEnrolledIn) {
        const course = await Course.findById(courseId).lean();
        enrolled_courses.push(course);
    }
    for (const courseId of req.user.coursesTeaching) {
        const course = await Course.findById(courseId).lean();
        taught_courses.push(course);
    }
    res.render('dashboard', { user: req.user, enrolled_courses, taught_courses })
})


//http://localhost:3000/profile/getlecturelist?userId=60319538bc0bc9c95d46a91c
//http://localhost:3000/profile/getlecturelist?userId=604d035ff6da592590f1c655

router.get('/getlecturelist', async (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    try {
        const user_ids = req.query.userId;
        const us = await User.findById(user_ids);

        //console.log(us.courseLectureMap);


        //res.send(us);
        let lecture_attend = [];
        us.courseLectureMap.forEach(item => {
            //console.log(item);
            lecture_attend.push(item);
        });



        // for (var i = 0; i < us.courseLectureMap)
        //console.log(lecture_attend);

        Course.find({ studentsEnrolled: user_ids }, function (err, doc) {

            if (err) {
                console.log(err);
            } else {
                //console.log(doc);

                doc.forEach(item => {
                    // console.log(item);
                    var numberof_lecture_per_course = item.lectures.length;
                    var count_attend_lecture = 0;
                    for (var i = 0; i < numberof_lecture_per_course; i++) {

                        var ok = false;

                        for (var j = 0; j < lecture_attend.length; j++) {

                            //console.log(lecture_attend[j]);
                            //console.log(item.lectures[i]);


                            if (lecture_attend[j].includes(item.lectures[i])) {
                                count_attend_lecture++;
                                ok = true;
                                break;
                            }

                        }

                        console.log(i + " lecture : " + ok);
                    }

                    console.log("Course name  = " + item.title);
                    console.log("attended lecture =  " + count_attend_lecture);
                    console.log("total lecture = " + numberof_lecture_per_course);
                });
            }

        });

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;