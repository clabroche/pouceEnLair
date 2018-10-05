import { Injectable } from '@angular/core';
import axios from 'axios';
import bluebird from 'bluebird';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  attempt = 0;
  me: {
    id: string
    external_urls: {
      spotify
    },
    display_name,
    images: {url: string} []
  };
  apiKey: string;
  constructor() {
    this.apiKey = localStorage.getItem('apiKey');
  }

  async getMe() {
    this.me = await this.spotify('https://api.spotify.com/v1/me');
    return this.me;
  }

  async spotify(url) {
    console.log(this.attempt)
    if (this.attempt === 100) { return; }
    this.attempt ++;
    return axios({
      url,
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }).then(obj => obj.data || obj)
      .catch(async err => {
      if (err.response.status === 401) {
        await this.login();
        return this.spotify(url).then(data => {
          this.attempt = 0;
          return data;
        });
      }
      return Promise.reject(err);
    });
  }


login() {
  return new Promise((resolve, reject) => {
    const popup = window.open('/login', '_blank', 'width=500,height=500');
    window.addEventListener('message', result => {
      popup.close();
      localStorage.setItem('apiKey', result.data);
      this.apiKey = result.data;
      resolve(result.data);
    }, false);
  });
}


  async myPlaylists() {
    const playlists = await this.spotify('https://api.spotify.com/v1/me/playlists');

    playlists.items = await bluebird.map(playlists.items, async playlist => {
      playlist.tracks = await this.spotify(playlist.tracks.href);
      return playlist;
    });
    return playlists;
  }

  getPlaylist(url) {
    return  this.spotify(`https://api.spotify.com/v1/playlists/${url}`);
  }

}
