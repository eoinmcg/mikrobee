export class Waves {
  constructor(g, o) {
    this.paths = [
      [[68,10], [10,10], [10,50], [68,10]],
      [[68,10], [-10,50]],
      [[68,50], [-10,10]]
    ];

    this.baddies = {
      intro: {
        i: 'fly',
        num: 1,
        paths: [3]
      },
      fly: {
        num: 3,
        paths: [0]
      },
    }

    this.levels = [
      { avail: ['fly']}
    ];

    this.g = g;
    this.p = o.p;
    this.nextWave = this.g.H.rnd(50, 80);
    this.level = 0;
    this.spawn('fly', false);
  }

  update(dt) {
    this.nextWave -= dt * 10;
    if (this.nextWave <= 0) {
      this.nextWave = this.g.H.rnd(50, 80);
      this.spawn();
    }
  }

  spawn(name, reflect = true) {
    name = name ? name : this.g.H.rndArray(this.levels[this.level].avail);
    console.log('sPAWN: ', name);
    let baddie = this.baddies[name],
        waveId = this.mkId(),
        p = this.g.H.rndArray(baddie.paths),
        m = Math.random() > 0.5;

      this.p.waves[waveId] = baddie.num;
      let o = {
          baddie: 'Fly',
          i: baddie.i || name,
          points: this.paths[p],
          mirror: m,
          waveId: waveId, p: this.p 
      };
      this.mkWave(o);
      if (reflect) {
        o.mirror = !o.mirror;
        this.mkWave(o);
      }
  }

  mkWave(o) {
    console.log(o, 'mkwave');
      for (let i = 0; i < o.baddie.num; i += 1 ) {
        o.delay = i * 2;
        this.g.spawn('Baddie', o);
      }
  }

  mkId() {
    return `id-${Math.random().toString(36).substr(2, 16)}`;
  }


}

