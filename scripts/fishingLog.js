
const { writeFileSync, readFileSync,appendFileSync } = require('fs')
const tmi = require('tmi.js')
let fishingLog = [] // filled by chat / flushed to disk */10min (@theBottom)
const opts = { channels: [ '#staggerrilla' ] }
const client = new tmi.client(opts)
client.on('connected', (addr,port) => console.log(`* Connected to ${addr}:${port}`))
client.on('message', onMessageHandler)
client.connect()

function onMessageHandler (target, context, msg, self) { // logFishing
  const user = context.username
  const time = parseInt(context['tmi-sent-ts'],10)
  const isStagger = user == 'staggerrilla'
  const isCast = msg.match(/^!fish/i)?.length == 1
  const isFish = msg?.match(/@(\w+).* (\w+) [⭐]+ (.*) weighing (.*)kg worth (.*) gold!.*now have (.*) gold/)
  const isReset = isStagger && msg.includes('!resetleaderboard')
  if (isStagger && isFish?.length){
    const [all,fisher,type,thing,weight,worth,total] = isFish
    const o = { time, type, thing, fisher }
    o.weight = parseFloat(weight)
    o.worth = parseInt(worth,10)
    o.total = parseInt(total,10) 
    fishingLog.push(o)
    console.log(...Object.values(o))
  }
}

setInterval( ()=>{ // log to disk every 10Minnnn
  const logFile = './public/logs/fishing.csv' 
  const newData = fishingLog.map(e=>e=Object.values(e).join(',')).join('\n')
  appendFileSync(logFile, `${newData}\n` )
  console.log(` ${fishingLog.length} flushed`)
  fishingLog = []
}, 10*60*1000 )