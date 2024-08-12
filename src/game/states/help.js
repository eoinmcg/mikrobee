export default class Help {

  constructor(g) {
    this.g = g;
    this.mainText = g.H.mkFont(g, 1, 2);
    this.mainTextShadow = g.H.mkFont(g, 1, 0);
    this.secondText = g.H.mkFont(g, 1, 1);
    window.T = this;
  }

  init() {
    const g = this.g;
      let x = g.H.rnd(1,15) * 4;
      let y = g.H.rnd(1,15) * 4;

    this.g.spawn('Control', {
      y: 18,
      x: false,
      w: 60,
      clickCol: 14,
      col: 9,
      key: 'E',
      text: 'BY EOINMCG',
      cb: () => {
        window.location.href = 'https://eoinmcgrath.com';
      }
    });

    this.g.spawn('Control', {
      y: 40,
      x: false,
      w: 64,
      clickCol: 3,
      col: 9,
      key: 'A',
      text: 'SQUARESAWNOISE',
      cb: () => {
        window.location.href = 'https://freemusicarchive.org/music/sawsquarenoise/Towel_Defence_OST';
      }
    });

    this.g.spawn('Control', {
      y: 54,
      x: false,
      w: 28,
      clickCol: 11,
      col: 10,
      key: ' ',
      text: 'BACK',
      cb: () => {
        this.g.changeState('Title');
      }
    });


  }

  update(dt) {
    let g = this.g,
      i = g.input.keys

    for (let n of this.g.ents) n.update(dt);

  }

  render() {
    const g = this.g;
    g.draw.clear(12);

    g.draw.text('CREDITS', this.mainTextShadow, false, 2);
    g.draw.text('CREDITS', this.mainText, false, 1);

    g.draw.text('AUDIO BY', this.secondText, false, 34);

    for (let n of this.g.ents) n.render();

    g.draw.img(g.imgs.target, g.input.m.x - 1, g.input.m.y - 1);

  }

}

