
import Quad from "./Quad.js";
import * as Overlaps from "./Overlaps.js";


export default class QuadTree extends Quad {
    constructor (x = 0, y = 0, size = 400, capacity = 2, max_levels = 8) {
        super (x, y, size, size);
        this.size = size;
        this.capacity = capacity;
        this.max_levels = max_levels;
        this.my_things = new Set();
        this.children = null;
        this.all_things = new Set();
    }

    touch_things () {
        if (this.my_things) {
            this.my_things.forEach(thing => thing.touch());
        }
    }

    add (thing) {
        if (!Overlaps.quad_and_circle(this, thing)) return false;

        if (this.all_things.has(thing)) return false;
        else this.all_things.add(thing);

        if (this.my_things) {
            if (this.my_things.size < this.capacity || !this.max_levels) {
                this.my_things.add(thing);
                thing.add(this);
                this.touch_things();
                return true;
            }
            this.split();
        }
        this.children.forEach(child => child.add(thing));
        return true;
    }

    remove (thing) {
        if (!this.all_things.delete(thing)) return false;

        if (this.my_things) {
            this.my_things.delete(thing);
            thing.delete(this);
            this.touch_things();
        } else {
            let remove_from_children = thing => {
                this.children.forEach(child => child.remove(thing));
            };
            remove_from_children(thing);
            if (this.all_things.size <= this.capacity) {
                this.all_things.forEach(remove_from_children);
                delete this.children;
                this.my_things = new Set();

                this.all_things.forEach(thing => {
                    this.my_things.add(thing);
                    thing.add(this);
                });
                this.touch_things();
            }
        }
        return true;
    }

    get_thing_at (x, y) {
        let p = {x:x, y:y};
        let found_thing = null;
        if (!Overlaps.quad_and_point(this, p)) return null;
        if (this.my_things) {
            this.my_things.forEach(thing => {
                if (Overlaps.circle_and_point(thing, p)) found_thing = thing;
            });
            return found_thing;
        }
        this.children.forEach(child => found_thing = found_thing || child.get_thing_at(x, y));
        return found_thing;
    }

    split () {
        this.my_things.forEach(thing => thing.delete(this));
        let half_size = this.size / 2;
        this.children = [];
        for (let i = 0; i < 4; i++) {
            let x = i % 2;
            let y = (i / 2) >>> 0;
            let qt = new QuadTree(
                this.x + half_size * x,
                this.y + half_size * y,
                half_size,
                this.capacity,
                this.max_levels - 1
            );
            this.children[i] = qt;
            this.my_things.forEach(thing => qt.add(thing));
        }
        delete this.my_things;
    }
}
