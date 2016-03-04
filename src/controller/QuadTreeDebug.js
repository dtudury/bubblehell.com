import {movingThings} from "../model/World.js";
import RoundThing from "../RoundThing.js";

export default function (element, board) {
    element.addEventListener("click", e => {
        let p = board.reverse_map(e.x, e.y);
        let thing = movingThings.get_thing_at(p.x, p.y);
        if (thing) {
            movingThings.remove(thing);
        } else {
            movingThings.add(RoundThing.random(Date.now(), 400, 300, p.x, p.y));
        }
    });
    window.addEventListener("mousemove", e => {
        let p = board.reverse_map(e.x, e.y);
        movingThings.thing = movingThings.get_thing_at_t(p.x, p.y, Date.now());
    });
}
