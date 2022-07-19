const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

const {FRAME_RATE, BG_COLOR, RED, BLUE, BLOCK_SIZE, BORDER_WIDTH, PLAYER_MAX_HEALTH, MOVE_SPEED, FRICTION, GRAVITY, JUMP_VEL, REACH_DIST, PICK_REACH_DIST, HIT_DIST, TOOL_ALPHA, DARKEN, LIGHTEN, CORRECTION, RAIL_ACC, BRONZE_ACTIVATION_TIME, GOLD_ACTIVATION_TIME, QUARTZ_ACTIVATION_TIME, ROOM_SIZE, GEM_BLOCK_BUFFER, BRONZE_GENERATOR_NUM, BRONZE_DIST_FROM_CENTER, BRONZE_STARTER_DIST, GOLD_GENERATOR_NUM, GOLD_DIST_FROM_CENTER, BRONZE_COL, BRONZE_CENTER_COL, GOLD_COL, GOLD_CENTER_COL, QUARTZ_COL, QUARTZ_CENTER_COL} = require('./constants.js');
const {Collision, Line, Rectangle, Circle} = require('./shapes.js');
const {RegBlock, GemBlock, BronzeGenerator, GoldGenerator, ShiftBlock, RailBlock, UnbreakableBlock} = require('./blocks.js');
const {Shop, ShopItem} = require('./shop.js');
const {BlockTool, StarterPickaxe, BetterPickaxe, Stick, Sword} = require('./tools.js');
const {Player} = require('./player.js');
const {setupGame, handleGameState, addPlayer, findTeam} = require('./game.js');

const state = {};
const clientRooms = {};

io.on('connection', client => {
    let clientNumber = -1;
    
    client.on('keydown', handleKeyDown);
    client.on('keyup', handleKeyUp);
    client.on('mousedown', handleMouseDown);
    client.on('mouseup', handleMouseUp);
    client.on('mousemove', handleMouseMove);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
    client.on('disconnect', handleLeaveGame);
    
    function handleNewGame() {
        let roomName = makeid(30);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);
        
        state[roomName] = setupGame();
        addPlayer(state[roomName], findTeam(state[roomName]));
        
        client.join(roomName);
        clientNumber = 0;
        client.emit('init', 0);
        
        startGameInterval(roomName);
    }
    
    function handleJoinGame(gameCode) {
        const arr = Array.from(io.sockets.adapter.rooms);
        let numClients;
        
        for (let i in arr) {
            if (arr[i][0] == gameCode) {
                numClients = arr[i][1].size;
            }
        }
        
        if (numClients == 0) {
            client.emit('unknownGame');
            return;
        }
        
        addPlayer(state[gameCode], findTeam(state[gameCode]))
        clientRooms[client.id] = gameCode;
        client.join(gameCode);
        clientNumber = numClients;
        client.emit('init', clientNumber);
    }
    
    function handleKeyDown(e) {
        e = JSON.parse(e);
        state[clientRooms[client.id]].players[clientNumber].keys[e.key.toLowerCase()] = true;
    }
    
    function handleKeyUp(e) {
        e = JSON.parse(e);
        delete state[clientRooms[client.id]].players[clientNumber].keys[e.key.toLowerCase()];
    }
    
    function handleMouseDown(e) {
        e = JSON.parse(e);
        const player = state[clientRooms[client.id]].players[clientNumber];
        player.mouse.x = e.x;
        player.mouse.y = e.y;
        if (e.button == 0) player.mouse.click = true;
        else if (e.button == 2) player.mouse.rclick = true;
    }
    
    function handleMouseUp(e) {
        e = JSON.parse(e);
        const player = state[clientRooms[client.id]].players[clientNumber];
        player.mouse.x = e.x;
        player.mouse.y = e.y;
        if (e.button == 0) player.mouse.click = false;
        else if (e.button == 2) player.mouse.rclick = false;
    }
    
    function handleMouseMove(e) {
        e = JSON.parse(e);
        const player = state[clientRooms[client.id]].players[clientNumber];
        player.mouse.x = e.x;
        player.mouse.y = e.y;
    }
    
    function handleLeaveGame() {
        
    }
});

function startGameInterval(roomName) {
    return setInterval(_ => {
        state[roomName] = handleGameState(state[roomName]);
        
        emitGameState(roomName, state[roomName]);
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName) {
    state[roomName].players = encode(state[roomName].players);
    state[roomName].objects = encode(state[roomName].objects);
    const t = []; // temp list to store circular last hit
    
    for (let i in state[roomName].players) {
        const player = state[roomName].players[i];
        t.push(player.lastHit);
        player.lastHit = null;
    }
    
    io.sockets.in(roomName).emit('gameState', JSON.stringify(state[roomName]));
    
    for (let i in state[roomName].players) state[roomName].players[i].lastHit = t[i];
}

function encode(objects) {
    for (let i in objects) { // OPTIMIZATION
        const object = objects[i];
        
        let render = object.render.toString().split('\n');
        render.pop(); render.shift();
        object.clientArgs = object.render.toString().split('\n')[0].split('(')[1].split(')')[0].split(', ');
        object.clientRender = render.join('\n');
        
        if (object.tools) {
            for (let j in object.tools) {
                const tool = object.tools[j];
                
                let toolRender = tool.render.toString().split('\n');
                toolRender.pop(); toolRender.shift();
                tool.clientArgs = tool.render.toString().split('\n')[0].split('(')[1].split(')')[0].split(', ');
                tool.clientRender = toolRender.join('\n');
                if (tool.blocktype) tool.clientBlock = tool.blocktype.name.toLowerCase();
            }
        }
        else if (object.items) {
            for (let j in object.items) {
                object.items[j].clientItem = object.items[j].item.name;
            }
        }
    }
    return objects;
}

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]{};\':\\/<>,.?|';
    for (let i = 0; i < length; i++) {
        result += characters[~~(Math.random() * characters.length)];
    }
    return result;
}

io.listen(process.env.PORT || 3000);