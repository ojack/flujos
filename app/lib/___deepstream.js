const { DeepstreamClient } = require('@deepstream/client')

const client = new DeepstreamClient('localhost:6020')
// const client = new DeepstreamClient('ws://deepstream-flujos.glitch.me:1883')

module.exports = () => {
client.login({ username: Math.random()})

const id = client.getUid()
//console.log('uuid', client.getUid())



const mouseList = client.record.getList('flujos-mouse')
mouseList.on( 'entry-added', (entry) => {
  console.log('entry added!')
  console.log(entry, mouseList.getEntries())
} )

mouseList.on( 'entry-removed', (entry) => {
  console.log('entry removed!')
  console.log(entry, mouseList.getEntries())
} )

mouseList.whenReady( ( el ) => {
  const entries = mouseList.getEntries();
  console.log('mouse list', entries, mouseList)
  mouseList.addEntry( mouseId )
} );

mouseList.subscribe( (entries) => {
  console.log('entry updates', entries, mouseList.getEntries())

}, false );


const mouseId = 'mouse/' + id
const mouse = client.record.getRecord( mouseId );
//mouse.whenReady( ( record ) => {
  mouse.set({x: 3394, y: 3033})
  console.log('mouse', mouseId, mouse)
//mouseList.addEntry( mouseId )
//})
}
