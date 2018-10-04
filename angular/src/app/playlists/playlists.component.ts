import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../providers/spotify.service';

@Component({
  selector: 'playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: any;
  @Output() playlistChange = new EventEmitter();
  constructor(public spotify: SpotifyService) { }

  async ngOnInit() {
    this.playlists = await this.spotify.myPlaylists();
    this.selectPlaylist(this.playlists.items[0]);
  }
  selectPlaylist(playlist) {
    this.playlistChange.emit(playlist);
  }
  async searchPlaylist(url) {
    const playlist = await this.spotify.getPlaylist(url);
    this.playlists.items.push(playlist);
    this.playlistChange.emit(playlist);
  }
}
