class BlockTool {
    constructor(block, num) {
        this.blocktype = block;
        this.type = 'block';
        
        this.num = num;
        
        this.render = (x, y, z, size, team, drawer) => {
            (new Function(`return ${this.clientBlock}`))()(x, y, z, size, team, drawer);
            
            drawer.fillStyle = '#000000';
            drawer.ctx.font = '10px sans-serif';
            drawer.ctx.textAlign = 'center';
            drawer.ctx.textBaseline = 'middle';
            drawer.fillText(this.num, x, y, z);
        }
    }
    
    static type() {
        return 'block';
    }
    
    static addItem(player, block, num) {
        for (let i in player.tools) {
            if (player.tools[i].type != 'block') continue;
            if (player.tools[i].blocktype == block) {
                player.tools[i].num += num;
                return;
            }
        }
        player.tools.push(new BlockTool(block, num));
    }
}

class Pickaxe {
    constructor(hardness, color) {
        this.hardness = hardness;
        this.type = 'pick';
        
        this.color = color;
    }
    
    render(x, y, z, size, team, drawer) {
        size /= 1.5;
        
        const path = new Path2D();
        path.moveTo(Math.cos(Math.PI * 1/6) * size + x, Math.sin(Math.PI * 1/6) * size + y);
        for (let i = 0; i < 3; i++) {
            path.lineTo(Math.cos(Math.PI * 1/6 + Math.PI * (i + 1) * 2/3) * size + x, Math.sin(Math.PI * 1/6 + Math.PI * (i + 1) * 2/3) * size + y);
        }
        
        drawer.fillStyle = this.color;
        drawer.fill(path, z);
    }
    
    static type() {
        return 'pick';
    }
    
    static render(x, y, z, size, team, drawer) {
        size /= 1.5;
        
        const path = new Path2D();
        path.moveTo(Math.cos(Math.PI * 1/6) * size + x, Math.sin(Math.PI * 1/6) * size + y);
        for (let i = 0; i < 3; i++) {
            path.lineTo(Math.cos(Math.PI * 1/6 + Math.PI * (i + 1) * 2/3) * size + x, Math.sin(Math.PI * 1/6 + Math.PI * (i + 1) * 2/3) * size + y);
        }
        
        drawer.fill(path, z);
    }
}

class StarterPickaxe extends Pickaxe {
    constructor() {
        super(1, '#ffff00');
    }
    
    static render(x, y, z, size, team, drawer) {
        drawer.fillStyle = '#ffff00';
        Pickaxe.render(x, y, z, size, team, drawer);
    }
}

class BetterPickaxe extends Pickaxe {
    constructor() {
        super(2, '#00ff00');
    }
    
    static render(x, y, z, size, team, drawer) {
        drawer.fillStyle = '#00ff00';
        Pickaxe.render(x, y, z, size, team, drawer);
    }
}

class Weapon {
    constructor(damage, knockback, range, speed, team) {
        this.damage = damage;
        this.kb = knockback;
        this.range = range;
        this.speed = speed;
        
        this.type = 'weapon';
        this.timer = 0;
        this.resetting = false;
        
        this.team = team;
    }
    
    static type() {
        return 'weapon';
    }
    
    render(x, y, z, size, team, drawer) {
        throw 'no render function for weapon';
    }
}

class Stick extends Weapon {
    constructor(team) {
        super(5, 1, 3, 10);
    }
    
    render(_x, y, z, size, team, drawer, dir) {
        const x = _x - dir * BLOCK_SIZE/10;
        
        const direction = this.timer <= this.speed/3 ? -Math.PI/2 : -Math.PI/2 + (this.speed - this.timer)/(this.speed/2) * Math.PI/2 * dir;
        
        const path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(x + Math.cos(direction) * this.range * BLOCK_SIZE * 2/3, y + Math.sin(direction) * this.range * BLOCK_SIZE * 2/3);
        
        drawer.strokeStyle = team;
        drawer.ctx.lineWidth = 10;
        drawer.stroke(path, z);
    }
    
    static render(x, y, z, size, team, drawer) {
        const direction = -Math.PI/2;
        
        const path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(x + Math.cos(direction) * 3 * BLOCK_SIZE * 2/3, y + Math.sin(direction) * 3 * BLOCK_SIZE * 2/3);
        
        drawer.strokeStyle = team;
        drawer.ctx.lineWidth = 10;
        drawer.stroke(path, z);
    }
}

class Sword extends Weapon {
    constructor(team) {
        super(20, 2, 4, 10);
    }
    
    render(_x, y, z, size, team, drawer, dir) {
        if (this.timer > 0) this.timer--;
        
        const x = _x - dir * BLOCK_SIZE/10;
        
        const direction = this.timer <= this.speed/3 ? -Math.PI/2 : -Math.PI/2 + (this.speed - this.timer)/(this.speed/2) * Math.PI/2 * dir;
        
        const path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(x + Math.cos(direction) * this.range * BLOCK_SIZE * 2/3, y + Math.sin(direction) * this.range * BLOCK_SIZE * 2/3);
        path.moveTo(x + Math.cos(direction - 0.5) * this.range * BLOCK_SIZE * 3/10, y + Math.sin(direction - 0.5) * this.range * BLOCK_SIZE * 3/10);
        path.lineTo(x + Math.cos(direction + 0.5) * this.range * BLOCK_SIZE * 3/10, y + Math.sin(direction + 0.5) * this.range * BLOCK_SIZE * 3/10);
        
        const point = new Path2D();
        point.moveTo(x + Math.cos(direction - 0.1) * this.range * BLOCK_SIZE * 2/3, y + Math.sin(direction - 0.1) * this.range * BLOCK_SIZE * 2/3);
        point.lineTo(x + Math.cos(direction) * this.range * BLOCK_SIZE * 3/4, y + Math.sin(direction) * this.range * BLOCK_SIZE * 3/4);
        point.moveTo(x + Math.cos(direction + 0.1) * this.range * BLOCK_SIZE * 2/3, y + Math.sin(direction + 0.1) * this.range * BLOCK_SIZE * 2/3);
        
        drawer.strokeStyle = team;
        drawer.ctx.lineWidth = 10;
        drawer.stroke(path, z);
        
        drawer.fillStyle = team;
        drawer.fill(point, z);
    }
    
    static render(x, y, z, size, team, drawer) {
        const direction = -Math.PI/2;
        
        const path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(x + Math.cos(direction) * 4 * BLOCK_SIZE * 2/3, y + Math.sin(direction) * 4 * BLOCK_SIZE * 2/3);
        path.moveTo(x + Math.cos(direction - 0.5) * 4 * BLOCK_SIZE * 3/10, y + Math.sin(direction - 0.5) * 4 * BLOCK_SIZE * 3/10);
        path.lineTo(x + Math.cos(direction + 0.5) * 4 * BLOCK_SIZE * 3/10, y + Math.sin(direction + 0.5) * 4 * BLOCK_SIZE * 3/10);
        
        
        const point = new Path2D();
        point.moveTo(x + Math.cos(direction - 0.1) * 4 * BLOCK_SIZE * 2/3, y + Math.sin(direction - 0.1) * 4 * BLOCK_SIZE * 2/3);
        point.lineTo(x + Math.cos(direction) * 4 * BLOCK_SIZE * 3/4, y + Math.sin(direction) * 4 * BLOCK_SIZE * 3/4);
        point.moveTo(x + Math.cos(direction + 0.1) * 4 * BLOCK_SIZE * 2/3, y + Math.sin(direction + 0.1) * 4 * BLOCK_SIZE * 2/3);
        
        drawer.strokeStyle = team;
        drawer.ctx.lineWidth = 10;
        drawer.stroke(path, z);
        
        drawer.fillStyle = team;
        drawer.fill(point, z);
    }
}


function addItem(player, item, amount) {
    if (!item.type) BlockTool.addItem(player, item, amount);
    else if (item.type() == 'pick') {
        for (let i in player.tools) {
            if (player.tools[i].type == 'pick') {
                player.tools.splice(i, 1);
                break;
            }
        }
        player.tools.push(new item());
    } else if (item.type() == 'weapon') {
        for (let i in player.tools) {
            if (player.tools[i].type == 'weapon') {
                player.tools.splice(i, 1);
                break;
            }
        }
        player.tools.push(new item());
    }
}

module.exports = {
    BlockTool: BlockTool,
    StarterPickaxe: StarterPickaxe,
    BetterPickaxe: BetterPickaxe,
    Stick: Stick,
    Sword: Sword,
    addItem: addItem
};