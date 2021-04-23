// const peers = require('./lib/deepstream.js')()

// const peers = require('./lib/ws.js')

module.exports = (emitter) => {
  let mouse = { x: 0, y: 0 }
//  const emitter = new EventEmitter()
  window.onmousemove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    emitter.emit('mouse:move', mouse)
  }

  return mouse
}
