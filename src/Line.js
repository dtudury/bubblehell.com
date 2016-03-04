
import Point from "./Point";

export default class Line {
    constructor (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    static get_normals (line) {
        let dx = line.p2.x - line.p1.x;
        let dy = line.p2.y - line.p1.y;
        return [
            {x: -dy, y:  dx}, //right side first
            {x:  dy, y: -dx}
        ];
    }
}
