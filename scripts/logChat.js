const tmi = require('tmi.js')
const opts = { channels: [ '#staggerrilla' ] }
const say = t => process.stdout.write(t)
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')
let sql = null // will hold connection for current run
const sqlInsert = async (table,values) => {
  const fields = { redeems: '(`who`,`what`)', bloop: '(`who`)', bleep: '(`who`)' }
  await sql.query(`INSERT IGNORE INTO ${table} ${fields[table]} VALUES ${values};`)
  const icons = { redeems:'🎮', bleep: '🙋', bloop: '🏐'}
  say(`${icons[table]}`)
}

// Create a client with our options
const client = new tmi.client(opts)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.connect()

// Called every time the bot connects to Twitch chat
async function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  sql = await mysql.createConnection(sqlConfig)
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  const isSTAG = context.username == 'staggerrilla'
  const isSE = context.username == 'streamelements'
  const isCMD = msg?.match(/!(bleep|bloop)/i)?.[1]?.toLowerCase()
  const isRedeem = msg?.match(/(\w+) just redeemed (.*) PogChamp/)
  if (isSE && isRedeem?.[1]) { 
    sqlInsert('redeems',`("${isRedeem?.[1]}","${isRedeem?.[2]}")` )
  } else if (isCMD) { 
    sqlInsert( isCMD, `("${context.username}")` )
  } // else if "BUBS from stag"

}
