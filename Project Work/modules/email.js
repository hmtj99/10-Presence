const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const NEW_PASSWORD_TOKEN_EXPIRY_DURATION = '5m';
const BASE_URL = 'http://localhost:3000';
const JWTSECRET = 'asdnalsdlashliahciiaslhclshclisahlijdlasjldjsaldbxzbcasdasdasdas';

const generateTokenFromUserAndLecture = (userId, lectureId, courseId) => {
    const secret = JWTSECRET;
    const token = jwt.sign({ userId, courseId, lectureId }, secret, {
        expiresIn: NEW_PASSWORD_TOKEN_EXPIRY_DURATION,
    });
    return token;
}

const generateTokenFromUserAndCourse = (userId, courseId) => {
    const secret = JWTSECRET;
    const token = jwt.sign({ userId, courseId }, secret);
    return token;
}

const getMarkAttendanceURL = (user, token) => {
    return `${BASE_URL}/course/markAttendance?token=${token}&userId=${user._id}`;
}

const getInvitationURL = (user, token) => {
    return `${BASE_URL}/course/addStudentToCourse?token=${token}&userId=${user._id}`;
}

const getEmailTemplate = (user, lecture, url) => {
    const from = keys.EMAIL_LOGIN
    const to = user.email
    const subject = "Mark Attendance"
    const html = `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Mark Attendance</title>
        <meta name="description" content="Mark Attendance Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                       
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Mark Your Attendance For This Lecture</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">   
                                             Hey ${user.email.split('@')[0]},
                                            </p>
                                            <p style="color:#455056; font-size:15px;line-height:24px;margin-top:35px;">
                                                Mark Your Attendance for the Lecture - ${lecture.title}                                          
                                            </p>
                                            <a href="${url}"
                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Mark Attendance</a>              
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin-top:35px;">
                                                The link will only be active for 5 mins, Please mark your attendance before it.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>Powered by Presence, 2021</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`

    return { from, to, subject, html }
}

const getCourseInvitationEmailTemplate = (user, course, url) => {
    const from = keys.EMAIL_LOGIN
    const to = user.email
    const subject = "You are invited to a new course"
    const html = `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>You are invited to a new course</title>
        <meta name="description" content="Course Invitation Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                       
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You are invited to a New Course</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">   
                                             Hey ${user.email.split('@')[0]},
                                            </p>
                                            <p style="color:#455056; font-size:15px;line-height:24px;margin-top:35px;">
                                                You are invited to a new course - ${course.title}                                          
                                            </p>
                                            <a href="${url}"
                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Join Course</a>              
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin-top:35px;">
                                                Please click the link to join the course and start tracking your attendance
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>Powered by Presence, 2021</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`

    return { from, to, subject, html }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: keys.EMAIL_LOGIN,
        pass: keys.EMAIL_PASSWORD
    }
});

module.exports = {
    generateTokenFromUserAndLecture,
    getEmailTemplate,
    getMarkAttendanceURL,
    transporter,
    getCourseInvitationEmailTemplate,
    getInvitationURL,
    generateTokenFromUserAndCourse
}