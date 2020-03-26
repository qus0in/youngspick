// 모듈 불러오기
const router = require('express').Router();
const imgur = require('imgur'); // imgur api
const multer  = require('multer'); // 파일 테스트
const upload = multer({ storage: multer.memoryStorage() }); // 임시 메모리 저장소 사용

// 모델 불러오기
const Review = require('../models/review');

// imgur api 관련 세팅
imgur.setClientId(process.env.IMGUR_CLIENTID);

// method와 body 정보 확인
router.use(function (req, res, next) {
    console.log(`method : ${req.method} / url: ${req.url}`);
    next();
});

// 동기 (sync)

// 기본 접속
router.get('/', (req, res) => res.render('pages/index', { page: "main", title: "Young's Pick" }))

// 리뷰 작성 (페이지)
router.get('/write', async function (req, res, next) {
    res.render('pages/write', { page: "write", title: "Young's Pick - 작성하기" })
});
// 리뷰 작성 (DB 연동)
// image라는 필드의 파일 정보 받아오기
router.post('/write', upload.single('image'), async function (req, res, next) {
    try {
        const reviewRaw = req.body;
        console.log(reviewRaw);
        // raw로 받아온 다음에 imgur API를 통해서 업로드하고 주소를 바꿔넣어줌
        // mutter를 통해 생성한 upload 함수로 req.file을 만들고, req.file의 buffer를 base64로 인코딩 후 해당 파일로 imgur api로 전달 => response로 json을 받아오는데 그중 data.link에서 업로드된 주소를 받아옴
        if (req.file) {
            // image 값이 있을 때만...
            console.log("<이미지 존재>")
            reviewRaw.image = await imgur.uploadBase64(req.file.buffer.toString('base64')).then((json) => json.data.link);
        } 
        const review = await Review.create(reviewRaw);
        console.log(review);
        res.redirect(`/review/${review._id}`);
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
        console.log(`삭제 성공 : ${JSON.stringify(review)}`);
        res.redirect('/');
    } catch (err) {
        next(err)
    }
})
// 리뷰 수정 (DB 연동)
router.post('/edit', upload.single('image'), async function (req, res, next) {
    try {
        const reviewRaw = req.body;
        console.log(reviewRaw);
        if (req.file) {
            // image 값이 있을 때만...
            console.log("<이미지 존재>")
            reviewRaw.image = await imgur.uploadBase64(req.file.buffer.toString('base64')).then((json) => json.data.link);
        } 
        const id = String(req.headers.referer).match(/review\/(\d+)/)[1]
        const review = await Review.findByIdAndUpdate(id, reviewRaw);
        console.log(`수정 성공 : ${JSON.stringify(review)}`);
        res.redirect(`/review/${review._id}`);
    } catch (err) {
        next(err)
    }
});

// 비동기 (async)
// 페이지별 조회
router.get('/page/:page', async function (req, res, next) {
    try {
        // limit : page별 item수, page : 조회할 page , sort : {field : -1} (내림차순)
        const reviewPage = await Review.paginate({}, { limit: 6, page: Number(req.params.page), sort: {_id : -1} });
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
        res.render('pages/detail', { page: "detail", title: `Young's Pick - ${review.name}`, review: review })
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
    res.status(500).render("pages/error.ejs", {title: "Young's Pick - 에러 발생", page: "error", message: err.message});
});

// 라우터 내보내기
module.exports = router;