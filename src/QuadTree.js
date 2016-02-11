
import Quad from "./Quad.js";
import Set from "./DumbSet.js";
import * as Overlaps from "./Overlaps.js";

export default class QuadTree extends Quad {
    constructor (x = 0, y = 0, size = 400, capacity = 2, max_levels = 8) {
        super (x, y, size, size);
        this.size = size;
        this.capacity = capacity;
        this.max_levels = max_levels;
        this.bucket = new Set();
        this.nodes = null;
        this.things = new Set();
    }

    add (thing) {
        if (!Overlaps.quad_and_circle(this, thing)) return;
        if (!this.things.add(thing)) return;
        if (this.bucket) {
            if (this.bucket.length < this.capacity || !this.max_levels) {
                this.bucket.add(thing);
                thing.quads.add(this);
                return;
            }
            this.split();
        }
        this.nodes.forEach(node => node.add(thing));
    }

    remove (thing) {
        if (!this.things.remove(thing)) return;
        if (this.bucket) {
            this.bucket.remove(thing);
            thing.quads.remove(this);
        } else {
            let remove_from_nodes = thing => {
                this.nodes.forEach(node => node.remove(thing));
            }
            remove_from_nodes(thing);
            if (this.things.length <= this.capacity) {
                this.things.forEach(remove_from_nodes);
                delete this.nodes;
                this.bucket = new Set();
                this.things.forEach(thing => {
                    this.bucket.add(thing)
                    thing.quads.add(this);
                });
            }
        }
    }

    get_thing_at(x, y) {
        let p = {x:x, y:y};
        let found_thing = null;
        if (!Overlaps.quad_and_point(this, p)) return null;
        if (this.bucket) {
            this.bucket.forEach(thing => {
                if (Overlaps.circle_and_point(thing, p)) found_thing = thing;
            });
            return found_thing;
        }
        this.nodes.forEach(node => found_thing = found_thing || node.get_thing_at(x, y));
        return found_thing;
        
    }

    split() {
        this.bucket.forEach(thing => thing.quads.remove(this));
        let half_size = this.size / 2;
        this.nodes = [];
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
            this.nodes[i] = qt;
            this.bucket.forEach(t => qt.add(t));
        }
        delete this.bucket;
    }
}
