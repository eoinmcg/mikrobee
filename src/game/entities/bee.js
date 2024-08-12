import { Sprite } from './sprite';

export class Bee extends Sprite {
  constructor(g, o) {
    o.group = 'player';
    o.i = o.i || 'bee';
    o.i1 = 'bee1';
    o.scale = 1;
    o.frames = 1;
    super(g, o);
    this.score = 0;
    this.anims = {
      move: { frames: [1, 1], rate: 0.05 },
    };
    this.changeAnim('move');
    this.x = 16;
    this.y = 32;
    this.lastY = 0;
    this.g = g;
    this.o = o;
    this.started = false;
    this.powerups = 0;

    this.gravity = 9.8;
    this.vx = 0;
    this.vy = 0;
    this.maxVy = 1.5;
    this.floor = 58;
    this.val = 10;
    this.angle = 0;
    this.collidesWith = ['baddies'];
    this.delay = 5;
    this.gunFlash = 0;
    this.lives = 2;
    window.B = this;
  }

  update(dt) {
    super.update(dt);
    if (this.p.levelComplete) {
      return this.buzzOff();
    }
    let g = this.g, keys = g.input.keys;
    let x = g.input.m.click || keys.Space || keys.Enter || g.input.touching;

    this.started = x ? true : this.started;
    if (!this.started) return;

    if (this.y > this.floor) this.y = this.floor;

    if (x && this.y > 0) {
      this.y -= 0.75;
    } else {
      this.y += 0.75;
    }
    if (x && this.delay < 0) {
      this.shoot();
    }

    if (this.x < 0) this.x = 0;
    if (this.x > g.w - this.w) this.x = g.w - this.w;
    if (this.y < 0) this.y = 0;
    if (this.y > g.h - this.h) this.y = g.h - this.h;

    this.delay--;
    this.gunFlash--;
    this.lastY = this.y;
  }

  render() {
    let d = this.g.draw;
    if (this.gunFlash > 0) {
      d.img(this.g.imgs['circle_1_2'], this.x + this.w / 2, this.y, 0.5, 1);
    }
    let i = this.hurt ? this.iHurt : this.i;
    d.img(i, this.x, this.y);
  }

  hitBaddie(o) {
    // this.remove = true;
    if (this.p.levelComplete) return;
    if (this.hurtTime > 0) return;
    this.hurtTime = 100;
    this.lives -= 1;
    this.g.boom(this.x, this.y, 2, 4);
    let num = 4;
    while (num--) {
      this.g.addEvent({
        t: num * 15,
        cb: () => {
          let x = this.g.H.rnd(-2, 2),
            y = this.g.H.rnd(-2, 2);
          this.g.boom(this.x + x, this.y + y, 2, 4);
        },
      });
    }
  }

  shoot() {
    const g = this.g;
    this.delay = 10;
    this.p.shots += 1;
    g.audio.play('SHOOT');
    this.gunFlash = 3;
    g.spawn('Bullet', {
      x: this.x + this.w / 2, y: this.y + this.h / 2, a: 0, p: this.p,
    });
    if (this.powerups > 0) {
      g.spawn('Bullet', {
        x: this.x + this.w / 2, y: this.y - this.h / 2, a: 0, p: this.p,
      });
    }
    if (this.powerups > 1) {
      g.spawn('Bullet', {
        x: this.x + this.w / 2, y: this.y + this.h / 2, a: 0.7, p: this.p,
      });
    }
    if (this.powerups > 2) {
      g.spawn('Bullet', {
        x: this.x + this.w / 2, y: this.y + this.h / 2, a: 5.5, p: this.p,
      });
    }
    if (this.powerups > 3) {
      g.spawn('Bullet', {
        x: this.x + this.w / 2, y: this.y + this.h / 2, a: 3.14, p: this.p,
      });
    }
  }

  powerup() {
    this.powerups += 1;
  }

  buzzOff() {
    if (this.x > 70) return;
    let hW = this.g.w / 2;
    this.x += 1;
    if (this.y <= hW) {
      this.y += 1;
    } else if (this.y >= hW) {
      this.y -= 1;
    }
  }
}
