const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const { appErr } = require("../../utils/appErr");


const commentCreateCtrl=async(req,res,next)=>{
    try{
        const {description,}=req.body
        const post=await Post.findById(req.params.id)
        const comment=await Comment.create({
            post:post._id,
            description,
            user:req.userAuth
        })
        post.comments.push(comment._id)
        const user=await User.findById(req.userAuth)
        user.comments.push(comment._id)
        await post.save({
            validateBeforeSave:false
        })
        await user.save({
             validateBeforeSave:false

        })
        res.json({
            status:"success",
            data:comment,
        });}
        catch (error){
            next(appErr(error.message));
        }
}

const commentCtrl=async(req,res,next)=>{
    try{
        res.json({
            status:"success",
            data:"comment route",
        });}
        catch (error){
            next(appErr(error.message));
        }
}

const commentUpdateCtrl=async(req,res,next)=>{
    const {description}=req.body
    try{
        const comment=await Comment.findById(req.params.id)
        if (!comment) {
            return next(appErr("Comment not found", 404));
          }
        if(comment.user.toString() !==req.userAuth.toString()){
            return next(appErr("You are not allowed to update the comment as you're not the owner of the comment",403))
        }
        const category=await Comment.findByIdAndUpdate(req.params.id,{
            description
        },{
            new:true,
            runValidators:true
        })

        res.json({
            status:"success",
            data:category,
        });}
        catch (error){
            return next(appErr(error.message));    
        }
}

const commentDeleteCtrl=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.id)
        if (!comment) {
            return next(appErr("Comment not found", 404));
          }
        if(comment.user.toString() !==req.userAuth.toString()){
            return next(appErr("You are not allowed to update the comment as you're not the owner of the comment",403))
        }
        await Comment.findByIdAndDelete(req.params.id)
        res.json({
            status:"success",
            data:comment,
        });}
        catch (error){
            next(appErr(error.message));
        }
}


module.exports={
    commentCreateCtrl,commentCtrl,commentUpdateCtrl,commentDeleteCtrl
}