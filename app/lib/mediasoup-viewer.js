const Room = require('./room.js')
const EventEmitter = require('events')

module.exports = class Viewer extends EventEmitter{
  constructor ({ videoEl, server = `ws://localhost:2345`, streamKey = "test"}) {
    super()
    this.room = new Room()
    this.tracks = { audio: null, video: null }
    this.isActive = false

    const _server = `${server}/?stream=${streamKey}`
    console.log('connecting to', _server)
    this.room.join(_server)

    if(!videoEl) {
      videoEl = document.createElement('video')
      document.body.appendChild(videoEl)
    }
    this.video = videoEl
  //  this.video.autoplay = true
  //  this.video.muted = true

    this.video.addEventListener('canplay', (event) => {
  //console.log('Video can start, but not sure it will play through.');
});

    this.room.on("@consumer", async consumer => {
      const {
        id,
        appData: { peerId },
        track
      } = consumer;
    //  console.log("receive consumer", consumer);
      //
      // const el = createMediaEl(track, peerId, id);
      // document.body.append(el)
      this.addTrack(track, peerId, id)
    });

    this.room.on("@consumerClosed", (consumer) => {
      console.log(consumer)
      console.log(consumer.consumerId)
      this.removeTrack(consumer.consumerId)
      //removeMediaEl(document.body, "data-search-id", consumerId);
    });

    this.room.on("@producerClosed", ({ producerId }) => {
      console.log('producer closed')
    //  removeMediaEl(localTracks, "data-search-id", producerId);
    });

    this.room.on("@peerClosed", ({ peerId }) => {
    //  removeMediaEl(remoteTracks, "data-peer-id", peerId);
    });
  }

  addTrack(track, peerId, consumerId) {
    if(this.tracks[track.kind] !== null) {
      // remove track
    }
    this.tracks[track.kind] = {
      track: track,
      peerId: peerId,
      consumerId: consumerId
    }
    this.updateStream()
  }

   updateStream() {
  //  console.log('updating stream', tracks)
    const stream = new MediaStream()
    if(this.tracks.audio !== null) stream.addTrack(this.tracks.audio.track)
    if(this.tracks.video !== null) stream.addTrack(this.tracks.video.track)
    this.video.srcObject = stream

    this.isActive = true
    if(this.tracks.audio === null && this.tracks.video === null) this.isActive = false
  //  console.log('active', isActive)
  //  onUpdate(tracks)
    this.emit('update', this.tracks)
  }

  removeTrack(id) {
  //  console.log('removing tracks', id, tracks)
    if(this.tracks.audio !== null && this.tracks.audio.consumerId === id) {
      this.tracks.audio = null
    }
    if(this.tracks.video !== null && this.tracks.video.consumerId === id) {
      this.tracks.video = null
    }
    this.updateStream()
  }
}

// ({ videoEl, server = `ws://localhost:2345`, streamKey = "test", onUpdate = () => {}}) => {
//
//
//   function createMediaEl(track, peerId, searchId) {
//     const el = document.createElement(track.kind);
//     el.srcObject = new MediaStream([track]);
//     el.autoplay = true
//     el.setAttribute("data-peer-id", peerId);
//     el.setAttribute("data-search-id", searchId);
//     el.playsInline = true;
//   //  el.play().catch(console.error);
//     return el;
//   }
//
//   return {
//     this.room: this.room,
//     tracks: tracks,
//     server: server,
//     isActive: isActive
//   }
// }
