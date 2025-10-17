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

    // set path to json data with metric name
    let metricDataPath = `${baseCDNURL}${metricName}Data.json`;

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
        
    } catch (error) {
        console.error(`Error creating Plotly chart for ${metricId}:`, error);
    }
}

function preparePlotlyData(data) {
    // Generate colors dynamically based on number of time series
    const generateColors = (numColors) => {
        const startColor = '#fcf6bd';
        const endColor = '#dec0f1';
        
        // Parse hex colors to RGB integers
        const startR = parseInt(startColor.slice(1, 3), 16);
        const startG = parseInt(startColor.slice(3, 5), 16);
        const startB = parseInt(startColor.slice(5, 7), 16);
        
        const endR = parseInt(endColor.slice(1, 3), 16);
        const endG = parseInt(endColor.slice(3, 5), 16);
        const endB = parseInt(endColor.slice(5, 7), 16);
        
        const colors = [];
        
        for (let i = 0; i < numColors; i++) {
            const ratio = numColors === 1 ? 0 : i / (numColors - 1);
            
            // Calculate interpolated RGB values
            const r = Math.round(startR + (endR - startR) * ratio);
            const g = Math.round(startG + (endG - startG) * ratio);
            const b = Math.round(startB + (endB - startB) * ratio);
            
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


/********** CREATE WORLD MAP **********/

let worldMap = null; // Global variable to store the map instance

function createWorldMap() {
    
    // Get the map content box
    const mapContentBox = document.getElementById('mapContentBox');
    
    if (!mapContentBox) {
        console.error('Map content box not found');
        return;
    }
    
    // Debug: Check the dimensions
    console.log('Map content box dimensions:', {
        offsetHeight: mapContentBox.offsetHeight,
        clientHeight: mapContentBox.clientHeight,
        scrollHeight: mapContentBox.scrollHeight,
        computedHeight: window.getComputedStyle(mapContentBox).height
    });
    
    // Clear any existing content
    mapContentBox.innerHTML = '';
    
    // Create a div for the map
    const mapDiv = document.createElement('div');
    mapDiv.id = 'worldMap';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapDiv.style.minHeight = '300px'; // Add a minimum height as fallback
    mapDiv.style.position = 'relative'; // Ensure proper positioning
    mapDiv.style.overflow = 'hidden'; // Prevent scrollbars
    
    mapContentBox.appendChild(mapDiv);
    
    // Debug: Check the map div dimensions
    setTimeout(() => {
        const mapDivElement = document.getElementById('worldMap');
        console.log('Map div dimensions:', {
            offsetHeight: mapDivElement.offsetHeight,
            clientHeight: mapDivElement.clientHeight,
            parentHeight: mapContentBox.offsetHeight
        });
        
        // If the map div still has no height, force it to use the parent's height
        if (mapDivElement.offsetHeight === 0 && mapContentBox.offsetHeight > 0) {
            mapDivElement.style.height = mapContentBox.offsetHeight + 'px';
            console.log('Forced map div height to:', mapContentBox.offsetHeight + 'px');
        }
        
        // Initialize the map with a more focused view (Americas + Europe)
        worldMap = L.map('worldMap', {
            center: [40, -40], // Center on Atlantic Ocean
            zoom: 3, // More zoomed in
            zoomControl: false, // Remove zoom controls for faster loading
            scrollWheelZoom: false, // Disable scroll zoom
            doubleClickZoom: false, // Disable double-click zoom
            dragging: false, // Disable dragging
            touchZoom: false, // Disable touch zoom
            boxZoom: false, // Disable box zoom
            keyboard: false, // Disable keyboard navigation
            attributionControl: false, // Remove attribution for cleaner look
        });
        
        // Add a simple, fast-loading tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 4, // Limit zoom levels for faster loading
            minZoom: 2
        }).addTo(worldMap);
        
        // Add fewer, more focused cities (Americas + Europe)
        /* const majorCities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060, salary: '$150,000' },
            { name: 'San Francisco', lat: 37.7749, lng: -122.4194, salary: '$160,000' },
            { name: 'London', lat: 51.5074, lng: -0.1278, salary: '$80,000' },
            { name: 'Berlin', lat: 52.5200, lng: 13.4050, salary: '$70,000' },
            { name: 'Toronto', lat: 43.6532, lng: -79.3832, salary: '$90,000' },
            { name: 'Paris', lat: 48.8566, lng: 2.3522, salary: '$75,000' }
        ]; */
        
        // Add markers for each city
        /* majorCities.forEach(city => {
            const marker = L.marker([city.lat, city.lng]).addTo(worldMap);
            marker.bindPopup(`
                <div style="text-align: center;">
                    <h3 style="margin: 0; color: #333;">${city.name}</h3>
                    <p style="margin: 5px 0; color: #666;">Avg SWE Salary: ${city.salary}</p>
                </div>
            `);
        }); */
        
        // Set a fixed view that focuses on Americas + Europe
        worldMap.setView([40, -40], 3);
        
        // Force the map to fill the container
        setTimeout(() => {
            if (worldMap) {
                worldMap.invalidateSize();
                // Ensure it takes full height
                const mapContainer = worldMap.getContainer();
                mapContainer.style.height = '100%';
                
                // Also force the map div to take full height
                const mapDivElement = document.getElementById('worldMap');
                if (mapDivElement) {
                    mapDivElement.style.height = mapContentBox.offsetHeight + 'px';
                    console.log('Forced map div height to:', mapContentBox.offsetHeight + 'px');
                }
                
                // Force the map to resize to the new dimensions
                worldMap.invalidateSize();
            }
        }, 50);
        
        console.log('World map created successfully');
    }, 100);
}

// Function to recreate the map (useful for resizing)
function recreateWorldMap() {
    if (worldMap) {
        worldMap.remove(); // Remove the existing map
        worldMap = null;
    }
    createWorldMap();
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

// Information mapping for each metric
const metricInfo = {
    // Personal Finance
    'personalFinanceHeader': 'Personal Finance metrics track individual financial health including income, expenses, and cost of living',
    'salariesHeader': 'Average salary data for software engineers and related roles in different regions',
    'taxesHeader': 'Tax rates and brackets affecting take-home pay in various locations',
    'rentHeader': 'Housing costs including rent prices and affordability metrics',
    'costOfLivingHeader': 'Overall cost of living index comparing different cities and regions',
    
    // Career Security
    'careerSecurityHeader': 'Career Security metrics assess job market stability and employment risks',
    'jobDemandHeader': 'Current demand for software engineering positions and job postings',
    'layoffsHeader': 'Recent layoff trends and job security indicators in tech',
    'underemploymentHeader': 'Rate of underemployment in tech and related fields',
    'timeUnemployedHeader': 'Average duration of unemployment for tech professionals',
    
    // Macroeconomic Health
    'macroeconomicHealthHeader': 'Macroeconomic Health indicators show broader economic conditions',
    'realGDPGrowthHeader': 'Real GDP growth rate indicating economic expansion or contraction',
    'realGDPPerCapitaHeader': 'GDP per capita showing economic productivity per person',
    'housingStartsHeader': 'New housing construction starts as an economic indicator',
    'consumerPriceIndexHeader': 'Inflation rate measured by consumer price index changes',
    
    // Growth Opportunity
    'growthOpportunityHeader': 'Growth Opportunity metrics identify potential for career advancement',
    'techJobDensityHeader': 'Concentration of technology jobs in specific geographic areas',
    'salaryGrowthRateHeader': 'Historical and projected salary growth rates in tech',
    'sweAdjacentGrowthHeader': 'Growth in software engineering adjacent fields and roles',
    'allFieldsGrowthHeader': 'Overall job market growth across all industries and sectors',
    
    // Map
    'matpTitleHeader': 'Interactive world map showing economic data by country and region'
};

// Function to show hover info
function showHoverInfo(event, elementId) {
    const info = metricInfo[elementId];
    if (info) {
        hoverInfoDiv.textContent = info;
        hoverInfoDiv.style.display = 'block';
        
        // Position the tooltip near the cursor
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
            header.addEventListener('mouseenter', function(event) {
                showHoverInfo(event, this.id);
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
    setDynamicGridLayout();
});

function recalculateGridLayout() {
    setDynamicGridLayout();
}

// Function to recalculate just the map content box height
function recalculateMapContentBoxHeight() {
    calculateMapContentBoxHeight();
}
