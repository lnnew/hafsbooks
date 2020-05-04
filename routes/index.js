var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
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
module.exports = function () {
router.get('/wrong_id_format', function (request, response) {
  var title = 'WEB - login';
  var html = template.login(title,  `
    <script>
      alert("학번 형식이 맞지 않습니다.(예시: 18-10101)");
    </script>
    <div class="fcontainer" >
    <form action="/auth/stu_process" method="post">
      <p><input type="text" name="studentID" placeholder="현재 학번(예시:18-10101)" required></p>
            <input type="submit" value="수정 완료">
      </p>
    </form>
    </div>
  `);
  response.send(html);

});
router.get('/', function (request, response) {
  if(request.user) {
    var current_cat;
    if(null== request.user.studentid) {
      var title = 'WEB - login';
      var html = template.login(title, `
        <div class="fcontainer" >
        <form action="/auth/stu_process" method="post">
          <p><input type="text" name="studentID" placeholder="현재 학번(예시: 18-10101)" required></p>
                <input type="submit" value="가입 완료하기">
          </p>
        </form>
      </div>

        <script>
          alert("최조 등록시 학번 등록이 필요합니다.");
        </script>
      `);
      response.send(html);

    } else {
      var admin ="";
      if(request.user.id=="adminhafs" || request.user.id=="adminhafs1" ||request.user.id=="adminhafs2") {
        current_cat="관리자 계정";
        admin +=`<style>
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

<button class="w3-button w3-card w3-round-large grid-item" onclick="location.href='/photos/add'">책 추가하기</button>
  <button class="w3-button w3-card w3-round-large grid-item" onclick="location.href='/auth/list_today'">예약 목록 관리(1일)</button>
  <button class="w3-button w3-card w3-round-large grid-item" onclick="location.href='/auth/list_all'">예약 총 목록</button>
  <button class="w3-button grid-item w3-black" style="color:white" onclick="location.href='/auth/advanced'">고급</button>
</div>`;
            }

      var fmsg = request.flash();
      var feedback = '';
      if(fmsg.success){
        feedback = fmsg.success[0];
      }
      var title = 'Welcome';
      var description = 'Hello, Node.js';
    //  var list = template.list(request.list);

    pool.query('SELECT * FROM categories', (error, results) => {
      if(request.query.cat) {
       current_cat = request.query.cat;
      } else {
        if(!current_cat) {
       current_cat= "모의고사";
        }
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
       pool.query('SELECT * FROM books where second_cat=$1',[current_cat], (error, results) => {
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
         response.send(template.main(current_cat, intlcat_str,domecat_str,bothcat_str, book_str, admin)  );
       });




   });
    }

  } else {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success){
      feedback = fmsg.success[0];
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var html = template.login(title,
      `
      <div class="fcontainer" >
            <div style="color:blue;">${feedback}</div>
          <a href="/auth/facebook">
        <div align="center">
        <button class="login_button"><b>FACEBOOK으로 간편로그인</b></button></a>
        </div>
      </div>
            <div class="login_wrapper" >
          <a href="/auth/login"><p style="font-size:9px;" align="center"><u>FACEBOOK 계정이 없는 경우 로그인</u></p></a>
          <a href="/auth/register"><p  style="font-size:9px;" align="center"><u>FACEBOOK 계정이 없는 경우 회원가입</u></p></a>
        </div>

        `  );
    response.send(html);
  }


});


return router;
}
