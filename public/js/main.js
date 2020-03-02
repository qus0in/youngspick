// localStorage에 저장된 가게 정보 표현
const drawStore = () => {
    // 특정 태그에 classList(Array)와 innerHTML이 적용된 자식 요소를 리턴
    const el = (tag, classList, inner) => {
        const el = document.createElement(tag);
        classList.forEach(v => el.classList.add(v));
        inner ? el.innerHTML = inner : false;
        return el;
    };

    // localStorage에 존재하는 모든 keys (최신순)
    const storageKeys = () => {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
        return keys.sort().reverse();
    }

    // 삭제하기 안 option 구현
    // select의 DOM
    const sList = document.getElementById('storeNameList');
    sList.innerHTML = "";
    for (let v of storageKeys()) {
        const opt = el('option', [], localStorage.getItem(v).split(";")[0])
        opt.value = v;
        sList.appendChild(opt);
    }

    // 저장된 가게 리스트 그리기
    // .row#showStories 안에 col-md-6, col-lg-4 를 넣고
    // 이후에 이름, 주소, 리뷰, 작성 시간 등을 표현

    // 부모가 되는 .row#showStories
    const storeAll = document.getElementById('showStores');

    // showStories의 내용 초기화
    storeAll.innerHTML = "";

    // 각기 store에 추가해줄 classList array 생성
    const cList = ['col-md-6', 'col-lg-4', 'd-flex', 'rounded']

    // localStorage를 최신순으로 탐색하면서 내용 추가
    for (let v of storageKeys()) {
        // cList를 클래스로 가지는 div 생성 
        const storeEl = el('div', cList);

        // store 객체 생성 <- storeVal을 바탕으로
        const storeVal = String(localStorage.getItem(v)).split(';');
        const storeObj = {
            name: storeVal[0],
            address: storeVal[1],
            review: storeVal[2],
            timeStamp: storeVal[3]
        }

        // store 객체 바탕으로 card 생성
        const storeCard = el('div', ['card', 'w-100', 'm-3']);

        // card-header
        storeCard.appendChild(el('header', ['card-header'], `${storeObj.name} (${storeObj.address})`))

        // card-body
        const storeCardBody = el('section', ['card-body']);
        storeCardBody.appendChild(el('div', ['card-text'], storeObj.review));
        storeCard.appendChild(storeCardBody);

        // card-footer
        storeCard.appendChild(el('footer', ['card-footer', 'text-right'], storeObj.timeStamp));

        // card를 col에, col을 row에
        storeEl.appendChild(storeCard);
        storeAll.appendChild(storeEl);
    }
}

const StoreData = {
    // 작성 시간 String 제공하는 메소드
    timeStamp: function() {
        // String Template(`${}`) & arrow function
        // digit : 날짜 및 시간 관련 속성을 2자리로 통일
        const digit = (input) => `00${input}`.slice(-2);

        // Date 객체를 통해 생성 시 시간 획득
        const now = new Date();
        // 20xx-00-00_00:00:00.00 형태로 timeStamp 반환
        return `${now.getFullYear()}-${digit(now.getMonth() + 1)}-${digit(now.getDate())}_${digit(now.getHours())}:${digit(now.getMinutes())}:${digit(now.getSeconds())}.${now.getMilliseconds()}`;
    },
    // 특정 form 요소의 값 가져오기 메소드
    val: function(id) {return document.getElementById(id).value},
    // localStorage에 가게 정보 저장
    addStore: function() {
        // DOM을 통한 id -> value 받는 함수
        // ...ids로 여러 개의 input 요소의 아이디를 받고, 해당 input들의 값을 reduce를 통해 합쳐서 표현
        // reduce((acc, cur) => return, 초기값)
        allVal = (...ids) => ids.reduce((acc, cur) => `${acc};${this.val(cur)}`, "");
        // setItem(k,v)으로 저장, getItem(k)로 불러오기
        const ts = this.timeStamp();
        const v = `${allVal('inputStoreName', 'inputStoreAddress', 'inputStoreReview')};${ts}`.slice(1);
        // console.log(v);
        localStorage.setItem(
            ts, // 작성 시간을 key로 (이후 실제 db에선 임의 생성되는 mongoDB index로 대체)
            v); // 가게 이름, 가게 주소, 가게 리뷰, 작성 시간을 value로
        drawStore(); // 다시 그려 줌
    },
    // localStorage에 저장된 가게 정보 삭제
    removeStore: function() {
        localStorage.removeItem(this.val("storeNameList"));
        drawStore(); // 다시 그려 줌
    }
}

// storage에 값이 있으면 감지하여 store 목록 그려주게 함
window.addEventListener('storage', drawStore());