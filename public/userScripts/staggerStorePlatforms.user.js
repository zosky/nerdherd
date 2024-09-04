// ==UserScript==
// @name         stagger-store-platform-drowpdown
// @namespace    Violentmonkey Scripts
// @version      1.0
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
    // make an array of store types
    const imgTypes = [
        {store: 'all', imgUrl: null },
        {store: 'xbox',  imgUrl: 'https://cdn.streamelements.com/uploads/da3b65db-2194-45f6-bbf3-cc4687962506.jpg' },
        {store: 'steam', imgUrl: 'https://cdn.streamelements.com/uploads/d450b754-c495-4ffe-a5c4-bdcb24854b42.jpg' }
    ]
    // add store class to each item
    for (const i of imgTypes) { 
        let x = document.querySelectorAll(`.stream-store-list-item:has(img[src="${i.imgUrl}"])`)
        for (const g of x){ g.classList.add(i.store) }
    }  
    // Create a new dp for platform
    const newDiv = document.createElement('md-input-container')
    const label = document.createElement('label')
    const select = document.createElement('select')
    // add options
    for (const i of imgTypes){
        const o = document.createElement('option')
        o.value = i.store; o.textContent = i.store
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
