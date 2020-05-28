const fs = require('fs');
const express = require('express');
const router = express.Router();
const error = require('../error');
const mmss = require('../../mmss');

router.get('/session', _isLogin, (_, res) => {
  res.json(null);
});

router.get('/track', _isLogin, (req, res) => {
  // 自動でdecodeURIComponent()してくれてるぽい
  const path = `${mmss.path}/${req.query.path}`;

  // あるかないか見ておく
  try {
    fs.statSync(path);
  } catch (err) {
    console.error(path);
    return res.status(400).json({ error: error.INVALID_PARAMS });
  }

  res.type('audio/mpeg');
  fs.createReadStream(path).pipe(res);
});

module.exports = router;


function _isLogin(req, res, next) {
  if ('isLogin' in req.session) {
    return next();
  }
  res.status(401).json({ error: error.AUTHORIZATION_REQUIRED });
}