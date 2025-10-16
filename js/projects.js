/**********************************************************************************/
/* Copyright (c) 2025 Matthew Thomas Beck                                         */
/*                                                                                */
/* Licensed under the Creative Commons Attribution-NonCommercial 4.0              */
/* International (CC BY-NC 4.0). Personal and educational use is permitted.       */
/* Commercial use by companies or for-profit entities is prohibited.              */
/**********************************************************************************/





/************************************************************/
/*************** IMPORT / CREATE DEPENDENCIES ***************/
/************************************************************/





/************************************************************/
/*************** edge_ai_module.js JAVASCRIPT ***************/
/************************************************************/


/********** FADE IN ANIMATION **********/

/***** set variables *****/

// find conclusion header
const conclusionHeader = document.getElementById('projectConclusionHeaderBox');

/***** animate conclusion *****/

// initialize intersection observer for conclusion header
const conclusionHeaderObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => { // loop through each entry

        if (entry.isIntersecting) { // if conclusion header is intersecting...

            /***** set variables *****/

            // get content text
            const conclusionTags = document.getElementById('projectConclusionBox').getElementsByTagName('p');

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

try { // attempt to do the conclusion programmer typing

    // find final tag
    const finalTag = document.getElementById('projectConclusionBox').getElementsByTagName('p')[4];

    // get content signature box text
    const conclusionSignatureBox = document.getElementById('projectConclusionSignature')

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

} catch { // if there is no conclusion programmer typing...

    console.log("No conclusion present, skipping programmer typing...");
}


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

    } else { // if user has not scrolled past trigger point...
        jumpUpBox.style.display = "none"; // hide the jump back div
    }
}


/********** GITHUB BUTTON **********/

const githubBox = document.getElementById('githubBox'); // find download resume box

githubBox.addEventListener('click', function() {

    /***** set variables *****/

    const link = document.createElement('a');

    /***** get correct URL based off of page title *****/

    switch (true) {

        case document.title.includes('Athena'):
            console.log("Athena github redirect...");
            link.href = 'https://github.com/matthewthomasbeck/Robot_Dog_Athena';
            break;

        case document.title.includes('Bounded Rationality'):
            console.log("Bounded Rationality github redirect...");
            link.href = 'https://www.github.com/matthewthomasbeck/Databases_Group_3';
            break;

        case document.title.includes('Edge AI Module'):
            console.log("Edge AI Module github redirect...");
            link.href = 'https://www.github.com/matthewthomasbeck/Edge_AI_Module';
            break;

        case document.title.includes('Machine Learning Portfolio'):
            console.log("Machine Learning Portfolio github redirect...");
            link.href = 'https://www.github.com/matthewthomasbeck/Machine_Learning_Portfolio';
            break;

        case document.title.includes('Receipt Analyzer'):
            console.log("Receipt Analyzer github redirect...");
            link.href = 'https://www.github.com/matthewthomasbeck/Budgeting_Software';
            break;

        default:
            console.log("Default github redirect...");
            link.href = 'https://www.github.com/matthewthomasbeck/';
    }

    /***** send user to correct github repo *****/

    link.target = '_blank'; // Open in new tab as fallback
    document.body.appendChild(link); // Add to DOM temporarily
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
});
