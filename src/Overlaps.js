import Point from "./Point.js";

export function quad_and_quad(a, b) {
    return  a.left      <= b.right && 
            a.right     >= b.left &&
            a.top       <= b.bottom &&
            a.bottom    >= b.top;
}

export function quad_and_point(q, p) {
    return  p.x >= q.left &&
            p.x <= q.right &&
            p.y >= q.top &&
            p.y <= q.bottom;
}

export function quad_and_circle(q, c) {
    if (quad_and_quad(q, c)) return true;
    if (c.x > q.left && c.x < q.right)
        return c.y + c.r >= q.top && c.y - c.r <= q.bottom;
    if (c.y > q.top && c.y <= q.bottom)
        return c.x + c.r >= q.left && c.x - c.r <= q.right;
    let r2 = Math.pow(c.r, 2);
    return  Point.distance_squared(c, q.tl) <= r2 ||
            Point.distance_squared(c, q.tr) <= r2 ||
            Point.distance_squared(c, q.bl) <= r2 ||
            Point.distance_squared(c, q.br) <= r2;
}

export function circle_and_circle(a, b) {
    return Point.distance_squared(a, b) <= Math.pow(a.r + b.r, 2);
}

export function circle_and_point(c, p) {
    return Point.distance_squared(c, p) <= Math.pow(c.r, 2);
}
