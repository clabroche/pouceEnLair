import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SpotifyService } from './providers/spotify.service';
import { MeComponent } from './me/me.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { CustomPipe } from './pipes/custom.pipe';
import { CltOverlayModule } from './overlay/overlay.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AudioService } from './providers/audio.service';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

@NgModule({
  declarations: [
    AppComponent,
    MeComponent,
    PlaylistsComponent,
    PlaylistComponent,
    CustomPipe,
    AudioPlayerComponent
  ],
  imports: [
    BrowserModule,
    CltOverlayModule,
    BrowserAnimationsModule
  ],
  providers: [
    SpotifyService,
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
