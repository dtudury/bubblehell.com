
import * as EquationSolver from "../src/EquationSolver.js";
let assert = require("assert");

describe("EquationSolver", () => {
    describe("non-complex", () => {
        describe("linear", () => {
            it("should solve x + 1 = 0", () => {
                let v = EquationSolver.linear(1, 1);
                assert.equal(v.length.toFixed(3), "1.000");
                assert.equal(v[0].toFixed(3), "-1.000");
            });
            it("should solve 5x - 10 = 0", () => {
                let v = EquationSolver.linear(5, -10);
                assert.equal(v.length.toFixed(3), "1.000");
                assert.equal(v[0].toFixed(3), "2.000");
            });
        });
        describe("quadratic", () => {
            it("should solve x^2 + x - 4 = 0", () => {
                let v = EquationSolver.quadratic(1, 1, -4);
                assert.equal(v.length.toFixed(3), "2.000");
                assert.equal(v[0].toFixed(3), "-2.562");
                assert.equal(v[1].toFixed(3), "1.562");
            });
            it("should solve 6x^2 + 11x - 35 = 0", () => {
                let v = EquationSolver.quadratic(6, 11, -35);
                assert.equal(v.length.toFixed(3), "2.000");
                assert.equal(v[0].toFixed(3), "-3.500");
                assert.equal(v[1].toFixed(3), "1.667");
            });
        });
        describe("cubic", () => {
            it("should solve 2x^3 - 4x^2 - 22x + 24 = 0", () => {
                let v = EquationSolver.cubic(2, -4, -22, 24);
                assert.equal(v.length.toFixed(3), "3.000");
                assert.equal(v[0].toFixed(3), "-3.000");
                assert.equal(v[1].toFixed(3), "1.000");
                assert.equal(v[2].toFixed(3), "4.000");
            });
            it("should solve 3x^3 - 10x^2 + 14x + 27 = 0", () => {
                let v = EquationSolver.cubic(3, -10, 14, 27);
                assert.equal(v.length.toFixed(3), "1.000");
                assert.equal(v[0].toFixed(3), "-1.000");
            });
            it("should solve x^3 + 6x^2 + 12x + 8 = 0", () => {
                let v = EquationSolver.cubic(1, 6, 12, 8);
                assert.equal(v.length.toFixed(3), "1.000");
                assert.equal(v[0].toFixed(3), "-2.000");
            });
        });
        describe("quartic", () => {
            it("should solve 3x^4  + 6x^3 - 123x^2 - 126x + 1080 = 0", () => {
                let v = EquationSolver.quartic(3, 6, -123, -126, 1080);
                assert.equal(v.length.toFixed(3), "4.000");
                assert.equal(v[0].toFixed(3), "-6.000");
                assert.equal(v[1].toFixed(3), "-4.000");
                assert.equal(v[2].toFixed(3), "3.000");
                assert.equal(v[3].toFixed(3), "5.000");
            });
        });
    });
    describe("complex", () => {
        describe("cubic", () => {
            it("should solve 2x^3 - 4x^2 - 22x + 24 = 0", () => {
                let v = EquationSolver.cubic(2, -4, -22, 24, true);
                assert.equal(v.length.toFixed(3), "3.000");
                //needs sorting for this to work
                /*
                assert.equal(v[0].r.toFixed(3), "-3.000");
                assert.equal(v[0].i.toFixed(3), "0.000");
                assert.equal(v[1].r.toFixed(3), "1.000");
                assert.equal(v[1].i.toFixed(3), "0.000");
                assert.equal(v[2].r.toFixed(3), "4.000");
                assert.equal(v[2].i.toFixed(3), "0.000");
                */
            });
            it("should solve 3x^3 - 10x^2 + 14x + 27 = 0", () => {
                let v = EquationSolver.cubic(3, -10, 14, 27, true);
                assert.equal(v.length.toFixed(3), "3.000");
                assert.equal(v[0].r.toFixed(3), "-1.000");
            });
            it("should solve x^3 + 6x^2 + 12x + 8 = 0", () => {
                let v = EquationSolver.cubic(1, 6, 12, 8, true);
                assert.equal(v.length.toFixed(3), "1.000");
                assert.equal(v[0].r.toFixed(3), "-2.000");
                assert.equal(v[0].i.toFixed(3), "0.000");
            });
        });
    });
});
