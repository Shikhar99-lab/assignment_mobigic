const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

router.post('/upload', isLoggedIn, upload.single('file'), (req, res) => {
  const user = req.user;
  const filePath = req.file.path;
  const uniqueCode = Math.floor(100000 + Math.random() * 900000);

  user.files.push({ code: uniqueCode, path: filePath });
  user.save();

  res.json({ success: true, message: 'File uploaded successfully.', code: uniqueCode });
});

router.get('/list', isLoggedIn, (req, res) => {
  const user = req.user;
  res.json(user.files);
});

router.delete('/remove/:code', isLoggedIn, (req, res) => {
  const user = req.user;
  const code = req.params.code;

  const fileIndex = user.files.findIndex(file => file.code == code);
  if (fileIndex !== -1) {
    const filePath = user.files[fileIndex].path;
    fs.unlinkSync(filePath); 
    user.files.splice(fileIndex, 1);
    user.save();
    res.json({ success: true, message: 'File removed successfully.' });
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
});

module.exports = router;
