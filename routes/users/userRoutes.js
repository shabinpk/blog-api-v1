const express=require('express');
const { userRegisterCtrl,userLoginCtrl,usersCtrl,userProfileCtrl,userDeleteCtrl,userUpdateCtrl,profilePhotoUpload,whoViewedMyProfileCtrl,followingCtrl,unFollowCtrl,blockUserCtrl,unBlockUserCtrl,adminBlockUserCtrl,adminUnBlockUserCtrl,passwordUpdateCtrl } = require('../../controllers/users/userCtrl');
const isLogin = require('../../middlewares/isLogin');
const multer=require('multer');
const storage = require('../../config/cloudinary');
const isAdmin = require('../../middlewares/isAdmin');

const upload = multer({storage});



const userRouter=express.Router();
userRouter.post('/register',userRegisterCtrl);

userRouter.post('/login',userLoginCtrl);

userRouter.get('/',usersCtrl);

//   
userRouter.get('/profile/',isLogin,userProfileCtrl)

userRouter.delete('/delete-account',isLogin,userDeleteCtrl);

userRouter.get('/profile-viewers/:id',isLogin,whoViewedMyProfileCtrl);

userRouter.put('/',isLogin,userUpdateCtrl);

userRouter.post('/profile-photo-upload',isLogin,upload.single("profile"),profilePhotoUpload);

userRouter.get('/following/:id',isLogin,followingCtrl);

userRouter.put('/update-password',isLogin,passwordUpdateCtrl);


userRouter.get('/unfollowing/:id',isLogin,unFollowCtrl);

userRouter.get('/block/:id',isLogin,blockUserCtrl);

userRouter.get('/unblock/:id',isLogin,unBlockUserCtrl);

userRouter.put('/admin-block/:id',isLogin,isAdmin,adminBlockUserCtrl);
userRouter.put('/admin-unblock/:id',isLogin,isAdmin,adminUnBlockUserCtrl);

module.exports=userRouter; 