
import Set from "./DumbSet";

export default class Thing {
    constructor() {
        this.quads = new Set();
    }

    add_to_quad(quad) {
        this.quads.addMember(quad);
    }
}
