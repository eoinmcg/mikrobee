export default class Bg {
  constructor(g, o) {
    this.g = g;
    this.p = o.p;
    this.i = o.i || 'cloud2';
    this.w = g.imgs[o.i].width;
    this.h = g.imgs[o.i].height;
    this.reset();
  }

  update(dt) {
    this.x -= this.vx * this.p.bgSpeed;
    if (this.x < -this.w) {
      this.reset();
    }
  }


  render() {
    this.g.draw.img(this.g.imgs[this.i], this.x, this.y, this.scale, 0.5);
  }

  reset() {
    const g = this.g;
    this.x = g.data.w + this.w;
    if (this.p.levelNum === 0) {
      this.y = g.H.rndArray(0, 15, 30);
    } else {
      this.y = g.H.rndArray([0, 15, 30]);
    }
    this.scale = g.H.rndArray([0.5, 1, 1.5]);
    this.vx = this.scale * 1.2;

  }
}



