const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost/file_upload_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Passport Configuration (assuming User model is defined in models/user.js)
const User = require('./src/models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const authRoutes = require('./src/routes/auth');
const fileRoutes = require('./src/routes/file');
app.use('/auth', authRoutes);
app.use('/file', fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
