const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const { appErr } = require("../../utils/appErr");





const postCreateCtrl=async(req,res,next)=>{
    const {title,description,category}=req.body
    try{
        const author=await User.findById(req.userAuth)
        if(author.isBlocked){
            return next(appErr("Access denied, Account Blocked,403"))
        }

        const postCreated=await Post.create({
            title,
            description,
            user:author._id,
            category,
            photo:req?.file?.path
        });
        author.posts.push(postCreated);
        await author.save();
        res.json({
            status:"success",
            data:postCreated,
        });}

        catch (error){
next(appErr(error.message));
        }
}
const postCtrl=async(req,res,next)=>{
    try{
        const post=await Post.findById(req.params.id)
        const isViewed=post.numViews.includes(req.userAuth)
        if(isViewed)  {
            res.json({
                status:"success",
                data:post,
            })
        }else{
            post.numViews.push(req.userAuth)
            await post.save()
            res.json({
                status:"success",
                data:post,
            });
        }

        }
        catch (error){
next(appErr(error.message));
        }
}

const postAllCtrl=async(req,res,next)=>{
    try{
        const posts=await Post.find({}).populate('user').populate('category','title');
        
        const filteredPosts=posts.filter(post=>{
        const blockedUsers=post.user.blocked
        const isBlocked=blockedUsers.includes(req.userAuth)
        return isBlocked ? null  :post;
        })
        res.json({
            status:"success",
            data:filteredPosts,
        });}
        catch (error){
next(appErr(error.message));
        }
}

// const toggleLikesPostCtrl=async(req,res,next)=>{
//     try{
//         const post=await Post.findById(req.params.id)
//         const isLiked=post.likes.includes(req.userAuth);
//         if(isLiked){
//             post.likes=post.likes.filter(like=>{
//                like.toString() != req.userAuth.toString() 
//             })
//             await post.save();
//         }else{
//             post.likes.push(req.userAuth)
//             await post.save()
//         }
//         res.json({
//             status:"success",
//             data:post,
//         });}
//         catch (error){
// next(appErr(error.message));
//         }
// }
// const toggleDislikesPostCtrl=async(req,res,next)=>{
//     try{
//         const post=await Post.findById(req.params.id)
//         const isUnliked=post.disLikes.includes(req.userAuth);
//         if(isUnliked){
//             post.disLikes=post.disLikes.filter(disLike=>{
//                disLike.toString() != req.userAuth.toString() 
//             })
//             await post.save();
//         }else{
//             post.disLikes.push(req.userAuth)
//             await post.save()
//         }
//         res.json({
//             status:"success",
//             data:post,
//         });}
//         catch (error){
// next(appErr(error.message));
//         }
// }

const toggleLikesPostCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        const isLiked = post.likes.includes(req.userAuth);
        const isDisliked = post.disLikes.includes(req.userAuth);
        
        if (isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString());
        } else {
            post.likes.push(req.userAuth);
        }
        
        if (isDisliked) {
            post.disLikes = post.disLikes.filter(disLike => disLike.toString() !== req.userAuth.toString());
        }
        
        await post.save();
        
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const toggleDislikesPostCtrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        const isLiked = post.likes.includes(req.userAuth);
        const isDisliked = post.disLikes.includes(req.userAuth);
        
        if (isDisliked) {
            post.disLikes = post.disLikes.filter(disLike => disLike.toString() !== req.userAuth.toString());
        } else {
            post.disLikes.push(req.userAuth);
        }
        
        if (isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString());
        }
        
        await post.save();
        
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        res.json(error.message);
    }
};


const postDeleteCtrl=async(req,res,next)=>{
    try{
        

        const post=await Post.findById(req.params.id)
        if (!post) {
            return next(appErr("Post not found", 404));
          }
        if(post.user.toString() !==req.userAuth.toString()){
            return next(appErr("You are not allowed to delete the post as you're not the owner of the post",403))
        }
        const postUserId=post.user
        await Post.findByIdAndDelete(req.params.id);
        const user=await User.findById(postUserId)
         if (user) {
      user.posts.pull(req.params.id);
      await user.save();
    }
        res.json({
            status:"success",
            data:"Post deleted successfully",
        });}
        catch (error){
next(appErr(error.message));
        }
}
const postUpdateCtrl=async(req,res,next)=>{
    const {title,description,category}=req.body
    try{
        const post=await Post.findById(req.params.id)
        if (!post) {
            return next(appErr("Post not found", 404));
          }
        if(post.user.toString() !==req.userAuth.toString()){
            return next(appErr("You are not allowed to edit post as you're not the owner of the post",403))
        }
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
            title,
            description,
            category,
            photo:req?.file?.path,

        },{
            new:true
        })
        res.json({
            status:"success",
            data:updatedPost
        });}
        catch (error){
next(appErr(error.message));
        }
}

module.exports={
    postCreateCtrl,postCtrl,postAllCtrl,postDeleteCtrl,postUpdateCtrl,toggleLikesPostCtrl,toggleDislikesPostCtrl
}