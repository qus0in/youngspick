// express : https://expressjs.com/ko/
// mongoose : https://mongoosejs.com/docs/guide.html
// 3단계 : 스키마 설정 및 get, post

const express = require('express')
const mongoose = require('mongoose')

// mongoose 연결
// 주의사항
// 1) : 스타벅스와 같은 개방형 와이파이에서는 db연결 시도시 먹히질 않음
// 2) : 중복 로그인 시 권한 오류 발생 (테스트용/실제 서버용 유저 구분해서!) 사용한 터미널은 종료하고...)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("mongoDB 연결 성공"))
    .catch(err => console.error(err));

const app = express()
const port = process.env.PORT || 4500

// post 등에서 request를 파싱하기 위해 json, urlencoded 등을 사용
// https://expressjs.com/ko/4x/api.html#req
// body-parser를 쓰는 경우도 있는데 4.16.0 버전부터 express에 bundle 되었음
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// [스키마 & 모델 설정] (차후에 모듈화)
// 스키마 작성
// - attribute들의 이름과 데이터 타입
const boardSchema = new mongoose.Schema({
    title: String
}, { timestamps: true });
// 메소드 추가 (this는 해당 스키마로 생성되는 객체 자체)
boardSchema.methods.brief = function () {
    return `제목: ${this.title}, 생성일: ${this.createdAt}`
}
// 스키마를 모델로 컴파일
const Board = mongoose.model('Board', boardSchema);

app
    .get('/', (req, res) => res.send('Hello World!'))
    // restful api 테스트 by postman : https://www.postman.com/
    // post -> Body -> raw -> {"title":"테스트"}
    // .post('/board', function (req, res) {
    //     console.log(req.body) // body를 받아서 json로 해석
    //     res.json(req.body) // body를 고스란히 json 포맷으로 돌려준다
    // })
    // https://medium.com/@feedbotstar/node-js-%EB%A1%9C-crud-%EB%A7%8C%EB%93%A4%EC%96%B4-%EB%B3%B4%EA%B8%B0-cdcbaf7174a7
    .get('/board', async function (req, res) {
        const boardList = await Board.find({})
        res.json(boardList)
    })
    .post('/board', async function (req, res) {
        console.log(req.body)
        // await로 저장이 되어야 res를 줄 수 있도록.
        const newBoard
            // save를 쓰는 버전
            // = await (new Board({title: req.body.title})).save()
            // create를 쓰는 버전
            = await Board.create({ title: req.body.title })
        console.log(newBoard)
        console.log(newBoard.brief())
        res.json(newBoard) // 저장이 된 결과물을 json 포맷으로 돌려준다
    })
    .listen(port, () => console.log(`listening on port ${port}!`))