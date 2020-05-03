var express = require('express');
var router = express.Router();

const db = require('./category_queries')
//module.exports = function (passport) {
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'nx0329',
  port: 5432,
})

router.get('/', function (request, response) {
  var id = request.query.id;
  var to =['국제 도서', '국내 도서','공용 및 기타'];
  var name = to[id];
  var category;
  pool.query('SELECT * FROM categories WHERE category_name = $1', [name], (error, results) => {
    if (error) {
      throw error
    }
   category =results.rows[0];
  console.log("results.rows[0]===="+ category.category);
  var forms =``;
  for(var t  in category.category) {
    forms +='<input type="text" id="'+category.category[t]+'" name="'+t+'" value="'+category.category[t]+'"><br>'
  }
  var template =`<!doctype html>
  <html>
  <head>
    <title>WEB1 - Welcome</title>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <meta charset="utf-8">
  </head>
  <body style="background:#e0fffc">

  <div class="logo_wrapper" style="align:center;">

    <h1 align='center'><b><u>${category.category_name}</b></u> 카테고리 수정하기</h1>
    <br>
    <hr>
      <h2 align='center'><<기존 카테고리 중에서 수정>></h2>  <p align='center'>칸의 내용을 수정하고 저장하면 적용됩니다.</p>
    <div class="w3-row" style="align: center;">
    <div class="w3-container w3-center w3-col">
      <form action="/categories_modify/modify?id  =${id}"  method="post">
        ${forms}
        <hr><hr>
        <h2><<카테고리 새로 생성>></h2>  <p>칸에 입력하면 추가됩니다.</p>
        <input type="text" id="create_category_1" name="create_category_1"><br>
          <input type="text" id="create_category_1" name="create_category_2"><br>
            <input type="text" id="create_category_1" name="create_category_3"><br>
              <input type="hidden" id="current_cat_n" name="current_cat_n" value="${category.category.length}">
        <input type="hidden" id="where" name="where" value="${name}">
       <input class="w3-button w3-blue" type="submit" value="수정 저장하기">
      </form>
    </div>
    </div>
  </div>

  <style>
    .logo_wrapper {
      margin-bottom: 30px;
      padding-top: 100px;
      margin-top:150px;
      box-shadow: 0 8px 16  px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      background: white;
      display: block;
      margin-left: auto;
      margin-right: auto;
      width:80%;
      hegiht:100%;
    }
    .logo_wrapper:hover {
    box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2);
  }
      .fcontainer {
        padding: 2px 16px;
      }
  </style>

  </body>
  </html>
`;
response.send(template);

  })

});

router.post('/modify', function (request, response) {

  var id = request.query.id;
 var raw_info_set = request.body;
 console.log("body",request.body)
  var current_cat_n = request.body.current_cat_n;
  var where1 = request.body.where;

  var arr = []
  for(var a=0; a<current_cat_n;a++){
    if(request.body[a]) {
    arr.push(request.body[a]);
  }
  }
  for(var b=1; b<=3;b++) {
    if(request.body['create_category_'+b]){
      arr.push(request.body['create_category_'+b]);
    }
  }
  var category;
  pool.query(
    'UPDATE categories SET category=$2 WHERE category_name = $1',
    [where1, arr],
    (error, results) => {
      if (error) {
        throw error
      }
        response.redirect(`/categories_modify?id=${id}`);
    })
});
module.exports = router;
