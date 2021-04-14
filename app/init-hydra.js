const html = require('nanohtml')

module.exports = () => {
  const canvas = html`<canvas class="w-100 h-100"></canvas>`
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const hydra = new Hydra({
   detectAudio: false, canvas: canvas
  })

  speed = 0.5


// unfoldings
osc(10, 0.03, 1.2).color(1.0, 0.3, 0.6)
  .add(osc(15, -0.1).color(0.1, 0.9, 0.3)).out()

src(o1).layer(src(o0).mask(osc(10, -0.1).rotate(0, 0.1).modulate(osc(10).thresh(0.8, 0.4)).kaleid(2).thresh(0.9, 0)), 0).modulate(osc(20), -0.004, 1.02)
  .modulate(src(o1).color(1, 0), 0.1)
  .contrast(1.1)
  .blend(o0, () => Math.sin(time*0.1)*0.5 + 0.5).out(o1)

render(o1)
}