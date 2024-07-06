/**********************************************************************************/
/* Copyright (c) 2024 Matthew Thomas Beck                                         */
/*                                                                                */
/* All rights reserved. This code and its associated files may not be reproduced, */
/* modified, distributed, or otherwise used, in part or in whole, by any person   */
/* or entity without the express written permission of the copyright holder,      */
/* Matthew Thomas Beck.                                                           */
/**********************************************************************************/





/************************************************************/
/*************** IMPORT / CREATE DEPENDENCIES ***************/
/************************************************************/


/********** IMPORT DEPENDENCIES **********/

/***** import root variables for use in all files using global.js *****/

const rootStyles = getComputedStyle(document.documentElement); // nav height and colors


/********** CREATE DEPENDENCIES **********/

/***** create standard nav height *****/

// time interval of 250 milliseconds
const TIME_INTERVAL = parseFloat(rootStyles.getPropertyValue('--timeInterval'));
const NAV_HEIGHT = parseFloat(rootStyles.getPropertyValue('--navBarHeight')); // set nav height





/****************************************************/
/*************** global.js JAVASCRIPT ***************/
/****************************************************/


/********** COLOR CHANGING FAVICON **********/

/***** set variables *****/

const favicon = document.getElementById('favicon'); // get favicon element
const favicons = ['pastel1.png', 'pastel2.png', 'pastel3.png', 'pastel4.png']; // set favicon paths
let index = 0; // set index to 0

/***** change favicon color *****/

if (favicon) { // if favicon exists...

    function changeFavicon() { // function used to change favicon color

        favicon.href = 'https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/favicons/favicon-' + favicons[index]; // change favicon color with path

        index = (index + 1) % favicons.length; // increment index by 1 and mod by length of favicons

        setTimeout(changeFavicon, (TIME_INTERVAL * 12)); // change favicon color at same rate of index.js
    }

    changeFavicon(); // start changing favicon color
}


/********** LOADING SCREEN **********/

document.addEventListener("DOMContentLoaded", function() { // when page content loaded...

    /***** set variables *****/

    const loadingScreen = document.getElementById("loadingScreen"); // get loading screen

    /***** hide loading screen *****/

    if (loadingScreen) {

        /***** show loading screen *****/

        loadingScreen.style.display = "block"; // show loading screen by default

        document.body.style.overflow = "hidden"; // hide scroll bar

        /***** hide loading screen *****/

        window.addEventListener("load", function() { // when page fully loaded...

            loadingScreen.style.display = "none"; // hide loading screen

            document.body.style.overflow = "auto"; // show scroll bar
        });
    }
});


/********** NAV BAR NAME **********/

/***** recursively check if loading screen is present *****/

function checkLoadingScreen() { // function to check if loading screen is present

    /***** set variables *****/

    const loadingScreen = document.getElementById('loadingScreen'); // get loading screen

    /***** check if loading screen exists *****/

    if (loadingScreen) { // if loading screen exists...

        if (getComputedStyle(loadingScreen).display !== 'none') { // if loading screen is visible...

            setTimeout(checkLoadingScreen, 50); // check again in 50 milliseconds

        } else { // if loading screen is not visible...

            loadNavBarName(); // load name in nav bar
        }
    }
}

/***** load name in nav bar *****/

function loadNavBarName() { // function to set the name in the nav bar

    /***** set variables *****/

    const navBarOptionsButton = document.getElementById('navBarOptionsButton'); // options button
    const navBarNameBox = document.getElementById('navBarNameBox'); // name box
    const navBarName = document.getElementById('navBarName'); // name

    // get width of options button
    const optionsWidth = navBarOptionsButton.offsetWidth + parseInt(getComputedStyle(navBarOptionsButton).marginLeft);
    const nameWidth = navBarNameBox.offsetWidth; // get with of name box

    /***** find margins based on auto minus width of options button and name *****/

    // find margin-left based on auto minus width of options button plus half of name width 'calc(50% - 155.5px)';
    navBarNameBox.style.marginLeft = 'calc(50% - 155.5px)';

    // find margin-right based on auto minus half of name width 'calc(50% - 115.5px)';
    navBarNameBox.style.marginRight = 'calc(50% - 115.5px)';

    navBarName.classList.add('programmerTyping'); // show border once text has been positioned

    navBarName.classList.add('animateProgrammerTyping'); // show border once text has been positioned

    /***** replace text content *****/

    // once programmer typing animation ends...
    navBarName.addEventListener('animationend', function (event) {

        /***** set variables *****/

        const replacementText = document.createElement('p'); // set replacementText

        /***** replace text content *****/

        replacementText.textContent = "Matthew Thomas Beck"; // set replacement span content

        replacementText.style.fontSize = '140%'; // adjust font size for proper scaling

        replacementText.classList.add('fancyFont'); // apply fancy font to span content

        event.target.textContent = ""; // replace old span with replacement span

        event.target.style.width = '130px'; // set width to 130px

        event.target.style.borderRightWidth = '0px'; // remove old right border

        event.target.style.marginBottom = '10px'; // remove margin

        event.target.appendChild(replacementText); // commit changes to header
    });
}

/***** load nav bar depending on loading screen existence *****/

document.addEventListener("DOMContentLoaded", function() { // when page content loaded...

    /***** if loading screen exists *****/

    if (document.getElementById('loadingScreen')) { // if there is a loading screen...

        checkLoadingScreen(); // check if loading screen is present
    }

    /***** if loading screen does not exist *****/

    else { // if there is no loading screen...

        loadNavBarName() // load name in nav bar by itself
    }
});


/********** NAV BAR BUTTON ROTATION **********/

/***** rotate options button *****/

// create event listener for options button
document.getElementById('navBarOptionsButton').addEventListener('click', function() {

    /***** set variables *****/

    // options button
    const navBarOptionsButtonBox = document.getElementById('navBarOptionsButton');
    const navBarOptionsBox = document.getElementById('navBarOptionsBox'); // options box
    const navBarOptionsDimmer = document.getElementById('navBarOptionsDimmer'); // options dimmer

    /***** rotate options button *****/

    navBarOptionsButtonBox.classList.toggle('rotateNavBarOptionsButton'); // toggle rotation of options button

    navBarOptionsBox.classList.toggle('showNavBarOptionsBox'); // toggle visibility of options box

    navBarOptionsDimmer.classList.toggle('showNavBarOptionsDimmer'); // toggle visibility of options dimmer
});


/********** OPTIONS DIMMER **********/

/***** remove dimmer on click *****/

// create event listener for options dimmer
document.getElementById('navBarOptionsDimmer').addEventListener('click', function() {

    /***** set variables *****/

    // options button
    const navBarOptionsButtonBox = document.getElementById('navBarOptionsButton');
    const navBarOptionsBox = document.getElementById('navBarOptionsBox'); // options box
    const navBarOptionsDimmer = document.getElementById('navBarOptionsDimmer'); // options dimmer

    /***** remove dimmer *****/

    navBarOptionsButtonBox.classList.remove('rotateNavBarOptionsButton'); // remove rotation of options button

    navBarOptionsBox.classList.remove('showNavBarOptionsBox'); // remove visibility of options box

    navBarOptionsDimmer.classList.remove('showNavBarOptionsDimmer'); // remove visibility of options dimmer
});


/********** POP UP FUNCTION **********/

function popUp(element) { // used to inflate the project content

    /***** set variables *****/

    const elementHeaderOne = element.getElementsByTagName('h1')[0]; // select header and set to variable
    const elementHeaderTwo = element.getElementsByTagName('h2')[0]; // select header and set to variable
    const elementImage = element.getElementsByTagName('img')[0]; // select image and set to variable
    const elementText = element.getElementsByTagName('p')[0]; // select text and set to variable
    const elementAnchor = element.getElementsByTagName('a')[0]; // select anchor and set to variable

    /***** pop up the element *****/

    if (elementHeaderOne) { // if there exists element header...

        elementHeaderOne.style.transform = 'scale(1.05)'; // inflate the element header
    }

    if (elementHeaderTwo) { // if there exists element header...

        elementHeaderTwo.style.transform = 'scale(1.05)'; // inflate the element header
    }

    if (elementText) { // if there exists an element text...

        elementText.style.transform = 'scale(1.05)'; // inflate the element text
    }

    if (elementImage) { // if there exists an element image...

        elementImage.style.transform = 'scale(1.05)'; // inflate the element image

        if (elementImage.id === 'jumpUpArrow') { // if element is jumpUpBox...

            elementImage.style.opacity = '1'; // set opacity to 1
        }
    }

    if (elementAnchor) { // if there exists an element list item...

        elementAnchor.style.fontSize = '105%'; // inflate the element anchor
    }
}

/********** POP DOWN FUNCTION **********/

function popDown(element) { // used to deflate the project content

    /***** set variables *****/

    const elementHeaderOne = element.getElementsByTagName('h1')[0]; // select header and set to variable
    const elementHeaderTwo = element.getElementsByTagName('h2')[0]; // select header and set to variable
    const elementText = element.getElementsByTagName('p')[0]; // select text and set to variable
    const elementImage = element.getElementsByTagName('img')[0]; // select image and set to variable
    const elementAnchor = element.getElementsByTagName('a')[0]; // select anchor and set to variable

    /***** pop down the element *****/

    if (elementHeaderOne) { // if there exists element header...

        elementHeaderOne.style.transform = 'scale(1)'; // deflate the element header
    }

    // if there exists element header that isn't a table header...
    if (elementHeaderTwo && !elementHeaderTwo.classList.contains('tableItemsHeader')) {

        elementHeaderTwo.style.transform = 'scale(1)'; // deflate the element header
    }

    // if there exists an element text that isn't a table value...
    if (elementText && !elementText.classList.contains('tableItemsMetricValue')) {

        elementText.style.transform = 'scale(1)'; // deflate the element text
    }

    if (elementImage) { // if there exists an element image...

        elementImage.style.transform = 'scale(1)'; // deflate the element image

        if (elementImage.id === 'jumpUpArrow') { // if element is jumpUpBox...

            elementImage.style.opacity = '0.25'; // set opacity to 0.25
        }
    }

    if (elementAnchor) { // if there exists an element list item...

        elementAnchor.style.fontSize = '100%'; // deflate the element anchor
    }
}


/********** INDEX ADJUSTMENT **********/

/***** set variables *****/

// select all headers in index box
const sectionHeaderLinks = document.querySelectorAll('#indexBox a');

/***** adjust the index to jump minus nav height *****/

sectionHeaderLinks.forEach(function(link) { // loop through each link

    link.addEventListener('click', function(event) { // when link clicked...

        /***** set variables *****/

        let targetId = this.getAttribute('href').substring(1); // get target id
        let targetElement = document.getElementById(targetId); // get target element

        /***** scroll to target position *****/

        if (targetElement) { // if target element exists...

            let targetPosition = targetElement.offsetTop - NAV_HEIGHT; // get target position

            window.scrollTo({ // scroll to target position

                top: targetPosition, // set top to target position

                behavior: 'smooth' // set behavior to smooth to make it pretty
            });

            event.preventDefault(); // prevent default behavior in order to allow for nav bar pixel offset
        }
    });
});


/********** JUMP UP FUNCTION **********/

window.onscroll = function() {scrollFunction()}; // create event listener for scrolling

function scrollFunction() { // function used to jump up to the top

    /***** set variables *****/

    // activation point for jump up
    const jumpBackTrigger = document.getElementsByClassName("jumpBackTrigger")[0].offsetTop;
    let jumpUpBox = document.getElementById("jumpUpBox"); // set jump up div

    /***** jump up to the top *****/

    if (window.pageYOffset > jumpBackTrigger) { // if user has scrolled past trigger point...

        jumpUpBox.style.display = "block"; // show the jump back div
    }

    else { // if user has not scrolled past trigger point...

        jumpUpBox.style.display = "none"; // hide the jump back div
    }
}