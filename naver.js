const request = require('request')
const NAVER_CLIENT_ID     = 'bKg1TGxIS6WhGrGsHZdw'
const NAVER_CLIENT_SECRET = 'P84ejEZRVp'
const option = {
  query  :'수능특강', //이미지 검색 텍스트
  start  :1, //검색 시작 위치
  display:3, //가져올 이미지 갯수
  sort   :'sim'//정렬 유형 (sim:유사도)

}


var express = require('express');
var app = express();
app.get('*', function (req, response, next) {
  request.get({
    uri:'https://openapi.naver.com/v1/search/book.json', //xml 요청 주소는 https://openapi.naver.com/v1/search/image.xml
    qs :option,
    headers:{
      'X-Naver-Client-Id':NAVER_CLIENT_ID,
      'X-Naver-Client-Secret':NAVER_CLIENT_SECRET
    }
  }, function(err, res, body) {
    let json = JSON.parse(body) //json으로 파싱
    console.log(json)
  })

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
