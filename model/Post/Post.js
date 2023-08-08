const mongoose= require('mongoose');
const { stringify } = require('querystring');

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please provide a Title'],
        trim:true,
    },
    description:{
        type:String,
        required:[true,'Please provide description'],
        trim:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true,'Post category is required'],
    },
    numViews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    disLikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"

    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Author is required'],
    },
    photo:{
        type:String,
        required:[true,'Post image is required'],
    }
},{
    timestamps : true,
    toJSON:{virtuals:true}
}

);

postSchema.pre(/find/, function(next){

    postSchema.virtual('viewsCount').get(function(){
        const post=this
        return post.numViews.length;
    })
    postSchema.virtual('likesCount').get(function(){
        const post=this
        return post.likes.length;
    })
    postSchema.virtual('disLikesCount').get(function(){
        const post=this
        return post.disLikes.length;
    })

    // postSchema.virtual('likesPercentage').get(function(){
    //     const post=this
    //     const total=+post.likes.length + +post.disLikes.length
    //     const percentage=(post.likes.length/total)*100
    //     return `${percentage}%`
    // })
    // postSchema.virtual('disLikesPercentage').get(function(){
    //     const post=this
    //     const total=+post.likes.length + +post.disLikes.length
    //     const percentage=(post.disLikes.length/total)*100
    //     return `${percentage}%`
    // }
    // )

    postSchema.virtual('likesPercentage').get(function() {
        const post = this;
        const total = Number(post.likes.length) + Number(post.disLikes.length);
        const percentage = (post.likes.length / total) * 100;
        return `${percentage}%`;
      });
      
      postSchema.virtual('disLikesPercentage').get(function() {
        const post = this;
        const total = Number(post.likes.length) + Number(post.disLikes.length);
        const percentage = (post.disLikes.length / total) * 100;
        return `${percentage}%`;
      });
      
    postSchema.virtual('daysAgo').get(function(){
        const post=this
        const date=new Date(post.createdAt)
        const daysAgo=Math.floor((Date.now()-date)/86400000);
        return daysAgo===0 ? 'Today':daysAgo===1 ?'Yesterday':`${daysAgo} days ago`

    }

    )
    next()
})

const Post=mongoose.model("Post",postSchema);
module.exports=Post;