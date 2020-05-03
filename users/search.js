var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'nx0329',
  port: 5432,
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
