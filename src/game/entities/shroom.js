import { Sprite } from './sprite';

export class Shroom extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'shroom';
    o.frames = 2;
    o.scale = 1;
    super(g, o);
    this.anims = {
      idle: { frames: [2], rate: 1 },
    };
    this.changeAnim('idle');

    this.x = 100;
    this.y = g.data.h - this.h;

    this.vx = -0.25;
    this.flip.x = true;
    this.collidesWith = ['player', 'bullet'];
  }

  update(dt) {
    super.update(dt);
    if (this.p.percent <= 0 || this.p.bgSpeed === 0) {
      return;
    }
    this.x += -0.5;
    if (this.x < -12) {
      this.x = 80;
    }
  }

  receiveDamage(o) {
    if (o.name === 'bee') {
      o.hitBaddie(this);
      return;
    }

    this.g.audio.play('TIP');
    this.hurtTime = 40;
    this.g.burst(o.x, o.y, 3, 1);
    o.remove = true;
  }
}
