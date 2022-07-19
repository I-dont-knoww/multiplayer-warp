class Collision {
    static collide(obj1, obj2) {
        if (Collision[obj1.type + obj2.type] == null) {
            if (Collision[obj2.type + obj1.type] == null) throw 'unknown collision';
            return Collision[obj2.type + obj1.type](obj2, obj1);
        }
        return Collision[obj1.type + obj2.type](obj1, obj2);
    }
    
    static pointpoint(p1, p2) {
        return p1.x == p2.x && p1.y == p2.y;
    }
    
    static pointcircle(p, c) {
        return (p.x - c.x) ** 2 + (p.y - c.y) ** 2 <= c.r ** 2;
    }
    
    static circlecircle(c1, c2) {
        return (c2.x - c1.x) ** 2 + (c2.y - c1.y) ** 2 <= (c1.r + c2.r) ** 2;
    }
    
    static rectpoint(r, p) {
        return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    }
    
    static rectrect(r1, r2) {
        return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.y && r1.y <= r2.y + r2.h
    }
    
    static rectcircle(r, c) {
        const closestX = Math.max(r.x, Math.min(r.x + r.w, c.x));
        const closestY = Math.max(r.y, Math.min(r.y + r.h, c.y));
        
        return (closestX - c.x) ** 2 + (closestY - c.y) ** 2 <= c.r ** 2;
    }
    
    static linepoint(l, p) {
        const m1 = (l.y2 - l.y1)/(l.x2 - l.x1);
        const m2 = (l.x2 - l.x1)/(l.y2 - l.y1);
        
    }
    
    static lineline(l1, l2) {
        const x1 = l1.x1;
        const y1 = l1.y1;
        const x2 = l1.x2;
        const y2 = l1.y2;
        
        const x3 = l2.x1;
        const y3 = l2.y1;
        const x4 = l2.x2;
        const y4 = l2.y2;
        
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            return true;
//            return [x1 + (uA * (x2 - x1)), y1 + (uA * (y2 - y1))];
        } else return false;
    }
    
    static linerect(l, r) {
        const left = Collision.lineline(l, new Line(r.x, r.y, r.x, r.y + r.h));
        const right = Collision.lineline(l, new Line(r.x + r.w, r.y, r.x + r.w, r.y + r.h));
        const top = Collision.lineline(l, new Line(r.x, r.y, r.x + r.w, r.y));
        const bottom = Collision.lineline(l, new Line(r.x, r.y + r.h, r.x + r.w, r.y + r.h));
        
        return left || right || top || bottom;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.center = {
            x: x,
            y: y
        };
        
        this.type = 'point';
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        
        this.x2 = x2;
        this.y2 = y2;
        
        this.center = {
            x: (x1 + x2)/2,
            y: (y1 + y2)/2
        };
        
        this.type = 'line';
    }
}

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        
        this.w = width;
        this.h = height;
        
        this.center = {
            x: x + width/2,
            y: y + height/2
        };
        
        this.type = 'rect';
    }
}

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        
        this.r = radius;
        
        this.center = {
            x: x,
            y: y
        };
        
        this.type = 'circle';
    }
}

module.exports = {
    Collision: Collision,
    Line: Line,
    Rectangle: Rectangle,
    Circle: Circle
};