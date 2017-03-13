var app = function() {
    "use strict";
    // on DOM Ready
    document.addEventListener("DOMContentLoaded", (event) => {
        const cinemaSort = require('./cinemaSort');
        const config = require('./config');
        const request = require('superagent');
        var $ = require('jquery')
        require('slick-carousel');

        const feedJsonLink = 'https://content.jwplatform.com/feeds/f49AJ8N4.json';
        const jwKey = config.jwLicense;

        function checkDataType(data, dataType) {
            return typeof data === dataType;
        };

        function setClasses(element, classArray) {
            for (let x = 0; x < classArray.length; x++) {
                element.className += classArray[x] + ' ';
            }
            return element.className;
        }

        function insertBefore(el, referenceNode) {
            referenceNode.parentNode.insertBefore(el, referenceNode);
        }

        const createElement = function(element, propertyObj, idName = '', classname = '') {
            const el = document.createElement(element);

            const noIdName = idName === '',
                noClassName = classname === '',
                onlyIdName = !noIdName && noClassName,
                onlyClassName = noIdName && !noClassName,
                both = !noIdName && !noClassName;

            if (both) {
                el.id = idName;
                el.className = classname;
            } else if (onlyIdName) {
                el.id = idName;
            } else if (onlyClassName) {
                el.className = classname;
            }

            // set element properties
            if (checkDataType(propertyObj, 'object')) {
                for (let key in propertyObj) {
                    el[key] = propertyObj[key];
                }
            }
            return el;
        };

        // embedPlayer
        const embedPlayer = function() {
            const head = document.querySelector('head');
            const jwPlayerScriptSrc = { src: 'js/jwplayer.js' };
            const jwPlayerScriptTag = createElement('script', jwPlayerScriptSrc, '', '');

            const jwPlayerKey = { innerText: `jwplayer.key= ${jwKey}` };
            const jwPlayerKeyTagLink = createElement('script', jwPlayerKey, '', '');
        }();

        // function to set up one instance of jwplayer
        const playerSetup = function(feed, div, width, height) {
            console.log(feed);
            let video;
            if (feed.sources.length != 1) {
                video = feed;
                jwplayer(div).setup({
                    file: video.sources[2].file,
                    image: video.image,
                    title: video.title,
                    description: video.description,
                    mediaid: video.mediaid,
                    height: height,
                    width: width,
                    autostart: false,
                });
            }
        };

        const setupSliders = function(element) {
            $(element).slick({
                slidesPerRow: 21,
                slidesToShow: 3,
                speed: 500
            });
        };

        const setupVideoDivs = function(arrayObj, targetDiv, numOfRow, width, height) {
            const containerDiv = document.querySelector(targetDiv);
            for (let x = 0; x < numOfRow; x++) {
                let rowDiv = document.createElement('div');
                rowDiv.id = `${targetDiv}-row-${x}`;
                rowDiv.className = 'row';
                containerDiv.appendChild(rowDiv);

                for (let y = 0; y < arrayObj.length; y++) {
                    let videoFeed = arrayObj[y];
                    const playerContainerDiv = document.createElement('div');
                    playerContainerDiv.className = 'player-container';

                    const playerTargetDiv = document.createElement('div');
                    playerTargetDiv.id = `player-${targetDiv}-${y}-row-${x}`;

                    playerContainerDiv.appendChild(playerTargetDiv);
                    rowDiv.appendChild(playerContainerDiv);
                    playerSetup(videoFeed, playerTargetDiv.id, width, height);
                }
                setupSliders(rowDiv);
            }
        };

        const insertTitles = function(titlesArray, elForTitle, parentDivArray) {
            for (let x = 0; x < parentDivArray.length; x++) {
                let titleHeading = document.createElement(elForTitle);
                titleHeading.innerText = titlesArray[x];
                titleHeading.className = 'titleHeading';
                insertBefore(titleHeading, parentDivArray[x]);
            }
        }

        const reqCallback = function(error, response) {
            const playlist = JSON.parse(response.text).playlist;
            const rowShowcase = 'div#row-showcase';
            const jumbotron = 'div#jumbotron-center';
            const playerWidth = 320;
            const playerHeight = 180;
            // set up rows
            setupVideoDivs(playlist, rowShowcase, 3, playerWidth, playerHeight);

            // name rows
            const titles = ['Documentaries', 'Live Events', 'Short Films'];
            const rowDivArray = document.querySelectorAll('.row');
            insertTitles(titles, 'h4', rowDivArray);
        };

        // call
        request.get(feedJsonLink).end(reqCallback);
    });
}();
