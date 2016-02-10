
import EventEmitter from "events";
import * as KeyboardControl from "./KeyboardControl.js";
import * as MouseControl from "./MouseControl.js";
import * as MouseLock from "./MouseLock.js";

/*********** I guess we're using turn/8 as our angle unit
 * 5  6  7 *
 *  \ | /  *
 *   \|/   *
 * 4-- --0 *
 *   /|\   *
 *  / | \  *
 * 3  2  1 *
 ***********/

let _trig = {
    0:{x: 1,            y: 0           },
    1:{x: Math.SQRT1_2, y: Math.SQRT1_2},
    2:{x: 0,            y: 1           },
    3:{x:-Math.SQRT1_2, y: Math.SQRT1_2},
    4:{x:-1,            y: 0           },
    5:{x:-Math.SQRT1_2, y:-Math.SQRT1_2},
    6:{x: 0,            y:-1           },
    7:{x: Math.SQRT1_2, y:-Math.SQRT1_2}
};

let _atrig = {
    [-1]:{[-1]:5, [ 0]:6,   [ 1]:7},
    [ 0]:{[-1]:4, [ 0]:null,[ 1]:0},
    [ 1]:{[-1]:3, [ 0]:2,   [ 1]:1}
};


let _locked = false;
let _micro_angle = 0;
let mangle = _trig[0];
let kangle = {x:0, y:0};

export function calculate_arrow(p) {
    if (p.y < 0) {
        if (p.x < 0) return "↖";
        if (p.x > 0) return "↗";
        return "↑";
    }
    if (p.y > 0) {
        if (p.x < 0) return "↙";
        if (p.x > 0) return "↘";
        return "↓";
    } 
    if (p.x < 0) return "←";
    if (p.x > 0) return "→";
    return "·";
}

KeyboardControl.emitter.on(KeyboardControl.CHORD, (chord, ts) => {
    let x = 0;
    let y = 0;
    let left = +!!(~chord.indexOf(37) || ~chord.indexOf(65));
    let up = +!!(~chord.indexOf(38) || ~chord.indexOf(87));
    let right = +!!(~chord.indexOf(39) || ~chord.indexOf(68));
    let down = +!!(~chord.indexOf(40) || ~chord.indexOf(83));
    if (left ^ right) {
        if (left) x = -1;
        else x = 1;
    }
    if (up ^ down) {
        if (up) y = -1;
        else y = 1;
    }
    if (x && y) {
        x *= Math.SQRT1_2;
        y *= Math.SQRT1_2;
    }
    kangle = {x:x, y:y};
    emitter.emit(MOVE, kangle, mangle, ts);
});
MouseLock.emitter.on(MouseLock.LOCKED, ts => {
    _locked = true;
});
MouseLock.emitter.on(MouseLock.UNLOCKED, ts => {
    _locked = false;
});
MouseControl.emitter.on(MouseControl.MOVE, (dx, dy, ts) => {
    //if (!_locked) return;
    let r = 320; //just feels about right to me...
    _micro_angle = ((_micro_angle + dx) % r + r) % r;
    let angle = _trig[Math.floor(_micro_angle / r * 8)];
    if (mangle === angle) return;
    mangle = angle;
    emitter.emit(MOVE, kangle, mangle, ts);
});

export const MOVE = "move";
export const emitter = new EventEmitter();
