// 5단계 : 모듈화
// https://poiemaweb.com/nodejs-module
// https://expressjs.com/ko/guide/using-middleware.html#middleware.application

// 모듈 불러오기
const express = require('express')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

// MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("mongoDB 연결 성공"))
    .catch(err => console.error(err));

// Auto-increment 초기화
autoIncrement.initialize(mongoose.connection);

const app = express()
const port = process.env.PORT || 4500

// 파싱 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// [라우터]
app.get('/', (req, res) => res.send('Hello World!'));
// board 관련 라우터 미들웨어
app.use('/board', require('./routes/board'))
app.listen(port, () => console.log(`listening on port ${port}!`))