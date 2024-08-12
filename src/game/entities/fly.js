import { Sprite } from './sprite';

export class Fly extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'fly';
    o.frames = 3;
    o.scale = 1;
    o.val = 20;
    o.col = 3;
    super(g, o);
    this.o = o;
    this.anims = {
      blue: { frames: [1], rate: 0.035 },
      green: { frames: [2], rate: 0.035 },
      brown: { frames: [3], rate: 0.035 },
    };
    this.type = o.type || g.H.rndArray(Object.keys(this.anims));
    if (this.p.levelNum === 2) {
      this.type = 'blue';
    }
    this.changeAnim(this.type);
    this.setBehavior(this.type); this.val = 10;
    if (this.p.levelNum === 2) {
      this.maxTurns = 1;
    }
    if (!this.x) { this.x = 60; this.flip.x = false; }
    if (!this.y) { this.y = g.H.rnd(4, 60); }
    if (this.x > this.g .w / 2) {
      this.vx *= -1;
      this.flip.x = !this.flip.x;
    }
    this.collidesWith = ['player', 'bullet'];
  }

  setBehavior(type) {

    const g = this.g;
    const x = this.o.x || 60;
    const y = this.o.y || g.H.rnd(4, 60);

    switch (type) {
      case 'brown':
        this.x = x;
        this.y = y;
        this.vx = -0.75;
        this.vy = this.y > 32 ? 0.5 : -0.5;
        this.turns = 0;
        this.maxTurns = 2;
        this.flip.x = false;
      break;
      case 'green':
        this.x = x;
        this.y = y;
        this.vx = -0.5;
        this.vy = this.y > 32 ? 0.25 : -0.25;
        this.turns = 0;
        this.maxTurns = 2;
        this.flip.x = false;
      break;
      default:
      case 'blue':
        this.x = x;
        this.y = y;
        this.vx = -0.6;
        this.vy = 0
        this.turns = 0;
        this.maxTurns = 2;
        this.flip.x = false;
      break;

    }
  }

  update(dt) {
    super.update(dt);
    this.x += this.vx;
    this.y += this.vy;
    let xBounds = this.x < 0 || this.x > this.g.w - this.w;
    let xOffscreen = this.x < -this.w || this.x > this.g.w + this.w;
    let turnsFinished = this.turns > this.maxTurns;

    if (xBounds && !turnsFinished) {
      this.vx *= -1;
      this.flip.x = !this.flip.x;
      this.turns += 1;
    }

    if (turnsFinished && xOffscreen) {
      this.remove = true;
    }

    if (this.y < 0 || this.y > this.g.h - this.h) {
      this.vy *= -1;
      this.turns += 1;
    }

  }

  receiveDamage(o) {
    this.p.killBaddie(this);
    if (!o.hurt) o.hitBaddie(this);
  }
}
