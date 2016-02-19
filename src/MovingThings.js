
import QuadTree from "./QuadTree";

export default class MovingThings extends QuadTree {
    constructor (t, x = 0, y = 0, width = 400, height = 300, capacity = 2, max_levels = 8) {
        super (x, y, Math.max(width, height), capacity, max_levels);
        this.t = t === undefined ? Date.now() : t;
        this.court_width = width;
        this.court_height = height;
        this.collisions = this.calculate_collisions();
    }

    get_things_at_t(t) {
        //return this.things_set.members;
        return this.things_set.members.map(member => member.clone_at_t(t));
    }

    calculate_collisions() {

        this.things_set.members.forEach(member => {
        });

    }

}
