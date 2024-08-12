export default class Wiper {

  constructor(opts) {
    const g = opts.g;
    this.g = opts.g;
    this.col = 0;
    this.active = false;
    this.x = -this.g.w;
    this.w = g.data.w;
    this.h = g.data.h;
    this.cb = false;
    console.log(this);
  }

  update(dt) {

    if (!this.active) return;
  
    this.x += this.dir;
    if (this.x >= 0) {
      this.dir *= -1;
      if (this.cb) {
        this.cb();
      }
    } else if (this.x <= -this.g.w) {
      this.dir = 0;
      this.active = false;
      this.cb = false;
    }

  }


  start(cb = false) {
    this.active = true;
    this.dir = 1;
    this.cb = cb;
  }


  render() {
    if (!this.active) return;
    this.g.draw.rect(this.x, 0, this.w, this.h, this.col);
  }

}
