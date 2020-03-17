// express : https://expressjs.com/ko/
// mongoose : https://mongoosejs.com/docs/guide.html
// 2단계 : mongoose 세팅

const express = require('express')
// npm install mongoose
// 현재 mongoose 버전은 5.9.5
const mongoose = require('mongoose')

// mongoose 연결

// URL 자체가 코드에 들어가면 보안 상의 문제가 있을 수 있으므로 환경변수 사용
// 사용법 : process.env.{KEY NAME}
// mongoose URI에 들어가는 ID/PW에는 @가 안들어오도록 유념

// mongoose.connect()는 promise를 리턴
// https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("mongoDB 연결 성공"))
    .catch(err => console.error(err));

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`listening on port ${port}!`))