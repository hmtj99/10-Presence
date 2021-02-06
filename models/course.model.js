const mongoose = require('mongoose');
const User = require('./user.model');

const CourseSchema = new mongoose.Schema({
    instructor: {type: mongoose.Types.ObjectId, ref: 'User'},
    title: {type:String, required: true},
    lectures: [{type: mongoose.Types.ObjectId, ref: 'Lecture'}]
},
{
    collection:'courses',
    timestamps:true
}
);

module.exports = mongoose.model('Course',CourseSchema);