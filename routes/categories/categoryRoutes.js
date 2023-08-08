const express=require('express');
const { categoryCreateCtrl,categoryCtrl,categoryDeleteCtrl,categoryUpdateCtrl,fetchCategoryCtrl } = require('../../controllers/categories/categoryCtrl');
const isLogin = require('../../middlewares/isLogin');


const categoryRouter=express.Router();

categoryRouter.post('/',isLogin,categoryCreateCtrl);


categoryRouter.get('/:id',categoryCtrl);
categoryRouter.get('/',fetchCategoryCtrl);



categoryRouter.delete('/:id',isLogin,categoryDeleteCtrl);

categoryRouter.put('/:id',isLogin,categoryUpdateCtrl);

module.exports=categoryRouter;


