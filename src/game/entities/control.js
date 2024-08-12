import { Sprite } from './sprite';

export class Control extends Sprite {
  constructor(g, o) {
    o.scale = 2;
    if (!('col' in o)) o.col = 7;
    if (!('clickCol' in o)) o.clickCol = 3;
    if (!o.i) {
      o.size = o.size || 1;
      o.w = o.w || 36;
      o.h = o.h || 10;
    }

    o.textCol = o.textCol || 2;
    o.hoverCol = o.hoverCol || 2;
    o.center = o.x === false;

    if (!g.imgs[`font_${o.textCol}`]) {
      g.imgs[`font_${o.textCol}`] = g.H.mkFont(g, 1, o.textCol);
    }
    if (!g.imgs[`font_${o.hoverCol}`]) {
      g.imgs[`font_${o.hoverCol}`] = g.H.mkFont(g, 1, o.hoverCol);
    }

    super(g, o);
    this.flip.x = !!o.flip;
    this.g = g;
    if (!o.i) {
      this.x = o.x || g.w / 2 - (o.w / 2);
      this.p = g.imgs[`font_${o.textCol}`];
      this.pHover = g.imgs[`font_${o.hoverCol}`];
      this.clicked = false;
      this.clickCol = o.clickCol;
      this.currentCol = o.col;
      this.clicked = false;
      this.textW = g.draw.textWidth(this.text, this.p) / 2;
      this.tX = o.x ? o.x + 20 : g.w / 2 - (this.textW);
    }
    this.origX = this.x;
    this.origY = o.y;
    if (!this.center) {
      this.tX = this.x + 4;
    }
  }

  update() {
    let hit = this.checkTouch() || this.checkClick() || this.checkKey();
    this.hover = this.intersects(this.g.input.m);
    this.currentCol = (this.hover)
      ? this.clickCol : this.col;
    if (hit && this.cb) {
      this.g.audio.play('TAP');

      this.cb.call(this);
    } else if (hit) {
      this.hurt = true;
      this.x = this.origX + 3;
      this.y = this.origY + 3;
    } else {
      this.hurt = false;
      this.x = this.origX;
      this.y = this.origY;
    }
  }

  render() {
    if (this.i) {
      super.render();
    } else {
      let font = (this.hover)
        ? this.pHover : this.p;

      this.g.draw.rect(this.x, this.y, this.w, this.h,
        this.currentCol);

      this.g.draw.text(this.text, font, this.tX, this.y + 2);
    }
  }

  intersects(m) {
    return (m.x > this.x && m.x < this.x + this.w
      && m.y > this.y && m.y < this.y + this.h);
  }

  checkKey() {
    if (this.key && this.g.input.keys[this.key] === true) {
      this.g.input.keys[this.key] = false;
      return true;
    }
  }

  checkClick() {
    let m = this.g.input.m;
    return m.click && this.hit(m);
  }

  checkTouch() {
    let touches = this.g.input.m.touches,
      i = touches.length;

    while (i--) {
      if (touches[i].x >= this.x && touches[i].x <= this.x + this.w) {
        return true;
      }
    }
    return false;
  }
}
