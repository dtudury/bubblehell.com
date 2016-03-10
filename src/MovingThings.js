
import QuadTree from "./QuadTree";
import {points_to_lines, predict_collisions, predict_quad_collisions} from "./CollisionSolver";
import Point from "./Point";
import * as Overlaps from "./Overlaps.js";

let _collisions_by_things = new Map();

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

function _predict_all_collisions(thing) {
    let room_collisions = predict_collisions(thing, box, false, false);
    let diamond_collisions = predict_collisions(thing, diamond, false, false);
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
