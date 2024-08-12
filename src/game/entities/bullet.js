import { Sprite } from './sprite';

export class Bullet extends Sprite {
  constructor(g, o) {
    o.group = 'bullet';
    o.i = 'bullet';
    o.scale = 1;
    super(g, o);
    this.g = g;
    this.o = o;
    this.speed = 1.75;
    this.a = o.a || 0;
    this.col = 7;
    this.vx = this.speed * Math.cos(this.a);
    this.vy = this.speed * Math.sin(this.a);
  }

  update(dt) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;

    if (this.isOffScreen()) {
      this.remove = true;
    }
  }

  render() {
    super.render();
    let d = this.g.draw;

    d.ctx.globalAlpha = 0.5;
    d.rect(this.lastX, this.lastY, 1, 1, 8);
    d.ctx.globalAlpha = 1;
  }

  doDamage(o) {
  }

  hitBaddie(o) {
    let g = this.g;
    g.boom(this.x, this.y, o.col, 3);
    g.audio.play('TIP');
    this.remove = true;
  }
}
