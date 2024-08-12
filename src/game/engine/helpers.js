export default {
  timeStamp() {
    return window.performance.now();
  },

  pad(nr, n=5){
    return Array(n-String(nr).length+1).join('0')+nr;
  },

  rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  rndArray(a) {
    return a[~~(Math.random() * a.length)];
  },

  getHi() {
    let hi = 250;
    try {
      let tmp = parseInt(localStorage.getItem('hi'), 10) || hi;
      return tmp;
    }
    catch(e) { return hi; }
    return hi;
  },

  setHi(v) {
    try {
      localStorage.setItem('hi', v);
    }
    catch(e) { return null; }
    return true;
  },

  mkCanvas(w, h) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');

    c.width = w;
    c.height = h;

    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    return c;
  },

  toggleFullScreen(el) {

  if (document.fullscreenElement) {
      document.exitFullscreen();
  } else {
      el.requestFullscreen();
    }

  },


  mkFont: function(g, size, col) {
    let font = g.draw.color(g.imgs['font'], g.data.pal[col], true);
    font.scale = size;
    return font;
  },
};
