// 모듈 불러오기
const router = require('express').Router();

// 모델 불러오기
const Review = require('../models/review');

// method와 body 정보 확인
router.use(function (req, res, next) {
    console.log(`method : ${req.method} / url: ${req.url}`);
    if (req.method == 'POST' || req.method == 'UPDATE') {
        console.log(`body : ${JSON.stringify(req.body)}`);
    };
    next();
});

// 동기 (sync)

// 기본 접속
router.get('/', (req, res) => res.render('pages/index', { page: "main", title: "Young's Pick"}))

// 리뷰 작성
router.post('/write', async function (req, res, next) {
    try {
        const review = await Review.create(req.body);
        console.log(review);
        res.json(review);
    } catch (err) {
        next(err)
    }
});

// 리뷰 삭제
router.post('/delete', async (req, res, next) => {
    try {
        // console.log(req.headers.referer)
        const id = String(req.headers.referer).match(/review\/(\d+)/)[1]
        // console.log(id)
        const review = await Review.findByIdAndDelete(id);
        const msg = `삭제 성공 : ${JSON.stringify(review)}`
        console.log(msg);
        res.redirect('/');
    } catch (err) {
        next(err)
    }
})

// 비동기 (async)
// 페이지별 조회
router.get('/page/:page', async function (req, res, next) {
    try {
        // limit : page별 item수, page : 조회할 page 
        const reviewPage = await Review.paginate({}, { limit: 6, page: Number(req.params.page) });
        console.log(`page ${reviewPage.page} / ${reviewPage.pages}`);
        res.json(reviewPage);
    } catch (err) {
        next(err)
    }
});

// 게시글 개별 조회
router.get('/review/:id', async function (req, res, next) {
    // findById : id로 검색할 수 있게 해주는 메소드
    try {
        const review = await Review.findById(req.params.id);
        console.log(review);
        res.render('pages/detail', { page: "detail", title: `Young's Pick - ${review.name}`, review: review})
    } catch (err) {
        next(err)
    }
});

// 게시글 업데이트
router.put('/id/:id', async function (req, res, next) {
    // findByIdAndUpdate : id로 검색 후 수정
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const msg = `수정 성공 : ${JSON.stringify(review)}`
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