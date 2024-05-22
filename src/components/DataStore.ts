
const getters = { 
  saveValue: (key:string,value:any) =>{ localStorage.setItem(key, value) },
  getValue: async (key:string) => { return localStorage.getItem(key) },
  getJSON: async (jsonFile:string) => 
    fetch(`/${jsonFile}.json`)
      .then(r=>r.json())
      .then(r=>{ 
        dataStorage[jsonFile] = r
        return r 
      }),
  steamSearch: (t:string) => `https://store.steampowered.com/search/?term=${encodeURIComponent(t)}`,
  steamImg: (id:number) => `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`,    
  steamLinkId: (id:number) => `https://store.steampowered.com/app/${id}/`,
  elementsLS: async (id='5dd84a6e7e7e3777cf657423') => { 
    const elementsAPI = `https://api.streamelements.com/kappa/v2/store/${id}/items?source=website`
    const JSONheader = { headers: { accept: 'application/json, text/plain, */*'}}
    const games = await fetch(elementsAPI, JSONheader).then( r => r.json() )
    dataStorage.games = games
      .filter((g:elGame)=>g.enabled) // only "on"
      .sort((a:elGame,b:elGame)=>a.cost<b.cost?-1:1) // dateMod:Desc
      .map((g:elGame)=>{ 
        const r = { // slim Resp
          id: g._id,
          cost: g.cost,
          name: g.name,
          img: g.thumbnail,
          created: g.createdAt,
          updated: g.updatedAt,
          sub: g.subscriberOnly,
          qty: g.quantity.current,
          description: g.description,
          xbox: g.description.match(/(^XBOX|.xbox.com)/)?.[1] ? true : false,
          steam: g.description.includes('steampowered') || g.description.includes('STEAM '),
          steamID: g.description.match(/steampowered.*app.(\d+)./)?.[1], // steamID for card    
        }
        // if !xbox & !steam... prolly steam
        if(!r.steam && !r.xbox) r.steam = true
        return r
      })
    return games
  },
  elementsUser: async (u:string) => fetch( 
    `https://api.streamelements.com/kappa/v2/points/5dd84a6e7e7e3777cf657423/${u}` , 
    { headers: { accept: 'application/json, text/plain, */*'}} )
    .then( r => r.json() )
    .then( d => { dataStorage.seUsers[u] = d ; return d }),
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataStorage: Record<string,any> = reactive({
  seUsers: [],
  /* getters will fill the rest in with stuff from APIs */
})

const methods = { 
  Cap1stLetter: (string:string) => string.charAt(0).toUpperCase() + string.slice(1), 
  // ^props https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
}

export { dataStorage, getters, methods }
