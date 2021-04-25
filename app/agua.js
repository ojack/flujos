const reverbjs = require('./lib/reverb.js')

const basementReverb = require('./../assets/Basement.mp4')
const sampleFiles = require('./../assets/water/*.ogg')

console.log('SAMPLES', sampleFiles)

const samples = []
const indexRegistry = []
let howlerStatus = 'not ready'

const preloadAudio = () => {
  for(let i = 1; i <= 11; i++){
    samples[i-1] = new Howl({
      src: sampleFiles[i],
      volume: 1
    })
  };
  howlerStatus = `Audio setup is ready and ${samples.length} samples were loaded. `
  Howler.masterGain.disconnect(Howler.ctx.destination);
  reverbjs.extend(Howler.ctx);
  var reverbUrl = basementReverb
  var reverbNode = Howler.ctx.createReverbFromUrl(reverbUrl, () => {
    reverbNode.connect(Howler.ctx.destination);
    howlerStatus += 'Convolver node succesfully loaded. '
  });
  Howler.masterGain.connect(reverbNode);

  for (let samp of samples){
    indexRegistry.push(samp.play());
    samp.pause();
  }
  console.log('loaded samples')
}

const aguaDialect = (text) => {
  let upper = text.toUpperCase()
  let newLines = upper.split(/\n/)
  let tokens = []
  let sampWords = ['COPOS','VASO','LLUVIA','CORRIENTE','RIO','BRISA','MAREA','NIEBLA','NIEVE','AGUA','GRANIZADA','GOTAS','MAR','OCEANO']
  let loopStateOn = ['REPITE','REPITEN','CONSTANTES','CONSTANTE','CONTINUA','CONTINUAS','CONTINUO','CONTINUOS','FLUJOS','FLUYEN','FLUYE','FLUIR','FLUIDO','PERPETUA','ETERNA','ETERNO','PERPETUO','CÍCLICO','CÍCLICA','CÍCLICOS','CÍCLICAS','INCONTABLE','INCONTABLES','INCALCULABLE','INFINITO','INFINITA','INFINITOS','INFINITAS','INTERMINABLE','INTERMINABLES']
  let stopWords = ['PARAN','PARA','DETENTE','FRENA','DETIENEN','DETIENE','PAUSA','PAUSAN','ESTANCA','ESTANCAN','REPRESA','REPRESAN','CONGELA','CONGELAN','CONGELADO','CONGELADA','CONGELADOS']
  let softVal = ['SUAVE','SUAVES','SUAVEMENTE','TRANQUILO','TRANQUILA','CALLADA','CALLADO','TRANQUILOS','TRANQUILAS','CALLADAS','CALLADOS','SILENTES','TENUES','TENUE','REPOSO','REPOSA','REPOSAN']
  let softerVal = ['MENOS','POCO','POCAS','POCOS','POCA','ESCASO','ESCASA','ESCASEAN','LIMITADO']
  let medVal = ['FUERTE','FUERTES','VIOLENTO','VIOLENTA','VIOLENTOS','VIOLENTAS','DUROS','DURAS','AGRESIVA','AGRESIVO','TORMENTOSA','TORMENTOSO','TORMENTOSOS','ROBUSTO','POTENTE','ENÉRGICO','ENÉRGICA']
  let loudVal = ['MUCHO','MUCHAS','MUCHOS','MUCHA','ABUNDANTE','ABUNTANTES','NUMEROSO','NUMEROSA','NUMEROSOS','NUMEROSAS','INMENSO','INMENSA']
  let fastVal = ['LIGERA','VOLATIL','RÁPIDA','RÁPIDO','LIGERAS','LIGEROS','VOLATILES','RÁPIDAS','RÁPIDOS']
  let slowVal = ['LENTA','LENTO','LENTOS','LENTAS','CALMADO','CALMADA','CALMADOS','CALMADAS','SOMNOLIENTO','SOMNOLIENTA','SOMNOLIENTAS','SOMNOLIENTOS','DESPACIO','PROFUNDO','PROFUNDA','PROFUNDOS','PROFUNDAS']

  let stopST = [0,0,0,0,0,0,0,0,0,0,0]
  let loopST = [0,0,0,0,0,0,0,0,0,0,0]
  let volST = [1,1,1,1,1,1,1,1,1,1,1]
  let speedST = [1,1,1,1,1,1,1,1,1,1,1]
  let playing = [0,0,0,0,0,0,0,0,0,0,0]

  for(let i = 0; i < newLines.length; i++){
        let t = newLines[i].split(' ')
        if(t !== ''){
          tokens.push(t)
        }
  }
  for(let i = 0; i < tokens.length; i++){
    for(let j = 0; j < tokens[i].length; j++){
      let index = sampWords.indexOf(tokens[i][j])
      if(index !== -1){
        playing[index] = 1
        tokens[i].forEach((e) => {
          stopST[index] += stopWords.includes(e) ? 1 : 0;
          loopST[index] += loopStateOn.includes(e) ? 1 : 0;
          volST[index] -= softVal.includes(e) ? 0.2 : 0;
          volST[index] += medVal.includes(e) ? 0.2 : 0;
          volST[index] -= softerVal.includes(e) ? 0.1 : 0;
          volST[index] += loudVal.includes(e) ? 0.1 : 0;
          speedST[index] += fastVal.includes(e) ? 0.5 : 0;
          speedST[index] -= slowVal.includes(e) ? 0.2 : 0;
        });
        if(stopST[index] === 1){
          loopST[index] = 0;
          samples[index].stop(indexRegistry[index]);
        }
        samples[index].loop(loopST[index] === 1 ? true : false,indexRegistry[index]);
        samples[index].volume(volST[index],indexRegistry[index]);
        samples[index].rate(speedST[index],indexRegistry[index]);
        if(stopST[index] === 0){
          samples[index].play(indexRegistry[index]);
        }
      }
    }
  }
  let t = `Agua(lang)
           >>> ${howlerStatus}
           Samp ids: ${indexRegistry}
           Playing: ${playing}
           Rates: ${speedST}
           Gains: ${volST}
           Loops: ${loopST}`
  return t
}

module.exports = {
  load: preloadAudio,
  run: aguaDialect
}

// function getValue() {
//   var x = document.getElementById("ta").value;
//   document.getElementById("log").innerHTML = aguaDialect(x);
// }
