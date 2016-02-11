
import Board from "./view/Board.js";
import {set as setMouseLock} from "./controller/MouseLock.js";
import QuadTreeDebug from "./controller/QuadTreeDebug.js";

window.onload = () => {
    let _canvas = document.createElement("canvas");
    if (!_canvas.getContext) window.alert ("no getContext...");//catastrophic failure
    document.body.appendChild(_canvas);
    let _board = new Board(_canvas.getContext("2d"));

    function handle_resize () {
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;
        _board.resize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handle_resize);
    handle_resize();

    //setMouseLock(_canvas);
    QuadTreeDebug(_canvas, _board);
};
