
import QuadTree from "./QuadTree";
import {solve} from "./EquationSolver";
import Point from "./Point";

let _collisions_by_things = new Map();

let room = [
    {x:   0, y:   0},
    {x: 400, y:   0},
    {x: 400, y: 300},
    {x:   0, y: 300}
];
let diamond = [
    {x: 200, y: -50},
    {x: 400, y: 150},
    {x: 200, y: 350},
    {x:   0, y: 150}
];

function get_normals (p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return [
        {x: -dy, y:  dx},
        {x:  dy, y: -dx}
    ];
}

function predict_collisions(thing, shape) {
    var collisions = [];
    shape.forEach((p1, i1) => {
        let i2 = (i1 + 1) % shape.length;
        let p2 = shape[i2];
        let n = Point.normalize(get_normals(p1, p2)[0]);
        let n_dot_p = Point.dot(n, new Point(thing.x - p1.x, thing.y - p1.y));
        if (n_dot_p < 0) return;
        
        let coefficients = [
            Point.dot(n, new Point(thing.ddx, thing.ddy)) / 2,
            Point.dot(n, new Point(thing.dx, thing.dy)),
            n_dot_p - thing.r
        ];
        let dts = solve(coefficients);
        dts.forEach(dt => {
            if (dt <= 0) return;
            collisions.push({
                thing: thing,
                normal: n,
                t: thing.t + dt
            });
        });
    });
    return collisions;
}

function _predict_wall_collisions(thing) {
    let room_collisions = predict_collisions(thing, room);
    let diamond_collisions = predict_collisions(thing, diamond);
    return room_collisions.concat(diamond_collisions);
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
            this.remove(next_collision.thing);
            let thing = next_collision.thing.clone_at_t(next_collision.t);
            let v = new Point(thing.dx, thing.dy);
            let n = next_collision.normal;
            let v_dot_n = Point.dot(v, n);
            let r = Point.add(Point.scale(n, v_dot_n * -2), v);
            thing.dy = r.y;
            thing.dx = r.x;
            super.add(thing);
            this.collisions = this.collisions.filter(collision => {
                return collision.thing !== next_collision.thing;
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

    add (thing) {
        if (!super.add(thing)) return false;
        let wall_collisions = _predict_wall_collisions(thing);
        this.collisions = this.collisions.concat(wall_collisions);
        this.collisions.sort((a,b) => a.t - b.t);
        return true;
    }
}
