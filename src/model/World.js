
import RoundThing from "../RoundThing.js";
import MovingThings from "../MovingThings.js";

import * as DoubleJoystick from "../controller/DoubleJoystick.js";
import * as Overlaps from "../Overlaps.js";

DoubleJoystick.emitter.on(DoubleJoystick.MOVE, (k, m, ts) => {
    console.log(DoubleJoystick.calculate_arrow(k),
        DoubleJoystick.calculate_arrow(m), ts);
});




let w = 400;
let h = 300;
let t = Date.now();
export let movingThings = new MovingThings(t, 0, 0, w, h);

for (let i = 0; i < 1000; i++) {
    let thing = RoundThing.random(t, w, h);
    let no_collision = true;
    /*jshint loopfunc:true */
    movingThings.things_set.forEach(thing2 => {
        if (Overlaps.circle_and_circle(thing, thing2)) {
            no_collision = false;
        }
    });
    if (no_collision) movingThings.add(thing);
}

movingThings.predict_collisions();
