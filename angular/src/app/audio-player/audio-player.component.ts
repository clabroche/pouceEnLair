import { Component, OnInit } from '@angular/core';
import { AudioService } from '../providers/audio.service';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {

  constructor(public audio: AudioService) { }

  ngOnInit() {
  }

}
