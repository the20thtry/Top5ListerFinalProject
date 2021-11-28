const mongoose = require('mongoose')
const { stringify } = require('querystring')
const Schema = mongoose.Schema

const PublishedTop5ListSchema = new Schema(
    {
        name: { type: String, required: true },//name of the list
        items: { type: [String], required: true },//[items0,1,2,3,4,]
        likes: {type: [[String],[String]],required: true},//[People who liked, People who disliked]
        author:{type:String, required:true},//name list creator
        publishedDate:{type:String,required:true},//date in string format(Jan 5, 2019)), if unpublushed=("unpublished")
        views:{type: Number,required:true}, //how many views the list has
        comments:{type:[String],required:true}, //all comments saved as strings 
        email:{type:String,required:true} //email of the creator 
    },
    { timestamps: true },
)

module.exports = mongoose.model('PublishedTop5List', PublishedTop5ListSchema)
