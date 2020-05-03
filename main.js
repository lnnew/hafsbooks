// Load environment variables
require('dotenv').load();

var cloudinary = require('cloudinary').v2;

if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
  console.warn('!! cloudinary config is undefined !!');
  console.warn('export CLOUDINARY_URL or set dotenv file');
} else {
  console.log('cloudinary config:');
  console.log(cloudinary.config());
}
console.log('-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --');
var express = require('express');
var path = require('path');
var methodOverride = require('method-override');
var app = express();
var engine = require('ejs-locals');
var fs = require('fs');

var bodyParser = require('body-parser');


var compression = require('compression');
require('./config/schema');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var LokiStore = require('connect-loki')(session)
var flash = require('connect-flash');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(methodOverride());
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new LokiStore()
}))
var passport = require('./lib/passport')(app);

app.use(flash());

app.set('views', path.join(__dirname, '/views/'));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var cat_router = require('./category/categories_modify');
var books_router= require('./users/books');
app.use('/categories_modify', cat_router);
app.use('/book', books_router);
wirePreRequest(app);

function wirePreRequest(application) {
  application.use(function (req, res, next) {
    console.log(req.method + " " + req.url);
    res.locals.req = req;
    res.locals.res = res;

    if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
      throw new Error('Missing CLOUDINARY_URL environment variable');
    } else {
      // Expose cloudinary package to view
      res.locals.cloudinary = cloudinary;
      next();
    }
  });
}
function wirePostRequest(application) {
  application.use(function (err, req, res, next) {
    if (err.message && (err.message.indexOf('not found') !== -1 || err.message.indexOf('Cast to ObjectId failed') !== -1)) {
      return next();
    }
    console.log('error (500) ' + err.message);
    console.log(err.stack);
    if (err.message.indexOf('CLOUDINARY_URL') !== -1) {
      res.status(500).render('errors/dotenv', { error: err });
    } else {
      res.status(500).render('errors/500', { error: err });
    }
    return undefined;
  });
}

// Wire request controllers
var photosController = require('./controllers/photos_controller');
photosController.wire(app);
// Wire request 'post' actions



app.get('*', function (request, response, next) {
  next();
});

var indexRouter = require('./routes/index')();
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);
var searchRouter = require('./users/search');

app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);
app.use('/data/logo.jpg', express.static(__dirname + '/data/logo.jpg'));
app.use('/delete-icn.svg', express.static(__dirname + '/data/delete-icn.svg'));
app.use('/twitter-heart.png', express.static(__dirname + '/data/twitter-heart.png'));


app.use('/photo/search', express.static(__dirname + '/photo/search.ejs'));
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});
