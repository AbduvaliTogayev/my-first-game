const allFruits = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉', '🍑', '🍊', '🍋', '🍐', '🫐', '🥭', '🥥', '🥑', '🥦', '🌽', '🥕', '🍆'];
let level = 1;
let score = 0;
let lives = 3;
let timerInterval;
let flippedCards = [];
let matchedCards = [];
let isLocked = true;

const grid = document.getElementById('grid');
const statusText = document.getElementById('status');
const levelText = document.getElementById('level-display');
const timerText = document.getElementById('timer-display');
const livesText = document.getElementById('lives-display');
const scoreText = document.getElementById('score');
const bonusInfo = document.getElementById('bonus-info');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');

function initGame() {
    clearInterval(timerInterval);
    isLocked = true;
    flippedCards = [];
    matchedCards = [];
    lives = 3;
    
    // Eslab qolish vaqti: 3s + (level-1)*2s
    let previewTime = 3 + (level - 1) * 2;
    // O'yin vaqti: 20s + (level-1)*4s
    let gameTime = 20 + (level - 1) * 4;
    let timeLeft = gameTime;

    updateUI(timeLeft);
    nextBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    grid.innerHTML = '';
    
    bonusInfo.innerText = `Bonus: Eslab qolish +${(level-1)*2}s, O'yin +${(level-1)*4}s`;

    let pairsCount = 2 + (level - 1); 
    let selectedFruits = [];
    for (let i = 0; i < pairsCount; i++) {
        let f = allFruits[i % allFruits.length];
        selectedFruits.push(f, f);
    }
    const shuffledFruits = selectedFruits.sort(() => Math.random() - 0.5);
    
    let cols = Math.ceil(Math.sqrt(shuffledFruits.length));
    grid.style.gridTemplateColumns = `repeat(${cols > 6 ? 6 : cols}, 60px)`;

    shuffledFruits.forEach((fruit) => {
        const card = document.createElement('div');
        card.classList.add('card', 'flipped');
        card.innerText = fruit;
        card.dataset.name = fruit;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });

    statusText.innerText = `Eslab qoling: ${previewTime}s`;
    
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('flipped'));
        statusText.innerText = "Juftlarni toping!";
        isLocked = false;
        startTimer(timeLeft);
    }, previewTime * 1000);
}

function startTimer(seconds) {
    let currentT = seconds;
    timerInterval = setInterval(() => {
        currentT--;
        timerText.innerText = currentT;
        if (currentT <= 0) endGame("Vaqt tugadi!");
    }, 1000);
}

function flipCard(card) {
    if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        isLocked = true;
        checkMatch();
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.name === c2.dataset.name) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedCards.push(c1, c2);
        score += 10 * level;
        flippedCards = [];
        isLocked = false;
        scoreText.innerText = score;

        if (matchedCards.length === document.querySelectorAll('.card').length) {
            clearInterval(timerInterval);
            statusText.innerText = "G'alaba!";
            if (level < 150) nextBtn.style.display = 'inline-block';
        }
    } else {
        lives--;
        updateUI();
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
            if (lives <= 0) endGame("Jonlaringiz tugadi!");
        }, 800);
    }
}

function updateUI(t) {
    levelText.innerText = level;
    if(t !== undefined) timerText.innerText = t;
    livesText.innerText = '❤️'.repeat(lives);
    scoreText.innerText = score;
}

function endGame(msg) {
    clearInterval(timerInterval);
    isLocked = true;
    statusText.innerText = msg;
    retryBtn.style.display = 'inline-block';
}

function retryLevel() {
    initGame();
}

function nextLevel() {
    level++;
    initGame();
}

initGame();
