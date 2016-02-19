
import Quad from "./Quad.js";
import Set from "./DumbSet.js";
import * as Overlaps from "./Overlaps.js";


export default class QuadTree extends Quad {
    constructor (x = 0, y = 0, size = 400, capacity = 2, max_levels = 8) {
        super (x, y, size, size);
        this.size = size;
        this.capacity = capacity;
        this.max_levels = max_levels;
        this.bucket_set = new Set();
        this.nodes = null;
        this.things_set = new Set();
    }

    touch_things () {
        if (this.bucket_set) {
            this.bucket_set.members.forEach(thing => thing.touch());
        }
    }

    add (thing) {
        if (!Overlaps.quad_and_circle(this, thing)) return;
        if (!this.things_set.add(thing)) return;
        if (this.bucket_set) {
            if (this.bucket_set.length < this.capacity || !this.max_levels) {
                this.bucket_set.add(thing);
                thing.quads_set.add(this);
                this.touch_things();
                return;
            }
            this.split();
        }
        this.nodes.forEach(node => node.add(thing));
    }

    remove (thing) {
        if (!this.things_set.remove(thing)) return;
        if (this.bucket_set) {
            this.bucket_set.remove(thing);
            thing.quads_set.remove(this);
            this.touch_things();
        } else {
            let remove_from_nodes = thing => {
                this.nodes.forEach(node => node.remove(thing));
            };
            remove_from_nodes(thing);
            if (this.things_set.length <= this.capacity) {
                this.things_set.members.forEach(remove_from_nodes);
                delete this.nodes;
                this.bucket_set = new Set();
                this.things_set.members.forEach(thing => {
                    this.bucket_set.add(thing);
                    thing.quads_set.add(this);
                });
                this.touch_things();
            }
        }
    }

    get_thing_at(x, y) {
        let p = {x:x, y:y};
        let found_thing = null;
        if (!Overlaps.quad_and_point(this, p)) return null;
        if (this.bucket_set) {
            this.bucket_set.members.forEach(thing => {
                if (Overlaps.circle_and_point(thing, p)) found_thing = thing;
            });
            return found_thing;
        }
        this.nodes.forEach(node => found_thing = found_thing || node.get_thing_at(x, y));
        return found_thing;
        
    }

    split() {
        this.bucket_set.members.forEach(thing => thing.quads_set.remove(this));
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
            //this.bucket_set.members.forEach(t => qt.add(t));
            this.bucket_set.members.forEach(qt.add.bind(qt));
        }
        delete this.bucket_set;
    }
}
