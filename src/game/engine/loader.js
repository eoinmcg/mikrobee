export default class Loader {

  constructor(images, audio) {
    this.images = images;
    this.loaded = [];
    this.loadedImgs = 0;
    this.totalImgs = Object.keys(images).length;
    this.base = (window.BUILD)
      ? 'a/' : 'http://local/arcade/LOWREZ2024/a/';
    this.base = '/';
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
    // const append = 'data:image/gif;base64,R0lGODlh';
    const append = 'data:image/gif;base64,';
    Object.keys(i).forEach((n) => {
      this.loaded[n] = new Image();
      this.loaded[n].onload = (e) => {
        this.loadedImage();
      }
      this.loaded[n].src = append + i[n];
    });
  }

  loadAudio() {
    this.audioLoaded = 0;
    this.audio.forEach((file) => {
      let audio = new Audio();
      audio.addEventListener('canplaythrough', (e) => {
        this.loadedAudio();
      },
       false);
      audio.src = this.base+file;
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
}
