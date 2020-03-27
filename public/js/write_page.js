// 키워드 검색을 할 수 있는 프로미스를 생성해주는 함수
const kwdSearch = (searchText, curr) => {
    // Places 객체 (카카오지도 API를 통한 장소 검색)
    const places = new kakao.maps.services.Places();
    // 프로미스로 구현 (cf. 콜백)
    return new Promise((resolve, reject) => {
        // callback 함수를 promise로 랩핑
        places.keywordSearch(searchText, (result, status, pagination) => {
            status === kakao.maps.services.Status.OK
                ? resolve([result, pagination]) : reject(status);
        },
            // option : FD6은 식당, 한 페이지의 5항목씩, page는 이후에 검색을 위해
            { category_group_code: 'FD6', size: 5, page: curr ? curr : 1 });
    })
}

// 키워드 검색을 해주는 메소드 
const searchStore = (curr) => {
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
            v[0].onclick = () => searchStore(v[1]);
        }
    }
    // [async/await 버전]
    const drawOpt = (result) => {
        // 우선 결정 버튼은 막아둡니다
        decisionBtn.disabled = true;
        // 검색된 가게 목록을 받아줄 select 태그 내부를 비워주고
        storeList.innerHTML = "";
        // for문으로 5번 돌려줘서 option을 구성, option의 value는 이후 클로저를 통해 구현한 결정 button 안에 전달될 index
        for (let i = 0; i < result.length; i++) {
            const v = result[i];
            const opt = makeElement('option', [], `${v.place_name} (${v.road_address_name ? v.road_address_name : v.address_name})`);
            opt.title = v.category_name;
            opt.value = i;
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
    // 버튼 그리기
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
    // 폼을 그리는 함수
    // async, await로 구현했을 경우
    const drawForm = async () => {
        const resultItems = await kwdSearch(searchKwd, curr);
        drawOpt(resultItems[0]);
        drawBtn(resultItems[1]);
    }
    drawForm();
}

// 가게 이름과 주소가 value를 가지고 있는지 검증
const validate = () => {
    if(document.querySelector('#inputStoreName').value && document.querySelector('#inputStoreAddress').value) {
        return true;
    } else {
        alert('가게 이름과 가게 주소를 입력해주세요!')
        return false;
    }
}

// textarea 글짜 세기용
const wordCount = (textArea='#inputStoreReview', counter='#wordCounter') => {
    document.querySelector(counter).innerHTML = document.querySelector(textArea).value.length;
}

wordCount();