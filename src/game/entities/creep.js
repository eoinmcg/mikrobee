import { Sprite } from './sprite';

export class Creep extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'creep';
    o.frames = 2;
    o.scale = 1;
    o.val = 20;
    super(g, o);
    this.anims = {
      move: { frames: [1, 2], rate: 0.5 },
    };
    this.changeAnim('move');
    this.val = 20;
    this.x = 60;
    this.y = 0;
    this.collidesWith = ['player', 'bullet'];
    this.flip.x = true;
    this.maxY = g.H.rnd(15, 40);
    this.vy = g.H.rndArray([0.25, 0.5]);
    console.log(this.x, this.y);
  }

  update(dt) {
    super.update(dt);
    this.x -= 0.5;
    if (this.y < this.maxY) {
      this.y += this.vy;
    }

    if (this.x < -6) { this.remove = true; }
  }

  render() {
    this.g.draw.ctx.globalAlpha = 0.5;
    this.g.draw.rect(this.x + 1, 0, 1, (this.y), 1);
    this.g.draw.ctx.globalAlpha = 1;
    super.render();
  }

  receiveDamage(o) {
    this.p.killBaddie(this);
    if (!o.hurt) o.hitBaddie(this);
  }
}
