const PIXI = require('pixi.js')
const cursorImage = require('./../assets/mouse-arrow.png');

module.exports = ({ parent = document.body, emitter } = {}) => {
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

  console.log('images', cursorImage)

  const cursor = PIXI.Sprite.from(cursorImage)
  cursor.anchor.set(0.5)

  cursor.width = 30
  cursor.height = 40
  cursor.x = 300;
  cursor.y = 400;

  let videoSprite = null

  app.ticker.add(() => {
    // just for fun, let's rotate mr rabbit a little
    cursor.rotation += 0.005;
    cursor.width = 30 + Math.sin(time*3)*20
  //  cursor.width = 4
    const h = 40 + Math.sin(time*3)*20
    cursor.height = h
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
    console.log('reeived video', video)
     const texture = PIXI.Texture.from(video)
     videoSprite = new PIXI.Sprite(texture)
     videoSprite.width = 150
     videoSprite.height = 100
      videoSprite.x = 400
      videoSprite.y = 100
      app.stage.addChild(videoSprite)
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
