
import Complex from "./Complex.js";
let C = Complex.convert;

let _sign = Math.sign || function (x) {
    return x && x > 0 ? 1 : -1;
};

let _sqrt3 = Math.sqrt(3);

function _cube_root(v) {
    return _sign(v) * Math.pow(Math.abs(v), 1/3);
}

function _linear(a, b, complex) {
    if (complex) return [C(-b / a)];
    else return [-b / a];
}

function _quadratic(a, b, c, complex) {
    // (-b +- sqrt(b^2 - 4ac)) / 2a
    let d = 2 * a;
    let e = b * b - 4 * a * c;
    let f = b / d;
    let g = Math.sqrt(Math.abs(e)) / d;
    if (complex) {
        if (e < 0) return [C(-f, g), C(-f, -g)];
        return [C(-f - g), C(-f + g)];
    } else {
        if (e < 0) return [];
        return [-f - g, -f + g];
    }
}

function _cubic(a, b, c, d, complex) {
    let a2 = a * a;
    let a3 = a2 * a;
    let b2 = b * b;
    let b3 = b2 * b;
    let f = (3 * c / a - b2 / a2) / 3;
    let g = (2 * b3 / a3 - 9 * b * c / a2 + 27 * d / a) / 27;
    let g2 = g * g;
    let h = g2 / 4 + f * f * f / 27;
    if (h > 0) {
        let h1_2 = Math.sqrt(h);
        let r = -g / 2 + h1_2;
        let s = _cube_root(r);
        let t = -g / 2 - h1_2;
        let u = _cube_root(t);
        if (complex) {
            let real = (s + u) / 2 - b / (3 * a);
            let imaginary = (s - u) * _sqrt3 / 2;
            return [
                C(s + u - b / (3 * a)),
                C(real, imaginary),
                C(real, -imaginary)
            ];
        } else {
            return [s + u - b / (3 * a)];
        }
    } else if (h === 0 && f === 0 && g === 0) {
        if (complex) return [C(-_cube_root(d / a))];
        else return [-_cube_root(d / a)];
    } else {
        let i = Math.sqrt(g2 / 4 - h);
        let j = _cube_root(i);
        let k = Math.acos(-g / (2 * i));
        let m = Math.cos(k / 3);
        let n = _sqrt3 * Math.sin(k / 3);
        let p = -b / (3 * a);
        if (complex) {
            return [
                C(-j * (m - n) + p),
                C(-j * (m + n) + p),
                C(2 * j * Math.cos(k / 3) - b / (3 * a))
            ];
        } else {
            return [
                -j * (m - n) + p,
                -j * (m + n) + p,
                2 * j * Math.cos(k / 3) - b / (3 * a)
            ];
        }
    }
}

function _quartic(a, b, c, d, e, complex) {
    b /= a;
    c /= a;
    d /= a;
    e /= a;
    let b2 = b * b;
    let f = c - 3 * b2 / 8;
    let b3 = b2 * b;
    let g = d + b3 / 8 - b * c / 2;
    let b4 = b3 * b;
    let h = e - 3 * b4 / 256 + b2 * c / 16 -b * d / 4;
    let y = _cubic(1, f/2, (f*f - 4*h) / 16, -g*g / 64, true);
    y.sort((a,b) => b.i - a.i || b.r - a.r);
    let p = y[0].sqrt();
    let q = y[1].sqrt();
    let r = C(-g).div(p.mul(q).mul(8));
    let s = C(b / 4);
    let x = [
        p.add(q).add(r).sub(s),
        p.sub(q).sub(r).sub(s),
        p.neg().add(q).sub(r).sub(s),
        p.neg().sub(q).add(r).sub(s)
    ];
    if (complex) {
        return x;
    } else {
        return x.filter(v => !v.i).map(v => v.r);
    }
}

function _solve(coefficients, complex = false) {
    let co = coefficients.slice();
    while (co.length && !co[0]) co.shift();
    let solutions = [];
    if (!co.length) return solutions;
    if (!co[co.length - 1]) {
        if (complex) solutions.push(C(0));
        else solutions.push(0);
        while (!co[co.length - 1]) co.pop();
    }
    if (co.length < 2) return solutions;
    let a = co[0];
    let b = co[1];
    if (co.length === 2) return _linear(a, b, complex).concat(solutions);
    let c = co[2];
    if (co.length === 3) return _quadratic(a, b, c, complex).concat(solutions);
    let d = co[3];
    if (co.length === 4) return _cubic(a, b, c, d, complex).concat(solutions);
    let e = co[4];
    if (co.length === 5) return _quartic(a, b, c, d, e, complex).concat(solutions);

    return "unhandled polynomic order";
}


export function solve(coefficients, complex = false) {
    if (complex) return _solve(coefficients, complex).sort((a,b) => a.r - b.r || a.i - b.i);
    else return _solve(coefficients, complex).sort((a,b) => a - b);
}

export function linear (a, b, complex = false) {
    return solve([a,b], complex);
}

export function quadratic(a, b, c, complex = false) {
    return solve([a,b, c], complex);
}

export function cubic(a, b, c, d, complex = false) {
    return solve([a,b, c, d], complex);
}

export function quartic(a, b, c, d, e, complex = false) {
    return solve([a,b, c, d, e], complex);
}

