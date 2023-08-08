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
