(() => {
  // src/game/engine/loader.js
  var Loader = class {
    constructor(images, audio) {
      this.images = images;
      this.loaded = [];
      this.loadedImgs = 0;
      this.totalImgs = Object.keys(images).length;
      this.base = "";
      this.audio = audio;
      this.totalAudio = audio.length;
      window.AUDIO = [];
    }
    start() {
      const loader = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.loadImages(this.images);
        this.loadAudio();
      });
      return loader;
    }
    loadImages(i) {
      const append = "data:image/gif;base64,";
      Object.keys(i).forEach((n) => {
        this.loaded[n] = new Image();
        this.loaded[n].onload = (e) => {
          this.loadedImage();
        };
        this.loaded[n].src = append + i[n];
      });
    }
    loadAudio() {
      this.audioLoaded = 0;
      this.audio.forEach((file) => {
        let audio = new Audio();
        audio.addEventListener(
          "canplaythrough",
          (e) => {
            this.loadedAudio();
          },
          false
        );
        audio.src = this.base + file;
        window.AUDIO.push(audio);
      });
    }
    loadedAudio() {
      this.totalAudio += 1;
      this.checkLoaded();
    }
    loadedImage() {
      this.loadedImgs += 1;
      this.checkLoaded();
    }
    checkLoaded() {
      if (this.loadedImgs === this.totalImgs && this.audio.length === this.totalAudio) {
        setTimeout(() => this.resolve(this.loaded), 25);
      }
    }
  };

  // src/game/engine/canvas.js
  var Canvas = class {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.c = document.getElementsByTagName("canvas")[0];
      this.ctx = this.c.getContext("2d", { alpha: false });
      this.c.width = w;
      this.c.height = h;
      this.c.style.width = `${w}px`;
      this.c.style.height = `${h}px`;
      window.addEventListener("resize", () => {
        this.resize();
      });
      window.addEventListener("fullscreenchange", () => {
        this.resize();
      });
      this.resize();
      return {
        c: this.c,
        ctx: this.ctx
      };
    }
    resize() {
      const widthToHeight = this.w / this.h;
      const style = this.c.style;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;
      const newWidthToHeight = newWidth / newHeight;
      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        style.height = `${newHeight}px`;
        style.width = `${newWidth}px`;
      } else {
        newHeight = newWidth / widthToHeight;
        style.width = `${newWidth}px`;
        style.height = `${newHeight}px`;
      }
      style.marginTop = `${-newHeight / 2}px`;
      style.marginLeft = `${-newWidth / 2}px`;
      style.transformOrigin = "0 0";
      style.transform = "scale(1)";
    }
  };

  // src/game/engine/helpers.js
  var helpers_default = {
    timeStamp() {
      return window.performance.now();
    },
    pad(nr, n = 5) {
      return Array(n - String(nr).length + 1).join("0") + nr;
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
        let tmp = parseInt(localStorage.getItem("hi"), 10) || hi;
        return tmp;
      } catch (e) {
        return hi;
      }
      return hi;
    },
    setHi(v) {
      try {
        localStorage.setItem("hi", v);
      } catch (e) {
        return null;
      }
      return true;
    },
    mkCanvas(w, h) {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
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
      let font = g.draw.color(g.imgs["font"], g.data.pal[col], true);
      font.scale = size;
      return font;
    }
  };

  // src/game/engine/draw.js
  var Draw = class {
    constructor(c, ctx, pal) {
      this.pal = pal;
      this.c = c;
      this.ctx = ctx;
    }
    clear(colorKey) {
      let raw = this.pal[colorKey];
      this.ctx.fillStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    }
    rect(x, y, w, h, colorKey) {
      let raw = this.pal[colorKey];
      this.ctx.fillStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      this.ctx.fillRect(~~x, ~~y, w, h);
    }
    img(i, x, y, scale = false, o2 = false) {
      if (o2) {
        this.ctx.globalAlpha = o2;
      }
      if (scale) {
        i = this.resize(i, scale);
      }
      this.ctx.drawImage(i, ~~x, ~~y);
      if (o2) {
        this.ctx.globalAlpha = 1;
      }
    }
    rotate(i, a) {
      let c = document.createElement("canvas"), ctx = c.getContext("2d"), size = Math.max(i.width, i.height);
      c.width = size;
      c.height = size;
      ctx.translate(size / 2, size / 2);
      ctx.rotate(a + Math.PI / 2);
      ctx.drawImage(i, -(i.width / 2), -(i.height / 2));
      return c;
    }
    flip(i, flipH, flipV) {
      let c = helpers_default.mkCanvas(i.width, i.height), ctx = c.getContext("2d"), scaleH = flipH ? -1 : 1, scaleV = flipV ? -1 : 1, posX = flipH ? i.width * -1 : 0, posY = flipV ? i.height * -1 : 0;
      c.width = i.width;
      c.height = i.height;
      ctx.save();
      ctx.scale(scaleH, scaleV);
      ctx.drawImage(i, posX, posY, i.width, i.height);
      ctx.restore();
      return c;
    }
    resize(i, factor, o2 = 1) {
      let c = helpers_default.mkCanvas(i.width * factor, i.height * factor), ctx = c.getContext("2d");
      if (c.width) {
        ctx.save();
        ctx.scale(factor, factor);
        if (o2 < 1) {
          this.ctx.globalAlpha = o2;
        }
        ctx.drawImage(i, 0, 0);
        if (o2 < 1) {
          this.ctx.globalAlpha = 1;
        }
        ctx.restore();
      }
      c.scale = factor;
      return c;
    }
    color(i, col) {
      const c = helpers_default.mkCanvas(i.width, i.height), ctx = c.getContext("2d");
      let p = 0, imageData;
      ctx.drawImage(i, 0, 0);
      imageData = ctx.getImageData(0, 0, i.width, i.height);
      for (p = 0; p < imageData.data.length; p += 4) {
        imageData.data[p + 0] = col[0];
        imageData.data[p + 1] = col[1];
        imageData.data[p + 2] = col[2];
      }
      ctx.putImageData(imageData, 0, 0);
      return c;
    }
    textWidth(s, f) {
      return s.length * (3 * f.scale) + s.length * (1 * f.scale);
    }
    text(s, f, x, y) {
      let i = 0, ctx = this.ctx, firstChar = 65, offset = 0, w = 3 * f.scale, h = 5 * f.scale, spacing = 1 * f.scale, sW = this.textWidth(s, f), charPos = 0;
      const nums = "0123456789".split("");
      if (typeof s === "number" || s[0] === "0") {
        s += "";
        offset = 43;
      }
      x = x || (this.c.width - sW) / 2;
      for (i = 0; i < s.length; i += 1) {
        if (typeof s[i] === "number" || s[i] === "0" || nums.indexOf(s[i]) !== -1) {
          offset = 43;
        } else {
          offset = 0;
        }
        charPos = (s.charCodeAt(i) - firstChar + offset) * (w + spacing);
        if (s[i] === "?") {
          charPos = 144;
        }
        if (s[i] === ":") {
          charPos = 148;
        }
        if (s[i] === "%") {
          charPos = 152;
        }
        if (charPos > -1) {
          ctx.drawImage(
            f,
            charPos,
            0,
            w,
            h,
            ~~x,
            ~~y,
            w,
            h
          );
        }
        x += w + spacing;
      }
    }
  };

  // src/game/engine/input.js
  var Input = class {
    constructor(canvas, g) {
      let l = window.addEventListener;
      let s = this;
      this.c = canvas;
      this.g = g;
      this.keys = [];
      this.freshKeys = [];
      this.m = {
        x: g.w / 2,
        y: g.h / 2,
        click: 0,
        touches: [],
        w: 1,
        h: 1
      };
      l("keydown", (e) => {
        this.keys[e.code] = this.keys[e.code] ? this.keys[e.code] += 1 : 1;
      });
      l("keyup", (e) => {
        this.keys[e.code] = 0;
        this.freshKeys[e.code] = 1;
      });
      l("mousemove", (e) => {
        this.trackMove(e);
      });
      l("mousedown", () => {
        this.m.click = 1;
      });
      l("mouseup", () => {
        this.m.click = 0;
      });
      l("touchstart", function(e) {
        s.touching = 1;
        e.preventDefault();
        s.trackTouch(e.touches);
      });
      l("touchmove", function(e) {
        e.preventDefault();
        s.trackTouch(e.touches);
      });
      l("touchend", function(e) {
        e.preventDefault();
        s.trackTouch(e.touches);
        s.touching = 0;
      });
    }
    trackMove(e) {
      let g = this.g, c = g.canvas.c, offsetY = c.offsetTop, offsetX = c.offsetLeft, scale = parseInt(c.style.width, 10) / c.width, x = ~~((e.pageX - offsetX) / scale), y = ~~((e.pageY - offsetY) / scale);
      x = x > g.w ? g.w : x;
      x = x < 0 ? 0 : x;
      y = y > g.h ? g.h : y;
      y = y < 0 ? 0 : y;
      this.m.x = ~~x;
      this.m.y = ~~y;
    }
    trackTouch(touches) {
      let g = this.g, c = g.canvas.c, offsetY = c.offsetTop, offsetX = c.offsetLeft, scale = parseInt(c.style.width, 10) / c.width, x, y, i;
      this.m.touches = [];
      for (i = 0; i < touches.length; i += 1) {
        if (i > 2) {
          break;
        }
        x = ~~((touches[i].pageX - offsetX) / scale);
        y = ~~((touches[i].pageY - offsetY) / scale);
        this.m.touches.push({ x, y, w: 1, h: 1 });
      }
    }
  };

  // src/lib/jsfxr.js
  function SfxrParams() {
    this.set = function(r) {
      for (var a = 0; 24 > a; a++)
        this[String.fromCharCode(97 + a)] = r[a] || 0;
      this.c < 0.01 && (this.c = 0.01);
      var e = this.b + this.c + this.e;
      if (0.18 > e) {
        var s = 0.18 / e;
        this.b *= s, this.c *= s, this.e *= s;
      }
    };
  }
  function SfxrSynth() {
    var r = this;
    this._params = new SfxrParams();
    var a, e, s, t, n, i, h, f, c, v, o2, u;
    r.r = function() {
      var a2 = r._params;
      t = 100 / (a2.f * a2.f + 1e-3), n = 100 / (a2.g * a2.g + 1e-3), i = 1 - a2.h * a2.h * a2.h * 0.01, h = -a2.i * a2.i * a2.i * 1e-6, a2.a || (o2 = 0.5 - a2.n / 2, u = 5e-5 * -a2.o), f = 1 + a2.l * a2.l * (a2.l > 0 ? -0.9 : 10), c = 0, v = 1 == a2.m ? 0 : (1 - a2.m) * (1 - a2.m) * 2e4 + 32;
    }, r.tr = function() {
      r.r();
      var t2 = r._params;
      return a = t2.b * t2.b * 1e5, e = t2.c * t2.c * 1e5, s = t2.e * t2.e * 1e5 + 12, 3 * ((a + e + s) / 3 | 0);
    }, r.s = function(b, m) {
      var w = r._params, y = 1 != w.s || w.v, k = w.v * w.v * 0.1, p = 1 + 3e-4 * w.w, g = w.s * w.s * w.s * 0.1, x = 1 + 1e-4 * w.t, S = 1 != w.s, d = w.x * w.x, l = w.g, A = w.q || w.r, q = w.r * w.r * w.r * 0.2, M = w.q * w.q * (w.q < 0 ? -1020 : 1020), _ = w.p ? ((1 - w.p) * (1 - w.p) * 2e4 | 0) + 32 : 0, U = w.d, j = w.j / 2, C = w.k * w.k * 0.01, P = w.a, z = a, B = 1 / a, D = 1 / e, E = 1 / s, F = 5 / (1 + w.u * w.u * 20) * (0.01 + g);
      F > 0.8 && (F = 0.8), F = 1 - F;
      for (var G, H2, I, J, K, L, N = false, O = 0, Q = 0, R = 0, T = 0, V = 0, W2 = 0, X = 0, Y = 0, Z = 0, $ = 0, rr = new Array(1024), ar = new Array(32), er = rr.length; er--; )
        rr[er] = 0;
      for (var er = ar.length; er--; )
        ar[er] = 2 * Math.random() - 1;
      for (var er = 0; m > er; er++) {
        if (N)
          return er;
        if (_ && ++Z >= _ && (Z = 0, r.r()), v && ++c >= v && (v = 0, t *= f), i += h, t *= i, t > n && (t = n, l > 0 && (N = true)), H2 = t, j > 0 && ($ += C, H2 *= 1 + Math.sin($) * j), H2 |= 0, 8 > H2 && (H2 = 8), P || (o2 += u, 0 > o2 ? o2 = 0 : o2 > 0.5 && (o2 = 0.5)), ++Q > z)
          switch (Q = 0, ++O) {
            case 1:
              z = e;
              break;
            case 2:
              z = s;
          }
        switch (O) {
          case 0:
            R = Q * B;
            break;
          case 1:
            R = 1 + 2 * (1 - Q * D) * U;
            break;
          case 2:
            R = 1 - Q * E;
            break;
          case 3:
            R = 0, N = true;
        }
        A && (M += q, I = 0 | M, 0 > I ? I = -I : I > 1023 && (I = 1023)), y && p && (k *= p, 1e-5 > k ? k = 1e-5 : k > 0.1 && (k = 0.1)), L = 0;
        for (var sr = 8; sr--; ) {
          if (X++, X >= H2 && (X %= H2, 3 == P))
            for (var tr = ar.length; tr--; )
              ar[tr] = 2 * Math.random() - 1;
          switch (P) {
            case 0:
              K = o2 > X / H2 ? 0.5 : -0.5;
              break;
            case 1:
              K = 1 - X / H2 * 2;
              break;
            case 2:
              J = X / H2, J = 6.28318531 * (J > 0.5 ? J - 1 : J), K = 1.27323954 * J + 0.405284735 * J * J * (0 > J ? 1 : -1), K = 0.225 * ((0 > K ? -1 : 1) * K * K - K) + K;
              break;
            case 3:
              K = ar[Math.abs(32 * X / H2 | 0)];
          }
          y && (G = W2, g *= x, 0 > g ? g = 0 : g > 0.1 && (g = 0.1), S ? (V += (K - W2) * g, V *= F) : (W2 = K, V = 0), W2 += V, T += W2 - G, T *= 1 - k, K = T), A && (rr[Y % 1024] = K, K += rr[(Y - I + 1024) % 1024], Y++), L += K;
        }
        L *= 0.125 * R * d, b[er] = L >= 1 ? 32767 : -1 >= L ? -32768 : 32767 * L | 0;
      }
      return m;
    };
  }
  var synth = new SfxrSynth();
  var jsfxr = function(r) {
    synth._params.set(r);
    var a = synth.tr(), e = new Uint8Array(4 * ((a + 1) / 2 | 0) + 44), s = 2 * synth.s(new Uint16Array(e.buffer, 44), a), t = new Uint32Array(e.buffer, 0, 44);
    t[0] = 1179011410, t[1] = s + 36, t[2] = 1163280727, t[3] = 544501094, t[4] = 16, t[5] = 65537, t[6] = 44100, t[7] = 88200, t[8] = 1048578, t[9] = 1635017060, t[10] = s, s += 44;
    for (var n = 0, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = "data:audio/wav;base64,"; s > n; n += 3) {
      var f = e[n] << 16 | e[n + 1] << 8 | e[n + 2];
      h += i[f >> 18] + i[f >> 12 & 63] + i[f >> 6 & 63] + i[63 & f];
    }
    return h;
  };
  var jsfxr_default = jsfxr;

  // src/game/engine/audio.js
  var Audio2 = {
    init(g, sfx) {
      let w = window, ACtx = w.AudioContext || w.webkitAudioContextx;
      this.ctx = ACtx ? new ACtx() : false;
      this.g = g;
      if (this.ctx) {
        this.encode(sfx);
      }
    },
    encode(sfx) {
      let s = this;
      s.sounds = [];
      const convert = (data) => {
        let len, bytes, i;
        data = jsfxr_default(data);
        data = atob(data.substr(data.indexOf(",") + 1));
        len = data.length;
        bytes = new Uint8Array(len);
        for (i = 0; i < len; i++) {
          bytes[i] = data.charCodeAt(i);
        }
        return bytes.buffer;
      };
      const decode = (n) => {
        s.ctx.decodeAudioData(convert(sfx[n]), (b) => {
          s.sounds[n] = b;
        });
      };
      Object.keys(sfx).forEach((n) => {
        decode(n);
      });
    },
    play(sfx) {
      if (this.g.mute)
        return;
      if (this.ctx && this.sounds[sfx]) {
        let source = this.ctx.createBufferSource();
        source.buffer = this.sounds[sfx];
        source.connect(this.ctx.destination);
        source.start(0);
      }
    }
  };
  var audio_default = Audio2;

  // src/game/engine/shake.js
  var Shake = class {
    constructor(c, rnd, skip = false) {
      this.c = c;
      this.rnd = rnd;
      this.skip = skip;
      this.ttl = 0;
      this.mag = 0;
    }
    start(mag, ttl) {
      this.mag = mag;
      this.ttl = ttl;
      this.l = (window.innerWidth - this.c.style.width) / 2;
      this.startX = parseInt(this.c.style.marginLeft, 10);
      this.startY = parseInt(this.c.style.marginTop, 10);
    }
    update(step) {
      if (this.skip)
        return;
      let c = this.c, m = this.rnd(-this.mag, this.mag), x, y;
      this.ttl -= step;
      if (this.ttl === 0) {
        x = this.startX;
        y = this.startY;
      } else if (this.ttl > 0) {
        x = this.startX + m;
        y = this.startY + m;
      }
      c.style.marginLeft = `${x}px`;
      c.style.marginTop = `${y}`;
    }
  };

  // src/lib/stats.js
  var Stats = function() {
    var mode = 0;
    var container = document.createElement("div");
    container.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
    document.body.appendChild(container);
    container.addEventListener("click", function(event) {
      event.preventDefault();
      showPanel(++mode % container.children.length);
    }, false);
    function addPanel(panel) {
      container.appendChild(panel.dom);
      return panel;
    }
    function showPanel(id) {
      for (var i = 0; i < container.children.length; i++) {
        container.children[i].style.display = i === id ? "block" : "none";
      }
      mode = id;
    }
    var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
    var fpsPanel = addPanel(new Stats.Panel("FPS", "#0ff", "#002"));
    var msPanel = addPanel(new Stats.Panel("MS", "#0f0", "#020"));
    if (self.performance && self.performance.memory) {
      var memPanel = addPanel(new Stats.Panel("MB", "#f08", "#201"));
    }
    showPanel(0);
    return {
      REVISION: 16,
      dom: container,
      addPanel,
      showPanel,
      begin: function() {
        beginTime = (performance || Date).now();
      },
      end: function() {
        frames++;
        var time = (performance || Date).now();
        msPanel.update(time - beginTime, 200);
        if (time >= prevTime + 1e3) {
          fpsPanel.update(frames * 1e3 / (time - prevTime), 100);
          prevTime = time;
          frames = 0;
          if (memPanel) {
            var memory = performance.memory;
            memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
          }
        }
        return time;
      },
      update: function() {
        beginTime = this.end();
      },
      // Backwards Compatibility
      domElement: container,
      setMode: showPanel
    };
  };
  Stats.Panel = function(name, fg, bg) {
    var min = Infinity, max = 0, round = Math.round;
    var PR = round(window.devicePixelRatio || 1);
    var WIDTH = 80 * PR, HEIGHT = 48 * PR, TEXT_X = 3 * PR, TEXT_Y = 2 * PR, GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR, GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;
    var canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = "width:80px;height:48px";
    var context = canvas.getContext("2d");
    context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif";
    context.textBaseline = "top";
    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    return {
      dom: canvas,
      update: function(value, maxValue) {
        min = Math.min(min, value);
        max = Math.max(max, value);
        context.fillStyle = bg;
        context.globalAlpha = 1;
        context.fillRect(0, 0, WIDTH, GRAPH_Y);
        context.fillStyle = fg;
        context.fillText(round(value) + " " + name + " (" + round(min) + "-" + round(max) + ")", TEXT_X, TEXT_Y);
        context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - value / maxValue) * GRAPH_HEIGHT));
      }
    };
  };
  var stats_default = Stats;

  // src/game/engine/game.js
  var Game = class {
    constructor(o2) {
      let ua = navigator.userAgent.toLowerCase();
      this.mobile = "createTouch" in document || false;
      this.android = ua.indexOf("android") > -1;
      this.ios = /ipad|iphone|ipod/.test(ua);
      this.firefox = ua.indexOf("firefox") > -1;
      this.data = o2;
      this.w = o2.w;
      this.h = o2.h;
      this.dt = 0;
      this.fps = 60;
      this.frameStep = 1 / this.fps;
      this.frameCurr = 0;
      this.framePrev = helpers_default.timeStamp();
      this.stateName = o2.start;
      this.H = helpers_default;
      this.states = o2.states;
      this.availEnts = o2.ents;
      this.mute = false;
      this.score = 0;
      this.hiScore = 200;
      this.plays = 0;
      this.pause = false;
      this.production = window.BUILD || false;
      this.ents = [];
      this.imgs = [];
      this.fonts = [];
      this.events = [];
      this.init();
      window.G = this;
    }
    init() {
      const loader = new Loader(this.data.i, this.data.audio);
      document.title = this.data.title;
      this.canvas = new Canvas(this.data.w, this.data.h);
      this.canvas.c.style.cursor = "none";
      this.draw = new Draw(this.canvas.c, this.canvas.ctx, this.data.pal);
      this.input = new Input(this.canvas.c, this);
      this.shake = new Shake(this.canvas.c, this.H.rnd, this.ios);
      this.audio = { play() {
      } };
      this.music = { play() {
      }, stop() {
      }, pause() {
      } };
      loader.start().then((res) => {
        this.imgs = res;
        this.data.scale.forEach((k) => {
          this.scaleUp(k);
        });
        document.getElementById("l").style.display = "none";
        this.changeState(this.stateName);
        this.canvas.c.style.display = "block";
        this.initAudio();
        const bee = this.draw.resize(this.imgs.bee, 16);
        this.favIcon(bee);
        if (!this.production) {
          this.stats = new stats_default();
          this.stats.showPanel(0);
        }
        this.loop();
        window.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          return false;
        });
      });
    }
    initAudio() {
      this.audio = audio_default;
      this.audio.init(this, this.data.sfx);
    }
    scaleUp(key) {
      let i = 3;
      while (i--) {
        let cols = this.data.pal.length;
        while (cols--) {
          let img = this.draw.color(this.imgs[key], this.data.pal[cols]);
          this.imgs[`${key}_${i}_${cols}`] = this.draw.resize(img, i);
        }
      }
    }
    favIcon(i) {
      let c = document.createElement("canvas"), ctx = c.getContext("2d"), l = document.createElement("link");
      c.width = 64;
      c.height = 64;
      ctx.drawImage(i, 0, 0);
      l.type = "image/x-icon";
      l.rel = "shortcut icon";
      l.href = c.toDataURL("image/x-icon");
      document.getElementsByTagName("head")[0].appendChild(l);
    }
    changeState(state, o2 = {}) {
      this.ents = [];
      this.events = [];
      this.state = new this.states[state](this, o2);
      this.music.stop();
      this.state.init();
    }
    loop() {
      if (!this.production) {
        this.stats.begin();
      }
      this.frameCurr = helpers_default.timeStamp();
      this.dt = this.dt + Math.min(1, (this.frameCurr - this.framePrev) / 1e3);
      while (this.dt > this.frameStep) {
        this.dt = this.dt - this.frameStep;
        this.update(this.frameStep);
      }
      this.render(this.dt);
      this.framePrev = this.frameCurr;
      if (this.input.freshKeys.KeyF) {
        this.H.toggleFullScreen(this.canvas.c);
      }
      if (this.input.freshKeys.KeyP) {
        this.pause = !this.pause;
      }
      if (this.input.freshKeys.KeyS) {
        var canvas = document.getElementById("game");
        var dataURL = canvas.toDataURL("image/png");
        var newTab = window.open("about:blank", "screenShot");
        newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
      }
      if (this.input.freshKeys.KeyM) {
        this.mute = !this.mute;
        if (this.mute && this.mainMusic) {
          this.mainMusic.pause();
        } else if (this.mainMusic) {
          this.mainMusic.play();
        }
      }
      this.input.freshKeys = [];
      if (!this.production) {
        this.stats.end();
      }
      requestAnimationFrame(() => this.loop());
    }
    update(step) {
      if (this.pause)
        return;
      this.fader = Math.sin((/* @__PURE__ */ new Date()).getTime() * 5e-3);
      this.runEvents(step);
      this.state.update(step);
      this.shake.update(step);
      let i = this.ents.length;
      while (i--) {
        if (this.ents[i].remove) {
          this.ents.splice(i, 1);
        }
      }
    }
    render(step) {
      this.state.render(step);
    }
    spawn(ent, opts) {
      const sprite = new this.availEnts[ent](this, opts);
      this.ents.push(sprite);
      return sprite;
    }
    boom(x, y, col = 7, num = 4, m = 2) {
      this.audio.play("BOOM");
      if (m) {
        this.shake.start(m / 2, 0.5);
      }
      this.spawn("Boom", { x, y, m, col });
      this.burst(x, y, col, num);
    }
    burst(x, y, col, num, w = 1) {
      while (num--) {
        this.ents.push(new this.availEnts.Particle(this, {
          x,
          y,
          col,
          w
        }));
      }
    }
    addEvent(e) {
      this.events.push(e);
    }
    runEvents(step) {
      let i = this.events.length;
      while (i--) {
        let e = this.events[i];
        if (!e) {
          break;
        }
        e.t -= step * 100;
        if (e.t < 0) {
          e.cb.call(this);
          this.events.splice(i, 1);
        }
      }
    }
  };

  // src/game/data/images.js
  var images_default = { "bee": "R0lGODlhAwACAKEDAC9ITeuJMJ2dnf///yH5BAEKAAMALAAAAAADAAIAAAIEnBYQBQA7", "bee1": "R0lGODlhAwAEAKEDAAAAALLc7/fiazGi8iH5BAEKAAMALAAAAAADAAQAAAIHnBYQNgNTAAA7", "bg": "R0lGODlhQABAAKECABsmMi9ITvfia/fiayH5BAEKAAIALAAAAABAAEAAAAL+hB2nmHvRHIAS1RldXrR2+WlXqEAbQ6InlrKgqZmhDD90duN0edtRJ7OphKxfo4YZqkg9XtCJXHJ20FfrOb1qW5PRiuEdhT3jV1nk+UZ9K2w11l5L2UwqfdNc4o0oogvcB/iXNPhRt5anl4XoVpQiV2QVtyVJlnY2JXZpabbZCYLpUwk3OTkKtdeY6Jh6iGVoxBdIWChLi7Saa6eIuvi4VXrqJFwS6hej+YmmnOm5jGxFrLQYTUra6pqN7YvnhxvrDRsuKohtzu2L3ktt3Z4lHQnNzJMsb0/v3Ayaj8/u//bO3Tped9QVPHjniLhZsGx9YwiOjkGCFB1NnAUwI5vDav+K8Tum71lIDsYE3fM4D+NGgSsDdrSI6lzMdDPHQSR3a2FOnIYu6lIFNGgwltOGER00st/JByVpJQWplORHky01FsVpFWbFn4zccCX08KbYWmOj7GLl86zas0irur2qEq6FqU6fzk15dynVqCj1QmokF3BbuGuFaqOJcGdZnWEVk63L9fDArX8rA+OYlUtdvlCZ0v2yufNez3hDCz5tGZ5hmYm1Uk7AOLbD2OFsuUZbs3VhOZaHvhwcTyTn0cS75CsAADs=", "bg2": "R0lGODlhQABAAMIFABMbJBUeKBgiLRsmMhwpNDGi8jGi8jGi8iH5BAEKAAcALAAAAABAAEAAAAP+CLoQ/CrISau9OMO2lRBDKI5kaQ7ZtTnL535nLJ/p+t7wrOsaA4Y41244rPhIQaKSN2mZbsuorCKtWifWbBSr7e643nBMIi6byOZ0CD0iDNzqayCuhM/Y9JnbPp7nxXh/WoGCcoVdYIdViYpbhI1Kj5BFfpOOllKSmJtAL0+em0kjomd5QTkDpz8llWmqMK+rIppdsamvrK1mtrYktG1RvLi+uid7waciqmfFuzhIzzSCUNSg0o2kPNjJX81qvXfersPhh+AifCi/Yuc06+zc4eLf0Uzz9EKU95wjjPx9+/6pC/jPH6R07gghjHNM3jtOVAQCfLgposRcFC4yy6gxkRhHKVBKhFySAdnITif1pdixDGU9lSkwKMPVzmHMFLFYdGggc+DNnxJ2RhDKEyiFBAA7", "bg_1": "R0lGODlhQAAVAIABABsmMv///yH5BAEKAAEALAAAAABAABUAAAKRjI+pywt9HpxAzhtqexzv6GVJZSlkyFglNWqpy36iaZRr55CreY8zjzjVMDuerVfMHCUwSDK49BWF0N9QGUkym83aCQZWcbfZlBfX1VHD0OU46D3P0uqs2C7WVctqDRm/5iJUd/YVJ9fH0VdY9+Wol/jIGElZ+ahoCemXydnp+QkaKjpKWmp6ipqqusra6mpaAAA7", "bg_hills": "R0lGODlhQABAAIABABsmMv///yH5BAEKAAEALAAAAABAAEAAAAKNjI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jec6BPT9fvAJJz9NkSccIo8WpSMJXQIw0Qb0+kxertgAV2sFV77kcthJKauxbHFXsY7Lh2bE/I7/BvP8/tQPGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKjpKWmp6ipoahVoAADs=", "bg_roof": "R0lGODlhQAAIAKEAAEk8K6RkIkk8K0k8KyH5BAEKAAIALAAAAABAAAgAAAIwhI+py+2/AjxS1YlpBne77oXiGJTmiYKi6gnuC8dCSptjhMj6zrt1vekJh0TfL1UAADs=", "bg_sky": "R0lGODlhQAAUAIAAAP///////yH5BAEKAAEALAAAAABAABQAAAI1hI+py+0Po5y02ouz3hyHD4biSJbmiabqypbdC8fyTNdxi+f6zuP2D3z1hsSi8YhMKpfMYQEAOw==", "bg_thorns": "R0lGODlhQAAKAIABAC9ITr4mMyH5BAEKAAEALAAAAABAAAoAAAJVjI+py+1vQJKw2htpxHxq+wFfMHaKVj7jCqUOJR6xSyKxLef65G11BgzdRMQNKoO6kYq+IO6XHBJhSqo1+pz+fDDkbPoNL8Pk4RgMXJ7B7Lb7DY+3CwA7", "bg_tree_tops": "R0lGODlhQABAAIABABsmMr4mMyH5BAEKAAEALAAAAABAAEAAAAJyhI+py+0Po5y02ouz3rz7D4biCAZOgG6mkk4tgsayvMTsa9CRns/+DwwCe7dZT4hMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4yFQAADs=", "bg_trees": "R0lGODlhQABAAIABABsmMr4mMyH5BAEKAAEALAAAAABAAEAAAAL+hI+py+0Po5y02ouz3rz7D4biSDZByQXqCazusjLsMVe1y+Ivrd86b1A9hC1csOf78YxHZK3ZgzKlseWu6FQ4c0iE0vvNwsRiKtFsjSbKZezUXYV/08x2lz7bPuU7uxptdoVX5TdnuKVFdhcINqWXeFf49ve4pvhH13hVqakkKUiJaBmKucg3GIfKVcrqKNpZZyob9joa2zo5x3emGpiU69rmu/q2a3vG2bv7C0orvEwMLB2XPOwLy0tqar2MzYxcy/2Zqo0pPnsYvA096I2tuif6nL4Zzt7djpc/Fok+DT7vEr1m6szdG5fN2Tp5/giSs8cQl0NqEAX+S1hQ10Fvg3LeDdujDx8jWPAgqUH4LU/FfhIfZiy2sSXGegFZDnRJc6HFiTgp1jzZsCdAnTYvpix57NbNmT6JApV59KNJT0GZDjUYcWlUaPF2CrWq8idVqB65TlVqtGy1mFrVrnzaNqTZpH2qbl2bNa1cFwUAADs=", "bullet": "R0lGODlhAgABAKECAL4mM+uJMP///////yH5BAEKAAIALAAAAAACAAEAAAICDAoAOw==", "cave_bg_teeth": "R0lGODlhQABAAIABAP///0k8KyH5BAEKAAEALAAAAABAAEAAAAL+hI+py+0Po5y02tsC0yrw8yVhRoqLNwKemKIde44uK8+Gfa+Ijee6H0L9VLiecDc7gpTEovDzBAaVTw2zyqkuo02XtqvDcrFgr5iM1p7N6vT6bW3D5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKopX5lcalXfKJyVXx2qqmnX32rf1tVZq+6fr5Eobi/vLuyKGNDY7TINKlgzMzKtM9QVNexbdwlXWke02zbp9la1rfFQMnqL9fX59GjNEDiVuu/7qjg427m5PTd8PlIGOCb59BOdtCPiuy8GEW5QBPOiPHMAaDEFAPDHRQY8hJho3lLj4EQYGjw9HmsQY8qRKFStbQrjnMqbMmTRrKigAADs=", "cherry": "R0lGODlhCAAIAKEDAL4mM0SJGuBvizGi8iH5BAEKAAMALAAAAAAIAAgAAAISnBd5yBcGgBtARCqjtrnf9R0FADs=", "circle": "R0lGODlhCAAIAIABAP///zGi8iH5BAEKAAEALAAAAAAIAAgAAAIMTIBgl8gNo5wvrWYKADs=", "cloud1": "R0lGODlhDwALAMIEAOz9//f7/v3//v7//////////////////yH5BAEKAAcALAAAAAAPAAsAAAMYeErcAyqeRokIclaaN19eKI5kaZ6VRh4JADs=", "cloud2": "R0lGODlhCAAHAKECAPT///f//////////yH5BAEKAAMALAAAAAAIAAcAAAIPnIFmIQ3a4mAx0ipuNXgUADs=", "creep": "R0lGODlhCAAEAKEDAL4mM6POJ/////fiayH5BAEKAAMALAAAAAAIAAQAAAIMXDKZAWyHxGltxVAAADs=", "dot": "R0lGODlhAQABAIABAP///zGi8iH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==", "eye": "R0lGODlhBAAEAKECAJ2dnf////fia/fiayH5BAEKAAIALAAAAAAEAAQAAAIGVGKnAdYFADs=", "fly": "R0lGODlhCQACAMICAEk8Ky9ITb4mM0SJGr4mM74mM74mM74mMyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAQALAAAAAAJAAIAAAMKKBEyIwAs4kgkCQA7", "font": "R0lGODlhmwAFAIABAAAAAEk8KyH5BAEKAAEALAAAAACbAAUAAAJ4hGOAd6sZFpowPhrxhZz5x2ji5pRTyVEfulaWRV6vfNayksV5O/b53NMBcbjX0JY50pYwkFHDAxGTTlsUpZIadRViYzo1tVazcfHHRSOVWx9UyKK2wym6+nRei47PtkTbAbgTc1X3VvOXtfXFhkfmpVUWqZiSZFkAADs=", "ground_grass1": "R0lGODlhQAAHAMIHAAAAAEk8K0WJGlCBKEaDNffia+Bvi////yH5BAEKAAcALAAAAABAAAcAAAM+eHq2/jDCIqt14mqZt1/d12jhR10lRBBPCglwDG9uJsftrc9RHPy/G2cnAAKJsIHRiCwunwPkc0qtWq9YagIAOw==", "heart": "R0lGODlhBQAFAIABAL4mMzGi8iH5BAEKAAEALAAAAAAFAAUAAAIIDGygu3mBQgEAOw==", "help": "R0lGODlhCAAIAIABAOBvizGi8iH5BAEKAAEALAAAAAAIAAgAAAIPTIBgl8jLnGwqpmidaaYAADs=", "hex": "R0lGODlhCwAKAKECABsmMi9ITv///////yH5BAEKAAIALAAAAAALAAoAAAIalINoi+B6gpuqTWov1jdxUEldwIgguQgJJBQAOw==", "melon": "R0lGODlhBgAGAMIEAAAAAL4mM0SJGv///zGi8jGi8jGi8jGi8iH5BAEKAAQALAAAAAAGAAYAAAMOGLoToKMxIYeg0ZJ7SQIAOw==", "pointer": "R0lGODlhBAAFAKECAAAAAP////fia/fiayH5BAEKAAIALAAAAAAEAAUAAAIIjGWAEKIsIigAOw==", "progress": "R0lGODdhQAABAIABAP///74mMywAAAAAQAABAAACB4SPqcvtXQAAOw==", "shroom": "R0lGODlhCAAKAKEAAL4mM+Bvi////74mMyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAMALAAAAAAIAAoAAAIVHDIToOAPl5PzJZEGvnnrDnLiN2IFADs=", "skull": "R0lGODlhBAAEAIABAOBvizGi8iH5BAEKAAEALAAAAAAEAAQAAAIFhB2Ql1kAOw==", "spike": "R0lGODlhAwAQAIABAKRkIkk8KyH5BAEKAAEALAAAAAADABAAAAIMDGJ4yesKmzqg2loAADs=", "spike2": "R0lGODlhAwAIAIABAKRkIkk8KyH5BAEKAAEALAAAAAADAAgAAAIIDGJ4aQcPXwEAOw==", "splat0": "R0lGODlhBgAGAIABAAAAAPfiayH5BAEKAAEALAAAAAAGAAYAAAIKRI4WuqD+HjquAAA7", "splat1": "R0lGODlhBgAGAIABAAAAAPfiayH5BAEKAAEALAAAAAAGAAYAAAIKRI4Ba63KkDmTFgA7", "splat2": "R0lGODlhBgAGAIABAAAAAPfiayH5BAEKAAEALAAAAAAGAAYAAAIKjA0Be8vqWlJHFQA7", "star": "R0lGODlhBgADAKECAOuJMffia74mM74mMyH5BAEKAAIALAAAAAAGAAMAAAIHFGwQF4IHCgA7", "star2": "R0lGODlhBAAEAIABAPfiazGi8iH5BAEKAAEALAAAAAAEAAQAAAIGDGKgaQgFADs=", "stars": "R0lGODlhQAArAIABAP////fiayH5BAEKAAEALAAAAABAACsAAAJVjI+py+0Po5y02ouz3rz7D1ZASIrlGYxoCKiYuxpt/LUwndn4Zt+7qPtdekJLb1aUHJEnHzCYjEqn1Kq147yustqu9wsOi8fkctOMTnu5al6bwX5XCwA7", "target": "R0lGODlhAwADAIABAP////fiayH5BAEKAAEALAAAAAADAAMAAAIDDIxXADs=", "title": "R0lGODlhQABAAIABAAAAAEk8KyH5BAEKAAEALAAAAABAAEAAAAJxhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8dIcNC2E+Surht0cwPkbL3R7SgUEpFJprHW/EmjvOrv6WtqtdPrleTlJpXLJVmGTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4WAAAOw==", "worm": "R0lGODlhDAAEAKECAL4mM6POJzGi8jGi8iH5BAEKAAIALAAAAAAMAAQAAAINlAKme2HIgmsTyXelLAA7" };

  // src/game/data/sfx.js
  var Sfx = {
    BOOM: [3, , 0.3532, 0.6421, 0.4668, 0.054, , 0.2682, , , , , , , , 0.5503, 0.0564, -0.2946, 1, , , , , 0.5],
    JUMP: [0, , 0.2432, , 0.1709, 0.3046, , 0.1919, , , , , , 0.5923, , , , , 1, , , , , 0.5],
    POWERUP: [0, , 0.0129, 0.5211, 0.4714, 0.4234, , , , , , 0.4355, 0.5108, , , , , , 1, , , , , 0.5],
    SHOOT: [2, , 0.1128, , 0.178, 0.7748, 46e-4, -0.4528, , , , , , 0.185, 0.0994, , , , 1, , , , , 0.5],
    TIP: [3, , 0.026, , 0.1909, 0.605, , -0.4942, , , , , , , , , , , 1, , , 0.1405, , 0.5],
    TAP: [1, , 0.1953, , 0.1186, 0.2659, , , , , , , , , , , , , 1, , , 0.1, , 0.5],
    ALARM: [1, 0.0241, 0.9846, 0.6067, 0.3041, 0.1838, , 0.0565, 0.1439, -0.3068, 0.1402, 0.0867, 0.7339, 0.1332, -0.3119, -0.3257, 0.2875, -14e-4, 0.5866, 86e-4, -0.9675, 0.3643, , 0.5]
  };
  var sfx_default = Sfx;

  // src/game/data/base.js
  var base_default = {
    title: "MIKROBEE",
    start: "Title",
    w: 64,
    h: 64,
    pal: [
      // AndroidArts16 - https://androidarts.com/palette/16pal.htm
      [0, 0, 0],
      // 0 void
      [157, 157, 157],
      // 1 ash
      [255, 255, 255],
      // 2 white
      [190, 38, 51],
      // 3 bloodred
      [224, 111, 139],
      // 4 pigmeat
      [73, 60, 43],
      // 5 oldpoop
      [164, 100, 34],
      // 6 newpoop
      [235, 137, 49],
      // 7 orange
      [247, 226, 107],
      // 8 yellow
      [42, 72, 78],
      // 9 darkgreen
      [68, 137, 26],
      // 10 green
      [163, 206, 39],
      // 11 slimegreen
      [27, 38, 50],
      // 12 nightblue
      [0, 87, 132],
      // 13 seablue
      [49, 162, 242],
      // 14 skyblue
      [178, 220, 239]
      // 15 cloudblue
    ],
    i: images_default,
    scale: ["circle", "dot"],
    audio: ["music.ogg"],
    sfx: sfx_default
  };

  // src/game/entities/sprite.js
  var Sprite = class {
    constructor(g, o2) {
      this.g = g;
      this.o = o2;
      this.id = `id-${Math.random().toString(36).substr(2, 16)}`;
      this.dead = false;
      this.remove = false;
      this.offsetY = 0;
      this.name = o2.i;
      for (let n in o2) {
        this[n] = o2[n];
      }
      this.lastPos = { x: this.x, y: this.y };
      this.flip = { x: 0, y: 0 };
      this.scale = o2.scale || 1;
      this.frame = o2.frame || 1;
      this.frames = o2.frames || 1;
      this.frameRate = o2.frameRate || 80;
      this.frameNext = o2.frameNext || 0;
      this.hurtTime = 0;
      if (o2.i) {
        this.mkImg(o2.i);
      }
      this.hurt = false;
      this.anims = { idle: { frames: [1], rate: 80 } };
      this.changeAnim("idle");
    }
    update(dt) {
      if (this.collidesWith) {
        this.collidesWith.forEach((group) => {
          this.hitGroup(group);
        });
      }
      if (this.hurtTime > 0) {
        this.hurt = true;
        this.hurtTime--;
      } else {
        this.hurt = false;
      }
      this.updateAnim(dt);
    }
    render() {
      let g = this.g, i = this.hurt ? this.iHurt : this.i, frame = this.frame;
      if (i) {
        if (this.flip.y) {
          i = g.draw.flip(i, 0, 1);
        }
        if (this.flip.x) {
          i = g.draw.flip(i, 1, 0);
          frame = this.frames - this.frame + 1;
        }
        g.draw.ctx.drawImage(
          i,
          frame * this.w - this.w,
          0,
          this.w,
          this.h,
          ~~this.x,
          ~~this.y + this.offsetY,
          this.w,
          this.h
        );
      } else {
        g.draw.rect(this.x, this.y, this.w, this.h, this.col);
      }
    }
    updateAnim(step) {
      if (this.frameNext < 0) {
        this.frameNext = this.anim.rate;
        this.anim.counter += 1;
        if (this.anim.counter >= this.anim.frames.length) {
          if (this.anim.next) {
            this.changeAnim(this.anim.next);
          } else {
            this.anim.counter = 0;
          }
        }
        this.frame = this.anim.frames[this.anim.counter];
      }
      this.frameNext -= step;
    }
    hitGroup(group) {
      this.g.ents.forEach((e) => {
        if (e && e.group === group && e.id !== this.id && this.hit(e)) {
          this.receiveDamage(e);
          e.doDamage(this);
        }
      });
    }
    hit(o2) {
      return !(o2.y + o2.h < this.y || o2.y > this.y + this.h || o2.x + o2.w < this.x || o2.x > this.x + this.w);
    }
    receiveDamage(o2) {
    }
    doDamage(o2) {
    }
    isOffScreen() {
      let g = this.g;
      return this.x < -this.w || this.x > g.w + this.w || this.y < -this.h || this.y > g.h + this.h;
    }
    kill() {
      this.dead = this.remove = true;
    }
    getAngle(x, y) {
      let dx = x - this.x;
      let dy = y - this.y;
      return Math.atan2(dy, dx);
    }
    offScreen() {
      return this.x < 0 || this.x > W - this.w || this.y < 0 || this.y > H - this.h;
    }
    mkImg(name) {
      if (!this.i) {
        return;
      }
      let g = this.g;
      this.i = g.draw.resize(g.imgs[name], this.scale);
      this.w = this.i.width / this.frames;
      this.h = this.i.height;
      let hurtKey = `${this.name}_hurt`;
      if (!this.g.imgs[hurtKey]) {
        this.iHurt = g.draw.color(this.i, g.data.pal[3]);
        this.g.imgs[hurtKey] = this.iHurt;
      } else {
        this.iHurt = g.imgs[hurtKey];
      }
    }
    changeAnim(name) {
      if (this.anim && this.anim.name && this.anim.name === name) {
        return;
      }
      this.anim = this.anims[name];
      this.anim.name = name;
      this.anim.counter = 0;
      this.frame = this.anim.frames[0];
      this.frameNext = this.anim.rate;
    }
  };

  // src/game/states/title.js
  var Title = class {
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
      this.bee = new Sprite(this.g, { i: "bee", x: 0, y: 20, scale: 1 });
    }
    update(dt) {
      for (let e of this.g.ents)
        e.update(dt);
      if (this.bee.x < 64) {
        this.bee.x += 0.5;
        if (this.bee.x % 4 === 0 && this.bee.x > 5 && this.bee.x < 54) {
          this.g.boom(this.bee.x, this.bee.y, 2, 4);
        }
      } else if (this.bee.x === 64 && !this.initFade) {
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
      this.g.draw.img(this.g.imgs["stars"], 0, -32);
      this.g.draw.img(this.g.imgs["bg_hills"], 0, 0);
      this.g.draw.img(this.g.imgs["bg_1"], 0, 44);
      this.g.draw.ctx.globalAlpha = 1;
      for (let n of this.g.ents)
        n.render();
      this.bee.render();
      g.draw.img(g.imgs.pointer, g.input.m.x, g.input.m.y);
    }
    showControls() {
      this.g.spawn("Control", {
        x: 53,
        y: 1,
        textCol: 1,
        clickCol: 12,
        col: 0,
        w: 10,
        h: 10,
        text: "?",
        key: "H",
        cb: () => {
          this.g.changeState("Help");
        }
      });
      this.g.spawn("Control", {
        y: this.g.h - 12,
        x: false,
        w: 28,
        clickCol: 3,
        col: 0,
        key: " ",
        text: "PLAY",
        cb: () => {
          if (this.g.mainMusic) {
            this.g.mainMusic.pause();
            this.g.mainMusic.currentTime = 0;
          }
          this.g.H.toggleFullScreen(this.g.canvas.c);
          this.g.changeState("Tutorial");
        }
      });
      this.g.addEvent({
        t: 100,
        cb: () => {
          this.canStart = true;
        }
      });
    }
  };

  // src/game/states/help.js
  var Help = class {
    constructor(g) {
      this.g = g;
      this.mainText = g.H.mkFont(g, 1, 2);
      this.mainTextShadow = g.H.mkFont(g, 1, 0);
      this.secondText = g.H.mkFont(g, 1, 1);
      window.T = this;
    }
    init() {
      const g = this.g;
      let x = g.H.rnd(1, 15) * 4;
      let y = g.H.rnd(1, 15) * 4;
      this.g.spawn("Control", {
        y: 18,
        x: false,
        w: 60,
        clickCol: 14,
        col: 9,
        key: "E",
        text: "BY EOINMCG",
        cb: () => {
          window.location.href = "https://eoinmcgrath.com";
        }
      });
      this.g.spawn("Control", {
        y: 40,
        x: false,
        w: 64,
        clickCol: 3,
        col: 9,
        key: "A",
        text: "SQUARESAWNOISE",
        cb: () => {
          window.location.href = "https://freemusicarchive.org/music/sawsquarenoise/Towel_Defence_OST";
        }
      });
      this.g.spawn("Control", {
        y: 54,
        x: false,
        w: 28,
        clickCol: 11,
        col: 10,
        key: " ",
        text: "BACK",
        cb: () => {
          this.g.changeState("Title");
        }
      });
    }
    update(dt) {
      let g = this.g, i = g.input.keys;
      for (let n of this.g.ents)
        n.update(dt);
    }
    render() {
      const g = this.g;
      g.draw.clear(12);
      g.draw.text("CREDITS", this.mainTextShadow, false, 2);
      g.draw.text("CREDITS", this.mainText, false, 1);
      g.draw.text("AUDIO BY", this.secondText, false, 34);
      for (let n of this.g.ents)
        n.render();
      g.draw.img(g.imgs.target, g.input.m.x - 1, g.input.m.y - 1);
    }
  };

  // src/game/data/levels.json
  var levels_default = {
    levels: [
      {
        title: "The Meadows",
        muzak: 0,
        dist: 1e3,
        floor: 0,
        roof: 0,
        ents: ["Fly", "Shroom"],
        freq: 80,
        max: 8,
        bgSpeed: 1,
        bgCol: 15,
        bg: [
          { k: "Bg", i: "bg_sky", vx: 0, y: 0, o: 0.1 },
          { k: "Bg", i: "bg_hills", vx: -0.02, y: 0, o: 0.1 },
          { k: "Bg", i: "bg_1", vx: -0.2, y: 41, o: 0.2 },
          { k: "Bg", i: "ground_grass1", vx: -0.5, y: 57 },
          { k: "Cloud", i: "cloud1" },
          { k: "Cloud", i: "cloud1" },
          { k: "Cloud", i: "cloud2" }
        ],
        spawns: [
          { k: "Shroom", delay: 500 }
        ]
      },
      {
        title: "The Forest",
        muzak: 0,
        dist: 2500,
        ents: ["Eye", "Creep"],
        freq: 60,
        max: 8,
        floor: 0,
        roof: 0,
        bgSpeed: 2,
        bgCol: 0,
        bg: [
          { k: "Bg", i: "bg_thorns", vx: -0.5, y: 54 },
          { k: "Bg", i: "bg_trees", vx: -0.2, y: 0 },
          { k: "Cloud", i: "cloud1" },
          { k: "Cloud", i: "cloud1" },
          { k: "Bg", i: "stars", vx: -0, y: 0, o: 0.1 }
        ],
        spawns: []
      },
      {
        title: "The Cave",
        muzak: 0,
        dist: 3e3,
        ents: ["Fly", "Spike"],
        freq: 40,
        max: 8,
        floor: 62,
        roof: 2,
        bgSpeed: 1,
        bgCol: 0,
        bg: [
          { k: "Cave_bg" },
          { k: "Bg", i: "cave_bg_teeth", vx: -0.25, y: 0, o: 0.1 }
        ],
        spawns: [
          { k: "Spike", delay: 200, bottom: false },
          { k: "Spike", delay: 250, bottom: true }
        ]
      }
    ]
  };

  // src/game/entities/wiper.js
  var Wiper = class {
    constructor(opts) {
      const g = opts.g;
      this.g = opts.g;
      this.col = 0;
      this.active = false;
      this.x = -this.g.w;
      this.w = g.data.w;
      this.h = g.data.h;
      this.cb = false;
      console.log(this);
    }
    update(dt) {
      if (!this.active)
        return;
      this.x += this.dir;
      if (this.x >= 0) {
        this.dir *= -1;
        if (this.cb) {
          this.cb();
        }
      } else if (this.x <= -this.g.w) {
        this.dir = 0;
        this.active = false;
        this.cb = false;
      }
    }
    start(cb = false) {
      this.active = true;
      this.dir = 1;
      this.cb = cb;
    }
    render() {
      if (!this.active)
        return;
      this.g.draw.rect(this.x, 0, this.w, this.h, this.col);
    }
  };

  // src/game/states/play.js
  var Play = class {
    constructor(g, o2) {
      this.g = g;
      this.o = o2;
      window.T = this;
    }
    init() {
      const g = this.g;
      window.G = g;
      this.livesText = g.H.mkFont(g, 1, 3);
      this.scoreText = g.H.mkFont(g, 1, 2);
      this.scoreTextShadow = g.H.mkFont(g, 1, 0);
      this.score = 0;
      this.levelNum = this.o.levelNum || 0;
      this.levelData = levels_default.levels[this.levelNum];
      this.loadLevel(this.levelData);
      this.gameOver = false;
      this.levelComplete = false;
      this.showPointer = false;
      this.p1 = g.spawn("Bee", { p: this });
      this.wiper = new Wiper({ p: this, g });
    }
    update(dt) {
      let g = this.g;
      this.baddies = 0;
      this.wiper.update(dt);
      for (let n of this.g.ents) {
        if (n.group === "baddies")
          this.baddies += 1;
        n.update(dt);
      }
      if (!this.levelComplete && this.dist % this.levelData.freq === 0 && this.baddies < this.levelData.max) {
        if (this.levelNum === 0) {
          this.waveFly();
        } else {
          g.spawn(g.H.rndArray(this.levelData.ents), { p: this });
        }
      }
      ;
      if (!this.gameOver) {
        this.dist -= 1;
      }
      this.percent = ~~this.dist / this.levelDist * g.w;
      if (this.dist === 0 && !this.levelComplete) {
        this.bgSpeed = 0;
        if (this.g.mainMusic) {
          this.g.mainMusic.pause();
        }
        this.initLevelComplete();
      }
      if (this.p1.lives < 1 && !this.gameOver) {
        this.initGameOver();
      }
    }
    render() {
      const g = this.g;
      g.draw.clear(this.levelData.bgCol);
      for (let n of this.g.ents)
        n.render();
      g.draw.text(g.H.pad(this.score), this.scoreText, 2, 2);
      for (let i = 0; i < this.p1.lives; i += 1) {
        g.draw.img(g.imgs["heart"], 58 - i * 6, 2);
      }
      let offset = this.percent > 0 ? g.w - this.percent - g.w : 0;
      g.draw.img(g.imgs["progress"], offset, 0, 1, 0.25);
      if (this.gameOver && this.g.fader > 0) {
        g.draw.text("GAMEOVER", this.scoreText, false, 20);
      }
      if (this.showPointer) {
        g.draw.img(g.imgs.pointer, g.input.m.x, g.input.m.y);
      }
      this.wiper.render();
    }
    killBaddie(o2) {
      if (Math.random() > 0.9) {
        this.g.spawn("Powerup", { p: this, x: o2.x, y: o2.y });
      }
      this.score += o2.val;
      o2.remove = true;
    }
    loadLevel(level) {
      if (!level)
        return;
      this.bgSpeed = level.bgSpeed;
      this.levelDist = level.dist;
      this.dist = level.dist;
      this.waves = [];
      this.g.ents.forEach((e) => {
        if (e.name !== "bee") {
          e.remove = true;
        }
      });
      level.bg.forEach((l) => {
        let ent = l.k;
        l.p = this;
        this.g.spawn(ent, l);
      });
      level.spawns.forEach((s) => {
        let ent = s.k, delay = s.delay;
        s.p = this;
        this.g.addEvent({
          t: delay,
          cb: () => {
            this.g.spawn(ent, s);
          }
        });
      });
      this.g.ents.reverse();
      if (this.p1) {
        this.p1.started = false;
        this.p1.y = 32;
      }
      if (level.muzak !== "undefined") {
        this.g.mainMusic = AUDIO[level.muzak];
        this.g.mainMusic.currentTime = 0;
        this.g.mainMusic.loop = true;
        this.g.mainMusic.play();
      }
      this.levelComplete = false;
      if (this.p1) {
        this.p1.x = 20;
      }
    }
    waveFly(type = false, num = 3, y = false) {
      if (this.percent < 0 || this.gameOver)
        return;
      const g = this.g;
      type = type || g.H.rndArray(["blue", "green", "brown"]);
      y = y || g.H.rnd(4, 60);
      num = num || 5;
      for (let i = 0; i < num; i += 1) {
        g.addEvent({
          t: 20 * i,
          cb: () => {
            if (this.gameOver)
              return;
            g.spawn("Fly", { p: this, type, y });
          }
        });
      }
    }
    initGameOver() {
      if (this.gameOver) {
        return;
      }
      this.gameOver = true;
      if (this.g.mainMusic) {
        this.g.mainMusic.pause();
      }
      this.p1.remove = true;
      this.bgSpeed = 0;
      this.g.spawn("Overlay", { p: this, col: 3 });
      this.g.addEvent({
        t: 300,
        cb: () => {
          this.showPointer = true;
          this.g.spawn("Control", {
            y: this.g.h - 12,
            x: false,
            w: 28,
            clickCol: 3,
            col: 0,
            key: " ",
            text: "REPLAY",
            cb: () => {
              if (this.g.mainMusic) {
                this.g.mainMusic.pause();
                this.g.mainMusic.currentTime = 0;
              }
              this.g.changeState("Play", { levelNum: this.levelNum });
            }
          });
        }
      });
    }
    initLevelComplete() {
      if (this.levelComplete)
        return;
      this.levelComplete = true;
      this.g.events = [];
      let cb = () => {
        this.levelNum += 1;
        this.levelData = levels_default.levels[this.levelNum];
        if (!this.levelData) {
          this.g.changeState("Win");
        }
        this.loadLevel(this.levelData);
      };
      this.wiper.start(cb);
    }
  };

  // src/game/states/win.js
  var Win = class {
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
          console.log("CAN START");
        }
      });
    }
    update() {
      let g = this.g, i = g.input.keys;
      if (this.canStart && (i.x || i["Space"] || i["Enter"])) {
        this.g.changeState("Title");
      }
    }
    render() {
      const g = this.g, draw = this.g.draw;
      draw.clear(15);
      draw.ctx.globalAlpha = 0.1;
      draw.img(this.g.imgs["bg_sky"], 0, 0);
      draw.ctx.globalAlpha = 0.1;
      draw.img(this.g.imgs["bg_hills"], 0, 0);
      draw.ctx.globalAlpha = 1;
      draw.img(this.g.imgs["ground_grass1"], 0, 57);
      draw.text("YOU WIN", this.font, false, 10);
      draw.img(this.g.imgs["heart"], 25, 20, 3, 1);
      draw.img(g.imgs.target, g.input.m.x, g.input.m.y);
    }
  };

  // src/game/states/tutorial.js
  var Tutorial = class {
    constructor(g) {
      this.g = g;
      this.mainText = g.H.mkFont(g, 1, 2);
      this.mainTextShadow = g.H.mkFont(g, 1, 0);
      this.secondText = g.H.mkFont(g, 1, 1);
      this.canStart = false;
      this.sfx = true;
      window.T = this;
    }
    init() {
      const g = this.g;
      this.step = 1;
      g.spawn("Control", {
        y: 53,
        x: false,
        w: 28,
        clickCol: 11,
        col: 10,
        key: " ",
        text: "READY",
        cb: () => {
          if (this.canStart) {
            this.g.changeState("Play");
          }
        }
      });
      this.g.addEvent({
        t: 100,
        cb: () => {
          this.canStart = true;
        }
      });
      this.baddies = {
        eye: new Sprite(this.g, { i: "eye", x: 30, y: 30 }),
        fly: new Sprite(this.g, { i: "fly", frames: 3, x: 20, y: 30 }),
        creep: new Sprite(this.g, { i: "creep", frames: 2, x: 40, y: 30 })
      };
      this.powerup = new Sprite(this.g, { i: "star", x: 30, y: 30, frames: 2, flip: { x: 1, y: 0 } });
      this.updateStep();
    }
    update(dt) {
      let g = this.g, i = g.input.keys;
      for (let n of this.g.ents)
        n.update(dt);
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
      for (let n of this.g.ents)
        n.render();
      g.draw.text(`STEP ${this.step}`, this.secondText, false, 2);
      if (this.step === 1) {
        g.draw.text(`${g.mobile ? "TAP" : "CLICK"} TO SHOOT`, this.mainText, false, 10);
        g.draw.text(`AND FLY`, this.mainText, false, 20);
        g.draw.img(g.imgs["bee"], 28, 30, 2);
      } else if (this.step === 2) {
        g.draw.text(`SHOOT THE`, this.mainText, false, 10);
        g.draw.text(`NASTIES`, this.mainText, false, 20);
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
            this.sfx = false;
            this.step = 1;
          }
          if (this.sfx) {
            this.g.audio.play("TIP");
          }
          this.updateStep();
        }
      });
    }
  };

  // src/game/entities/text.js
  var Text = class {
    constructor(g, o2) {
      o2.group = "text";
      o2.vy = o2.vy || -2.5;
      o2.vx = o2.vx || 0;
      o2.w = 10;
      o2.w = 10;
      o2.alpha = 1;
      o2.scale = 1;
      o2.col = o2.col || 4;
      o2.accel = o2.accel || 0.25;
      o2.fade = o2.fade || 1e-3;
      for (let n in o2) {
        this[n] = o2[n];
      }
      this.g = g;
      this.p = g.imgs[`font_${o2.scale}_${o2.col}`];
    }
    update(step) {
      if (this.y < 0 || this.alpha < 0.1) {
        this.remove = true;
      }
      this.vy -= this.accel;
      this.alpha -= this.fade;
      if (this.vx) {
        this.x += this.vx * step;
      }
      this.y += this.vy * step;
    }
    render() {
      let d = this.g.draw;
      if (this.text) {
        d.text(this.text, this.p, this.x, this.y);
      } else if (this.o) {
        d.ctx.drawImage(this.i, this.x, this.y);
      }
    }
  };

  // src/game/entities/boom.js
  var Boom = class {
    constructor(g, o2) {
      o2.col = o2.col || 2;
      this.g = g;
      let iKey = `circle_${o2.col}`;
      if (!this.g.imgs[iKey]) {
        this.i = g.draw.color(g.imgs.circle, g.data.pal[o2.col]);
        this.g.imgs[iKey] = this.i;
      } else {
        this.i = this.g.imgs[iKey];
      }
      this.startX = o2.x;
      this.startY = o2.y;
      this.magnitude = o2.m || 4;
      this.scale = 1;
      this.factor = o2.factor || 0.5;
    }
    update() {
      this.scale += this.factor;
      if (this.scale > this.magnitude && this.factor > 0) {
        this.factor *= -1;
      }
      if (this.scale <= 1) {
        this.remove = true;
      }
    }
    render() {
      let s = this.i.width * this.scale / 2, x = this.startX - s, y = this.startY - s, g = this.g;
      g.draw.img(this.i, x, y, this.scale);
    }
  };

  // src/game/entities/particle.js
  var Particle = class {
    constructor(g, o2) {
      this.g = g;
      this.x = o2.x;
      this.y = o2.y;
      this.w = o2.w || 1;
      this.h = this.w;
      this.vx = g.H.rnd(-100, 100);
      this.vy = g.H.rnd(50, 150) * -1;
      this.col = o2.col || 6;
      this.r = o2.r || 1;
      this.i = g.imgs[`dot_${this.w}_${this.col}`];
    }
    update(step) {
      this.x += this.vx * step;
      this.y += this.vy * step;
      if (this.y > this.g.h) {
        this.remove = true;
      }
    }
    render(dt) {
      this.g.draw.ctx.drawImage(this.i, this.x, this.y);
    }
  };

  // src/game/entities/control.js
  var Control = class extends Sprite {
    constructor(g, o2) {
      o2.scale = 2;
      if (!("col" in o2))
        o2.col = 7;
      if (!("clickCol" in o2))
        o2.clickCol = 3;
      if (!o2.i) {
        o2.size = o2.size || 1;
        o2.w = o2.w || 36;
        o2.h = o2.h || 10;
      }
      o2.textCol = o2.textCol || 2;
      o2.hoverCol = o2.hoverCol || 2;
      o2.center = o2.x === false;
      if (!g.imgs[`font_${o2.textCol}`]) {
        g.imgs[`font_${o2.textCol}`] = g.H.mkFont(g, 1, o2.textCol);
      }
      if (!g.imgs[`font_${o2.hoverCol}`]) {
        g.imgs[`font_${o2.hoverCol}`] = g.H.mkFont(g, 1, o2.hoverCol);
      }
      super(g, o2);
      this.flip.x = !!o2.flip;
      this.g = g;
      if (!o2.i) {
        this.x = o2.x || g.w / 2 - o2.w / 2;
        this.p = g.imgs[`font_${o2.textCol}`];
        this.pHover = g.imgs[`font_${o2.hoverCol}`];
        this.clicked = false;
        this.clickCol = o2.clickCol;
        this.currentCol = o2.col;
        this.clicked = false;
        this.textW = g.draw.textWidth(this.text, this.p) / 2;
        this.tX = o2.x ? o2.x + 20 : g.w / 2 - this.textW;
      }
      this.origX = this.x;
      this.origY = o2.y;
      if (!this.center) {
        this.tX = this.x + 4;
      }
    }
    update() {
      let hit = this.checkTouch() || this.checkClick() || this.checkKey();
      this.hover = this.intersects(this.g.input.m);
      this.currentCol = this.hover ? this.clickCol : this.col;
      if (hit && this.cb) {
        this.g.audio.play("TAP");
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
        let font = this.hover ? this.pHover : this.p;
        this.g.draw.rect(
          this.x,
          this.y,
          this.w,
          this.h,
          this.currentCol
        );
        this.g.draw.text(this.text, font, this.tX, this.y + 2);
      }
    }
    intersects(m) {
      return m.x > this.x && m.x < this.x + this.w && m.y > this.y && m.y < this.y + this.h;
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
      let touches = this.g.input.m.touches, i = touches.length;
      while (i--) {
        if (touches[i].x >= this.x && touches[i].x <= this.x + this.w) {
          return true;
        }
      }
      return false;
    }
  };

  // src/game/entities/spawn.js
  var Spawn = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "dot_1_2";
      o2.col = 11;
      super(g, o2);
      this.points = this.setPoints();
      window.S = this;
      this.w = this.h = 4;
      this.cycles = 0;
      this.maxCycles = 3;
      this.alpha = 0;
    }
    update(dt) {
      this.points.forEach((p) => {
        this.g.draw.rect(p.x, p.y, 1, 1, 11);
      });
      let reset = false;
      this.points.forEach((p, index) => {
        if (~~p.x === p.tx && ~~p.y === p.ty) {
          reset = true;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }
      });
      if (reset) {
        this.cycles += 1;
        this.points = this.setPoints();
      }
      this.alpha += dt / 2;
      if (this.alpha > 1) {
        this.g.spawn(this.t, { p: this.p, x: this.x, y: this.y });
        this.remove = true;
      }
    }
    render(dt) {
      this.g.draw.ctx.globalAlpha = this.alpha;
      this.g.draw.rect(this.x, this.y, 4, 4, 11);
      this.g.draw.ctx.globalAlpha = 1;
      this.points.forEach((p) => {
        let col = ~~p.x === p.tx && ~~p.y === p.ty ? 2 : 11;
        this.g.draw.rect(p.x, p.y, 4, 1, col);
      });
    }
    setPoints() {
      let points = [];
      let dist = 20, v = 0.75;
      points.push({
        x: this.x,
        y: this.y - dist,
        vx: 0,
        vy: v,
        tx: this.x,
        ty: this.y
      });
      points.push({
        x: this.x,
        y: this.y + dist,
        vx: 0,
        vy: -v,
        tx: this.x + 2,
        ty: this.y
      });
      points.push({
        x: this.x - dist,
        y: this.y,
        vx: v,
        vy: 0,
        tx: this.x,
        ty: this.y
      });
      points.push({
        x: this.x + dist,
        y: this.y,
        vx: -v,
        vy: 0,
        tx: this.x,
        ty: this.y
      });
      return points;
    }
  };

  // src/game/entities/bullet.js
  var Bullet = class extends Sprite {
    constructor(g, o2) {
      o2.group = "bullet";
      o2.i = "bullet";
      o2.scale = 1;
      super(g, o2);
      this.g = g;
      this.o = o2;
      this.speed = 1.75;
      this.a = o2.a || 0;
      this.col = 7;
      this.vx = this.speed * Math.cos(this.a);
      this.vy = this.speed * Math.sin(this.a);
    }
    update(dt) {
      this.lastX = this.x;
      this.lastY = this.y;
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      if (this.isOffScreen()) {
        this.remove = true;
      }
    }
    render() {
      super.render();
      let d = this.g.draw;
      d.ctx.globalAlpha = 0.5;
      d.rect(this.lastX, this.lastY, 1, 1, 8);
      d.ctx.globalAlpha = 1;
    }
    doDamage(o2) {
    }
    hitBaddie(o2) {
      let g = this.g;
      g.boom(this.x, this.y, o2.col, 3);
      g.audio.play("TIP");
      this.remove = true;
    }
  };

  // src/game/entities/bee.js
  var Bee = class extends Sprite {
    constructor(g, o2) {
      o2.group = "player";
      o2.i = o2.i || "bee";
      o2.i1 = "bee1";
      o2.scale = 1;
      o2.frames = 1;
      super(g, o2);
      this.score = 0;
      this.anims = {
        move: { frames: [1, 1], rate: 0.05 }
      };
      this.changeAnim("move");
      this.x = 16;
      this.y = 32;
      this.lastY = 0;
      this.g = g;
      this.o = o2;
      this.started = false;
      this.powerups = 0;
      this.gravity = 9.8;
      this.vx = 0;
      this.vy = 0;
      this.maxVy = 1.5;
      this.floor = 58;
      this.val = 10;
      this.angle = 0;
      this.collidesWith = ["baddies"];
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
      if (!this.started)
        return;
      if (this.y > this.floor)
        this.y = this.floor;
      if (x && this.y > 0) {
        this.y -= 0.75;
      } else {
        this.y += 0.75;
      }
      if (x && this.delay < 0) {
        this.shoot();
      }
      if (this.x < 0)
        this.x = 0;
      if (this.x > g.w - this.w)
        this.x = g.w - this.w;
      if (this.y < 0)
        this.y = 0;
      if (this.y > g.h - this.h)
        this.y = g.h - this.h;
      this.delay--;
      this.gunFlash--;
      this.lastY = this.y;
    }
    render() {
      let d = this.g.draw;
      if (this.gunFlash > 0) {
        d.img(this.g.imgs["circle_1_2"], this.x + this.w / 2, this.y, 0.5, 1);
      }
      let i = this.hurt ? this.iHurt : this.i;
      d.img(i, this.x, this.y);
    }
    hitBaddie(o2) {
      if (this.p.levelComplete)
        return;
      if (this.hurtTime > 0)
        return;
      this.hurtTime = 100;
      this.lives -= 1;
      this.g.boom(this.x, this.y, 2, 4);
      let num = 4;
      while (num--) {
        this.g.addEvent({
          t: num * 15,
          cb: () => {
            let x = this.g.H.rnd(-2, 2), y = this.g.H.rnd(-2, 2);
            this.g.boom(this.x + x, this.y + y, 2, 4);
          }
        });
      }
    }
    shoot() {
      const g = this.g;
      this.delay = 10;
      this.p.shots += 1;
      g.audio.play("SHOOT");
      this.gunFlash = 3;
      g.spawn("Bullet", {
        x: this.x + this.w / 2,
        y: this.y + this.h / 2,
        a: 0,
        p: this.p
      });
      if (this.powerups > 0) {
        g.spawn("Bullet", {
          x: this.x + this.w / 2,
          y: this.y - this.h / 2,
          a: 0,
          p: this.p
        });
      }
      if (this.powerups > 1) {
        g.spawn("Bullet", {
          x: this.x + this.w / 2,
          y: this.y + this.h / 2,
          a: 0.7,
          p: this.p
        });
      }
      if (this.powerups > 2) {
        g.spawn("Bullet", {
          x: this.x + this.w / 2,
          y: this.y + this.h / 2,
          a: 5.5,
          p: this.p
        });
      }
      if (this.powerups > 3) {
        g.spawn("Bullet", {
          x: this.x + this.w / 2,
          y: this.y + this.h / 2,
          a: 3.14,
          p: this.p
        });
      }
    }
    powerup() {
      this.powerups += 1;
    }
    buzzOff() {
      if (this.x > 70)
        return;
      let hW = this.g.w / 2;
      this.x += 1;
      if (this.y <= hW) {
        this.y += 1;
      } else if (this.y >= hW) {
        this.y -= 1;
      }
    }
  };

  // src/game/entities/worm.js
  var Worm = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "worm";
      o2.frames = 3;
      o2.scale = 1;
      o2.val = 20;
      super(g, o2);
      this.anims = {
        move: { frames: [1, 2, 3, 2], rate: 0.075 }
      };
      this.changeAnim("move");
      this.val = 10;
      this.vx = 0.1;
      this.vy = -0.1;
      if (!this.x) {
        this.x = g.H.rnd(0, 64);
      }
      if (!this.y) {
        this.y = g.H.rnd(0, 64);
      }
      if (this.x > this.g.w / 2) {
        this.vx *= -1;
        this.flip.x = !this.flip.x;
      }
      this.collidesWith = ["player", "bullet"];
    }
    update(dt) {
      super.update(dt);
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > this.g.w - this.w) {
        this.vx *= -1;
        this.flip.x = !this.flip.x;
      }
      if (this.y < 0 || this.y > this.g.h - this.h) {
        this.vy *= -1;
      }
    }
    receiveDamage(o2) {
      this.p.killBaddie(this);
      if (!o2.hurt)
        o2.hitBaddie(this);
    }
  };

  // src/game/entities/eye.js
  var Eye = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "eye";
      o2.frames = 1;
      o2.scale = 1;
      o2.val = 30;
      super(g, o2);
      this.val = 20;
      this.vx = 0.1;
      this.vy = -0.1;
      this.x = 64;
      if (!this.y) {
        this.y = g.H.rnd(4, 60);
      }
      this.collidesWith = ["player", "bullet"];
      this.moveTo = false;
      this.active = false;
    }
    update(dt) {
      super.update(dt);
      if (!this.active) {
        this.x -= 0.2;
        if (this.x < 57) {
          this.active = true;
        }
        return;
      }
      ;
      let s = this, p1 = this.p.p1, easing = 0.05;
      if (!p1.remove && !s.moveTo && Math.random() > 0.99) {
        this.moveTo = { x: -5, y: p1.y };
      } else if (s.moveTo) {
        let xD = ~~(s.moveTo.x - s.x), yD = ~~(s.moveTo.y - s.y);
        s.moveTo.d = ~~Math.sqrt(xD * xD + yD * yD);
        if (s.moveTo.d > 2) {
          s.x += xD * easing;
          s.y += yD * easing;
        } else {
          s.x = s.moveTo.x;
          s.y = s.moveTo.y;
          s.d = 0;
          s.moveTo = false;
        }
      }
      if (this.x < -4) {
        this.remove = true;
      }
    }
    render() {
      super.render();
      let p1 = this.p.p1, x = this.x + 1, y = this.y + 1, checkX = p1.x, checkY = p1.y;
      if (p1.remove) {
        checkX = this.g.input.m.x;
        checkY = this.g.input.m.y;
      }
      if (checkX > x) {
        x += 1;
      }
      if (checkY > y) {
        y += 1;
      }
      this.g.draw.rect(x, y, 1, 1, 3);
    }
    receiveDamage(o2) {
      this.p.killBaddie(this);
      if (!o2.hurt)
        o2.hitBaddie(this);
    }
  };

  // src/game/entities/creep.js
  var Creep = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "creep";
      o2.frames = 2;
      o2.scale = 1;
      o2.val = 20;
      super(g, o2);
      this.anims = {
        move: { frames: [1, 2], rate: 0.5 }
      };
      this.changeAnim("move");
      this.val = 20;
      this.x = 60;
      this.y = 0;
      this.collidesWith = ["player", "bullet"];
      this.flip.x = true;
      this.maxY = g.H.rnd(15, 40);
      this.vy = g.H.rndArray([0.25, 0.5]);
      console.log(this.x, this.y);
    }
    update(dt) {
      super.update(dt);
      this.x -= 0.5;
      if (this.y < this.maxY) {
        this.y += this.vy;
      }
      if (this.x < -6) {
        this.remove = true;
      }
    }
    render() {
      this.g.draw.ctx.globalAlpha = 0.5;
      this.g.draw.rect(this.x + 1, 0, 1, this.y, 1);
      this.g.draw.ctx.globalAlpha = 1;
      super.render();
    }
    receiveDamage(o2) {
      this.p.killBaddie(this);
      if (!o2.hurt)
        o2.hitBaddie(this);
    }
  };

  // src/game/entities/fly.js
  var Fly = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "fly";
      o2.frames = 3;
      o2.scale = 1;
      o2.val = 20;
      o2.col = 3;
      super(g, o2);
      this.o = o2;
      this.anims = {
        blue: { frames: [1], rate: 0.035 },
        green: { frames: [2], rate: 0.035 },
        brown: { frames: [3], rate: 0.035 }
      };
      this.type = o2.type || g.H.rndArray(Object.keys(this.anims));
      if (this.p.levelNum === 2) {
        this.type = "blue";
      }
      this.changeAnim(this.type);
      this.setBehavior(this.type);
      this.val = 10;
      if (this.p.levelNum === 2) {
        this.maxTurns = 1;
      }
      if (!this.x) {
        this.x = 60;
        this.flip.x = false;
      }
      if (!this.y) {
        this.y = g.H.rnd(4, 60);
      }
      if (this.x > this.g.w / 2) {
        this.vx *= -1;
        this.flip.x = !this.flip.x;
      }
      this.collidesWith = ["player", "bullet"];
    }
    setBehavior(type) {
      const g = this.g;
      const x = this.o.x || 60;
      const y = this.o.y || g.H.rnd(4, 60);
      switch (type) {
        case "brown":
          this.x = x;
          this.y = y;
          this.vx = -0.75;
          this.vy = this.y > 32 ? 0.5 : -0.5;
          this.turns = 0;
          this.maxTurns = 2;
          this.flip.x = false;
          break;
        case "green":
          this.x = x;
          this.y = y;
          this.vx = -0.5;
          this.vy = this.y > 32 ? 0.25 : -0.25;
          this.turns = 0;
          this.maxTurns = 2;
          this.flip.x = false;
          break;
        default:
        case "blue":
          this.x = x;
          this.y = y;
          this.vx = -0.6;
          this.vy = 0;
          this.turns = 0;
          this.maxTurns = 2;
          this.flip.x = false;
          break;
      }
    }
    update(dt) {
      super.update(dt);
      this.x += this.vx;
      this.y += this.vy;
      let xBounds = this.x < 0 || this.x > this.g.w - this.w;
      let xOffscreen = this.x < -this.w || this.x > this.g.w + this.w;
      let turnsFinished = this.turns > this.maxTurns;
      if (xBounds && !turnsFinished) {
        this.vx *= -1;
        this.flip.x = !this.flip.x;
        this.turns += 1;
      }
      if (turnsFinished && xOffscreen) {
        this.remove = true;
      }
      if (this.y < 0 || this.y > this.g.h - this.h) {
        this.vy *= -1;
        this.turns += 1;
      }
    }
    receiveDamage(o2) {
      this.p.killBaddie(this);
      if (!o2.hurt)
        o2.hitBaddie(this);
    }
  };

  // src/game/entities/bg.js
  var Bg = class {
    constructor(g, o2) {
      this.g = g;
      this.p = o2.p;
      this.vy = o2.vy || 0;
      this.vx = o2.vx || 0;
      this.x = o2.x || 0;
      this.y = o2.y || 0;
      this.o = o2.o || 1;
      this.i = o2.i;
      this.w = g.imgs[o2.i].width;
      this.h = g.imgs[o2.i].height;
    }
    update() {
      this.x += this.vx * this.p.bgSpeed;
      this.y += this.vy;
      if (this.x < -this.w) {
        this.x = 0;
      }
    }
    render() {
      let x = Math.ceil(this.x);
      let y = Math.ceil(this.y);
      this.g.draw.img(this.g.imgs[this.i], x, y, 1, this.o);
      this.g.draw.img(this.g.imgs[this.i], x + this.w, y, 1, this.o);
    }
  };

  // src/game/entities/cave_bg.js
  var Cave_bg = class {
    constructor(g, o2) {
      this.g = g;
      this.g = g;
      this.p = o2.p;
      this.x = 0;
      this.y = -4;
      this.v = -1;
      this.g.imgs["floor"] = this.g.draw.flip(this.g.imgs["bg_roof"], 1, 1);
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
      this.g.draw.img(this.g.imgs["bg_roof"], this.x, this.y);
      this.g.draw.img(this.g.imgs["bg_roof"], 64 + this.x, this.y + 4);
      this.g.draw.img(this.g.imgs["floor"], this.x, 64 + this.y);
      this.g.draw.img(this.g.imgs["floor"], 64 + this.x, 64 + this.y + 4);
    }
  };

  // src/game/entities/cloud.js
  var Bg2 = class {
    constructor(g, o2) {
      this.g = g;
      this.p = o2.p;
      this.i = o2.i || "cloud2";
      this.w = g.imgs[o2.i].width;
      this.h = g.imgs[o2.i].height;
      this.reset();
    }
    update(dt) {
      this.x -= this.vx * this.p.bgSpeed;
      if (this.x < -this.w) {
        this.reset();
      }
    }
    render() {
      this.g.draw.img(this.g.imgs[this.i], this.x, this.y, this.scale, 0.5);
    }
    reset() {
      const g = this.g;
      this.x = g.data.w + this.w;
      if (this.p.levelNum === 0) {
        this.y = g.H.rndArray(0, 15, 30);
      } else {
        this.y = g.H.rndArray([0, 15, 30]);
      }
      this.scale = g.H.rndArray([0.5, 1, 1.5]);
      this.vx = this.scale * 1.2;
    }
  };

  // src/game/entities/overlay.js
  var Overlay = class {
    constructor(g, o2) {
      this.g = g;
      this.p = o2.p;
      this.col = o2.col || 1;
      this.rate = o2.rate || 0.05;
      this.maxAlpha = o2.maxAlpha || 0.8;
      this.alpha = 0;
    }
    update(dt) {
      if (this.alpha < this.maxAlpha) {
        this.alpha += this.rate;
      }
    }
    render() {
      const g = this.g;
      g.draw.ctx.globalAlpha = this.alpha;
      g.draw.rect(0, 0, g.data.w, g.data.h, this.col);
      g.draw.ctx.globalAlpha = 1;
    }
  };

  // src/game/entities/shroom.js
  var Shroom = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "shroom";
      o2.frames = 2;
      o2.scale = 1;
      super(g, o2);
      this.anims = {
        idle: { frames: [2], rate: 1 }
      };
      this.changeAnim("idle");
      this.x = 100;
      this.y = g.data.h - this.h;
      this.vx = -0.25;
      this.flip.x = true;
      this.collidesWith = ["player", "bullet"];
    }
    update(dt) {
      super.update(dt);
      if (this.p.percent <= 0 || this.p.bgSpeed === 0) {
        return;
      }
      this.x += -0.5;
      if (this.x < -12) {
        this.x = 80;
      }
    }
    receiveDamage(o2) {
      if (o2.name === "bee") {
        o2.hitBaddie(this);
        return;
      }
      this.g.audio.play("TIP");
      this.hurtTime = 40;
      this.g.burst(o2.x, o2.y, 3, 1);
      o2.remove = true;
    }
  };

  // src/game/entities/powerup.js
  var Powerup = class extends Sprite {
    constructor(g, o2) {
      o2.group = "baddies";
      o2.i = "star";
      o2.frames = 2;
      o2.scale = 1;
      super(g, o2);
      this.x = o2.x;
      this.y = o2.y;
      this.anims = {
        sparkle: { frames: [1, 2], rate: 0.2 }
      };
      this.changeAnim("sparkle");
      this.vx = -0.25;
      this.collidesWith = ["player"];
    }
    update(dt) {
      super.update(dt);
      this.x += -0.5;
      if (this.y < this.p.p1.y) {
        this.y += 0.2;
      } else if (this.y > this.p.p1.y) {
        this.y -= 0.2;
      }
      if (this.x < -12) {
        this.remove = true;
      }
    }
    receiveDamage(o2) {
      this.g.audio.play("POWERUP");
      this.remove = true;
      o2.powerup();
    }
  };

  // src/game/entities/spike.js
  var Spike = class extends Sprite {
    constructor(g, o2) {
      o2.i = g.H.rndArray(["spike", "spike2"]);
      o2.group = "baddies";
      o2.frames = 1;
      o2.scale = 1;
      super(g, o2);
      if (Math.random() > 0.5) {
        this.y = 3;
        this.flip.y = 1;
      } else {
        this.y = g.h - this.h - 1;
      }
      this.x = g.w;
      this.vx = this.p.bgSpeed;
      this.collidesWith = ["player", "bullet"];
    }
    update(dt) {
      super.update(dt);
      this.x -= this.vx;
      if (this.x < -this.w) {
        this.remove = true;
      }
      if (Math.abs(this.x % 16) === 0) {
        this.y -= 1;
      }
    }
    receiveDamage(o2) {
      if (o2.name === "bee") {
        o2.hitBaddie(this);
        return;
      }
      this.g.audio.play("TIP");
      this.g.burst(o2.x, o2.y, 5, 1);
      o2.remove = true;
    }
  };

  // src/game/index.js
  var o = base_default;
  o.states = {
    Title,
    Help,
    Play,
    Win,
    Tutorial
  };
  o.ents = {
    Sprite,
    Text,
    Spawn,
    Boom,
    Particle,
    Control,
    Bullet,
    Bee,
    Worm,
    Eye,
    Creep,
    Fly,
    Bg,
    Cave_bg,
    Cloud: Bg2,
    Shroom,
    Powerup,
    Overlay,
    Wiper,
    Spike
  };
  new Game(o);
})();
