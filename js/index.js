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





/***************************************************/
/*************** index.js JAVASCRIPT ***************/
/***************************************************/


/********** PORTRAIT SLIDESHOW **********/

/***** set variables *****/

const aboutMeBodyBox = document.getElementById('aboutMeBodyBox'); // find about me body box
const firstTag = aboutMeBodyBox.getElementsByTagName('p')[0]; // find first tag

/***** observe last fade in *****/

// add event listener for fade in
firstTag.addEventListener('animationend', function(event) {

    /***** set variables *****/

    const slides = document.querySelectorAll('.slide'); // select slide class elements
    const favicon = document.getElementById('faviconIndex');
    let currentSlide = 0; // pre-initialize current slide as 0

    /***** create looping *****/

    setTimeout(function() {}, (TIME_INTERVAL * 20)); // wait for about me body box to load

    showSlide(); // run slideshow initially

    setInterval(function () { // function to move slides every 3 seconds

        // update current slide by incrementing it and taking modulus of number of slides
        currentSlide = (currentSlide + 1) % slides.length;

        /***** set variables *****/

        // find about me body box and set to variable
        const aboutMeBodyBoxFirstTag = document.getElementById('aboutMeBodyBox').getElementsByTagName('p')[0];

        /***** change name color based on slide *****/

        // if about me content has loaded...
        if (aboutMeBodyBoxFirstTag.classList.contains('fadeIn') && aboutMeBodyBoxFirstTag.style.opacity !== '1') {

            if (currentSlide === 0) { // if portrait 1...

                // update name color
                document.getElementsByClassName('fadeInName')[0].style.color = rootStyles.getPropertyValue('--pastel-1');

                favicon.href = 'https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/favicons/favicon-pastel1.png'; // update favicon
            }

            else if (currentSlide === 1) { // if portrait 2...

                // update name color
                document.getElementsByClassName('fadeInName')[0].style.color = rootStyles.getPropertyValue('--pastel-2');

                favicon.href = 'https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/favicons/favicon-pastel2.png'; // update favicon
            }

            else if (currentSlide === 2) { // if portrait 3...

                // update name color
                document.getElementsByClassName('fadeInName')[0].style.color = rootStyles.getPropertyValue('--pastel-3');

                favicon.href = 'https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/favicons/favicon-pastel3.png'; // update favicon
            }

            else if (currentSlide === 3) { // if portrait 4...

                // update name color
                document.getElementsByClassName('fadeInName')[0].style.color = rootStyles.getPropertyValue('--pastel-4');

                favicon.href = 'https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/favicons/favicon-pastel4.png'; // update favicon
            }
        }

        // call showSlide to show new current slide
        showSlide();

    }, (TIME_INTERVAL * 12)); // run every 3 seconds

    /***** hide/show slides *****/

    function showSlide() { // function to run slide show when called

        for (let i = 0; i < slides.length; i++) { // loop through all slides to hide them

            slides[i].style.display = 'none'; // hide current slide
        }

        slides[currentSlide].style.display = 'block'; // display current slide
    }
});


/********** ANIMATION TRIGGER **********/

/***** set variables *****/

// find all headers that use programmer typing and set to variable
const programmingHeadersAnimate = document.getElementsByClassName('programmerTyping');
const aboutMeName = document.getElementById('name'); // find name
const aaedName = document.getElementById('aaedMusaName'); // find Aaed's name
const aaedNameLarge = document.getElementById('aaedMusaNameLarge'); // find Aaed's name large

/***** animate programmer typing headers *****/

// initialize intersection observer
const programmerTypingObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => { // go through each header with programmer typing

        if (entry.isIntersecting) { // if header is in view...

            entry.target.classList.add('animateProgrammerTyping'); // trigger programmer typing animation

            /***** trigger fade in animation *****/

            const currentID = entry.target.id; // find current id and store as variable

            if (currentID === 'aboutMeHeader') { // if current id about me header...

                // select all body tags
                const aboutMeBodyBoxTags = document.getElementById('aboutMeBodyBox').getElementsByTagName('p');

                aboutMeName.style.color = rootStyles.getPropertyValue('--pastel-1'); // change name color

                aboutMeName.classList.add('fadeInName'); // additional content fade in

                for (let i = 0; i < aboutMeBodyBoxTags.length; i++) { // loop through about me body box content

                    setTimeout(function(pTag) { // add animations to each p tag with delay

                        pTag.classList.add('fadeIn'); // add animations to p tag

                    }, i * TIME_INTERVAL, aboutMeBodyBoxTags[i]); // add delay to each p tag
                }
            }

            else if (currentID === 'skillSetHeader') { // if current id skill set header...

                /***** set variables *****/

                // find skills elements class and set to variable
                const skills = document.getElementsByClassName('skills');

                /***** trigger fade in animation *****/

                for (let i = 0; i < skills.length; i++) { // loop through all skills to apply fade in update

                    setTimeout(function(skill) { // add animations to each skill with delay

                        skill.classList.add('fadeIn'); // add animations to skill

                    }, i * TIME_INTERVAL, skills[i]); // add delay to each p tag
                }
            }

            else if (currentID === 'projectsInfoHeader') { // if current id project info header...

                /***** set variables *****/

                // find projects elements class and set to variable
                const projects = document.getElementsByClassName('projects');
                const arrow = document.getElementById('swipeArrow'); // find swipe arrow

                // find swipe arrow text
                const arrowText = document.getElementById('swipeArrowText');

                /***** trigger fade in animation *****/

                for (let i = 0; i < projects.length; i++) { // loop through projects to apply fade in update

                    projects[i].classList.add('fadeIn', 'popUp'); // add animations to each project

                    projects[i].getElementsByTagName('h1')[0].classList.add('popUp'); // pop up to title

                    projects[i].getElementsByTagName('img')[0].classList.add('popUp'); // add pop up to img
                }

                arrow.classList.add('fadeIn'); // add animations to arrow

                arrowText.classList.add('fadeIn'); // add animations to arrow text

                // additional content fade in
                document.getElementById('projectsInfoName').classList.add('fadeIn');

                setTimeout(function() { // add animations to body with delay

                    // trigger fade in for additional content
                    document.getElementById('projectsInfoBody').classList.add('fadeIn');

                    // trigger fade in for additional content
                    aaedName.classList.add('fadeInAaedName');

                    // trigger fade in for additional content
                    aaedNameLarge.classList.add('fadeInAaedName');

                }, TIME_INTERVAL); // add delay to body
            }

            else if (currentID === 'contactMeHeader') { // if current id contact me header...

                /***** set variables *****/

                // find contacts elements class and set to variable
                const contacts = document.getElementsByClassName('contacts');

                /***** trigger fade in animation *****/

                for (let i = 0; i < contacts.length; i++) { // loop through contacts to apply fade in update

                    setTimeout(function(contact) { // add animations to each contact with a delay

                        contact.classList.add('fadeIn', 'popUp'); // add animations to contact

                    }, i * TIME_INTERVAL, contacts[i]); // add delay to each contact

                    contacts[i].getElementsByTagName('h2')[0].classList.add('popUp'); // pop up to title

                    contacts[i].getElementsByTagName('img')[0].classList.add('popUp'); // pop up to img
                }
            }

            programmerTypingObserver.unobserve(entry.target); // remove observer once completed
        }
    });
}, { threshold: 1 }); // element must be 100% in view to trigger animation

/***** create header observers *****/

for (let i = 0; i < programmingHeadersAnimate.length; i++) { // loop through programmer typing headers

    programmerTypingObserver.observe(programmingHeadersAnimate[i]); // observe each header
}


/********** PROGRAMMER TEXT **********/

/***** set variables *****/

// find all headers that use the programmer typing animation
const programmingHeadersReplace = document.getElementsByClassName('programmerTyping');

/***** append programmer typing text *****/

for (let i = 0; i < programmingHeadersReplace.length; i++) { // loop through headers using programmer typing

    // once programmer typing animation terminates...
    programmingHeadersReplace[i].addEventListener('animationend', function(event) {

        /***** set variables *****/

        let replacementText = document.createElement('h3'); // create replacement element
        let currentID = event.target.id; // find current id

        /***** replace text content *****/

        if (currentID === 'navBarName') { // if current id nav bar name...

            replacementText = document.createElement('p'); // set replacementText to p tag

            replacementText.textContent = "Matthew Thomas Beck"; // set replacement span content

            replacementText.style.fontSize = '140%'; // adjust font size for proper scaling
        }

        if (currentID === 'aboutMeHeader') { // if current id about me header...

            replacementText.textContent = "Hello There"; // set replacement span content
        }

        else if (currentID === 'skillSetHeader') { // if current id my skills header...

            replacementText.textContent = "So, What Am I Good At?"; // set replacement span content
        }

        else if (currentID === 'projectsInfoHeader') { // if current id projects header...

            replacementText.textContent = "My Projects:"; // set replacement span content
        }

        else if (currentID === 'contactMeHeader') { // if current id contact me header...

            replacementText.textContent = "Contact Me!"; // set replacement span content
        }

        replacementText.classList.add('fancyFont'); // apply fancy font to span content

        event.target.textContent= ""; // replace old span with replacement span

        event.target.style.borderRightWidth = '0px'; // remove old right border

        event.target.style.margin = 'auto'; // change margin

        event.target.appendChild(replacementText); // commit changes to header
    });
}


/********** PROJECTS WHEEL **********/

/***** set variables *****/

const projectsWheel = document.getElementById('projectsWheel'); // projects scroll
const projectsBackground = document.getElementById('projectsBackground'); // projects background
const projectsInfoName = document.getElementById('projectsInfoName'); // name of project
const projectsInfoBody = document.getElementById('projectsInfoBody'); // content of project

/***** create scroll wheel *****/

projectsWheel.addEventListener('scroll', function() { // when scroll takes place in projectsWheel...

    /***** set variables *****/

    let scrollPosition = projectsWheel.scrollLeft; // update div based on scroll position
    let itemWidth = document.querySelector('.projects').offsetWidth * 2; // width of a project item
    const aaedName = document.getElementById('aaedMusaName'); // get Aaed's name
    const aaedNameLarge = document.getElementById('aaedMusaNameLarge'); // get Aaed's name large
    const swipeArrowBox = document.getElementById('swipeArrowBox'); // get swipe arrow box

    /***** calculate scroll position based on screen width *****/

    if (window.innerWidth <= 1024) { // if screen is small size...

        scrollPosition *= 1.3; // add 30% to scroll position as scroll wheel is 30% smaller
    }

    let currentItem = Math.round(scrollPosition / itemWidth); // index of visible item based on position

    /***** replace project info *****/

    if (currentItem === 0) { // if current item machine learning portfolio...

        projectsInfoName.textContent = "Machine Learning Portfolio"; // set title

        // set content from .txt
        projectsInfoBody.textContent = 'Using a Raspberry Pi 4B, a Coral TPU, TensorFlow, an Nginx web server, and a ' +
            'whole host of data collecting and modeling scripts, I created a portfolio that finds the most volatile ' +
            'financial instruments, predicts their prices, and suggests when you should buy / sell (OBLIGATORY: THIS ' +
            'IS NOT FINANCIAL ADVICE)';

        aaedName.textContent = ""; // unset Aaed's name

        aaedNameLarge.textContent = ""; // unset Aaed's name large
    }

    else if (currentItem === 1) { // if current item athena...

        projectsInfoName.textContent = "Project Athena"; // set title

        // set content from .txt
        projectsInfoBody.innerHTML = "Athena is an upcoming robotic dog project in which I will create a 'brain' " +
            "using a Raspberry Pi 4B and an Intel Movidius Neural Compute Stick 2 running OpenVino that will allow a " +
            "robotic dog to somewhat think for itself using the ARES platform by the talented:";

        aaedName.textContent = "Aaed Musa!"; // set Aaed's name

        aaedNameLarge.textContent = "Aaed Musa!"; // set Aaed's name large

        swipeArrowBox.style.display = 'none'; // hide swipe arrow box
    }

    else if (currentItem === 2) { // if current item receipt analyzer...

        projectsInfoName.textContent = "Receipt Analyzer"; // set title

        // set content from .txt
        projectsInfoBody.textContent = "I built a Python app that uses Custom TKinter, Matplotlib, Psycopg2, and a " +
            "host of other technologies including its own SQL database in order to better track my spending during " +
            "the early days of university";

        aaedName.textContent = ""; // unset Aaed's name

        aaedNameLarge.textContent = ""; // unset Aaed's name large
    }

    else if (currentItem === 3) { // if current item personal website...

        projectsInfoName.textContent = "Personal Website"; // set title

        // set content from .txt
        projectsInfoBody.textContent = "This very page you're looking at! Fun fact, I made this website in less than " +
            "a month as a full-time student and with limited experience in HTML, CSS, or JavaScript; what really " +
            "helped me move forward quickly was forcefully blocking all distractions, prior knowledge in Java, and " +
            "black coffee";

        aaedName.textContent = ""; // unset Aaed's name

        aaedNameLarge.textContent = ""; // unset Aaed's name large
    }

    else if (currentItem === 4) { // if current item video editor...

        projectsInfoName.textContent = "Video Editor"; // set title

        // set content from .txt
        projectsInfoBody.textContent = "As Adobe Premiere Pro did not have any kind of API I could use to edit my " +
            "videos automatically (at the time of writing), I created a script that primarily uses PyAutoGUI to " +
            "control my screen and edit videos for me";

        aaedName.textContent = ""; // unset Aaed's name

        aaedNameLarge.textContent = ""; // unset Aaed's name large
    }

    projectsInfoBody.style.textAlign = 'left'; // set text alignment to left
});