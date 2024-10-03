const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: "blue",
    speed: 5,
    dx: 0,
    dy: 0,
};

let bullets = [];
let enemies = [];
let enemyBullets = [];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        color: "red",
        speed: 7
    });
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function createEnemy() {
    let enemy = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        color: "green",
        speed: 2
    };
    enemies.push(enemy);

    // Враг стреляет через определенное время
    setTimeout(() => shootEnemyBullet(enemy), 1000);
}

function shootEnemyBullet(enemy) {
    enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 5,
        y: enemy.y + enemy.height,
        width: 10,
        height: 20,
        color: "yellow",
        speed: 4
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function detectCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    // Проверка на попадание вражеских пуль в игрока
    enemyBullets.forEach((bullet, bulletIndex) => {
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            console.log("Игрок попал под вражеский огонь!");
            enemyBullets.splice(bulletIndex, 1);
            // Здесь можно добавить логику уменьшения жизни игрока
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemyBullets();
    drawEnemies();
    movePlayer();
    detectCollision();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowRight") player.dx = player.speed;
    if (e.code === "ArrowLeft") player.dx = -player.speed;
    if (e.code === "Space") shootBullet();
});

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowRight" || e.code === "ArrowLeft") player.dx = 0;
});

setInterval(createEnemy, 1000);
gameLoop();