import { Injectable } from '@angular/core';
import axios from 'axios';
import bluebird from 'bluebird';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
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

  spotify(url) {
    return axios({
      url,
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }).then(obj => obj.data).catch(async err => {
      if (err.response.status) {
        await this.login();
        return this.spotify(url);
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

}
