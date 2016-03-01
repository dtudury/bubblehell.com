
export default class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    static distance (p1, p2) {
        return Math.sqrt(Point.distance_squared(p1, p2));
    }

    static distance_squared (p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    static normalize (p) {
        let length = Math.sqrt(p.x * p.x + p.y * p.y);
        return new Point(p.x / length, p.y / length);
    }

    static dot (p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
    }

    static scale (p, v) {
        return new Point(p.x * v, p.y * v);
    }

    static add (p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }

    static subtract (p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }
}
