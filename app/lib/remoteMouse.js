// const io = require("socket.io-client")
const PIXI = require('pixi.js')

module.exports = class RemoteMouse {
  constructor({ texture, container }, emitter) {
    const socket = io.connect("https://flujos-socket.glitch.me");
    // const socket = io.connect("http://localhost:8000");
    console.log('connecting to socket', socket)

    this.texture = texture
    this.container = container
    this.id = null

    this.mice = {}

    socket.on('id', (id) => {
       console.log("id", id);
       this.id = id
    })

    socket.on('mouse', (data, id) => {
        //  console.log('mouse', data, id, this.mice[id])
          if(this.mice[id]){
            this.mice[id].x = data.x
            this.mice[id].y = data.y
          }
        }
      );

    socket.on('new connection', (id, data) => {
       console.log("new connection", id);
       this.addMouse(id, data)
    })

    socket.on('disconnect', (id) => {
       console.log("disconnect", id);
       this.removeMouse(id)
    })

    socket.on('existing connections', (sockets) => {
       console.log('connected sockets', sockets)
      // connections = sockets
        sockets.forEach((socket) => {
          if(socket.id !== this.id) {
            this.addMouse(socket.id, socket.data)
          }
        })
     })

     emitter.on("mouse:move", (pos) => {
       socket.emit('mouse', pos)
     })
  }

  removeMouse(id) {
    this.container.removeChild(this.mice[id])
    delete this.mice[id]
  }

  addMouse(id, position) {
    const mouse = new PIXI.Sprite(this.texture)
    mouse.anchor.set(0.5)
    mouse.x = position.x
    mouse.y = position.y
    mouse.width = 30/2
    mouse.height = 40/2
    this.container.addChild(mouse)
    this.mice[id] = mouse
  }
}
