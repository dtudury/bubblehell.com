
export default class Thing {
    constructor(t, x = 0, y = 0, dx = 0, dy = 0, ddx = 0, ddy = 0) {
        this.t = t === undefined ? Date.now() : t;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.ddx = ddx;
        this.ddy = ddy;
        this.quads_set = new Set();
    }

    clone_at_t(t) {
        let dt = t - this.t;
        let dt2 = dt * dt;
        return new Thing(
                t,
                this.x + dt * this.dx + dt2 * this.ddx / 2,
                this.y + dt * this.dy + dt2 * this.ddy / 2,
                this.dx + dt * this.ddx,
                this.dy + dt * this.ddy,
                this.ddx,
                this.ddy
        );

    }

    touch () {
        if (this.touched) return;

        let color_cycle = [
            "red",
            "orange",
            "yellow",
            "lime",
            "aqua",
            "blue",
            "fuchsia"
        ];

        if (this.color_index === undefined) {
            this.color_index = Math.floor(Math.random() * color_cycle.length);
        } else {
            this.color_index += 3;
            this.color_index %= color_cycle.length;
        }
        this.color = color_cycle[this.color_index];
        this.touched = true;
    }
    
    untouch () {
        this.touched = false;
    }
}
