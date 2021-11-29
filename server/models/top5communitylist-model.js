const mongoose = require('mongoose')
const { stringify } = require('querystring')
const Schema = mongoose.Schema

const Top5CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },//name of the list
        items: { type: [String], required: true },//[items0,1,2,3,4,]
        likes: {type: [[String],[String]],required: true},//[People who liked, People who disliked]
        author:{type:String, required:true},//name list creator
        publishedDate:{type:String,required:true},//date in string format(Jan 5, 2019)), if unpublushed=("unpublished")
        views:{type: Number,required:true}, //how many views the list has
        comments:{type:[String],required:true}, //all comments saved as strings 
        votes:{type:[String],required:true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5CommunityList', Top5CommunityListSchema)
