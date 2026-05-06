const allFruits = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉', '🍑', '🍊', '🍋', '🍐', '🫐', '🥭', '🥥', '🥑', '🥦', '🌽', '🥕', '🍆'];
let level = 1;
let flippedCards = [];
let matchedCards = [];
let isPreviewing = false;

const grid = document.getElementById('grid');
const statusText = document.getElementById('status');
const levelText = document.getElementById('level-display');
const nextBtn = document.getElementById('next-btn');

function initGame() {
    isPreviewing = true;
    flippedCards = [];
    matchedCards = [];
    nextBtn.style.display = 'none';
    grid.innerHTML = '';
    
    levelText.innerText = `Bosqich: ${level}`;
    statusText.innerText = "Eslab qoling: 5 soniya!";

    // Har bir bosqichda murakkablikni oshirish
    // Har 1 bosqichda 1 juft qo'shiladi (2 ta karta)
    let pairsCount = 2 + (level - 1); 
    let selectedFruits = [];
    
    for (let i = 0; i < pairsCount; i++) {
        let fruit = allFruits[i % allFruits.length];
        selectedFruits.push(fruit, fruit);
    }

    const shuffledFruits = selectedFruits.sort(() => Math.random() - 0.5);

    // Ustunlar sonini avtomatik hisoblash
    let cols = Math.ceil(Math.sqrt(shuffledFruits.length));
    grid.style.gridTemplateColumns = `repeat(${cols}, 70px)`;

    // Kartalarni yaratish
    shuffledFruits.forEach((fruit) => {
        const card = document.createElement('div');
        card.classList.add('card', 'flipped'); // Boshida ochiq
        card.innerText = fruit;
        card.dataset.name = fruit;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });

    // 5 soniyadan keyin barcha kartalarni yopish
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.classList.remove('flipped'));
        statusText.innerText = "Endi juftini toping!";
        isPreviewing = false;
    }, 5000);
}

function flipCard(card) {
    if (isPreviewing || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.name === card2.dataset.name) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        flippedCards = [];

        if (matchedCards.length === document.querySelectorAll('.card').length) {
            statusText.innerText = "G'alaba!";
            if (level < 150) {
                nextBtn.style.display = 'block';
            } else {
                alert("Siz afsonasiz! Barcha 150 bosqichni yutdingiz!");
            }
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 600);
    }
}

function nextLevel() {
    level++;
    initGame();
}

// O'yinni birinchi marta ishga tushirish
initGame();
