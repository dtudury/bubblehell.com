
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
}
