const {FRAME_RATE, BG_COLOR, RED, BLUE, BLOCK_SIZE, BORDER_WIDTH, PLAYER_MAX_HEALTH, MOVE_SPEED, FRICTION, GRAVITY, JUMP_VEL, REACH_DIST, PICK_REACH_DIST, HIT_DIST, TOOL_ALPHA, DARKEN, LIGHTEN, CORRECTION, RAIL_ACC, BRONZE_ACTIVATION_TIME, GOLD_ACTIVATION_TIME, QUARTZ_ACTIVATION_TIME, ROOM_SIZE, GEM_BLOCK_BUFFER, BRONZE_GENERATOR_NUM, BRONZE_DIST_FROM_CENTER, BRONZE_STARTER_DIST, GOLD_GENERATOR_NUM, GOLD_DIST_FROM_CENTER, BRONZE_COL, BRONZE_CENTER_COL, GOLD_COL, GOLD_CENTER_COL, QUARTZ_COL, QUARTZ_CENTER_COL} = require('./constants.js');
const {Collision, Line, Rectangle, Circle} = require('./shapes.js');

class Block {
    constructor(x, y, z, health, shape, team, drawer) {
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.health = health;
        
        this.shape = shape;
        this.team = team;
        
        this.drawer = drawer;
    }
    
    update() {
        
    }
    
    render() {
        throw 'You forgot to put a render function';
    }
    
    static render() {
        throw 'You need a static render function';
    }
    
    changeState() {
        
    }
    
    special() {
        
    }
}

class RegBlock extends Block {
    constructor(x, y, z, team, drawer) {
        super(x, y, z, 1, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), team, drawer);
    }
    
    render() {
        this.drawer.fillStyle = this.team;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
        
        this.drawer.strokeStyle = `rgba(0, 0, 0, ${DARKEN})`;
        this.drawer.ctx.lineWidth = BORDER_WIDTH;
        this.drawer.strokeRect(this.x + BORDER_WIDTH/2, this.y + BORDER_WIDTH/2, this.z, BLOCK_SIZE - BORDER_WIDTH, BLOCK_SIZE - BORDER_WIDTH);
    }
    
    get blocktype() {
        return 'regblock';
    }
    
    static render(x, y, z, size, color, drawer) {
        drawer.fillStyle = color;
        drawer.fillRect(x - size/2, y - size/2, z, size, size);
        
        drawer.strokeStyle = `rgba(0, 0, 0, ${DARKEN})`;
        drawer.ctx.lineWidth = BORDER_WIDTH * size/BLOCK_SIZE;
        drawer.strokeRect(x + drawer.ctx.lineWidth/2 - size/2, y + drawer.ctx.lineWidth/2 - size/2, z, size - drawer.ctx.lineWidth, size - drawer.ctx.lineWidth);
    }
}

class GemBlock extends Block {
    constructor(x, y, z, team, drawer) {
        super(x, y, z, Infinity, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), team, drawer);
        this.deactivated = false;
    }
    
    render() {
        this.drawer.ctx.shadowColor = this.team;
        this.drawer.ctx.shadowBlur = 50;
        if (this.deactivated) this.drawer.ctx.shadowBlur = 0;
        this.drawer.fillStyle = this.team;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
        this.drawer.ctx.shadowBlur = 0;
        
        if (this.deactivated) return;
        
        this.drawer.fillStyle = `rgba(255, 255, 255, ${LIGHTEN})`;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    special(player) {
        if (player.team != this.team && !this.deactivated) {
            player.quartz++;
            this.deactivated = true;
            setTimeout((_ => {
                this.deactivated = false;
            }).bind(this), QUARTZ_ACTIVATION_TIME);
        }
    }
    
    get blocktype() {
        return 'gemblock';
    }
    
    static render() {
        throw 'player not supposed to have this block';
    }
}

class BronzeGenerator extends Block {
    constructor(x, y, z, drawer) {
        super(x, y, z, Infinity, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), BRONZE_CENTER_COL, drawer);
        this.deactivated = false;
    }
    
    render() {
        this.drawer.ctx.shadowColor = this.team;
        this.drawer.ctx.shadowBlur = 50;
        if (this.deactivated) this.drawer.ctx.shadowBlur = 0;
        this.drawer.fillStyle = this.team;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
        this.drawer.ctx.shadowBlur = 0;
        
        if (this.deactivated) return;
        
        this.drawer.fillStyle = `rgba(255, 255, 255, ${LIGHTEN})`;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    special(player) {
        if (player.team != this.team && !this.deactivated) {
            player.bronze++;
            this.deactivated = true;
            setTimeout((_ => {
                this.deactivated = false;
            }).bind(this), BRONZE_ACTIVATION_TIME);
        }
    }
    
    get blocktype() {
        return 'gemblock';
    }
    
    static render() {
        throw 'player not supposed to have this block';
    }
}
class GoldGenerator extends Block {
    constructor(x, y, z, drawer) {
        super(x, y, z, Infinity, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), GOLD_CENTER_COL, drawer);
        this.deactivated = false;
    }
    
    render() {
        this.drawer.ctx.shadowColor = this.team;
        this.drawer.ctx.shadowBlur = 50;
        if (this.deactivated) this.drawer.ctx.shadowBlur = 0;
        this.drawer.fillStyle = this.team;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
        this.drawer.ctx.shadowBlur = 0;
        
        if (this.deactivated) return;
        
        this.drawer.fillStyle = `rgba(255, 255, 255, ${LIGHTEN})`;
        this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    special(player) {
        if (player.team != this.team && !this.deactivated) {
            player.gold++;
            this.deactivated = true;
            setTimeout((_ => {
                this.deactivated = false;
            }).bind(this), GOLD_ACTIVATION_TIME);
        }
    }
    
    get blocktype() {
        return 'gemblock';
    }
    
    static render() {
        throw 'player not supposed to have this block';
    }
}

class ShiftBlock extends Block {
    constructor(x, y, z, team, drawer) {
        super(x, y, z, 5, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), team, drawer);
        this.transparent = true;
        
        this.state = 1;
    }
    
    render() {
        this.drawer.fillStyle = this.team;
        this.drawer.fillRect(this.x, this.y + BLOCK_SIZE * 4/5, this.z, BLOCK_SIZE, BLOCK_SIZE/5);
        
        const path = new Path2D();
        if (this.state == 1) {
            path.moveTo(this.x + BLOCK_SIZE/2, this.y);
            path.lineTo(this.x, this.y + BLOCK_SIZE/2);
            path.lineTo(this.x + BLOCK_SIZE/3, this.y + BLOCK_SIZE/2);
            path.lineTo(this.x + BLOCK_SIZE/3, this.y + BLOCK_SIZE);
            path.lineTo(this.x + BLOCK_SIZE * 2/3, this.y + BLOCK_SIZE);
            path.lineTo(this.x + BLOCK_SIZE * 2/3, this.y + BLOCK_SIZE/2);
            path.lineTo(this.x + BLOCK_SIZE, this.y + BLOCK_SIZE/2);
        } else {
            path.moveTo(this.x + BLOCK_SIZE/2, this.y + BLOCK_SIZE);
            path.lineTo(this.x, this.y + BLOCK_SIZE/2);
            path.lineTo(this.x + BLOCK_SIZE/3, this.y + BLOCK_SIZE/2);
            path.lineTo(this.x + BLOCK_SIZE/3, this.y);
            path.lineTo(this.x + BLOCK_SIZE * 2/3, this.y);
            path.lineTo(this.x + BLOCK_SIZE * 2/3, this.y + BLOCK_SIZE/2);
            path.lineTo(this.x + BLOCK_SIZE, this.y + BLOCK_SIZE/2);
        }
        
        this.drawer.fill(path, this.z);
        
        this.drawer.fillStyle = `rgba(0, 0, 0, ${DARKEN})`;
        this.drawer.fillRect(this.x, this.y + BLOCK_SIZE * 4/5, this.z, BLOCK_SIZE, BLOCK_SIZE/5);
    }
    
    special(player, objects) {
        player.dx = Math.min(0.5, player.dx);
        player.dy = Math.max(0, player.dy);
        
        const x = (player.x / BLOCK_SIZE < 0 ? ~~(player.x / BLOCK_SIZE) - 1 : ~~(player.x / BLOCK_SIZE)) * BLOCK_SIZE;
        const y = (player.y / BLOCK_SIZE < 0 ? ~~(player.y / BLOCK_SIZE) - 1 : ~~(player.y / BLOCK_SIZE)) * BLOCK_SIZE;
        
        player.x = x;
        player.y = y - 1;
        player.z += this.state;
        
        objects.push(new RegBlock(x, y + BLOCK_SIZE, player.z, player.team, player.drawer));
    }
    
    changeState() {
        this.state *= -1;
    }
    
    get blocktype() {
        return 'shiftblock';
    }
    
    static render(_x, _y, z, size, color, drawer) {
        const x = _x - size/2;
        const y = _y - size/2;
        const ratio = size/BLOCK_SIZE;
        
        drawer.fillStyle = color;
        drawer.fillRect(x, y + BLOCK_SIZE * 4/5 * ratio, BLOCK_SIZE * ratio, z, BLOCK_SIZE/5 * ratio);
        
        const path = new Path2D();
        path.moveTo(x + BLOCK_SIZE/2 * ratio, y);
        path.lineTo(x, y + BLOCK_SIZE/2 * ratio);
        path.lineTo(x + BLOCK_SIZE/3 * ratio, y + BLOCK_SIZE/2 * ratio);
        path.lineTo(x + BLOCK_SIZE/3 * ratio, y + BLOCK_SIZE * ratio);
        path.lineTo(x + BLOCK_SIZE * 2/3 * ratio, y + BLOCK_SIZE * ratio);
        path.lineTo(x + BLOCK_SIZE * 2/3 * ratio, y + BLOCK_SIZE/2 * ratio);
        path.lineTo(x + BLOCK_SIZE * ratio, y + BLOCK_SIZE/2 * ratio);
        
        drawer.fill(path, z);
        
        drawer.fillStyle = `rgba(0, 0, 0, ${DARKEN})`;
        drawer.fillRect(x, y + BLOCK_SIZE * 4/5 * ratio, z, BLOCK_SIZE * ratio, BLOCK_SIZE/5 * ratio);
    }
}

class RailBlock extends Block {
    constructor(x, y, z, team, drawer) {
        super(x, y, z, 5, new Rectangle(x, y, BLOCK_SIZE, BLOCK_SIZE), team, drawer);
        this.transparent = true;
        
        this.state = 0;
    }
    
    special(player) {
        if (this.state == 0) {
            player.dx = Math.sign(player.dx) * RAIL_ACC;
        } else {
            player.dy = -RAIL_ACC;
        }
    }
    
    changeState() {
        this.state += 1;
        this.state %= 2;
    }
    
    render() {
        if (this.state == 0) {
            this.drawer.fillStyle = this.team;

            this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE/5);
            this.drawer.fillRect(this.x, this.y + BLOCK_SIZE * 4/5, this.z, BLOCK_SIZE, BLOCK_SIZE/5);

            this.drawer.strokeStyle = `rgba(0, 0, 0, ${DARKEN})`;

            this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE, BLOCK_SIZE/5);
            this.drawer.fillRect(this.x, this.y + BLOCK_SIZE * 4/5, this.z, BLOCK_SIZE, BLOCK_SIZE/5);
        } else {
            this.drawer.fillStyle = this.team;

            this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE/5, BLOCK_SIZE);
            this.drawer.fillRect(this.x + BLOCK_SIZE * 4/5, this.y, this.z, BLOCK_SIZE/5, BLOCK_SIZE);

            this.drawer.strokeStyle = `rgba(0, 0, 0, ${DARKEN})`;

            this.drawer.fillRect(this.x, this.y, this.z, BLOCK_SIZE/5, BLOCK_SIZE);
            this.drawer.fillRect(this.x + BLOCK_SIZE * 4/5, this.y, this.z, BLOCK_SIZE/5, BLOCK_SIZE);
        }
    }
    
    get blocktype() {
        return 'railblock';
    }
    
    static render(_x, _y, z, size, color, drawer) {
        const x = _x - size/2;
        const y = _y - size/2;
        
        const ratio = size/BLOCK_SIZE;
        
        drawer.fillStyle = color;
        
        drawer.fillRect(x, y, z, BLOCK_SIZE * ratio, BLOCK_SIZE/5 * ratio);
        drawer.fillRect(x, y + BLOCK_SIZE * 4/5 * ratio, z, BLOCK_SIZE * ratio, BLOCK_SIZE/5 * ratio);
        
        drawer.strokeStyle = `rgba(0, 0, 0, ${DARKEN})`;
        
        drawer.fillRect(x, y, z, BLOCK_SIZE * ratio, BLOCK_SIZE/5 * ratio);
        drawer.fillRect(x, y + BLOCK_SIZE * 4/5 * ratio, z, BLOCK_SIZE * ratio, BLOCK_SIZE/5 * ratio);
    }
}

class UnbreakableBlock extends RegBlock {
    constructor(x, y, z, team, drawer) {
        super(x, y, z, team, drawer);
        this.health = Infinity;
    }
}

module.exports = {
    Block: Block,
    RegBlock: RegBlock,
    GemBlock: GemBlock,
    BronzeGenerator: BronzeGenerator,
    GoldGenerator: GoldGenerator,
    ShiftBlock: ShiftBlock,
    RailBlock: RailBlock,
    UnbreakableBlock: UnbreakableBlock
};