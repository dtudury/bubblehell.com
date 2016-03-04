
import QuadTree from "./QuadTree";
import {solve} from "./EquationSolver";
import Point from "./Point";
import Line from "./Line";
import * as Overlaps from "./Overlaps.js";

let _collisions_by_things = new Map();

function points_to_lines(points) {
    let lines = [];
    points.forEach((p1, i1) => {
        let i2 = (i1 + 1) % points.length;
        let p2 = points[i2];
        lines.push(new Line(p1, p2));
    });
    return lines;
}

let box = [
    {x:  -0.1, y:  -0.1},
    {x: 400.1, y:  -0.1},
    {x: 400.1, y: 300.1},
    {x:  -0.1, y: 300.1}
];
box = points_to_lines(box);
let diamond = [
    {x: 200, y: -50},
    {x: 400, y: 150},
    {x: 200, y: 350},
    {x:   0, y: 150}
];
diamond = points_to_lines(diamond);

function predict_collisions(thing, shape) {
    var collisions = [];
    shape.forEach(line => {
        let n = Point.normalize(Line.get_normals(line)[0]);
        let n_dot_p = Point.dot(n, new Point(thing.x - line.p1.x, thing.y - line.p1.y));
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

function predict_collisions2(thing, shape) {
    var collisions = [];
    shape.forEach(line => {
        let n = Point.normalize(Line.get_normals(line)[0]);
        let n_dot_p = Point.dot(n, new Point(thing.x - line.p1.x, thing.y - line.p1.y));
        //if (n_dot_p < 0) return;
        
        let ddz = Point.dot(n, new Point(thing.ddx, thing.ddy)) / 2;
        let dz = Point.dot(n, new Point(thing.dx, thing.dy));
        let dts = [].concat(
            solve([ddz, dz, n_dot_p - thing.r]),
            solve([ddz, dz, n_dot_p + thing.r]));
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

function predict_quad_collisions(thing) {
    var collisions = [];
    thing.quads_set.forEach(quad => {
        let shape = points_to_lines(quad.points);
        let naive_collisions = predict_collisions2(thing, shape);
        naive_collisions.forEach(c => delete c.normal);
        collisions = collisions.concat(naive_collisions);
    });
    return collisions;
}

function _predict_all_collisions(thing) {
    let room_collisions = predict_collisions(thing, box);
    let diamond_collisions = predict_collisions(thing, diamond);
    let quad_collisions = predict_quad_collisions(thing);
    return [].concat(room_collisions, diamond_collisions, quad_collisions);
}

export default class MovingThings extends QuadTree {
    constructor (t, x = 0, y = 0, width = 400, height = 300, capacity = 2, max_levels = 5) {
        super (x, y, Math.max(width, height), capacity, max_levels);
        this.t = t === undefined ? Date.now() : t;
        this.court_width = width;
        this.court_height = height;
        this.collisions = [];
    }

    get_things_at_t (t) {
        while (this.collisions.length && this.collisions[0].t < t) {
            let next_collision = this.collisions.shift();
            let n = next_collision.normal;
            this.remove(next_collision.thing);
            let thing = next_collision.thing.clone_at_t(next_collision.t);
            if (n) {
                let v = new Point(thing.dx, thing.dy);
                let v_dot_n = Point.dot(v, n);
                let r = Point.add(Point.scale(n, v_dot_n * -2), v);
                thing.dy = r.y;
                thing.dx = r.x;
            }
            super.add(thing);
            if (this.thing === next_collision.thing) 
                this.thing = thing;
            this.collisions = this.collisions.filter(collision => {
                return collision.thing !== next_collision.thing;
            });
            let all_collisions = _predict_all_collisions(thing);
            all_collisions = all_collisions.filter(collision => {
                return collision.t > next_collision.t;
            });
            this.collisions = this.collisions.concat(all_collisions);
            this.collisions.sort((a,b) => a.t - b.t);
        }
        this.t = t;
        /*
        let temp = Array.from(this.all_things);
        temp.forEach(thing => this.remove(thing));
        this.collisions = [];
        temp.forEach(thing => this.add(thing.clone_at_t(t)));
        */
        return Array.from(this.all_things).map(thing => thing.clone_at_t(t));
    }

    add (thing) {
        if (!super.add(thing)) return false;
        let all_collisions = _predict_all_collisions(thing);
        this.collisions = this.collisions.concat(all_collisions);
        this.collisions.sort((a,b) => a.t - b.t);
        return true;
    }

    get_thing_at_t (x, y, t) {
        let p = {x:x, y:y};
        let found_thing = null;
        if (!Overlaps.quad_and_point(this, p)) return null;
        if (this.my_things) {
            this.my_things.forEach(thing => {
                let thing_now = thing.clone_at_t(t);
                if (Overlaps.circle_and_point(thing_now, p)) found_thing = thing;
            });
            return found_thing;
        }
        this.children.forEach(child => found_thing = found_thing || child.get_thing_at(x, y));
        return found_thing;
    }
}
