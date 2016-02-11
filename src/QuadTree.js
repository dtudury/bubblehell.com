
import Quad from "./Quad.js";
import Set from "./DumbSet.js";

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
        if (!thing.overlaps_quad(this)) return;
        if (!this.things.add(thing)) return;
        if (this.bucket) {
            if (this.bucket.length < this.capacity || !this.max_levels) {
                this.bucket.add(thing);
                thing.quads.add(this);
                return;
            }
            this.split();
        }
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                this.nodes[x][y].add(thing);
            }
        }
    }

    remove (thing) {
        if (!this.things.remove(thing)) return;
        if (this.bucket) {
            this.bucket.remove(thing);
            thing.quads.remove(this);
        } else {
            let remove_from_nodes = thing => {
                for (let x = 0; x < 2; x++) {
                    for (let y = 0; y < 2; y++) {
                        this.nodes[x][y].remove(thing);
                    }
                }
            }
            remove_from_nodes(thing);
            if (this.things.length <= this.capacity) {
                this.things.forEach(remove_from_nodes);
                delete this.nodes;
                this.bucket = new Set();
                this.things.forEach(thing => {this.bucket.add(thing)});
            }
        }
    }

    get_thing_at(x, y) {
        let p = {x:x, y:y};
        let found_thing = null;
        if (!this.overlaps_point(p)) return found_thing;
        if (this.bucket) {
            this.bucket.forEach(thing => {
                if (thing.overlaps_point(p)) found_thing = thing;
            });
            return found_thing;
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                found_thing = found_thing || this.nodes[i][j].get_thing_at(x, y);
            }
        }
        return found_thing;
        
    }

    split() {
        let half_size = this.size / 2;
        this.nodes = [];
        for (let x = 0; x < 2; x++) {
            this.nodes[x] = [];
            for (let y = 0; y < 2; y++) {
                let qt = new QuadTree(
                    this.x + half_size * x,
                    this.y + half_size * y,
                    half_size,
                    this.capacity,
                    this.max_levels - 1
                );
                this.nodes[x][y] = qt;
                this.bucket.forEach(t => qt.add(t));
            }
        }
        delete this.bucket;
    }
}
