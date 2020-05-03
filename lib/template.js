
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

module.exports = {
  HTML:function(title,  body, control, authStatusUI=`
      <a href="/auth/login">login</a> |
      <a href="/auth/register">Register</a> |
      <a href="/auth/facebook">Login with Facebook</a>`){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${control}
      ${body}
    </body>
    </html>
    `;
  },login: function(title, body){
    return`<!doctype html>
    <html>
    <head>
      <title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
      <meta charset="utf-8">
    </head>
    <body style="background:#e0fffc">

    <div class="logo_wrapper">
    <a class= "w3-button" href ="/" style="width: 100%;">
    <img src ="/data/logo.jpg" class="flogo">
    </a>
    ${body}
    </div>
    <style>

      .login_wrapper {
        margin-top: 20px;
        margin-bottom: 40px;
      }
      button.login_button {
        border-radius: 100rem;
        padding: 1rem;
        font-family: 'Avenir Next';
        font-size: 1rem;
        padding: .5rem 3rem;
        color: $color-black;
        box-shadow: 0 0 6px 0 rgba(157, 96, 212, 0.5);
        margin:4px;
        border: solid 5px transparent;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(#86DBD4, #95C9E1);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 2px 1000px 1px #fff inset;
      }

      button.login_button:hover {
        box-shadow: none;
        color: white;
      }

      .flogo {

        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
      }
      .logo_wrapper{
        padding-top: 100px;
        margin-top:150px;
        box-shadow: 0 8px 16  px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        background: white;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width:400px;
        hegiht:100%;
      }
      .logo_wrapper:hover {
      box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2);
    }
        .fcontainer {
          text-align:center;
          padding: 2px 16px;
        }
    </style>

    </body>
    </html>
`
}, login1: function(title, body){
    return`<!doctype html>
    <html>
    <head>
      <title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
      <meta charset="utf-8">
    </head>
    <body style="background:#e0fffc">

    <div class="logo_wrapper">
    <a class= "w3-button" href ="/" style="width: 100%;">
    <h4> 예약 목록 정산하기</h4>
    <p style="color:red ">*한번 정산 완료하면 수정 및 취소할 수 없으니 충분히 검토 후 제출해주세요!</p>
    <img src ="/data/logo.jpg" class="flogo" style="width: 100px;">
    </a>
    ${body}
    </div>
    <style>

      .login_wrapper {
        margin-top: 20px;
        margin-bottom: 40px;
      }
      button.login_button {
        border-radius: 100rem;
        padding: 1rem;
        font-family: 'Avenir Next';
        font-size: 1rem;
        padding: .5rem 3rem;
        color: $color-black;
        box-shadow: 0 0 6px 0 rgba(157, 96, 212, 0.5);
        margin:4px;
        border: solid 5px transparent;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(#86DBD4, #95C9E1);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 2px 1000px 1px #fff inset;
      }

      button.login_button:hover {
        box-shadow: none;
        color: white;
      }

      .flogo {

        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
      }
      .logo_wrapper{
        padding-top: 100px;
        margin-top:150px;
        box-shadow: 0 8px 16  px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        background: white;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width:1000px;
        hegiht:100%;
      }
      .logo_wrapper:hover {
      box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2);
    }
        .fcontainer {
          text-align:center;
          padding: 2px 16px;
        }
    </style>

    </body>
    </html>
`
},login2: function(title, body){
    return`<!doctype html>
    <html>
    <head>
      <title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
      <meta charset="utf-8">
    </head>
    <body style="background:red">

    <div class="logo_wrapper">
    <a class= "w3-button" href ="/" style="width: 100%;">
    <h4>고급 명령어</h4>
    <p style="color:red ">*고급 명령어입니다. 사전 숙지후 선택해주세요.</p>
    <img src ="/data/logo.jpg" class="flogo" style="width: 100px;">
    </a>
    ${body}
    </div>
    <style>

      .login_wrapper {
        margin-top: 20px;
        margin-bottom: 40px;
      }
      button.login_button {
        border-radius: 100rem;
        padding: 1rem;
        font-family: 'Avenir Next';
        font-size: 1rem;
        padding: .5rem 3rem;
        color: $color-black;
        box-shadow: 0 0 6px 0 rgba(157, 96, 212, 0.5);
        margin:4px;
        border: solid 5px transparent;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(#86DBD4, #95C9E1);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 2px 1000px 1px #fff inset;
      }

      button.login_button:hover {
        box-shadow: none;
        color: white;
      }

      .flogo {

        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
      }
      .logo_wrapper{
        padding-top: 100px;
        margin-top:150px;
        box-shadow: 0 8px 16  px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        background: white;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width:1000px;
        hegiht:100%;
      }
      .logo_wrapper:hover {
      box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2);
    }
        .fcontainer {
          text-align:center;
          padding: 2px 16px;
        }
    </style>

    </body>
    </html>
`
}, cart:function(name, pd) {

    return ` <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>장바구니</title>

        <style>
            @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500);

            * {
              box-sizing: border-box;
            }

            html,
            body {
              width: 100%;
              height: 100%;
              padding: 10px;
              margin: 0;
              background-color:#e0fffc;
              font-family: 'Roboto', sans-serif;
            }

            .shopping-cart {
              padding-bottom:10px;
              width: 750px;
              margin: 80px auto;
              background: #FFFFFF;
              box-shadow: 1px 2px 3px 0px rgba(0,0,0,0.10);
              border-radius: 6px;

              display: flex;
              flex-direction: column;
            }

            .title {
              height: 60px;
              border-bottom: 1px solid #E1E8EE;
              padding: 10px 10px;
              color: #5E6977;
              font-size: 18px;
              font-weight: 400;
            }

            .item {
              padding: 10px 30px;
              height: 120px;
              display: flex;
            }


            /* Buttons -  Delete and Like */
            .buttons {
              position: relative;
              padding-top: 30px;
              margin-right: 60px;
            }

            .delete-btn {
              display: inline-block;
              cursor: pointer;
              width: 18px;
              height: 17px;
              background: url("/delete-icn.svg") no-repeat center;
              margin-right: 20px;
            }

            .like-btn {
              font-size:10px;
               text-align:center;
              position: absolute;
              top: 9px;
              left: 15px;
              display: inline-block;
              background: url('/twitter-heart.png');
              width: 70px;
              height: 70px;
              background-size: 2900%;
              background-repeat: no-repeat;
              cursor: pointer;
            }

            .is-active {
              animation-name: animate;
              animation-duration: .8s;
              animation-iteration-count: 1;
              animation-timing-function: steps(28);
              animation-fill-mode: forwards;
            }

            @keyframes animate {
              0%   { background-position: left;  }
              50%  { background-position: right; }
              100% { background-position: right; }
            }

            /* Product Image */
            .image {
              margin-right: 50px;
            }

            /* Product Description */
            .description {
              padding-top: 10px;
              margin-right: 60px;
              width: 115px;
            }

            .description span {
              display: block;
              font-size: 14px;
              color: #43484D;
              font-weight: 400;
            }

            .description span:first-child {
              margin-bottom: 5px;
            }
            .description span:last-child {
              font-weight: 300;
              margin-top: 8px;
              color: #86939E;
            }

            /* Product Quantity */
            .quantity {
              padding-top: 20px;
              margin-right: 60px;
            }
            .quantity input {
              -webkit-appearance: none;
              border: none;
              text-align: center;
              width: 32px;
              font-size: 16px;
              color: #43484D;
              font-weight: 300;
            }

            button[class*=btn] {
              width: 30px;
              height: 30px;
              background-color: #E1E8EE;
              border-radius: 6px;
              border: none;
              cursor: pointer;
            }
            .minus-btn img {
              margin-bottom: 3px;
            }
            .plus-btn img {
              margin-top: 2px;
            }
            button:focus,
            input:focus {
              outline:0;
            }

            /* Total Price */
            .total-price {
              width: 83px;
              padding-top: 27px;
              text-align: center;
              font-size: 16px;
              color: #43484D;
              font-weight: 300;
            }

            /* Responsive */
            @media (max-width: 800px) {
              .shopping-cart {
                width: 100%;
                height: auto;
                overflow: hidden;
              }
              .title {
                font-size: 12px;
              }
              .item {
                height: auto;
                flex-wrap: wrap;
                justify-content: center;
              }
              .image img {
                width: 50%;
              }
              .image,
              .quantity,
              .description {
                width: 100%;
                text-align: center;
                margin: 6px 0;
              }
              .buttons {
                margin-right: 20px;
              }
            }

            </style>

            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                <script src="https://code.jquery.com/jquery-2.2.4.js" charset="utf-8"></script>
                <meta name="robots" content="noindex,follow" />
              </head>
              <body>
              <header style="background-color:white;">
              <a href ="/">
                <img src ="/data/logo.jpg" class="logo1" style="width:100px;">
                </a>
                </header>
                <div class="shopping-cart">
                  <!-- Title -->
                    <div class="title w3-row">
                  <div class="w3-col s2">
                    <p style="font-size:13px;">${name}님 장바구니</p>
                  </div>
                  <div class="w3-right" style="width:100px">
             <a href="/auth/update" class="w3-button w3-card w3-round" style="background-color:#FCD0E9; font-size:11px;"><i class="fa fa-user w3-white" aria-hidden="true"></i>회원 정보 수정</a>
                  </div>
                  <div class=" w3-right" style="width:110px;">
                    <a href="/auth/logout" class=" w3-button w3-card w3-round" style="background-color:#86DBD6; font-size:11px;"><i class="fa fa-user" style="color::white;"aria-hidden="true"></i><u>로그아웃하기</u></a>
                      </div>
                </div>
              ${pd}
        </div>

                <script type="text/javascript">
                  $('.minus-btn').on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $input = $this.closest('div').find('input');
                    var value = parseInt($input.val());

                    if (value > 1) {
                      value = value - 1;
                    } else {
                      value = 0;
                    }

                    $input.val(value);

                  });

                  $('.plus-btn').on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $input = $this.closest('div').find('input');
                    var value = parseInt($input.val());

                    if (value < 100) {
                      value = value + 1;
                    } else {
                      value =100;
                    }

                    $input.val(value);
                  });
                    $('.delete-btn').on('click', function() {
                        var id = $(this).attr('id');
                      $(this).toggleClass('is-active');
                      if(confirm("장바구니에서 삭제하시겠습니까?")) {
                          location.href ='/auth/delete_from_shopping_cart?id='+id;
                        }
                    });
                  $('.like-btn').on('click', function() {
                      var id = $(this).attr('id');
                    if($(this).hasClass("booked")){
                      if(confirm("예약을 취소하시겠습니까?")) {
                          var date = new Date();
                        if(11<=date.getHours() && date.getHours()<=14) {
                          alert("오전 11시부터 오후 2시까지는 예약을 취소할 수 없습니다.");
                        } else {

                        location.href='/auth/cancel_book_cart?id='+id;

                         }
                        }
                      }else{
                                      var date = new Date();
                        if( 11>date.getHours()) {
                          date.setDate(date.getDate());
                          var month=date.getMonth()+1;
                          var day = date.getDate();
                          if(confirm('오늘('+month+'월'+day+'일) 점심시간까지 예약하시겠습니까?')) {
                        alert('[책제목]예약이 완료되었습니다.오늘('+month+'월'+day+'일) 점심시간 ~~시부터 ~~시에 ~~에서 지불할 금액을 준비하여 북마켓 부스를 방문해주시기 바랍니다.')
                          location.href='/auth/book_process_cart?id='+id;
                          }
                          } else {
                            if(  date.getHours()<=14) {
                                alert("오전 11시부터 오후 2시까지는 예약할 수 없습니다.");
                            }
                            else {
                              date.setDate(date.getDate()+1);
                              var month=date.getMonth()+1;
                              var day = date.getDate();
                              if(confirm('내일('+month+'월'+day+'일) 점심시간까지 예약하시겠습니까?')) {
                            alert('[책제목]예약이 완료되었습니다.내일('+month+'월'+day+'일) 점심시간 ~~시부터 ~~시에 ~~에서 지불할 금액을 준비하여 북마켓 부스를 방문해주시기 바랍니다.')
                              location.href='/auth/book_process_cart?id='+id;
                        }
                          }
                        }

                      }

                  });
                </script>
              </body>
            </html>
 `;


},
main: function(current_cat, intlcat_str,domecat_str,bothcat_str, book_str,admin) {


  return `<!DOCTYPE html>
  <html>
  <title>HAFS 책방</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://code.jquery.com/jquery-2.2.4.js" charset="utf-8"></script>

  <style>
  .w3-sidebar a {font-family: "Roboto", sans-serif}
  body,h1,h2,h3,h4,h5,h6,.w3-wide {font-family: "Montserrat", sans-serif;}
  </style>
  <body class="w3-content" style="max-width:1600px; background:#e0fffc">
    <div class="content_wrapper">
      <style>

          .content_wrapper {
            padding-left: 150px;
            padding-right: 150px;
            padding-bottom: 100px;
            padding-top:80px;
            background:white;
            height:100% ;
             margin-left: auto;
             margin-right: auto;
          }
          .header {
            font-size:13px;
            list-style-type: none;
            margin: 0;
            padding: 0px;
            overflow: hidden;
            border: 1px solid #e7e7e7;
            background-color: #86DBD4;
          }

          li {
            float: left;
          }

          li a {
            display: block;
            color: #666;
            text-align: center;
            padding: 10px 16px;
            text-decoration: none;
          }

          li a:hover:not(.active) {
            background-color: white;
          }

          li a.active {
            color: black;
            background-color: #FEE5A5;
          }
          .logo1 {
            width:95%;
          }
          @media only screen and (max-width: 1000px) {
              .content_wrapper {
                padding-left: 0px;
                padding-right: 0px;
          }
            li a {
              padding: 10px 6px;
          }
            .content_wrapper {
                  width:100%;
            }
          .header {
            font-size:1.7vw;
          }
          .logo1 {
            width:16vw;
          }

          }
    </style>
  <!-- Sidebar/menu -->
  <nav class="w3-sidebar w3-bar-block w3-white w3-collapse w3-top" style="z-index:3;width:270px" id="mySidebar">
    <a href ="/"><div class="w3-container w3-display-container w3-padding-16">
      <i onclick="w3_close()" class="fa fa-remove w3-hide-large w3-button w3-display-topright"></i>
      <img src ="/data/logo.jpg" class="logo1" style="width:100px;">
    </div>
    </a>
    <a href="/auth/logout" class="w3-bar-item w3-button w3-padding w3-card w3-round" style="background-color:#86DBD6;"><i class="fa fa-user" style="color::white;"aria-hidden="true"></i><u>로그아웃하기</u></a>
    <a href="/auth/update" class="w3-bar-item w3-button w3-padding w3-card w3-round" style="background-color:#FCD0E9;"><i class="fa fa-user w3-white" aria-hidden="true"></i>회원 정보 수정</a>
    <a href="javascript:void(0)" class="w3-bar-item w3-button w3-padding w3-card w3-round" style="background-color:#FEE4AB;" onclick="document.getElementById('newsletter').style.display='block'"><i class="fa fa-question-circle w3-white" aria-hidden="true"></i>북마켓이란?</a>

    <div class="w3-padding-64 w3-large w3-text-grey" style="font-weight:bold">
      <a href="#" class="w3-bar-item  w3-button">카테고리</a>

      <a onclick="myAccFunc()" href="javascript:void(0)" class="w3-button w3-block w3-white w3-left-align" id="myBtn">
        국제 도서 <i class="fa fa-caret-down"></i>
      </a>
        <form action="/" method="post" id ="cat">
      <div id="demoAcc" class="w3-bar-block w3-card w3-padding-large w3-medium">

      ${intlcat_str}
      </div>

      <a onclick="myAccFunc2()" href="javascript:void(0)" class="w3-button w3-block w3-white w3-left-align" id="myBtn">
        국내 도서 <i class="fa fa-caret-down"></i>
      </a>
      <div id="demoAcc2" class="w3-bar-block w3-card  w3-padding-large w3-medium">
${domecat_str}
      </div>

      <a onclick="myAccFunc3()" href="javascript:void(0)" class="w3-button w3-block w3-white w3-left-align" id="myBtn">
        공용 및 기타 <i class="fa fa-caret-down"></i>
      </a>
      <div id="demoAcc3" class="w3-bar-block w3-card w3-padding-large w3-medium">

      ${bothcat_str}
      </div>
    </form>
      </div>

  </nav>

  <!-- Top menu on small screens -->
  <header class="w3-bar w3-top w3-hide-large w3-xlarge" style="background:#e0fffc;">
    <div class="w3-row">
    <a href="/">  <div class="w3-col" style="width:25%">
    <img src ="/data/logo.jpg" class="logo1" style="width:83px;">
  </div>
      <div class="w3-col" style="width:65%">
        <h3>
       HAFS 책방
     </h3>
     </div></a>
         <div class="w3-col" style="width:5%">
    <a href="javascript:void(0)" class="w3-bar-item w3-button w3-padding-12 w3-right" onclick="w3_open()"><i class="fa fa-bars"></i></a>
  </div>
  </header>

  <!-- Overlay effect when opening sidebar on small screens -->
  <div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

  <!-- !PAGE CONTENT! -->
  <div class="w3-main" style="margin-left:290px">

    <!-- Push down content on small screens -->
    <div class="w3-hide-large" style="margin-top:83px"></div>

    <!-- Top header -->
    <header class="w3-container w3-xlarge">
      <p class="w3-left">${current_cat}</p>
      <p class="w3-right">
        <a href="/auth/cart"><button class="w3-button w3-round"><i class="fa fa-shopping-cart w3-margin-right"></i></button></a>
        <a href="/auth/search"><button class="w3-button w3-round"><i class="fa fa-search"></i></button></a>

      </p>
    </header>

    <!-- Image header -->


    <div class="w3-container w3-text-grey" id="jeans">
      <p>8 items</p>
    </div>
    ${admin}
    <!-- Product grid -->
    <div id="p-grid">

      ${book_str}
      </div>
      <style>
         /* Grid container */
         #p-grid {
           max-width: 1000px;
           margin: 0 auto;
           display: grid;
           /* Width of columns */
           grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% ;
         }
         /* Product items */
         div.p-grid-in {
           box-sizing: border-box;
           margin: 5px;
           padding: 10px;
           border: 1px solid #e8f0ff;
           background: #f2f7ff;
         }
         img.p-img {
           width: 100%;
           height: auto;
         }
         div.p-name {
           font-size: 0.7em;
         }
         div.p-price {
           text-align:center;
           color: #f44242;
         }
         div.p-desc {
           color: #888;
           font-size: 0.9em;
         }
         button.p-add:hover {
           opacity:0.7;
         }

         button.p-add {
           background: #f46b41;
           color: #fff;
           border: none;
           width: 100%;
           padding: 10px;
           margin: 10px 5px 5px 5px;
           font-size: 0.65em;
           cursor: pointer;
         }
         button.classA{
            background: #86DBD4;
         }
         button.classB{
            background: #FEE5A5;
         }
         button.classC{
            background: #EDADBB;
         }
         /* Responsive */

         @media only screen and (max-width: 600px) {
           #p-grid { grid-template-columns:25% 25% 25% 25%; }
         }
         /* [DOES NOT MATTER] */
         html, body {
           padding: 0;
           margin: 0;
           font-family: arial, sans-serif;
         }
         .bb  {
           background-color:#e0fffc;
         }
       </style>
    <!-- Subscribe section -->

    <!-- Footer -->
    <footer class="bb w3-padding-64 w3-light-grey w3-small w3-center" id="footer">
      <div class="w3-row-padding bb">
      </div>
    </footer>


    <!-- End page content -->
  </div>

  <!-- Newsletter Modal -->
  <div id="newsletter" class="w3-modal">
    <div class="w3-modal-content w3-animate-zoom" style="padding:32px">
      <div class="w3-container w3-white w3-center">
        <i onclick="document.getElementById('newsletter').style.display='none'" class="fa fa-remove w3-right w3-button w3-transparent w3-xxlarge"></i>
        <h2 align:'center' >북마켓<i class="fa fa-question-circle" aria-hidden="true"></i></h2>
        <p>북마켓은 국내학습부&국제학습부가 주관하는 사업으로, 수익금은 전액 모현도서관에 기부될 예정입니다.</p>
        <button type="button" class="w3-button w3-padding-large w3-red w3-margin-bottom" onclick="document.getElementById('newsletter').style.display='none'">좋은 것 같아요!<i class="far fa-grin-stars"></i></button>
      </div>
    </div>
  </div>
 <script type="text/javascript">

                $('.adder').on('click', function() {
                    if(confirm("장바구니에 추가하시겠습니까?")) {
                      var id = $(this).attr('id');
                      var cat = $(this).attr('data-sec');
                      location.href='/auth/add_to_shopping_cart?id='+id+'&second_cat='+cat;
                      }
                });
  function myAccFunc() {
    var x = document.getElementById("demoAcc");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else {
      x.className = x.className.replace(" w3-show", "");
    }
  }
  function myAccFunc2() {
    var x = document.getElementById("demoAcc2");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else {
      x.className = x.className.replace(" w3-show", "");
    }
  }
  function myAccFunc3() {
    var x = document.getElementById("demoAcc3");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else {
      x.className = x.className.replace(" w3-show", "");
    }
  }
  // Click on the "Jeans" link on page load to open the accordion for demo purposes
  document.getElementById("myBtn").click();


  // Open and close sidebar
  function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
  }

  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
  }
  </script>
  </div>
  </body>
  </html>




  `
}/*,list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/topic/${filelist[i].id}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }*/
}
