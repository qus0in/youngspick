// axios를 통해 router에 pagination된 묶음 요청
const getReviewPromise = async (page = 1) => {
    try {
        const response = await axios.get(`/page/${page}`);
        // console.log(response);
        // response는 promise의 형태로 반환됨, 만약에 이걸 다시 쓰고 싶다며 then을 쓰거나 다른 async 안에 넣어서 await 방식으로 값을 꺼내 써야함
        return response.data;
    } catch (err) { console.error };
}
// const reviews = getReviewList()

// 받아온 묶음을 그려주는 함수
const drawReviewList = async reviewPromise => {
    // #reviewList 조회 및 초기화
    const reviewList = document.querySelector('#reviewList');
    reviewList.classList.remove("fade-in");
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
        reviewImage.style.height = "12rem";
        console.log(src);
        if (src) {
            reviewImage.style.backgroundImage = `url(${src})`;
            reviewImage.style.backgroundSize = 'cover';
        } else {
            reviewImage.style.backgroundImage = 'url(/img/meal.png)';
            reviewImage.style.backgroundSize = 'contain';
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
        reviewCard.appendChild(makeElement('footer', ['card-footer', 'text-right', 'font-italic'], new Date(review.createdAt).toLocaleString()));
        // card마다 상세보기 페이지와 연결
        reviewCard.style.cursor = "pointer";
        reviewCard.onclick = function() {
            location.href = `/review/${review._id}`
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
    reviewList.classList.add("fade-in");
}

drawReviewList(getReviewPromise());