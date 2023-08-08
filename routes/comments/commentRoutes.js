const express=require('express');
const { commentCreateCtrl,commentCtrl ,commentDeleteCtrl,commentUpdateCtrl} = require('../../controllers/comments/commentsCtrl');
const isLogin = require('../../middlewares/isLogin');

const commentRouter=express.Router();

commentRouter.post('/:id',isLogin,commentCreateCtrl);


commentRouter.get('/',isLogin,commentCtrl);


commentRouter.delete('/:id',isLogin,commentDeleteCtrl);

commentRouter.put('/:id',isLogin,commentUpdateCtrl);


module.exports=commentRouter;
