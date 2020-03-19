// express : https://expressjs.com/ko/
// mongoose : https://mongoosejs.com/docs/guide.html
// 4단계 : 게시판 CRUD & 라우팅

const express = require('express')
const mongoose = require('mongoose')
// autoIncrement 적용
// https://www.npmjs.com/package/mongoose-auto-increment
// https://sjh836.tistory.com/105
// npm install mongoose-auto-increment
const autoIncrement = require('mongoose-auto-increment')
// pagination 적용
// https://www.npmjs.com/package/mongoose-paginate
// npm install mongoose-paginate
const pagination = require('mongoose-paginate');
// mongoose 연결
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("mongoDB 연결 성공"))
    .catch(err => console.error(err));

// mongoose에 설정된 default connection 기준으로 autoIncrement 설정
autoIncrement.initialize(mongoose.connection);

const app = express()
const port = process.env.PORT || 4500

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// [스키마 & 모델 설정] (차후에 모듈화)
const boardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contents: { type: String, required: true },
    author: { type: String, required: true }
}, { timestamps: true });
// schema에 autoIncrement 플러그인 추가, 1부터 시작하게...
boardSchema.plugin(autoIncrement.plugin, { model: 'Board', startAt: 1 })
// schema에 pagination 플러그인 추가
boardSchema.plugin(pagination)
const Board = mongoose.model('Board', boardSchema);

// 에러 처리
handler = (err, res) => {
    console.error(err.stack);
    res.status(500).send(err.message);
}
// [라우터] (차후 모듈화 - 미들웨어)
// 기본 요청
app.use(function (req, res, next) {
    console.log(`method : ${req.method} / url: ${req.url}`);
    console.log(`body : ${JSON.stringify(req.body)}`);
    next();
});
app.get('/', (req, res) => res.send('Hello World!'));
// 게시글 작성
app.post('/board', async function (req, res) {
    try {
        const newBoard = await Board.create(req.body);
        console.log(newBoard);
        res.json(newBoard);
    } catch (err) {
        handler(err, res);
    }
});
// 전체 조회
app.get('/board', async function (req, res) {
    try {
        const boardList = await Board.find({});
        console.log(boardList);
        res.json(boardList);
    } catch (err) {
        handler(err, res);
    }
});
// 페이지별 조회
app.get('/board/:page', async function (req, res) {
    try {
        // limit : 최대 장수, page : 
        const boardPage = await Board.paginate({},{limit: 5, page: Number(req.params.page)});
        console.log(boardPage);
        res.json(boardPage.docs);
    } catch (err) {
        handler(err, res);
    }
});
// 게시글 개별 조회
app.get('/board/id/:id', async function (req, res) {
    // findById : id로 검색할 수 있게 해주는 메소드
    try {
        const board = await Board.findById(req.params.id);
        console.log(board);
        res.json(board);
    } catch (err) {
        handler(err, res);
    }
})
// 게시글 업데이트
app.put('/board/:id', async function (req, res) {
    // findByIdAndUpdate : id로 검색 후 수정
    try {
        const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const msg = `${board.id}.${board.title} 수정 성공`
        console.log(msg);
        res.json(msg);
    } catch (err) {
        handler(err, res);
    }
})
// 게시글 삭제
app.delete('/board/:id', async function (req, res) {
    // findByIdAndDelete : id로 검색 후 삭제
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        const msg = `${board.id}.${board.title} 삭제 성공`
        console.log(msg);
        res.json(msg);
    } catch (err) {
        handler(err, res);
    }
})
app.listen(port, () => console.log(`listening on port ${port}!`))