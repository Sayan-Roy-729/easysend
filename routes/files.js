const path = require('path');
const express = require('express');
const multer = require('multer');
const { v4: uuid4 } = require('uuid');

const File = require('../models/file');

const router = express.Router();

// Configure multer to store file
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single('myfile');

// api/files [POST]
router.post('/', (req, res, next) => {
  // Store file
  upload(req, res, async (err) => {
    // Validate request
    if (!req.file) {
      return res.status(404).json({ error: 'All fields are required' });
    }
    if (err) return res.status(500).send({ error: err.message });
    // Store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res
      .status(200)
      .json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
  });
});

router.post('/send', async (req, res, next) => {
  const { uuid, emailTo, emailFrom } = req.body;

  // Validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All fields are required.' });
  }

  // Get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: 'Email already sent!' });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send email
  const sendMail = require('../services/emailService');
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: 'inSHare file sharing',
    text: `${emailFrom} shared a file with you`,
    html: require('../services/emailTemplate')({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + ' KB',
      expires: '24 hours',
    }),
  });
  return res.status(200).send({ success: true });
});

module.exports = router;
