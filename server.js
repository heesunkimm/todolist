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
// bcrypt 라이브러리 추가
const bcrypt = require('bcrypt');

// CSS 연결
app.use(express.static(__dirname + '/public'));
// view engine 사용설정
app.set('view engine', 'ejs');
// json 데이터 파싱
app.use(express.json());
// url 인코딩된 데이터 파싱 (폼 데이터 처리)
app.use(express.urlencoded({ extended: true }));
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
app.get('/', (req, res) => {
  res.render('login.ejs')
});

// join
app.get('/join', (req, res) => {
    res.render('join.ejs')
});
app.post('/join', async (req, res) => {
    try{
        let KoRegex = /^[가-힣]+$/;
        let EngNumRegex =  /^[A-Za-z0-9]+$/;

        if(!KoRegex.test(req.body.userName)) {
            return res.send("<script>alert('유저이름은 한글만 입력 가능합니다.'); history.back();</script>");
        }else if(!EngNumRegex.test(req.body.userId)){
            return res.send("<script>alert('아이디는 영어와 숫자만 입력 가능합니다.'); history.back();</script>");
        }else if(req.body.userPw != req.body.userPw02) {
            return res.send("<script>alert('비밀번호가 서로 일치하지 않습니다.'); history.back();</script>");
        }else if(req.body.userPw == req.body.userPw02 && 
            (!EngNumRegex.test(req.body.userPw) || !EngNumRegex.test(req.body.userPw02))) {
            return res.send("<script>alert('아이디는 영어와 숫자만 입력 가능합니다.'); history.back();</script>");
        }else {
            // 비밀번호 암호화
            let userPw = bcrypt.hashSync(req.body.userPw, 10);
            await db.collection('user').insertOne({userName: req.body.userName, userId: req.body.userId, userPw: userPw})
            res.send("<script>alert('회원가입이 완료되었습니다.'); window.location = '/';</script>");
        }
    } catch(e){
        console.log("err" + e);
    }
})

// index
app.get('/index', (req, res) => {
    res.render('index.ejs')
});

// diary
app.get('/diary', (req, res) => {
    res.render('diary.ejs')
});

// mypage
app.get('/mypage', (req, res) => {
    res.render('mypage.ejs')
});