const express = require('express');

const File = require('../models/file');

const router = express.Router();

router.get('/:uuid', async (req, res, next) => {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render('download', {
      error: 'Link has been expired',
    });
  }

  // download the file
  const filePath = `${__dirname}/../${file.path}/`;
  res.download(filePath);
});

module.exports = router;
