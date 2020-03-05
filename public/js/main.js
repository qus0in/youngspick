// 테스트용 데이터 주입
if (!localStorage.length) {
    console.log('no data!');
    (function () {
        const testData = [
            ['2020-03-04_22:24:17.833',
                '부탄츄 신촌점;서울 서대문구 연세로5길 26-9;가끔씩 추우면 라멘이 생각날 때가 있다. 그럴 때 가면 좋다. <br>하지만 한국 패치가 덜 된 느낌으로 맹맹하다던가 그런 느낌도 있다.<br>데이트 코스로는 약간 애매한 편, 그냥 친구랑 가자.;3.5;https://cdn.pixabay.com/photo/2019/12/01/15/08/if-the-4665686_960_720.jpg;2020-03-04_22:24:17.833'],
            ['2020-03-04_22:25:42.697', '미분당;서울 서대문구 연세로5다길 35;한국 패치가 완벽히 된 쌀국수 맛집.<br>문제는 안에서 떠들 수가 없다는 것이다.<br>그것은 밥심과 입심이 일치하는 나에겐 재앙과 같다!;3.5;https://cdn.pixabay.com/photo/2016/01/15/01/46/vietnam-1141082_960_720.jpg;2020-03-04_22:25:42.697'],
            ['2020-03-04_23:02:42.334', '방콕익스프레스 신촌본점;서울 서대문구 연세로2길 91;아직 안 갔다면 그 혀를 사고 싶다.<br>기다리는 순간 순간이 즐거운 곳.<br>꼭 푸팟퐁커리를 먹어보기를 바란다.<br>하지만 직원들이 좀 불친절해서 0.5점 깎았다.;4.5;https://cdn.pixabay.com/photo/2014/09/27/16/43/noodle-463896_960_720.jpg;2020-03-04_23:02:42.334'],
            ['2020-03-04_23:41:58.467', '옐로우스푼 신촌점;서울 서대문구 명물길 4;누구 함박스테이크 싫어하는 사람 있어요?<br>아 혹시 있을 수 있죠, 근데 카레도 싫어해요?<br>이래서 여기가 좋습니다.;4;;2020-03-04_23:41:58.467'],
            ['2020-03-04_23:26:14.300', '미스터서왕만두;서울 서대문구 신촌역로 16;굳이 멀리 중국까지 딤섬을 먹으러 갈 필요가 없다는 것을 훌륭히 증명해준다.<br>만두 하나를 먹을 때 퍼져나오는 육즙들! 작지만 확실한 행복.;5;https://cdn.pixabay.com/photo/2015/09/05/20/00/dim-sum-924912_960_720.jpg;2020-03-04_23:26:14.300'],
            ['2020-03-04_22:22:38.753', '기꾸스시;서울 서대문구 연세로5다길 35;저렴하다! 양많다! 정말로 좋은 곳이다!<br>데이트로 가면 더욱 좋다. 근처에 분점이 두 개인데, 하나는 선술집 느낌이고 하나는 그나마 좀 더 세련된 느낌인데 하나 고르라면 나는 따닥따닥 붙어 앉은 곳.;5;https://cdn.pixabay.com/photo/2014/05/26/14/53/sushi-354628_960_720.jpg;2020-03-04_22:22:38.753']
        ]
        for (let v of testData) localStorage.setItem(v[0], v[1]);
    }
    )()
};

// 전역변수 map, marker (지도 API의 효과적 제어를 위해)
let map;
let marker;

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
        // console.log(keys);
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
        // console.log(el);
        if (el) {
            // 첫번째 div (실제 움직이는 별)
            const div1 = this.buildEl('div');
            for (let i = 0; i < 5; i++) {
                div1.appendChild(this.buildEl('i', ['fa']))
            }
            // 두번째 div (프레임 역할을 하는 별)
            const div2 = this.buildEl('div');
            for (let i = 0; i < 5; i++) {
                div2.appendChild(this.buildEl('i', ['fa', 'fa-star-o']))
            }
            el.appendChild(div1);
            el.appendChild(div2);
        } else {
            el = common.getEl('inputStoreStar');
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
        // drawStore
        const drawStore = async (key) => {
            // cList를 클래스로 가지는 div 생성 
            const storeEl = this.buildEl('div', cList);
            // store 객체 생성 <- storeVal을 바탕으로
            const storeVal = String(localStorage.getItem(key)).split(';');
            const storeObj = {
                name: storeVal[0],
                address: storeVal[1],
                review: storeVal[2],
                rate: storeVal[3],
                image: storeVal[4],
                timeStamp: storeVal[5]
            };
            // store 객체 바탕으로 card 생성
            const storeCard = this.buildEl('div', ['card', 'w-100', 'm-3', 'overflow-auto']);
            // card-header
            storeCard.appendChild(this.buildEl('header', ['card-header'],
                `<h5 class="font-weight-bold text-truncate">${storeObj.name}</h6><p class="mb-n1 text-muted text-truncate"><small>${storeObj.address}</small></p>`))
            // 가게 이미지
            const storeImage = this.buildEl('div', ['card-img', 'border', 'rounded-0']);
            const src = storeObj.image;
            const imgur = 'https://imgur.com/';
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
            const storeCardBody = this.buildEl('section', ['card-body']);
            // 별점 데이터
            const storeStar = this.buildEl('div', ['storeStar', 'mb-2']);
            this.drawStar(storeObj.rate, storeStar);
            storeCardBody.appendChild(storeStar);
            // 리뷰 글 (일정 이상 넘어가면 ... 표시)
            // console.log(storeObj.review);
            storeCardBody.appendChild(this.buildEl('div', ['small', 'card-text', 'text-truncate'], storeObj.review.replace(/<br>/g, ' ')));
            storeCard.appendChild(storeCardBody);
            // card-footer
            storeCard.appendChild(this.buildEl('footer', ['card-footer', 'text-right', 'font-italic'], storeObj.timeStamp.substring(0, 19).replace('_', ' ')));

            // card마다 상세보기 페이지와 연결
            // (클로저와 프로미스 활용)
            // Place를 통해 상세 정보 받아온 후 onclick 시 modal에 입력할 정보 대입
            storeCard.style.cursor = "pointer";
            const drawMap = (lat, lng) => {
                const mapPosition = new kakao.maps.LatLng(lat, lng);
                const options = { //지도를 생성할 때 필요한 기본 옵션
                    center: mapPosition, //지도의 중심좌표.
                    level: 3 //지도의 레벨(확대, 축소 정도)
                };
                map = new kakao.maps.Map(common.getEl('expandStoreMap', 'r'), options);
                $('#expandStoreModal').modal('show');
                // 마커
                marker = new kakao.maps.Marker({
                    position: mapPosition
                });
                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
            };
            // 비동기 문제를 해결하는 방법 (async, await)
            // https://joshua1988.github.io/web-development/javascript/js-async-await/
            async function makeExpandBtn() {
                // promise로 리턴된 객체를 await를 통해 순차적으로 받을 수 있다 (axios에도 잘 활용해볼 것!)
                // 학습 순서 : ajax 통신 & callback => promise => async/await
                const result = await storeInfo.loadStore(storeObj.address, storeObj.name);
                // console.log(result);
                storeCard.onclick = function () {
                    // 가게 이름
                    common.getEl('expandStoreName').innerHTML = storeObj.name;
                    // 가게 주소
                    common.getEl('expandStoreAdress').innerHTML = storeObj.address;
                    // 가게 카테고리
                    common.getEl('expandStoreCategory').innerHTML = `(${result.category_name})`;
                    // 가게 이미지
                    common.getEl('expandStoreImg').src = storeObj.image == '' ? 'img/meal.png' : storeObj.image;
                    // 가게 별점
                    storeView.drawStar(storeObj.rate, common.getEl('expandStoreStar'));
                    // 가게 리뷰
                    common.getEl('expandStoreReview').innerHTML = storeObj.review;
                    // 가게 리뷰 작성일
                    common.getEl('expandStoreTimeStamp').innerHTML = `작성일 : ${storeObj.timeStamp.substring(0, 19).replace('_', ' ')}`;
                    // 가게 지도
                    drawMap(result.y, result.x); // x가 경도(lng), y가 위도(lat)라서 뒤집어 넣어줌
                    // 큰 지도 버튼
                    common.getEl('watchLarge').onclick = () => window.open(`https://map.kakao.com/link/map/${result.id}`);
                    // 상세 페이지 버튼
                    common.getEl('watchDetail').onclick = () => window.open(result.place_url);
                    // 길찾기 버튼
                    common.getEl('findWay').onclick = () => window.open(`https://map.kakao.com/link/to/${result.id}`);
                }
            }
            makeExpandBtn();
            storeEl.appendChild(storeCard);
            storeAll.appendChild(storeEl);
        }
        for (let v of this.getAllKeys()) drawStore(v);
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
        allVal = (...ids) => ids.reduce((acc, cur) => `${acc};${String(common.getEl(cur, 'v')).replace(';', '').replace(/\n/g, '<br>')}`, '');
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
// Store 정보 검색 관련 객체
const storeInfo = {
    // 키워드 검색을 할 수 있는 프로미스를 생성해주는 메소드
    kwdSearch: function (searchText, curr) {
        // Places 객체 (카카오지도 API를 통한 장소 검색)
        const places = new kakao.maps.services.Places();
        // 프로미스로 구현 (cf. 콜백)
        // https://ko.javascript.info/promise-basics
        // https://devtalk.kakao.com/t/geocoder-coord2address/83940/2
        return new Promise((resolve, reject) => {
            // callback 함수를 promise로 랩핑
            places.keywordSearch(searchText, (result, status, pagination) => {
                status === kakao.maps.services.Status.OK
                    ? resolve([result, pagination]) : reject(status);
            },
                // option : FD6은 식당, 한 페이지의 5항목씩, page는 이후에 검색을 위해
                { category_group_code: 'FD6', size: 5, page: curr ? curr : 1 });
        })
    },
    // 키워드 검색을 해주는 메소드 
    searchStore: function (curr) {
        // DOM (inputs)  
        const storeList = document.querySelector('#inputStoreSelect');
        const storeName = document.querySelector('#inputStoreName');
        const storeAddress = document.querySelector('#inputStoreAddress');
        // DOM (buttons)
        const firstPageBtn = document.querySelector('#firstPage');
        const lastPageBtn = document.querySelector('#lastPage');
        const prevPageBtn = document.querySelector('#prevPage');
        const nextPageBtn = document.querySelector('#nextPage');
        const decisionBtn = document.querySelector('#decision');
        // 특정 조건 시 특정 버튼의 사용을 막거나 푸는 함수
        const setDisabled = (...args) => {
            for (let v of args) {
                v[0].disabled = v[1] ? false : true;
            }
        }
        // 클릭 이벤트 시 실행될 리스너 콜백함수들을 일괄적으로 지정할 수 있도록 하는 함수
        const setOnclick = (...args) => {
            for (let v of args) {
                v[0].onclick = () => StoreInfo.searchStore(v[1]);
            }
        }
        // select 안에 들어갈 option을 넣어주는 함수
        // [프로미스 버전]
        // const drawOpt = (result) => {
        //     // 우선 결정 버튼은 막아둡니다
        //     decisionBtn.disabled = true;
        //     // 검색된 가게 목록을 받아줄 select 태그 내부를 비워주고
        //     storeList.innerHTML = "";
        //     // for문으로 5번 돌려줘서 option을 구성, option의 value는 이후 클로저를 통해 구현한 결정 button 안에 전달될 index
        //     for (let i = 0; i < result[0].length; i++) {
        //         const v = result[0][i];
        //         const opt = document.createElement('option');
        //         opt.title = v.category_name;
        //         opt.value = i;
        //         opt.innerHTML = `${v.place_name} (${v.road_address_name ? v.road_address_name : v.address_name})`;
        //         storeList.appendChild(opt);
        //     };
        //     // 클로저 활용하여 결정 버튼 안에 함수 삽입
        //     // storeList(<select>)의 값을 받아 index로 사용
        //     // 장소명, 주소(도로명 주소 or 지번 주소)를 input에 전달 
        //     decisionBtn.onclick = function () {
        //         const data = result[0][storeList.value];
        //         // console.log(data);
        //         storeName.value = data.place_name;
        //         storeAddress.value = data.road_address_name
        //             ? data.road_address_name : data.address_name;
        //     }
        //     return result[1];
        // }
        // [async/await 버전]
        const drawOpt = (result) => {
            // 우선 결정 버튼은 막아둡니다
            decisionBtn.disabled = true;
            // 검색된 가게 목록을 받아줄 select 태그 내부를 비워주고
            storeList.innerHTML = "";
            // for문으로 5번 돌려줘서 option을 구성, option의 value는 이후 클로저를 통해 구현한 결정 button 안에 전달될 index
            for (let i = 0; i < result.length; i++) {
                const v = result[i];
                const opt = document.createElement('option');
                opt.title = v.category_name;
                opt.value = i;
                opt.innerHTML = `${v.place_name} (${v.road_address_name ? v.road_address_name : v.address_name})`;
                storeList.appendChild(opt);
            };
            // 클로저 활용하여 결정 버튼 안에 함수 삽입
            // storeList(<select>)의 값을 받아 index로 사용
            // 장소명, 주소(도로명 주소 or 지번 주소)를 input에 전달 
            decisionBtn.onclick = function () {
                const data = result[storeList.value];
                // console.log(data);
                storeName.value = data.place_name;
                storeAddress.value = data.road_address_name
                    ? data.road_address_name : data.address_name;
            }
        }
        const drawBtn = (pagination) => {
            setDisabled(
                // 연관 버튼, 조건식 => 조건을 만족하면 inline, 아니면 none
                [firstPageBtn, pagination.current >= 3],
                [lastPageBtn, pagination.last - pagination.current >= 2],
                [prevPageBtn, pagination.hasPrevPage],
                [nextPageBtn, pagination.hasNextPage]
            );
            setOnclick(
                // 연관 버튼, 목표하는 페이지 => 해당 버튼으로 이동
                [firstPageBtn, pagination.first],
                [lastPageBtn, pagination.last],
                [prevPageBtn, pagination.current - 1],
                [nextPageBtn, pagination.current + 1]
            );
            decisionBtn.disabled = false;
        }
        const searchKwd = document.querySelector('#inputStoreKwd').value;
        
        // promise의 작동 순서
        // 이미 설정한 kwdSearch(검색하려는 키워드 input) 메소드로 promise return
        // place 객체를 통해 키워드 검색 정보 요청
        // 콜백 1 : 키워드 검색 결과와 페이징 정보를 받아오고, 키워드 검색 결과를 바탕으로 <select> 내부 및 결정 버튼 구성 
        // 콜백 2 : 페이징
        // 프로미스로 구현했을 경우
        // this.kwdSearch(searchKwd, curr)
        //     .then(drawOpt)
        //     .then(drawBtn)
        //     .catch(console.error);

        // async, await로 구현했을 경우
        async function drawForm(){
            const resultItems = await storeInfo.kwdSearch(searchKwd, curr);
            drawOpt(resultItems[0]);
            drawBtn(resultItems[1]);
        }
        drawForm();
    },
    // 주소와 가게 이름을 통해 가게 관련 정보 불러오기 (프로미스)
    loadStore: function (address, name, page) {
        if (!page) page = 1;
        // 이름으로 find해서 값 찾기
        const findByName = (result) => {
            // result[0] : 검색 결과, result[1] : 페이징 정보
            // 검색 결과 페이지보다 넘어갈 시 error throw (재귀해결)
            if (result[1].last < page) throw new Error('페이지 범위 초과')
            // 찾은 결과 중에 찾으려는 가게 이름과 장소 이름이 일치하는 지를 판정
            const target = result[0].find(element => element.place_name == name);
            // 값이 나옴 => return, 값이 안 나옴(undefined -> false로 취급) => page 정보를 바꿔서 재귀적으로 다음 서치
            return target ? target : this.loadStore(address, name, ++page);
        }
        return this.kwdSearch(address, page) // address로 서치
            .then(findByName) // 이름으로 찾기
            .catch(console.error);
    }
}

// 로딩이 완료되면 store 목록 그려주게 함
window.onload = storeView.draw();
// 반응형 웹에는 지도 api가 잘 대응하지 못하는 문제로 인해, 커서가 특정 modal 위에 존재할 경우 계속 re-layout & 마커 중심으로 정렬하게
document.getElementById('expandStoreModal').addEventListener('mouseover', function () {
    map.relayout();
    map.panTo(marker.getPosition());
}, true);