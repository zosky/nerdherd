const { writeFileSync } = require('fs')
const mysql = require('mysql2/promise')
const sqlConfig = require('./dbAuth')


const thisWeek = ' WHERE YEARWEEK(`when`) = YEARWEEK(CURRENT_DATE) ORDER BY time ASC ;'
const q = { 
  redeems: 'SELECT YEARWEEK(`when`) week, UNIX_TIMESTAMP(`when`) time, who, what FROM redeems ' + thisWeek,
  bloop: 'SELECT YEARWEEK(`when`) week, UNIX_TIMESTAMP(`when`) time, who FROM bloop ' + thisWeek,
  bleep: 'SELECT YEARWEEK(`when`) week, UNIX_TIMESTAMP(`when`) time, who FROM bleep ' + thisWeek,
}

// entries per person reducer
const perPerson = arr => arr.reduce((a,c)=>{
  if(!a?.[c.who]) a[c.who] = []
  a[c.who].push(c.time)
  return a
},{})

mysql.createConnection(sqlConfig)
  .then(async conn => { 
    for await (const d of Object.entries(q)){
      const r = await conn.query(d[1])
      const week = r[0][0].week
      const rr = d[0] == 'redeems' ? r[0] : perPerson(r[0])
      const fileName = `public/json/${d[0]}-${week}.json`
      const fileData = JSON.stringify(rr,null,2)
      writeFileSync(fileName, fileData)
    }
    conn.destroy()
  })
