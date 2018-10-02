import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../providers/spotify.service';

@Component({
  selector: 'me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  me;
  constructor(public spotify: SpotifyService) { }

  async ngOnInit() {
   this.me = await this.spotify.getMe();
  }

}
