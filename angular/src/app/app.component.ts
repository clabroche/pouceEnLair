import { Component, ViewChild, OnInit } from '@angular/core';
import { SpotifyService } from './providers/spotify.service';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular';
  selectedPlaylist;
  @ViewChild(PlaylistsComponent) playlistsComp: PlaylistsComponent;
  @ViewChild(PlaylistComponent) playlistComp: PlaylistComponent;
  constructor(private spotify: SpotifyService) {

  }

  ngOnInit() {
    this.playlistsComp.playlistChange.subscribe(playlist => {
      this.selectedPlaylist = playlist;
    });
  }

  async init() {
    await this.spotify.myPlaylists();
  }
}
