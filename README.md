# 훈련소 편지 봇

----
## 훈련소 편지 봇이란?
훈련소에 가 있을때  편지를 써달라고 여러 SNS에 대신 글을 작성 해주는 봇 입니다.

> 편지 받고싶어요 엉엉 ㅜㅜ

## 사용방법
1. git clone
2. npm install
3. node index.js ( add cron job every day )
4. go nonsan

## 왜 PHP파일이 있나요!
[gist](https://gist.github.com/anhproduction/cc21f6910fff9e59100420cf3e9edcf4)에서 긁어온 expire 페이스북 access token 가져오는 PHP입니다. js 포팅은 나중에.. 훈련소 다녀오고..

## 기능 요약
* 디스코드, 슬랙, 페이스북에 글을 작성 해줍니다.
* cron으로 하루마다 돌리면 원하는 날짜에 작성 가능합니다.
* 실시간 인기 뉴스 헤드라인 파싱


## 외부 라이브러리
* cheerio
* dateformat
* discord.io
* fb
* slack-node
* gist에서 가져온 facebook access token 
