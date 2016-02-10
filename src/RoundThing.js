
import Quad from "./Quad.js";
import Point from "./Point.js";

export default class RoundThing {
    constructor (r, x, y, dx = 0, dy = 0, ax = 0, ay = 0) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.ax = ax;
        this.ay = ay;
    }

    get left () {
        return this.x - this.r;
    }

    get top () {
        return this.y - this.r;
    }

    get right () {
        return this.x + this.r;
    }

    get bottom () {
        return this.y + this.r;
    }

    overlaps(quad) {
        return Quad.overlaps(this, quad) &&
            RoundThing.overlaps_circle_and_square(this, quad);
    }

    static overlaps_circle_and_square(c, s) {
        if (c.x > s.left && c.x < s.right)
            return c.y + c.r > s.top && c.y - c.r < s.bottom;
        if (c.y > s.top && c.y < s.bottom)
            return c.x + c.r > s.left && c.x - c.r < s.right;
        let r2 = Math.pow(c.r);
        return Point.distance_squared(c, s.tl) < r2 ||
            Point.distance_squared(c, s.tr) < r2 ||
            Point.distance_squared(c, s.bl) < r2 ||
            Point.distance_squared(c, s.br) < r2;

    }

    static overlaps_circle_and_circle(c1, c2) {
        return Point.distance_squared(c1, c2) < Math.pow(c1.r + c2.r, 2);
    }
}
