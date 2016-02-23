
import QuadTree from "./QuadTree";
import {solve} from "./EquationSolver";

function _predict_wall_collisions(thing) {
    let collisions = [];
    let walls = [
        {name: "left wall", type:"vertical_wall", x:0, side:1},
        {name: "right wall", type:"vertical_wall", x:400, side:-1},
        {name: "roof", type:"horizontal_wall", y:0, side:1},
        {name: "floor", type:"horizontal_wall", y:300, side:-1}
    ];
    walls.forEach(wall => {
        let coefficients;
        if (wall.type == "horizontal_wall") {
            coefficients = [thing.ddy / 2, thing.dy, thing.y - wall.y - wall.side * thing.r];
        } else if (wall.type == "vertical_wall") {
            coefficients = [thing.ddx / 2, thing.dx, thing.x - wall.x - wall.side * thing.r];
        }
        let dts = solve(coefficients);
        dts.forEach(dt => {
            if (dt <= 0) return;
            collisions.push({
                thing: thing,
                type: wall.type,
                t: thing.t + dt
            });
        });
    });
    return collisions;
}

export default class MovingThings extends QuadTree {
    constructor (t, x = 0, y = 0, width = 400, height = 300, capacity = 2, max_levels = 8) {
        super (x, y, Math.max(width, height), capacity, max_levels);
        this.t = t === undefined ? Date.now() : t;
        this.court_width = width;
        this.court_height = height;
        this.collisions = [];
    }

    get_things_at_t (t) {
        while (this.collisions.length && this.collisions[0].t < t) {
            let next_collision = this.collisions.shift();
            let thing;
            if (next_collision.type === "horizontal_wall") {
                this.remove(next_collision.thing);
                thing = next_collision.thing.clone_at_t(next_collision.t);
                thing.dy *= -1;
                super.add(thing);
            } else if (next_collision.type === "vertical_wall") {
                this.remove(next_collision.thing);
                thing = next_collision.thing.clone_at_t(next_collision.t);
                thing.dx *= -1;
                super.add(thing);
            }
            this.collisions = this.collisions.filter(collision => {
                return collision.thing !== next_collision.thing
            });
            let wall_collisions = _predict_wall_collisions(thing);
            wall_collisions = wall_collisions.filter(collision => {
                return collision.t > next_collision.t + 0.000001;
            });
            this.collisions = this.collisions.concat(wall_collisions);
            this.collisions.sort((a,b) => a.t - b.t);
        }
        this.t = t;
        return Array.from(this.things_set).map(member => member.clone_at_t(t));
    }

    predict_collisions () {
        /*
        this.collisions = [];
        this.things_set.forEach(thing => {
            let wall_collisions = _predict_wall_collisions(thing);
            this.collisions = this.collisions.concat(wall_collisions);
        });
        this.collisions.sort((a,b) => a.t - b.t);
        */
    }

    add (thing) {
        if (!super.add(thing)) return;
        let wall_collisions = _predict_wall_collisions(thing);
        this.collisions = this.collisions.concat(wall_collisions);
        this.collisions.sort((a,b) => a.t - b.t);
    }
}
