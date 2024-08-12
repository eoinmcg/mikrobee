export default class Win {

  constructor(g) {
    this.g = g;
    this.font = g.H.mkFont(g, 1, 3);
  }

  init() {
    this.fader = 0;
    this.canStart = false;
    this.g.addEvent({
      t: 100,
      cb: () => {
        this.canStart = true; 
        console.log('CAN START');
      },
    });
  }

  update() {
    let g = this.g,
      i = g.input.keys

    if (this.canStart && (i.x || i['Space'] || i['Enter'])) {
      this.g.changeState('Title');
    }
  }

  render() {

    const g = this.g,
          draw = this.g.draw;

    draw.clear(15);
    draw.ctx.globalAlpha = 0.1;
    draw.img(this.g.imgs['bg_sky'], 0, 0);
    draw.ctx.globalAlpha = 0.1;
    draw.img(this.g.imgs['bg_hills'], 0, 0);
    draw.ctx.globalAlpha = 1;

    draw.img(this.g.imgs['ground_grass1'], 0, 57);
    draw.text('YOU WIN', this.font, false, 10);
    draw.img(this.g.imgs['heart'], 25, 20, 3, 1);

    draw.img(g.imgs.target, g.input.m.x, g.input.m.y);

  }

}


