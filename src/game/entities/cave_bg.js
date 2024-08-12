export default class Cave_bg {

  constructor(g, o) {
    this.g = g;
    this.g = g;
    this.p = o.p;

    this.x = 0;
    this.y = -4;
    this.v = -1;

    this.g.imgs['floor'] = this.g.draw.flip(this.g.imgs['bg_roof'], 1, 1);
  }

  update() {
    this.x += this.v;
    if (this.x <= -64) {
      this.x = 0;
      this.y = -4;
    }
    if (Math.abs(this.x % 16) === 0) {
      this.y -= 1;
    }
  }

  render() {

    this.g.draw.img(this.g.imgs['bg_roof'], this.x, this.y);
    this.g.draw.img(this.g.imgs['bg_roof'], 64 + this.x, this.y + 4);

    this.g.draw.img(this.g.imgs['floor'], this.x, 64 + this.y);
    this.g.draw.img(this.g.imgs['floor'], 64 + this.x, 64 + this.y + 4);

  }

}



