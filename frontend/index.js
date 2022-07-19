const canvas = document.getElementById('canvas');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');

const socket = io('http://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameState', handleGameState);
socket.on('gameCode', handleGameCode);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const drawer = new Drawer(ctx);
let playerNumber;

const body = document.getElementById('body');

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);
document.addEventListener('contextmenu', e => e.preventDefault());

function newGame() {
    socket.emit('newGame');
    init();
}

function joinGame() {
    const code = prompt('game code?');
    socket.emit('joinGame', code);
    init();
}

function init() {
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'block';
    
    body.addEventListener('keydown', e => socket.emit('keydown', JSON.stringify({key: e.key})));
    body.addEventListener('keyup', e => socket.emit('keyup', JSON.stringify({key: e.key})));

    body.addEventListener('mousedown', e => {
        e.x = e.clientX + drawer.x;
        e.y = e.clientY + drawer.y;
        socket.emit('mousedown', JSON.stringify({
            x: e.clientX + drawer.x,
            y: e.clientY + drawer.y,
            button: e.button
        }));
    });

    body.addEventListener('mouseup', e => {
        e.x = e.clientX + drawer.x;
        e.y = e.clientY + drawer.y;
        socket.emit('mouseup', JSON.stringify({
            x: e.clientX + drawer.x,
            y: e.clientY + drawer.y,
            button: e.button
        }));
    });

    body.addEventListener('mousemove', e => requestAnimationFrame(_ => {
        e.x = e.clientX + drawer.x;
        e.y = e.clientY + drawer.y;
        socket.emit('mousemove', JSON.stringify({
            x: e.clientX + drawer.x,
            y: e.clientY + drawer.y
        }));
    }));
}

function handleInit(num) {
    playerNumber = num;
}

function handleGameState(gameState) {
    gameState = JSON.parse(gameState);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    drawer.fillStyle = BG_COLOR;
    drawer.ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderHUD(gameState.players[playerNumber]);
    
    drawer.x = gameState.players[playerNumber].x;
    drawer.y = gameState.players[playerNumber].y;
    drawer.z = gameState.players[playerNumber].z;
    
    drawer.renderGameState(gameState);
}

function handleGameCode(gameCode) {
    prompt(`Your game code is`, gameCode);
}

function renderHUD(player) {    
    drawer.ctx.fillStyle = BRONZE_CENTER_COL;
    drawer.ctx.fill(bronzeOutline);
    drawer.ctx.strokeStyle = BRONZE_COL;
    drawer.ctx.lineWidth = 3;
    drawer.ctx.stroke(bronze);
    
    drawer.ctx.fillStyle = GOLD_CENTER_COL;
    drawer.ctx.fill(goldOutline);
    drawer.ctx.strokeStyle = GOLD_COL;
    drawer.ctx.lineWidth = 3;
    drawer.ctx.stroke(gold);
    
    drawer.ctx.fillStyle = QUARTZ_CENTER_COL;
    drawer.ctx.fill(quartzOutline);
    drawer.ctx.strokeStyle = QUARTZ_COL;
    drawer.ctx.lineWidth = 3;
    drawer.ctx.stroke(quartz);
    
    drawer.ctx.fillStyle = '#000000';
    drawer.ctx.font = '20px sans-serif';
    drawer.ctx.textAlign = 'left';
    drawer.ctx.textBaseline = 'middle';
    drawer.ctx.fillText(player.bronze, BRONZE_TEXT_X, HUD_Y + BLOCK_SIZE/2 * HUD_SIZE_MULTIPLIER);
    drawer.ctx.fillText(player.gold, GOLD_TEXT_X, HUD_Y + BLOCK_SIZE/2 * HUD_SIZE_MULTIPLIER);
    drawer.ctx.fillText(player.quartz, QUARTZ_TEXT_X, HUD_Y + BLOCK_SIZE/2 * HUD_SIZE_MULTIPLIER);
}