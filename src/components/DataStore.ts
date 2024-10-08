interface elGame { 
  bot: { identifier: string; sendResponse: boolean; }
  cooldown: { user: number; global: number; category: number }
  quantity: { current: number; total: number }
  alert: { 
    graphics: { duration: number; type: string; src: string }
    audio: { src: string; volume: number }
    enabled: boolean
  }
  id: string,
  img: string,
  _id: string,
  subscriberOnly: boolean,
  sources: string[],
  userInput: string[],
  order: number,
  enabled: boolean,
  featured: boolean,
  name: string,
  description: string,
  type: string,
  cost: number,
  allowMessages: boolean,
  categoryName: string,
  thumbnail: string,
  public: boolean,
  channel: string,
  createdAt: string,
  updatedAt: string,
  created: string,
  updated: string,
  sub: boolean,
  qty: number
}

const getters = { 
  saveValue: (key:string,value:string) =>{ localStorage.setItem(key, value) },
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
  elementsLS: async (id='5dd84a6e7e7e3777cf657423', all=false) => { 
    const elementsAPI = `https://api.streamelements.com/kappa/v2/store/${id}/items?source=website`
    const JSONheader = { headers: { accept: 'application/json, text/plain, */*'}}
    return await fetch(elementsAPI, JSONheader)
      .then( r => r.json() )
      .then( r => r.filter((g:elGame)=> all ? true : g.enabled ) ) // only "on")
      .then( r => r.sort((a:elGame,b:elGame)=>a.cost<b.cost?-1:1) )
      .then( r => r.map((g:elGame)=>{ 
        const id = g._id
        const cost = g.cost
        const name = g.name
        const img = g.thumbnail
        const enabled = g.enabled
        const created = g.createdAt
        const updated = g.updatedAt
        const sub = g.subscriberOnly
        const qty = g.quantity.current
        const description = g.description
        const xbox = g.description.match(/(^XBOX|.xbox.com)/)?.[1] ? true : false
        const steamID = g.description.match(/steampowered.*app.(\d+)./)?.[1] // steamID for card   
        const steam = (g.description.includes('steampowered') || g.description.includes('STEAM ')) || !xbox
        return { id,cost,name,img,created,updated,sub,qty,description,xbox,steamID,steam, enabled }
      }))
  },
  elementsUser: async (u:string) => fetch( 
    `https://api.streamelements.com/kappa/v2/points/5dd84a6e7e7e3777cf657423/${u}` , 
    { headers: { accept: 'application/json, text/plain, */*'}} )
    .then( r => r.json() )
    .then( d => { dataStorage.seUsers[u] = d ; return d }),
  cache: async (c:string) => {
    const prodShim = import.meta.env.PROD ? '/nerdherd' : ''
    return dataStorage?.[c] ?? fetch(`${prodShim}/json/${c}.json?date=${Date.now()}`)
      .then(r=> r.json() )
      .then(r=> { dataStorage[c] = r ; return r })
  }    
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
