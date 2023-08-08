<<<<<<< HEAD
const mongoose=require('mongoose')
const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully")
    }catch(error){
        console.log(error.message);
        process.exit(1)
    }
}
dbConnect()
=======
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; 

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

dbConnect();
>>>>>>> dc5841bc37ae118c2e711532d553264d4a7581f4
