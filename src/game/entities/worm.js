import { Sprite } from './sprite';

export class Worm extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'worm';
    o.frames = 3;
    o.scale = 1;
    o.val = 20;
    super(g, o);
    this.anims = {
      move: { frames: [1, 2, 3, 2], rate: 0.075 },
    };
    this.changeAnim('move');
    this.val = 10;
    this.vx = 0.1;
    this.vy = -0.1;
    if (!this.x) { this.x = g.H.rnd(0, 64); }
    if (!this.y) { this.y = g.H.rnd(0, 64); }
    if (this.x > this.g.w / 2) {
      this.vx *= -1;
      this.flip.x = !this.flip.x;
    }
    this.collidesWith = ['player', 'bullet'];
  }

  update(dt) {
    super.update(dt);
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.g.w - this.w) {
      this.vx *= -1;
      this.flip.x = !this.flip.x;
    }
    if (this.y < 0 || this.y > this.g.h - this.h) {
      this.vy *= -1;
    }
  }

  receiveDamage(o) {
    this.p.killBaddie(this);
    if (!o.hurt) o.hitBaddie(this);
  }
}
