const initStreamingMedia = require('./init-media-sources.js')
const initHydra = require('./init-hydra.js')
const html = require('nanohtml')
const initPixi = require('./pixi.js')
const agua = require('./agua.js')
const EventEmitter = require('events')

const flokURL = "https://flok.clic.cf/s/NjUxMWM2MjUtOTFlZi00NzNiLWJhNTUtMzVhNWIwY2U0MmFm?layout=hydra,hydra&noHydra=1&bgOpacity=0"

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const edit = urlParams.get('edit')
const readOnly = edit == 1 ? false : true

const emitter = new EventEmitter()
const mouse = require('./mouse-follower.js')(emitter)
const countdown = require('./lib/countdown.js')
const state = { width: window.innerWidth, height: window.innerHeight}

agua.load()
initHydra({ emitter: emitter }, state)
initPixi({ emitter: emitter }, state)
// create ui elements
const intro = html`<div class="pa4 i f2"> <h1 class="f1 i"> flujos </h1>
    <p class=""> live website performance <br> by Celeste Betancur and Olivia Jack</p>
    <p class=""> part of <a class="black ul dim" href="https://oscillation-festival.be/#about" target="_blank">Oscillation Festival</a> </p>
    May 1, 2021 @ 11:30pm Brussels / 4:30pm Medellín / 2:30pm San Francisco
      <div class="white">${countdown()}</div>
    <div onclick=${start} class="mt5 ph4 bg-black white br-pill pointer dim dib pa2"> ${">>>"} enter ${"<<<<"} </div>


  </div>`

const uiContainer = html`<div class="w-100 h-100 absolute top-0 left-0 overflow-y-auto flex items-center justify-center">${intro}</div>`

const iframe = html`<iframe src="${flokURL}${readOnly?'&readonly=1':''}" frameborder="0" class="w-100 h-100" style="margin-top:-40px;${readOnly?"pointer-events:none":''}"></iframe>`

const editor = html`<div class="absolute mb5 bottom-0 left-0 w-100 skewY overflow-hidden pa2" style="height:60%;transition: opacity 1s;">
  ${iframe}
</div>`

if(readOnly) {
  setTimeout(() => editor.style.opacity = 1, 5000)
}

window.editor = iframe
let hasSynced = false
let timeout = null
// execute editor events on global context
window.addEventListener("message", function(event) {
  //console.log('received message', event)
  if(event.data) {
    if(event.data.cmd === "evaluateCode") {
      //  console.log('evaluate', event.data.args.body)
      editor.style.opacity = 1
      if(readOnly) setTimeout(() => editor.style.opacity = 1, 2000)
      if (event.data.args.editorId == 1) {
        agua.run(event.data.args.body)
      } else {
        eval(event.data.args.body)
      }

    } else if (event.data.cmd === "initialSync") {
      if(!hasSynced) {
        const editorText = event.data.args.editors
        if(editorText[0]) eval(editorText[0])
        if(editorText[1]) agua.run(editorText[1])
      }
    }
  }
})

function start() {
  uiContainer.innerHTML = ''
  uiContainer.appendChild(editor)
  emitter.emit('start')
  initStreamingMedia({ emitter: emitter })
}
document.body.appendChild(uiContainer)
//  document.body.appendChild(editor)
//}
