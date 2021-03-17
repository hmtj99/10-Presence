const mongoose = require('mongoose');
const User = require('./user.model');

const CourseSchema = new mongoose.Schema({
    instructor: {type: mongoose.Types.ObjectId, ref: 'User'},
    title: {type:String, required: true},
    start_of_class: {type:String, required: true},
    end_of_class: {type:String, required: true},
    lectures: [{type: mongoose.Types.ObjectId, ref: 'Lecture'}],
    studentsEnrolled: [{type: mongoose.Types.ObjectId, ref:'Users'}],
    studentsEligibleToEnroll: [{type: mongoose.Types.ObjectId, ref:'Users'}],
    criteria: {type:String, required: true},
},
{
    collection:'courses',
    timestamps:true
}
);

module.exports = mongoose.model('Course',CourseSchema);