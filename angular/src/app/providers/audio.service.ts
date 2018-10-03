import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioElement: HTMLAudioElement;
  state;
  currentPercent;
  currentTrack;
  constructor() {
    this.audioElement = new Audio();
    setInterval(() => {
      if (this.audioElement.duration) {
        this.currentPercent = (this.audioElement.currentTime * 100) / this.audioElement.duration;
        if (this.currentPercent === 100) { this.currentPercent = 0; }
      }
    }, 50);
  }

  play(track) {
    if (!track.preview) { return; }
    if (track === this.currentTrack) {
      return this.audioElement.paused ? this.audioElement.play() : this.audioElement.pause();
    }
    this.currentTrack = track;
    this.audioElement.src = track.preview;
    this.audioElement.play();
  }
}
