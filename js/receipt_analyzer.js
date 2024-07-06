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





/**************************************************************/
/*************** receipt_analyzer.js JAVASCRIPT ***************/
/**************************************************************/


/********** FADE IN ANIMATION **********/

/***** set variables *****/

// find conclusion header
const conclusionHeader = document.getElementById('receiptAnalyzerConclusionHeaderBox');

/***** animate conclusion *****/

// initialize intersection observer for conclusion header
const conclusionHeaderObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => { // loop through each entry

        if (entry.isIntersecting) { // if conclusion header is intersecting...

            /***** set variables *****/

            // get content text
            const conclusionTags = document.getElementById('receiptAnalyzerConclusionBox').getElementsByTagName('p');

            /***** animate conclusion content *****/

            for (let i = 0; i < (conclusionTags.length - 1); i++) { // animate content text

                setTimeout(function(pTag) { // set timeout for cascading effect

                    pTag.classList.add('fadeIn'); // add fade in effect

                }, i * TIME_INTERVAL, conclusionTags[i]); // set timeout for cascading effect
            }

            conclusionHeaderObserver.unobserve(entry.target); // remove observer once completed
        }
    });
}, { threshold: 1 }); // element must be 100% visible to trigger observer

/***** create conclusion header observer *****/

if (conclusionHeader) { // if conclusion header exists...

    conclusionHeaderObserver.observe(conclusionHeader); // observe conclusion header
}


/********** PROGRAMMER TYPING SIGNATURE **********/

/***** set variables *****/

// find final tag
const finalTag = document.getElementById('receiptAnalyzerConclusionBox').getElementsByTagName('p')[4];

// get content signature box text
const conclusionSignatureBox = document.getElementById('receiptAnalyzerConclusionSignature')

/***** observe last fade in *****/

// add event listener for fade in
finalTag.addEventListener('animationend', function(event) {

    setTimeout(function(signatureBox) { // set timeout for programmer typing effect

        signatureBox.style.color = 'white'; // make signature box visible

        signatureBox.classList.add('programmerTyping'); // add programmer typing animation to signature box

        signatureBox.classList.add('animateProgrammerTyping'); // add programmer typing animation to signature box

        signatureBox.style.fontSize = '100%'; // adjust font size

    }, TIME_INTERVAL, conclusionSignatureBox); // set timeout for programmer typing effect
});

/***** observe programmer typing end *****/

// add event listener for programmer typing
conclusionSignatureBox.addEventListener('animationend', function(event) {

    /***** set variables *****/

    let replacementText = document.createElement('p'); // create replacement element

    /***** replace signature content *****/

    replacementText.textContent = "- Matthew Thomas Beck"; // set replacement span content

    replacementText.style.margin = '0px'; // adjust margin

    replacementText.style.textAlign = 'center'; // adjust text align

    replacementText.style.fontSize = '130%'; // adjust font size for proper scaling

    replacementText.classList.add('fancyFont'); // apply fancy font to span content

    event.target.textContent = ""; // replace old span with replacement span

    event.target.style.borderRightWidth = '0px'; // remove old right border

    event.target.appendChild(replacementText); // commit changes to header
});