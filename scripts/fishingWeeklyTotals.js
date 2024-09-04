const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

const { readFileSync } = require('fs')

const goTime = async () => {
  const txt = readFileSync('./public/logs/fishing.csv','utf-8')
  const txtArr = txt.split('\n').filter(t=>t.length).map(t=>t=t.split(','))
  const [keys,data] = [ txtArr[0], txtArr.slice(1) ]
  const theD = data.map((d)=>{ 
    d = d.reduce((a,c,cx)=>{
      a[keys[cx]] = ['time','worth','total'].includes(keys[cx]) ? parseInt(c,10)
        : keys[cx] == 'weight' ? parseFloat(c) : c
      return a},{})
    d.year = dayjs.unix(d.time/1000).year()
    d.week = dayjs.unix(d.time/1000).week()
    return d
  })
  const weekTotals = theD.reduce((a,c)=>{
    const k = c.year + '-' + c.week
    if(!a?.[k]) a[k] = {}
    if(!a?.[k]?.[c.fisher]) a[k][c.fisher] = []
    a[k][c.fisher].push(c)
    return a
  },{})
}
