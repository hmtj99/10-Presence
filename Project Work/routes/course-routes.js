const router = require("express").Router();
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Lecture = require('../models/lecture.model');
let converter = require('json-2-csv');
const {
    generateTokenFromUserAndLecture,
    getEmailTemplate,
    getMarkAttendanceURL,
    transporter,
    generateTokenFromUserAndCourse,
    getInvitationURL,
    getCourseInvitationEmailTemplate,
} = require('../modules/email');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret = 'asdnalsdlashliahciiaslhclshclisahlijdlasjldjsaldbxzbcasdasdasdas';
const csv = require('csvtojson');
const { Router, json } = require("express");

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });


const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/lecture', authCheck, async (req, res) => {
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

router.get('/sendLectureAttendanceLinks', async (req, res) => {
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

router.get('/markAttendance', async (req, res) => {
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



router.get('/getAttendance', async (req, res) => {
    courseId = req.query.courseId;
    let course;

    try {
        course = await Course.findById(courseId);

    } catch (error) {
        return res.json({ status: "error", message: "Course not found" });
    }
    const data = [];
    if (course.instructor.toString() === req.user._id.toString()) {
        const students = course.studentsEnrolled;
        const totalLectures = course.lectures.length;
        if (totalLectures === 0) {
            return res.json({ status: "error", message: "No lectures have been taken in this course" });
        }
        for (const studentId of students) {
            student = await User.findById(studentId);
            if (!student.courseLectureMap) {
                continue;
            }
            const attendedLectures = student.courseLectureMap.get(course._id.toString()).length;
            percentage = ((attendedLectures / totalLectures) * 100).toFixed(2);
            data.push({
                id: student.email.split("@")[0],
                name: student.name,
                attendance: percentage,
            })
        }
        console.log(data);

    } else {
        return res.json({ status: "error", message: "The data can only be accessed by the instructor" });
    }

    converter.json2csv(data, (err, csv) => {
        if (err) {
            console.log(err);
            return res.json({ status: "error", message: "Error sending CSV" });
        }
        console.log(csv);
        res.setHeader('Content-Type', 'text/csv');
        res.attachment('data.csv');
        return res.send(csv);
    })
})

router.get('/createCourse', authCheck, (req, res) => {
    res.render('NewCourse');
})

router.get('/AllCourse', authCheck, (req, res) => {
    Course.find({ instructor: req.user._id }).sort({ createdAt: -1 })
        .then(result => {
            res.render('AllCourse', { Courses: result });
        })
        .catch(err => {
            console.log(err);
        });
})

// http://localhost:3000/course/createLecture/609427b182ebff21b49869b3
router.get('/createLecture/:id', authCheck, (req, res) => {
    const id = req.params.id;
    console.log(id);
    Course.findById(id)
        .then(result => {
            res.render('NewLecture', { Course: result });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/NewLecture', async (req, res) => {
    console.log(req.body);
    const array = await Course.findById(req.body.course);
    console.log(array);
    if (array) {
        const newLec = await Lecture.create({
            course: array._id,
            title: req.body.Ltitle,
            start_of_lecture: req.body.start_of_lecture,
            end_of_lecture: req.body.end_of_lecture,
        });
        array.lectures.push(newLec._id);
        console.log(array);
        array.save();
        return res.redirect(`sendLectureAttendanceLinks?lectureId=${newLec._id}`);
    }
});

router.post('/', upload.single('EligibleStudent'), async (req, res) => {
    const array = await csv().fromFile(req.file.path);
    console.log(array);
    let Es = [];
    for (const n of array) {
        console.log(n.Gmail);
        const user = await User.findOne({ email: n.Gmail }).exec();
        if (user) {
            Es.push(user._id);
        }
    }
    console.log(Es);
    console.log("this es", Es);
    const newCourse = await Course.create({
        instructor: req.user.id,
        title: req.body.Ctitle,
        start_of_class: req.body.start_of_class,
        end_of_class: req.body.end_of_class,
        lectures: [],
        studentsEnrolled: [],
        studentsEligibleToEnroll: Es,
        criteria: req.body.criteria,
    });
    fs.unlinkSync(req.file.path);

    for (const userId of Es) {
        const user = await User.findById(userId);
        sendInvitationLink(user, newCourse);
    }

    res.send("done");
});

router.get('/findCourse/:id', (req, res) => {
    Course.findOne({ _id: req.params.id }).lean().
        then(course => res.json({ course })).
        catch(error => res.json({ error: error.message }));

});


router.get('/findLecture/:id', (req, res) => {
    Lecture.findOne({ _id: req.params.id }).lean().
        then(lecture => res.json({ lecture })).
        catch(error => res.json({ error: error.message }));

});



// http://localhost:3000/course/getattendancecriteria?courseId=60450eaa7ce02484799abc5f

router.get('/getattendancecriteria', async (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    try {

        const cid = req.query.courseId;
        const course_detail = await Course.findById(cid);
        res.send('Attendance Criteria = ' + course_detail.criteria);

    } catch (error) {
        console.log(error);
    }
})

router.get('/addStudentToCourse', async (req, res) => {
    try {
        const token = req.query.token;
        const { courseId, userId } = jwt.verify(token, secret);
        const course = await Course.findById(courseId);
        if (course.studentsEligibleToEnroll.includes(userId)) {
            if (course.studentsEnrolled.includes(userId)) {
                return res.json({ message: "You are already enrolled in the course" });
            }
            course.studentsEnrolled.push(userId);
            course.save();
            return res.json({ message: "Student added to course" });
        } else {
            return res.json({ message: "Student not eligible to enroll" });
        }
    }
    catch (error) {
        console.log(error);
        res.json(error);
    }
})

const sendInvitationLink = async (user, course) => {
    const token = await generateTokenFromUserAndCourse(user._id, course._id);
    const url = getInvitationURL(user, token);
    const emailTemplate = getCourseInvitationEmailTemplate(user, course, url);
    await transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(`Email sent to ${user.email}`);
    });
}


module.exports = router;