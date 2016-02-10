
import EventEmitter from "events";

export let locked = false;

function get_pointerLockElement() {
    return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
}

function update_pointerlock(e, element) {
    let pointerLockElement = get_pointerLockElement();
    if (locked === !!pointerLockElement) return;
    locked = !!pointerLockElement;
    emitter.emit(pointerLockElement ? LOCKED : UNLOCKED, e.timeStamp);
}


export function set (element) {
    let event_name = "pointerlockchange";
    if ("onmozpointerlockchange" in document) event_name = "mozpointerlockchange";
    else if ("onwebkitpointerlockchange" in document) event_name = "webkitpointerlockchange";
    document.addEventListener(event_name, e => update_pointerlock(e, element));
    element.addEventListener("click", e => element.requestPointerLock());
}

export const LOCKED = "locked";
export const UNLOCKED = "unlocked";
export const emitter = new EventEmitter();
