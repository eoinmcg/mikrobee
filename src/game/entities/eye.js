import { Sprite } from './sprite';

export class Eye extends Sprite {
  constructor(g, o) {
    o.group = 'baddies';
    o.i = 'eye';
    o.frames = 1;
    o.scale = 1;
    o.val = 30;
    super(g, o);
    this.val = 20;
    this.vx = 0.1;
    this.vy = -0.1;
    this.x = 64;
    if (!this.y) { this.y = g.H.rnd(4, 60); }
    this.collidesWith = ['player', 'bullet'];
    this.moveTo = false;

    this.active = false;

  }

  update(dt) {
    super.update(dt);
    if (!this.active) {
      this.x -= 0.2;
      if (this.x < 57) {
        this.active = true;
      }
      return;
    };
    let s = this,
      p1 = this.p.p1,
      easing = 0.05;


    if (!p1.remove && !s.moveTo && Math.random() > 0.99) {
      this.moveTo = { x: -5, y: p1.y };
    } else if (s.moveTo) {
      let xD = ~~(s.moveTo.x - s.x),
        yD = ~~(s.moveTo.y - s.y);
      s.moveTo.d = ~~(Math.sqrt(xD * xD + yD * yD));
      if (s.moveTo.d > 2) {
        s.x += xD * easing;
        s.y += yD * easing;
      } else {
        s.x = s.moveTo.x;
        s.y = s.moveTo.y;
        s.d = 0;
        s.moveTo = false;
      }
    }

    if (this.x < -4) {
      this.remove = true;
    }
  }

  render() {
    super.render();
    let p1 = this.p.p1,
      x = this.x + 1,
      y = this.y + 1,
      checkX = p1.x,
      checkY = p1.y;

    if (p1.remove) {
      checkX = this.g.input.m.x;
      checkY = this.g.input.m.y;
    }

    if (checkX > x) { x += 1; }
    if (checkY > y) { y += 1; }

    this.g.draw.rect(x, y, 1, 1, 3);
  }

  receiveDamage(o) {
    this.p.killBaddie(this);
    if (!o.hurt) o.hitBaddie(this);
  }
}
