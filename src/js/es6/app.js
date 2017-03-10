var app = function () {
  "use strict";
  // on DOM Ready
  document.addEventListener("DOMContentLoaded", (event) => {
    const cinemaSort = require('./cinemaSort');
    const config = require('./config');
    const request = require('superagent');
    // const $ = require('jQuery');

    const feedJsonLink = 'https://content.jwplatform.com/feeds/f49AJ8N4.json';
    const jwKey = config.jwLicense;

    function checkDataType(data, dataType){
        return typeof data === dataType;
    };

    function setClasses(element, classArray){
      for(let x = 0; x < classArray.length; x++){
        element.className += classArray[x] + ' ';
      }
      return element.className;
    }

    const createElement = function(element, propertyObj, idName = '', classname = ''){
      const el = document.createElement(element);

      const noIdName = idName === '',
            noClassName = classname === '',
            onlyIdName = !noIdName && noClassName,
            onlyClassName = noIdName && !noClassName,
            both = !noIdName && !noClassName;

      if (both){
        el.id = idName;
        el.className = classname;
      } else if(onlyIdName){
        el.id = idName;
      } else if(onlyClassName) {
        el.className = classname;
      }

      // set element properties
      if (checkDataType(propertyObj, 'object')){
        for(let key in propertyObj){
          el[key] = propertyObj[key];
        }
      }
      return el;
    };

    // embedPlayer
    const embedPlayer = function(){
      const head = document.querySelector('head');
      const jwPlayerScriptSrc = {src: 'js/jwplayer.js'};
      const jwPlayerScriptTag = createElement('script', jwPlayerScriptSrc, '', '');

      const jwPlayerKey = {innerText: `jwplayer.key= ${jwKey}`};
      const jwPlayerKeyTagLink = createElement('script', jwPlayerKey, '', '');
    }();

    // function to set up one instance of jwplayer
    const playerSetup = function(feed, div){
      const livestreaming = feed.sources[0],
            mp4Small = feed.sources[1],
            mp4Medium = feed.sources[2],
            mp4Large = feed.sources[3],
            mp4ExtraLarge = feed.sources[4],
            audio = feed.sources[5];

      jwplayer(div).setup({
        file: feed.sources[1].file,
        image: feed.image,
        title: feed.title,
        description: feed.description,
        mediaid: feed.mediaid,
        height: feed.sources[1].height,
        width: feed.sources[1].width,
        autostart: false,
      });
    };

    const eachVideo = function(arrayObj, numOfRow){
      const containerDiv = document.querySelector('div#row-showcase');
      const videoSplit = arrayObj.length / numOfRow;

      for(let x = 0; x < numOfRow; x++){
        // let rowDiv = createElement('div', '', `row-${x}`, 'row');
        let rowDiv = document.createElement('div');
        rowDiv.id = `row-${x}`;
        rowDiv.className = 'row';
        containerDiv.appendChild(rowDiv);

        for(let y = 0; y < arrayObj.length; y++){
          let videoFeed = arrayObj[y];
          const playerContainerDiv = document.createElement('div');
          playerContainerDiv.className = 'player-container';
          
          const playerTargetDiv = document.createElement('div');
          playerTargetDiv.id = `player-${y}-row-${x}`
          
          playerContainerDiv.appendChild(playerTargetDiv);
          rowDiv.appendChild(playerContainerDiv);

          playerSetup(videoFeed, playerTargetDiv.id);
        }
      }

    };

    const reqCallback = function(error, response){
      const playlist = JSON.parse(response.text).playlist;
      eachVideo(playlist, 3);
    };

    // call
    request.get(feedJsonLink).end(reqCallback);
  });
}();
