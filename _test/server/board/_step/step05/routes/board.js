// 모듈 불러오기
const router = require('express').Router();

// 모델 불러오기
const Post = require('../models/post');

// method와 body 정보 확인
router.use(function (req, res, next) {
    console.log(`method : ${req.method} / url: ${req.url}`);
    if (req.method == 'POST' || req.method == 'UPDATE') {
        console.log(`body : ${JSON.stringify(req.body)}`);
    };
    next();
});

// 게시글 작성
router.post('/', async function (req, res, next) {
    try {
        const post = await Post.create(req.body);
        console.log(post);
        res.json(post);
    } catch (err) {
        next(err)
    }
});

// 전체 조회
router.get('/', async function (req, res, next) {
    try {
        const postList = await Post.find({});
        console.log(postList);
        res.json(postList);
    } catch (err) {
        next(err)
    }
});

// 페이지별 조회
router.get('/:page', async function (req, res, next) {
    try {
        // limit : page별 item수, page : 조회할 page 
        const postPage = await Post.paginate({}, { limit: 5, page: Number(req.params.page) });
        console.log(postPage);
        res.json(postPage.docs);
    } catch (err) {
        next(err)
    }
});

// 게시글 개별 조회
router.get('/id/:id', async function (req, res, next) {
    // findById : id로 검색할 수 있게 해주는 메소드
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        res.json(post);
    } catch (err) {
        next(err)
    }
});

// 게시글 업데이트
router.put('/id/:id', async function (req, res, next) {
    // findByIdAndUpdate : id로 검색 후 수정
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const msg = `수정 성공 : ${JSON.stringify(post)}`
        console.log(msg);
        res.json(msg);
    } catch (err) {
        next(err)
    }
});

// 게시글 삭제
router.delete('/id/:id', async function (req, res, next) {
    // findByIdAndDelete : id로 검색 후 삭제
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        const msg = `삭제 성공 : ${JSON.stringify(post)}`
        console.log(msg);
        res.json(msg);
    } catch (err) {
        next(err)
    }
});

// 에러 처리
router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

// 라우터 내보내기
module.exports = router;