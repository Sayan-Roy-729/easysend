const mongoose = require('mongoose');
const env = require('dotenv');

env.config()

const connectDB = () => {
  // Database connection
  mongoose
    .connect(process.env.MONGO_CONNECTION_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    })
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => {
      console.log('Database connection failed', error);
    });
};

module.exports = connectDB;
