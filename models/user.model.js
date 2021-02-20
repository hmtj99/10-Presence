const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type:String,required:true,unique:false},
    name: {type:String},
    googleId: {type: String},
    coursesTeaching: [{type:mongoose.Types.ObjectId, ref: 'Course'}],
    coursesEnrolledIn: [{type:mongoose.Types.ObjectId, ref: 'Course'}],
    courseLectureMap: {
        type: Map,
        of: [mongoose.Types.ObjectId]
    }
},
{
    collection:'users',
    timestamps:true
}
);

module.exports = mongoose.model('User',UserSchema);