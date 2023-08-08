const bcrypt=require('bcryptjs');
const User = require("../../model/User/User");
const generateToken = require('../../utils/generateToken');
const getTokenFromHeader = require('../../utils/getTokenFromHeader');
const {appErr,AppErr} = require('../../utils/appErr');
const Post = require('../../model/Post/Post');
const Category = require('../../model/Category/Category');
const Comment = require('../../model/Comment/Comment');


const userRegisterCtrl= async(req,res,next)=>{
    const {firstname,lastname,email,password}=req.body;
    // console.log(req.body);
    try{
        const userFound=await User.findOne({email});
        if(userFound){
            return  next(new AppErr("User Already Exist!!",500))
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
        const user=await User.create({
            firstname,
            lastname,
            email,
            password:hashedPassword,
        })


        res.json({
            status:"success",
            data:user,
        });}
        catch (error){
            next(appErr(error.message));
        }
}
const userLoginCtrl=async(req,res,next)=>{
    const {email,password}=req.body;

    try{
        const emailFound=await User.findOne({email});
        if(!emailFound){
         return next(appErr("Invalid login credentials",404))
        }
        const passwordMatched=await bcrypt.compare(password,emailFound.password)
        if(!passwordMatched) {
            return next(appErr("Invalid login credentials",404))

        }
        res.json({
            status:"success",
            data:{
                firstname:emailFound.firstname,
                lastname:emailFound.lastname,
                email:emailFound.email,
                isAdmin:emailFound.isAdmin,
                token:generateToken(emailFound._id),
            }
        });}
        catch (error){
            next(appErr(error.message));
        }
}
const whoViewedMyProfileCtrl=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id);

        const userWhoViewed=await User.findById(req.userAuth);

        if(user && userWhoViewed){
            const isUserAlreadyViewed=user.viewers.find(viewers=>viewers.toString()
            ==userWhoViewed._id.toJSON()
            );
            if(isUserAlreadyViewed){
                return next(appErr("You have already viewed this profile!!"));
            }else{
                user.viewers.push(userWhoViewed._id);
                await user.save()
                res.json({
                    status:"success",
                    data:"you have successfully viewed my profile",
                });
            }
        }
       }
        catch (error){
            next(appErr(error.message));
        }
}

const followingCtrl=async(req,res,next)=>{
    try{
        const userToFollow=await User.findById(req.params.id);

        const userWhoFollowed=await User.findById(req.userAuth);

        if(userToFollow&&userWhoFollowed){
            const userAlreadyFollowed=userToFollow.following.find(follower=>follower.toString()==userWhoFollowed._id.toString()
            );
            if(userAlreadyFollowed){
                return next(appErr("You are already following the user!!",))
            }else{
                userToFollow.followers.push(userWhoFollowed._id);
                userWhoFollowed.following.push(userToFollow._id);

                await userWhoFollowed.save();
                await userToFollow.save();
                res.json({
                    status:"success",
                    data:"You have successfully followed this user!",
                })
            }
        }
        ;}
        catch (error){
            next(appErr(error.message));
        }
}
const unFollowCtrl=async(req,res,next)=>{
    try{
        const userToBeUnfollowed=await User.findById(req.params.id);

        const userWhoUnfollowed=await User.findById(req.userAuth);

        if(userToBeUnfollowed&&userWhoUnfollowed){
            const isUserAlreadyFollowed=userToBeUnfollowed.followers.find(follower=>follower.toString()
            ==userWhoUnfollowed._id.toString()
            );
            if(!isUserAlreadyFollowed){
                return next(appErr("You are not following this user to begin with!!"))
            }else{

                userToBeUnfollowed.followers=userToBeUnfollowed.followers.filter(follower=>follower.toString()
                !==userWhoUnfollowed._id.toString());
                await userToBeUnfollowed.save();
                userWhoUnfollowed.following=userWhoUnfollowed.following.filter(following=>following.toString()
                !==userToBeUnfollowed._id.toString());
                await userWhoUnfollowed.save();
                res.json({
                    status:"success",
                    data:"unfollowed successfully",
                });
            }
        }
        }
        catch (error){
            next(appErr(error.message));
        }
}
const usersCtrl=async(req,res,next)=>{
    try{
        const users=await User.find()
        res.json({
            status:"success",
            data:users,
        });}
        catch (error){
            next(appErr(error.message));
        }
}

const blockUserCtrl=async(req,res,next)=>{
    try{
        const userToBeBlocked=await User.findById(req.params.id);
        const userWhoBlocked=await User.findById(req.userAuth);
        if(userWhoBlocked && userToBeBlocked){
            const isUserAlreadyBlocked=userWhoBlocked.blocked.find(blocked=>blocked.toString()==
            userToBeBlocked._id.toString());
            if(isUserAlreadyBlocked){
                return next(appErr("You already blocked the user!!",404));
            }
            userWhoBlocked.blocked.push(userToBeBlocked._id);

            await userWhoBlocked.save();
            res.json({
                status:"success",
                data:"You have successfully blocked this user",
            });
        }
        }
        catch (error){
            next(appErr(error.message));
        }
}

const unBlockUserCtrl=async(req,res,next)=>{
    try{
        const userToBeUnblocked=await User.findById(req.params.id);
        const userWhoUnblock=await User.findById(req.userAuth);
        if(userWhoUnblock && userToBeUnblocked){
            const isUserAlreadyUnblocked=userWhoUnblock.blocked.find(blocked=>blocked.toString()
            ==userToBeUnblocked._id.toString());
            if(!isUserAlreadyUnblocked){
                return next(appErr("This user is not blocked"))
            }
            userWhoUnblock.blocked=userToBeUnblocked.blocked.filter(
                blocked=>blocked.toString()!==userToBeUnblocked._id.toString()
                ) ;
                await userWhoUnblock.save() 
                res.json({
                    status:"success",
                    data:"Successfully unblocked the user",
                });;
        }
       }
        catch (error){
            next(appErr(error.message));
        }
}
const adminBlockUserCtrl=async(req,res,next)=>{
    try{
        const userToBeBlocked1= await User.findById(req.params.id);
        if(!userToBeBlocked1){
            return next(appErr("User not found"));
        }

        userToBeBlocked1.isBlocked=true;
        await userToBeBlocked1.save();
        res.json({
            status:"success",
            data:"successfully blocked the user",
        });}
        catch (error){
            next(appErr(error.message));
        }
}
const adminUnBlockUserCtrl=async(req,res,next)=>{
    try{
        const userToBeUnBlocked1= await User.findById(req.params.id);
        if(!userToBeUnBlocked1){
            return next(appErr("User not found"));
        }

        userToBeUnBlocked1.isBlocked=false;
        await userToBeUnBlocked1.save();
        res.json({
            status:"success",
            data:"successfully unblocked the user",
        });}
        catch (error){
            next(appErr(error.message));
        }
}
const userProfileCtrl=async(req,res,next)=>{

    try{
        const user=await User.findById(req.userAuth);
        res.json({
            status:"success",
            data:user,
        });}
        catch (error){
            next(error.message);
        }
}

const userDeleteCtrl=async(req,res,next)=>{
    try{
        console.log('Inside userDeleteCtrl');
    const userToDelete=await User.findById(req.userAuth);
    console.log('User to delete:', userToDelete);
    console.log('Deleting related data...');
    await Post.deleteMany({user:req.userAuth});
    await Comment.deleteMany({user:req.userAuth});
    await Category.deleteMany({user:req.userAuth});
    console.log('Deleting the user...');
    await userToDelete.deleteOne();
    console.log('User deleted successfully');

       return res.json({
            status:"success",
            data:"You have successfully deleted the account",
        });}
        catch (error){
            next(appErr(error.message));
        }
}
const userUpdateCtrl=async(req,res,next)=>{
    console.log('Request Body:', req.body);
    const {email,lastname,firstname}=req.body;
    try{
        if(email){
            const emailTaken=await User.findOne({email})
            if(emailTaken){
                return next(appErr("the email already is being used",400))
            }
        }

        const user=await User.findByIdAndUpdate(req.userAuth,{
            lastname,
            firstname,
            email
        },{
            new:true,
            runValidators:true

        })
            console.log('Updated User:', user);

        res.json({
            status:"success",
            data:user,
        });}
        catch (error){
            next(appErr(error.message));
        }
}
const passwordUpdateCtrl=async(req,res,next)=>{
    const {password}=req.body
    try{
        if(password){
            const salt=await bcrypt.genSalt(10);
            const hashPassword=await bcrypt.hash(password,salt);
            const user=await User.findByIdAndUpdate(req.userAuth,{password:hashPassword},{new:true, runValidators:true})
            
        
        res.json({
            status:"success",
            data:"Password updated successfully",
        });
    }
    else{
            return next(appErr("please provide password field"));
        }
    }
        catch (error){
            next(appErr(error.message));
        }
}

const profilePhotoUpload=async(req,res,next)=>{
   
    try{

        //dd
        const userToUpdate=await User.findById(req.userAuth);
//dd
        if(!userToUpdate){
            return next(appErr("User not found!",403));
        }
        //blocked

        if(userToUpdate.isBlocked){
            return next(appErr("Action not allowed!your account is blocked",403));
        }

        //
        if(req.file){

        await User.findByIdAndUpdate(req.userAuth,{
            $set:{
                profilePhoto:req.file.path,
            }
        },{
            new:true,//return updated document instead of old one   
        });
        res.json({
            status:"success",
            data:"profile photo uploaded successfully",
        });}}
        catch (error){
           next(appErr(error.message,500));
        }
}
//,postCount,isBlocked,isAdmin,role,viewdBy,followers,following,active,posts
module.exports={
    userRegisterCtrl,userLoginCtrl,usersCtrl,userProfileCtrl,userDeleteCtrl,userUpdateCtrl,profilePhotoUpload,whoViewedMyProfileCtrl,followingCtrl,unFollowCtrl,blockUserCtrl,unBlockUserCtrl,adminBlockUserCtrl,adminUnBlockUserCtrl,passwordUpdateCtrl

}