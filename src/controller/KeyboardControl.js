import EventEmitter from "events";
import Set from "../DumbSet.js";

let _set = new Set();

function update_direction(e, state) {
    let keyCode = (e || window.event).keyCode;
    if (e.type === "keyup") {
        if(!_set.removeMember(keyCode)) return;
    } else if (e.type === "keydown") {
        if(!_set.addMember(keyCode)) return;
    }
    emitter.emit(CHORD, _set.members, e.timeStamp);
}

window.addEventListener("keydown", update_direction);
window.addEventListener("keyup", update_direction);

export const CHORD = "chord";
export const emitter = new EventEmitter();
