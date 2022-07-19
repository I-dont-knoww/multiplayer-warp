function regblock(x, y, z, size, color, drawer) {
    drawer.fillStyle = color;
    drawer.fillRect(x - size/2, y - size/2, z, size, size);

    drawer.strokeStyle = `rgba(0, 0, 0, ${DARKEN})`;
    drawer.ctx.lineWidth = BORDER_WIDTH * size/BLOCK_SIZE;
    drawer.strokeRect(x + drawer.ctx.lineWidth/2 - size/2, y + drawer.ctx.lineWidth/2 - size/2, z, size - drawer.ctx.lineWidth, size - drawer.ctx.lineWidth);
}

function shiftblock(_x, _y, z, size, color, drawer) {
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

function railblock(_x, _y, z, size, color, drawer) {
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

function pickaxe(x, y, z, size, team, drawer) {
    size /= 1.5;

    const path = new Path2D();
    path.moveTo(Math.cos(Math.PI * 1/6) * size + x, Math.sin(Math.PI * 1/6) * size + y);
    for (let i = 0; i < 3; i++) {
        path.lineTo(Math.cos(Math.PI * 1/6 + Math.PI * (i + 1) * 2/3) * size + x, Math.sin(Math.PI * 1/6 + Math.PI * (i + 1) * 2/3) * size + y);
    }

    drawer.fill(path, z);
}

function starterpickaxe(x, y, z, size, team, drawer) {
    drawer.fillStyle = '#ffff00';
    pickaxe(x, y, z, size, team, drawer);
}

function betterpickaxe(x, y, z, size, team, drawer) {
    drawer.fillStyle = '#00ff00';
    pickaxe(x, y, z, size, team, drawer);
}

function stick(x, y, z, size, team, drawer) {
    const direction = -Math.PI/2;

    const path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x + Math.cos(direction) * 3 * BLOCK_SIZE * 2/3, y + Math.sin(direction) * 3 * BLOCK_SIZE * 2/3);

    drawer.strokeStyle = team;
    drawer.ctx.lineWidth = 10;
    drawer.stroke(path, z);
}

function sword(x, y, z, size, team, drawer) {
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