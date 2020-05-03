var express = require('express');
var router = express.Router();
var crypto = require('crypto');
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

var cloudinary = require('cloudinary').v2;
var crypto = require('crypto');
var multipart = require('connect-multiparty');
var schema = require('../config/schema');

var multipartMiddleware = multipart();
var auth = require('../lib/auth');


module.exports = function () {

  return router;
}
