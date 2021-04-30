const PIXI = require('pixi.js')
const cursorImage = require('./../assets/mouse-arrow.png');

const RemoteMouse = require('./lib/remoteMouse.js')

let mouseProps = {
  width: 76,
  height: 120,
  scale: 0.5,
  rotate: 0.005
}



module.exports = ({ parent = document.body, emitter } = {}, state) => {
  const app = new PIXI.Application({
    // backgroundColor: 0x1099bb
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true
  });
  parent.appendChild(app.view);

  s2.init({ src: app.view })
  // app.view.style.zIndex = 100
  app.view.style.position = "absolute"
  app.view.style.pointerEvents = "none"
  app.view.style.zIndex = 100
//  console.log('images', cursorImage)

  const mouseTexture = PIXI.Texture.from(cursorImage)
  const cursor = new PIXI.Sprite(mouseTexture)
  cursor.anchor.set(0.5)

  cursor.width = mouseProps.width * mouseProps.scale
  cursor.height = mouseProps.height * mouseProps.scale
  cursor.x = 300;
  cursor.y = 400;

  const remoteMice = new RemoteMouse({ texture: mouseTexture, container: app.stage }, emitter)

  window.Mouse = function (opts) {
    mouseProps = Object.assign({}, mouseProps, opts)
    const w = mouseProps.width * mouseProps.scale
    const h = mouseProps.height * mouseProps.scale
    Object.values(remoteMice.mice).forEach((mouse) => {
      mouse.width = w
      mouse.height = h
      cursor.width = w
      cursor.height = h
    })
  }

  let videoSprite = null

  app.ticker.add(() => {
    // just for fun, let's rotate mr rabbit a little
  //  cursor.rotation += 0.005;
  //   cursor.width = (30 + Math.sin(time*3)*20)/3
  // //  cursor.width = 4
  //   const h = (40 + Math.sin(time*3)*20)/3
  //   cursor.height = h
    // console.log(h)
  });
  emitter.on("mouse:move", (pos) => {
    cursor.x = pos.x
    cursor.y = pos.y
    // if(videoSprite !== null) {
    //   videoSprite.x = pos.x
    //   videoSprite.y = pos.y
    // }
    // console.log(cursor)
  })

  emitter.on("stream:loaded", (index, video) => {
    // console.log('reeived video', video)
    //  const texture = PIXI.Texture.from(video)
    //  videoSprite = new PIXI.Sprite(texture)
    //  videoSprite.width = 150
    //  videoSprite.height = 100
    //   videoSprite.x = 400
    //   videoSprite.y = 100
    //   app.stage.addChild(videoSprite)
  })

  app.stage.addChild(cursor)

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  })
  //  const defaultIcon = "cursor: url('./../assets/mouse-arrow.png'),auto;";
  //const hoverIcon = "url('examples/assets/bunny_saturated.png'),auto";

  // app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
  // app.renderer.plugins.interaction.cursorStyles.hover = defaultIcon;
}
