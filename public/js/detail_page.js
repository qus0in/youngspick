// 주소와 가게 이름을 통해 가게 관련 정보 불러오기 (프로미스)
const loadStore = (address, name, page) => {
    if (!page) page = 1;
    // 이름으로 find해서 값 찾기
    const findByName = (result) => {
        // result[0] : 검색 결과, result[1] : 페이징 정보
        // 검색 결과 페이지보다 넘어갈 시 error throw (재귀해결)
        if (result[1].last < page) throw new Error('페이지 범위 초과')
        // 찾은 결과 중에 찾으려는 가게 이름과 장소 이름이 일치하는 지를 판정
        const target = result[0].find(element => element.place_name == name);
        // 값이 나옴 => return, 값이 안 나옴(undefined -> false로 취급) => page 정보를 바꿔서 재귀적으로 다음 서치
        return target ? target : loadStore(address, name, ++page);
    }
    return kwdSearch(address, page) // address로 서치
        .then(findByName) // 이름으로 찾기
        .catch(console.error);
}
// 지도 그리기
const drawMap = (lat, lng) => {
    const mapPosition = new kakao.maps.LatLng(lat, lng);
    const options = { //지도를 생성할 때 필요한 기본 옵션
        center: mapPosition, //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    map = new kakao.maps.Map(document.querySelector("#storeMap"), options);
    // 마커
    marker = new kakao.maps.Marker({
        position: mapPosition
    });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
};
// 세부 정보 구성하기
const fillDetail = async (name, address) => {
    const result = await loadStore(address, name);
    // 가게 카테고리
    document.querySelector('#storeCategory').innerHTML = result.category_name;
    // 가게 지도
    drawMap(result.y, result.x); // x가 경도(lng), y가 위도(lat)라서 뒤집어 넣어줌
    // 큰 지도 버튼
    document.querySelector('#watchLarge').onclick = () => window.open(`https://map.kakao.com/link/map/${result.id}`);
    // 상세 페이지 버튼
    document.querySelector('#watchDetail').onclick = () => window.open(result.place_url);
    // 길찾기 버튼
    document.querySelector('#findWay').onclick = () => window.open(`https://map.kakao.com/link/to/${result.id}`);
}
fillDetail(document.querySelector('#storeName').innerHTML, document.querySelector('#storeAddress').innerHTML)