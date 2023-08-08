const Category = require("../../model/Category/Category");
const { appErr } = require("../../utils/appErr");


const categoryCreateCtrl=async(req,res,next)=>{
    const {title}=req.body;
    try{
        const category=await Category.create({
            title,user:req.userAuth
        })
        res.json({
            status:"success",
            data:category,
        });}
        catch (error){
           return next(appErr(error.message));
        }
}
const fetchCategoryCtrl=async(req,res,next)=>{
    try{
        const categories=await Category.find()
        res.json({
            status:"success",
            data:categories,
        });}
        catch (error){
            return next(appErr(error.message));    
            }
}


const categoryCtrl=async(req,res,next)=>{
    try{
        const category=await Category.findById(req.params.id)

        res.json({
            status:"success",
            data:category,
        });}
        catch (error){
            return next(appErr(error.message));    
        }
}

const categoryDeleteCtrl=async(req,res,next)=>{
    try{
      await Category.findByIdAndDelete(req.params.id)

        res.json({
            status:"success",
            data:"Category has been deleted",
        });}
        catch (error){
            return next(appErr(error.message));    
        }
}

const categoryUpdateCtrl=async(req,res,next)=>{
    const {title}=req.body
    try{
        const category=await Category.findByIdAndUpdate(req.params.id,{
            title
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


module.exports={
    categoryCreateCtrl,categoryCtrl,categoryDeleteCtrl,categoryUpdateCtrl,fetchCategoryCtrl
}