
import Set from "./DumbSet";

export default class Thing {
    constructor() {
        this.quads = new Set();
        this.quads.original_add = this.quads.add;
        this.quads.original_remove = this.quads.remove;
    }
}
