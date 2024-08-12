export default class Overlay {
  constructor(g, o) {
    this.g = g;
    this.p = o.p;
    this.col = o.col || 1;
    this.rate = o.rate || 0.05;
    this.maxAlpha = o.maxAlpha || 0.8;
    this.alpha = 0;
  }

  update(dt) {

    if (this.alpha < this.maxAlpha) {
      this.alpha += this.rate;
    }

  }

  render() {
    const g = this.g;
    g.draw.ctx.globalAlpha = this.alpha;
    g.draw.rect(0, 0, g.data.w, g.data.h, this.col);
    g.draw.ctx.globalAlpha = 1;
  }
}
