/**********************************************************************************/
/* Copyright (c) 2025 Matthew Thomas Beck                                         */
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


/********** DOWNLOAD RESUMÉ **********/

const downloadResumeBox = document.getElementById('downloadResumeBox'); // find download resume box
const downloadResumeIcon = document.getElementById('downloadResumeIcon'); // find download resume icon
const downloadResumeText = document.getElementById('downloadResumeText'); // find download resume text

downloadResumeBox.addEventListener('click', function() {
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = 'https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/resumes/resume_1.2-sin_info.pdf';
    link.download = 'Matthew_Thomas_Beck_Resume.pdf'; // Set the filename for download
    link.target = '_blank'; // Open in new tab as fallback
    document.body.appendChild(link); // Add to DOM temporarily
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
});



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

// find projects elements class and set to variable
const projects = document.getElementsByClassName('projects');

// find videos elements class and set to variable
const videos = document.getElementsByClassName('videos');

const videosArrowLeft = document.getElementById('videosArrowLeft'); // videos left arrow
const videosArrowRight = document.getElementById('videosArrowRight'); // videos right arrow
const projectsArrowLeft = document.getElementById('projectsArrowLeft'); // projects left arrow
const projectsArrowRight = document.getElementById('projectsArrowRight'); // projects right arrow

// find skills elements class and set to variable
const skills = document.getElementsByClassName('skills');

// find experiences elements class and set to variable
const experiences = document.getElementsByClassName('experiences');

// find contacts elements class and set to variable
const contacts = document.getElementsByClassName('contacts');

/***** animate programmer typing headers *****/

// initialize intersection observer
const programmerTypingObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => { // go through each header with programmer typing

        if (entry.isIntersecting) { // if header is in view...

            entry.target.classList.add('animateProgrammerTyping'); // trigger programmer typing animation

            /***** trigger fade in animation *****/

            const currentID = entry.target.id; // find current id and store as variable

            /***** about me *****/

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

            /***** skills *****/

            else if (currentID === 'skillSetHeader') { // if current id skill set header...

                /***** trigger fade in animation *****/

                for (let i = 0; i < skills.length; i++) { // loop through all skills to apply fade in update

                    setTimeout(function(skill) { // add animations to each skill with delay

                        // Only add fadeIn if the skill hasn't been ripple-animated yet
                        if (!skill.classList.contains('ripple-complete')) {
                            skill.classList.add('fadeIn'); // add animations to skill
                        } else {
                            // If skill has been ripple-animated, ensure it stays visible and remove any fadeIn
                            skill.classList.remove('fadeIn');
                            skill.style.opacity = '1';
                            skill.style.transform = 'none';
                        }

                    }, i * TIME_INTERVAL, skills[i]); // add delay to each p tag
                }
            }

            /***** projects *****/

            else if (currentID === 'projectsInfoHeader') { // if current id project info header...

                /***** trigger fade in animation *****/

                for (let i = 0; i < projects.length; i++) { // loop through projects to apply fade in update

                    projects[i].classList.add('fadeIn', 'popUp'); // add animations to each project

                    projects[i].getElementsByTagName('h1')[0].classList.add('popUp'); // pop up to title

                    projects[i].getElementsByTagName('img')[0].classList.add('popUp'); // add pop up to img
                }

                // if the left arrow has the show class (not first project)...
                if (projectsArrowLeft.classList.contains('showArrow')) {

                    projectsArrowLeft.classList.add('fadeIn'); // add animations to arrow
                }

                // if the right arrow has the show class (not last project)...
                if (projectsArrowRight.classList.contains('showArrow')) {

                    projectsArrowRight.classList.add('fadeIn'); // add animations to arrow
                }

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

                projectsArrowLeft.classList.add('postFadeIn'); // add animation has ended flag to left arrow

                setTimeout(function() { // add flags to arrows with delay

                    projectsArrowRight.classList.add('postFadeIn'); // add animation has ended flag to right arrow

                }, 13 * TIME_INTERVAL); // add delay to flag
            }

            /***** experiences *****/

            else if (currentID === 'experiencesHeader') { // if current id experiences header...

                /***** trigger fade in animation *****/

                // loop through all experiences to apply fade in update
                for (let i = 0; i < experiences.length; i++) {

                    setTimeout(function(experience) { // add animations to each experience with delay

                        // Only add fadeIn if the experience hasn't been ripple-animated yet
                        if (!experience.classList.contains('ripple-complete')) {
                            experience.classList.add('fadeIn'); // add animations to experience
                        } else {
                            // If experience has been ripple-animated, ensure it stays visible and remove any fadeIn
                            experience.classList.remove('fadeIn');
                            experience.style.opacity = '1';
                            experience.style.transform = 'none';
                        }

                    }, i * TIME_INTERVAL, experiences[i]); // add delay to each p tag
                }
            }

            /***** videos *****/

            else if (currentID === 'videosInfoHeader') { // if current id video info header...

                /***** trigger fade in animation *****/

                for (let i = 0; i < videos.length; i++) { // loop through videos to apply fade in update

                    try { // try to add fadeIn and popUp to each video...

                        videos[i].classList.add('fadeIn', 'popUp'); // add animations to each video

                        videos[i].getElementsByTagName('h1')[0].classList.add('popUp'); // pop up to title

                        try { // try to load iframe...

                            // add pop up to iframe
                            videos[i].getElementsByTagName('iframe')[0].classList.add('popUp');

                        } catch (error) { // if failure...

                            console.log(error); // log error
                        }

                        try { // try to load img tag...

                            // add pop up to img
                            videos[i].getElementsByTagName('img')[0].classList.add('popUp');

                        } catch (error) { // if failure...

                            console.log(error); // log error
                        }

                    } catch (error) { // if failure...

                        console.log(error); // log error
                    }
                }

                // if the left arrow has the show class (not first video)...
                if (videosArrowLeft.classList.contains('showArrow')) {

                    videosArrowLeft.classList.add('fadeIn'); // add animations to arrow
                }

                // if the right arrow has the show class (not last video)...
                if (videosArrowRight.classList.contains('showArrow')) {

                    videosArrowRight.classList.add('fadeIn'); // add animations to arrow
                }

                // additional content fade in
                document.getElementById('videosInfoName').classList.add('fadeIn');

                setTimeout(function() { // add animations to body with delay

                    // trigger fade in for additional content
                    document.getElementById('videosInfoBody').classList.add('fadeIn');

                }, TIME_INTERVAL); // add delay to body

                videosArrowLeft.classList.add('postFadeIn'); // add animation has ended flag to left arrow

                setTimeout(function() { // add flags to arrows with delay

                    videosArrowRight.classList.add('postFadeIn'); // add animation has ended flag to right arrow

                }, 13 * TIME_INTERVAL); // add delay to flag
            }

            /***** contacts *****/

            else if (currentID === 'contactMeHeader') { // if current id contact me header...

                /***** trigger fade in animation *****/

                for (let i = 0; i < contacts.length; i++) { // loop through contacts to apply fade in update

                    setTimeout(function(contact) { // add animations to each contact with a delay

                        // Only add fadeIn if the contact hasn't been pop-animated yet
                        if (!contact.classList.contains('pop-complete')) {
                            contact.classList.add('fadeIn', 'popUp'); // add animations to contact
                        } else {
                            // If contact has been pop-animated, ensure it stays visible and remove any fadeIn
                            contact.classList.remove('fadeIn');
                            contact.style.opacity = '1';
                            contact.style.transform = 'none';
                        }

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

        else if (currentID === 'experiencesHeader') { // if current id experiences header...

            replacementText.textContent = "My Experiences:"; // set replacement span content
        }

        else if (currentID === 'videosInfoHeader') { // if current id videos header...

            replacementText.textContent = "My Videos:"; // set replacement span content
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


/********** IF IN THE MIDDLE **********/

function isElementInMiddle(element) { // function to check if element is in the middle of the screen

    /***** set variables *****/

    const rect = element.getBoundingClientRect(); // get element bounding rectangle
    const viewportHeight = window.innerHeight; // get viewport height
    const elementMiddleY = rect.top + rect.height / 2; // get middle of element
    const screenMiddleY = viewportHeight / 2; // get middle of screen

    /***** return true if element in middle of screen *****/

    return Math.abs(elementMiddleY - screenMiddleY); // return true if element in middle of screen
}


/********** BOX SLIDING **********/

/***** set variables *****/

const aboutMeBox = document.getElementById('aboutMeBox'); // about me box
const projectsInfoBox = document.getElementById('projectsInfoBox'); // projects box
const videosInfoBox = document.getElementById('videosInfoBox'); // videos box
const viewportHeight = window.innerHeight; // viewport height
const screenMiddleY = viewportHeight / 2; // middle of screen

/***** slide boxes *****/

function slideBox() { // function to slide boxes based on scroll position

    if (window.matchMedia("(min-width: 1025px)").matches) { // if screen large...

        /***** set variables *****/

        const aboutMeBoxDimensions = aboutMeBox.getBoundingClientRect(); // get about me box dimensions

        // get middle of about me box
        let aboutMeBoxMiddleY = aboutMeBoxDimensions.top + aboutMeBoxDimensions.height / 2;

        // get projects info box dimensions
        const projectsInfoBoxDimensions = projectsInfoBox.getBoundingClientRect();

        // get videos info box dimensions
        const videosInfoBoxDimensions = videosInfoBox.getBoundingClientRect();

        // get middle of projects info box
        let projectsInfoBoxMiddleY = projectsInfoBoxDimensions.top + projectsInfoBoxDimensions.height / 2;

        // get middle of videos info box
        let videosInfoBoxMiddleY = videosInfoBoxDimensions.top + videosInfoBoxDimensions.height / 2;
        const aboutMeBoxTop = aboutMeBox.getBoundingClientRect().top; // get about me box top
        const projectsInfoBoxTop = projectsInfoBox.getBoundingClientRect().top; // get projects info box top
        const videosInfoBoxTop = videosInfoBox.getBoundingClientRect().top; // get videos info box top

        // get projects info box bottom
        const projectsInfoBoxBottom = projectsInfoBox.getBoundingClientRect().bottom;

        // get videos info box bottom
        const videosInfoBoxBottom = videosInfoBox.getBoundingClientRect().bottom;

        /***** about me box *****/

        if (aboutMeBox) { // if about me box exists...

            // if top of about me box is in view (with nav height)...
            if (aboutMeBoxTop >= (0 - (((window.innerHeight / 100) * 2.5) + NAV_HEIGHT))) {

                // adjust box top spacing based on position of scroll and allow to move down
                aboutMeBox.style.marginTop = (screenMiddleY - aboutMeBoxMiddleY) + 'px';
            }
        }

        /***** projects box *****/

        if (projectsInfoBox) { // if projects info box exists...

            if ( // if top of projects info box is in view (with nav height) as well as bottom...

                projectsInfoBoxTop >= (0 - (((window.innerHeight / 100) * 2.5) + NAV_HEIGHT)) &&
                projectsInfoBoxBottom <= (window.innerHeight + ((window.innerHeight / 100) * 2.5) + NAV_HEIGHT)
            ) {

                // adjust box top spacing based on position of scroll and allow to move down
                projectsInfoBox.style.marginTop = ((screenMiddleY - projectsInfoBoxMiddleY)) + 'px';

                // adjust margin bottom to be 0
                projectsInfoBox.style.marginBottom = '0px';
            }
        }

        /***** videos box *****/

        if (videosInfoBox) { // if videos info box exists...

            if ( // if top of videos info box is in view (with nav height) as well as bottom...

                videosInfoBoxTop >= (0 - (((window.innerHeight / 100) * 2.5) + NAV_HEIGHT)) &&
                videosInfoBoxBottom <= (window.innerHeight + ((window.innerHeight / 100) * 2.5) + NAV_HEIGHT)
            ) {

                // adjust box top spacing based on position of scroll and allow to move down
                videosInfoBox.style.marginTop = ((screenMiddleY - videosInfoBoxMiddleY)) + 'px';

                // adjust margin bottom to be 0
                videosInfoBox.style.marginBottom = '0px';
            }
        }
    }
}

/***** check for elements *****/

function checkSlideBox() { // function to check if elements are in the middle of the screen

    slideBox(); // run slide box function

    requestAnimationFrame(checkSlideBox); // run check slide box function
}

requestAnimationFrame(checkSlideBox); // run check slide box function


/********** PROJECTS WHEEL **********/

/***** set variables *****/

// swipe arrow right
const projectsArrowBoxRight = document.getElementById('projectsArrowRightBox');
const projectsArrowBoxLeft = document.getElementById('projectsArrowLeftBox'); // swipe arrow left
const projectsWheel = document.getElementById('projectsWheel'); // projects scroll
const projectsBackground = document.getElementById('projectsBackground'); // projects background
const projectsInfoName = document.getElementById('projectsInfoName'); // name of project
const projectsInfoBody = document.getElementById('projectsInfoBody'); // content of project
let projectItemWidth = document.querySelector('.projects').offsetWidth * 2; // width of a project item
const numProjects = document.getElementsByClassName('projects').length; // number of projects

/***** left arrow swipe *****/

projectsArrowBoxLeft.addEventListener('click', function() { // when swipe arrow left is clicked...

    /***** set variables *****/

    let scrollPosition = projectsWheel.scrollLeft; // update div based on scroll position

    /***** move left *****/

    if (scrollPosition < (projectsWheel.scrollWidth / numProjects)) { // if scroll at first item...

        projectsWheel.scrollTo({ // scroll to next left item

            left: 0,
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 2)) { // if scroll at second item...

        projectsWheel.scrollTo({ // scroll to next left item

            left: 0,
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 3)) { // if scroll at third item...

        projectsWheel.scrollTo({ // scroll to next left item

            left: (projectsWheel.scrollWidth / numProjects),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 4)) { // if scroll at fourth item...

        projectsWheel.scrollTo({ // scroll to next left item

            left: ((projectsWheel.scrollWidth / numProjects) * 2),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 5)) { // if scroll at fifth item...

        projectsWheel.scrollTo({ // scroll to next left item

            left: ((projectsWheel.scrollWidth / numProjects) * 3),
            behavior: 'smooth'
        })

    } else if (scrollPosition < projectsWheel.scrollWidth) { // if scroll at sixth item...

        projectsWheel.scrollTo({ // scroll to next left item

            left: ((projectsWheel.scrollWidth / numProjects) * 4),
            behavior: 'smooth'
        })
    }
});

/***** right arrow swipe *****/

projectsArrowBoxRight.addEventListener('click', function() { // when swipe arrow right is clicked...

    /***** set variables *****/

    let scrollPosition = projectsWheel.scrollLeft; // update div based on scroll position

    /***** move right *****/

    if (scrollPosition < (projectsWheel.scrollWidth / numProjects)) { // if scroll at first item...

        projectsWheel.scrollTo({ // scroll to next right item

            left: (projectsWheel.scrollWidth / numProjects),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 2)) { // if scroll at second item...

        projectsWheel.scrollTo({ // scroll to next right item

            left: ((projectsWheel.scrollWidth / numProjects) * 2),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 3)) { // if scroll at third item...

        projectsWheel.scrollTo({ // scroll to next right item

            left: ((projectsWheel.scrollWidth / numProjects) * 3),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 4)) { // if scroll at fourth item...

        projectsWheel.scrollTo({ // scroll to next right item

            left: ((projectsWheel.scrollWidth / numProjects) * 4),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((projectsWheel.scrollWidth / numProjects) * 5)) { // if scroll at fifth item...

        projectsWheel.scrollTo({ // scroll to next right item

            left: ((projectsWheel.scrollWidth / numProjects) * 5),
            behavior: 'smooth'
        })

    } else if (scrollPosition < projectsWheel.scrollWidth) { // if scroll at sixth item...

        projectsWheel.scrollTo({ // scroll to next right item

            left: ((projectsWheel.scrollWidth / numProjects) * 5),
            behavior: 'smooth'
        })
    }
});

/***** create scroll wheel *****/

projectsWheel.addEventListener('scroll', function() { // when scroll takes place in projectsWheel...

    /***** set variables *****/

    let scrollPosition = projectsWheel.scrollLeft; // update div based on scroll position

    /***** adjust arrow opacity *****/

    // TODO

    /***** calculate scroll position based on screen width *****/

    if (window.innerWidth <= 1024) { // if screen is small size...

        scrollPosition *= 1.3; // add 30% to scroll position as scroll wheel is 30% smaller
    }

    let currentItem = Math.round(scrollPosition / projectItemWidth); // index of visible item based on position

    /***** replace project info *****/

    if (currentItem === 0) { // if current item athena...

        projectsArrowBoxLeft.style.opacity = '0'; // show the left arrow
        projectsArrowBoxRight.style.opacity = '1'; // show the right arrow
        projectsInfoName.textContent = "Athena"; // set title

        // set content from .txt
        projectsInfoBody.innerHTML = "Athena is a gait-adjusting, ai-powered robot dog that was trained in Isaac Sim " +
            "and is powered with a Raspberry Pi 4 and an Intel Movidius NCS2; The physical parts were from the " +
            "open-source ARES platform, designed by the talented:";

        aaedName.textContent = "Aaed Musa!"; // set Aaed's name
        aaedNameLarge.textContent = "Aaed Musa!"; // set Aaed's name large

    } else if (currentItem === 1) { // if current item machine learning portfolio...

        projectsArrowLeft.classList.remove('showArrow'); // remove show class from left arrow
        projectsArrowBoxLeft.style.opacity = '1'; // hide the left arrow
        projectsArrowBoxRight.style.opacity = '1'; // show the right arrow
        projectsInfoName.textContent = "Machine Learning Portfolio"; // set title

        // set content from .txt
        projectsInfoBody.textContent = "Using SageMaker, S3, Amplify, ECR, ECS, CodeCommit, the AWS CLI, and IAM " +
            "roles from the AWS solution suite, as well as my own machine learning algorithm, I created a portfolio " +
            "that predicts share prices (OBLIGATORY: THIS IS NOT FINANCIAL ADVICE)";

        aaedName.textContent = ""; // unset Aaed's name
        aaedNameLarge.textContent = ""; // unset Aaed's name large

    } else if (currentItem === 2) { // if current item edge a.i. module...

        projectsArrowLeft.classList.add('showArrow'); // add show class to left arrow
        projectsArrowBoxLeft.style.opacity = '1'; // show the left arrow
        projectsArrowBoxRight.style.opacity = '1'; // show the right arrow
        projectsInfoName.textContent = "Edge AI Module"; // set title

        if (projectsArrowLeft.classList.contains('postFadeIn')) { // if fadeIn animation has ended...

            if (projectsArrowRight.classList.contains('postFadeIn')) { // if right arrow has already completely loaded...

                console.log("Full opacity...");

                projectsArrowLeft.style.opacity = '1'; // show left arrow immediately

            } else { // if right arrow has not completely loaded...

                console.log("Adding fadeIn...");

                projectsArrowLeft.classList.add('fadeIn'); // add animations to arrow
            }
        }

        // set content from .txt
        projectsInfoBody.innerHTML = projectsInfoBody.innerHTML = "The Edge AI Module is a device I created while " +
            "working on project Athena, in which I wanted a flexible device that allowed for adjustable voltage to " +
            "work with any power source, 12 channels of control, a remote control module, a camera, a fan for " +
            "cooling, neat wiring, and an NCS2 to use edge AI";

        aaedName.textContent = ""; // unset Aaed's name
        aaedNameLarge.textContent = ""; // unset Aaed's name large

    } else if (currentItem === 3) { // if current item receipt analyzer...

        projectsArrowBoxLeft.style.opacity = '1'; // show the left arrow
        projectsArrowBoxRight.style.opacity = '1'; // show the right arrow
        projectsInfoName.textContent = "Receipt Analyzer"; // set title

        // set content from .txt
        projectsInfoBody.textContent = "I built a Python app before LLM's that uses TKinter, Matplotlib, Psycopg2, " +
            "and a host of other technologies including its own database in order to better track my spending during " +
            "the early days of university";

        aaedName.textContent = ""; // unset Aaed's name
        aaedNameLarge.textContent = ""; // unset Aaed's name large

    } else if (currentItem === 4) { // if current item personal website...

        projectsArrowRight.classList.add('showArrow'); // add show class to right arrow
        projectsArrowBoxLeft.style.opacity = '1'; // show the left arrow
        projectsArrowBoxRight.style.opacity = '1'; // show the right arrow
        projectsInfoName.textContent = "Personal Website"; // set title

        // set content from .txt
        projectsInfoBody.textContent = "This very page you're looking at! Fun fact, I made this in less than a month " +
            "before LLM's as a full-time student and with limited experience in HTML, CSS, or JavaScript; what really " +
            "helped me move forward quickly was forcefully blocking all distractions, prior knowledge in Java, and " +
            "black coffee";

        aaedName.textContent = ""; // unset Aaed's name
        aaedNameLarge.textContent = ""; // unset Aaed's name large

    } else if (currentItem === 5) { // if current item video editor...

        projectsArrowRight.classList.remove('showArrow'); // remove show class from right arrow
        projectsArrowBoxLeft.style.opacity = '1'; // show the left arrow
        projectsArrowBoxRight.style.opacity = '0'; // hide the right arrow
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


/********** VIDEOS WHEEL **********/

/***** set variables *****/

// swipe arrow right
const videosArrowBoxRight = document.getElementById('videosArrowRightBox');
const videosArrowBoxLeft = document.getElementById('videosArrowLeftBox'); // swipe arrow left
const videosWheel = document.getElementById('videosWheel'); // projects scroll
const videosBackground = document.getElementById('videosBackground'); // projects background
const videosInfoName = document.getElementById('videosInfoName'); // name of project
const videosInfoBody = document.getElementById('videosInfoBody'); // content of project
let videoItemWidth = document.querySelector('.videos').offsetWidth * 2; // width of a project item
const numVideos = document.getElementsByClassName('videos').length; // number of videos

/***** left arrow swipe *****/

videosArrowBoxLeft.addEventListener('click', function() { // when swipe arrow left is clicked...

    /***** set variables *****/

    let scrollPosition = videosWheel.scrollLeft; // update div based on scroll position

    /***** move left *****/

    if (scrollPosition < (videosWheel.scrollWidth / numVideos)) { // if scroll at first item...

        videosWheel.scrollTo({ // scroll to next left item

            left: 0,
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((videosWheel.scrollWidth / numVideos) * 2)) { // if scroll at second item...

        videosWheel.scrollTo({ // scroll to next left item

            left: 0,
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((videosWheel.scrollWidth / numVideos) * 3)) { // if scroll at third item...

        videosWheel.scrollTo({ // scroll to next left item

            left: (videosWheel.scrollWidth / numVideos),
            behavior: 'smooth'
        })
    }
});

/***** right arrow swipe *****/

videosArrowBoxRight.addEventListener('click', function() { // when swipe arrow right is clicked...

    /***** set variables *****/

    let scrollPosition = videosWheel.scrollLeft; // update div based on scroll position

    /***** move right *****/

    if (scrollPosition < (videosWheel.scrollWidth / numVideos)) { // if scroll at first item...

        videosWheel.scrollTo({ // scroll to next right item

            left: (videosWheel.scrollWidth / numVideos),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((videosWheel.scrollWidth / numVideos) * 2)) { // if scroll at second item...

        videosWheel.scrollTo({ // scroll to next right item

            left: ((videosWheel.scrollWidth / numVideos) * 2),
            behavior: 'smooth'
        })

    } else if (scrollPosition < ((videosWheel.scrollWidth / numVideos) * 3)) { // if scroll at third item...

        videosWheel.scrollTo({ // scroll to next right item

            left: ((videosWheel.scrollWidth / numVideos) * 3),
            behavior: 'smooth'
        })
    }
});

/***** create scroll wheel *****/

videosWheel.addEventListener('scroll', function() { // when scroll takes place in projectsWheel...

    /***** set variables *****/

    let scrollPosition = videosWheel.scrollLeft; // update div based on scroll position

    /***** adjust arrow opacity *****/

    // TODO

    /***** calculate scroll position based on screen width *****/

    if (window.innerWidth <= 1024) { // if screen is small size...

        scrollPosition *= 1.3; // add 30% to scroll position as scroll wheel is 30% smaller
    }

    let currentItem = Math.round(scrollPosition / videoItemWidth); // index of visible item based on position

    /***** replace project info *****/

    if (currentItem === 0) { // if current item latest video...

        videosArrowLeft.classList.remove('showArrow'); // remove show class from left arrow
        videosArrowBoxLeft.style.opacity = '0'; // hide the left arrow
        videosArrowBoxRight.style.opacity = '1'; // show the right arrow
        videosInfoName.textContent = "Training Athena"; // set title

        // set content from .txt
        videosInfoBody.textContent = "I used the foundations I built in the 'Building Athena' video to " +
            "start training Athena to walk";

    } else if (currentItem === 1) { // if current item building athena...

        videosArrowLeft.classList.add('showArrow'); // add show class to left arrow
        videosArrowBoxLeft.style.opacity = '1'; // show the left arrow
        videosArrowBoxRight.style.opacity = '1'; // show the right arrow
        videosInfoName.textContent = "Building Athena"; // set title

        if (videosArrowLeft.classList.contains('postFadeIn')) { // if fadeIn animation has ended...

            if (videosArrowRight.classList.contains('postFadeIn')) { // if right arrow has already completely loaded...

                console.log("Full opacity...");

                videosArrowLeft.style.opacity = '1'; // show left arrow immediately

            } else { // if right arrow has not completely loaded...

                console.log("Adding fadeIn...");

                videosArrowLeft.classList.add('fadeIn'); // add animations to arrow
            }
        }

        // set content from .txt
        videosInfoBody.innerHTML = videosInfoBody.innerHTML = "I built a robot dog so I could put my programming " +
            "flexibility to the test";

    } else if (currentItem === 2) { // if current item receipt analyzer...

        videosArrowLeft.classList.add('showArrow'); // add show class to left arrow
        videosArrowBoxLeft.style.opacity = '1'; // show the left arrow
        videosArrowBoxRight.style.opacity = '1'; // show the right arrow
        videosInfoName.textContent = "Receipt Analyzer"; // set title

        if (videosArrowLeft.classList.contains('postFadeIn')) { // if fadeIn animation has ended...

            if (videosArrowRight.classList.contains('postFadeIn')) { // if right arrow has already completely loaded...

                console.log("Full opacity...");

                videosArrowLeft.style.opacity = '1'; // show left arrow immediately

            } else { // if right arrow has not completely loaded...

                console.log("Adding fadeIn...");

                videosArrowLeft.classList.add('fadeIn'); // add animations to arrow
            }
        }

        // set content from .txt
        videosInfoBody.textContent = "I built a Python app that uses Custom TKinter, Matplotlib, Psycopg2, and a " +
            "host of other technologies including its own SQL database in order to better track my spending during " +
            "the early days of university";

    } else if (currentItem === 3) { // if current item video editor...

        videosArrowLeft.classList.add('showArrow'); // add show class to left arrow
        videosArrowBoxLeft.style.opacity = '1'; // show the left arrow
        videosArrowBoxRight.style.opacity = '1'; // show the right arrow
        videosInfoName.textContent = "Video Editor"; // set title

        if (videosArrowLeft.classList.contains('postFadeIn')) { // if fadeIn animation has ended...

            if (videosArrowRight.classList.contains('postFadeIn')) { // if right arrow has already completely loaded...

                console.log("Full opacity...");

                videosArrowLeft.style.opacity = '1'; // show left arrow immediately

            } else { // if right arrow has not completely loaded...

                console.log("Adding fadeIn...");

                videosArrowLeft.classList.add('fadeIn'); // add animations to arrow
            }
        }

        // set content from .txt
        videosInfoBody.innerHTML = videosInfoBody.innerHTML = "As Adobe Premiere Pro did not have any kind of API I " +
            "could use to edit my videos automatically (at the time of writing), I created a script that primarily" +
            "uses PyAutoGUI to control my screen and edit videos for me";

    } else if (currentItem === 4) { // if current item last video...

        videosArrowRight.classList.remove('showArrow'); // remove show class from right arrow
        videosArrowBoxLeft.style.opacity = '1'; // show the left arrow
        videosArrowBoxRight.style.opacity = '0'; // hide the right arrow
        videosInfoName.textContent = "Under Construction"; // set title

        // set content from .txt
        videosInfoBody.textContent = "Stay tuned; more coming soon!";
    }

    videosInfoBody.style.textAlign = 'left'; // set text alignment to left
});

/********** SKILLS CASCADE EFFECT **********/

/***** set variables *****/

const skillBars = document.querySelectorAll('.skills'); // get all skill bars
const experienceBars = document.querySelectorAll('.experiences'); // get all experience bars

/***** get current portrait color *****/

function getCurrentPortraitColor() {
    const slides = document.querySelectorAll('.slide');
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].style.display === 'block') {
            // Return the corresponding pastel color based on slide index
            switch(i) {
                case 0: return 'var(--pastel-1)';
                case 1: return 'var(--pastel-2)';
                case 2: return 'var(--pastel-3)';
                case 3: return 'var(--pastel-4)';
                default: return 'var(--pastel-1)';
            }
        }
    }
    return 'var(--pastel-1)'; // fallback
}

/***** update cascade color dynamically *****/

function updateCascadeColor() {
    const currentColor = getCurrentPortraitColor();
    document.documentElement.style.setProperty('--cascade-color', currentColor);
}

/***** add click event listeners to skill bars *****/

skillBars.forEach((skillBar, index) => {
    skillBar.addEventListener('click', function(event) {
        updateCascadeColor(); // Update color before animation
        createRipple(event, skillBar);
        triggerSkillCascade(index, skillBars);
    });
});

/***** add click event listeners to experience bars *****/

experienceBars.forEach((experienceBar, index) => {
    experienceBar.addEventListener('click', function(event) {
        updateCascadeColor(); // Update color before animation
        createRipple(event, experienceBar);
        triggerSkillCascade(index, experienceBars);
    });
});

/***** add click event listeners to contact bars *****/

const contactBars = document.querySelectorAll('.contacts'); // get all contact bars

contactBars.forEach((contactBar) => {
    contactBar.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent immediate redirect
        
        updateCascadeColor(); // Update color before animation
        createRipple(event, contactBar);
        triggerContactPop(contactBar);
    });
});

/***** contact pop effect function *****/

function triggerContactPop(contactBar) {
    const contactIcon = contactBar.querySelector('.contactsIcon');
    const contactBody = contactBar.querySelector('.contactsBody');
    
    // Temporarily remove pop-complete class to allow re-animation
    contactBar.classList.remove('pop-complete');
    
    // Add animation classes
    contactBar.classList.add('pop-animating');
    if (contactIcon) contactIcon.classList.add('pop-animating');
    if (contactBody) contactBody.classList.add('pop-animating');
    
    // Remove animation classes after animation completes and redirect
    setTimeout(() => {
        contactBar.classList.remove('pop-animating');
        contactBar.classList.add('pop-complete');
        if (contactIcon) contactIcon.classList.remove('pop-animating');
        if (contactBody) contactBody.classList.remove('pop-animating');
        
        // Now redirect to the link
        const href = contactBar.getAttribute('href');
        if (href) {
            window.location.href = href;
        }
    }, 1200); // match animation duration
}

/***** create ripple effect *****/

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    // Remove ripple element after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/***** cascade effect function *****/
function triggerSkillCascade(startIndex, elements) {
    const rippleDelay = 150; // delay between each element animation in milliseconds
    const totalElements = elements.length;
    const parentDiv = elements[0].classList.contains('skills') ? document.getElementById('mySkills') :
                      elements[0].classList.contains('experiences') ? document.getElementById('myExperiences') : null;

    // Calculate the maximum distance from the clicked element
    const maxDistance = Math.max(startIndex, totalElements - 1 - startIndex);

    // Animate elements in both directions from the clicked element
    for (let distance = 0; distance <= maxDistance; distance++) {
        const delay = distance * rippleDelay;

        // Animate element below the clicked one
        const belowIndex = startIndex + distance;
        if (belowIndex < totalElements) {
            setTimeout(() => {
                animateElement(belowIndex, elements);
            }, delay);
        }

        // Animate element above the clicked one (but not the same element)
        const aboveIndex = startIndex - distance;
        if (aboveIndex >= 0 && distance > 0) {
            setTimeout(() => {
                animateElement(aboveIndex, elements);
            }, delay);
        }
    }

    // Parent div color: one interval after the last element starts animating
    if (parentDiv) {
        const parentDelay = (maxDistance + 1) * rippleDelay;
        setTimeout(() => {
            animateParentDivColor(parentDiv, true, rippleDelay);
        }, parentDelay);
    }
}

/***** animate individual element *****/

function animateElement(index, elements) {
    const element = elements[index];
    const elementIcon = element.querySelector('.skillsIcon, .experiencesIcon');
    const elementBody = element.querySelector('.skillsBody, .experiencesBody');

    // Temporarily remove ripple-complete class to allow re-animation
    element.classList.remove('ripple-complete');

    // Add animation classes
    element.classList.add('cascade-animating');
    if (elementIcon) elementIcon.classList.add('cascade-animating');
    if (elementBody) elementBody.classList.add('cascade-animating');

    // Remove animation classes after animation completes and keep visible
    setTimeout(() => {
        element.classList.remove('cascade-animating');
        element.classList.add('ripple-complete');
        if (elementIcon) elementIcon.classList.remove('cascade-animating');
        if (elementBody) elementBody.classList.remove('cascade-animating');
    }, 1200); // match animation duration (50% slower)
}

/***** animate parent div color and then nav bar/options bar *****/
function animateParentDivColor(parentDiv, animateNavBar = false, rippleDelay = 150) {
    parentDiv.style.transition = 'background-color 0.6s cubic-bezier(.4,0,.2,1)';
    parentDiv.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cascade-color') || 'var(--pastel-1)';
    setTimeout(() => {
        parentDiv.style.backgroundColor = 'var(--secondary)';
        setTimeout(() => {
            parentDiv.style.transition = '';
            parentDiv.style.backgroundColor = '';
        }, 700);
    }, 900);
    // Nav bar/options bar: one interval after parent div
    if (animateNavBar) {
        setTimeout(() => {
            animateNavAndOptionsBarColor();
        }, rippleDelay);
    }
}

/***** animate nav bar and options bar color (backgrounds only) *****/
function animateNavAndOptionsBarColor() {
    const navBar = document.getElementById('navBar');
    const navBarOptionsBox = document.getElementById('navBarOptionsBox');
    const navBarOptionsButton = document.getElementById('navBarOptionsButton');
    const navBarOptions = document.querySelectorAll('.navBarOptions');
    const aboutMeBox = document.getElementById('aboutMeBox');
    const projectsInfoBox = document.getElementById('projectsInfoBox');
    const videosInfoBox = document.getElementById('videosInfoBox');
    const cascadeColor = getComputedStyle(document.documentElement).getPropertyValue('--cascade-color') || 'var(--pastel-1)';
    const secondaryColor = 'var(--secondary)';

    // Only backgrounds/containers, not text or icons, and NOT the projects bar
    [navBar, navBarOptionsBox, navBarOptionsButton, ...navBarOptions, aboutMeBox, projectsInfoBox, videosInfoBox].forEach(bar => {
        if (bar) {
            bar.style.transition = 'background-color 0.6s cubic-bezier(.4,0,.2,1)';
            bar.style.backgroundColor = cascadeColor;
        }
    });
    setTimeout(() => {
        [navBar, navBarOptionsBox, navBarOptionsButton, ...navBarOptions, aboutMeBox, projectsInfoBox, videosInfoBox].forEach(bar => {
            if (bar) {
                bar.style.backgroundColor = secondaryColor;
                setTimeout(() => {
                    bar.style.transition = '';
                    bar.style.backgroundColor = '';
                }, 700);
            }
        });
    }, 900);
}