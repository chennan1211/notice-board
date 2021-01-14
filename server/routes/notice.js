var express = require('express');
var router = express.Router();

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

router.get('/', function (req, res, next) {
  let data = require('../data/notices.json');
  res.json(data);
});

router.post('/', async function (req, res, next) {
  let data = require('../data/notices.json');
  data.notices.unshift({ ...req.body, id: uuidv4() });
  await fs.writeFileSync(__dirname + '/../data/notices.json', JSON.stringify(data));
  res.json(data);
});

router.delete('/', async function (req, res, next) {
  let data = require('../data/notices.json');
  data.notices = data.notices.filter(notice => req.body.id !== notice.id);
  await fs.writeFileSync(__dirname + '/../data/notices.json', JSON.stringify(data));
  res.json(data);
});

module.exports = router;
