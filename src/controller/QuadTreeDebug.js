import {quadtree} from "../model/World.js";
import RoundThing from "../RoundThing.js";

export default function (element, board) {
    element.addEventListener("click", e => {
        var p = board.reverse_map(e.x, e.y)
        var thing = quadtree.get_thing_at(p.x, p.y);
        if (thing) {
            quadtree.remove(thing);
        } else {
            let w = 400;
            let h = 300;
            let r = Math.random() * 4 + 1;
            let angle = Math.random() * 2 * Math.PI;
            let speed = Math.random() * 5 + 2;
            let dx = Math.cos(angle) * speed;
            let dy = Math.sin(angle) * speed;
            let thing = new RoundThing(r, p.x, p.y, dx, dy);
            quadtree.add(thing);
        }
    });
}
