const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    course: {type: mongoose.Types.ObjectId, ref: 'Course'},
    title: {type:String, required: true},
    start_of_lecture: {type:String, required: true},
    end_of_lecture: {type:String, required: true},
 
},
{
    collection:'lectures',
    timestamps:true
}
);

module.exports = mongoose.model('Lecture',LectureSchema);