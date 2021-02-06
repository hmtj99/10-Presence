const mongoose = require('mongoose');
const Course = require('./course.model');

const LectureSchema = new mongoose.Schema({
    course: {type: mongoose.Types.ObjectId, ref: 'Course'},
    title: {type:String, required: true},
    studentsEnrolled: [{type: mongoose.Types.ObjectId, ref:'Users'}],
    studentsEligibleToEnroll: [{type: mongoose.Types.ObjectId, ref:'Users'}],
},
{
    collection:'lectures',
    timestamps:true
}
);

module.exports = mongoose.model('Lecture',LectureSchema);