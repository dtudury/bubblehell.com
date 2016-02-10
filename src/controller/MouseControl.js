
import EventEmitter from "events";

document.addEventListener("mousemove", e => {
    let dx = e.movementX || e.mozMovementX || 0;
    let dy = e.movementY || e.mozMovementY || 0;
    if (dx || dy) emitter.emit(MOVE, dx, dy, e.timeStamp);
});

export const MOVE = "look";
export const emitter = new EventEmitter();
