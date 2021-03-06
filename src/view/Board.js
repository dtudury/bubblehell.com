
import {movingThings} from "../model/World.js";
import Quad from "../Quad.js";

const _SCALE = Symbol();

let last_time = Date.now();

export default class Board {
    constructor (context, vwidth = 400, vheight = 300) {
        this.context = context;
        this.vwidth = vwidth; //let's pretend this is the width when talking to Board
        this.vheight = vheight; //let's pretend this is the height when talking to Board
        this.inner = new Quad(0, 0, vwidth, vheight);
        this[_SCALE] = 1;
        let redraw_loop = () => {
            this.redraw();
            window.requestAnimationFrame(redraw_loop);
        };
        window.requestAnimationFrame(redraw_loop);
    }

    resize (width, height) {
        this.windowWidth = width;
        this.windowHeight = height;
        //size to fit
        let inner_ratio = this.vwidth / this.vheight;
        let outer_ratio = width / height;
        this.inner.x = 0;
        this.inner.y = 0;
        this.inner.width = width;
        this.inner.height = height;
        if (outer_ratio > inner_ratio) {
            //window is too wide;
            this.inner.width = Math.floor(height * inner_ratio);
            this.inner.x = Math.floor((width - this.inner.width) / 2);
        } else {
            //window is too tall;
            this.inner.height = Math.floor(width / inner_ratio);
            this.inner.y = Math.floor((height - this.inner.height) / 2);
        }
        this[_SCALE] = this.inner.width / this.vwidth;
        this.redraw();
    }

    redraw () {
        last_time = Math.min(last_time + 100, Date.now());
        let things = movingThings.get_things_at_t(last_time);
        this.context.clearRect(0,0,this.windowWidth,this.windowHeight);
        this.context.lineWidth = 1;
        let draw_quadtree = (quadtree) => {
            if (quadtree.children) {
                let middle = this.map(quadtree.x + quadtree.size / 2, quadtree.y + quadtree.size / 2);
                let tl = this.map(quadtree.x, quadtree.y);
                let br = this.map(quadtree.x + quadtree.size, quadtree.y + quadtree.size);
                this.context.beginPath();
                this.context.moveTo(middle.x, tl.y);
                this.context.lineTo(middle.x, br.y);
                this.context.moveTo(tl.x, middle.y);
                this.context.lineTo(br.x, middle.y);
                this.context.stroke();
                quadtree.children.forEach(child => draw_quadtree(child));
            }
        };

        //this.context.strokeStyle = "rgb(240,240,255)";
        this.context.strokeStyle = "rgb(100,100,255)";
        draw_quadtree(movingThings);

        if (movingThings.thing) {
            this.context.strokeStyle = "rgb(255,55,55)";
            this.context.lineWidth = 2;
            movingThings.thing.quads_set.forEach(quad => {
                let tl = this.map(quad.x, quad.y);
                let size = this.scale(quad.size);
                this.context.strokeRect(
                    tl.x, tl.y, size, size 
                );
            });
        }

        this.context.lineWidth = 1;
        things.forEach(thing => {
            this.context.strokeStyle = thing.color || "green";
            thing.untouch();
            this.context.beginPath();
            let p = this.map(thing.x, thing.y);
            let r = this.scale(thing.r);
            this.context.arc(p.x, p.y, r, 0, Math.PI*2, true);
            this.context.stroke();
            let neighbors = new Set();
            thing.quads_set.forEach(quad => {
                quad.all_things.forEach(neighbor => {
                    if (thing != neighbor) neighbors.add(neighbor);
                });
            });
            neighbors.forEach(neighbor => {
                this.context.beginPath();
                this.context.strokeStyle = "grey";
                let p1 = this.map(thing.x, thing.y);
                let p2 = this.map(neighbor.x, neighbor.y);
                this.context.moveTo(p1.x, p1.y);
                this.context.lineTo(p2.x, p2.y);
                this.context.stroke();
            });
        });

        this.context.strokeStyle = "blue";
        this.context.lineWidth = 1;
        let origin = this.map(0, 0);
        this.context.strokeStyle = "black";
        this.context.strokeRect(origin.x, origin.y, this.scale(this.vwidth), this.scale(this.vheight));
        let p = this.map(200, -50);
        this.context.moveTo(p.x, p.y);
        p = this.map(400, 150);
        this.context.lineTo(p.x, p.y);
        p = this.map(200, 350);
        this.context.lineTo(p.x, p.y);
        p = this.map(  0, 150);
        this.context.lineTo(p.x, p.y);
        p = this.map(200, -50);
        this.context.lineTo(p.x, p.y);
        this.context.stroke();
    }

    map (x, y) {
        return {x: this.inner.x + this.scale(x), y: this.inner.y + this.scale(y)};
    }

    reverse_map (x, y) {
        return {x: this.reverse_scale(x - this.inner.x), y: this.reverse_scale(y - this.inner.y)};
    }

    scale (v) {
        return this[_SCALE] * v;
    }

    reverse_scale (v) {
        return v / this[_SCALE];
    }
}

