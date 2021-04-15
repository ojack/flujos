const PIXI = require('pixi.js')
const cursorImage = require('./../assets/mouse-arrow.png');

module.exports = ({ parent = document.body, mouse } = {}) => {
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

  cursor.x = 300;
  cursor.y = 400;

  app.ticker.add(() => {
    // just for fun, let's rotate mr rabbit a little
    cursor.rotation += 0.005;
  });
  mouse.on("move", (pos) => {
    cursor.x = pos.x
    cursor.y = pos.y
    // console.log(cursor)
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
