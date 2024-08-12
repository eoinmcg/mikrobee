import { Sprite } from './sprite';

export class Powerup extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'star';
    o.frames = 2;
    o.scale = 1;
    super(g, o);

    this.x = o.x;
    this.y = o.y;

    this.anims = {
      sparkle: { frames: [1,2], rate: 0.2 },
    };
    this.changeAnim('sparkle');
    this.vx = -0.25;
    this.collidesWith = ['player'];
  }

  update(dt) {
    super.update(dt);
    this.x += -0.5;
    if (this.y < this.p.p1.y) {
      this.y += 0.2;
    } else if (this.y > this.p.p1.y) {
      this.y -= 0.2;
    }
    if (this.x < -12) {
      this.remove = true;
    }
  }

  receiveDamage(o) {

    this.g.audio.play('POWERUP');
    this.remove = true;
    o.powerup();

  }
}

