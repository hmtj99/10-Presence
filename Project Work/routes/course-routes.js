const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');
const {
    generateTokenFromUserAndLecture,
    getEmailTemplate,
    getMarkAttendanceURL,
    transporter,
} = require('../modules/email');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret = 'asdnalsdlashliahciiaslhclshclisahlijdlasjldjsaldbxzbcasdasdasdas';

// Work in progress - Code for testing 
router.get('/', async(req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    try {
        const doc = await Course.create({
            instructor: req.user.id,
            title: 'test course 1',
            lectures: [],
            studentsEnrolled: [mongoose.Types.ObjectId('60319538bc0bc9c95d46a91c'), mongoose.Types.ObjectId('601fff7b30add2b29e08c547')],
            studentsEligibleToEnroll: [mongoose.Types.ObjectId('60319538bc0bc9c95d46a91c'), mongoose.Types.ObjectId('601fff7b30add2b29e08c547')],
        });
        const currentUser = await User.findById(req.user.id);
        currentUser.coursesTeaching.push(doc._id);
        currentUser.save();
        res.send("Course created");
    } catch (error) {
        console.log(error);
    }
})

router.get('/lecture', async(req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    try {
        const course = await Course.findOne();
        const doc = await Lecture.create({
            course: course._id,
            title: 'test lecture email 2',
        });
        course.lectures.push(doc._id);
        course.save();
        res.send("Lecture created");
    } catch (error) {
        console.log(error);
    }
})

// http://localhost:3000/course/sendLectureAttendanceLinks?lectureId=6045362a668a248c19e2943b

router.get('/sendLectureAttendanceLinks', async(req, res) => {
    const lectureId = req.query.lectureId;
    const lecture = await Lecture.findById(lectureId);
    const course = await Course.findById(lecture.course);
    const studentsEnrolled = course.studentsEnrolled;

    for (const studentId of studentsEnrolled) {
        const student = await User.findById(studentId);
        console.log(`Student - ${student._id}, Lecture - ${lecture._id}, Course - ${course._id}`);

        const token = await generateTokenFromUserAndLecture(student._id, lecture._id, course._id);
        const url = getMarkAttendanceURL(student, token);
        const emailTemplate = getEmailTemplate(student, lecture, url);
        await transporter.sendMail(emailTemplate, (err, info) => {
            if (err) {
                console.log(err);
                return res.json({ status: 'error', message: 'Error while sending link to user' });
            }
            console.log(`Email sent to ${user.email}`);
        })
    }
    return res.json({ status: 'ok', message: 'All mails sent' });
})

router.get('/markAttendance', async(req, res) => {
    const token = req.query.token;
    const userId = req.query.userId;

    let user
    try {
        user = await User.findById(userId).exec();
    } catch (error) {
        return res.json({ status: 'error', message: "User not found" });
    }

    let payload
    try {
        payload = await jwt.verify(token, secret);
    } catch (error) {
        return res.json({ status: 'error', message: "Link used/expired" });
    }
    console.log(user);
    if (payload.userId === user._id.toString()) {
        try {
            const lectureArray = user.courseLectureMap.get(payload.courseId);
            if (lectureArray) {
                if (lectureArray.includes(mongoose.Types.ObjectId(payload.lectureId))) {
                    return res.json({ status: 'error', message: 'Attendance already marked' });
                }
                user.courseLectureMap.set(payload.courseId, [...lectureArray, payload.lectureId]);
            } else {
                user.courseLectureMap.set(payload.courseId, [payload.lectureId]);
            }
            await user.save();
        } catch (error) {
            return res.json({ status: 'error', message: "Error marking attendance" });
        }
    }

    res.send("<h1>Attendance Marked</h1>");

})

// http://localhost:3000/course/getattendancecriteria?courseId=60450eaa7ce02484799abc5f

router.get('/getattendancecriteria', async(req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    try {

        const cid = req.query.courseId;

        //console.log(cid);

        const course_detail = await Course.findById(cid);

        //console.log(course_detail);
        res.send('Attendance Criteria = ' + course_detail.title);

        //res.send('Attendance Criteria = ' + course_detail.criteria);


    } catch (error) {
        console.log(error);
    }
})







module.exports = router;