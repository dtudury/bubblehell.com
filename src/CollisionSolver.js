
import {solve} from "./EquationSolver";
import Line from "./Line";
import Point from "./Point";

export function points_to_lines(points) {
    let lines = [];
    points.forEach((p1, i1) => {
        let i2 = (i1 + 1) % points.length;
        let p2 = points[i2];
        lines.push(new Line(p1, p2));
    });
    return lines;
}

export function predict_collisions(thing, shape, inside_only = false, enter_only = false) {
    var collisions = [];
    shape.forEach(line => {
        let n = Point.normalize(Line.get_normals(line)[0]);
        let n_dot_p = Point.dot(n, new Point(thing.x - line.p1.x, thing.y - line.p1.y));
        if (inside_only && n_dot_p < 0) return;
        
        let ddz = Point.dot(n, new Point(thing.ddx, thing.ddy)) / 2;
        let dz = Point.dot(n, new Point(thing.dx, thing.dy));
        let dts = solve([ddz, dz, n_dot_p - thing.r]);
        if (!enter_only) dts = dts.concat(solve([ddz, dz, n_dot_p + thing.r]));
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

export function predict_quad_collisions(thing) {
    var collisions = [];
    thing.quads_set.forEach(quad => {
        let shape = points_to_lines(quad.points);
        let naive_collisions = predict_collisions(thing, shape);
        naive_collisions.forEach(c => delete c.normal);
        collisions = collisions.concat(naive_collisions);
    });
    return collisions;
}
