// Global State
let currentPage = 'home';
let gameState = {
    tableau: [[], [], [], [], [], [], []],
    foundation: [[], [], [], []],
    stock: [],
    waste: [],
    score: 0,
    moves: 0,
    time: 0,
    gameWon: false,
    timerInterval: null,
    gameStarted: false
};

// Card Data
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Utility Functions
function getSuitSymbol(suit) {
    const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    return symbols[suit];
}

function getSuitColor(suit) {
    return (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
}

function getRankValue(rank) {
    const values = {
        'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
        '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return values[rank];
}

function createDeck() {
    const deck = [];
    SUITS.forEach(suit => {
        RANKS.forEach(rank => {
            deck.push({
                suit: suit,
                rank: rank,
                id: `${suit}-${rank}`,
                faceUp: false
            });
        });
    });
    return deck;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Navigation
function navigateTo(page) {
    currentPage = page;
    updateNavigation();
    renderPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    mobileNav.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
}

function updateNavigation() {
    // Update desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update mobile nav
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Page Rendering
function renderPage() {
    const mainContent = document.getElementById('mainContent');
    
    switch (currentPage) {
        case 'home':
            renderHomePage();
            break;
        case 'about':
            renderAboutPage();
            break;
        case 'contact':
            renderContactPage();
            break;
        case 'terms':
            renderTermsPage();
            break;
        case 'privacy':
            renderPrivacyPage();
            break;
        default:
            renderHomePage();
    }
}

// Home Page
function renderHomePage() {
    const mainContent = document.getElementById('mainContent');
    
    if (!gameState.gameStarted) {
        mainContent.innerHTML = `
            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <h1>Play Solitaire Online for Free</h1>
                        <p>Classic Klondike Solitaire - No Download Required</p>
                        <button class="btn-play" onclick="startGame()">
                            <span>▶</span>
                            Play Now
                        </button>
                    </div>
                </div>
            </section>
            
            <section class="section">
                <div class="container max-w-4xl">
                    <div class="card">
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="font-size: 2rem;">ℹ️</div>
                            <div>
                                <h2>About Solitaire</h2>
                                <p>Solitaire, also known as Klondike, is one of the most popular single-player card games in the world. The objective is to build four foundation piles (one for each suit) in ascending order from Ace to King.</p>
                                <p>Challenge yourself to complete the game in the fewest moves and shortest time possible!</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card rules-card">
                        <h2>Game Rules</h2>
                        
                        <h3>Objective</h3>
                        <p>Move all cards to the four foundation piles, organized by suit from Ace to King.</p>
                        
                        <h3>Tableau Rules</h3>
                        <ul>
                            <li>Cards can be moved between tableau columns in descending order</li>
                            <li>Cards must alternate between red and black suits</li>
                            <li>Only Kings can be placed in empty tableau columns</li>
                            <li>Multiple cards can be moved together if they form a valid sequence</li>
                        </ul>
                        
                        <h3>Foundation Rules</h3>
                        <ul>
                            <li>Foundation piles must start with an Ace</li>
                            <li>Cards must be added in ascending order (A, 2, 3... K)</li>
                            <li>Only cards of the same suit can be placed on each foundation pile</li>
                        </ul>
                        
                        <h3>Stock and Waste</h3>
                        <ul>
                            <li>Click the stock pile to draw cards one at a time</li>
                            <li>The top card of the waste pile can be played to tableau or foundation</li>
                            <li>When the stock is empty, click the empty space to recycle the waste pile</li>
                        </ul>
                        
                        <h3>How to Play</h3>
                        <ul>
                            <li>Click on cards to automatically move them to valid foundation piles</li>
                            <li>Drag and drop cards to move them between tableau columns</li>
                            <li>Drag cards from the waste pile to tableau or foundation</li>
                            <li>Click "New Game" to restart at any time</li>
                        </ul>
                    </div>
                </div>
            </section>
        `;
    } else {
        mainContent.innerHTML = `
            <div class="hero-small">
                <div class="container">
                    <h1>Solitaire Online</h1>
                </div>
            </div>
            
            <section class="section">
                <div class="container">
                    <div id="solitaireGame"></div>
                    <div class="back-link">
                        <button onclick="backToRules()">← Back to Rules</button>
                    </div>
                </div>
            </section>
        `;
        renderSolitaireGame();
    }
}

function startGame() {
    gameState.gameStarted = true;
    initializeGame();
    renderHomePage();
}

function backToRules() {
    gameState.gameStarted = false;
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    renderHomePage();
}

// Solitaire Game
function initializeGame() {
    const deck = shuffleDeck(createDeck());
    const newTableau = [[], [], [], [], [], [], []];
    let cardIndex = 0;

    // Deal cards to tableau
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
            const card = deck[cardIndex++];
            card.faceUp = row === col;
            newTableau[col].push(card);
        }
    }

    const remainingCards = deck.slice(cardIndex);
    
    gameState.tableau = newTableau;
    gameState.foundation = [[], [], [], []];
    gameState.stock = remainingCards;
    gameState.waste = [];
    gameState.score = 0;
    gameState.moves = 0;
    gameState.time = 0;
    gameState.gameWon = false;

    // Start timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameWon) {
            gameState.time++;
            updateGameStats();
        }
    }, 1000);
}

function renderSolitaireGame() {
    const gameContainer = document.getElementById('solitaireGame');
    
    gameContainer.innerHTML = `
        <div class="game-header">
            <div class="game-stats">
                <div class="stat-item">
                    <span>🏆</span>
                    <span>Score: <span id="scoreValue">0</span></span>
                </div>
                <div class="stat-item">
                    <span>⏱️</span>
                    <span>Time: <span id="timeValue">00:00</span></span>
                </div>
                <div class="stat-item">
                    <span>Moves: <span id="movesValue">0</span></span>
                </div>
                <button class="btn-new-game" onclick="initializeGame(); renderSolitaireGame();">
                    <span>↻</span>
                    New Game
                </button>
            </div>
        </div>
        
        <div id="winMessage" class="win-message hidden">
            <div class="win-icon">🏆</div>
            <h2>Congratulations! 🎉</h2>
            <p>You won in <span id="winMoves">0</span> moves and <span id="winTime">00:00</span>!</p>
            <p style="margin-top: 0.5rem;">Score: <span id="winScore">0</span> points</p>
        </div>
        
        <div class="game-board">
            <div class="top-row">
                <div class="card-slot" onclick="drawFromStock()">
                    <div id="stockPile"></div>
                </div>
                <div class="card-slot">
                    <div id="wastePile"></div>
                </div>
                <div class="card-slot"></div>
                <div class="card-slot" data-foundation="0" ondragover="allowDrop(event)" ondrop="dropOnFoundation(event, 0)">
                    <div id="foundation0"></div>
                </div>
                <div class="card-slot" data-foundation="1" ondragover="allowDrop(event)" ondrop="dropOnFoundation(event, 1)">
                    <div id="foundation1"></div>
                </div>
                <div class="card-slot" data-foundation="2" ondragover="allowDrop(event)" ondrop="dropOnFoundation(event, 2)">
                    <div id="foundation2"></div>
                </div>
                <div class="card-slot" data-foundation="3" ondragover="allowDrop(event)" ondrop="dropOnFoundation(event, 3)">
                    <div id="foundation3"></div>
                </div>
            </div>
            
            <div class="tableau">
                <div class="card-pile" data-tableau="0" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 0)">
                    <div id="tableau0"></div>
                </div>
                <div class="card-pile" data-tableau="1" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 1)">
                    <div id="tableau1"></div>
                </div>
                <div class="card-pile" data-tableau="2" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 2)">
                    <div id="tableau2"></div>
                </div>
                <div class="card-pile" data-tableau="3" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 3)">
                    <div id="tableau3"></div>
                </div>
                <div class="card-pile" data-tableau="4" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 4)">
                    <div id="tableau4"></div>
                </div>
                <div class="card-pile" data-tableau="5" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 5)">
                    <div id="tableau5"></div>
                </div>
                <div class="card-pile" data-tableau="6" ondragover="allowDrop(event)" ondrop="dropOnTableau(event, 6)">
                    <div id="tableau6"></div>
                </div>
            </div>
        </div>
    `;
    
    updateGameBoard();
    updateGameStats();
}

function updateGameStats() {
    const scoreEl = document.getElementById('scoreValue');
    const timeEl = document.getElementById('timeValue');
    const movesEl = document.getElementById('movesValue');
    
    if (scoreEl) scoreEl.textContent = gameState.score;
    if (timeEl) timeEl.textContent = formatTime(gameState.time);
    if (movesEl) movesEl.textContent = gameState.moves;
}

function updateGameBoard() {
    // Update stock
    const stockPile = document.getElementById('stockPile');
    if (gameState.stock.length > 0) {
        stockPile.innerHTML = renderCard(gameState.stock[gameState.stock.length - 1], false);
    } else {
        stockPile.innerHTML = '<div class="empty-slot stock">↻</div>';
    }
    
    // Update waste
    const wastePile = document.getElementById('wastePile');
    if (gameState.waste.length > 0) {
        const topCard = gameState.waste[gameState.waste.length - 1];
        wastePile.innerHTML = renderCard(topCard, true, 'waste', 0, 0);
    } else {
        wastePile.innerHTML = '<div class="empty-slot"></div>';
    }
    
    // Update foundation
    for (let i = 0; i < 4; i++) {
        const foundationPile = document.getElementById(`foundation${i}`);
        if (gameState.foundation[i].length > 0) {
            foundationPile.innerHTML = renderCard(gameState.foundation[i][gameState.foundation[i].length - 1], false);
        } else {
            foundationPile.innerHTML = `<div class="empty-slot foundation">${getSuitSymbol(SUITS[i])}</div>`;
        }
    }
    
    // Update tableau
    for (let i = 0; i < 7; i++) {
        const tableauPile = document.getElementById(`tableau${i}`);
        const pile = gameState.tableau[i];
        
        if (pile.length === 0) {
            tableauPile.innerHTML = '<div class="empty-slot"></div>';
        } else {
            let html = '';
            pile.forEach((card, index) => {
                html += `<div class="card-absolute" style="top: ${index * 24}px;">
                    ${renderCard(card, card.faceUp, 'tableau', i, index)}
                </div>`;
            });
            tableauPile.innerHTML = html;
        }
    }
}

function renderCard(card, draggable, source, sourceIndex, cardIndex) {
    if (!card.faceUp) {
        return `
            <div class="playing-card face-down">
                <div class="card-back"></div>
            </div>
        `;
    }
    
    const color = getSuitColor(card.suit);
    const symbol = getSuitSymbol(card.suit);
    const dragAttr = draggable ? `draggable="true" ondragstart="dragStart(event, '${source}', ${sourceIndex}, ${cardIndex})"` : '';
    const clickAttr = `onclick="cardClick('${source}', ${sourceIndex}, ${cardIndex})"`;
    
    return `
        <div class="playing-card ${draggable ? 'draggable' : ''}" ${dragAttr} ${clickAttr}>
            <div class="card-corner top ${color}">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${symbol}</div>
            </div>
            <div class="card-center ${color}">${symbol}</div>
            <div class="card-corner bottom ${color}">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${symbol}</div>
            </div>
        </div>
    `;
}

// Game Logic
function drawFromStock() {
    if (gameState.stock.length > 0) {
        const card = gameState.stock.pop();
        card.faceUp = true;
        gameState.waste.push(card);
        gameState.moves++;
    } else if (gameState.waste.length > 0) {
        gameState.stock = gameState.waste.reverse().map(c => ({ ...c, faceUp: false }));
        gameState.waste = [];
        gameState.moves++;
    }
    updateGameBoard();
    updateGameStats();
}

function canPlaceOnTableau(card, targetPile) {
    if (targetPile.length === 0) {
        return getRankValue(card.rank) === 13; // Only Kings on empty tableau
    }
    const topCard = targetPile[targetPile.length - 1];
    const differentColor = getSuitColor(card.suit) !== getSuitColor(topCard.suit);
    const rankDiff = getRankValue(topCard.rank) - getRankValue(card.rank) === 1;
    return differentColor && rankDiff;
}

function canPlaceOnFoundation(card, targetPile) {
    if (targetPile.length === 0) {
        return getRankValue(card.rank) === 1; // Only Aces on empty foundation
    }
    const topCard = targetPile[targetPile.length - 1];
    const sameSuit = card.suit === topCard.suit;
    const rankDiff = getRankValue(card.rank) - getRankValue(topCard.rank) === 1;
    return sameSuit && rankDiff;
}

function cardClick(source, sourceIndex, cardIndex) {
    let card;
    
    if (source === 'waste') {
        card = gameState.waste[gameState.waste.length - 1];
    } else if (source === 'tableau') {
        if (cardIndex !== gameState.tableau[sourceIndex].length - 1) return;
        card = gameState.tableau[sourceIndex][cardIndex];
    }
    
    if (!card || !card.faceUp) return;
    
    // Try to auto-move to foundation
    for (let i = 0; i < 4; i++) {
        if (canPlaceOnFoundation(card, gameState.foundation[i])) {
            moveToFoundation(source, sourceIndex, i);
            return;
        }
    }
}

function moveToFoundation(source, sourceIndex, foundationIndex) {
    let card;
    
    if (source === 'waste') {
        card = gameState.waste.pop();
    } else if (source === 'tableau') {
        card = gameState.tableau[sourceIndex].pop();
        if (gameState.tableau[sourceIndex].length > 0) {
            gameState.tableau[sourceIndex][gameState.tableau[sourceIndex].length - 1].faceUp = true;
        }
    }
    
    if (card) {
        gameState.foundation[foundationIndex].push(card);
        gameState.score += 10;
        gameState.moves++;
        
        updateGameBoard();
        updateGameStats();
        checkWinCondition();
    }
}

function checkWinCondition() {
    const totalCards = gameState.foundation.reduce((sum, pile) => sum + pile.length, 0);
    if (totalCards === 52) {
        gameState.gameWon = true;
        const winMessage = document.getElementById('winMessage');
        document.getElementById('winMoves').textContent = gameState.moves;
        document.getElementById('winTime').textContent = formatTime(gameState.time);
        document.getElementById('winScore').textContent = gameState.score;
        winMessage.classList.remove('hidden');
        
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
    }
}

// Drag and Drop
let dragData = null;

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event, source, sourceIndex, cardIndex) {
    if (source === 'waste') {
        dragData = {
            cards: [gameState.waste[gameState.waste.length - 1]],
            source: source,
            sourceIndex: sourceIndex
        };
    } else if (source === 'tableau') {
        dragData = {
            cards: gameState.tableau[sourceIndex].slice(cardIndex),
            source: source,
            sourceIndex: sourceIndex,
            cardIndex: cardIndex
        };
    }
}

function dropOnFoundation(event, foundationIndex) {
    event.preventDefault();
    
    if (!dragData || dragData.cards.length !== 1) return;
    
    const card = dragData.cards[0];
    
    if (canPlaceOnFoundation(card, gameState.foundation[foundationIndex])) {
        moveToFoundation(dragData.source, dragData.sourceIndex, foundationIndex);
    }
    
    dragData = null;
}

function dropOnTableau(event, tableauIndex) {
    event.preventDefault();
    
    if (!dragData) return;
    
    const card = dragData.cards[0];
    
    if (canPlaceOnTableau(card, gameState.tableau[tableauIndex])) {
        // Add cards to tableau
        gameState.tableau[tableauIndex].push(...dragData.cards);
        
        // Remove from source
        if (dragData.source === 'waste') {
            gameState.waste.pop();
        } else if (dragData.source === 'tableau') {
            gameState.tableau[dragData.sourceIndex] = gameState.tableau[dragData.sourceIndex].slice(0, dragData.cardIndex);
            if (gameState.tableau[dragData.sourceIndex].length > 0) {
                gameState.tableau[dragData.sourceIndex][gameState.tableau[dragData.sourceIndex].length - 1].faceUp = true;
            }
        }
        
        gameState.score += 5;
        gameState.moves++;
        
        updateGameBoard();
        updateGameStats();
    }
    
    dragData = null;
}

// About Page
function renderAboutPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div style="padding-top: 4rem; background: linear-gradient(to bottom right, #f0fdf4, #ffffff);">
            <div class="container section max-w-4xl">
                <h1 class="page-title text-center">About Solitaire Online</h1>
                
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="width: 4rem; height: 4rem; background: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                            🃏
                        </div>
                        <h2>Our Mission</h2>
                    </div>
                    
                    <p style="font-size: 1.125rem; margin-bottom: 1rem;">
                        Welcome to Solitaire Online - your premier destination for playing classic Klondike Solitaire completely free, 
                        right in your web browser. We believe that everyone should have access to quality entertainment without barriers, 
                        which is why our game is 100% free with no downloads, no registration, and no hidden fees.
                    </p>
                    
                    <p style="font-size: 1.125rem;">
                        Our mission is simple: to provide a clean, elegant, and enjoyable Solitaire experience that you can play 
                        anytime, anywhere, on any device.
                    </p>
                </div>

                <div class="feature-grid">
                    <div class="feature-box green">
                        <div class="feature-icon">❤️</div>
                        <h3>Free Forever</h3>
                        <p style="opacity: 0.9;">
                            No ads, no subscriptions, no payments. Just pure Solitaire fun. We're committed to keeping this game 
                            free and accessible to everyone who wants to play.
                        </p>
                    </div>

                    <div class="feature-box yellow">
                        <div class="feature-icon">👥</div>
                        <h3>For Everyone</h3>
                        <p>
                            Whether you're a Solitaire veteran or just learning the game, our intuitive interface makes it easy 
                            to play. Suitable for all ages and skill levels.
                        </p>
                    </div>

                    <div class="feature-box blue">
                        <div class="feature-icon">⏰</div>
                        <h3>Play Anytime</h3>
                        <p style="opacity: 0.9;">
                            No downloads or installation required. Just open your browser and start playing. Works on desktop, 
                            tablet, and mobile devices.
                        </p>
                    </div>

                    <div class="feature-box purple">
                        <div class="feature-icon">🏆</div>
                        <h3>Classic Gameplay</h3>
                        <p style="opacity: 0.9;">
                            Experience the authentic Klondike Solitaire rules you know and love, with smooth animations and 
                            intuitive drag-and-drop controls.
                        </p>
                    </div>
                </div>

                <div class="card rules-card">
                    <h2 style="margin-bottom: 1.5rem;">The History of Solitaire</h2>
                    
                    <p style="font-size: 1.125rem; margin-bottom: 1rem;">
                        Solitaire has a rich history dating back to the 18th century. While its exact origins are debated, 
                        the game became particularly popular in France and later spread throughout Europe and North America.
                    </p>
                    
                    <p style="font-size: 1.125rem; margin-bottom: 1rem;">
                        The Klondike variant, which is the version most people think of when they hear "Solitaire," gained 
                        massive popularity during the Klondike Gold Rush in the late 1890s, hence its name.
                    </p>
                    
                    <p style="font-size: 1.125rem; margin-bottom: 1rem;">
                        In 1990, Solitaire was included with Microsoft Windows 3.0, introducing millions of people to the game 
                        and making it one of the most played computer games in history. The game served the dual purpose of 
                        entertainment and teaching users how to use a mouse through its drag-and-drop mechanics.
                    </p>
                    
                    <p style="font-size: 1.125rem;">
                        Today, Solitaire remains one of the most beloved casual games worldwide, played by millions of people 
                        every day. We're proud to carry on this tradition by offering a modern, web-based version that honors 
                        the classic gameplay while providing a fresh, clean experience.
                    </p>
                </div>

                <div class="card text-center">
                    <h2 style="margin-bottom: 1rem;">Why Choose Us?</h2>
                    <p style="font-size: 1.125rem; margin-bottom: 1.5rem;">
                        We're dedicated to providing the best online Solitaire experience with:
                    </p>
                    <div class="feature-grid">
                        <div style="text-align: left;">
                            <h4 style="color: #15803d; margin-bottom: 0.5rem;">✓ Clean Interface</h4>
                            <p style="color: #4b5563;">No distractions, just pure gameplay</p>
                        </div>
                        <div style="text-align: left;">
                            <h4 style="color: #15803d; margin-bottom: 0.5rem;">✓ Responsive Design</h4>
                            <p style="color: #4b5563;">Perfect on any screen size</p>
                        </div>
                        <div style="text-align: left;">
                            <h4 style="color: #15803d; margin-bottom: 0.5rem;">✓ Fast & Smooth</h4>
                            <p style="color: #4b5563;">Optimized for the best performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Contact Page
function renderContactPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div style="padding-top: 4rem; background: linear-gradient(to bottom right, #f0fdf4, #ffffff);">
            <div class="container section max-w-4xl">
                <h1 class="page-title text-center">Contact Us</h1>
                
                <div class="card">
                    <p style="font-size: 1.125rem; text-align: center; margin-bottom: 2rem;">
                        Have a question, suggestion, or feedback? We'd love to hear from you! 
                        Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    <div id="contactFormContainer">
                        <form id="contactForm" onsubmit="handleContactSubmit(event)">
                            <div class="form-group">
                                <label class="form-label" for="name">
                                    👤 Your Name
                                </label>
                                <input type="text" id="name" name="name" class="form-input" placeholder="John Doe" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="email">
                                    ✉️ Email Address
                                </label>
                                <input type="email" id="email" name="email" class="form-input" placeholder="john@example.com" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="message">
                                    💬 Your Message
                                </label>
                                <textarea id="message" name="message" class="form-textarea" placeholder="Tell us what's on your mind..." rows="6" required></textarea>
                            </div>

                            <button type="submit" class="btn-submit">
                                <span>📤</span>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                <div class="feature-grid">
                    <div class="feature-box green">
                        <div class="feature-icon">✉️</div>
                        <h3>Email Support</h3>
                        <p style="opacity: 0.9;">
                            For general inquiries and support, feel free to reach out to us at any time. 
                            We typically respond within 24-48 hours.
                        </p>
                    </div>

                    <div class="feature-box blue">
                        <div class="feature-icon">💬</div>
                        <h3>Feedback</h3>
                        <p style="opacity: 0.9;">
                            Your feedback helps us improve! Let us know what features you'd like to see 
                            or how we can make your Solitaire experience even better.
                        </p>
                    </div>
                </div>

                <div class="info-box">
                    <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
                    <div style="color: #4b5563;">
                        <div style="margin-bottom: 1rem;">
                            <h4 style="color: #15803d; margin-bottom: 0.25rem;">Is Solitaire Online really free?</h4>
                            <p>Yes! Our game is completely free to play with no hidden fees or subscriptions.</p>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <h4 style="color: #15803d; margin-bottom: 0.25rem;">Do I need to create an account?</h4>
                            <p>No registration required. Just visit the site and start playing immediately.</p>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <h4 style="color: #15803d; margin-bottom: 0.25rem;">Can I play on my mobile device?</h4>
                            <p>Absolutely! Our game is fully responsive and works great on phones and tablets.</p>
                        </div>
                        <div>
                            <h4 style="color: #15803d; margin-bottom: 0.25rem;">How do I report a bug?</h4>
                            <p>Please use the contact form above to report any issues you encounter.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const container = document.getElementById('contactFormContainer');
    container.innerHTML = `
        <div class="success-message">
            <div class="success-icon">✓</div>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Thank You!</h2>
            <p style="color: #4b5563;">
                Your message has been sent successfully. We'll be in touch soon!
            </p>
        </div>
    `;
    
    setTimeout(() => {
        renderContactPage();
    }, 3000);
}

// Terms Page
function renderTermsPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div style="padding-top: 4rem; background: linear-gradient(to bottom right, #f0fdf4, #ffffff);">
            <div class="container section max-w-4xl">
                <div class="page-header">
                    <div class="page-icon">📄</div>
                    <h1 class="page-title">Terms & Conditions</h1>
                    <div class="page-date">
                        <span>📅</span>
                        <p>Last Updated: November 3, 2025</p>
                    </div>
                </div>
                
                <div class="card">
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using Solitaire Online ("the Service"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to these terms, please do not use this Service.</p>

                    <h2 style="margin-top: 2rem;">2. Use of Service</h2>
                    <p>Solitaire Online is provided free of charge for personal, non-commercial use. You agree to use 
                    the Service only for lawful purposes and in accordance with these Terms.</p>
                    <p style="margin-top: 0.5rem;">You agree not to:</p>
                    <ul>
                        <li>Use the Service in any way that violates any applicable law or regulation</li>
                        <li>Attempt to interfere with or disrupt the Service or servers</li>
                        <li>Attempt to gain unauthorized access to any part of the Service</li>
                        <li>Use any automated system to access the Service</li>
                        <li>Reproduce, duplicate, or copy any part of the Service without permission</li>
                    </ul>

                    <h2 style="margin-top: 2rem;">3. Intellectual Property</h2>
                    <p>The Service and its original content, features, and functionality are owned by Solitaire Online and are 
                    protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

                    <h2 style="margin-top: 2rem;">4. Disclaimer of Warranties</h2>
                    <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either 
                    express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.</p>

                    <h2 style="margin-top: 2rem;">5. Limitation of Liability</h2>
                    <p>In no event shall Solitaire Online, its directors, employees, or affiliates be liable for any indirect, 
                    incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.</p>

                    <h2 style="margin-top: 2rem;">6. Game Rules and Fairness</h2>
                    <p>Our Solitaire game uses standard Klondike rules and random card shuffling to ensure fair gameplay. 
                    While we strive for accuracy, we cannot guarantee that every game is winnable, as this is a characteristic 
                    of Solitaire itself.</p>

                    <h2 style="margin-top: 2rem;">7. No Gambling</h2>
                    <p>This is a free entertainment service. No real money, prizes, or rewards are involved. This is not a 
                    gambling service and should not be used as such.</p>

                    <h2 style="margin-top: 2rem;">8. User Data</h2>
                    <p>Our Service does not require registration or collect personal information. Game statistics (scores, times) 
                    are stored locally in your browser and are not transmitted to our servers. See our Privacy Policy for more details.</p>

                    <h2 style="margin-top: 2rem;">9. Changes to Terms</h2>
                    <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant 
                    changes by updating the "Last Updated" date at the top of this page. Your continued use of the Service 
                    after any changes constitutes acceptance of the new Terms.</p>

                    <h2 style="margin-top: 2rem;">10. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us through our Contact page.</p>
                </div>

                <div class="info-box text-center">
                    <p>
                        By using Solitaire Online, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Privacy Page
function renderPrivacyPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div style="padding-top: 4rem; background: linear-gradient(to bottom right, #f0fdf4, #ffffff);">
            <div class="container section max-w-4xl">
                <div class="page-header">
                    <div class="page-icon">🛡️</div>
                    <h1 class="page-title">Privacy Policy</h1>
                    <div class="page-date">
                        <span>📅</span>
                        <p>Last Updated: November 3, 2025</p>
                    </div>
                </div>
                
                <div class="card">
                    <h2>Our Commitment to Privacy</h2>
                    <p>At Solitaire Online, we take your privacy seriously. This Privacy Policy explains how we handle 
                    information when you use our Service. The good news is: we collect minimal information and prioritize 
                    your privacy above all else.</p>

                    <div class="info-box" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem; color: #15803d;">Key Privacy Points</h3>
                        <ul style="color: #4b5563;">
                            <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="color: #16a34a;">✓</span>
                                <span>No registration or account creation required</span>
                            </li>
                            <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="color: #16a34a;">✓</span>
                                <span>No personal information collected</span>
                            </li>
                            <li style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="color: #16a34a;">✓</span>
                                <span>No tracking or advertising cookies</span>
                            </li>
                            <li style="display: flex; gap: 0.5rem;">
                                <span style="color: #16a34a;">✓</span>
                                <span>Game data stored locally on your device only</span>
                            </li>
                        </ul>
                    </div>

                    <h2 style="margin-top: 2rem;">Information We Collect</h2>
                    <p><strong>Personal Information:</strong> We do not collect any personally identifiable information. 
                    You can play our game completely anonymously without creating an account or providing any personal details.</p>
                    <p style="margin-top: 0.5rem;"><strong>Game Statistics:</strong> Your game scores, times, and preferences are stored locally in 
                    your browser's local storage. This data never leaves your device and is not transmitted to our servers.</p>
                    <p style="margin-top: 0.5rem;"><strong>Technical Information:</strong> We may collect basic technical information such as browser 
                    type and general location (country level) for analytics purposes to improve the Service. This 
                    information is anonymized and cannot be used to identify you.</p>

                    <h2 style="margin-top: 2rem;">Cookies and Local Storage</h2>
                    <p>We use browser local storage to save your game preferences and statistics. This is stored entirely 
                    on your device and is not accessible to us or any third parties.</p>
                    <p style="margin-top: 0.5rem;">We do not use advertising cookies or third-party tracking cookies. Any cookies we use are strictly 
                    functional and necessary for the Service to work properly.</p>

                    <h2 style="margin-top: 2rem;">How We Use Information</h2>
                    <p>The limited information we collect is used solely to:</p>
                    <ul>
                        <li>Provide and maintain the Service</li>
                        <li>Improve and optimize the game experience</li>
                        <li>Monitor and analyze usage patterns (anonymously)</li>
                        <li>Detect and prevent technical issues</li>
                    </ul>
                    <p style="margin-top: 0.5rem;">We do not sell, trade, or rent your information to third parties. We do not use your information 
                    for advertising or marketing purposes.</p>

                    <h2 style="margin-top: 2rem;">Data Security</h2>
                    <p>Since we don't collect or store personal information on our servers, there's minimal risk to your privacy. 
                    Your game data is stored locally on your device and is protected by your browser's security measures. 
                    We use industry-standard security practices to protect our Service from unauthorized access or attacks.</p>

                    <h2 style="margin-top: 2rem;">Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Clear your local game data at any time by clearing your browser's local storage</li>
                        <li>Use the Service without providing any personal information</li>
                        <li>Request information about our data practices by contacting us</li>
                        <li>Stop using the Service at any time</li>
                    </ul>

                    <h2 style="margin-top: 2rem;">Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us 
                    through our Contact page. We're committed to addressing any concerns you may have.</p>
                </div>

                <div style="margin-top: 2rem; background: linear-gradient(to bottom right, #dbeafe, #eff6ff); border-radius: 0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 1.5rem; text-align: center;">
                    <div style="font-size: 3rem; color: #2563eb; margin-bottom: 0.75rem;">🔒</div>
                    <p style="color: #4b5563;">
                        Your privacy matters to us. We believe in providing great entertainment without compromising your personal information.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });
    
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });
    
    // Initial page render
    navigateTo('home');
});
