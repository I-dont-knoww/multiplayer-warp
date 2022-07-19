const {FRAME_RATE, BG_COLOR, RED, BLUE, BLOCK_SIZE, BORDER_WIDTH, PLAYER_MAX_HEALTH, MOVE_SPEED, FRICTION, GRAVITY, JUMP_VEL, REACH_DIST, PICK_REACH_DIST, HIT_DIST, TOOL_ALPHA, DARKEN, LIGHTEN, CORRECTION, RAIL_ACC, BRONZE_ACTIVATION_TIME, GOLD_ACTIVATION_TIME, QUARTZ_ACTIVATION_TIME, ROOM_SIZE, GEM_BLOCK_BUFFER, BRONZE_GENERATOR_NUM, BRONZE_DIST_FROM_CENTER, BRONZE_STARTER_DIST, GOLD_GENERATOR_NUM, GOLD_DIST_FROM_CENTER, BRONZE_COL, BRONZE_CENTER_COL, GOLD_COL, GOLD_CENTER_COL, QUARTZ_COL, QUARTZ_CENTER_COL} = require('./constants.js');
const {Collision, Line, Rectangle, Circle} = require('./shapes.js');
const {Block} = require('./blocks.js');
const {addItem} = require('./tools.js');

class Shop extends Block {
    constructor(x, y, z, items, team, drawer) {
        super(x, y, z, Infinity, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), team, drawer);
        this.items = items;
        this.transparent = true;
    }
    
    special(player) {
        if (player.team != this.team) return;
        
        let itemIndex = -1;
        
        if (player.keys['1']) itemIndex = 0;
        if (player.keys['2']) itemIndex = 1;
        if (player.keys['3']) itemIndex = 2;
        if (player.keys['4']) itemIndex = 3;
        if (player.keys['5']) itemIndex = 4;
        if (player.keys['6']) itemIndex = 5;
        if (player.keys['7']) itemIndex = 6;
        if (player.keys['8']) itemIndex = 7;
        if (player.keys['9']) itemIndex = 8;
        if (player.keys['0']) itemIndex = 9;
        
        if (itemIndex == -1) return;
        
        itemIndex = Math.min(itemIndex, this.items.length - 1);
        this.buy(player, this.items[itemIndex]);
        
        player.keys[(itemIndex + 1) % 10] = false;
    }
    
    buy(player, shopItem) {
        if (player.bronze >= shopItem.bronze && player.gold >= shopItem.gold && player.quartz >= shopItem.quartz) {
            player.bronze -= shopItem.bronze;
            player.gold -= shopItem.gold;
            player.quartz -= shopItem.quartz;
            
            addItem(player, shopItem.item, shopItem.amount);
        }
    }
    
    render() {
        drawer.fillStyle = this.team;
        drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
        
        drawer.fillStyle = `rgba(0, 0, 0, ${DARKEN})`;
        drawer.fillRect(this.x, this.y + BLOCK_SIZE/2, this.z, BLOCK_SIZE, BLOCK_SIZE/2);
        
        drawer.ctx.fillStyle = '#000000';
        drawer.ctx.font = '10px sans-serif';
        drawer.ctx.textAlign = 'right';
        drawer.ctx.textBaseline = 'middle';
        drawer.fillText(`bronze: `, this.x - BLOCK_SIZE * 5 + BLOCK_SIZE/2 - BLOCK_SIZE/5, this.y - BLOCK_SIZE - BLOCK_SIZE * 7/5, this.z);
        drawer.fillText(`gold: `, this.x - BLOCK_SIZE * 5 + BLOCK_SIZE/2 - BLOCK_SIZE/5, this.y - BLOCK_SIZE - BLOCK_SIZE * 11/10, this.z);
        drawer.fillText(`quartz: `, this.x - BLOCK_SIZE * 5 + BLOCK_SIZE/2 - BLOCK_SIZE/5, this.y - BLOCK_SIZE - BLOCK_SIZE * 4/5, this.z);
        drawer.fillText(`amount: `, this.x - BLOCK_SIZE * 5 + BLOCK_SIZE/2 - BLOCK_SIZE/5, this.y - BLOCK_SIZE - BLOCK_SIZE * 1/2, this.z);
        drawer.ctx.textAlign = 'center';
        
        for (let i in this.items) {
            drawer.ctx.globalAlpha = TOOL_ALPHA;
            
            const shopItem = this.items[i];
            
            const x = this.x - BLOCK_SIZE * 5 + i * BLOCK_SIZE + BLOCK_SIZE/2;
            const y = this.y - BLOCK_SIZE;
            
            (new Function(`return ${shopItem.clientItem.toLowerCase()}`))()(x, y, this.z, BLOCK_SIZE/2, this.team, this.drawer);
            
            drawer.ctx.globalAlpha = 1;
            
            drawer.fillStyle = '#000000';
            drawer.fillText(`${shopItem.bronze}`, x, y - BLOCK_SIZE * 7/5, this.z);
            drawer.fillText(`${shopItem.gold}`, x, y - BLOCK_SIZE * 11/10, this.z);
            drawer.fillText(`${shopItem.quartz}`, x, y - BLOCK_SIZE * 4/5, this.z);
            drawer.fillText(`${shopItem.amount}`, x, y - BLOCK_SIZE * 1/2, this.z);
        }
    }
    
    static render() {
        throw 'player not supposed to have shop item';
    }
}

class ShopItem {
    constructor(bronze, gold, quartz, item, amount) {
        this.bronze = bronze;
        this.gold = gold;
        this.quartz = quartz;
        
        this.item = item;
        this.amount = amount;
    }
}

module.exports = {
    Shop: Shop,
    ShopItem: ShopItem
};