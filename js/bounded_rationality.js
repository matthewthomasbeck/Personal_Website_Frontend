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


/********** IMPORT JSON DATA FUNCTION **********/

async function fetchEconomicData(metricName) { // function to fetch economic data from JSON files

    /***** set variables *****/

    // set base URL to S3 bucket
    const baseCDNURL = `https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/data/bounded_rationality/`;

    let metricDataPath = `${baseCDNURL}${metricName}Data.json`; // set path to json data with metric name

    /***** read data *****/

    try { // attempt to read json data...

        const response = await fetch(metricDataPath); // fetch data from json file

        if (!response.ok) { // if response is not ok...

            throw new Error('Network response was not ok.\n'); // print failure statement
        }

        const metricData = await response.json(); // parse json data

        return metricData; // return json data
    }

    catch (error) { // if unable to fetch json...

        console.error(`Error retrieving the json file: "${error}"\n`); // print failure statement

        return null; // terminate process with error
    }
}





/*****************************************************************/
/*************** bounded_rationality.js JAVASCRIPT ***************/
/*****************************************************************/


/********** SET DYNAMIC GRID LAYOUTS **********/

function setDynamicGridLayout() {
    
    // Get all category content boxes
    const categoryContentBoxes = document.querySelectorAll('.categoryContentBoxes');
    
    categoryContentBoxes.forEach(contentBox => {
        
        // Count the number of metric boxes within this content box
        const metricBoxes = contentBox.querySelectorAll('.personalFinanceBoxes, .careerSecurityBoxes, .macroeconomicHealthBoxes, .growthOpportunityBoxes');
        
        // Set the grid template rows dynamically
        if (metricBoxes.length > 0) {
            const gridTemplate = `repeat(${metricBoxes.length}, 1fr)`;
            contentBox.style.gridTemplateRows = gridTemplate;
            
            console.log(`Set grid layout for category: ${metricBoxes.length} equal rows`);
        }
    });
    
    // Calculate content box heights after grid layout is set
    calculateContentBoxHeights();
    
    // Calculate map content box height
    calculateMapContentBoxHeight();
    
    // Create charts after all heights are calculated
    createAllCharts();
    
    // Create world map after map content box height is calculated
    createWorldMap();
}


/********** CALCULATE CONTENT BOX HEIGHTS **********/

function calculateContentBoxHeights() {
    
    // Get all metric boxes
    const metricBoxes = document.querySelectorAll('.categoryMetricBoxes');
    
    metricBoxes.forEach(metricBox => {
        
        // Get the title box and content box within this metric box
        const titleBox = metricBox.querySelector('.categoryMetricTitleBoxes');
        const contentBox = metricBox.querySelector('.categoryMetricContentBoxes');
        
        if (titleBox && contentBox) {
            
            // Get the computed styles to account for margins and padding
            const metricBoxStyle = window.getComputedStyle(metricBox);
            const titleBoxStyle = window.getComputedStyle(titleBox);
            
            // Calculate the raw height of the metric box (excluding margin/padding)
            const metricBoxHeight = metricBox.offsetHeight;
            const metricBoxPaddingTop = parseFloat(metricBoxStyle.paddingTop) || 0;
            const metricBoxPaddingBottom = parseFloat(metricBoxStyle.paddingBottom) || 0;
            const metricBoxBorderTop = parseFloat(metricBoxStyle.borderTopWidth) || 0;
            const metricBoxBorderBottom = parseFloat(metricBoxStyle.borderBottomWidth) || 0;
            
            const metricBoxInnerHeight = metricBoxHeight - metricBoxPaddingTop - metricBoxPaddingBottom - metricBoxBorderTop - metricBoxBorderBottom;
            
            // Calculate the full height of the title box (including margin/padding)
            const titleBoxHeight = titleBox.offsetHeight;
            const titleBoxMarginTop = parseFloat(titleBoxStyle.marginTop) || 0;
            const titleBoxMarginBottom = parseFloat(titleBoxStyle.marginBottom) || 0;
            const titleBoxPaddingTop = parseFloat(titleBoxStyle.paddingTop) || 0;
            const titleBoxPaddingBottom = parseFloat(titleBoxStyle.paddingBottom) || 0;
            const titleBoxBorderTop = parseFloat(titleBoxStyle.borderTopWidth) || 0;
            const titleBoxBorderBottom = parseFloat(titleBoxStyle.borderBottomWidth) || 0;
            
            const titleBoxFullHeight = titleBoxHeight + titleBoxMarginTop + titleBoxMarginBottom + titleBoxPaddingTop + titleBoxPaddingBottom + titleBoxBorderTop + titleBoxBorderBottom;
            
            // Calculate the content box height
            const contentBoxHeight = metricBoxInnerHeight - titleBoxFullHeight;
            
            // Set the content box height
            if (contentBoxHeight > 0) {
                contentBox.style.height = `${contentBoxHeight}px`;
                console.log(`Set content box height: ${contentBoxHeight}px (metric: ${metricBoxInnerHeight}px - title: ${titleBoxFullHeight}px)`);
            } else {
                console.warn(`Content box height would be negative or zero: ${contentBoxHeight}px`);
            }
        }
    });
}

/********** CALCULATE MAP CONTENT BOX HEIGHT **********/

function calculateMapContentBoxHeight() {
    
    // Get the map box, title box, and content box
    const mapBox = document.getElementById('mapBox');
    const mapTitleBox = document.getElementById('mapTitleBox');
    const mapContentBox = document.getElementById('mapContentBox');
    
    console.log('Map elements found:', {
        mapBox: !!mapBox,
        mapTitleBox: !!mapTitleBox,
        mapContentBox: !!mapContentBox
    });
    
    if (mapBox && mapTitleBox && mapContentBox) {
        
        // Get the computed styles to account for margins and padding
        const mapBoxStyle = window.getComputedStyle(mapBox);
        const mapTitleBoxStyle = window.getComputedStyle(mapTitleBox);
        
        // Calculate the raw height of the map box (excluding margin/padding)
        const mapBoxHeight = mapBox.offsetHeight;
        const mapBoxPaddingTop = parseFloat(mapBoxStyle.paddingTop) || 0;
        const mapBoxPaddingBottom = parseFloat(mapBoxStyle.paddingBottom) || 0;
        const mapBoxBorderTop = parseFloat(mapBoxStyle.borderTopWidth) || 0;
        const mapBoxBorderBottom = parseFloat(mapBoxStyle.borderBottomWidth) || 0;
        
        const mapBoxInnerHeight = mapBoxHeight - mapBoxPaddingTop - mapBoxPaddingBottom - mapBoxBorderTop - mapBoxBorderBottom;
        
        // Calculate the full height of the title box (including margin/padding)
        const mapTitleBoxHeight = mapTitleBox.offsetHeight;
        const mapTitleBoxMarginTop = parseFloat(mapTitleBoxStyle.marginTop) || 0;
        const mapTitleBoxMarginBottom = parseFloat(mapTitleBoxStyle.marginBottom) || 0;
        const mapTitleBoxPaddingTop = parseFloat(mapTitleBoxStyle.paddingTop) || 0;
        const mapTitleBoxPaddingBottom = parseFloat(mapTitleBoxStyle.paddingBottom) || 0;
        const mapTitleBoxBorderTop = parseFloat(mapTitleBoxStyle.borderTopWidth) || 0;
        const mapTitleBoxBorderBottom = parseFloat(mapTitleBoxStyle.borderBottomWidth) || 0;
        
        const mapTitleBoxFullHeight = mapTitleBoxHeight + mapTitleBoxMarginTop + mapTitleBoxMarginBottom + mapTitleBoxPaddingTop + mapTitleBoxPaddingBottom + mapTitleBoxBorderTop + mapTitleBoxBorderBottom;
        
        // Calculate the content box height
        const mapContentBoxHeight = mapBoxInnerHeight - mapTitleBoxFullHeight;
        
        console.log('Map height calculations:', {
            mapBoxHeight,
            mapBoxInnerHeight,
            mapTitleBoxHeight,
            mapTitleBoxFullHeight,
            calculatedContentBoxHeight: mapContentBoxHeight
        });
        
        // Set the content box height
        if (mapContentBoxHeight > 0) {
            mapContentBox.style.height = `${mapContentBoxHeight}px`;
            mapContentBox.style.position = 'relative'; // Ensure proper positioning
            mapContentBox.style.overflow = 'hidden'; // Prevent scrollbars
            console.log(`Set map content box height: ${mapContentBoxHeight}px (map: ${mapBoxInnerHeight}px - title: ${mapTitleBoxFullHeight}px)`);
        } else {
            console.warn(`Map content box height would be negative or zero: ${mapContentBoxHeight}px`);
            // Set a fallback height
            mapContentBox.style.height = '300px';
            mapContentBox.style.position = 'relative';
            mapContentBox.style.overflow = 'hidden';
            console.log('Set fallback height of 300px');
        }
    } else {
        console.error('Could not find map elements for height calculation');
    }
}

/********** CREATE CHARTS **********/

// Mapping of metric IDs to their data files
const metricDataMapping = {
    'salariesHeader': 'salaries',
    'taxesHeader': 'taxes',
    'rentHeader': 'rent',
    'costOfLivingHeader': 'costOfLiving',
    'jobDemandHeader': 'jobDemand',
    'layoffsHeader': 'layoffs',
    'underemploymentHeader': 'underemployment',
    'timeUnemployedHeader': 'timeUnemployed',
    'realGDPGrowthHeader': 'realGDPGrowth',
    'realGDPPerCapitaHeader': 'realGDPPerCapita',
    'housingStartsHeader': 'housingStarts',
    'consumerPriceIndexHeader': 'consumerPriceIndex',
    'techJobDensityHeader': 'techJobDensity',
    'salaryGrowthRateHeader': 'salaryGrowthRate',
    'sweAdjacentGrowthHeader': 'sweAdjacentGrowth',
    'allFieldsGrowthHeader': 'allFieldsGrowth'
};

async function createAllCharts() {
    console.log('Creating charts for all metrics...');
    
    // Get all metric content boxes
    const metricContentBoxes = document.querySelectorAll('.categoryMetricContentBoxes');
    loadingState.totalCharts = metricContentBoxes.length;
    loadingState.chartsLoaded = 0;
    
    console.log(`Total charts to create: ${loadingState.totalCharts}`);
    
    for (const contentBox of metricContentBoxes) {
        // Find the corresponding metric header to get the metric ID
        const metricBox = contentBox.closest('.categoryMetricBoxes');
        const header = metricBox.querySelector('.categoryMetricHeaders');
        
        if (header && header.id) {
            const metricId = header.id;
            const dataFileName = metricDataMapping[metricId];
            
            if (dataFileName) {
                await createChartForMetric(contentBox, dataFileName, metricId);
            } else {
                console.warn(`No data mapping found for metric: ${metricId}`);
            }
        }
    }
}

async function createChartForMetric(contentBox, dataFileName, metricId) {
    try {
        // Fetch the data
        const data = await fetchEconomicData(dataFileName);
        
        if (!data) {
            console.error(`Failed to fetch data for ${dataFileName}`);
            return;
        }
        
        // Create div element for Plotly
        const plotDiv = document.createElement('div');
        plotDiv.id = `plot-${metricId}`;
        plotDiv.style.width = '100%';
        plotDiv.style.height = '100%';
        
        // Clear any existing content and add plot div
        contentBox.innerHTML = '';
        contentBox.appendChild(plotDiv);
        
        // Get the computed dimensions of the content box
        const contentBoxStyle = window.getComputedStyle(contentBox);
        const width = contentBox.offsetWidth;
        const height = contentBox.offsetHeight;
        
        console.log(`Creating Plotly chart for ${metricId}: ${width}x${height}px`);
        
        // Prepare Plotly data
        const plotData = preparePlotlyData(data);
        
        // Create the Plotly chart
        Plotly.newPlot(plotDiv, plotData.traces, plotData.layout, {
            responsive: true,
            displayModeBar: false
        });
        
        // Store the current visibility state
        let currentVisibility = new Array(plotData.traces.length).fill(true);
        
        // Add click functionality to toggle traces
        plotDiv.on('plotly_click', function(data) {
            const clickedTraceIndex = data.points[0].curveNumber;
            const clickedTrace = plotData.traces[clickedTraceIndex];
            
            if (clickedTrace) {
                // Determine if this is a timeSeries or prediction trace
                const isPrediction = clickedTrace.name.includes('(Prediction)');
                const baseName = isPrediction ? clickedTrace.name.replace(' (Prediction)', '') : clickedTrace.name;
                
                // Check if we're currently showing only this trace and its counterpart
                const visibleTraces = plotData.traces.filter((trace, index) => currentVisibility[index]);
                const isCurrentlyFocused = visibleTraces.length <= 2 && 
                    visibleTraces.every(trace => 
                        trace === clickedTrace || 
                        (isPrediction && trace.name === baseName) ||
                        (!isPrediction && trace.name === baseName + ' (Prediction)')
                    );
                
                if (isCurrentlyFocused) {
                    // If currently focused, show all traces
                    currentVisibility = new Array(plotData.traces.length).fill(true);
                } else {
                    // If not focused, show only the clicked trace and its counterpart
                    currentVisibility = plotData.traces.map(trace => {
                        if (trace === clickedTrace) return true;
                        if (isPrediction && trace.name === baseName) return true;
                        if (!isPrediction && trace.name === baseName + ' (Prediction)') return true;
                        return false;
                    });
                }
                
                // Always keep the vertical line visible (it should be the last trace)
                if (currentVisibility.length > 0) {
                    currentVisibility[currentVisibility.length - 1] = true;
                }
                
                // Update the plot
                Plotly.restyle(plotDiv, {visible: currentVisibility});
                
                // Update annotations based on visibility
                updateAnnotations(plotDiv, plotData, currentVisibility);
            }
        });
        
        console.log(`Plotly chart created successfully for ${metricId}`);
        
        // Track chart loading progress
        loadingState.chartsLoaded++;
        console.log(`Charts loaded: ${loadingState.chartsLoaded}/${loadingState.totalCharts}`);
        checkAllContentLoaded();
        
    } catch (error) {
        console.error(`Error creating Plotly chart for ${metricId}:`, error);
        // Still count as loaded to prevent infinite loading
        loadingState.chartsLoaded++;
        checkAllContentLoaded();
    }
}

function preparePlotlyData(data) {
    // Generate colors dynamically based on number of time series using 4-color gradient
    const generateColors = (numColors) => {
        const colorStops = ['#fcf6bd', '#d0f4de', '#bde0fe', '#dec0f1']; // yellow->green->blue->purple
        
        // Parse hex colors to RGB integers
        const rgbStops = colorStops.map(color => ({
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16)
        }));
        
        const colors = [];
        
        for (let i = 0; i < numColors; i++) {
            const ratio = numColors === 1 ? 0 : i / (numColors - 1);
            
            // Determine which color stops to interpolate between
            const scaledRatio = ratio * (rgbStops.length - 1);
            const stopIndex = Math.floor(scaledRatio);
            const localRatio = scaledRatio - stopIndex;
            
            let r, g, b;
            
            if (stopIndex >= rgbStops.length - 1) {
                // Use the last color
                r = rgbStops[rgbStops.length - 1].r;
                g = rgbStops[rgbStops.length - 1].g;
                b = rgbStops[rgbStops.length - 1].b;
            } else {
                // Interpolate between two adjacent stops
                const currentStop = rgbStops[stopIndex];
                const nextStop = rgbStops[stopIndex + 1];
                
                r = Math.round(currentStop.r + (nextStop.r - currentStop.r) * localRatio);
                g = Math.round(currentStop.g + (nextStop.g - currentStop.g) * localRatio);
                b = Math.round(currentStop.b + (nextStop.b - currentStop.b) * localRatio);
            }
            
            // Convert back to hex strings
            const rHex = r.toString(16).padStart(2, '0');
            const gHex = g.toString(16).padStart(2, '0');
            const bHex = b.toString(16).padStart(2, '0');
            
            colors.push(`#${rHex}${gHex}${bHex}`);
        }
        
        return colors;
    };
    
    const colors = generateColors(data.timeSeries.length);
    const traces = [];
    const annotations = [];
    
    // Find the latest date in timeSeries
    let latestDate = null;
    data.timeSeries.forEach(series => {
        series.data.forEach(point => {
            if (!latestDate || point.x > latestDate) {
                latestDate = point.x;
            }
        });
    });
    
    // Create traces for timeSeries data
    data.timeSeries.forEach((series, index) => {
        const xValues = series.data.map(point => point.x);
        const yValues = series.data.map(point => point.y);
        
        // Find the index of the latest date for this series
        const latestIndex = series.data.findIndex(point => point.x === latestDate);
        
        // Create marker arrays - no markers except for the final datapoint
        const markerSizes = new Array(series.data.length).fill(0);
        const markerColors = new Array(series.data.length).fill(colors[index]);
        
        if (latestIndex !== -1) {
            markerSizes[latestIndex] = 8; // Filled marker for final datapoint
        }
        
        // Add timeSeries trace
        traces.push({
            x: xValues,
            y: yValues,
            mode: 'lines+markers',
            name: series.name,
            line: {
                color: colors[index],
                width: 2,
                opacity: 1
            },
            marker: {
                size: markerSizes,
                color: markerColors,
                opacity: 1,
                line: {
                    width: 0
                }
            },
            showlegend: false,
            hovertemplate: `<b>%{fullData.name}</b><br>%{y}<extra></extra>`
        });
        
        // Add annotation for final datapoint if hasPredictions is False
        if (data.hasPredictions === "False" && latestIndex !== -1) {
            annotations.push({
                x: xValues[latestIndex],
                y: yValues[latestIndex],
                text: series.name,
                showarrow: false,
                xshift: 20,
                font: {
                    color: colors[index],
                    size: 9
                }
            });
        }
    });
    
    // Add predictions traces if hasPredictions is True
    if (data.hasPredictions === "True" && data.predictions) {
        data.predictions.forEach((prediction, index) => {
            const xValues = prediction.data.map(point => point.x);
            const yValues = prediction.data.map(point => point.y);
            
            // Only last 3 prediction points have filled markers
            const markerSizes = new Array(prediction.data.length).fill(0);
            const markerColors = new Array(prediction.data.length).fill(colors[index]);
            
            // Set markers for last 3 points
            const lastThreeStart = Math.max(0, prediction.data.length - 3);
            for (let i = lastThreeStart; i < prediction.data.length; i++) {
                markerSizes[i] = 8;
            }
            
            // Add prediction trace
            traces.push({
                x: xValues,
                y: yValues,
                mode: 'lines+markers',
                name: prediction.name + ' (Prediction)',
                line: {
                    color: colors[index],
                    width: 2,
                    dash: 'dot',
                    opacity: 1
                },
                marker: {
                    size: markerSizes,
                    color: markerColors,
                    opacity: 1,
                    line: {
                        width: 0
                    }
                },
                showlegend: false,
                hovertemplate: `<b>%{fullData.name}</b><br>%{y}<extra></extra>`
            });
            
            // Add annotation for final prediction datapoint
            if (prediction.data.length > 0) {
                const lastIndex = prediction.data.length - 1;
                annotations.push({
                    x: xValues[lastIndex],
                    y: yValues[lastIndex],
                    text: prediction.name,
                    showarrow: false,
                    xshift: 20,
                    font: {
                        color: colors[index],
                        size: 9
                    }
                });
            }
        });
    }
    
    // Find the min and max y values across all data to set vertical line range
    let minY = Infinity;
    let maxY = -Infinity;
    
    data.timeSeries.forEach(series => {
        series.data.forEach(point => {
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        });
    });
    
    if (data.hasPredictions === "True" && data.predictions) {
        data.predictions.forEach(prediction => {
            prediction.data.forEach(point => {
                if (point.y < minY) minY = point.y;
                if (point.y > maxY) maxY = point.y;
            });
        });
    }
    
    // Add some padding to the vertical line range
    const yRange = maxY - minY;
    const padding = yRange * 0.1;
    const lineMinY = minY - padding;
    const lineMaxY = maxY + padding;
    
    // Add vertical line at latest date
    traces.push({
        x: [latestDate, latestDate],
        y: [lineMinY, lineMaxY],
        mode: 'lines',
        line: {
            color: 'white',
            width: 2,
            dash: 'dash'
        },
        showlegend: false,
        hoverinfo: 'skip'
    });
    
    // Add "Latest Date" annotation above the vertical line
    annotations.push({
        x: latestDate,
        y: 1,
        text: 'Latest Date',
        showarrow: false,
        yshift: 20,
        font: {
            color: 'white',
            size: 9
        },
        yref: 'paper' // Position relative to plot area
    });
    
    // Create layout
    const layout = {
        // No title
        xaxis: {
            title: {
                text: data.xAxis.label,
                font: {
                    color: 'white',
                    size: 9
                }
            },
            tickfont: {
                color: 'white',
                size: 7
            },
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zerolinecolor: 'rgba(255, 255, 255, 0.1)'
        },
        yaxis: {
            title: {
                text: data.yAxis.label,
                font: {
                    color: 'white',
                    size: 9
                }
            },
            tickfont: {
                color: 'white',
                size: 7
            },
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zerolinecolor: 'rgba(255, 255, 255, 0.1)',
            tickformat: data.yAxis.format === 'currency' ? '$,.0f' : undefined
        },
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        font: {
            color: 'white'
        },
        annotations: annotations,
        showlegend: false, // Remove legend entirely
        hovermode: 'closest', // Only show hover for the closest point
        hoverlabel: {
            bordercolor: 'transparent',
            font: {
                color: '#212529',
                size: 9
            }
        },
        margin: {
            t: 20,
            b: 40,
            l: 60,
            r: 60
        }
    };
    
    return {
        traces: traces,
        layout: layout,
        originalAnnotations: annotations // Store original annotations for reference
    };
}


function updateAnnotations(plotDiv, plotData, visibility) {
    // Create new annotations array based on visibility
    const newAnnotations = [];
    
    // Add "Latest Date" annotation (always visible)
    const latestDateAnnotation = plotData.originalAnnotations.find(ann => ann.text === 'Latest Date');
    if (latestDateAnnotation) {
        newAnnotations.push(latestDateAnnotation);
    }
    
    // Add trace labels only for visible traces
    plotData.traces.forEach((trace, index) => {
        if (visibility[index] && !trace.name.includes('(Prediction)') && trace.name !== 'Latest Date') {
            // Find the corresponding annotation in the original data
            const originalAnnotation = plotData.originalAnnotations.find(ann => 
                ann.text === trace.name && ann.showarrow === false
            );
            
            if (originalAnnotation) {
                newAnnotations.push(originalAnnotation);
            }
        }
    });
    
    // Update the plot with new annotations
    Plotly.relayout(plotDiv, {annotations: newAnnotations});
}

function resizeAllPlotlyCharts() {
    // Get all plotly chart divs
    const plotDivs = document.querySelectorAll('[id^="plot-"]');
    
    plotDivs.forEach(plotDiv => {
        if (plotDiv._fullLayout) {
            // Resize the plot
            Plotly.Plots.resize(plotDiv);
        }
    });
}


/********** LOADING SCREEN MANAGEMENT **********/

// Loading state tracking
let loadingState = {
    chartsLoaded: 0,
    totalCharts: 0,
    mapLoaded: false,
    allContentLoaded: false
};

// Function to check if all content is loaded
function checkAllContentLoaded() {
    if (loadingState.chartsLoaded >= loadingState.totalCharts && loadingState.mapLoaded && !loadingState.allContentLoaded) {
        loadingState.allContentLoaded = true;
        hideLoadingScreen();
    }
}

// Function to hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        console.log('Loading screen hidden - all content loaded');
        
        // Trigger navbar name animation after loading screen is hidden
        if (typeof loadNavBarName === 'function') {
            loadNavBarName();
        }
    }
}

// Function to show loading screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'block';
        console.log('Loading screen shown');
    }
}

/********** CREATE WORLD MAP WITH D3.JS **********/

let worldMap = null; // Global variable to store the D3 map instance
let worldData = null; // Global variable to store the world topology data

// Global variable to store country name mapping
let countryNameMapping = {};

/********** LOAD COUNTRY MAPPING FUNCTION **********/

async function loadCountryMapping() { // function to load country name mapping from text file

    /***** set variables *****/

    // set base URL to S3 bucket
    const baseCDNURL = `https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/data/bounded_rationality/`;

    // set path to country mapping file
    let countryMappingPath = `${baseCDNURL}country_mapping.txt`;

    /***** read data *****/

    try { // attempt to read country mapping data...

        const response = await fetch(countryMappingPath); // fetch data from text file

        if (!response.ok) { // if response is not ok...

            throw new Error('Network response was not ok.\n'); // print failure statement
        }

        const mappingText = await response.text(); // parse text data

        // Parse the text file into a mapping object
        const lines = mappingText.split('\n');
        countryNameMapping = {};
        
        lines.forEach(line => {
            if (line.trim()) { // skip empty lines
                const [key, value] = line.split(':');
                if (key && value) {
                    countryNameMapping[key.trim()] = value.trim();
                }
            }
        });

        return countryNameMapping; // return mapping object
    }

    catch (error) { // if unable to fetch country mapping...

        console.error(`Error retrieving the country mapping file: "${error}"\n`); // print failure statement

        return null; // terminate process with error
    }
}

// Enhanced color generation function for country coloring
function generateCountryColors(values) {
    const colorStops = ['#fcf6bd', '#d0f4de', '#bde0fe', '#dec0f1']; // yellow->green->blue->purple
    
    // Parse hex colors to RGB integers
    const rgbStops = colorStops.map(color => ({
        r: parseInt(color.slice(1, 3), 16),
        g: parseInt(color.slice(3, 5), 16),
        b: parseInt(color.slice(5, 7), 16)
    }));
    
    // Find min and max values (excluding null/undefined)
    const validValues = values.filter(v => v !== null && v !== undefined && !isNaN(v));
    if (validValues.length === 0) return {};
    
    const minValue = Math.min(...validValues);
    const maxValue = Math.max(...validValues);
    
    const colorMap = {};
    
    values.forEach((value, index) => {
        if (value === null || value === undefined || isNaN(value)) {
            // Use secondary color for no data
            colorMap[index] = '#343a40';
        } else {
            // Normalize value between 0 and 1
            const normalizedValue = (value - minValue) / (maxValue - minValue);
            
            // Determine which color stops to interpolate between
            const scaledRatio = normalizedValue * (rgbStops.length - 1);
            const stopIndex = Math.floor(scaledRatio);
            const localRatio = scaledRatio - stopIndex;
            
            let r, g, b;
            
            if (stopIndex >= rgbStops.length - 1) {
                // Use the last color
                r = rgbStops[rgbStops.length - 1].r;
                g = rgbStops[rgbStops.length - 1].g;
                b = rgbStops[rgbStops.length - 1].b;
            } else {
                // Interpolate between two adjacent stops
                const currentStop = rgbStops[stopIndex];
                const nextStop = rgbStops[stopIndex + 1];
                
                r = Math.round(currentStop.r + (nextStop.r - currentStop.r) * localRatio);
                g = Math.round(currentStop.g + (nextStop.g - currentStop.g) * localRatio);
                b = Math.round(currentStop.b + (nextStop.b - currentStop.b) * localRatio);
            }
            
            // Convert back to hex strings
            const rHex = r.toString(16).padStart(2, '0');
            const gHex = g.toString(16).padStart(2, '0');
            const bHex = b.toString(16).padStart(2, '0');
            
            colorMap[index] = `#${rHex}${gHex}${bHex}`;
        }
    });
    
    return colorMap;
}

/********** EXTRACT COUNTRY NAME FUNCTION **********/

function extractCountryName(seriesName) { // function to extract country name from data series name

    /***** set variables *****/

    // Remove common prefixes and suffixes
    let cleanName = seriesName
        .replace(/^(RGDP Growth|GDP Growth|Real GDP Growth|GDP Per Capita|Salary Growth|Tech Job Density|Cost of Living|Rent|Tax|Job Demand|Layoffs|Underemployment|Time Unemployed|Housing Starts|Consumer Price Index|SWE Adjacent Growth|All Fields Growth)\s+/i, '')
        .replace(/\s+(Growth|Rate|Index|Density|Demand|Starts|Unemployed)$/i, '')
        .trim();

    /***** check country name mapping *****/

    // Check if it's a known country name
    if (Object.keys(countryNameMapping).includes(cleanName) || 
        Object.values(countryNameMapping).includes(cleanName)) {

        return cleanName; // return clean name
    }
    
    // Check if it matches any country name in our mapping (case insensitive)
    const lowerCleanName = cleanName.toLowerCase();
    for (const [key, value] of Object.entries(countryNameMapping)) {

        if (key.toLowerCase() === lowerCleanName || value.toLowerCase() === lowerCleanName) {

            return value; // return the standardized name
        }
    }
    
    return cleanName; // return as-is if no mapping found
}

/********** ANALYZE ECONOMIC DATA FUNCTION **********/

function analyzeEconomicData(data) { // function to analyze economic data and determine coloring strategy

    /***** validate data *****/

    if (!data || !data.timeSeries) { // if no data or timeSeries...

        return { isValid: false, reason: 'No timeSeries data found' }; // return invalid result
    }
    
    // Extract and check country names
    const countryNames = data.timeSeries.map(series => extractCountryName(series.name));
    const hasCountryData = countryNames.some(name => 
        Object.keys(countryNameMapping).includes(name) || 
        Object.values(countryNameMapping).includes(name) ||
        name.length > 0 // Allow any non-empty name for now
    );
    
    if (!hasCountryData) { // if no country data found...

        return { isValid: false, reason: 'No country data found in timeSeries' }; // return invalid result
    }
    
    // Determine if data is scalar vs vector
    const sampleData = data.timeSeries[0]?.data || [];
    const isScalar = sampleData.every(point => typeof point.y === 'number' && !isNaN(point.y));
    
    if (!isScalar) { // if data is not numeric...

        return { isValid: false, reason: 'Data is not numeric' }; // return invalid result
    }
    
    // Get most recent values for each country
    const latestValues = {};
    data.timeSeries.forEach(series => {

        if (series.data && series.data.length > 0) { // if series has data...

            const latestPoint = series.data[series.data.length - 1];
            const countryName = extractCountryName(series.name);
            latestValues[countryName] = latestPoint.y;
        }
    });
    
    return {
        isValid: true,
        countryNames: countryNames,
        latestValues: latestValues,
        isScalar: isScalar,
        dataType: data.yAxis?.format || 'number'
    };
}

// Function to create world map with D3.js and country coloring
async function createWorldMapWithData(dataFileName = 'realGDPGrowth') { // function to create interactive world map with economic data

    /***** set variables *****/

    // Get the map content box
    const mapContentBox = document.getElementById('mapContentBox');
    
    if (!mapContentBox) { // if map content box not found...

        console.error('Map content box not found'); // print failure statement

        return; // terminate process with error
    }
    
    // Clear any existing content
    mapContentBox.innerHTML = '';
    
    // Create SVG container for the map
    const svg = d3.select(mapContentBox)
        .append('svg')
        .attr('id', 'worldMap')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 1000 500') // Set viewBox to ensure proper scaling
        .style('background-color', '#212529') // var(--primary)
        .style('min-height', '300px'); // Ensure minimum height
    
    // Load country mapping first
    await loadCountryMapping();
    
    // Fetch economic data FIRST
    let economicData = null;
    if (dataFileName) { // if data file name provided...

        try { // attempt to fetch economic data...

            economicData = await fetchEconomicData(dataFileName); // fetch data from json file

            console.log(`Fetched economic data for ${dataFileName}:`, economicData); // print success statement
        } catch (error) { // if unable to fetch economic data...

            console.warn(`Could not fetch economic data for ${dataFileName}:`, error); // print warning statement
        }
    }
    
    // Analyze the data
    const analysis = economicData ? analyzeEconomicData(economicData) : { isValid: false, reason: 'No data provided' };
    console.log('Economic data analysis:', analysis);
    
    // Load world topology data - try different sources
    try {
        let worldTopology;
        try {
            // Try Natural Earth data with proper country names
            worldTopology = await d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
            console.log('Using Natural Earth data');
        } catch (firstError) {
            console.warn('Natural Earth failed, trying world-atlas:', firstError);
            try {
                worldTopology = await d3.json('https://unpkg.com/world-atlas@1/world/110m.json');
                console.log('Using world-atlas data');
            } catch (secondError) {
                console.warn('World-atlas failed, trying alternative:', secondError);
                worldTopology = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/world/110m.json');
                console.log('Using alternative world-atlas data');
            }
        }
        
        console.log('Loaded world topology data:', worldTopology);
        
        // Handle both GeoJSON and TopoJSON formats
        let countries;
        if (worldTopology.type === 'FeatureCollection') {
            // It's already GeoJSON
            countries = worldTopology;
            console.log('Using GeoJSON data directly');
        } else {
            // It's TopoJSON, need to convert
            console.log('Available objects:', Object.keys(worldTopology.objects));
            
            // Convert TopoJSON to GeoJSON - try different possible object names
            if (worldTopology.objects.countries) {
                countries = topojson.feature(worldTopology, worldTopology.objects.countries);
            } else if (worldTopology.objects.countries110m) {
                countries = topojson.feature(worldTopology, worldTopology.objects.countries110m);
            } else {
                // Fallback to first available object
                const firstObject = Object.keys(worldTopology.objects)[0];
                countries = topojson.feature(worldTopology, worldTopology.objects[firstObject]);
                console.log('Using fallback object:', firstObject);
            }
        }
        console.log('Converted to GeoJSON:', countries);
        
        // Debug: Check what properties are available in the first few countries
        if (countries.features && countries.features.length > 0) {
            console.log('Sample country properties:', countries.features.slice(0, 5).map(f => ({
                name: f.properties.NAME || f.properties.NAME_EN || f.properties.name || f.properties.NAME_LONG || f.properties.ADMIN || f.properties.SOVEREIGNT || f.properties.SOV_A3,
                allProps: Object.keys(f.properties),
                fullProps: f.properties
            })));
            
            // Also log the first country's properties in detail
            console.log('First country detailed properties:', countries.features[0].properties);
            console.log('First country properties keys:', Object.keys(countries.features[0].properties));
        }
        
        // Set up map projection - use viewBox dimensions for consistent scaling
        const width = 1000; // Match viewBox width
        const height = 500; // Match viewBox height
        
        console.log('Using viewBox dimensions:', { width, height });
        
        // Use fitExtent to ensure full world visibility
        const projection = d3.geoNaturalEarth1()
            .fitExtent([[0, 0], [width, height]], countries);
        
        const path = d3.geoPath().projection(projection);
        
        // Create color scale based on economic data
        let colorScale = null;
        let countryColorMap = {}; // Store country-to-color mapping for tooltips
        
        if (analysis.isValid && Object.keys(analysis.latestValues).length > 0) {
            // A. Get the number of traces/datasets (countries with data)
            const countriesWithData = Object.keys(analysis.latestValues);
            const numColors = countriesWithData.length;
            
            // B. Get latest data entry for each country
            const countryValues = Object.entries(analysis.latestValues);
            
            // C. Create list of country/value pairs and sort from least to greatest
            const sortedCountries = countryValues
                .map(([country, value]) => ({ country, value }))
                .sort((a, b) => a.value - b.value);
            
            console.log('Sorted countries by value:', sortedCountries);
            
            // D. Assign colors in order: least value = yellow, greatest = purple
            const colorStops = ['#fcf6bd', '#d0f4de', '#bde0fe', '#dec0f1']; // yellow->green->blue->purple
            
            sortedCountries.forEach((countryData, index) => {
                const ratio = numColors === 1 ? 0 : index / (numColors - 1);
                
                // Determine which color stops to interpolate between
                const scaledRatio = ratio * (colorStops.length - 1);
                const stopIndex = Math.floor(scaledRatio);
                const localRatio = scaledRatio - stopIndex;
                
                let r, g, b;
                
                if (stopIndex >= colorStops.length - 1) {
                    // Use the last color
                    const lastColor = colorStops[colorStops.length - 1];
                    r = parseInt(lastColor.slice(1, 3), 16);
                    g = parseInt(lastColor.slice(3, 5), 16);
                    b = parseInt(lastColor.slice(5, 7), 16);
                } else {
                    // Interpolate between two adjacent stops
                    const currentStop = colorStops[stopIndex];
                    const nextStop = colorStops[stopIndex + 1];
                    
                    const currentR = parseInt(currentStop.slice(1, 3), 16);
                    const currentG = parseInt(currentStop.slice(3, 5), 16);
                    const currentB = parseInt(currentStop.slice(5, 7), 16);
                    
                    const nextR = parseInt(nextStop.slice(1, 3), 16);
                    const nextG = parseInt(nextStop.slice(3, 5), 16);
                    const nextB = parseInt(nextStop.slice(5, 7), 16);
                    
                    r = Math.round(currentR + (nextR - currentR) * localRatio);
                    g = Math.round(currentG + (nextG - currentG) * localRatio);
                    b = Math.round(currentB + (nextB - currentB) * localRatio);
                }
                
                // Convert back to hex string
                const rHex = r.toString(16).padStart(2, '0');
                const gHex = g.toString(16).padStart(2, '0');
                const bHex = b.toString(16).padStart(2, '0');
                
                const color = `#${rHex}${gHex}${bHex}`;
                countryColorMap[countryData.country] = color;
                
                console.log(`Country: ${countryData.country}, Value: ${countryData.value}, Color: ${color}`);
            });
            
            console.log('Country color mapping:', countryColorMap);
        } else {
            console.log('No valid economic data for coloring:', analysis);
        }
        
        // Add ocean background
        svg.append('path')
            .datum({ type: 'Sphere' })
            .attr('class', 'ocean')
            .attr('d', path)
            .style('fill', '#212529'); // var(--primary)
        
        // Add simple zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8]) // Allow zoom from 1x to 8x
            .on('zoom', function(event) {
                // Apply zoom transform to countries group, but keep legend static
                d3.select('.countries').attr('transform', event.transform);
            });
        
        // Apply zoom to the entire SVG
        svg.call(zoom)
            .style('cursor', 'grab'); // Show grab cursor
        
        // Change cursor on zoom start/end
        svg.on('zoomstart', function() {
            svg.style('cursor', 'grabbing');
        }).on('zoomend', function() {
            svg.style('cursor', 'grab');
        });
        
        // Add countries in a zoomable group
        const countryPaths = svg.append('g')
            .attr('class', 'countries')
            .selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'country')
            .style('stroke', '#212529') // Default border color
            .style('stroke-width', 0.5)
            .style('fill', function(d) {
                // Try to match country name with our data - try all possible property names
                const possibleNames = [
                    d.properties.NAME, d.properties.NAME_EN, d.properties.name, 
                    d.properties.NAME_LONG, d.properties.ADMIN, d.properties.SOVEREIGNT, 
                    d.properties.SOV_A3, d.properties.NAME_SORT, d.properties.NAME_ALT,
                    d.properties.BRK_NAME, d.properties.BRK_A3, d.properties.BRK_GROUP,
                    d.properties.WB_A2, d.properties.WB_A3, d.properties.WOE_ID,
                    d.properties.SU_A3, d.properties.SU_DIF, d.properties.SUBUNIT,
                    d.properties.SU_A3, d.properties.BRK_NAME, d.properties.BRK_A3
                ];
                
                const countryName = possibleNames.find(name => name && name !== 'undefined' && name.trim() !== '');
                
                // If no country name, return default color
                if (!countryName) {
                    return '#343a40';
                }
                
                // Try to match with our data
                let matchedCountry = null;
                for (const [dataKey, dataValue] of Object.entries(analysis.latestValues)) {
                    const extractedName = extractCountryName(dataKey);
                    
                    if (countryName === extractedName ||
                        countryNameMapping[countryName] === extractedName ||
                        countryNameMapping[extractedName] === countryName ||
                        (countryNameMapping[countryName] && countryNameMapping[extractedName] && 
                         countryNameMapping[countryName] === countryNameMapping[extractedName])) {
                        matchedCountry = dataKey;
                        break;
                    }
                }
                
                if (matchedCountry && countryColorMap[matchedCountry]) {
                    console.log(`✅ Coloring ${countryName} with color ${countryColorMap[matchedCountry]} (from ${matchedCountry})`);
                    return countryColorMap[matchedCountry];
                } else {
                    console.log(`❌ No color found for ${countryName}`);
                    return '#343a40'; // Default color for no data
                }
            })
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                // Highlight country on hover
                d3.select(this)
                    .style('opacity', 1)
                    .style('stroke-width', 2)
                    .style('stroke', 'white'); // White border on hover
                
                // Show tooltip
                const countryName = d.properties.NAME || d.properties.NAME_EN || d.properties.name || d.properties.NAME_LONG || d.properties.ADMIN || d.properties.SOVEREIGNT || d.properties.SOV_A3;
                
                if (!countryName) {
                    return; // Skip if no country name
                }
                
                // Use the same matching logic as the fill function
                let matchedCountry = null;
                let matchedValue = null;
                
                for (const [dataKey, dataValue] of Object.entries(analysis.latestValues)) {
                    const extractedName = extractCountryName(dataKey);
                    
                    if (countryName === extractedName ||
                        countryNameMapping[countryName] === extractedName ||
                        countryNameMapping[extractedName] === countryName ||
                        (countryNameMapping[countryName] && countryNameMapping[extractedName] && 
                         countryNameMapping[countryName] === countryNameMapping[extractedName])) {
                        matchedCountry = dataKey;
                        matchedValue = dataValue;
                        break;
                    }
                }
                
                if (matchedCountry) {
                    const value = analysis.latestValues[matchedCountry];
                    const countryColor = countryColorMap[matchedCountry] || '#343a40';
                    showMapTooltip(event, countryName, value, countryColor);
                }
            })
            .on('mouseout', function(event, d) {
                // Reset country appearance
                d3.select(this)
                    .style('opacity', 0.8)
                    .style('stroke-width', 0.5)
                    .style('stroke', '#212529'); // Reset to default border color
                
                hideMapTooltip();
            });
        
        console.log('D3.js world map created successfully');
        
        // Mark map as loaded
        loadingState.mapLoaded = true;
        console.log('Map loaded successfully');
        checkAllContentLoaded();
        
        // Add legend if we have color data (outside zoomable area)
        if (Object.keys(countryColorMap).length > 0) {
            const legendWidth = 20;
            const legendHeight = 200;
            const legendX = 20; // Left side
            const legendY = height - legendHeight - 20; // Bottom aligned
            
            // Create legend group
            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${legendX}, ${legendY})`);
            
            // Create gradient definition
            const defs = svg.append('defs');
            const gradient = defs.append('linearGradient')
                .attr('id', 'colorGradient')
                .attr('x1', '0%')
                .attr('x2', '0%')
                .attr('y1', '0%')
                .attr('y2', '100%'); // Vertical gradient
            
            // Add gradient stops
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#dec0f1'); // Purple at top (high value)
            
            gradient.append('stop')
                .attr('offset', '33%')
                .attr('stop-color', '#bde0fe'); // Blue
            
            gradient.append('stop')
                .attr('offset', '66%')
                .attr('stop-color', '#d0f4de'); // Green
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#fcf6bd'); // Yellow at bottom (low value)
            
            // Create legend rectangle with gradient
            legend.append('rect')
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .attr('fill', 'url(#colorGradient)')
                .attr('stroke', '#212529')
                .attr('stroke-width', 1);
            
            // Add labels
            legend.append('text')
                .attr('x', legendWidth + 10)
                .attr('y', 15)
                .attr('text-anchor', 'start')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .text('High Value');
            
            legend.append('text')
                .attr('x', legendWidth + 10)
                .attr('y', legendHeight - 5)
                .attr('text-anchor', 'start')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .text('Low Value');
            
            console.log('Vertical legend added to map');
        }
        
    } catch (error) {
        console.error('Error loading world topology data:', error);
        
        // Fallback: create a simple placeholder
        svg.append('text')
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .text('World Map Loading...');
    }
}

// Function to show map tooltip
function showMapTooltip(event, countryName, value, countryColor) {
    const tooltip = d3.select('body').selectAll('.map-tooltip')
        .data([1])
        .enter()
        .append('div')
        .attr('class', 'map-tooltip')
        .style('position', 'absolute')
        .style('background-color', countryColor) // Use country color as background
        .style('border', '2px solid white') // Add white border
        .style('border-radius', '0px') // Remove rounded edges
        .style('padding', '10px')
        .style('color', '#212529') // Dark text
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .style('opacity', 0);
    
    tooltip.html(`
                <div style="text-align: center;">
            <strong>${countryName}</strong><br>
            ${value}
                </div>
            `);
    
    tooltip.transition()
        .duration(200)
        .style('opacity', 1);
    
    tooltip.style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
}

// Function to hide map tooltip
function hideMapTooltip() {
    d3.selectAll('.map-tooltip').remove();
}

// Legacy function for backward compatibility
function createWorldMap() {
    createWorldMapWithData('realGDPGrowth');
}

// Function to recreate the map (useful for resizing)
function recreateWorldMap() {
    if (worldMap) {
        // Clear the SVG content
        d3.select('#worldMap').remove();
        worldMap = null;
    }
    createWorldMapWithData('realGDPGrowth');
}

// Function to update map with different economic data
function updateMapWithData(dataFileName) {
    if (worldMap) {
        // Clear the SVG content
        d3.select('#worldMap').remove();
        worldMap = null;
    }
    createWorldMapWithData(dataFileName);
}


/********** TOGGLE MAP BUTTON **********/

const mapToggleButton = document.getElementById('mapToggleButton'); // find map toggle button
const mapToggleArrowRight = document.getElementById('mapToggleArrowRight'); // find map toggle arrow
const mapToggleArrowLeft = document.getElementById('mapToggleArrowLeft'); // find map toggle arrow
const mapBox = document.getElementById('mapBox'); // find map box

mapToggleButton.addEventListener('click', function() {

    /***** make map slide in/out using margin-right like navbar *****/

    if (mapBox.style.marginRight === '0px' || mapBox.style.marginRight === '') { // hide map
        mapToggleArrowRight.style.display = 'none';
        mapToggleArrowLeft.style.display = 'block';
        mapToggleButton.style.right = '0vw'; // move button to right edge of screen
        mapBox.style.marginRight = 'calc(-65% - 3px)'; // slide map off screen to the right

    } else { // show map
        mapToggleArrowRight.style.display = 'block';
        mapToggleArrowLeft.style.display = 'none';
        mapToggleButton.style.right = 'calc(65% + 3px)'; // move button to right edge of map
        mapBox.style.marginRight = '0px'; // slide map back into view
        
        // Recreate the map when showing it to ensure proper sizing
        setTimeout(() => {
            recreateWorldMap();
        }, 300); // Wait for the slide animation to complete
    }
});


/********** HOVER INFO **********/

// Create hover info div
const hoverInfoDiv = document.createElement('div');
hoverInfoDiv.id = 'hoverInfoDiv';
hoverInfoDiv.className = 'programmerFont';
hoverInfoDiv.style.cssText = `
    position: fixed;
    background-color: var(--primary);
    border: 3px solid var(--secondary);
    padding: 15px;
    color: white;
    font-family: var(--programmerFont);
    font-size: 14px;
    max-width: 300px;
    z-index: 1000;
    display: none;
    pointer-events: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
`;
document.body.appendChild(hoverInfoDiv);

// Dynamic hover info system - fetches descriptions from JSON data
async function getMetricDescription(metricId) {
    // Map metric IDs to their data files
    const metricDataMapping = {
        'salariesHeader': 'salaries',
        'taxesHeader': 'taxes',
        'rentHeader': 'rent',
        'costOfLivingHeader': 'costOfLiving',
        'jobDemandHeader': 'jobDemand',
        'layoffsHeader': 'layoffs',
        'underemploymentHeader': 'underemployment',
        'timeUnemployedHeader': 'timeUnemployed',
        'realGDPGrowthHeader': 'realGDPGrowth',
        'realGDPPerCapitaHeader': 'realGDPPerCapita',
        'housingStartsHeader': 'housingStarts',
        'consumerPriceIndexHeader': 'consumerPriceIndex',
        'techJobDensityHeader': 'techJobDensity',
        'salaryGrowthRateHeader': 'salaryGrowthRate',
        'sweAdjacentGrowthHeader': 'sweAdjacentGrowth',
        'allFieldsGrowthHeader': 'allFieldsGrowth'
    };
    
    // Category descriptions (for when JSON doesn't exist yet)
    const categoryDescriptions = {
        'personalFinanceHeader': 'Personal Finance metrics track individual financial health including income, expenses, and cost of living',
    'careerSecurityHeader': 'Career Security metrics assess job market stability and employment risks',
    'macroeconomicHealthHeader': 'Macroeconomic Health indicators show broader economic conditions',
        'growthOpportunityHeader': 'Growth Opportunity metrics identify potential for career advancement'
    };
    
    // Special handling for map title - show current JSON description
    if (metricId === 'mapTitleHeader') {
        try {
            const currentMapData = await fetchEconomicData('realGDPGrowth'); // Default map data
            if (currentMapData && currentMapData.description) {
                return currentMapData.description;
            }
        } catch (error) {
            console.warn('Could not fetch map description:', error);
        }
        return 'Interactive world map showing economic data by country and region';
    }
    
    // Check if it's a category header first
    if (categoryDescriptions[metricId]) {
        return categoryDescriptions[metricId];
    }
    
    // Check if it's a metric that has JSON data
    const dataFileName = metricDataMapping[metricId];
    if (dataFileName) {
        try {
            const data = await fetchEconomicData(dataFileName);
            if (data && data.description) {
                return data.description;
            }
        } catch (error) {
            console.warn(`Could not fetch description for ${metricId}:`, error);
        }
    }
    
    // Fallback to generic description
    return 'Economic metric data visualization';
}

// Function to show hover info
async function showHoverInfo(event, elementId) {
    try {
        const info = await getMetricDescription(elementId);
        hoverInfoDiv.textContent = info;
        hoverInfoDiv.style.display = 'block';
        
        // Position the tooltip near the cursor
        const x = event.clientX + 10;
        const y = event.clientY - 30;
        
        hoverInfoDiv.style.left = x + 'px';
        hoverInfoDiv.style.top = y + 'px';
    } catch (error) {
        console.warn(`Error fetching hover info for ${elementId}:`, error);
        hoverInfoDiv.textContent = 'Economic metric data visualization';
        hoverInfoDiv.style.display = 'block';
        
        const x = event.clientX + 10;
        const y = event.clientY - 30;
        
        hoverInfoDiv.style.left = x + 'px';
        hoverInfoDiv.style.top = y + 'px';
    }
}

// Function to hide hover info
function hideHoverInfo() {
    hoverInfoDiv.style.display = 'none';
}

// Add event listeners to all h2 and h3 elements
document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('h2, h3');
    
    headers.forEach(header => {
        if (header.id) {
            header.addEventListener('mouseenter', async function(event) {
                await showHoverInfo(event, this.id);
            });
            
            header.addEventListener('mouseleave', function() {
                hideHoverInfo();
            });
            
            header.addEventListener('mousemove', function(event) {
                if (hoverInfoDiv.style.display === 'block') {
                    const x = event.clientX + 10;
                    const y = event.clientY - 30;
                    hoverInfoDiv.style.left = x + 'px';
                    hoverInfoDiv.style.top = y + 'px';
                }
            });
        }
    });
});


/********** EXIT CATEGORY **********/

// Function to resize remaining categories after one is closed
function resizeRemainingCategories() {
    const visibleCategories = document.querySelectorAll('.categoryBoxes:not([style*="display: none"])');
    const visibleCount = visibleCategories.length;
    
    if (visibleCount > 0) {
        const newWidth = `${100 / visibleCount}vw`;
        
        visibleCategories.forEach(category => {
            category.style.width = newWidth;
        });
        
        console.log(`Resized ${visibleCount} categories to ${newWidth} each`);
    }
}

// Function to handle category exit
function handleCategoryExit(event) {
    event.preventDefault();
    
    // Get the exit button that was clicked
    const exitButton = event.currentTarget;
    const exitButtonId = exitButton.id;
    
    // Map exit button IDs to their corresponding category box elements
    const categoryMappings = {
        'personalFinanceExit': () => {
            const personalFinanceCategory = document.querySelector('.categoryBoxes').nextElementSibling;
            return personalFinanceCategory.previousElementSibling; // Personal Finance category
        },
        'careerSecurityExit': () => {
            const categories = document.querySelectorAll('.categoryBoxes');
            return categories[1]; // Career Security category
        },
        'macroeconomicHealthExit': () => {
            const categories = document.querySelectorAll('.categoryBoxes');
            return categories[2]; // Macroeconomic Health category
        },
        'growthOpportunityExit': () => {
            const categories = document.querySelectorAll('.categoryBoxes');
            return categories[3]; // Growth Opportunity category
        }
    };
    
    // Find the category box to hide
    const getCategoryFunction = categoryMappings[exitButtonId];
    if (getCategoryFunction) {
        const categoryBox = getCategoryFunction();
        
        if (categoryBox) {
            // Hide the category with display: none
            categoryBox.style.display = 'none';
            
            // Resize the remaining visible categories
            resizeRemainingCategories();
            
            // Resize all Plotly charts after category resize
            setTimeout(() => {
                resizeAllPlotlyCharts();
            }, 100);
            
            console.log(`Closed category: ${exitButtonId}`);
        } else {
            console.error(`Could not find category box for: ${exitButtonId}`);
        }
    } else {
        console.error(`Unknown exit button ID: ${exitButtonId}`);
    }
}

// Add event listeners to category exit buttons
document.addEventListener('DOMContentLoaded', function() {
    const categoryExitButtons = document.querySelectorAll('a.categoryExitBoxes[id$="Exit"]');
    
    categoryExitButtons.forEach(button => {
        button.addEventListener('click', handleCategoryExit);
    });
    
    console.log(`Added exit listeners to ${categoryExitButtons.length} category exit buttons`);
});


/********** EXIT CATEGORY METRIC **********/

// Function to resize remaining metrics within a category after one is closed
function resizeRemainingMetrics(categoryContentBox) {
    const visibleMetrics = categoryContentBox.querySelectorAll('.categoryMetricBoxes:not([style*="display: none"])');
    const visibleCount = visibleMetrics.length;
    
    if (visibleCount > 0) {
        const gridTemplate = `repeat(${visibleCount}, 1fr)`;
        categoryContentBox.style.gridTemplateRows = gridTemplate;
        
        console.log(`Resized ${visibleCount} metrics in category to ${gridTemplate}`);
        
        // Recalculate content box heights after resizing
        calculateContentBoxHeights();
    }
}

// Function to handle metric exit
function handleMetricExit(event) {
    event.preventDefault();
    
    // Get the exit button that was clicked
    const exitButton = event.currentTarget;
    const exitButtonId = exitButton.id;
    
    // Find the metric box to hide (it's the parent of the parent of the exit button)
    const metricBox = exitButton.closest('.categoryMetricBoxes');
    
    if (metricBox) {
        // Hide the metric box with display: none
        metricBox.style.display = 'none';
        
        // Find the category content box (parent of the metric box)
        const categoryContentBox = metricBox.parentElement;
        
        // Resize the remaining visible metrics in this category
        resizeRemainingMetrics(categoryContentBox);
        
        // Resize all Plotly charts after metric resize
        setTimeout(() => {
            resizeAllPlotlyCharts();
        }, 100);
        
        console.log(`Closed metric: ${exitButtonId}`);
    } else {
        console.error(`Could not find metric box for: ${exitButtonId}`);
    }
}

// Add event listeners to metric exit buttons
document.addEventListener('DOMContentLoaded', function() {
    const metricExitButtons = document.querySelectorAll('a.categoryMetricExitBoxes[id$="Exit"]');
    
    metricExitButtons.forEach(button => {
        button.addEventListener('click', handleMetricExit);
    });
    
    console.log(`Added exit listeners to ${metricExitButtons.length} metric exit buttons`);
});


/********** EVENT LISTENERS **********/

document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen initially
    showLoadingScreen();
    
    // Set up the page
    setDynamicGridLayout();
});

// Loading screen check function (similar to machine learning portfolio)
function checkLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        if (getComputedStyle(loadingScreen).display !== 'none') {
            // Loading screen is still visible, check again
            setTimeout(checkLoadingScreen, 50);
        } else {
            // Loading screen is hidden, all content loaded
            console.log('All content loaded successfully');
        }
    }
}

function recalculateGridLayout() {
    setDynamicGridLayout();
}

// Function to recalculate just the map content box height
function recalculateMapContentBoxHeight() {
    calculateMapContentBoxHeight();
}
