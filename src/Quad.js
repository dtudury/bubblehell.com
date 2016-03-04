
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

    get points () {
        return [this.tl, this.tr, this.br, this.bl];
    }
}
