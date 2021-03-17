const express = require('express');
const env = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');

const app = express();

// Config Global Variable
env.config();

// Serve Static files
app.use(express.static('public'));

// Enable JSON Data receiver
app.use(express.json());

// Template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

// Connect with Database
connectDB();

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
