class Drawer {
    constructor(ctx) {
        this.ctx = ctx;
        
        this._x = 0;
        this._y = 0;
        this.z = 0;
        
        this.zoom = 1;
    }
    
    get x() {
        return this._x;
    }
    
    set x(x) {
        this._x = Math.round(x - canvas.width/2);
    }
    
    get y() {
        return this._y;
    }
    
    set y(y) {
        this._y = Math.round(y - canvas.height/2);
    }
    
    get fillStyle() {
        return this.ctx.fillStyle;
    }
    
    set fillStyle(fillStyle) {
        this.ctx.fillStyle = fillStyle;
    }
    
    get strokeStyle() {
        return this.ctx.strokeStyle;
    }
    
    set strokeStyle(strokeStyle) {
        this.ctx.strokeStyle = strokeStyle;
    }
    
    rect(x, y, z, width, height) {
        if (z != this.z) return;
        if ((x - this._x < -100 || x - this._x > canvas.width + 100) && (y - this._y < -100 || y - this._y > canvas.height + 100))
        
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.rect(x - this._x, y - this._y, width, height);
        this.ctx.scale(1/this.zoom, 1/this.zoom);
    }
    
    fillRect(x, y, z, width, height) {
        if (z != this.z) return;
        
        this.ctx.beginPath();
        this.rect(x, y, z, width, height);
        this.ctx.fill();
    }
    
    strokeRect(x, y, z, width, height) {
        if (z != this.z) return;
        
        this.ctx.beginPath();
        this.rect(x, y, z, width, height);
        this.ctx.stroke();
    }
    
    arc(x, y, z, radius, startAngle, endAngle) {
        if (z != this.z) return;
        
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.arc(x - this._x, y - this._y, radius, startAngle, endAngle);
        this.ctx.scale(1/this.zoom, 1/this.zoom);
    }
    
    moveTo(x, y, z) {
        if (z != this.z) return;
        
        this.ctx.moveTo(x - this._x, y - this._y);
    }
    
    lineTo(x, y, z) {
        if (z != this.z) return;
        
        this.ctx.lineTo(x - this._x, y - this._y);
    }
    
    fillText(text, x, y, z) {
        if (z != this.z) return;
        
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this._x, -this._y);
        this.ctx.fillText(text, x, y);
        this.ctx.translate(this._x, this._y);
        this.ctx.scale(1/this.zoom, 1/this.zoom);
    }
    
    fill(path, z) {
        if (z != this.z) return;
        
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this._x, -this._y);
        this.ctx.fill(path);
        this.ctx.translate(this._x, this._y);
        this.ctx.scale(1/this.zoom, 1/this.zoom);
    }
    
    stroke(path, z) {
        if (z != this.z) return;
        
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(-this._x, -this._y);
        this.ctx.stroke(path);
        this.ctx.translate(this._x, this._y);
        this.ctx.scale(1/this.zoom, 1/this.zoom);
    }
    
    renderGameState(gameState) {
        for (let i in gameState.players) {
            gameState.players[i].drawer = this;
            gameState.players[i].render = new Function(...gameState.players[i].clientArgs, gameState.players[i].clientRender);
            gameState.players[i].render();
        }
        for (let i in gameState.objects) {
            gameState.objects[i].drawer = this;
            gameState.objects[i].render = new Function(...gameState.objects[i].clientArgs, gameState.objects[i].clientRender);
            gameState.objects[i].render();
        }
    }
}