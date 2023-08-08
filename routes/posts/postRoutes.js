const express=require('express');
const storage = require('../../config/cloudinary');
const multer=require('multer')
const { postCreateCtrl,postCtrl,postAllCtrl,postDeleteCtrl,postUpdateCtrl,toggleLikesPostCtrl,toggleDislikesPostCtrl } = require('../../controllers/posts/postsCtrl');
const isLogin = require('../../middlewares/isLogin');


const postRouter=express.Router();

const upload=multer({storage});

postRouter.post('/',isLogin,upload.single('image'),postCreateCtrl);


postRouter.get('/likes/:id',isLogin,toggleLikesPostCtrl);

postRouter.get('/dislikes/:id',isLogin,toggleDislikesPostCtrl);


postRouter.get('/:id',isLogin,postCtrl);

postRouter.get('/',isLogin,postAllCtrl);

postRouter.delete('/:id',isLogin,postDeleteCtrl);

postRouter.put('/:id',isLogin,upload.single('image'),postUpdateCtrl);


module.exports=postRouter;