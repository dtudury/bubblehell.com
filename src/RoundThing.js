
import Quad from "./Quad.js";
import Point from "./Point.js";
import Thing from "./Thing.js";

export default class RoundThing extends Thing {
    constructor (r, x, y, dx = 0, dy = 0, ax = 0, ay = 0) {
        super();
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

    overlaps_quad(quad) {
        return Quad.overlaps(this, quad) &&
            RoundThing.overlaps_circle_and_quad(this, quad);
    }
    
    overlaps_point(p) {
        return RoundThing.overlaps_circle_and_point(this, p);
    }

    static overlaps_circle_and_quad(c, q) {
        if (c.x > q.left && c.x < q.right)
            return c.y + c.r > q.top && c.y - c.r < q.bottom;
        if (c.y > q.top && c.y < q.bottom)
            return c.x + c.r > q.left && c.x - c.r < q.right;
        let r2 = Math.pow(c.r);
        return Point.distance_squared(c, q.tl) < r2 ||
            Point.distance_squared(c, q.tr) < r2 ||
            Point.distance_squared(c, q.bl) < r2 ||
            Point.distance_squared(c, q.br) < r2;

    }

    static overlaps_circle_and_circle(c1, c2) {
        return Point.distance_squared(c1, c2) < Math.pow(c1.r + c2.r, 2);
    }

    static overlaps_circle_and_point(c, p) {
        return Point.distance_squared(c, p) < Math.pow(c.r, 2);
    }
}
