export default class Bg {
    constructor(g, o) {
        this.g = g;
        this.p = o.p;
        this.vy = o.vy || 0;
        this.vx = o.vx || 0;
        this.x = o.x || 0;
        this.y = o.y || 0;
        this.o = o.o || 1;
        this.i = o.i;
        this.w = g.imgs[o.i].width;
        this.h = g.imgs[o.i].height;
    }

    update() {
        this.x += (this.vx * this.p.bgSpeed);
        this.y += this.vy;
        if (this.x < -this.w) {
          this.x = 0;
        }
    }


    render() {
      let x = Math.ceil(this.x);
      let y = Math.ceil(this.y);
      this.g.draw.img(this.g.imgs[this.i], x, y, 1, this.o);
      this.g.draw.img(this.g.imgs[this.i], x + this.w, y, 1, this.o);
  }
}


