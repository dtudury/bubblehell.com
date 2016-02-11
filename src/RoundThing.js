
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
}
