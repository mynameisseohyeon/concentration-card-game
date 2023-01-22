const $wrapper = document.querySelector('#wrapper');

const total = 12;
const colors = ['red', 'orange', 'yellow', 'green', 'white', 'pink'];
let colorCopy = colors.concat(colors); //colors를 2쌍으로 만들어줌 / concat은 원본을 수정하지 않고 새로운 배열을 만들어줌
let shuffled = []; //배열
let clicked = []; //클릭변수
let completed = []; //완료변수
let clickable = false; //효과 발생(카드 회전 시) 중 클릭되는 경우 막기

function shuffle() { //랜덤으로 카드섞기
    for (let i = 0; colorCopy.length > 0; i += 1) {
        const randomIndex = Math.floor(Math.random() * colorCopy.length);
        shuffled = shuffled.concat(colorCopy.splice(randomIndex, 1)); //splice 빼주는 함수
    }
};

function createCard(i) { //카드 생성
    const card = document.createElement('div');
    card.className = 'card'; //.card태그 생성
    const cardInner = document.createElement('div'); 
    cardInner.className = 'card-inner'; //.caed-inner태그 생성
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front'; //.card-front태그 생성
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back'; //.card-back태그 생성
    cardBack.style.backgroundColor = shuffled[i]; //shuffled로 부터 카드 색상을 가져옴
    cardInner.appendChild(cardFront); //.card-front태그가 .card-inner태그의 자식태그로 지정됨
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner); // div.card > div.card-inner > (div.card-fornt + div.card-back)
    return card;
};

function onClickCard() { //클릭된 카드 검사
    if (!clickable || completed.includes(this) || clicked[0]) { //처음에 뒤집히는 효과 나오는 동안 카드클릭, 이미 완성된 카드, 방금 클릭한 카드 한번 더 클릭되지 못하도록 설정
        return; //함수를 중간에 멈춤
    }
    this.classList.toggle('flipped');
    clicked.push(this);
    if(clicked.length !== 2) { //클릭된 카드가 2개가 아닐 시
        return; //클릭한 카드가 2장이 아닐 시 함수 종료
    };
    const firstBackColor = clicked[0].querySelector('.card-back').style.backgroundColor; //찻번쨰로 클릭된 카드
    const sceondCackColor = clicked[1].querySelector('.card-back').style.backgroundColor;
    if(firstBackColor === sceondCackColor) { //클릭된 두 카드의 앞면이 일치할 결루
        completed.push(clicked[0]); //클릭변수에서 완료변수로 옮긴다
        completed.push(clicked[1]);
        clicked = []; //클릭된 배열 초기화
        if(completed.length !== total) { //완료된 카드가 tatal 즉, 12장이 아닌 경우
            return;
        }
        setTimeout(() => {
            alert('축하합니다!');
            resetGame();
        }, 1000);
        return; 
    };
    setTimeout(() => { //클릭된 두 카드가 일치하지 않을 경우
    clicked[0].classList.remove('flipped'); //flipped클래스를 제거하야 카드를 뒷면으로 뒤집는다
    clicked[1].classList.remove('flipped');
    clicked = []; //클릭된 배열 초기화
    }, 500);
}

function startGame() { //게임시작
    clickable = false;
    shuffle(); //카드섞기
    for (let i = 0; i < total; i += 1) {
        const card = createCard(i);
        card.addEventListener('click', onClickCard);
        $wrapper.appendChild(card);
    };

    document.querySelectorAll('.card').forEach((card, index) => { //초반 카드 공개
        setTimeout(() => {
            card.classList.add('flipped'); //flipped클래스는 카드를 뒤집는다
        }, 1000 + 100 * index); //+ 100 * index를 적어줌으로써 0.1초씩 다르게 뒤집히는 시각적 효과를 추가
    });
    
    setTimeout(() => { //카드 감추기
        document.querySelectorAll('.card').forEach((card) => {
            card.classList.remove('flipped');
        });
        clickable = true;
    }, 5000);
}

function resetGame() { //게임 초기화
    $wrapper.innerHTML = '';
    colorCopy = colors.concat(colors); //colors와 같은 원본을 안 바꾸는 함수가 재사용이 쉽다
    shuffled = [];
    completed = [];
    clickable = false;
    startGame();
};

startGame();
