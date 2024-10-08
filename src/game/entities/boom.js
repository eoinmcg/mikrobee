export class Boom {
  constructor(g, o) {
    o.col = o.col || 2;
    this.g = g;
    let iKey = `circle_${o.col}`;
    if (!this.g.imgs[iKey]) {
      this.i = g.draw.color(g.imgs.circle, g.data.pal[o.col]);
      this.g.imgs[iKey] = this.i;
    } else {
      this.i = this.g.imgs[iKey];
    }
    this.startX = o.x;
    this.startY = o.y;
    this.magnitude = o.m || 4;
    this.scale = 1;
    this.factor = o.factor || 0.5;
  }

  update() {

    this.scale += this.factor;
    if (this.scale > this.magnitude && this.factor > 0) {
      this.factor *= -1;
    }
    if (this.scale <= 1) {
      this.remove = true;
    }
  }

  render() {
    let s = this.i.width * this.scale / 2,
      x = this.startX - s,
      y = this.startY - s,
      g = this.g;

    g.draw.img(this.i, x, y, this.scale);
  }
}
