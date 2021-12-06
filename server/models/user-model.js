const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userName:{type: String, required: true},
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        items: { type: [[String]], required: true },
        likes: {type: [[[String],[String]]],required: true},//[People who liked, People who disliked]
        author:{type:[String], required:true},//name list creator
        publishedDate:{type:[String],required:true},//date in string format(Jan 5, 2019)), if unpublushed=("unpublished")
        views:{type: [Number],required:true}, //how many views the list has
        comments:{type:[[String]],required:true} //all comments saved as strings 
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
