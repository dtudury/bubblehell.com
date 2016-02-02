import EventEmitter from "events";

const LEFT_KEY  = 37;
const UP_KEY    = 38;
const RIGHT_KEY = 39;
const DOWN_KEY  = 40;
const DIRECTION_KEYS = [LEFT_KEY, UP_KEY, RIGHT_KEY, DOWN_KEY];
const SPACE_KEY = 32;
const PRESSED   = "pressed";
const RELEASED  = "released";

let vertical = 0;
let horizontal = 0;
let arrow_status = {
    [LEFT_KEY]:     RELEASED,
    [UP_KEY]:       RELEASED,
    [RIGHT_KEY]:    RELEASED,
    [DOWN_KEY]:     RELEASED
};

export const TURN = "turn";
class KeyboardControl extends EventEmitter {
    constructor () {
        super();
        window.onkeydown = (e) => this.update_direction(e, PRESSED);
        window.onkeyup = (e) => this.update_direction(e, RELEASED);
    }

    update_direction(e, state) {
        let keyCode = (e || window.event).keyCode;
        if (!DIRECTION_KEYS.find(x => x === keyCode)) return;
        if (arrow_status[keyCode] === state) return;
        arrow_status[keyCode] = state;
        vertical = (arrow_status[UP_KEY] === arrow_status[DOWN_KEY]) ? 0 : (arrow_status[UP_KEY] === PRESSED) ? -1 : 1;
        horizontal = (arrow_status[LEFT_KEY] === arrow_status[RIGHT_KEY]) ? 0 : (arrow_status[LEFT_KEY] === PRESSED) ? -1 : 1;
        if (Math.abs(vertical) + Math.abs(horizontal) === 2) {
            vertical *= Math.SQRT1_2;
            horizontal *= Math.SQRT1_2;
        }
        var direction;
        if (vertical < 0) {
            if (horizontal < 0) direction = "↖";
            else if (horizontal > 0) direction = "↗";
            else direction = "↑";
        } else if (vertical > 0) {
            if (horizontal < 0) direction = "↙";
            else if (horizontal > 0) direction = "↘";
            else direction = "↓";
        } else {
            if (horizontal < 0) direction = "←";
            else if (horizontal > 0) direction = "→";
            else direction = "·";
        }
        this.emit(TURN, vertical, horizontal, e.timeStamp, direction);
    }
}

export const emitter = new KeyboardControl();
