var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var shortid = require('shortid');
var db1 = require('../lib/db');
var bcrypt = require('bcryptjs');
var auth = require('../lib/auth');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'nx0329',
  port: 5432,
})

module.exports = function (passport) {
  router.get('/login_required', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';

    var html = template.login(title,  `
      <div class="fcontainer" >

      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="학번"  required></p>
        <p><input type="password" name="pwd" placeholder="비밀번호" required></p>
        <p>
            <input class="w3-button w3-light-blue w3-round-large" type="submit" value="로그인">
        </p>
      </form>
          <div style="color:red;">로그인이 필요합니다.</div>
      </div>
    ` );
    response.send(html);
  });
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var html = template.login(title, `
      <div class="fcontainer" >
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="학번"  required></p>
        <p><input type="password" name="pwd" placeholder="비밀번호" required></p>
        <p>
          <input class="w3-button w3-light-blue w3-round-large" type="submit" value="로그인">
        </p>
      </form>
      </div>
    `);
    response.send(html);
  });

  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    }));

  router.get('/register', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var html = template.login(title,  `
      <div class="fcontainer" >
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="학번(예: 18-10111)"  required></p>
          <p><input type="password" name="pwd" placeholder="비밀번호" required></p>
          <p><input type="password" name="pwd2" placeholder="비밀번호 확인" required></p>
          <p><input type="text" name="displayName" placeholder="실명"  required></p>
          <p>
            <button class ="w3-button w3-light-blue w3-round-large" type="submit">가입하기</button>
          </p>
        </form>
        </div>
      `);
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if (pwd !== pwd2) {
      request.flash('error', 'Password must same!');
      response.redirect('/auth/register');
    } else {
      bcrypt.hash(pwd, 10, function (err, hash) {
        /*var puser = db.get('users').find({email:email}).value();
        if(puser){
          puser.password = hash;
          puser.displayName = displayName;
          db.get('users').find({id:puser.id}).assign(puser).write();
        } else*/ if(true) {
  /*        var user = {
            id: shortid.generate(),
            studentID: email,
            password: hash,
            displayName: displayName
          };c.
          db.get('users').push(user).write();
*/
          pool.query('INSERT INTO users (provider, id, studentID, password, displayName) VALUES ($1, $2,$3,$4,$5)',
           ['local',shortid.generate(), email, hash, displayName ], (error, results) => {
            if (error) {
               throw error;
            }
            console.log(`(LOCAL) User added with ID: ${results.displayName}`);
          })
        }

        /*request.login(user, function (err) {
          console.log('redirect');
          return response.redirect('/');
        })*/
      response.redirect('/');
      });
    }
  });
  router.get('/update', function ( request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    if(! request.user) {
      console.log("이거",request.user);
      response.redirect('/auth/login_required');
    } else {
      var title = '로그인하기';
      console.log(request.user);
      var html = template.login(title, `
        <div class="fcontainer" >
        <div style="color:red;">${feedback}</div>
        <form action="/auth/update_process" method="post">
          <p>현재 이름: ${request.user.displayname}<input type="text" name="name" placeholder="이름" required></p>
          <p>현재 학번:${request.user.studentid}<input type="text" name="studentID" placeholder="새 학번(예시:18-10101)" required></p>
                  <input class="w3-button w3-light-blue w3-round-large" type="submit" value="수정 완료">
          </p>
        </form>
        </div>
      `);
      response.send(html);
    }
  })

  router.post('/update_process', function (request, response) {
    var post = request.body;
    var name = post.name;
    var studentID = post.studentID;
    if (!(studentID[2]=="-" && studentID.length==8)) {
      request.flash('error', '학번 형식이 맞지 않습니다.');
      response.redirect('/auth/update');

    } else {
      pool.query(
        'UPDATE users SET studentid =$1,displayname= $2 WHERE id = $3',
        [studentID, name, request.user.id],
        (error, results) => {
          if (error) {
            throw error
          }
         console.log("upd",request.user);
        }
      )
      response.redirect('/');

    }
  });

  router.post('/stu_process', function (request, response) {
    var post = request.body;
    var studentID = post.studentID;
    if (!(studentID[2]=="-" && studentID.length==8)) {
      request.flash('error', '학번 형식이 맞지 않습니다.');
      response.redirect('/wrong_id_format');
    }
     else {
       pool.query(
         'UPDATE users SET studentid =$1 WHERE id = $2',
         [studentID, request.user.id],
         (error, results) => {
           if (error) {
             throw error
           }
          console.log("stu",request.user);
         }
       )
      response.redirect('/');
  /*
      var puser = db1.get('users').find({id: request.user.id}).value();
      puser.studentID = studentID;
      db1.get('users').find({id:puser.id}).assign(puser).write();
      request.login(puser, function (err) {
        console.log('redirect');
        return response.redirect('/');
      })
*/
    }
  });
  router.get('/first_studentid', function (request, response) {
  var title = 'WEB - login';
  var html = template.login(title, `
    <div class="fcontainer" >
    <script>
      alert("최조 등록시 학번 등록이 필요합니다.");
    </script>
    <div style="color:red;"></div>
    <form action="/auth/stu_process" method="post">
      <p><input type="text" name="studentID" placeholder="현재 학번(예시: 18-10101)" required></p>
              <input class="w3-button w3-light-blue w3-round-large" type="submit" value="수정 완료">
      </p>
    </form>
    </div>
  `);
  response.send(html);
});


  router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
      response.redirect('/');
    });
  });
  router.post('/search_result', function (request, response) {
    console.log("vv"+JSON.stringify(request.body));
    if(request.user) {

      pool.query('SELECT * FROM categories', (error, results) => {
        if(request.query.cat) {
        var current_cat = request.query.cat;
        } else {
          var current_cat= "모의고사";
        }
        if (error) {
          throw error
        }
        var categories = results.rows;
        var opt_str =``;
        var intlcat_str =``;
        var domecat_str=``;
        var bothcat_str=``;
        for(var i = 0; i < 3; i++) {
          if(categories[i].category_name=="국제 도서") {
            for(var j = 0; j < categories[i].category.length ; j++) {
                var sub_cat_name =categories[i].category[j];
               intlcat_str+=`<a href="/?cat=${sub_cat_name}" class="w3-bar-item w3-button">${sub_cat_name}</a>`;
            }
          }
          if(categories[i].category_name=="국내 도서") {
            for(var j = 0; j < categories[i].category.length ; j++) {
                var sub_cat_name =categories[i].category[j];
               domecat_str+=`<a href="/?cat=${sub_cat_name}" class="w3-bar-item w3-button">${sub_cat_name}</a>`;
            }
          }
          if(categories[i].category_name=="공용 및 기타") {
            for(var j = 0; j < categories[i].category.length ; j++) {
                var sub_cat_name =categories[i].category[j];
               bothcat_str+=`<a href="/?cat=${sub_cat_name}" class="w3-bar-item w3-button">${sub_cat_name}</a>`;
            }
          }
         }
         var searched_book_name = request.body.searched_book_name.trim();
         var word_array = searched_book_name.split(" ");
         var word_str = word_array[0];
         if(word_array.length>1) {
           for(var i =1; i<word_array.length; i++) {
             word_str+="|"+word_array[i];
           }
         }
         var catstr= "";
         if(request.body.second_cat) {
           var catstr =`and second_cat =\'${request.body.second_cat}\'`
         }
         console.log(request.query);
         //select * from books where title_tokens @@ to_tsquery('수능 | 앙');
         pool.query('select * from books where title_tokens @@ to_tsquery($1)'+catstr,[word_str], (error, results) => {
           if (error) {
             throw error
           }
           var books = results.rows;
           var book_str="";
           for(var i in books) {
             var t=books[i];
             var status;
             if(t.is_selling=="o" || t.is_selling==""|| t.is_selling==undefined) {
               var status =`<button class="p-add classA adder" id ="${t.id}" data-sec="${t.second_cat}"><i class="fa fa-shopping-in w3-margin-right"></i>장바구니</button>`;
             }
             if(t.is_selling=="r") {
               var status =`<button class="p-add classA"style="background-color:#95C9E1;"><i class="fa fa-ban w3-margin-right"></i>예약됨</button>`;
             }
             if(t.is_selling=="x") {
               var status =`<button class="p-add classA" style="background-color:gray;"><i class="fa fa-ban w3-margin-right"></i>판매 완료</button>`;
             }

             book_str+= `<div class="p-grid"><div class="p-grid-in">
             <a href="/auth/detail?id=${t.id}">
              <div style="height:100px">
               <img class="p-img" src="http://res.cloudinary.com/dsla6v5o7/image/upload/v1587917729/${t.book_public_id}"/ style="width:80px;max-height:100px;">
               </div>
               <div class="p-name"><p>${t.book_title}</p></div>
               <div class="p-price"><p>${t.price_after}원</p></div>
               </a>
               ${status}
             </div></div>`;
           }
           response.send(template.main("검색결과", intlcat_str,domecat_str,bothcat_str, book_str,"")  );
         });




     });

    } else {
      response.redirect("/");
    }


  });

  router.get('/search', function (request, response) {
    console.log(111);
    if (!auth.isOwner(request, response)) {
      console.log(22);
      response.redirect('/auth/login_required');
      return false;
    }
     function o_template(opt) {
      return  `<!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <link href="/css/photo_album.css" media="all" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <title>PhotoAlbum on Express</title>
        <script src="/node_modules/jquery/dist/jquery.min.js" lang="text/javascript"></script>
        <script src='/node_modules/blueimp-file-upload/js/vendor/jquery.ui.widget.js' type='text/javascript'></script>
        <script src='/node_modules/blueimp-file-upload/js/jquery.iframe-transport.js' type='text/javascript'></script>
        <script src='/node_modules/blueimp-file-upload/js/jquery.fileupload.js' type='text/javascript'></script>
        <script src="/js/photo_album.js" lang="text/javascript"></script>

      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

      </head>
        <body style="background:#e0fffc; width:100%;">
        <div class="logo_wrapper" style="align:center;">
        <div id="logo">
          <!-- This will render the image fetched from a remote HTTP URL using Cloudinary -->
        </div>


        <!-- A standard form for uploading images to your server -->
        <div id='backend_upload'>
          <style>
              .form_controls {
                margin:20px;
              }
              </style>
            <div class="form_line">

              <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
              <script>
                  $(document).ready(function() {
                  var selectors = ["first_cat", "second_cat"]

                    $('select').on('change', function() {
                      var index = selectors.indexOf(this.id)
                      var value = this.value

                      // check if is the last one or not
                      if (index < selectors.length - 1) {
                        var next = $('#' + selectors[index + 1])

                        // Show all the options in next select
                        $(next).find('option').show()
                        if (value != "") {
                          // if this select's value is not empty
                          // hide some of the options
                          $(next).find('option[data-value!=\"' + value + '\"]').hide()
                        }

                        // set next select's value to be the first option's value
                        // and trigger change()
                        $(next).val($(next).find("option:first").val()).change()
                      }
                    })
                  });
              </script>
              <style>
                        .openBtn {
                          background: #f1f1f1;
                          border: none;
                          padding: 10px 15px;
                          font-size: 20px;
                          cursor: pointer;
                        }
                        .openBtn:hover {
                          background: #bbb;
                        }
                        .overlay {
                          height: 100%;
                          width: 100%;
                          display: block;
                          position: fixed;
                          z-index: 1;
                          top: 0;
                          left: 0;
                          background-color: rgb(0,0,0);
                          background-color: rgba(0,0,0, 0.9);
                        }
                        .overlay-content {
                          position: relative;
                          top: 11%;
                          width: 40%;
                          text-align: center;
                          margin-top: 30px;
                          margin: auto;
                        }
                        .overlay .closebtn {
                          position: absolute;
                          top: 20px;
                          right: 45px;
                          font-size: 60px;
                          cursor: pointer;
                          color: white;
                        }
                        .overlay .closebtn:hover {
                          color: #ccc;
                        }
                        .overlay input[type=text] {
                          padding: 15px;
                          font-size: 17px;
                          border: none;
                          float: left;
                          width: 80%;
                          background: white;
                        }
                        .overlay input[type=text]:hover {
                          background: #f1f1f1;
                        }
                        .overlay button {
                          float: left;
                          width: 20%;
                          padding: 15px;
                          background: #ddd;
                          font-size: 17px;
                          border: none;
                          cursor: pointer;
                        }
                        .overlay button:hover {
                          background: #bbb;
                        }
                      .selector {
                        padding-top:10px;
                        padding-bottom:10px;
                      }
                      #first_cat{
                        background-color:#FCD0E9;
                      }
                      #second_cat {
                        background-color:#95C9E1;
                      }
                  </style>

        <div id="myOverlay" class="overlay">
          <span class="closebtn" onclick="location.href='/'" title="Close Overlay">×</span>
          <div class="overlay-content">
            <form action="/auth/search_result" method="post">
              <input type="text" placeholder="검색하고 싶은 책을 입력해주세요!"id="searched_book_name" name="searched_book_name" required>
              <button type="submit" style="background-color:#F3AABD;"><i class="fa fa-search"></i></button>
                <div >
                  <div class="w3-row w3-card" style="text-align:right;">
                    <div class="w3-col ">
              <select class =" w3-button selector" name="first_cat" id="first_cat">
                 <option value=""> -- 1차 분류를 선택하세요 -- </option>
                   <option value="국제 도서">국제 도서</option>
                   <option value="국내 도서">국내 도서</option>
                   <option value="공용 및 기타">공용 및 기타</option>

              </select>
              </div>
                <div class="w3-col ">
                <select class ="w3-button selector"  name="second_cat" id="second_cat">
                    <option value="">-- 2차 분류를 선택하세요 -- </option>
         ${opt}

                </select>
                </div>

              </div>

              </div>
            </form>

          </div>
        </div>

            </div>
            <div class="form_line">
              <div class="form_controls">
              </div>
            </div>
            <input id="direct" name="direct" type="hidden" />
        </div>

        <a href="/photos" class="back_link">Back to list</a>

      <style>

      @media only screen and (min-width:768px) and (max-width: 1024px) {

        .logo_wrapper {
            width:100%;
        }
      }
        .logo_wrapper {

          align:center;
          margin-bottom: 30px;
          margin-top:150px;
          box-shadow: 0 8px 16  px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
          background: white;
          display: block;
          margin-left: auto;
          margin-right: auto;
          width:40%;
        }
        .logo_wrapper:hover {
        box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2);
      }

      </style>
      </body>
      </html>

`; }
        pool.query('SELECT * FROM categories', (error, results) => {

          if (error) {
            throw error
          }
          var categories = results.rows;
          var opt_str =``;
           for(var i = 0; i < 3; i++) {
            var current_cat = categories[i];
            var cat_name = current_cat.category_name;
               for(var j = 0; j < current_cat.category.length ; j++) {
                var sub_cat_name =current_cat.category[j];
                  opt_str+=`<option data-value="${cat_name}" value="${sub_cat_name}">${sub_cat_name}</option>`
                  }
                }
        console.log(opt_str);
        response.send(o_template(opt_str));
       });
  });
  router.get("/modify", function (req, res) {
    if (!auth.isOwner(req, res)) {
      res.redirect('/auth/login_required');
      return false;
    }
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    }
        var id = req.query.id;
        pool.query('SELECT * FROM books where id =$1',[id], (error, results) => {
          if (error) {
            throw error
          }
          var t = results.rows[0]; //targetbook
          console.log(req.user.id);
          var admin ="";
          pool.query('SELECT * FROM categories', (error, results) => {

            if (error) {
              throw error
            }
            var categories = results.rows;
            var opt_str =``;
             for(var i = 0; i < 3; i++) {
              var current_cat = categories[i];
              var cat_name = current_cat.category_name;
                 for(var j = 0; j < current_cat.category.length ; j++) {
                  var sub_cat_name =current_cat.category[j];
                    opt_str+=`<option data-value="${cat_name}" value="${sub_cat_name}">${sub_cat_name}</option>`
                    }
                  }

          function template(opt)  {
            if(t.grade=="A") {
              var grade=`
            <input type="radio" id="grade" name="grade" value="A" checked>A
               <input type="radio" id="grade1" name="grade" value="B">B
               <input type="radio" id="grade2" name="grade" value="C">C`;
             }
             if(t.grade=="B") {
               var grade=`
             <input type="radio" id="grade" name="grade" value="A">A
                <input type="radio" id="grade1" name="grade" value="B" checked>B
                <input type="radio" id="grade2" name="grade" value="C">C`;
              }
              if(t.grade=="C") {
                var grade=`
              <input type="radio" id="grade" name="grade" value="A" >A
                 <input type="radio" id="grade1" name="grade" value="B">B
                 <input type="radio" id="grade2" name="grade" value="C" checked>C`;
               }
            if(t.how_harmed==0) {
                var   how_harmed=`<input type="radio" id="how_harmed" name="how_harmed" value="0" checked>상
                     <input type="radio" id="how_harmed1" name="how_harmed" value="1">중
                     <input type="radio" id="how_harmed2" name="how_harmed" value="2">하`
            }
            if(t.how_harmed==1) {
                var   how_harmed=`<input type="radio" id="how_harmed" name="how_harmed" value="0">상
                     <input type="radio" id="how_harmed1" name="how_harmed" value="1" checked>중
                     <input type="radio" id="how_harmed2" name="how_harmed" value="2">하`
            }
            if(t.how_harmed==2) {
                var   how_harmed=`<input type="radio" id="how_harmed" name="how_harmed" value="0">상
                     <input type="radio" id="how_harmed1" name="how_harmed" value="1">중
                     <input type="radio" id="how_harmed2" name="how_harmed" value="2"checked>하`
            }
            if(t.how_solved==0) {
              var how_solved = `<input type="radio" id="how_solved" name="how_solved" value="0" checked>새것
                  <input type="radio" id="how_solved1" name="how_solved" value="1">새것에 가까움
                  <input type="radio" id="how_solved2" name="how_solved" value="2">절반 이하가 풀림
                  <input type="radio" id="how_solved2" name="how_solved" value="3">절반 이상이 풀림`
            }
            if(t.how_solved==1) {
              var how_solved = `<input type="radio" id="how_solved" name="how_solved" value="0"새것
                  <input type="radio" id="how_solved1" name="how_solved" value="1" checked>새것에 가까움
                  <input type="radio" id="how_solved2" name="how_solved" value="2">절반 이하가 풀림
                  <input type="radio" id="how_solved2" name="how_solved" value="3">절반 이상이 풀림`
            }
            if(t.how_solved==2) {
              var how_solved = `<input type="radio" id="how_solved" name="how_solved" value="0">새것
                  <input type="radio" id="how_solved1" name="how_solved" value="1">새것에 가까움
                  <input type="radio" id="how_solved2" name="how_solved" value="2" checked>절반 이하가 풀림
                  <input type="radio" id="how_solved2" name="how_solved" value="3">절반 이상이 풀림`
            }
            if(t.how_solved==3) {
              var how_solved = `<input type="radio" id="how_solved" name="how_solved" value="0">새것
                  <input type="radio" id="how_solved1" name="how_solved" value="1">새것에 가까움
                  <input type="radio" id="how_solved2" name="how_solved" value="2">절반 이하가 풀림
                  <input type="radio" id="how_solved2" name="how_solved" value="3" checked>절반 이상이 풀림`
            }



            return `<!doctype html>
          <html>

          <head>
          <title>Page Title</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">

              <script src="https://code.jquery.com/jquery-2.2.4.js" charset="utf-8"></script>

          <style>
            .colors {
              font-size:12px;
            }
            .header {
              text-align: center;
              background: #e0fffc;
              font-size: 8px;
            }
            #img_logo {
              align:left;
              width:100px;
              height:auto;
            }

            .content_wrapper {
              width: 60%;
               align:center;
                margin:auto;
            }
            @media only screen and (max-width:600px) {
              .content_wrapper {
                width:95%;
              }
              .product-title {
                font-size: 16px;
              }
              .price {
                font-size: 13px;
              }
              .colors {
                      font-size: 9px;
              }
              .w3-button {

                  font-size: 10px;
              }
            }
            /* Page Content */
            .content {padding:20px;}
          </style>

          <div class="header">
            <div id ="img_logo">
            <a href="/">
            <div>
            <img  src ="/data/logo.jpg" class="logo1" style="width:100px;">
            </div>
            </a>
            </div>
          </div>


          </head>
          <body>

            <div class="w3-row w3-card content_wrapper" style ="border: 4px solid #95C9E1; padding-bottom:100px;">

            <!-- A standard form for uploading images to your server -->
            <div id='backend_upload'>
              <h3 align="center">"${t.book_title}" 수정하기 <button class ="deleter w3-button w3-red" style="font-size:17px"onclick="func_confirm()" >책 삭제하기</button>
              </h3><hr>

         <script type="text/javascript">
         function func_confirm () {
           if(confirm("${t.book_title}을 삭제하시겠습니까?")){
             location.href="/auth/delete_book_process?id=${id}";
           } else {
             alert("취소되었습니다.");
           }
         }
       </script>
          <form id="modi" action="/auth/modify_process?id=${id}" method="post">
                <style>
                  .form_controls {
                    margin:20px;
                  }
                  </style>
                <div class="form_line">


                  <label for="book_title">책 제목:</label>
                  <div class="form_controls">
                  <input id="book_title" name="book_title" type="text" value="${t.book_title} "required/>
                  </div>

                  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
                  <script>
                      $(document).ready(function() {
                      var selectors = ["first_cat", "second_cat"]

                        $('select').on('change', function() {
                          var index = selectors.indexOf(this.id)
                          var value = this.value

                          // check if is the last one or not
                          if (index < selectors.length - 1) {
                            var next = $('#' + selectors[index + 1])

                            // Show all the options in next select
                            $(next).find('option').show()
                            if (value != "") {
                              // if this select's value is not empty
                              // hide some of the options
                              $(next).find('option[data-value!=\'' + value + '\']').hide()
                            }

                            // set next select's value to be the first option's value
                            // and trigger change()
                            $(next).val($(next).find("option:first").val()).change()
                          }
                        })
                      });
                  </script>
                  <label for="first_cat">1차 카테고리</label>
                  <div class="form_controls">
                  <select name="first_cat" id="first_cat" value="${t.first_cat}">
                     <option value="${t.first_cat}" selected>${t.first_cat} </option>
                       <option value="국제 도서">국제 도서</option>
                       <option value="국내 도서">국내 도서</option>
                       <option value="공용 및 기타">공용 및 기타</option>

                  </select>
                  </div>

                  <label for="second_cat">2차 카테고리</label>
                  <div class="form_controls">
                    <select name="second_cat" id="second_cat">
                        <option value="${t.second_cat}" selected> ${t.second_cat}</option>
                        ${opt}
                    </select>
                  </div>

                  <label for="price_before">정가:</label>
                  <div class="form_controls">
                  <input id="price_before" name="price_before" type="number" value="${t.price_before}" required/>
                  </div>

                  <label for="price_after">실제 판매가:</label>
                  <div class="form_controls">
                  <input id="price_after" name="price_after" type="number"value="${t.price_after}"  required/>
                  </div>

                  <label for="grade">등급(A,B,C):</label>
                  <div class="form_controls">
                    <p>${grade}</p>
                  </div>

                  <label for="how_harmed">훼손 상태: </label>
                  <div class="form_controls">
                    <p>${how_harmed}</p>
                  </div>



                  <label for="harm_etc">훼손 상태 상세 설명:</label>
                  <div class="form_controls">
                <textarea id="harm_etc" name="harm_etc" type="text">${t.harm_etc}
                 </textarea>
                </div>
                <label for="how_solved">이미 풀려 있는 정도:</label>
                <div class="form_controls">
                  <p>${how_solved}</p>
                </div>

                  <label for="solved_etc">풀린 정도 상세 설명:</label>
                  <div class="form_controls">
                  <textarea id="solved_etc" name="solved_etc" type="text">${t.solved_etc}
                  </textarea>
                  </div>

                  <label for="etc_info">기타 참고 사항:</label>
                  <div class="form_controls">
                  <textarea id="etc_info" name="etc_info" type="text" >${t.etc_info}
                  </textarea>
                  </div>
                  <label for="uploader_name">업로드자 이름(ex:14홍길동):</label>
                  <div class="form_controls">
                  <input id="uploader_name" name="uploader_name" type="text"  required value="${t.uploader_name}"/>
                  </div>

                </div>
                <div class="form_line">
                  <div class="form_controls">
                    <input class ="w3-button w3-pink" for="modi" name="commit" type="submit" value="책 정보 수정하기" />
                  </div>
                </div>
                <input id="direct" name="direct" type="hidden" />
            </form></div>

        </div>

        </body>
          <html>
  `; }

  res.send(template(opt_str));
       })
 });
});

router.get('/delete_book_process', function(req,res){
      var id = req.query.id;
      pool.query('DELETE FROM books WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        res.redirect("/");
      })
})
router.get('/delete_from_shopping_cart', function(req,res){
      var target_book_id = req.query.id;
      console.log(req.query.id!='undefined');
      if(req.query.id!='undefined') {
        var userid =req.user.id;
        pool.query(
          'SELECT cart FROM users where id =$1',
          [ userid],
          (error, results21) => {
            if (error) {
              throw error
            }
          var cart =results21.rows[0].cart;
          if(cart.indexOf(parseInt(target_book_id))!=-1) {
            var title ="잠깐만요!";
            var html = template.login(title,  `
              <div class="fcontainer" >
                  <div style="color:red;">장바구니/구매내역에서 삭제하려면 먼저 예약 취소를 해야합니다.(하트 모양)</div>
                  <button class="w3-button w3-blue"onclick="location.href='/auth/cart'">장바구니로 돌아가기</button>
              </div>
            ` );
            console.log("잠깐만요");
            res.send(html);

          } else {

        pool.query(
          'SELECT shopping_cart FROM users where id =$1',
          [ userid],
          (error, results) => {
            if (error) {
              throw error
            }
            var current_cart = results.rows[0].shopping_cart;
            console.log("current_cart****"+current_cart);
                      console.log("target_book_id****"+target_book_id);
            current_cart = current_cart.filter(value => value != target_book_id);
                      console.log("after shift****"+current_cart);
            pool.query(
              'UPDATE users SET shopping_cart=$1 WHERE id = $2',
              [current_cart, userid],
              (error, results) => {
                if (error) {
                  throw error
                }
                res.redirect("/auth/cart");
              });

          }) }
              })
      } else {
        res.redirect("/auth/cart");
      }

})

router.get('/cancel_book', function(req,res){
      var id = req.query.id;
      pool.query('SELECT purchaser_id FROM books WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
       var book_purchaser_id =results.rows[0].purchaser_id;
       if(book_purchaser_id != req.user.id) {
         var title ="잠깐만요!";
         var html = template.login(title,  `
           <div class="fcontainer" >


               <div style="color:red;">본인이 예약하지 않은 책을 취소시킬 수 없습니다.</div>
               <button class="w3-button w3-blue"onclick="location.href='/'">홈으로 돌아가기</button>
           </div>
         ` );
         res.send(html);
       } else {
         pool.query(
           'UPDATE books SET purchaser_id = $1, purchaser_name = $1, is_selling = $2 WHERE id = $3',
           ["", "o", id], //id 는 bookid
           (error, results) => {
             if (error) {
               throw error
             }
             pool.query(
               'SELECT cart FROM users where id =$1',
               [ req.user.id],
               (error, results) => {
                 if (error) {
                   throw error
                 }
                 var current_cart = results.rows[0].cart;
                 console.log("cccccc"+current_cart);
                 current_cart.shift(id);
                 pool.query(
                   'UPDATE users SET cart=$1 WHERE id = $2',
                   [current_cart, req.user.id],
                   (error, results) => {
                     if (error) {
                       throw error
                     }
                      res.redirect(`/auth/detail?id=${id}`);
                   });

               }
             )
           }
         )


       }
      })
})
router.get('/cancel_book_cart', function(req,res){
      var id = req.query.id;
      pool.query('SELECT purchaser_id FROM books WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
       var book_purchaser_id =results.rows[0].purchaser_id;
       if(book_purchaser_id != req.user.id) {
         var title ="잠깐만요!";
         var html = template.login(title,  `
           <div class="fcontainer" >


               <div style="color:red;">본인이 예약하지 않은 책을 취소시킬 수 없습니다.</div>
               <button class="w3-button w3-blue"onclick="location.href='/'">홈으로 돌아가기</button>
           </div>
         ` );
         res.send(html);
       } else {
         pool.query(
           'UPDATE  books SET purchaser_id = $1, purchaser_name = $1, is_selling = $2 WHERE id = $3',
           ["", "o", id],
           (error, results) => {
             if (error) {
               throw error
             }
             pool.query(
               'SELECT cart FROM users where id =$1',
               [ req.user.id],
               (error, results) => {
                 if (error) {
                   throw error
                 }
                 var current_cart = results.rows[0].cart;
                 console.log("cccccc"+current_cart);
                 current_cart.shift(id);
                 pool.query(
                   'UPDATE users SET cart=$1 WHERE id = $2',
                   [current_cart, req.user.id],
                   (error, results) => {
                     if (error) {
                       throw error
                     }
                      res.redirect(`/auth/cart`);
                   });

               }
             )
           }
         )


       }
      })
})
router.get('/book_process', function(req,res){
      var id = req.query.id;
      var userid =req.user.id;
      var username =req.user.displayname;
      pool.query(
        'UPDATE books SET purchaser_id = $1,purchaser_name=$2, is_selling = $3 WHERE id = $4',
        [userid,username, "r", id],
        (error, results) => {
          if (error) {
            throw error
          }
          pool.query(
            'UPDATE users SET cart =array_append(cart,$1) where id=$2',
            [id, userid],
            (error, results) => {
              if (error) {
                throw error
              }
              res.redirect(`/auth/add_to_shopping_cart?id=${id}`)
            }
          )
        }
      )
})
router.get('/book_process_cart', function(req,res){
      var id = req.query.id;
      var userid =req.user.id;
      pool.query(
        'UPDATE books SET purchaser_id = $1, purchaser_name=$4, is_selling = $2 WHERE id = $3',
        [userid, "r", id, req.user.displayname],
        (error, results) => {
          if (error) {
            throw error
          }
          pool.query(
            'UPDATE users SET cart =array_append(cart,$1) where id=$2',
            [id, userid],
            (error, results) => {
              if (error) {
                throw error
              }
              res.redirect(`/auth/cart`);
            }
          )
        }
      )
})


  router.post('/modify_process', function(req,res){
      var id = req.query.id;
    var raw_info_set = req.body;
    console.log(raw_info_set);
    console.log(req.body);
    var book_title  =raw_info_set['book_title'];
    var price_before  =raw_info_set['price_before'];
    var price_after  =raw_info_set['price_after'];
    var grade  =raw_info_set['grade'];
    var how_harmed  =raw_info_set['how_harmed'];
    var harm_etc  =raw_info_set['harm_etc'].trim();
    var how_solved  =raw_info_set['how_solved'];
    var solved_etc  =raw_info_set['solved_etc'].trim();
    var etc_info  =raw_info_set['etc_info'].trim();
    var uploader_name  =raw_info_set['uploader_name'];
    var first_cat  =raw_info_set['first_cat'];
    var second_cat  =raw_info_set['second_cat'];
    pool.query(`update books SET book_title=$1, price_before=$2, price_after=$3, grade=$4,how_harmed=$5, harm_etc=$6, how_solved=$7, solved_etc =$8,etc_info =$9,uploader_name=$10, first_cat=$11, second_cat=$12, title_tokens=$13 where id=$14 `,
                           [book_title, price_before,price_after,grade, how_harmed, harm_etc,how_solved, solved_etc,etc_info,uploader_name, first_cat,second_cat,book_title,id], (error, results) => {
      if (error) {
        throw error
      }
      res.redirect(`/auth/modify?id=${id}`);
    })

  })
  function add_to_shopping_cart(userid, target_book_id) { //찜
    pool.query(
      'UPDATE users SET shopping_cart =array_append(shopping_cart,$1) where id=$2',
      [target_book_id, userid],
      (error, results) => {
        if (error) {
          throw error
        }
      }
    )
  }
router.get('/add_to_shopping_cart', function(req, res) {
  //이미 있는지 판단?
var userid = req.user.id;
var target_book_id=req.query.id;
var sec_cat=req.query.second_cat;
add_to_shopping_cart(userid, target_book_id);
if(sec_cat) {
res.redirect(`/?cat=${sec_cat}`);
}else {
  res.redirect(`/auth/cart`);
}

})
  router.get('/cart', function(req,res) {


    if (!auth.isOwner(req, res)) {
      res.redirect('/auth/login_required');
      return false;
    }
    var name = req.user.displayname;
  var  userid = req.user.id;
    pool.query('SELECT shopping_cart FROM users where id =$1',[userid], (error, results) => {
      if (error) {
        throw error
      }
      var cart_ids = results.rows[0].shopping_cart; //찜 array

        if(cart_ids && cart_ids.length!=0) {
          var query_str ="SELECT * FROM books WHERE ";
          for(var i in cart_ids) {
           if(i ==0)  {
             query_str+="id="+cart_ids[0];
           }else {
             query_str+=" OR id="+cart_ids[i];
           }
          }
          query_str=query_str+"ORDER BY is_selling desc;";
          console.log(query_str);
          pool.query(query_str, (error, results) => {
            if (error) {
              throw error
            }
            var books= results.rows;
            pool.query('SELECT cart from users where id=$1',[userid], (error, result1) => {
              if (error) {
                throw error
              }
            user_cart =result1.rows[0].cart;

            var pd="";
            for(var i in books) {

              var t = books[i];
              if(user_cart.indexOf(t.id)!= -1) {
                pd += `<br> <div class="item w3-card w3-round-xlarge">
                    <div class="buttons">
                      <span class="delete-btn" id ="${t.id}"></span>
                    </div>
                    <div class="image" style="width:140px;">
                      <img src="https://res.cloudinary.com/dsla6v5o7/image/upload/${t.book_public_id}" style="height:100px; max-width:140px;" />
                    </div>
                    <div class="description">
                      <span>${t.book_title}</span>
                              <span></span>
                                      <span></span>
                    </div>
                    <div class="total-price">${t.price_after}원</div>
                    <div class="buttons" >
                    <span class="like-btn booked is-active" id ="${t.id}">예약됨</span>

                    </div>
                  </div>`;
              } else {
              pd += `<br> <div class="item w3-card w3-round-xlarge">
                  <div class="buttons">
                    <span class="delete-btn"  id ="${t.id}"></span>
                  </div>
                  <div class="image" style="width:140px;">
                    <img src="https://res.cloudinary.com/dsla6v5o7/image/upload/${t.book_public_id}" alt="" style="height:100px; max-width:140px;" />
                  </div>
                  <div class="description">
                    <span>${t.book_title}</span>
                            <span></span>
                                    <span></span>
                  </div>
                  <div class="total-price">${t.price_after}원</div>
                  <div class="buttons">
                  <span class="like-btn" id ="${t.id}">예약하기</span>

                  </div>
                </div>`;
              }
            }

        html = template.cart(name,pd);

        res.send(html);
      })
      })
        } else {

          html = template.cart(name,'<h3>장바구니에 책이 하나도 없습니다.</h3>');

          res.send(html);
          //장바구니에 하나도 없습니다
        }

        })
  })
  router.post('/list_today_process',function(req, res) {
    var books = req.body;
    //console.log(req.body); //{ '9': 'cancel', '14': 'complete', '24': 'complete' } i equals index
    for(var id in books) { // i =index 9 14
      if(books[id]=='complete') {

        var u = new Date();
        var month = u.getMonth()+1;
        if(month<10) {
            month = "0"+month;
        }
        var date = u.getDate();
        if(date <10) {
            date="0"+date;
        }
        var year = u.getFullYear();
        var date_format = year+"-"+month+"-"+date;
        pool.query('UPDATE books SET is_selling = $1,sold_date=$2 WHERE id = $3',
        [ "x",date_format, id], (error, results) => {
          if (error) {
            throw error
          }

        })
    } else {
      pool.query('UPDATE books SET purchaser_id = $1,purchaser_name=$2, is_selling = $3 WHERE id = $4',
      ["","", "o", id], (error, results) => {
        if (error) {
          throw error
        }
      })

    }
  }
  res.redirect("/");
  })
  router.get('/list_today', function(req, res) {
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    } else {
      pool.query('SELECT * FROM books where is_selling=$1',['r'], (error, results) => {
        if (error) {
          throw error
        }
        var booked_books = results.rows;
        var table_str =`      <form action="/auth/list_today_process" method="post"> <table class="w3-table-all">
    <thead>
      <tr style="background-color:#F3AABD;color:white">
        <th>책 이름</th>
        <th>예약자 이름</th>
        <th>가격</th>
         <th></th>
      </tr>
    </thead>`;
        for(var i in booked_books) {
          var c = booked_books[i]; //현재 책
          table_str+=`<tr>
      <a href ="/auth/detail?id={}">
      <td>${c.book_title}</td></a>
      <td>${c.purchaser_name}</td>
      <td>${c.price_after}원</td>
      <td>   <input type="radio" id="${c.id}t" name="${c.id}" value="complete">
  <label for="${c.id}t"><div class="w3-blue w3-round w3-card  w3-button">거래 완료</div></label><br>
  <input type="radio" id="${c.id}f" name="${c.id}" value="cancel">
  <label for="${c.id}f"><div class="w3-red w3-round w3-card w3-button">예약 취소</div></label>
  </td>
    </tr>`;
        }

        table_str+=`
    <tr><div align="center">
      <button class="w3-button w3-padding-16 w3-gray">정산 완료하기</button>
      </div>
    </tr></table></form>`;
        res.send(template.login1("예약 목록 관리",table_str));
      });
    }
  })
  router.get('/delete_all' ,function(req, res) {
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    } else {
    pool.query('DELETE FROM books', (error, results) => {
      if (error) {
        throw error
      }
      pool.query('UPDATE users SET cart=$1',[[]], (error, results) => {
        if (error) {
          throw error
        }
        res.redirect("/auth/advanced");
      })
    })
  }
  })
  router.get('/delete_all_reservations' ,function(req, res) {
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    } else {
    pool.query('UPDATE books SET is_selling=$1, purchaser_id=$2, purchaser_name=$2 WHERE is_selling=$3',['o','','r'], (error, results) => {
      if (error) {
        throw error
      }
      pool.query('UPDATE users SET cart=$1',[[]], (error, results) => {
        if (error) {
          throw error
        }
        res.redirect("/auth/advanced");
      })
    })
  }
  })
  router.get('/reset_all_status', function(req, res) {
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    } else {
    pool.query('UPDATE books SET is_selling=$1, purchaser_id=$2, purchaser_name=$2',['o',''], (error, results) => {
      if (error) {
        throw error
      }
      pool.query('UPDATE users SET cart=$1',[[]], (error, results) => {
        if (error) {
          throw error
        }
        res.redirect("/auth/advanced");
      })
    })
  }
  })
  router.get('/list_all', function(req, res) {
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    } else {
      pool.query('SELECT * FROM books ORDER BY is_selling asc, sold_date asc', (error, results) => {
        if (error) {
          throw error
        }

        var booked_books = results.rows;
        var table_str =`<table class="w3-table-all">
    <thead>
      <tr style="background-color:#F3AABD;color:white">
        <th>책 이름</th>
        <th>예약자 이름</th>
        <th>가격</th>
         <th>상태</th>
      </tr>
    </thead>`;
        for(var i in booked_books) {
          var stat=""

          var c = booked_books[i]; //현재 책
          if(c.is_selling=="" || c.is_selling=="o" || c.is_selling==undefined) {
            stat="판매중";
          }else if(c.is_selling=="x")  {
            stat="판매 완료 ("+c.sold_date+")";
          }else {
            stat="예약중";
          }
          table_str+=`<tr>
      <a href ="/auth/detail?id={}">
      <td>${c.book_title}</td></a>
      <td>${c.purchaser_name}</td>
      <td>${c.price_after}원</td>
      <td>${stat} </td>
    </tr>`;
        }

        table_str+=`
    <tr><div align="center">
      </div>
    </tr></table>`;
        res.send(template.login1("예약 목록 관리",table_str));
      });
    }
  })
  router.get('/advanced', function (req,res) {
    if(0 && !  (req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") ) {
      res.redirect('/');
    } else {

     var admin =`<style>
              .grid-container {
              display: grid;
              grid-template-columns: auto auto ;
              background-color:#FCD0E9 ;
              padding: 10px;
              }
              .grid-container1 {
              display: grid;
              grid-template-columns: auto auto ;
              background-color:black;
              font-size:15px;
              color:white;
              padding: 2px;
              }
              .grid-item {
              color:#f06287;
              background-color: white;
              border: 2px solid white;
              margin: 10px auto;
              width:200px;
              padding: 20px 0px;
              font-size: 14px;
              text-align: center;
              }
              </style>
              <div class="grid-container1">
              <p>관리자 옵션</p>
              </div>
              <div class="grid-container">
              <script src="/node_modules/jquery/dist/jquery.min.js" lang="text/javascript"></script>


              <script>
              $(document).ready(function() {
                $('.type1').on('click', function() {
                  if(confirm("정말로 등록된 모든 책 목록을 삭제하시겠습니까? 어떤 조치인지 숙지 후 클릭해주세요.")) {
                    if(confirm("정말로요.?")) {
                      location.href='/auth/delete_all';
                    }
                  }
                })
                $('.type2').on('click', function() {
                  if(confirm("정말로 모든 예약 현황을 리셋하시겠습니까? 예약된 모든 책들이 구매 가능으로 변경됩니다. 어떤 조치인지 숙지 후 클릭해주세요.")) {
                    if(confirm("정말로요.?")) {
                      location.href='/auth/delete_all_reservations';
                    }
                  }
                })
                $('.type3').on('click', function() {
                  if(confirm("정말로 모든 예약/구매 현황을 리셋하시겠습니까? 거래가 완료된 책, 예약된 책 모두 구매 가능으로 변경됩니다. 어떤 조치인지 숙지 후 클릭해주세요.")) {
                    if(confirm("정말로요.?")) {
                      location.href='/auth/reset_all_status';
                    }
                  }
                })
                          });
              </script>
              <button class="type1 w3-button w3-card w3-round-large ">등록된 책 모두 삭제(!)</button>
              <button class="type2 w3-button w3-card w3-round-large " >책 예약 기록 초기화(예약된 책 모두 삭제, 구매가능으로 바뀜)</button>
              <button class="type3 w3-button w3-card w3-round-large">거래 완료/예약된 책 모두 구매 가능으로 초기화(전부 초기화)</button>
              <button class="w3-button w3-card w3-round-large " onclick="location.href='/'">돌아가기</button>
              </div>`;
            res.send(template.login2('고급 명령어', admin));
            }

            })
  router.get('/detail', function (req, res) {
    if (!auth.isOwner(req, res)) {
      res.redirect('/auth/login_required');
      return false;
    }
        var id = req.query.id;
        pool.query('SELECT * FROM books where id =$1',[id], (error, results) => {
          if (error) {
            throw error
          }
          var t = results.rows[0]; //targetbook
          console.log(req.user.id);
          var admin ="";
          if(req.user.id=="adminhafs" || req.user.id=="adminhafs1" ||req.user.id=="adminhafs2") {
            admin +=`   <button class="w3-button add-to-cart btn btn-default w3-card w3-round" type="button" onclick = "location.href = '/auth/modify?id=${id}' " style="background-color:black;color:white">수정하기(관리자)<b></span</button>`;
          }
          var additional_photo_ids = t.additional_photo_ids;
          var add_photos_str="";
          for(var i in additional_photo_ids) {
            add_photos_str+= `<img class ="hovering_img" id="myImg${i}" src="https://res.cloudinary.com/dsla6v5o7/image/upload/${additional_photo_ids[i]}" alt="이미지 ${i}" style="height:150px;">`;

          }
          console.log(t);
          if(t.is_selling=="o" || t.is_selling==""|| t.is_selling==undefined) {
            var reserve =`<button class="booker w3-button add-to-cart btn btn-default w3-card w3-round" type="button" style="background-color:#F3AABD;" ><span class="fa fa-heart">예약하기</span</button>`;
          }
          if(t.is_selling=="r") {
            var reserve =`<button class="canceler booked w3-button add-to-cart btn btn-default w3-card w3-round" type="button" style="background-color:#F3AABD;" ><span class="fa fa-heart">예약 취소하기</span</button>`;
          }
          if(t.is_selling=="x") {
            var reserve =`<button class="w3-button add-to-cart btn btn-default w3-card w3-round" type="button" style="background-color:#F3AABD;" ><span class="fa fa-heart" disabled>판매완료</span</button>`;
          }
          var template =`<!doctype html>
          <html>

          <head>
          <title>Page Title</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
            <script src="/node_modules/jquery/dist/jquery.min.js" lang="text/javascript"></script>

          <style>
            .colors {
              font-size:12px;
            }
            .header {
              text-align: center;
              background: #e0fffc;
              font-size: 8px;
            }
            #img_logo {
              align:left;
              width:100px;
              height:auto;
            }

            .content_wrapper {
              width: 60%;
               align:center;
                margin:auto;
            }
            @media only screen and (max-width:600px) {
              .content_wrapper {
                width:95%;
              }
              .product-title {
                font-size: 16px;
              }
              .price {
                font-size: 13px;
              }
              .colors {
                      font-size: 9px;
              }
              .w3-button {

                  font-size: 10px;
              }
            }
            /* Page Content */
            .content {padding:20px;}
          </style>

          <div class="header">
            <div id ="img_logo">
            <a href="/">
            <div>
            <img  src ="/data/logo.jpg" class="logo1" style="width:100px;">
            </div>
            </a>
            </div>
          </div>


          </head>
          <body>

            <div class="w3-row w3-card content_wrapper" style ="border: 4px solid #95C9E1; padding-bottom:100px;">
              <div class="w3-col s6 w3-center">
                <div class ="w3-row">
                <div class="w3-col s2"><p></p></div>
                <div class="w3-col w3-card   s8">
                <img id="myImg6" src="http://res.cloudinary.com/dsla6v5o7/image/upload/${t.book_public_id}"  class="logo1"style="width:100%;align:center;">
                </div>
                    <div class="w3-col s2"><p></p></div>
              </div>
              </div>
              <div class="w3-col s6  w3-center" >
                <div class="card" style="text-align:left;">
                      <div class="container-fliud">
                        <div class="wrapper row">

                          <div class="details col-md-6">
                            <h3 class="product-title">${t.book_title}</h3>
                            <div class="rating">
                              <div class="stars">
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                </div>
                              <span class="review-no">A급</span>
                            </div>
                          <p class="price">정가: <span><s>${t.price_before}원</s></span></p>
                          <h5 class="price">판매가: <span><b style= "color: #86DBD6;">${t.price_after}원</b></span></h5>
                    <p class="price">현재 상태:<span class="size" data-toggle="tooltip" title="small">구매 가능</span>  </p>
                            <p class="colors">훼손 상태:
                              <span class="color orange not-available" data-toggle="tooltip" title="Not In store">${t.how_harmed}</span>

                            </p>
                            <p class="colors">훼손 상태 설명:
                              <span class="color orange not-available" data-toggle="tooltip" title="Not In store">${t.harm_etc}</span>
                            </p>
                            <p class="colors">풀린 정도:
                              <span class="color orange not-available" data-toggle="tooltip" title="Not In store">${t.how_solved}</span>

                            </p>
                            <div class="action">
                              ${reserve}
                              <script type="text/javascript">
                              $('.canceler').on('click', function() {
                                            var date = new Date();
                              if( 11<date.getHours() && date.getHours()<14) {
                                  alert("오전 11시부터 오후 2시까지는 예약을 취소할 수 없습니다.");
                }else{
                  if(confirm("${t.book_title} 책을 예약 취소하시겠습니까?")) {
                    location.href="/auth/cancel_book?id=${id}";
                  }

                }

              });
                function adder() {
                    if(confirm("장바구니에 추가하시겠습니까?")) {
                      location.href='/auth/add_to_shopping_cart?id='+'${id}';
                      }
                }
                                $('.booker').on('click', function() {
                                              var date = new Date();
                                if( 11>date.getHours()) {
                                  date.setDate(date.getDate());
                                  var month=date.getMonth()+1;
                                  var day = date.getDate();
                                    if(confirm('오늘('+month+'월'+day+'일) 점심시간까지 예약하시겠습니까?')) {
                                  alert('[책제목]예약이 완료되었습니다.오늘('+month+'월'+day+'일) 점심시간 ~~시부터 ~~시에 ~~에서 지불할 금액을 준비하여 북마켓 부스를 방문해주시기 바랍니다.')
                                  $(this).toggleClass('is-active');
                                  $(this).addClass("booked");
                                   $(this).html('예약 완료(~'+month+'.'+day+'.)');
                                }
                                } else {
                                  if(  date.getHours()<14) {
                                      alert("오전 11시부터 오후 2시까지는 예약할 수 없습니다.");
                                  }
                                  else {
                                    date.setDate(date.getDate()+1);
                                    var month=date.getMonth()+1;
                                    var day = date.getDate();
                                    if(confirm('내일('+month+'월'+day+'일) 점심시간까지 예약하시겠습니까?')) {
                                  alert('[책제목]예약이 완료되었습니다.내일('+month+'월'+day+'일) 점심시간 ~~시부터 ~~시에 ~~에서 지불할 금액을 준비하여 북마켓 부스를 방문해주시기 바랍니다.')
                                  $(this).toggleClass('is-active');
                                  $(this).addClass("booked");
                                   $(this).html('예약됨(~'+month+'.'+day+'.)');
                                   location.href="/auth/book_process/?id=${id}";
                                }
                                  }
                  }


                })
                            </script>
                              <button class=" w3-button w3-card w3-round" onclick="adder()" type="button" id="adder" data-id="${id}"style="background-color:#FCD0E9;"><span><i class="fa fa-shopping-cart w3-margin-right"></i> 장바구니</span></button>
                              ${admin}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              </div>

            </div>
            <div class="w3-row"  style ="width: 60%; align:center; margin:auto; border: 4px solid #95C9E1; margin-top:30px;">
            ${add_photos_str}<!-- The Modal -->
            </div>
          <div id="myModal" class="modal">

          <span class="close" onclick="close_model()" title="Close Overlay">×</span>

            <img class="modal-content" id="img01">
            <div id="caption"></div>
          </div>
          <style>

          .hovering_img {
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
          }

          .hovering_img:hover {opacity: 0.7;}

          /* The Modal (background) */
          .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            padding-top: 100px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
          }

          /* Modal Content (image) */
          .modal-content {
            margin: auto;
            display: block;
            width: 80%;
            max-width: 700px;
          }

          /* Caption of Modal Image */
          #caption {
            margin: auto;
            display: block;
            width: 80%;
            max-width: 700px;
            text-align: center;
            color: #ccc;
            padding: 10px 0;
            height: 150px;
          }

          /* Add Animation */
          .modal-content, #caption {
            -webkit-animation-name: zoom;
            -webkit-animation-duration: 0.6s;
            animation-name: zoom;
            animation-duration: 0.6s;
          }

          @-webkit-keyframes zoom {
            from {-webkit-transform:scale(0)}
            to {-webkit-transform:scale(1)}
          }

          @keyframes zoom {
            from {transform:scale(0)}
            to {transform:scale(1)}
          }

          /* The Close Button */
          .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            transition: 0.3s;
          }

          .close:hover,
          .close:focus {
            color: #bbb;
            text-decoration: none;
            cursor: pointer;
          }

          /* 100% Image Width on Smaller Screens */
          @media only screen and (max-width: 700px){
            .modal-content {
              width: 100%;
            }
          }
          </style>
          <script>
          // Get the modal
          var modal = document.getElementById("myModal");

          // Get the image and insert it inside the modal - use its "alt" text as a caption
          var img = document.getElementById("myImg1");
          var img2 = document.getElementById("myImg2");
            var img3 = document.getElementById("myImg3");
              var img4 = document.getElementById("myImg4");
                var img6 = document.getElementById("myImg6");
                var img5 = document.getElementById("myImg0");
          var modalImg = document.getElementById("img01");
          var captionText = document.getElementById("caption");
          if(img) {
            img.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            }
          }
          if(img2) {
            img2.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            }
          }

          if(img6) {
            img6.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            }
          }

          if(img3) {
            img3.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            }
          }


          if(img4) {
            img4.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            }
          }
          if(img5) {
            img5.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            }
          }
          // Get the <span> element that closes the modal
          var span1 = document.getElementsByClassName("close")[0];

          // When the user clicks on <span> (x), close the modal

          function close_model() {
              modal.style.display = "none";
          }
          </script>

        </div>

        </body>
          <html>
  `;
  res.send(template);
       })
  });
  return router;
}
