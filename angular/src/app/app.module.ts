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

@NgModule({
  declarations: [
    AppComponent,
    MeComponent,
    PlaylistsComponent,
    PlaylistComponent,
    CustomPipe
  ],
  imports: [
    BrowserModule,
    CltOverlayModule,
    BrowserAnimationsModule
  ],
  providers: [
    SpotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
