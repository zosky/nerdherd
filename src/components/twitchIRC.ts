/* eslint-disable @typescript-eslint/no-unused-vars */
import tmi from 'tmi.js'
import { getters } from './DataStore'
// import dayjs from 'dayjs'
// import advancedFormat from 'dayjs/plugin/advancedFormat'
// dayjs.extend(advancedFormat)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveLog: Record<string,any> = reactive({
  bleep:{},bloop:{},bub:{},fish:{},fishing:{},bubs:{},raw:[]
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveEntries: Record<string,any> = reactive({})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const liveRedeem: Record<string,any> = reactive([])
const clientStatus = reactive({ connected:false })

// Register our connect handlers
function onConnectedHandler (addr='twitch', port=1337) {
  console.log(`* Connected to ${addr}:${port}`)
  clientStatus.connected = true
}
// Called every time a message comes in
// log if GA ended
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onMessageHandler (target:any, context:any, msg:string) {
  // FISHING
  const time = parseInt(context['tmi-sent-ts'],10)
  const user = context.username
  const isStagger = user == 'staggerrilla'
  // entries
  const isBub = msg.match(/^!bub/i)?.length == 1
  const isBloop = msg.match(/.*!bloop.*/i)?.length == 1
  const isBleep = msg.match(/^!bleep/i)?.length == 1
  const isFish = msg.match(/^!fish/i)?.length == 1
  const isFishing = msg?.match(/@(\w+).* (\w+) [⭐]+ (.*) weighing (.*)kg worth (.*) gold!.*now have (.*) gold/)
  const isFishReset = isStagger && msg.includes('!resetleaderboard')
  const isBubs = msg.match(/^.addbubbers (\w+) (.*)/)
  const isBleepStart = user == 'bleepbloopinbot' && msg == '!raffle'
  const isBleepEnd = msg.match(/Raffle has ended and ([\w+, ]*) won (\d+) Bubs/)
  const isIgnored = [
    ['staggerrilla', /^b$/ ],
    ['bleepbloopinbot',/^.raffle$/ ], // !bloop start
    ['bleepbloopinbot', /You haz entered./],
    ['bleepbloopinbot', /This command is currently on cooldown.*/],
    ['streamelements', /@staggerrilla, set \w+ Bubs to \d+/],
    ['streamelements', /The Multi-Raffle for .\d+. Bubs will end in \d+ Seconds./ ],
    ['streamelements', /^(The |)stagge3Mayo a Multi.Raffle/ ], // bleep start
    ['streamelements',/Download.*strms.net.*staggerrilla/], // campaign msg
    ['pokemoncommunitygame',/.*/]
  ].some(f=> user==f[0] && msg.match(f[1])?.[0] )

  // "oneLiner" to init user in ea. miniGame like bloop: { user: [time1, time2....]}
  const saveEntry = (x:string,y:string,z:number) => { if (!liveLog[x]?.[y]) liveLog[x][y] = [z] ; else liveLog[x][y].push(z) }
  if(isBub) saveEntry('bub',user,time)
  if(isBloop) saveEntry('bloop',user,time)
  if(isBleep) saveEntry('bleep',user,time)
  if(isFish) saveEntry('fish',user,time)
  if(isFishReset) liveLog.fishing = {} // fish reset
  if(user == 'streamelements' && isBleepEnd?.length){
    const what = parseInt(isBleepEnd?.[2],10)
    isBleepEnd?.[1]?.split(', ')?.forEach((who:string) => {
      if(!liveLog?.bubs?.[who]) liveLog.bubs[who] = {}
      liveLog.bubs[who][time] = what
    })
  }
  if (isStagger && isFishing?.length) { 
    const [all,fisher,type,thing,weight,worth,total] = isFishing 
    if(!liveLog.fishing?.[fisher]) liveLog.fishing[fisher] = {}
    liveLog.fishing[fisher][time] = { 
      type, thing,
      weight: parseFloat(weight),
      worth: parseInt(worth,10),
      total: parseInt(total,10) 
    }
  }
  if (isStagger && isBubs?.length){
    const who = isBubs[1]
    const what = parseInt( isBubs[2]?.toLowerCase()?.replace('k','000'), 10 )
    if(!liveLog?.bubs?.[who]) liveLog.bubs[who] = {}
    liveLog.bubs[who][time] = what
  }
  // FIREHOSE
  const parsed = isBub || isBloop || isBleep || isFish || isFishReset || isFishing?.length || isBubs?.length || isBleepEnd?.length || isIgnored
  liveLog.raw.push({user:context.username,msg,context, parsed, time })
}

// connect
const client = new tmi.client({ channels: [ '#staggerrilla' ] })
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.connect()

export { liveLog, liveEntries, liveRedeem }
