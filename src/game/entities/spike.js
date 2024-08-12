import { Sprite } from './sprite';

export class Spike extends Sprite {
  constructor(g, o) {
    o.i = g.H.rndArray(['spike', 'spike2']);
    o.group = 'baddies';
    o.frames = 1;
    o.scale = 1;
    super(g, o);
    if (Math.random() > 0.5) {
      this.y = 3;
      this.flip.y = 1;
    } else {
      this.y = g.h - this.h - 1;
    }
    this.x = g.w;
    this.vx = this.p.bgSpeed;
    this.collidesWith = ['player', 'bullet'];
  }

  update(dt) {
    super.update(dt);
    this.x -= this.vx;
    if (this.x < -this.w) {
      this.remove = true;
    } 
    if (Math.abs(this.x % 16) === 0) {
      this.y -= 1;
    }
  }

  receiveDamage(o) {
    if (o.name === 'bee') {
      o.hitBaddie(this);
      return;
    }

    this.g.audio.play('TIP');
    this.g.burst(o.x, o.y, 5, 1);
    o.remove = true;
  }

}
