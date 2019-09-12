const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
    createdAt:{
        type:Date,
        default: new Date()
    },
    content:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    imageUrl:{
        type:String 
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    upvote:{
        type : Array,
        default:[],
    },
    category:{
        type:Array,
        require:true
    },
    materials:{
        type:Array,
        require:true
    },
    level:{
        type:Number,
        require:true
    },
    timetodone:{
        type:Number,
        require:true
    },
    slug:{
        type:Array,
        require:true
    },
    comments: {
        type: Array,
        default: [],
    },
    type:{
        type: String,
        require:true,
    }
})
const postModel = mongoose.model('Posts',PostSchema);
module.exports = postModel;