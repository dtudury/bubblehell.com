
import Quad from "./Quad.js";

export default class QuadTree extends Quad {
    constructor (x = 0, y = 0, size = 400, capacity = 2, max_levels = 8) {
        super (x, y, size, size);
        this.size = size;
        this.capacity = capacity;
        this.max_levels = max_levels;
        this.bucket = [];
        this.nodes = null;
        this.parent = null;
    }

    insert (thing) {
        if (!thing.overlaps(this)) return;
        if (this.bucket) {
            if (this.bucket.length < this.capacity || !this.max_levels) {
                this.bucket.push(thing);
                //thing.add_region(this);
                return;
            }
            this.split();
        }
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                this.nodes[x][y].insert(thing);
            }
        }
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
                this.bucket.forEach(t => qt.insert(t));
            }
        }
        delete this.bucket;
    }
}
