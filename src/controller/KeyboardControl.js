import EventEmitter from "events";

let _set = new Set();

function update_direction(e, state) {
    let keyCode = (e || window.event).keyCode;
    if (e.type === "keyup") {
        if(!_set.delete(keyCode)) return;
    } else if (e.type === "keydown") {
        if(!_set.add(keyCode)) return;
    }
    emitter.emit(CHORD, _set, e.timeStamp);
}

window.addEventListener("keydown", update_direction);
window.addEventListener("keyup", update_direction);

export const CHORD = "chord";
export const emitter = new EventEmitter();
