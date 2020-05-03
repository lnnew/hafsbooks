var cloudinary = require('cloudinary').v2;
var crypto = require('crypto');
var multipart = require('connect-multiparty');
var schema = require('../config/schema');
const db = require('./book_queries')
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

var auth = require('../lib/auth');

var Photo = schema.models.Photo;

var multipartMiddleware = multipart();

function index(req, res) {
  Photo.all().then(function (photos) {
    res.render('photos/index', { photos: photos });
  });
}

function add_through_server(req, res) {
  // Create a new photo model and set it's default title
  var photo = new Photo();
  Photo.count().then(function (amount) {
    photo.title = "My Photo #" + (amount + 1);

  })
    .finally(function () {
      pool.query('SELECT * FROM categories', (error, results) => {
        if (error) {
          throw error
        }
      res.render('photos/add', {
        photo: photo,
        categories: results.rows,
         });
     })
    });
}

function create_through_server(req, res) {


   //req.body.book_title
  // In through-the-server mode, the image is first uploaded to the server
  // and from there to Cloudinary servers.
  // The upload metadata (e.g. image size) is then added to the photo  model (photo.image)
  // and then saved to the database.

  // file was not uploaded redirecting to upload
/*  if (req.files.image.ws.bytesWritten === 0) {
    res.redirect('/photos/add');
    return;
  }*/

  // Get temp file path
  var additional_photo_ids=[];
    console.log("files*****"+JSON.stringify(req.files));
  console.log("files*****"+JSON.stringify(req.files.image1));
  /*for(var g = 1; g<=5; g++) {
    console.log(req.files['image'+g].name)
    if(req.files['image'+g].name) {
        var photo = new Photo(req.body);
        imageFile = req.files['image'+g].path;
        cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
        .then(function (image) {
          console.log('** photo saved'+g);
          additional_photo_ids.push(photo['image'+g].public_id);
          console.log(photo['image'+g].public_id);
            photo.image = image;

        //update로 바꿔야함  db.createUser(req, res, photo.image.public_id); //createbook
        return photo.save();
      }).then(function () {}).finally(function(){});
    }
  }
  // Upload file to Cloudinary*/
if(req.files.image1.name) {
  var photo = new Photo(req.body);
  var imageFile = req.files.image1.path;
cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
  .then(function (image1) {
    console.log('** file uploaded to Cloudinary service');
    console.dir(image1);
    photo.image1 = image1;
    // Save photo with image metadata
    return photo.save();
  })
  .then(function () {
    console.log('** photo saved11111');
    console.log(photo.image1.public_id);
    additional_photo_ids.push(photo.image1.public_id);

  })
  .finally(function () {
    //summon ejs file
  });
}
if(req.files.image2.name) {
  var photo = new Photo(req.body);
  var imageFile = req.files.image2.path;
cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
  .then(function (image2) {
    console.log('** file uploaded to Cloudinary service');
    console.dir(image2);
    photo.image2 = image2;
    // Save photo with image metadata
    return photo.save();
  })
  .then(function () {
    console.log('** photo saved11111');
    console.log(photo.image2.public_id);
    additional_photo_ids.push(photo.image2.public_id);

  })
  .finally(function () {
    //summon ejs file
  });
}
if(req.files.image3.name) {
  var photo = new Photo(req.body);
  var imageFile = req.files.image3.path;
cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
  .then(function (image3) {
    console.log('** file uploaded to Cloudinary service');
    console.dir(image3);
    photo.image3 = image3;
    // Save photo with image metadata
    return photo.save();
  })
  .then(function () {
    console.log('** photo saved11111');
    console.log(photo.image3.public_id);
    additional_photo_ids.push(photo.image3.public_id);

  })
  .finally(function () {
    //summon ejs file
  });
}
if(req.files.image5.name) {
  var photo = new Photo(req.body);
  var imageFile = req.files.image5.path;
cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
  .then(function (image5) {
    console.log('** file uploaded to Cloudinary service');
    console.dir(image5);
    photo.image5 = image5;
    // Save photo with image metadata
    return photo.save();
  })
  .then(function () {
    console.log('** photo saved11111');
    console.log(photo.image5.public_id);
    additional_photo_ids.push(photo.image5.public_id);

  })
  .finally(function () {
    //summon ejs file
  });
}
if(req.files.image4.name) {
  var photo = new Photo(req.body);
  var imageFile = req.files.image4.path;
cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
  .then(function (image4) {
    console.log('** file uploaded to Cloudinary service');
    console.dir(image4);
    photo.image4 = image4;
    // Save photo with image metadata
    return photo.save();
  })
  .then(function () {
    console.log('** photo saved11111');
    console.log(photo.image4.public_id);
    additional_photo_ids.push(photo.image4.public_id);

  })
  .finally(function () {
    //summon ejs file
  });
}
    var photo = new Photo(req.body);
    var imageFile = req.files.image.path;
  cloudinary.uploader.upload(imageFile, { tags: 'express_sample',folder:'hafsbooks' })
    .then(function (image) {
      console.log('** file uploaded to Cloudinary service');
      console.dir(image);
      photo.image = image;
      // Save photo with image metadata
      return photo.save();
    })
    .then(function () {
      console.log('** photo saved');
      console.log(photo.image.public_id);
      db.createUser(req, res, photo.image.public_id, additional_photo_ids); //createbook
    })
    .finally(function () {
      //summon ejs file
      res.render('photos/create_through_server', { photo: photo, upload: photo.image });
    });
}



module.exports.wire = function (app) {
  // index
  app.get('/photos', index);

  // upload to server example
  app.get('/photos/add', add_through_server);
  app.post('/photos', multipartMiddleware, create_through_server);

  // direct photo upload examples

  //app.post('/photos/direct', create_direct);
};
