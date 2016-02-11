
import Point from "./Point.js";

export default class Quad {
    constructor (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get left () {
        return this.x;
    }

    get top () {
        return this.y;
    }

    get right () {
        return this.x + this.width;
    }

    get bottom () {
        return this.y + this.height;
    }

    get tl () {
        return new Point(this.left, this.top);
    }

    get tr () {
        return new Point(this.right, this.top);
    }

    get bl () {
        return new Point(this.left, this.bottom);
    }

    get br () {
        return new Point(this.right, this.bottom);
    }

    overlaps(quad) {
        return Quad.overlaps(this, quad);
    }

    overlaps_point(p) {
        return Quad.overlaps_point(this, p);
    }

    static overlaps(a, b) {
        return a.left < b.right && 
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top;
    }

    static overlaps_point(q, p) {
        return p.x > q.left &&
            p.x < q.right &&
            p.y > q.top &&
            p.y < q.bottom;
    }
}
