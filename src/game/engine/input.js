export default class Input {
  constructor(canvas, g) {
    let l = window.addEventListener;
    let s = this;

    this.c = canvas;
    this.g = g;
    this.keys = [];
    this.freshKeys = [];

    this.m = {
      x: g.w / 2, y: g.h / 2, click: 0,
      touches: [],
      w: 1, h: 1
    };

    l('keydown', (e) => {
      this.keys[e.code] = (this.keys[e.code])
        ? this.keys[e.code] += 1 : 1;
    });

    l('keyup', (e) => {
      this.keys[e.code] = 0;
      this.freshKeys[e.code] = 1;
    });

    l('mousemove', (e) => {
      this.trackMove(e);
    });

    l('mousedown', () => {
      this.m.click = 1;
    });

    l('mouseup', () => {
      this.m.click = 0;
    });

		l('touchstart', function(e) {
      s.touching = 1;
      e.preventDefault();
      s.trackTouch(e.touches);
		});

		l('touchmove', function(e) {
      e.preventDefault();
      s.trackTouch(e.touches);
		});

		l('touchend', function(e) {
      e.preventDefault();
      s.trackTouch(e.touches);
      s.touching = 0;
		});

    // l('touchstart',
    //   (e) => { this.trackTouch(e.touches); });
    //
    // l('touchend',
    //   (e) => { this.trackTouch(e.touches); });
    //
    // l('touchmove',
    //   (e) => { this.trackTouch(e.touches); });
  }


  trackMove(e) {
    let g = this.g,
      c = g.canvas.c,
      offsetY = c.offsetTop,
      offsetX = c.offsetLeft,
      scale = parseInt(c.style.width, 10) / c.width,
      x = ~~((e.pageX - offsetX) / scale),
      y = ~~((e.pageY - offsetY) / scale);

    x = x > g.w ? g.w : x;
    x = x < 0 ? 0 : x;

    y = y > g.h ? g.h : y;
    y = y < 0 ? 0 : y;

    this.m.x = ~~x;
    this.m.y = ~~y;
  }

  trackTouch(touches) {
    let g = this.g,
      c = g.canvas.c,
      offsetY = c.offsetTop,
      offsetX = c.offsetLeft,
      scale = parseInt(c.style.width, 10) / c.width,
      x, y, i;

    this.m.touches = [];

    for (i = 0; i < touches.length; i += 1) {
      if (i > 2) { break; }
      x = ~~((touches[i].pageX - offsetX) / scale);
      y = ~~((touches[i].pageY - offsetY) / scale);
      this.m.touches.push({x:x, y:y, w:1, h:1});
    }

  }

}
