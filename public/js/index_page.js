// axios를 통해 router에 pagination된 묶음 요청
const getReviewPromise = async (page = 1) => {
    try {
        const response = await axios.get(`/reviews/${page}`);
        // console.log(response);
        // response는 promise의 형태로 반환됨, 만약에 이걸 다시 쓰고 싶다며 then을 쓰거나 다른 async 안에 넣어서 await 방식으로 값을 꺼내 써야함
        return response.data;
    } catch (err) { console.error };
}
// const reviews = getReviewList()

// 요소를 생성해주는 함수 (차후 common으로 옮기기)
const makeElement = (tagName, classList=[], inner="") => {
    const element = document.createElement(tagName);
    // console.log(classList);
    for (const v of classList) {
        element.classList.add(v)        
    }
    element.innerHTML = inner;
    return element
} 

// 별을 그려주는 함수 (차후 common으로 옮기기)
const drawStar = (rate, el) => {
    // console.log(el);
    if (el) {
        // 첫번째 div (실제 움직이는 별)
        const div1 = makeElement('div');
        for (let i = 0; i < 5; i++) {
            div1.appendChild(makeElement('i', ['fa']))
        }
        // 두번째 div (프레임 역할을 하는 별)
        const div2 = makeElement('div');
        for (let i = 0; i < 5; i++) {
            div2.appendChild(makeElement('i', ['fa', 'fa-star-o']))
        }
        el.appendChild(div1);
        el.appendChild(div2);
    } else {
        el = dom.querySelector('#inputStoreStar');
    }
    // console.log(el);
    // 지정한 클래스 안에 있는 첫번째 div(background) 요소 속 아이콘들을 지정
    const stars = el
        .getElementsByTagName('div')[0]
        .getElementsByTagName('i');
    // 일괄적으로 꽉찬 별, 반쪽 별 모두 class를 지워준다
    for (const v of stars) {
        v.classList.remove("fa-star");
        v.classList.remove("fa-star-half-full");
    }
    let i = 0;
    while (rate > 0) {
        // console.log(`i, ${i}, rate, ${rate}`);
        if (rate >= 1) {
            rate--;
            stars[i].classList.add("fa-star");
        } else {
            if (rate == 0.5) {
                stars[i].classList.add("fa-star-half-full");
            }
            break;
        }
        i++;
    }
}

// 받아온 묶음을 그려주는 함수
const drawReviewList = async reviewPromise => {
    // #reviewList 조회 및 초기화
    const reviewList = document.querySelector('#reviewList');
    reviewList.innerHTML = "";
    // 개별 리뷰 요소 작성
    const drawStore = (review) => {
        // 담아줄 요소 생성
        const reviewElement = makeElement('div', ['col-md-6', 'col-lg-4', 'd-flex', 'rounded']);
        // 전체 카드
        const reviewCard = makeElement('div', ['card', 'w-100', 'm-3', 'overflow-auto']);
        // 카드 헤더 추가
        const reviewCardHeader = makeElement("div", ['card-header'], `<h5 class="font-weight-bold text-truncate">${review.name}</h6><p class="mb-n1 text-muted text-truncate"><small>${review.address}</small></p>`)
        reviewCard.appendChild(reviewCardHeader);
        // 리뷰 이미지
        const reviewImage = makeElement('div', ['card-img', 'border', 'rounded-0']);
        const src = review.image;
        const imgur = 'https://imgur.com/';
        reviewImage.style.height = "12rem";
        if (src == '' || src == 'test') {
            reviewImage.style.backgroundImage = 'url(img/meal.png)';
            reviewImage.style.backgroundSize = 'contain';
        } else {
            // 차후 수정 예정 (api를 붙여서)
            reviewImage.style.backgroundImage = `url(${src.includes(imgur) ? src.replace(imgur, 'https://i.imgur.com/').concat('.png') : src}), url(${src.includes(imgur) ? src.replace(imgur, 'https://i.imgur.com/').concat('.jpg') : src})`;
            reviewImage.style.backgroundSize = 'cover';
        }
        reviewImage.style.backgroundRepeat = 'no-repeat';
        reviewImage.style.backgroundPosition = 'center center';
        reviewCard.appendChild(reviewImage);
        // 리뷰 바디
        const reviewCardBody = makeElement('section', ['card-body']);
        // 별점 데이터
        const reviewStar = makeElement('div', ['storeStar', 'mb-2']);
        drawStar(review.rate, reviewStar);
        reviewCardBody.appendChild(reviewStar);
        // 리뷰 글 (일정 이상 넘어가면 ... 표시)
        reviewCardBody.appendChild(makeElement('div', ['small', 'card-text', 'text-truncate'], review.comments.replace(/<br>/g, ' ')));
        reviewCard.appendChild(reviewCardBody);
        // card-footer
        reviewCard.appendChild(makeElement('footer', ['card-footer', 'text-right', 'font-italic'], review.createdAt.substring(0, 10)));
        // card마다 상세보기 페이지와 연결
        reviewCard.style.cursor = "pointer";
        reviewCard.onclick = function() {
            // 상세보기 템플릿 구현 후 수정
            location.href = `/reviews/id/${review._id}`
        }
        reviewElement.appendChild(reviewCard);
        reviewList.appendChild(reviewElement);
    }
    const reviewData = await reviewPromise;
    // console.log(reviewData)
    reviewData.docs.forEach(drawStore)
    // 페이지네이션 (현재, 최대)
    const pagination = (current, limit) => {
        const pageItem = (page, inner, classList) => {
            // 연결해야하는 페이지, 내용, 적용하는 클래스
            // 포맷팅으로 받아서 표현해줌
            // bootstrap 4 통해서 서식 표현
            // https://getbootstrap.com/docs/4.0/components/pagination/
            const element = makeElement('li', ['page-item'].concat(classList), `<button type="button" class="page-link" ${page != 0 ? 'onclick="drawReviewList(getReviewPromise('+ page : ''}));"><span>${inner}</span></button>`);
            return element;
        }
        const nav = makeElement('nav', ['w-100', 'd-flex', 'justify-content-center'])
        const ul = makeElement('ul', ['pagination']);
        // 이전 보기
        // 0보다 작아지면 disabled
        const prev = pageItem(current - 1 > 0 ? current -1 : 0, '&laquo', current - 1 > 0 ? [] : ['disabled']);
        ul.append(prev);
        // current +- 2 사이의 값이 있으면 표현
        for (let i = current - 2; i <= current + 2; i++) {
            // 0보다 작거나 최대한도를 넘어가 버리면 continue
            if(i <= 0 || i > limit) continue
            // 현재 페이지와 같으면 active 처리
            ul.append(pageItem(i, i, i == current ? ['active'] : []))
        }
        // 다음 보기
        // limit보다 커지면 disabled
        const next = pageItem(current + 1 <= limit ? current + 1 : 0, '&raquo', current + 1 <= limit ? [] : ['disabled']);
        ul.append(next);
        nav.append(ul);
        reviewList.append(nav);
    }
    pagination(reviewData.page, reviewData.pages);
}

drawReviewList(getReviewPromise());