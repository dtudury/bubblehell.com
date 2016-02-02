
export default class {
    constructor (context, vwidth = 400, vheight = 300) {
        this.context = context;
        this.vwidth = vwidth; //let's pretend this is the width when talking to Board
        this.vheight = vheight; //let's pretend this is the height when talking to Board
        this.inner = {
            x: 0, 
            y: 0, 
            width: vwidth, 
            height: vheight
        };
    }

    resize (width, height) {
        //sizes to fit
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
        this.vscale = this.inner.width / this.vwidth;

        this.context.beginPath();
        this.context.arc(this.mapx(75), this.mapy(75), this.mapscale(50), 0, Math.PI*2, true);
        this.context.stroke();

        this.context.strokeStyle = "red";
        this.context.strokeRect(this.mapx(0), this.mapy(0), this.mapscale(this.vwidth), this.mapscale(this.vheight));
    }

    mapx (x) {
        return this.inner.x + this.vscale * x;
    }

    mapy (y) {
        return this.inner.y + this.vscale * y;
    }

    mapscale (scale) {
        return this.vscale * scale;
    }
}

