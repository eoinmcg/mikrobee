import { Sprite } from '../entities/sprite';

export default class Tutorial {

  constructor(g) {
    this.g = g;
    this.mainText = g.H.mkFont(g, 1, 2);
    this.mainTextShadow = g.H.mkFont(g, 1, 0);
    this.secondText = g.H.mkFont(g, 1, 1);

    this.canStart = false;
    window.T = this;
  }

  init() {
    const g = this.g;
    this.step = 1;
    g.spawn('Control', {
      y: 53,
      x: false,
      w: 28,
      clickCol: 11,
      col: 10,
      key: ' ',
      text: 'READY',
      cb: () => {
        if (this.canStart) {
          this.g.changeState('Play');
        }
      }
    });

    this.g.addEvent({
      t: 100,
      cb: () => {
        this.canStart = true;
      },
    });

    this.baddies = {
      eye: new Sprite(this.g, { i: 'eye', x: 30, y: 30}),
      fly: new Sprite(this.g, { i: 'fly', frames: 3, x: 20, y: 30}),
      creep: new Sprite(this.g, { i: 'creep', frames: 2, x: 40, y: 30}),
    }
    this.powerup = new Sprite(this.g, {i: 'star', x: 30, y: 30, frames: 2, flip: {x: 1, y: 0}});

    this.updateStep();
  }

  update(dt) {
    let g = this.g,
      i = g.input.keys

    for (let n of this.g.ents) n.update(dt);

    if (this.g.fader > 0) {
      this.powerup.frame = 2;
      this.baddies.creep.frame = 2;
    } else {
      this.powerup.frame = 1;
      this.baddies.creep.frame = 1;
    }

  }

  render() {
    const g = this.g;
    g.draw.clear(12);


    for (let n of this.g.ents) n.render();

    if (this.step === 1) {
      g.draw.text(`${g.mobile ? 'TAP' : 'CLICK'} TO SHOOT`, this.mainText, false, 10);
      g.draw.text(`AND FLY`, this.mainText, false, 20);
      g.draw.img(g.imgs['bee'], 28, 30, 2)
    } else if (this.step === 2) {
      g.draw.text(`SHOOT THE`, this.mainText, false, 10);
      g.draw.text(`BADDIES`, this.mainText, false, 20);
      this.baddies.fly.render();
      this.baddies.eye.render();
      g.draw.rect(31, 31, 1, 1, 3);
      this.baddies.creep.render();
    } else if (this.step === 3) {
      g.draw.text(`GRAB THE`, this.mainText, false, 10);
      g.draw.text(`POWERUPS`, this.mainText, false, 20);
      this.powerup.render();
    }

    g.draw.img(g.imgs.target, g.input.m.x - 1, g.input.m.y - 1);

  }

  updateStep() {
    this.g.addEvent({
      t: 200,
      cb: () => {
        this.step += 1;
        if (this.step > 3) {
          this.step = 1;
        }
        this.updateStep();
      },
    });
  }

}

