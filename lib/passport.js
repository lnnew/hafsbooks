var db1 = require('../lib/db');
var bcrypt = require('bcryptjs');
var shortid = require('shortid');
const Pool = require('pg').Pool;
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

module.exports = function (app) {

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        FacebookStrategy = require('passport-facebook').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
      pool.query('SELECT id, studentID, displayName FROM users WHERE id = $1', [id], (err, results) => {
        if(err) {
          cb(err)
        }
      console.log('deserializeUser', id,results.rows[0]);
        cb(null, results.rows[0])
      })

    })
/*
    passport.deserializeUser(function (id, done) {
        var user = db1.get('users').find({
            id: id
        }).value();
        console.log('deserializeUser', id, user);
        done(null, user);
    });
*/




passport.use(new LocalStrategy({
    usernameField: 'email', //studentID
    passwordField: 'pwd'
  }, function(username, password, cb) {
  pool.query('SELECT id, studentID, password, displayName FROM users WHERE studentID=$1', [username], (err, result) => {
    if(err) {
       cb(err)
    }

    if(result.rows.length > 0) {
      const first = result.rows[0]
      console.log("first",first);
      bcrypt.compare(password, first.password, function(err, res) {
        if(res) {
          cb(null, { id: first.id, studentID: first.studentid, displayName: first.displayname},
            {
               message: 'Welcome.'
           });
         } else {
          cb(null, false, {
              message: '비밀번호 또는 학번을 잘못 기입하였습니다.'
          });
         }
       })
     } else {
       cb(null, false, {
           message: '비밀번호 또는 학번을 잘못 기입하였습니다.'
       });
     }
  })
}))
/*
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (email, password, done) {
            console.log('LocalStrategy', email, password);
            var user = db.get('users').find({
                email: email
            }).value();
            if (user) {
                bcrypt.compare(password, user.password, function(err,result){
                    if(result){
                        return done(null, user, {
                            message: 'Welcome.'
                        });
                    } else {
                        return done(null, false, {
                            message: 'Password is not correct.'
                        });
                    }
                });
            } else {
                return done(null, false, {
                    message: 'There is no email.'
                });
            }
        }
    ));
    */
    var facebookCredentials = require('../config/facebook.json');
    facebookCredentials.profileFields = ['id', 'emails', 'name', 'displayName'];
    passport.use(new FacebookStrategy(facebookCredentials,
        function (accessToken, refreshToken, profile, done) {
            console.log('FacebookStrategy', accessToken, refreshToken, profile);
            //var user = db1.get('users').find({email:email}).value();
            pool.query('SELECT id FROM users WHERE facebookid =$1',[profile.id], (err, results) => {
              if(err) {
                return done(err)
              }
            console.log('facebook current');
            if(results.rows[0]) {
              pool.query(
                'UPDATE users SET displayname= $1 WHERE facebookid = $2',
                [profile.displayName,profile.id],
                (error, results) => {
                  if (error) {
                    throw error
                  }
                 console.log("face upd");
                }
              )
              console.log("if",results.rows[0]);
            }
            else {
                var shid =shortid.generate();
               pool.query('INSERT INTO users (provider, id, displayName, facebookId) VALUES ($1, $2,$3,$4)',
               ['facebook',shid, profile.displayName,profile.id ], (error, results) => {
                 if (error) {
                    throw error;
                 }
               })
             }

            })
            pool.query('SELECT * FROM users WHERE facebookid =$1',[profile.id], (err, results) => {
              if(err) {
                throw err
              }
              console.log("sel1");
              done(null, results.rows[0]);
            })

        }
    ));


    app.get('/auth/facebook', passport.authenticate('facebook', {
          scope:'email'
      }));
      app.get('/auth/facebook/callback',
          passport.authenticate('facebook', {
              successRedirect: '/',
              failureRedirect: '/'
          }));
    return passport;
}
