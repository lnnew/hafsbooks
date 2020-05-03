var express = require('express');
var router = express.Router();

var auth = require('../lib/auth');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'hvgpoifmqrddge',
  host: 'ec2-52-71-231-180.compute-1.amazonaws.com',
  database: 'dfp9ven4n627qb',
  password: '6624f255a92e17dc7def17d25a5279321e7c7d09217283dc56e0ace49fcdfdec',
  port: 5432,
  ssl: {
      rejectUnauthorized : false
}
})


module.exports = router;
