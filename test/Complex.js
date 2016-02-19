
import Complex from "../src/Complex.js";
let C = Complex.convert;
let assert = require("assert");

function precision(v, p) {
}

describe("Complex", () => {
    describe("sqrt", () => {
        it("should handle {r=-10,i=-10}", () => {
            let v = Complex.sqrt(-10, -10);
            assert.equal(v.r.toFixed(3), "1.439");
            assert.equal(v.i.toFixed(3), "-3.474");
        });
        it("should handle {r=0,i=-10}", () => {
            let v = Complex.sqrt(0, -10);
            assert.equal(v.r.toFixed(3), "2.236");
            assert.equal(v.i.toFixed(3), "-2.236");
        });
        it("should handle {r=10,i=-10}", () => {
            let v = Complex.sqrt(10, -10);
            assert.equal(v.r.toFixed(3), "3.474");
            assert.equal(v.i.toFixed(3), "-1.439");
        });

        it("should handle {r=-10,i=0}", () => {
            let v = Complex.sqrt(-10, 0);
            assert.equal(v.r.toFixed(3), "0.000");
            assert.equal(v.i.toFixed(3), "3.162");
        });
        it("should handle {r=0,i=0}", () => {
            let v = Complex.sqrt(0, 0);
            assert.equal(v.r.toFixed(3), "0.000");
            assert.equal(v.i.toFixed(3), "0.000");
        });
        it("should handle {r=10,i=0}", () => {
            let v = Complex.sqrt(10, 0);
            assert.equal(v.r.toFixed(3), "3.162");
            assert.equal(v.i.toFixed(3), "0.000");
        });

        it("should handle {r=-10,i=10}", () => {
            let v = Complex.sqrt(-10, 10);
            assert.equal(v.r.toFixed(3), "1.439");
            assert.equal(v.i.toFixed(3), "3.474");
        });
        it("should handle {r=0,i=10}", () => {
            let v = Complex.sqrt(0, 10);
            assert.equal(v.r.toFixed(3), "2.236");
            assert.equal(v.i.toFixed(3), "2.236");
        });
        it("should handle {r=10,i=10}", () => {
            let v = Complex.sqrt(10, 10);
            assert.equal(v.r.toFixed(3), "3.474");
            assert.equal(v.i.toFixed(3), "1.439");
        });
    });

    describe("div", () => {
        it("should handle 1 / 2", () => {
            let v = Complex.div(1, 2);
            assert.equal(v.r.toFixed(3), "0.500");
            assert.equal(v.i.toFixed(3), "0.000");
        });
        it("should handle 4 / 2", () => {
            let v = Complex.div(4, 2);
            assert.equal(v.r.toFixed(3), "2.000");
            assert.equal(v.i.toFixed(3), "0.000");
        });
        it("should handle (4+2i) / (3-i)", () => {
            let v = Complex.div(C(4,2), C(3,-1));
            assert.equal(v.r.toFixed(3), "1.000");
            assert.equal(v.i.toFixed(3), "1.000");
        });
        it("should handle (1+2i) / (3-4i)", () => {
            let v = Complex.div(C(1,2), C(3,4));
            assert.equal(v.r.toFixed(3), "0.440");
            assert.equal(v.i.toFixed(3), "0.080");
        });
    });

    describe("mul", () => {
        it("should handle 2 * 2", () => {
            let v = Complex.mul(2, 2);
            assert.equal(v.r.toFixed(3), "4.000");
            assert.equal(v.i.toFixed(3), "0.000");
        });
        it("should handle 2i * 2i", () => {
            let v = Complex.mul(C(0,2), C(0,2));
            assert.equal(v.r.toFixed(3), "-4.000");
            assert.equal(v.i.toFixed(3), "0.000");
        });
        it("should handle 2 * 2i", () => {
            let v = Complex.mul(C(2,0), C(0,2));
            assert.equal(v.r.toFixed(3), "0.000");
            assert.equal(v.i.toFixed(3), "4.000");
        });
    });

    describe("add", () => {
        it("should handle (2+3i) + (4-5i)", () => {
            let v = Complex.add(C(2,3), C(4,-5));
            assert.equal(v.r.toFixed(3), "6.000");
            assert.equal(v.i.toFixed(3), "-2.000");
        });
    });

});
