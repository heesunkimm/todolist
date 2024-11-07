// express 라이브러리 변수선언
const express = require('express')
const app = express()
// 몽고 DB 라이브러리 변수선언
const { MongoClient } = require('mongodb')
// 환경변수 파일 사용하기위해 선언
require('dotenv').config() 
// passport 회원가입 라이브러리 변수선언
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// CSS 연결
app.use(express.static(__dirname + '/public'));
// view engine 사용설정
app.set('view engine', 'ejs');
// passport 라이브러리 설정
app.use(passport.initialize())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave : false,
  saveUninitialized : false
}))
// 몽고DB 연결
let db
const url = process.env.DB_URL
new MongoClient(url).connect().then((client)=>{
    console.log('DB연결성공')
    db = client.db('todolist')
    // 서버연결
    app.listen(process.env.PORT, () => {
    console.log('서버접속중');
    });
}).catch((err)=>{
  console.log(err)
})

// login
app.get('/', (req, resp) => {
  resp.render('login.ejs')
})

// join
app.get('/join', (req, resp) => {
    resp.render('join.ejs')
})

// index
app.get('/index', (req, resp) => {
    resp.render('index.ejs')
})

// diary
app.get('/diary', (req, resp) => {
    resp.render('diary.ejs')
})

// mypage
app.get('/mypage', (req, resp) => {
    resp.render('mypage.ejs')
})