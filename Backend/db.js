const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("Error connecting to mongoose:", error);
  }
};

module.exports = connectToMongo;
