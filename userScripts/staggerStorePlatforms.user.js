// ==UserScript==
// @name         stagger-store-platform-drowpdown
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  add a filter to staggers SE store for easy platform filtering
// @author       zosky
// @match        https://streamelements.com/staggerrilla/store
// @icon         https://static-cdn.jtvnw.net/jtv_user_pictures/2220e426-e259-4e97-8a18-0229f6e40463-profile_image-300x300.png
// @homepageURL  https://zosky.github.io/nerdherd/
// @downloadURL  https://zosky.github.io/nerdherd//userScripts/staggerStorePlatforms.user.js
// @updateURL    https://zosky.github.io/nerdherd//userScripts/staggerStorePlatforms.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

const goTime = () => {
    // add store class to each item
    let inventory = document.querySelectorAll(`.stream-store-list-item`)
    for (const i of inventory) { 
        const txt = i.querySelector('.clamp-description-text').textContent
        const type =  txt.match(/^xbox/i) ? 'xbox' 
            : txt.match(/^steam/i) ? 'steam' 
                : 'other'
        i.classList.add(type, 'all')
    }  
    // Create a new dp for platform
    const newDiv = document.createElement('md-input-container')
    const label = document.createElement('label')
    const select = document.createElement('select')
    // add options
    for (const i of ['all','steam','xbox']) {
        const o = document.createElement('option')
        const c = document.querySelectorAll(`.stream-store-list-item.${i}`).length
        o.textContent = `${i} [${c}]`
        o.value = i
        select.appendChild(o)
    }
    // prepare the new div
    label.textContent = 'platform'
    newDiv.appendChild(label)
    newDiv.appendChild(select)
    newDiv.id = 'platform-dp-container'
    newDiv.classList.add('filter-items-input', 'md-dark-theme', 'md-input-has-value')    
    // onChange click handler function > showHide games
    select.classList.add('md-select-value')
    select.addEventListener('change', function() {
        const platformValue = select.value;
        if (platformValue == 'all') { 
            const hiddenGames = document.querySelectorAll('.stream-store-list-item.hide')
            for (const g of hiddenGames) { g.classList.remove('hide') }            
        } else { 
            const toHideGames = document.querySelectorAll(`.stream-store-list-item`)
            for (const g of toHideGames) { 
                if (g.classList.contains(platformValue)) g.classList.remove('hide')
                else g.classList.add('hide')
            }
        }
    })
    // insert
    document.querySelector('.page-contents > .layout-row').appendChild(newDiv)
    // add some custom CSS
    const styleElement = document.createElement('style')
    styleElement.innerHTML = `
        .xbox { background-color: #0b4d0b7a !important; }
        .xbox button { background: green!important; }
        .xbox .clamp-description-text:after { background: none !important; }
        select option{ background-color: black!important; }
        select.md-select-value { color: white; border-top: 0; border-left: 0; border-right: 0; border-bottom: 1px solid #444; }
    `
    document.head.insertAdjacentElement('beforeend', styleElement);  
}

(function() {
    'use strict';
    // test for store items to load - add platform DP when ready
    let timer = setInterval(() => {  
        if(document.querySelector('.stream-store-list-item')) { 
            console.log('adding platform DP')
            clearInterval(timer); 
            goTime() 
        } else { 
            console.log('...waiting for store items to load')
        }
    }, 3333)
})()
