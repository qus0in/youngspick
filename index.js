// Dependencies
const express = require('express')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const path = require('path') // 


// MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("mongoDB 연결 성공"))
    .catch(err => console.error(err));

// Auto-increment 초기화
autoIncrement.initialize(mongoose.connection);

const app = express()
const port = process.env.PORT || 5000

// 파싱 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 정적(static) 파일 사용
app.use(express.static(path.join(__dirname, 'public')))
// 템플릿 엔진 사용
// Express와 함께 템플리트 엔진을 사용
// http://expressjs.com/ko/guide/using-template-engines.html
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

// [라우터]
app.use('/', require('./routes/reviews'))
app.listen(port, () => console.log(`listening on port ${port}!`))