import Levels from '../data/levels.json';
import Wiper from '../entities/wiper';

export default class Play {

  constructor(g, o) {
    this.g = g;
    this.o = o;

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
    this.levelData = Levels.levels[this.levelNum];
    this.loadLevel(this.levelData);

    this.gameOver = false;
    this.levelComplete = false;
    this.showPointer = false;

    this.p1 = g.spawn('Bee', {p: this});
    this.wiper = new Wiper({p: this, g: g});
  }

  update(dt) {
    let g = this.g;

    this.baddies = 0;
    this.wiper.update(dt);
    for (let n of this.g.ents) {
      if (n.group === 'baddies') this.baddies += 1;
      n.update(dt);
    }


    if (!this.levelComplete && (this.dist % this.levelData.freq === 0)
      && this.baddies < this.levelData.max) {
      if (this.levelNum === 0) {
        this.waveFly();
      } else {
        g.spawn(g.H.rndArray(this.levelData.ents), { p: this });
      }
    };

    if (!this.gameOver) {
      this.dist -= 1;
    }
    this.percent = (~~this.dist / this.levelDist * g.w);
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


    for (let n of this.g.ents) n.render();

    g.draw.text(g.H.pad(this.score), this.scoreText, 2, 2);
    for (let i = 0; i < this.p1.lives; i += 1) {
      g.draw.img(g.imgs['heart'], 58 - (i * 6), 2);
    }

    let offset = this.percent > 0
      ? g.w - this.percent - g.w
      : 0;
      g.draw.img(g.imgs['progress'], offset, 0, 1, 0.25);


    if (this.gameOver && this.g.fader > 0) {
      g.draw.text('GAMEOVER', this.scoreText, false, 20);
    }

    if (this.showPointer) {
      g.draw.img(g.imgs.pointer, g.input.m.x, g.input.m.y);
    }

    this.wiper.render();

  }

  killBaddie(o) {
    if (Math.random() > 0.9) {
      this.g.spawn('Powerup', {p: this, x: o.x, y: o.y});
    }
    this.score += o.val;
    o.remove = true;
  }

  loadLevel(level) {
    if (!level) return;
    this.bgSpeed = level.bgSpeed;
    this.levelDist = level.dist;
    this.dist = level.dist;
    this.waves = [];

    this.g.ents.forEach((e) => {
      if (e.name !== 'bee') {
        e.remove = true;
      }
    });

    level.bg.forEach((l) => {
      let ent = l.k;
      l.p = this;
      this.g.spawn(ent, l);
    });

    level.spawns.forEach((s) => {
      let ent = s.k,
          delay = s.delay;
      s.p = this;
        this.g.addEvent({
          t: delay,
          cb:() => {
          this.g.spawn(ent, s);
          }
        });
    })

    this.g.ents.reverse();

    if (this.p1) {
      this.p1.started = false;
      this.p1.y = 32;
    }

    if (level.muzak !== 'undefined') {
      console.log('MUSIC', level.muzak, AUDIO);
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
    if (this.percent < 0 || this.gameOver) return;
    const g = this.g;
    type = type || g.H.rndArray(['blue', 'green', 'brown']);
    y = y || g.H.rnd(4, 60);
    num = num || 5;
    for (let i = 0; i < num; i += 1) {
      g.addEvent({
        t: 20 * i,
        cb: () => {
        if (this.gameOver) return;
        g.spawn('Fly', {p: this, type: type, y: y});
        }
      })
    }
  }

  initGameOver() {
    if (this.gameOver) { return; }
    this.gameOver = true;
    if (this.g.mainMusic) {
      this.g.mainMusic.pause();
    }
    this.p1.remove = true;
    this.bgSpeed = 0;
    this.g.spawn('Overlay', {p: this, col: 3});

    this.g.addEvent({
      t: 300,
      cb: () => {
        this.showPointer = true;
        this.g.spawn('Control', {
          y: this.g.h - 12,
          x: false,
          w: 28,
          clickCol: 3,
          col: 0,
          key: ' ',
          text: 'REPLAY',
          cb: () => {
            if (this.g.mainMusic) {
              this.g.mainMusic.pause();
              this.g.mainMusic.currentTime = 0;
            }
            this.g.changeState('Play', {levelNum: this.levelNum});
          }
        });
      }
    })
  }

  initLevelComplete() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.g.events = [];
    let cb = () => {
      this.levelNum += 1;
      this.levelData = Levels.levels[this.levelNum];
      if (!this.levelData) {
        this.g.changeState('Win');
      }
      this.loadLevel(this.levelData);
    }
    this.wiper.start(cb);
  }

}
