
import RoundThing from "../RoundThing.js";
import QuadTree from "../QuadTree.js";

import * as DoubleJoystick from "../controller/DoubleJoystick.js"

DoubleJoystick.emitter.on(DoubleJoystick.MOVE, (k, m, ts) => {
    console.log(DoubleJoystick.calculate_arrow(k),
        DoubleJoystick.calculate_arrow(m), ts);
});




let w = 400;
let h = 300;
export let quadtree = new QuadTree(0, 0, Math.max(w, h));

for (let i = 0; i < 40; i++) {
    let r = Math.random() * 4 + 1;
    let x = Math.random() * (w - 2 * r) + r;
    let y = Math.random() * (h - 2 * r) + r;
    let angle = Math.random() * 2 * Math.PI;
    let speed = Math.random() * 5 + 2;
    let dx = Math.cos(angle) * speed;
    let dy = Math.sin(angle) * speed;
    let thing = new RoundThing(r, x, y, dx, dy);
    let no_collision = true;
    quadtree.things.members.forEach(thing2 => {
        if (RoundThing.overlaps_circle_and_circle(thing, thing2)) {
            no_collision = false;
        }
    });
    if (no_collision) quadtree.add(thing);
}
