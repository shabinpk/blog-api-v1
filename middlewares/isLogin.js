const { appErr,AppErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isLogin=(req,res,next)=>{
    const token=getTokenFromHeader(req);
    const decodedUser=verifyToken(token);
    
  console.log("Token:", token); // Log the token to see if it's correctly extracted from the request headers
  console.log("Decoded User:", decodedUser); // Log the decoded user object to see its contents
    req.userAuth=decodedUser.id;
    if(!decodedUser){
        return next(appErr("Invalid or expired token, try logging in again",500))
        }else{
            next();
    }

}
module.exports=isLogin;
