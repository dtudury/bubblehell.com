let sign = Math.sign || function (x) {
    return x && x > 0 ? 1 : -1;
};




class Complex {
    constructor (r = 0, i = 0) {
        this.r = r;
        this.i = i;
    }

    abs () {
        return _abs(this);
    }

    add (v) {
        return _add(this, Complex.convert(v));
    }

    div (v) {
        return _div(this, Complex.convert(v));
    }

    mul (v) {
        return _mul(this, Complex.convert(v));
    }

    neg () {
        return _neg(this);
    }

    sqrt () {
        return _sqrt(this);
    }

    sub (v) {
        return _sub(this, Complex.convert(v));
    }




    static convert (v, i = 0) { //can also pass r, i
        if (v) {
            let type = typeof v;
            if (type === "number") return new Complex(v, i);
            //no good reason to pass imaginary part at this point
            if (type === "object") return new Complex(
                typeof v.r === "number" ? v.r : parseFloat(v.r) || 0,
                typeof v.i === "number" ? v.i : parseFloat(v.i) || 0
            );
        }
        return new Complex(0, i);
    }

    static abs (v = 0, i = 0) { //can also pass r, i
        return _abs(Complex.convert(v, i));
    }

    static add (a, b) {
        return _add(Complex.convert(a), Complex.convert(b));
    }

    static div (a, b) {
        return _div(Complex.convert(a), Complex.convert(b));
    }

    static mul (a, b) {
        return _mul(Complex.convert(a), Complex.convert(b));
    }

    static neg (v = 0, i = 0) { //can also pass r, i
        return _neg(Complex.convert(v, i));
    }

    static sqrt (v = 0, i = 0) { //can also pass r, i
        return _sqrt(Complex.convert(v, i));
    }

    static sub (a, b) {
        return _sub(Complex.convert(a), Complex.convert(b));
    }






    //slower, just here for testing
    static sqrt2 (r = 0, i = 0) {
        let sqrt_radius = Math.pow(r*r + i*i, 0.25);
        let half_theta = Math.atan2(i, r) / 2;

        let a = Math.cos(half_theta) * sqrt_radius;
        let b = Math.sin(half_theta) * sqrt_radius;
        return new Complex(a, b);
    }
}

function _abs (v) {
    return new Complex(Math.sqrt(v.r*v.r + v.i*v.i), 0);
}

function _add (a, b) {
    return new Complex(a.r + b.r, a.i + b.i);
}

function _div (a, b) {
    let d = b.r*b.r + b.i*b.i;
    return new Complex((a.r*b.r + a.i*b.i) / d, (a.i*b.r - a.r*b.i) / d);
}

function _mul (a, b) {
    return new Complex(a.r * b.r - a.i * b.i, a.r * b.i + a.i * b.r);
}

function _neg (v) {
    return new Complex(-a.r, -a.i);
}

function _sqrt (v) {
    if (!v.i) {
        if (v.r < 0) return new Complex(0, Math.sqrt(-v.r));
        else return new Complex(Math.sqrt(v.r), 0);
    }
    let a = _abs(v).r / 2;
    let b = v.r / 2;
    let c = Math.sqrt(a + b);
    let d = sign(v.i) * Math.sqrt(a - b);
    return new Complex(c, d);
}

function _sub (a, b) {
    return {r:a.r - b.r, i:a.i - b.i};
}

export default Complex;
