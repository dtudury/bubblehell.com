
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

    static overlaps(a, b) {
        return a.left < b.right && 
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top;
    }
}
