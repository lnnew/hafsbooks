var express = require('express');
var router = express.Router();

var auth = require('../lib/auth');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'nx0329',
  port: 5432,
})


module.exports = router;
