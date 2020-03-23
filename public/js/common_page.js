// 요소를 생성해주는 함수
const makeElement = (tagName, classList=[], inner="") => {
    const element = document.createElement(tagName);
    // console.log(classList);
    for (const v of classList) {
        element.classList.add(v)        
    }
    element.innerHTML = inner;
    return element
} 

// 별을 그려주는 함수
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