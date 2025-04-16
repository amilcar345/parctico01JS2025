// Obtener el canvas y el contexto para dibujar
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables globales
let gameSpeed = 5;
let gravity = 0.5;
let gameOver = false;
let score = 0;
let highScore = 0; // Puntuación más alta alcanzada

// Sonidos
const jumpSound = new Audio("jump.mp3");
const milestoneSound = new Audio("score.mp3");

// Objeto del dinosaurio
let dino = {
    x: 50,
    y: canvas.height - 47,
    width: 44,
    height: 47,
    vy: 0,
    isJumping: false
};

// Objeto del obstáculo
let obstacle = {
    x: canvas.width,
    y: canvas.height - 40,
    width: 25,
    height: 40
};

// Carga de imágenes
let dinoImg = new Image();
dinoImg.src = "dino.png";
let cactusImg = new Image();
cactusImg.src = "cactus.png";

// Bucle principal del juego
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Lógica del juego: movimiento, colisiones, puntuación
function update() {
    score++;

    // Cada 100 puntos, sube la velocidad y suena efecto
    if (score % 100 === 0 && score !== 0) {
        gameSpeed += 0.5;
        milestoneSound.play();
    }

    // Movimiento del salto
    if (dino.isJumping) {
        dino.vy += gravity;
        dino.y += dino.vy;

        // Cuando aterriza
        if (dino.y >= canvas.height - dino.height) {
            dino.y = canvas.height - dino.height;
            dino.isJumping = false;
            dino.vy = 0;
        }
    }

    // Movimiento del obstáculo
    obstacle.x -= gameSpeed;

    // Reposicionar el obstáculo si sale de pantalla
    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width + Math.random() * 200;
    }

    // Detección de colisión
    if (collision(dino, obstacle)) {
        gameOver = true;

        // Actualizar high score
        if (score > highScore) highScore = score;

        // Mostrar botón de reinicio
        document.getElementById("restartBtn").style.display = "block";
    }
}

// Detección de colisión básica por rectángulos
function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Dibujar el juego en pantalla
function draw() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar puntajes
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("High Score: " + highScore, 10, 50);

    // Dibujar el dinosaurio
    if (dinoImg.complete) {
        // Cambiar color si está saltando
        ctx.filter = dino.isJumping ? 'hue-rotate(90deg)' : 'none';
        ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        ctx.filter = 'none'; // Resetear filtro
    } else {
        ctx.fillStyle = dino.isJumping ? "orange" : "green";
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    // Dibujar el obstáculo
    if (cactusImg.complete) {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else {
        ctx.fillStyle = "brown";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Control del salto con barra espaciadora
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && !dino.isJumping && !gameOver) {
        dino.isJumping = true;
        dino.vy = -10; // Impulso hacia arriba
        jumpSound.play(); // Sonido de salto
        e.preventDefault(); // Evita scroll
    }
});

// Reiniciar juego (botón que aparece al perder)
document.getElementById("restartBtn").addEventListener("click", function() {
    resetGame();
    this.style.display = "none";
});

// Botón adicional para reinicio manual
document.getElementById("manualRestartBtn").addEventListener("click", function() {
    if (gameOver) {
        resetGame();
        document.getElementById("restartBtn").style.display = "none";
    }
});

// Función para reiniciar el juego
function resetGame() {
    gameOver = false;
    score = 0;
    gameSpeed = 5;
    dino.y = canvas.height - dino.height;
    dino.vy = 0;
    dino.isJumping = false;
    obstacle.x = canvas.width;
    gameLoop();
}

// Iniciar el juego cuando carga la página
window.onload = function() {
    gameLoop();
};

