const {FRAME_RATE, BG_COLOR, RED, BLUE, BLOCK_SIZE, BORDER_WIDTH, PLAYER_MAX_HEALTH, MOVE_SPEED, FRICTION, GRAVITY, JUMP_VEL, REACH_DIST, PICK_REACH_DIST, HIT_DIST, TOOL_ALPHA, DARKEN, LIGHTEN, CORRECTION, RAIL_ACC, BRONZE_ACTIVATION_TIME, GOLD_ACTIVATION_TIME, QUARTZ_ACTIVATION_TIME, ROOM_SIZE, GEM_BLOCK_BUFFER, BRONZE_GENERATOR_NUM, BRONZE_DIST_FROM_CENTER, BRONZE_STARTER_DIST, GOLD_GENERATOR_NUM, GOLD_DIST_FROM_CENTER, BRONZE_COL, BRONZE_CENTER_COL, GOLD_COL, GOLD_CENTER_COL, QUARTZ_COL, QUARTZ_CENTER_COL} = require('./constants.js');
const {Collision, Line, Rectangle, Circle} = require('./shapes.js');
const {RegBlock, GemBlock, BronzeGenerator, GoldGenerator, ShiftBlock, RailBlock, UnbreakableBlock} = require('./blocks.js');
const {Shop, ShopItem} = require('./shop.js');
const {BlockTool, StarterPickaxe, BetterPickaxe, Stick, Sword} = require('./tools.js');

class Player {
    constructor(x, y, team, drawer) {
        this.x = x;
        this.y = y;
        this.z = 0;
        
        this.dx = 0;
        this.dy = 0;
        this.dir = 1;
        
        this.jumping = false;
        this.grounded = false;
        
        this.tools = [];
        this.toolIndex = 0;
        
        this.shape = new Rectangle(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        
        this.team = team;
        this.health = PLAYER_MAX_HEALTH;
        
        this.drawer = drawer;
        
        this.bronze = 0;
        this.gold = 0;
        this.quartz = 0;
        
        this.lastHit = null;
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            click: false,
            rclick: false
        };
    }
    
    update(players, objects) {
        if (this.keys['1']) this.toolIndex = 0;
        if (this.keys['2']) this.toolIndex = 1;
        if (this.keys['3']) this.toolIndex = 2;
        if (this.keys['4']) this.toolIndex = 3;
        if (this.keys['5']) this.toolIndex = 4;
        if (this.keys['6']) this.toolIndex = 5;
        if (this.keys['7']) this.toolIndex = 6;
        if (this.keys['8']) this.toolIndex = 7;
        if (this.keys['9']) this.toolIndex = 8;
        if (this.keys['0']) this.toolIndex = 9;
        
        this.toolIndex = Math.min(this.toolIndex, this.tools.length - 1);
        
        if (this.keys.w && !this.jumping && this.grounded) { // jump
            this.jumping = true;
            this.grounded = false;
            this.dy = JUMP_VEL;
        }
        
        // left and right
        if (this.keys.a && this.dx > -MOVE_SPEED) this.dx--;
        if (this.keys.d && this.dx < MOVE_SPEED) this.dx++;
        
        // switch items
        if (this.keys.q) {
            this.toolIndex = this.toolIndex - 1;
            if (this.toolIndex < 0) this.toolIndex = this.tools.length - 1;
            this.keys.q = false;
        }
        if (this.keys.e) {
            this.toolIndex = (this.toolIndex + 1) % this.tools.length;
            this.keys.e = false;
        }
        
        if (this.mouse.click) {
            const tool = this.tools[this.toolIndex];
            const x = this.mouse.x / BLOCK_SIZE < 0 ? ~~(this.mouse.x / BLOCK_SIZE) - 1 : ~~(this.mouse.x / BLOCK_SIZE);
            const y = this.mouse.y / BLOCK_SIZE < 0 ? ~~(this.mouse.y / BLOCK_SIZE) - 1 : ~~(this.mouse.y / BLOCK_SIZE);
            
            if ((x * BLOCK_SIZE - this.x) ** 2 + (y * BLOCK_SIZE - this.y) ** 2 <= (REACH_DIST * BLOCK_SIZE) ** 2 && x >= 0 && x <= ROOM_SIZE && y >= 0 && y <= ROOM_SIZE) {
                if (tool.type == 'block' && tool.num > 0) { // place blocks
                    let good = true;
                    for (let i in objects) {
                        if (objects[i].x == x * BLOCK_SIZE && objects[i].y == y * BLOCK_SIZE && objects[i].z == this.z) {
                            good = false;
                            break;
                        }
                    }

                    if (good) {
                        tool.num--;
                        if (tool.num <= 0) {
                            this.tools.splice(this.toolIndex, 1);
                            this.toolIndex = Math.min(this.toolIndex, this.tools.length - 1);
                            this.mouse.click = false;
                        }
                        objects.push(new tool.blocktype(x * BLOCK_SIZE, y * BLOCK_SIZE, this.z, this.team));
                    }
                } else if (tool.type == 'pick') { // delete blocks
                    for (let i in objects) {
                        if (x * BLOCK_SIZE == objects[i].x && y * BLOCK_SIZE == objects[i].y && this.z == objects[i].z && (x * BLOCK_SIZE - this.x) ** 2 + (y * BLOCK_SIZE - this.y) ** 2 <= (PICK_REACH_DIST * BLOCK_SIZE) ** 2) {
                            objects[i].health -= tool.hardness;
                            if (objects[i].health <= 0) objects.splice(i, 1);
                            this.mouse.click = false;
                        }
                    }
                }
            }
            if (tool.type == 'weapon') {
                if (tool.timer <= 0) {
                    if (Math.sign(this.mouse.x - this.x) == this.dir) {
                        tool.timer = tool.speed;
                        if ((this.mouse.x - this.x + BLOCK_SIZE/2) ** 2 + (this.mouse.y - this.y + BLOCK_SIZE/2) ** 2 <= (tool.range * BLOCK_SIZE) ** 2) for (let i in players) {
                            const player = players[i];
                            if (player == this) continue;
                            if ((player.x - this.mouse.x + BLOCK_SIZE/2) ** 2 + (player.y - this.mouse.y + BLOCK_SIZE/2) ** 2 <= (HIT_DIST * BLOCK_SIZE) ** 2) {
                                const hitDir = Math.atan2(player.y - this.y, player.x - this.x);

                                player.health -= tool.damage;
                                player.lastHit = this;
                                player.dx += Math.cos(hitDir) * MOVE_SPEED * tool.kb;
                                player.dy += Math.sin(hitDir) * MOVE_SPEED * tool.kb;
                            }
                        }
                    }
                }
                this.mouse.click = false;
            }
        }
        
        if (this.mouse.rclick) {
            const x = this.mouse.x / BLOCK_SIZE < 0 ? ~~(this.mouse.x / BLOCK_SIZE) - 1 : ~~(this.mouse.x / BLOCK_SIZE);
            const y = this.mouse.y / BLOCK_SIZE < 0 ? ~~(this.mouse.y / BLOCK_SIZE) - 1 : ~~(this.mouse.y / BLOCK_SIZE);
            
            for (let i in objects) {
                if (x * BLOCK_SIZE == objects[i].x && y * BLOCK_SIZE == objects[i].y && this.z == objects[i].z && objects[i].team == this.team) {
                    objects[i].changeState();
                    this.mouse.rclick = false;
                    break;
                }
            }
        }
        
        if (this.tools[this.toolIndex].timer && this.tools[this.toolIndex].timer > 0) this.tools[this.toolIndex].timer--;
        
        this.dx *= FRICTION;
        this.dy += GRAVITY;
        
        this.grounded = false;
        
        let checkedX = false;
        let checkedYPos = false;
        let checkedYNeg = false;
        
        for (let i in objects) {
            const obj = objects[i];
            
            if (obj.z != this.z) continue;;
            
            const vX = this.shape.x + this.shape.w/2 - obj.shape.x - obj.shape.w/2;
            const vY = this.shape.y + this.shape.h/2 - obj.shape.y - obj.shape.h/2;

            const widths = this.shape.w/2 + obj.shape.w/2;
            const heights = this.shape.h/2 + obj.shape.h/2;

            if (Math.abs(vX) < widths && Math.abs(vY) < heights) {
                obj.special(this, objects);
                if (obj.transparent) continue;
                
                const oX = widths - Math.abs(vX);
                const oY = heights - Math.abs(vY);

                if (oX >= oY) {
                    if (vY > 0 && !checkedYPos) {
                        this.y += oY;
                        this.dy = 0;
                        checkedYPos = true;
                    } else if (!checkedYNeg) {
                        this.y -= oY;
                        this.grounded = true;
                        this.jumping = false;
                        checkedYNeg = true;
                    }
                } else if (!checkedX) {
                    if (vX > 0) this.x += oX;
                    else this.x -= oX;

                    this.jumping = false;
                    
                    checkedX = true;
                }
                
                this.shape.x = this.x;
                this.shape.y = this.y;
            }
        }
        
        if (this.grounded) this.dy = 0;
        
        this.x += this.dx;
        this.y += this.dy;
        
        if (this.dx > 0) this.dir = 1;
        else if (this.dx < 0) this.dir = -1;
        
        this.shape.x = this.x;
        this.shape.y = this.y;
        
        if (this.y + BLOCK_SIZE >= ROOM_SIZE * BLOCK_SIZE) this.die();
        if (this.health <= 0) this.die();
    }
    
    render() {
        this.drawer.fillStyle = this.team;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
        
        this.toolIndex = Math.min(this.toolIndex, this.tools.length - 1);
        this.tools[this.toolIndex].render = new Function(...this.tools[this.toolIndex].clientArgs, this.tools[this.toolIndex].clientRender);
        this.tools[this.toolIndex].render(this.x + (this.dir < 0 ? -BLOCK_SIZE/4 : BLOCK_SIZE + BLOCK_SIZE/4), this.y + BLOCK_SIZE/2, this.z, BLOCK_SIZE/2, this.team, this.drawer, this.dir);
        
        drawer.fillStyle = '#000000';
        drawer.ctx.font = '10px sans-serif';
        drawer.ctx.textAlign = 'center';
        drawer.ctx.textBaseline = 'middle';
        drawer.fillText(`x: ${Math.round(this.x)}`, this.x + BLOCK_SIZE/2, this.y + BLOCK_SIZE/5, this.z);
        drawer.fillText(`y: ${Math.round(this.y)}`, this.x + BLOCK_SIZE/2, this.y + BLOCK_SIZE/2, this.z);
        drawer.fillText(`z: ${Math.round(this.z)}`, this.x + BLOCK_SIZE/2, this.y + BLOCK_SIZE - BLOCK_SIZE/5, this.z);
    }
    
    die() {
        if (this.team == RED) {
            this.x = GEM_BLOCK_BUFFER * BLOCK_SIZE;
            this.y = ROOM_SIZE/2 * BLOCK_SIZE - BLOCK_SIZE;
        } else if (this.team == BLUE) {
            this.x = (ROOM_SIZE - GEM_BLOCK_BUFFER) * BLOCK_SIZE;
            this.y = ROOM_SIZE/2 * BLOCK_SIZE - BLOCK_SIZE;
        } else {
            throw 'team is not red or blue';
        }
        this.z = 0;
        
        this.dx = 0;
        this.dy = 0;
        
        if (this.lastHit) {
            this.lastHit.bronze += this.bronze;
            this.lastHit.gold += this.gold;
            this.lastHit.quartz += this.quartz;
        }
        this.lastHit = null;
        
        this.bronze = 0;
        this.gold = 0;
        this.quartz = 0;
        
        this.tools = [];
        this.tools.push(new Stick(this.team));
        BlockTool.addItem(this, RegBlock, 30);
        this.tools.push(new StarterPickaxe(1));
        
        this.health = PLAYER_MAX_HEALTH;
    }
}

module.exports = {
    Player: Player
};