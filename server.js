const express=require('express');
const globalErrHandler = require('./middlewares/globalErrHandler');
const isAdmin = require('./middlewares/isAdmin');
const userRouter = require('./routes/users/userRoutes');
const postRouter = require('./routes/posts/postRoutes');
const commentRouter = require('./routes/comments/commentRoutes');
const categoryRouter = require('./routes/categories/categoryRoutes');
const dotenv=require('dotenv');
const Post = require('./model/Post/Post');
dotenv.config();
require("./config/dbConnect");
const app=express();

//middleware
app.use(express.json())


app.get('/',async(req,res)=>{
    try {
        const posts=await Post.find();
        res.json({
            status:'success',
            data:posts
        });
}catch(error){
    res.json(error)
    }
})
// const userAuth={
//     isLogin:true,
//     isAdmin:false
// };
//app.use(isAdmin)
// app.use((req,res,next)=>{
//   if(userAuth.isLogin){
//     next()
//   }
//   else{
//     return res.json({
//         msg:'Invalid login details'
//     });
//   }
// })
//routes

//user routes

app.use('/api/v1/users/',userRouter);
//app.post();


//post routes
app.use('/api/v1/posts/',postRouter);


//comments routes
app.use('/api/v1/comments/',commentRouter);




//category route
app.use('/api/v1/categories/',categoryRouter);








//error handles middleware
app.use(globalErrHandler);

app.use('*', (req, res) => {
    res.status(404).json({
        message: `${req.originalUrl} - route not found`
    });
});

//listening to server
const PORT=process.env.PORT || 9000;
app.listen(PORT, () => console.log(`server is up and running on ${PORT}`));
