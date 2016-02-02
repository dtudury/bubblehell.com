
import * as KeyboardControl from "./KeyboardControl.js";
KeyboardControl.emitter.on(KeyboardControl.TURN, (vertical, horizontal, timeStamp, direction) => {
    console.log(direction, timeStamp);
});


import Board from "./Board.js";
function setup_board(canvas) {
    let _board = new Board(canvas.getContext("2d"));
    function handle_resize () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        _board.resize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handle_resize);
    handle_resize();
}

window.onload = () => {
    let _canvas = document.createElement("canvas");
    if (!_canvas.getContext) window.alert ("no getContext...");//catastrophic failure
    document.body.appendChild(_canvas);

    setup_board(_canvas);

    window.addEventListener("click", () => _canvas.requestPointerLock());
    window.addEventListener("focus", () => console.log("focus"));
    window.addEventListener("blur", () => console.log("blur"));
};
