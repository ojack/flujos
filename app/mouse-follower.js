const EventEmitter = require('events')

module.exports = () => {
  let mouse = { x: 0, y: 0 }
  const emitter = new EventEmitter()
  window.onmousemove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    emitter.emit('move', mouse)
  }

  return emitter
}
