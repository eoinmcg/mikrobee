import { Sprite } from './sprite';

export class Spawn extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'dot_1_2';
    o.col = 11;
    super(g, o);
    this.points = this.setPoints();
    window.S = this;
    this.w = this.h = 4;
    this.cycles = 0;
    this.maxCycles = 3;
    this.alpha = 0;
  }

  update(dt) {
    this.points.forEach((p) => {
      this.g.draw.rect(p.x, p.y, 1, 1, 11);
    });

    let reset = false;
    this.points.forEach((p, index) => {
      if (~~p.x === p.tx && ~~p.y === p.ty) {
        reset = true;
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }
    });
    if (reset) {
      this.cycles += 1;
      this.points = this.setPoints();
    }
    this.alpha += (dt / 2);

    if (this.alpha > 1) {
      this.g.spawn(this.t, { p: this.p, x: this.x, y: this.y });
      this.remove = true;
    }
  }

  render(dt) {
    this.g.draw.ctx.globalAlpha = this.alpha;
    this.g.draw.rect(this.x, this.y, 4, 4, 11);
    this.g.draw.ctx.globalAlpha = 1;
    this.points.forEach((p) => {
      let col = (~~p.x === p.tx && ~~p.y === p.ty)
        ? 2 : 11;
      this.g.draw.rect(p.x, p.y, 4, 1, col);
    });
  }

  setPoints() {
    let points = [];
    let dist = 20, v = 0.75;
    points.push({
      x: this.x,
      y: this.y - dist,
      vx: 0,
      vy: v,
      tx: this.x,
      ty: this.y,
    });
    points.push({
      x: this.x,
      y: this.y + dist,
      vx: 0,
      vy: -v,
      tx: this.x + 2,
      ty: this.y,
    });
    points.push({
      x: this.x - dist,
      y: this.y,
      vx: v,
      vy: 0,
      tx: this.x,
      ty: this.y,
    });
    points.push({
      x: this.x + dist,
      y: this.y,
      vx: -v,
      vy: 0,
      tx: this.x,
      ty: this.y,
    });
    return points;
  }
}
