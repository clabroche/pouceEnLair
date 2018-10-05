import { Component, Input, OnChanges, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { SpotifyService } from '../providers/spotify.service';
import { CltPopupComponent } from '../overlay/popup/popup.component';
import axios from 'axios';
import bluebird from 'bluebird';
import fastsort from 'fast-sort';
import { AudioService } from '../providers/audio.service';
@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnChanges {
  @Input() playlist: any = {tracks: []};
  poll;
  id;
  bestPolls = [];
  criterions = [
    { id: 'melody', name: 'Mélodique' },
    { id: 'original', name: 'Original' },
    { id: 'nul', name: 'Nul à chier' },
    { id: 'top', name: 'Top moumoutte' },
    { id: 'discovery', name: 'Découverte' },
  ];
  @ViewChild('votePopup') votePopup: CltPopupComponent;
  filterFun = data => data;
  constructor(public spotify: SpotifyService, public audio: AudioService) { }

  async getPoll() {
    this.poll = (await axios.get('/trackdata')).data.vote;
    this.criterions = (await axios.get('/trackdata')).data.criterions;
    this.getBest();
  }
  async ngOnChanges(changes: SimpleChanges) {
    this.playlist = {tracks: []};
    this.bestPolls = [];
    if (!changes.playlist.currentValue) { return; }
    this.id = changes.playlist.currentValue.id;
    if (Array.isArray(changes.playlist.currentValue.tracks)) {
      this.playlist = changes.playlist.currentValue;
      this.getPoll();
      return changes.playlist.currentValue.tracks;
    }
    await bluebird.map(changes.playlist.currentValue.tracks.items, async trackData => {
      const image = trackData.track.album.images.pop(); // lower resolution
      return {
        added_by: trackData.added_by.id,
        added_by_user: (await axios.get(trackData.added_by.href, {
          headers: {
            Authorization: `Bearer ${this.spotify.apiKey}`
          }}).catch(err => ({data: undefined}))).data,
        artist: trackData.track.artists.map(track => track.name).join(','),
        id: trackData.track.id,
        href: trackData.track.external_urls.spotify,
        album: trackData.track.album.name,
        title: trackData.track.name,
        preview: trackData.track.preview_url,
        cover: image ? image.url : 'https://s.mxmcdn.net/site/images/album-placeholder.png',
      };
    }).then(data => {
      changes.playlist.currentValue.tracks = data;
      this.playlist.tracks = changes.playlist.currentValue.tracks;
      this.playlist.name = changes.playlist.currentValue.name;
      this.getPoll();
      return data;
    });
  }

  updateFilter(data) {
    this.filterFun = tracks => tracks.filter(track =>
      track.title.toUpperCase().includes(data.toUpperCase()) ||
      track.album.toUpperCase().includes(data.toUpperCase()) ||
      track.artist.toUpperCase().includes(data.toUpperCase())
    );
  }

  vote(track) {
    this.votePopup.open(track);
  }

  async voteFor(track, criterion) {
    await axios({
      method: 'POST',
      url: `/vote`,
      data: {
        id: track.id,
        user: this.spotify.me.id,
        criterion,
        playlist: this.id
      },
    }).catch(err => []);
    return this.getPoll();
  }
  async getBest() {
    if (!this.poll) { return '--'; }
    const playlistPoll = this.poll[this.id];
    const originals = {};
    if (!playlistPoll) { return; }
    Object.keys(playlistPoll).map(songId => {
      Object.keys(playlistPoll[songId]).map(criterion => {
        if (playlistPoll[songId][criterion].length) {
          if (!originals[criterion]) { originals[criterion] = []; }
          originals[criterion].push({
            id: songId,
            track: this.playlist.tracks.filter(track => track.id === songId).pop(),
            strength: playlistPoll[songId][criterion].length
          });
        }
      });
    });
    this.bestPolls = Object.keys(originals).map(criterion => {
      return {
        name: this.criterions.filter(_criterion => criterion === _criterion.id).pop().name,
        hide: true,
        poll: fastsort(originals[criterion]).desc('strength')
      };
    });
    this.bestPolls = fastsort(this.bestPolls).asc('name');
  }

  getPollFor(plylistId, musicId, criterion) {
    if (
      !this.poll[plylistId] ||
      !this.poll[plylistId][musicId] ||
      !this.poll[plylistId][musicId][criterion]
    ) {
      return false;
    }
    return this.poll[plylistId][musicId][criterion].includes(this.spotify.me.id);
  }

  async addCriterion(value) {
    if (value) {
      await axios({
        method: 'POST',
        url: `/addCriterion`,
        data: {
          criterion: value
        },
      }).then(json => {
        this.criterions = json.data.criterions;
      }).catch(console.error);
    }
  }
}
