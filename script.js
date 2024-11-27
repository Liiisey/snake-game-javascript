//Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;
let highScore = 0;

//Draw game map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//Create a snake or food cube/div
function createGameElement(tag, className, id) {
    const element = document.createElement(tag);
    element.className = className;
    element.id = id;
    return element;
}

//Set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Testing draw function
//draw();

//Draw food function
function drawFood() {
    const foodElement = createGameElement('div', 'food', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

//Generate food (with random position in the grid)
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

function move() {
    const head = {...snake[0]}; //copy of snake without modifying the original one
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past interval
        gameIntervalFunction();
    }
    else {
        snake.pop();
    }
}

//Test moving
/*setInterval(() => {
    move();
    draw();
}, 200);*/

//Start game function
function startGame() {
    gameStarted = true; //Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameIntervalFunction();
}

function gameIntervalFunction() {
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//Keepress listener of space bar for starting the game
function handleKeePress(event) {
    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) { //Handle different browser for tracking space bar
        startGame();
    }
    else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeePress);

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];
    //Collisions with grid
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    //Collisions with snake's body
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateScore();
    updateHighScore();
    stopGame();
    //restting to default values
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 250;
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

function stopGame() {
    document.getElementById('food').style.display = 'none';
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}


