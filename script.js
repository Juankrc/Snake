const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tamaño del canvas y de la cuadrícula
const canvasSize = 400;
const gridSize = 20;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Variables del juego
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let food = { x: gridSize * 10, y: gridSize * 10 };
let direction = { x: gridSize, y: 0 };
let score = 0;
let level = 1;
let pointsPerLevel = 5;
let gameOver = false;
let speed = 200;

// Obstáculos predefinidos
let predefinedObstacles = [];
let playerName = "";

// Referencias a los elementos HTML
const startButton = document.getElementById('startButton');
const playerNameInput = document.getElementById('playerNameInput');

// Habilitar el botón START solo si se ingresa un nombre válido
playerNameInput.addEventListener('input', () => {
    playerName = playerNameInput.value.trim();
    startButton.disabled = !playerName; // Deshabilitar si no hay nombre
});

// Función para generar obstáculos aleatorios
function generateObstacles(level) {
    predefinedObstacles = [];
    let numObstacles = level * 3;

    for (let i = 0; i < numObstacles; i++) {
        let obstacleSize = Math.floor(Math.random() * 2) + 1;
        let x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        let y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

        for (let j = 0; j < obstacleSize; j++) {
            for (let k = 0; k < obstacleSize; k++) {
                predefinedObstacles.push({ x: x + j * gridSize, y: y + k * gridSize });
            }
        }
    }
}

// Función para dibujar un cuadrado en el canvas
function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

// Función para generar comida en una posición aleatoria
function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Función para actualizar la posición de la serpiente
function update() {
    if (gameOver) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();

        if (score % pointsPerLevel === 0) {
            level++;
            speed = Math.max(50, speed - 20);
            generateObstacles(level);
        }
    } else {
        snake.pop();
    }

    if (
        head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize ||
        snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y) ||
        predefinedObstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)
    ) {
        gameOver = true;
        alert(`Game Over, ${playerName}! Your score was: ${score} and you reached level: ${level}`);
        resetGame();
    }
}

// Función para reiniciar el juego
function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    level = 1;
    speed = 200;
    gameOver = false;
    generateFood();
    generateObstacles(level);
}

// Función para dibujar la serpiente, la comida, el puntaje, el nivel, el nombre del jugador y los obstáculos predefinidos
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach(part => drawRect(part.x, part.y, 'green'));
    drawRect(food.x, food.y, 'red');
    predefinedObstacles.forEach(obstacle => drawRect(obstacle.x, obstacle.y, 'blue'));

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${playerName}`, 10, 30);
    ctx.fillText(`Score: ${score}`, 10, 60);
    ctx.fillText(`Level: ${level}`, 10, 90);
}

// Ciclo principal del juego
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, speed);
    }
}

// Control del teclado para cambiar la dirección de la serpiente
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

// Iniciar el juego al hacer clic en el botón START
startButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
});