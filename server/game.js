module.exports = {
    setupGame: setupGame,
    handleGameState: handleGameState,
    addPlayer: addPlayer,
    findTeam: findTeam
};

const {FRAME_RATE, BG_COLOR, RED, BLUE, BLOCK_SIZE, BORDER_WIDTH, PLAYER_MAX_HEALTH, MOVE_SPEED, FRICTION, GRAVITY, JUMP_VEL, REACH_DIST, PICK_REACH_DIST, HIT_DIST, TOOL_ALPHA, DARKEN, LIGHTEN, CORRECTION, RAIL_ACC, BRONZE_ACTIVATION_TIME, GOLD_ACTIVATION_TIME, QUARTZ_ACTIVATION_TIME, ROOM_SIZE, GEM_BLOCK_BUFFER, BRONZE_GENERATOR_NUM, BRONZE_DIST_FROM_CENTER, BRONZE_STARTER_DIST, GOLD_GENERATOR_NUM, GOLD_DIST_FROM_CENTER, BRONZE_COL, BRONZE_CENTER_COL, GOLD_COL, GOLD_CENTER_COL, QUARTZ_COL, QUARTZ_CENTER_COL} = require('./constants.js');
const {Collision, Line, Rectangle, Circle} = require('./shapes.js');
const {RegBlock, GemBlock, BronzeGenerator, GoldGenerator, ShiftBlock, RailBlock, UnbreakableBlock} = require('./blocks.js');
const {BlockTool, StarterPickaxe, BetterPickaxe, Stick, Sword} = require('./tools.js');
const {Shop, ShopItem} = require('./shop.js');
const {Player} = require('./player.js');

function setupGame() {
    const gameState = {
        players: [],
        objects: []
    };
    
    const shopItems = [new ShopItem(1, 0, 0, RegBlock, 10), new ShopItem(2, 0, 0, ShiftBlock, 2), new ShopItem(2, 0, 0, RailBlock, 10), new ShopItem(10, 5, 0, Sword, 1), new ShopItem(10, 0, 0, BetterPickaxe, 1)];
    
    gameState.objects.push(new GemBlock(GEM_BLOCK_BUFFER * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE, 0, RED));
    gameState.objects.push(new GemBlock((ROOM_SIZE - GEM_BLOCK_BUFFER) * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE, 0, BLUE));
    
    gameState.objects.push(new BronzeGenerator(BRONZE_STARTER_DIST * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE, 0));
    gameState.objects.push(new BronzeGenerator((ROOM_SIZE - BRONZE_STARTER_DIST) * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE, 0));
    
    gameState.objects.push(new Shop(0, ROOM_SIZE/2 * BLOCK_SIZE - BLOCK_SIZE, 0, shopItems, RED));
    gameState.objects.push(new Shop(ROOM_SIZE * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE - BLOCK_SIZE, 0, shopItems, BLUE));
    
    for (let i = 0; i < 5; i++) {
        gameState.objects.push(new UnbreakableBlock(BLOCK_SIZE * i, ROOM_SIZE/2 * BLOCK_SIZE, 0, RED));
        gameState.objects.push(new UnbreakableBlock(ROOM_SIZE * BLOCK_SIZE - BLOCK_SIZE * i, ROOM_SIZE/2 * BLOCK_SIZE, 0, BLUE));
    }
    
    // divide by two coz symmetry
    for (let i = 0; i < BRONZE_GENERATOR_NUM/2; i++) {
        const x = ~~(Math.random() * ROOM_SIZE/2);
        const y = ~~(Math.random() * ROOM_SIZE);
        const z = ~~(Math.random() * BRONZE_DIST_FROM_CENTER * 2) - BRONZE_DIST_FROM_CENTER;
        gameState.objects.push(new BronzeGenerator(x * BLOCK_SIZE, y * BLOCK_SIZE, z));
        gameState.objects.push(new BronzeGenerator(x * BLOCK_SIZE + ROOM_SIZE/2 * BLOCK_SIZE, y * BLOCK_SIZE, z));
    }
    
    for (let i = 0; i < GOLD_GENERATOR_NUM/2; i++) {
        const x = ~~(Math.random() * ROOM_SIZE/2);
        const y = ~~(Math.random() * ROOM_SIZE);
        const z = ~~(Math.random() * GOLD_DIST_FROM_CENTER * 2) - GOLD_DIST_FROM_CENTER;
        gameState.objects.push(new GoldGenerator(x * BLOCK_SIZE, y * BLOCK_SIZE, z));
        gameState.objects.push(new GoldGenerator(x * BLOCK_SIZE + ROOM_SIZE/2 * BLOCK_SIZE, y * BLOCK_SIZE, z));
    }
    return gameState;
}

function handleGameState(gameState) {
    for (let i in gameState.players) gameState.players[i].update(gameState.players, gameState.objects);
    for (let i = gameState.objects.length - 1; i >= 0; i--) {
        gameState.objects[i].update(gameState.players);
        if (gameState.objects[i].delete) gameState.objects.splice(i, 1);
    }
    return gameState;
}

function addPlayer(gameState, team) {
    let player;
    if (team == RED) player = new Player(GEM_BLOCK_BUFFER * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE - BLOCK_SIZE, team);
    else if (team == BLUE) player = new Player((ROOM_SIZE - GEM_BLOCK_BUFFER) * BLOCK_SIZE, ROOM_SIZE/2 * BLOCK_SIZE - BLOCK_SIZE, team);
    else throw 'team is not red or blue';
    
    player.tools.push(new Stick(team));
    BlockTool.addItem(player, RegBlock, 30);
    player.tools.push(new StarterPickaxe());
    
    gameState.players.push(player);
}

function findTeam(gameState) {
    let reds = 0;
    let blues = 0;
    for (let i in gameState.players) {
        if (gameState.players[i].team == RED) reds++;
        else if (gameState.players[i].team == BLUE) blues++;
        else throw 'team is not red or blue';
    }
    return reds > blues ? BLUE : blues > reds ? RED : ~~(Math.random() * 2) == 0 ? RED : BLUE;
}