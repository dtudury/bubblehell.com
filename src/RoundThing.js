
import Thing from "./Thing.js";

export default class RoundThing extends Thing {
    constructor (t, r, x, y, dx, dy, ddx, ddy = 0.00001, color = "black") {
        t = t === undefined ? Date.now() : t;
        super(t, x, y, dx, dy, ddx, ddy);
        this.r = r;
        this.color = color;
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

    clone_at_t(t) {
        let c = super.clone_at_t(t);
        return new RoundThing(t, this.r, c.x, c.y, c.dx, c.dy, c.ddx, c.ddy, this.color);
    }

    static random(t, w, h, x, y) {
        t = t === undefined ? Date.now() : t;
        w = w === undefined ? 400 : w;
        h = h === undefined ? 300 : h;

        let r = Math.random() * 5 + 5;
        x = x === undefined ? Math.random() * (w - 2 * r) + r : x;
        y = y === undefined ? Math.random() * (h - 2 * r) + r : y;
        let angle = Math.random() * 2 * Math.PI;
        let speed = (Math.random() * 5 + 2) * 0.01;
        let dx = Math.cos(angle) * speed;
        let dy = Math.sin(angle) * speed;
        return new RoundThing(t, r, x, y, dx, dy);
    }
}
