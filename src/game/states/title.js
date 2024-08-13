import { Sprite } from '../entities/sprite';

export default class Title {
  constructor(g) {
    this.g = g;
    this.start = g.H.mkFont(g, 1, 2);
    g.initAudio();
  }

  init() {

    this.hi = this.g.H.getHi();
    this.initFade = false;
    this.fade = 1;

    this.fader = 0;
    this.canStart = false;
    this.lightening = 0;

    this.bee = new Sprite(this.g, { i: 'bee', x: 0, y: 20, scale: 1});
  }

  update(dt) {
    for (let e of this.g.ents) e.update(dt);

    if (this.bee.x < 64) {
      this.bee.x += 0.5;
      if (this.bee.x % 4 === 0 && this.bee.x > 5 && this.bee.x < 54) {
        this.g.boom(this.bee.x, this.bee.y, 2, 4);
      }
    } else if (this.bee.x === 64 && !this.initFade)  {
      this.initFade = true;
      this.showControls();
    }

    if (this.initFade && this.fade > 0.01) {
      this.fade -= 0.01;
    }

    if (this.lightening > 0) {
      this.lightening -= 0.02;
    }

  }

  render() {
    const g = this.g;
    g.draw.clear(0);

    let x = this.bee.x - 64;
    this.g.draw.rect(x, 16, 64, 4, 8);
    this.g.draw.rect(x, 20, 64, 4, 7);
    this.g.draw.ctx.globalAlpha = this.fade;
    this.g.draw.rect(x, 16, 64, 8, 2);
    this.g.draw.ctx.globalAlpha = 1;

    this.g.draw.img(g.imgs.title, 0, 0);

    if (Math.random() > 0.995 && this.lightening <= 0.01) {
      this.lightening = 1;
    }


    if (this.lightening >= 0.01) {
    this.g.draw.ctx.globalAlpha = this.lightening;
      this.g.draw.rect(0, 0, 64, 64, 1);
    this.g.draw.ctx.globalAlpha = 1;
    }

    this.g.draw.ctx.globalAlpha = 0.3;
    this.g.draw.img(this.g.imgs['stars'], 0, -32);
    this.g.draw.img(this.g.imgs['bg_hills'], 0, 0);
    this.g.draw.img(this.g.imgs['bg_1'], 0, 44);
    this.g.draw.ctx.globalAlpha = 1;

    for (let n of this.g.ents) n.render();
    this.bee.render();

    g.draw.img(g.imgs.pointer, g.input.m.x, g.input.m.y);
  }

  showControls() {
    this.g.spawn('Control', {
      x: 53,
      y: 1,
      textCol: 1,
      clickCol: 12,
      col: 0,
      w: 10,
      h: 10,
      text: '?',
      key: 'H',
      cb: () => {
        this.g.changeState('Help');
      }
    });

    this.g.spawn('Control', {
      y: this.g.h - 12,
      x: false,
      w: 28,
      clickCol: 3,
      col: 0,
      key: ' ',
      text: 'PLAY',
      cb: () => {
        if (this.g.mainMusic) {
          this.g.mainMusic.pause();
          this.g.mainMusic.currentTime = 0;
        }
        this.g.H.toggleFullScreen(this.g.canvas.c);
        this.g.changeState('Tutorial');
      }
    });
    this.g.addEvent({
      t: 100,
      cb: () => {
        this.canStart = true;
      },
    });
  }

}
