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


/********** IMPORT JSON DATA FUNCTION **********/

async function fetchData(financialInstrument) { // function to fetch json data

    /***** set variables *****/

    // set base URL to S3 bucket
    const baseCDNURL = `https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/machine_learning_portfolio/data/`;

    // set path to json data with financial instrument
    let financialInstrumentDataPath = `${baseCDNURL}${financialInstrument}Data.json`;

    /***** read data *****/

    try { // attempt to read json data...

        const response = await fetch(financialInstrumentDataPath); // fetch data from json file

        if (!response.ok) { // if response is not ok...

            throw new Error('Network response was not ok.\n'); // print failure statement
        }

        const financialInstrumentData = await response.json(); // parse json data

        return financialInstrumentData; // return json data
    }

    catch (error) { // if unable to fetch json...

        console.error(`Error retrieving the json file: "${error}"\n`); // print failure statement

        return null; // terminate process with error
    }
}





/************************************************************************/
/*************** machine_learning_portfolio.js JAVASCRIPT ***************/
/************************************************************************/


/********** DETERMINE POSITIVE OR NEGATIVE **********/

function updateMovementAppearance(tableElement, movement) { // function to update movement value

    /***** check if positive or negative *****/

    if (movement < 0) { // if movement is negative...

        tableElement.style.color = 'red'; // set color to red
        tableElement.textContent = movement + '%'; // set value text

    } else { // if movement is positive...

        tableElement.style.color = 'green'; // set color to green
        tableElement.textContent = '+' + movement + '%'; // set value text
    }
}


/********** DETERMINE IF VALUE TOO MANY DIGITS **********/

function updateMovementValue(movement) { // function to update movement value

    /***** 2 too many digits *****/

    if (movement > 999 || movement < -999) { // if value is 4 digits and causes 2-digit overflow...

        return Math.round(movement); // round value to nearest whole number to remove all decimals

    }

    /***** 1 too many digits *****/

    else if (movement > 99 || movement < -99) { // if value is 3 digits and causes 1-digit overflow...

        movement = movement * 10; // multiply value by 10 to make value have 1 decimal place

        movement = Math.round(movement); // round value to nearest whole number

        return movement / 10; // return value divided by 10 to return to original value

    }

    /***** no overflow *****/

    else { // if value is not greater than 99...

        return movement; // return unaltered value
    }
}


/********** CREATE FINANCIAL INSTRUMENT TABLES **********/

/***** set variables *****/

// collect all categories of financial instruments from category class
const financialInstrumentTags = document.querySelectorAll('.financialInstrument');

// collect all categories of financial instrument tables
const graphs = document.getElementsByClassName('financialInstrumentGraph');
const financialInstruments = [] // array to hold all financial instrument categories

/***** collect each category *****/

financialInstrumentTags.forEach(financialInstrumentTag => { // loop to collect names

    let textContent = financialInstrumentTag.textContent.trim().toLowerCase(); // set category to lowercase

    if (textContent === "foreign exchange") { // if category is foreign exchange...

        financialInstruments.push("foreignExchange"); // add category to array
    }

    else { // if category is not foreign exchange...

        financialInstruments.push(textContent); // add category to array
    }
});

/***** function to create a table *****/

document.addEventListener('DOMContentLoaded', async function () {

    async function createTables(financialInstrument) {

        /***** try to create table *****/

        try { // attempt to create table...

            /***** fetch data *****/

            const financialInstrumentData = await fetchData(financialInstrument); // fetch data from json file

            /***** set variables *****/

            let traceNameList = []; // array to hold names of financial instruments
            let colorList = []; // array to hold colors of financial instruments
            let predictionAccuracyList = []; // array to hold prediction accuracy of financial instruments
            let prediction1List = []; // array to hold first prediction of financial instruments
            let prediction2List = []; // array to hold second prediction of financial instruments
            let prediction3List = []; // array to hold third prediction of financial instruments
            let movementProjectedList = []; // array to hold projected movement of financial instruments
            let movementWeekList = []; // array to hold movement of financial instruments over past week
            let movementMonthList = []; // array to hold movement of financial instruments over past month
            let movementThreeMonthsList = []; // array to hold movement of financial instruments over past three months
            let movementYearList = []; // array to hold movement of financial instruments over past year
            let movementMaxList = []; // array to hold movement of financial instruments over maximum time frame
            const tableID = financialInstrument + 'Tables'; // set table id based on financial instrument
            const headerID = financialInstrument + 'Header'; // set header id based on financial instrument
            const graphBoxID = financialInstrument + 'GraphBox'; // set graph box id
            const table = document.getElementById(tableID); // find table based on id

            /***** fill respective data *****/

            financialInstrumentData.forEach(item => {

                traceNameList.push(item['Name']);
                colorList.push(item['Color']);
                predictionAccuracyList.push(item['Prediction Accuracy']);
                prediction1List.push(item['Prediction 1']);
                prediction2List.push(item['Prediction 2']);
                prediction3List.push(item['Prediction 3']);
                movementProjectedList.push(item['Projected Movement']);
                movementWeekList.push(item['Movement One Week']);
                movementMonthList.push(item['Movement One Month']);
                movementThreeMonthsList.push(item['Movement Three Months']);
                movementYearList.push(item['Movement Year To Day']);
                movementMaxList.push(item['Movement All Time']);
            });

            /***** create tables with collected data *****/

            for (let i = 0; i < traceNameList.length; i++) { // loop through each financial instrument

                /***** set variables *****/

                const traceName = traceNameList[i]; // set name
                const predictionAccuracy = predictionAccuracyList[i]; // set prediction accuracy
                const prediction1 = prediction1List[i]; // set prediction 1
                const prediction2 = prediction2List[i]; // set prediction 2
                const prediction3 = prediction3List[i]; // set prediction 3
                const movementProjected = movementProjectedList[i]; // set projected movement
                const movementWeek = movementWeekList[i]; // set movement over past week
                const movementMonth = movementMonthList[i]; // set movement over past month
                const movementThreeMonths = movementThreeMonthsList[i]; // set movement over past three months
                const movementYear = movementYearList[i]; // set movement over past year
                const movementMax = movementMaxList[i]; // set movement over maximum time frame
                const tableItemID = financialInstrument + traceName; // set table id based on financial instrument name

                /***** create table box *****/

                const a = document.createElement('a'); // create list item to hold the table

                // add behavior classes
                a.className = 'standardFont indexContent popUp financialInstrumentTableItems active';
                a.setAttribute('onmouseover', 'popUp(this)'); // add pop up
                a.setAttribute('onmouseout', 'popDown(this)'); // add pop down
                a.style.backgroundColor = colorList[i]; // set colors
                a.id = tableItemID; // set specific id for each table
                a.onclick = function() { // set onclick function to isolate trace

                    // call to isolate trace
                    isolateFinancialInstrument(

                        graphBoxID,
                        headerID,
                        tableID,
                        tableItemID,
                        traceNameList,
                        traceName,
                        this
                    );
                };

                /***** create table header *****/

                const header = document.createElement('h2'); // create header with name
                header.className = 'standardFont tableItemsHeader'; // add header class
                header.textContent = traceName; // set header text
                a.appendChild(header); // add header to table

                /***** create table content box *****/

                const contentBox = document.createElement('div'); // create content box
                contentBox.className = 'tableItemsContentBox'; // add content box class

                /***** create prediction accuracy *****/

                // create box to hold prediction accuracy label and value
                const predictionAccuracyBox = document.createElement('div');
                predictionAccuracyBox.classList.add('tableItemsMetricBox'); // add metric box class

                // create label for prediction accuracy
                const predictionAccuracyLabel = document.createElement('h3');
                predictionAccuracyLabel.className = 'tableItemsMetricLabel'; // add label class
                predictionAccuracyLabel.textContent = 'Pred. Line Accuracy: '; // set label text
                predictionAccuracyBox.appendChild(predictionAccuracyLabel); // add label to box

                // create value for prediction accuracy
                const predictionAccuracyValue = document.createElement('p');
                predictionAccuracyValue.className = 'tableItemsMetricValue'; // add label class
                predictionAccuracyValue.textContent = predictionAccuracy + '%'; // set value text
                predictionAccuracyBox.appendChild(predictionAccuracyValue); // add value to box

                contentBox.appendChild(predictionAccuracyBox); // add prediction accuracy box to content box*/

                /***** create prediction 1 *****/

                // create box to hold prediction 1 label and value
                const prediction1Box = document.createElement('div');
                prediction1Box.classList.add('tableItemsMetricBox'); // add content box class

                // create label for prediction 1
                const prediction1Label = document.createElement('h3');
                prediction1Label.className = 'tableItemsMetricLabel'; // add label class
                prediction1Label.textContent = 'Prediction 1: '; // set label text
                prediction1Box.appendChild(prediction1Label); // add label to box

                // create value for prediction 1
                const prediction1Value = document.createElement('p');
                prediction1Value.className = 'tableItemsMetricValue'; // add value class
                prediction1Value.textContent = '$' + prediction1; // set value text
                prediction1Box.appendChild(prediction1Value); // add value to box

                contentBox.appendChild(prediction1Box); // add prediction 1 box to content box

                /***** create prediction 2 *****/

                // create box to hold prediction 2 label and value
                const prediction2Box = document.createElement('div');
                prediction2Box.classList.add('tableItemsMetricBox'); // add content box class

                // create label for prediction 2
                const prediction2Label = document.createElement('h3');
                prediction2Label.className = 'tableItemsMetricLabel'; // add label class
                prediction2Label.textContent = 'Prediction 2: '; // set label text
                prediction2Box.appendChild(prediction2Label); // add label to box

                // create value for prediction 2
                const prediction2Value = document.createElement('p');
                prediction2Value.className = 'tableItemsMetricValue'; // add value class
                prediction2Value.textContent = '$' + prediction2; // set value text
                prediction2Box.appendChild(prediction2Value); // add value to box

                contentBox.appendChild(prediction2Box); // add prediction 2 box to content box

                /***** create prediction 3 *****/

                // create box to hold prediction 3 label and value
                const prediction3Box = document.createElement('div');
                prediction3Box.classList.add('tableItemsMetricBox'); // add content box class

                // create label for prediction 3
                const prediction3Label = document.createElement('h3');
                prediction3Label.className = 'tableItemsMetricLabel'; // add label class
                prediction3Label.textContent = 'Prediction 3: '; // set label text
                prediction3Box.appendChild(prediction3Label); // add label to box

                // create value for prediction 3
                const prediction3Value = document.createElement('p');
                prediction3Value.className = 'tableItemsMetricValue'; // add value class
                prediction3Value.textContent = '$' + prediction3; // set value text
                prediction3Box.appendChild(prediction3Value); // add value to box

                contentBox.appendChild(prediction3Box); // add prediction 3 box to content box

                /***** create projected movement *****/

                // create box to hold projected movement label and value
                const movementProjectedBox = document.createElement('div');
                movementProjectedBox.classList.add('tableItemsMetricBox'); // add content box class

                // create label for projected movement
                const movementProjectedLabel = document.createElement('h3');
                movementProjectedLabel.className = 'tableItemsMetricLabel'; // add label class
                movementProjectedLabel.textContent = 'Projected Movement: '; // set label text
                movementProjectedBox.appendChild(movementProjectedLabel); // add label to box

                // create value for projected movement
                const movementProjectedValue = document.createElement('p');
                movementProjectedValue.className = 'tableItemsMetricValue'; // add value class

                // update movement value
                updateMovementAppearance(movementProjectedValue, updateMovementValue(movementProjected));
                movementProjectedBox.appendChild(movementProjectedValue); // add value to box
                contentBox.appendChild(movementProjectedBox); // add projected movement box to content box

                /***** create movement over past week *****/

                // create box to hold movement over past week label and value
                const movementWeekBox = document.createElement('div');

                // add content box class
                movementWeekBox.className = 'tableItemsMetricBox movement7 tableTimeFrame active';

                // create label for movement over past week
                const movementWeekLabel = document.createElement('h3');
                movementWeekLabel.className = 'tableItemsMetricLabel'; // add label class
                movementWeekLabel.textContent = 'Movement One Week: '; // set label text
                movementWeekBox.appendChild(movementWeekLabel); // add label to box

                // create value for movement over past week
                const movementWeekValue = document.createElement('p');
                updateMovementAppearance(movementWeekValue, updateMovementValue(movementWeek)); // update movement value
                movementWeekValue.className = 'tableItemsMetricValue'; // add value class
                movementWeekBox.appendChild(movementWeekValue); // add value to box
                contentBox.appendChild(movementWeekBox); // add movement over past week box to content box

                /***** create movement over past month *****/

                // create box to hold movement over past month label and value
                const movementMonthBox = document.createElement('div');
                movementMonthBox.className = 'tableItemsMetricBox movement30 tableTimeFrame'; // add content box class

                // create label for movement over past month
                const movementMonthLabel = document.createElement('h3');
                movementMonthLabel.className = 'tableItemsMetricLabel'; // add label class
                movementMonthLabel.textContent = 'Movement One Month: '; // set label text
                movementMonthBox.appendChild(movementMonthLabel); // add label to box

                // create value for movement over past month
                const movementMonthValue = document.createElement('p');

                // update movement value
                updateMovementAppearance(movementMonthValue, updateMovementValue(movementMonth));
                movementMonthValue.className = 'tableItemsMetricValue'; // add value class
                movementMonthBox.appendChild(movementMonthValue); // add value to box
                contentBox.appendChild(movementMonthBox); // add movement over past month box to content box

                /***** create movement over past three months *****/

                // create box to hold movement over past three months label and value
                const movementThreeMonthsBox = document.createElement('div');

                // add content box class
                movementThreeMonthsBox.className = 'tableItemsMetricBox movement90 tableTimeFrame';

                // create label for movement over past three months
                const movementThreeMonthsLabel = document.createElement('h3');
                movementThreeMonthsLabel.className = 'tableItemsMetricLabel'; // add label class
                movementThreeMonthsLabel.textContent = 'Movement Three Months: '; // set label text
                movementThreeMonthsBox.appendChild(movementThreeMonthsLabel); // add label to box

                // create value for movement over past three months
                const movementThreeMonthsValue = document.createElement('p');

                // update movement value
                updateMovementAppearance(movementThreeMonthsValue, updateMovementValue(movementThreeMonths));
                movementThreeMonthsValue.className = 'tableItemsMetricValue'; // add value class
                movementThreeMonthsBox.appendChild(movementThreeMonthsValue); // add value to box
                contentBox.appendChild(movementThreeMonthsBox); // add movement past three months box to content box

                /***** create movement over past year *****/

                // create box to hold movement over past year label and value
                const movementYearBox = document.createElement('div');
                movementYearBox.className = 'tableItemsMetricBox movement365 tableTimeFrame'; // add content box class

                // create label for movement over past year
                const movementYearLabel = document.createElement('h3');
                movementYearLabel.className = 'tableItemsMetricLabel'; // add label class
                movementYearLabel.textContent = 'Movement One Year: '; // set label text
                movementYearBox.appendChild(movementYearLabel); // add label to box

                // create value for movement over past year
                const movementYearValue = document.createElement('p');
                updateMovementAppearance(movementYearValue, updateMovementValue(movementYear)); // update movement value
                movementYearValue.className = 'tableItemsMetricValue'; // add value class
                movementYearBox.appendChild(movementYearValue); // add value to box
                contentBox.appendChild(movementYearBox); // add movement over past year box to content box

                /***** create movement over maximum time frame *****/

                // create box to hold movement over maximum time frame label and value
                const movementMaxBox = document.createElement('div');
                movementMaxBox.className = 'tableItemsMetricBox movementMax tableTimeFrame'; // add content box class

                // create label for movement over maximum time frame
                const movementMaxLabel = document.createElement('h3');
                movementMaxLabel.className = 'tableItemsMetricLabel'; // add label class
                movementMaxLabel.textContent = 'Movement\nMax: '; // set label text
                movementMaxBox.appendChild(movementMaxLabel); // add label to box

                // create value for movement over maximum time frame
                const movementMaxValue = document.createElement('p');
                updateMovementAppearance(movementMaxValue, updateMovementValue(movementMax)); // update movement value
                movementMaxValue.className = 'tableItemsMetricValue'; // add value class
                movementMaxBox.appendChild(movementMaxValue); // add value to box
                contentBox.appendChild(movementMaxBox); // add movement over maximum time frame box to content box

                /***** add data and table to document *****/

                a.appendChild(contentBox); // add content box to table
                table.appendChild(a); // add table to list
            }
        }

        /***** log error if unable to fetch data *****/

        catch (error) { // if unable to fetch json...

            console.error(`Error collecting ${financialInstrument} data: "${error}"\n`); // print failure statement

            return null; // terminate process with error
        }
    }

    /***** loop through every category *****/

    // loop through every category calling createTables function
    financialInstruments.forEach(financialInstrument => {

        createTables(financialInstrument); // create table for each category
    });
});

/***** show traces to hide prediction lines *****/

// when the DOM has loaded and when the async function createTables is done executing, call showTraces
document.addEventListener('DOMContentLoaded', function checkLoadingScreen() { // function to check if loading screen is present

    /***** set variables *****/

    const loadingScreen = document.getElementById('loadingScreen'); // get loading screen

    /***** check if loading screen exists *****/

    if (loadingScreen) { // if loading screen exists...

        if (getComputedStyle(loadingScreen).display !== 'none') { // if loading screen is visible...

            setTimeout(checkLoadingScreen, 50); // check again in 50 milliseconds

        } else { // if loading screen is not visible...

            showTraces(graphs); // show traces to hide prediction lines
        }
    }
});


/********** TIME FRAME BUTTON ADJUSTMENT **********/

function changeTextByDeviceSize() { // function to change content based on device size

    /***** set variables *****/

    // set device width
    let deviceWidth = window.innerWidth;

    /***** small devices *****/

    if (deviceWidth < 501) { // if small device...

        document.getElementById("stocksButton7").textContent = "W"; // set text one week
        document.getElementById("stocksButton30").textContent = "M"; // set text one month
        document.getElementById("stocksButton90").textContent = "3M"; // set text three months
        document.getElementById("stocksButton365").textContent = "YTD"; // set text year to day
        document.getElementById("stocksButtonMax").textContent = "Max"; // set text maximum
    }

    /***** medium devices *****/

    else if (deviceWidth >= 501 && deviceWidth < 1025) { // if medium device...

        document.getElementById("stocksButton7").textContent = "One Week"; // set text one week
        document.getElementById("stocksButton30").textContent = "One Month"; // set text one month
        document.getElementById("stocksButton90").textContent = "Three Months"; // set text three months
        document.getElementById("stocksButton365").textContent = "Year To Day"; // set text year to day
        document.getElementById("stocksButtonMax").textContent = "Maximum"; // set text maximum
    }

    /***** large devices *****/

    else { // if large device...

        document.getElementById("stocksButton7").textContent = "One Week"; // set text one week
        document.getElementById("stocksButton30").textContent = "One Month"; // set text one month
        document.getElementById("stocksButton90").textContent = "Three Months"; // set text three months
        document.getElementById("stocksButton365").textContent = "Year To Day"; // set text year to day
        document.getElementById("stocksButtonMax").textContent = "Maximum"; // set text maximum
    }
}

changeTextByDeviceSize(); // initially call the function

window.addEventListener("resize", changeTextByDeviceSize); // call function whenever window is resized


/********** TIME FRAME SELECTION **********/

function showMetrics(plotId, movementClass, button) {

    /***** set variables *****/

    // collect all associated graphs
    const graphs = document.getElementsByClassName("financialInstrumentGraph");
    const plot = document.getElementById(plotId); // find plot based on id

    // collect all associated tables
    const totalTimeFrames = document.getElementsByClassName("tableTimeFrame");

    // find time frame based on class
    const specificTimeFrame = document.getElementsByClassName(movementClass);

    // collect all associated buttons
    const buttons = document.getElementsByClassName("timeFrameButton");

    /***** remove active state metrics *****/

    for (let i = 0; i < graphs.length; i++) { // loop through all graphs

        graphs[i].classList.remove("active"); // remove active state from all graphs
    }

    // loop through all time frames to remove active state
    for (let i = 0; i < totalTimeFrames.length; i++) {

        totalTimeFrames[i].classList.remove("active"); // remove active state from all tables
    }

    /***** show selected metrics *****/

    if (plot) { // if plot exists...

        plot.classList.add("active"); // show plot

        // loop through all entries of a specific time frame
        for (let i = 0; i < specificTimeFrame.length; i++) {

            specificTimeFrame[i].classList.add("active"); // show time frame
        }
    }

    /***** remove active state buttons *****/

    for (let i = 0; i < buttons.length; i++) { // loop through all buttons

        buttons[i].classList.remove("active"); // remove active state from all buttons
    }

    button.classList.add("active"); // add active state to clicked button
}


/********** SHOW TRACES **********/

function showTraces(graphs) { // function to show all traces

    /***** loop through and show traces *****/

    for (let i = 0; i < graphs.length; i++) { // loop through all graphs

        if (graphs[i]) { // if graph exists...

            const objectElement = graphs[i];
            const embeddedDocument = objectElement.contentDocument;

            if (embeddedDocument) { // if embedded document exists...

                const traces = embeddedDocument.getElementsByClassName('trace', 'scatter');
                const annotations = embeddedDocument.getElementsByClassName('annotation');

                for (let j = 0; j < traces.length; j++) { // loop through all traces

                    if ((j % 5) === 3) { // if hidden prediction line...

                        traces[j].style.opacity = 0; // hide hidden prediction lines

                    } else { // if not hidden prediction line...

                        traces[j].style.opacity = 1; // show any remaining traces
                    }
                }

                for (let j = 0; j < (annotations.length - 1); j++) { // loop through all annotations

                    annotations[j].style.opacity = 1; // show all annotations
                }

            } else { // if embedded document does not exist...

                // log error if embedded document not found
                console.log('Error showing traces: embedded document not found for graph:', objectElement, '.');
            }

        } else { // if graph does not exist...

            console.log('Error showing traces: graph not found.'); // log error if graph not found
        }
    }
}


/********** HIDE TRACES **********/

// function to hide all traces except selected financial instrument
function hideTraces(graphs, traceNameList, traceName) {

    /***** find index of trace name in trace name list *****/

    const traceIndex = traceNameList.indexOf(traceName); // find index of trace name in trace name list

    /***** loop through and hide traces *****/

    for (let i = 0; i < graphs.length; i++) { // loop through all graphs

        if (graphs[i]) { // if graph exists...

            const objectElement = graphs[i];
            const embeddedDocument = objectElement.contentDocument;

            if (embeddedDocument) { // if embedded document exists...

                const traces = embeddedDocument.getElementsByClassName('trace', 'scatter');
                const annotations = embeddedDocument.getElementsByClassName('annotation');

                for (let j = 0; j < traces.length; j++) { // loop through all traces

                    if ((traceIndex * 5) === j) { // if actual data line...

                        traces[j].style.opacity = 1; // show actual data line

                    } else if (((traceIndex * 5) + 1) === j) { // if last trading day marker...

                        traces[j].style.opacity = 1; // show last trading day marker

                    } else if (((traceIndex * 5) + 2) === j) { // if prediction line...

                        traces[j].style.opacity = 1; // show prediction line

                    } else if (((traceIndex * 5) + 3) === j) { // if hidden prediction line...

                        traces[j].style.opacity = 1; // show hidden prediction line

                    } else if (((traceIndex * 5) + 4) === j) { // if prediction marker...

                        traces[j].style.opacity = 1; // show prediction marker

                    } else { // if any unrelated trace...

                        traces[j].style.opacity = 0; // hide any remaining traces
                    }
                }

                for (let j = 0; j < (annotations.length - 1); j++) { // loop through all annotations

                    if (traceIndex === j) {

                        annotations[j].style.opacity = 1; // show trace annotation

                    } else {

                        annotations[j].style.opacity = 0; // hide any remaining annotations
                    }
                }

            } else { // if embedded document does not exist...

                // log error if embedded document not found
                console.log('Error isolating trace: embedded document not found for graph:', objectElement, '.');
            }

        } else { // if graph does not exist...

            console.log('Error isolating trace: graph not found.'); // log error if graph not found
        }
    }
}


/********** SELECT BUTTON TO ISOLATE TRACE **********/

// function to isolate trace
function isolateFinancialInstrument(graphBoxID, headerID, tableID, tableItemID, traceNameList, traceName, button) {

    /***** set variables *****/

    // collect all associated tables within financial instrument table
    const tables = document.getElementById(tableID).getElementsByClassName("financialInstrumentTableItems");
    const financialInstrumentHeader = document.getElementById(headerID); // find header based on id
    const isActive = button.classList.contains("active"); // check if button is active
    let inactiveFlag = false; // flag to check if all buttons are inactive

    // collect all graphs within graph box
    const graphs = document.getElementById(graphBoxID).getElementsByClassName("financialInstrumentGraph");

    /***** check if any buttons inactive *****/

    // loop through every table to check if inactive
    for (let i = 0; i < tables.length; i++) { // loop through all table items

        if (tables[i].classList.contains("active")) { // if button active...

            inactiveFlag = false; // set flag to false

        } else { // if any button inactive...

            inactiveFlag = true; // set flag to true

            break; // break loop as flag has been thrown
        }
    }

    /***** remove active state for table items *****/

    for (let i = 0; i < tables.length; i++) { // loop through all table items

        tables[i].classList.remove("active"); // remove active state from all table items
    }

    /***** selected button inactive and wanting to isolate trace *****/

    if (!isActive) { // if clicked button inactive...

        for (let i = 0; i < tables.length; i++) { // loop through all table items

            tables[i].classList.remove("active"); // remove active state from all table items
        }

        hideTraces(graphs, traceNameList, traceName); // hide all traces except selected financial instrument

        window.scrollTo({ // scroll to header with offset

            top: financialInstrumentHeader.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT,
            behavior: 'smooth'
        });
    }

    /***** all but one button inactive and wanting to show all traces *****/

    else if (isActive && inactiveFlag) { // if clicked button active...

        for (let i = 0; i < tables.length; i++) { // loop through all table items

            tables[i].classList.add("active"); // add active state to all table items
        }

        showTraces(graphs); // show all traces
    }

    /***** all buttons are active and wanting to isolate trace *****/

    else if (isActive && !inactiveFlag) { // if clicked button active and all other buttons active...

        document.getElementById(tableItemID).classList.add("active"); // add active state to clicked table item

        hideTraces(graphs, traceNameList, traceName); // hide all traces except selected financial instrument

        window.scrollTo({ // scroll to header with offset

            top: financialInstrumentHeader.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT,
            behavior: 'smooth'
        });
    }

    /***** always make clicked button active *****/

    button.classList.add("active"); // add active state to clicked button
}