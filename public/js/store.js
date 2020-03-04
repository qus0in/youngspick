// 공통 메소드
const common = {
    // 특정 form 요소의 값 가져오기 메소드
    // option에 reset을 주면 비워서, val을 주면 value를 리턴
    getEl: function (id, option) {
        const element = document.getElementById(id);
        if (option == "r") {
            element.innerHTML = "";
            return element;
        } else {
            return option == "v"
                ? element.value : element;
        }
    },
}
// localStorage에 저장된 가게 정보 표현
const storeView = {
    // 특정 태그에 classList(Array)와 innerHTML이 적용된 자식 요소를 리턴
    buildEl: function (tag, classList, inner) {
        const el = document.createElement(tag);
        classList ? classList.forEach(v => el.classList.add(v)) : false;
        inner ? el.innerHTML = inner : false;
        return el;
    },
    // localStorage에 존재하는 모든 keys (기본: 최신순) 
    getAllKeys: function (asc) {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
        return asc ? keys.sort() : keys.sort().reverse();
    },
    // 삭제하기 안 option 구현
    drawDeleteOption: function () {
        // select의 DOM 조회 & reset
        const sList = common.getEl('storeNameList', 'r');
        for (let v of this.getAllKeys()) {
            const opt = this.buildEl('option', '', localStorage.getItem(v).split(';')[0]);
            opt.value = v;
            sList.appendChild(opt);
        }
    },
    // rate 값에 반응해서 이미 구현된 frame에 맞춰 별을 그려주는 메소드
    drawStar: function (rate, el) {
        // 특정 요소에 star frame & background을 추가하고, rate에 맞춰 별 그림을 그려준다
        // 기본 설정은 form 안에 있는 #inputStoreStar
        if (el) {
            const bEl = this.buildEl;
            // 첫번째 div (실제 움직이는 별)
            const div1 = bEl('div');
            for (let i = 0; i < 5; i++) {
                div1.appendChild(bEl('i', ['fa']))
            }
            // 두번째 div (프레임 역할을 하는 별)
            const div2 = bEl('div');
            for (let i = 0; i < 5; i++) {
                div2.appendChild(bEl('i', ['fa', 'fa-star-o']))
            }
            el.appendChild(div1);
            el.appendChild(div2);
        } else {
            el = common.getEl('inputStoreStar');
        }
        // 지정한 클래스 안에 있는 첫번째 div(background) 요소 속 아이콘들을 지정
        const stars = el
            .getElementsByTagName('div')[0]
            .getElementsByTagName('i');
        // 일괄적으로 꽉찬 별, 반쪽 별 모두 class를 지워준다
        for (const v of stars) {
            v.classList.remove("fa-star");
            v.classList.remove("fa-star-half-full");
        }
        // while문을 통해서 그려줍니다
        // index 초기화
        let i = 0;
        // 별점이 있다면 진행해줍니다. 0이라면 아예 진행되지 않게
        while (rate > 0) {
            // console.log(`i, ${i}, rate, ${rate}`);
            // 별점이 1보다 크다면
            if (rate >= 1) {
                // 별점을 1 깎고
                rate--;
                // 해당하는 index의 stars를 조회하여 class를 추가해줍니다 (꽉찬 별)
                stars[i].classList.add("fa-star");
            } else {
                // rate가 0.5 남아있게 된다면
                if (rate == 0.5) {
                    // 절반 별 class를 추가해줍니다
                    stars[i].classList.add("fa-star-half-full");
                }
                break;
            }
            i++; // index 증가
        }
        // console.log('finish');
    },
    // 저장된 가게 리스트 그리기
    drawStoreList: function () {
        // 부모가 되는 .row#showStories 조회 및 초기화
        const storeAll = common.getEl('showStores', 'r');
        // 각기 store에 추가해줄 classList array 생성
        const cList = ['col-md-6', 'col-lg-4', 'd-flex', 'rounded']
        // localStorage를 최신순으로 탐색하면서 내용 추가
        const bEl = this.buildEl;
        for (let v of this.getAllKeys()) {
            // cList를 클래스로 가지는 div 생성 
            const storeEl = bEl('div', cList);
            // store 객체 생성 <- storeVal을 바탕으로
            const storeVal = String(localStorage.getItem(v)).split(';');
            const storeObj = {
                name: storeVal[0],
                address: storeVal[1],
                review: storeVal[2],
                rate: storeVal[3],
                image: storeVal[4],
                timeStamp: storeVal[5]
            }
            // store 객체 바탕으로 card 생성
            const storeCard = bEl('div', ['card', 'w-100', 'm-3', 'overflow-auto']);
            // card-header
            storeCard.appendChild(bEl('header', ['card-header'],
                `<h5 class="font-weight-bold text-truncate">${storeObj.name}</h6>
            <p class="mb-n1 text-muted text-truncate"><small>${storeObj.address}</small></p>`))
            // 가게 이미지
            const storeImage = bEl('div', ['card-img', 'border', 'rounded-0']), src = storeObj.image, imgur = 'https://imgur.com/';
            storeImage.style.height = "12rem";
            if (src == '') {
                storeImage.style.backgroundImage = 'url(img/meal.png)';
                storeImage.style.backgroundSize = 'contain';
            } else {
                storeImage.style.backgroundImage = `url(${src.includes(imgur) ? src.replace(imgur, 'https://i.imgur.com/').concat('.png') : src}), url(${src.includes(imgur) ? src.replace(imgur, 'https://i.imgur.com/').concat('.jpg') : src})`;
                storeImage.style.backgroundSize = 'cover';
            }
            storeImage.style.backgroundRepeat = 'no-repeat';
            storeImage.style.backgroundPosition = 'center center';
            storeCard.appendChild(storeImage);
            // card-body
            const storeCardBody = bEl('section', ['card-body']);
            // 별점 데이터
            const storeStar = bEl('div', ['storeStar', 'mb-2']);
            this.drawStar(storeObj.rate, storeStar);
            storeCardBody.appendChild(storeStar);
            // 리뷰 글 (일정 이상 넘어가면 ... 표시)
            storeCardBody.appendChild(bEl('div', ['small', 'card-text', 'text-truncate'], storeObj.review));
            storeCard.appendChild(storeCardBody);
            // card-footer
            storeCard.appendChild(bEl('footer', ['card-footer', 'text-right', 'font-italic'], storeObj.timeStamp.substring(0,19).replace('_', ' ')));
            // card를 col에, col을 row에
            storeEl.appendChild(storeCard);
            storeAll.appendChild(storeEl);
        }
    },
    // 일괄적으로 갱신 시 그려주는 메소드
    draw: function () {
        // console.log('draw stores!');
        this.drawDeleteOption();
        this.drawStoreList();
    },
    // form 요소 리셋
    resetForm: function () {
        common.getEl('searchStoreForm').reset();
        common.getEl('addStoreForm').reset();
        common.getEl('inputStoreSelect').innerHTML = '<option>가게명으로 검색</option>';
        storeView.drawStar(0);
    },
}
// Store 추가와 삭제 관련 내용을 객체로 묶어서 관리
const storeData = {
    // 작성 시간 String 제공하는 메소드
    timeStamp: function () {
        // String Template(`${}`) & arrow function
        // digit : 날짜 및 시간 관련 속성을 2자리로 통일
        const digit = (input) => `00${input}`.slice(-2);
        // Date 객체를 통해 생성 시 시간 획득
        const now = new Date();
        // 20xx-00-00_00:00:00.00 형태로 timeStamp 반환
        return `${now.getFullYear()}-${digit(now.getMonth() + 1)}-${digit(now.getDate())}_${digit(now.getHours())}:${digit(now.getMinutes())}:${digit(now.getSeconds())}.${now.getMilliseconds()}`;
    },
    // localStorage에 가게 정보 저장
    addStore: function () {
        // DOM을 통한 id -> value 받는 함수
        // ...ids로 여러 개의 input 요소의 아이디를 받고, 해당 input들의 값을 reduce를 통해 합쳐서 표현
        // reduce((acc, cur) => return, 초기값)
        allVal = (...ids) => ids.reduce((acc, cur) => `${acc};${String(common.getEl(cur, 'v')).replace(';', '')}`, '');
        // setItem(k,v)으로 저장, getItem(k)로 불러오기
        const ts = this.timeStamp();
        const v = `${allVal('inputStoreName', 'inputStoreAddress', 'inputStoreReview', 'inputStoreRate', 'inputStoreImage')};${ts}`.slice(1);
        // console.log(v);
        localStorage.setItem(
            ts, // 작성 시간을 key로 (이후 실제 db에선 임의 생성되는 mongoDB index로 대체)
            v); // 가게 이름, 가게 주소, 가게 리뷰, 작성 시간을 value로
        $('#addStoreModal').modal('hide'); // modal 감추기
        storeView.draw(); // 다시 그려 줌
    },
    // localStorage에 저장된 가게 정보 삭제
    removeStore: function () {
        localStorage.removeItem(common.getEl("storeNameList", "v"));
        storeView.draw(); // 다시 그려 줌
    }
}
// 로딩이 완료되면 store 목록 그려주게 함
window.onload = storeView.draw();