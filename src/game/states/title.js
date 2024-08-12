export default class Title {
  constructor(g) {
    this.g = g;
    this.start = g.H.mkFont(g, 1, 2);
    g.initAudio();
  }

  init() {

    this.hi = this.g.H.getHi();

    this.fader = 0;
    this.canStart = false;

    this.g.spawn('Control', {
      x: 54,
      y: 1,
      textCol: 1,
      clickCol: 3,
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
        this.g.mainMusic = AUDIO[1];
        this.g.mainMusic.currentTime = 0;
        this.g.mainMusic.loop = false;
        this.g.mainMusic.play();
        this.canStart = true;
      },
    });

  }

  update(dt) {
    let g = this.g,
      i = g.input.keys

    for (let e of this.g.ents) e.update(dt);

    // if (this.canStart && (i.x || i['Space'] || i['Enter'])) {
    //   this.g.changeState('Tutorial');
    // }

  }

  render() {
    const g = this.g;
    g.draw.clear(0);

    this.g.draw.rect(0, 16, 64, 4, 8);
    this.g.draw.rect(0, 20, 64, 4, 7);
    this.g.draw.img(g.imgs.title, 0, 0);

    for (let n of this.g.ents) n.render();

    g.draw.img(g.imgs.pointer, g.input.m.x, g.input.m.y);
  }

}
