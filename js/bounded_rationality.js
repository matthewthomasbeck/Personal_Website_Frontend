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


/********** CREATE WORLD MAP WITH D3.JS **********/

let worldMap = null; // Global variable to store the D3 map instance
let worldData = null; // Global variable to store the world topology data

// Comprehensive country name mapping for data consistency
const countryNameMapping = {
    // Major Countries - Americas
    'United States of America': 'USA',
    'United States': 'USA',
    'USA': 'USA',
    'US': 'USA',
    'America': 'USA',
    'Canada': 'Canada',
    'United Mexican States': 'Mexico',
    'Mexico': 'Mexico',
    'Federative Republic of Brazil': 'Brazil',
    'Brazil': 'Brazil',
    'Argentine Republic': 'Argentina',
    'Argentina': 'Argentina',
    'Republic of Chile': 'Chile',
    'Chile': 'Chile',
    'Republic of Colombia': 'Colombia',
    'Colombia': 'Colombia',
    'Republic of Peru': 'Peru',
    'Peru': 'Peru',
    'Bolivarian Republic of Venezuela': 'Venezuela',
    'Venezuela': 'Venezuela',
    'Republic of Ecuador': 'Ecuador',
    'Ecuador': 'Ecuador',
    'Republic of Bolivia': 'Bolivia',
    'Bolivia': 'Bolivia',
    'Paraguay': 'Paraguay',
    'Oriental Republic of Uruguay': 'Uruguay',
    'Uruguay': 'Uruguay',
    'Guyana': 'Guyana',
    'Republic of Suriname': 'Suriname',
    'Suriname': 'Suriname',
    
    // Major Countries - Europe
    'United Kingdom': 'UK',
    'UK': 'UK',
    'Great Britain': 'UK',
    'Britain': 'UK',
    'England': 'UK',
    'Scotland': 'UK',
    'Wales': 'UK',
    'Northern Ireland': 'UK',
    'Federal Republic of Germany': 'Germany',
    'Germany': 'Germany',
    'Deutschland': 'Germany',
    'French Republic': 'France',
    'France': 'France',
    'Italian Republic': 'Italy',
    'Italy': 'Italy',
    'Kingdom of Spain': 'Spain',
    'Spain': 'Spain',
    'Kingdom of the Netherlands': 'Netherlands',
    'Netherlands': 'Netherlands',
    'Holland': 'Netherlands',
    'Kingdom of Belgium': 'Belgium',
    'Belgium': 'Belgium',
    'Swiss Confederation': 'Switzerland',
    'Switzerland': 'Switzerland',
    'Republic of Austria': 'Austria',
    'Austria': 'Austria',
    'Kingdom of Sweden': 'Sweden',
    'Sweden': 'Sweden',
    'Kingdom of Norway': 'Norway',
    'Norway': 'Norway',
    'Kingdom of Denmark': 'Denmark',
    'Denmark': 'Denmark',
    'Republic of Finland': 'Finland',
    'Finland': 'Finland',
    'Republic of Poland': 'Poland',
    'Poland': 'Poland',
    'Czech Republic': 'Czech Republic',
    'Czechia': 'Czech Republic',
    'Slovak Republic': 'Slovakia',
    'Slovakia': 'Slovakia',
    'Republic of Hungary': 'Hungary',
    'Hungary': 'Hungary',
    'Romania': 'Romania',
    'Republic of Bulgaria': 'Bulgaria',
    'Bulgaria': 'Bulgaria',
    'Republic of Croatia': 'Croatia',
    'Croatia': 'Croatia',
    'Bosnia and Herzegovina': 'Bosnia',
    'Bosnia': 'Bosnia',
    'Bosnia-Herzegovina': 'Bosnia',
    'Republic of Serbia': 'Serbia',
    'Serbia': 'Serbia',
    'Montenegro': 'Montenegro',
    'Republic of North Macedonia': 'North Macedonia',
    'North Macedonia': 'North Macedonia',
    'Macedonia': 'North Macedonia',
    'Republic of Albania': 'Albania',
    'Albania': 'Albania',
    'Hellenic Republic': 'Greece',
    'Greece': 'Greece',
    'Republic of Cyprus': 'Cyprus',
    'Cyprus': 'Cyprus',
    'Republic of Malta': 'Malta',
    'Malta': 'Malta',
    'Portuguese Republic': 'Portugal',
    'Portugal': 'Portugal',
    'Ireland': 'Ireland',
    'Republic of Ireland': 'Ireland',
    'Iceland': 'Iceland',
    'Grand Duchy of Luxembourg': 'Luxembourg',
    'Luxembourg': 'Luxembourg',
    'Principality of Liechtenstein': 'Liechtenstein',
    'Liechtenstein': 'Liechtenstein',
    'Principality of Monaco': 'Monaco',
    'Monaco': 'Monaco',
    'Principality of Andorra': 'Andorra',
    'Andorra': 'Andorra',
    'Republic of San Marino': 'San Marino',
    'San Marino': 'San Marino',
    'Vatican City State': 'Vatican',
    'Vatican': 'Vatican',
    'Holy See': 'Vatican',
    'Ukraine': 'Ukraine',
    'Republic of Belarus': 'Belarus',
    'Belarus': 'Belarus',
    'Republic of Moldova': 'Moldova',
    'Moldova': 'Moldova',
    'Republic of Lithuania': 'Lithuania',
    'Lithuania': 'Lithuania',
    'Republic of Latvia': 'Latvia',
    'Latvia': 'Latvia',
    'Republic of Estonia': 'Estonia',
    'Estonia': 'Estonia',
    
    // Major Countries - Asia
    'People\'s Republic of China': 'China',
    'China': 'China',
    'PRC': 'China',
    'Mainland China': 'China',
    'Japan': 'Japan',
    'Nippon': 'Japan',
    'Republic of Korea': 'South Korea',
    'South Korea': 'South Korea',
    'Korea': 'South Korea',
    'ROK': 'South Korea',
    'Democratic People\'s Republic of Korea': 'North Korea',
    'North Korea': 'North Korea',
    'DPRK': 'North Korea',
    'Republic of India': 'India',
    'India': 'India',
    'Bharat': 'India',
    'Islamic Republic of Pakistan': 'Pakistan',
    'Pakistan': 'Pakistan',
    'People\'s Republic of Bangladesh': 'Bangladesh',
    'Bangladesh': 'Bangladesh',
    'Republic of Indonesia': 'Indonesia',
    'Indonesia': 'Indonesia',
    'Republic of the Philippines': 'Philippines',
    'Philippines': 'Philippines',
    'Socialist Republic of Vietnam': 'Vietnam',
    'Vietnam': 'Vietnam',
    'Kingdom of Thailand': 'Thailand',
    'Thailand': 'Thailand',
    'Malaysia': 'Malaysia',
    'Republic of Singapore': 'Singapore',
    'Singapore': 'Singapore',
    'Commonwealth of Australia': 'Australia',
    'Australia': 'Australia',
    'New Zealand': 'New Zealand',
    'Islamic Republic of Iran': 'Iran',
    'Iran': 'Iran',
    'Persia': 'Iran',
    'Syrian Arab Republic': 'Syria',
    'Syria': 'Syria',
    'Republic of Turkey': 'Turkey',
    'Turkey': 'Turkey',
    'Türkiye': 'Turkey',
    'Kingdom of Saudi Arabia': 'Saudi Arabia',
    'Saudi Arabia': 'Saudi Arabia',
    'United Arab Emirates': 'UAE',
    'UAE': 'UAE',
    'Emirates': 'UAE',
    'State of Israel': 'Israel',
    'Israel': 'Israel',
    'Afghanistan': 'Afghanistan',
    'Armenia': 'Armenia',
    'Azerbaijan': 'Azerbaijan',
    'Bahrain': 'Bahrain',
    'Bhutan': 'Bhutan',
    'Brunei': 'Brunei',
    'Cambodia': 'Cambodia',
    'Georgia': 'Georgia',
    'Iraq': 'Iraq',
    'Jordan': 'Jordan',
    'Kazakhstan': 'Kazakhstan',
    'Kuwait': 'Kuwait',
    'Kyrgyzstan': 'Kyrgyzstan',
    'Laos': 'Laos',
    'Lebanon': 'Lebanon',
    'Maldives': 'Maldives',
    'Mongolia': 'Mongolia',
    'Myanmar': 'Myanmar',
    'Nepal': 'Nepal',
    'Oman': 'Oman',
    'Qatar': 'Qatar',
    'Sri Lanka': 'Sri Lanka',
    'Taiwan': 'Taiwan',
    'Tajikistan': 'Tajikistan',
    'Turkmenistan': 'Turkmenistan',
    'Uzbekistan': 'Uzbekistan',
    'Yemen': 'Yemen',
    
    // Major Countries - Africa
    'Republic of South Africa': 'South Africa',
    'South Africa': 'South Africa',
    'Arab Republic of Egypt': 'Egypt',
    'Egypt': 'Egypt',
    'Federal Democratic Republic of Ethiopia': 'Ethiopia',
    'Ethiopia': 'Ethiopia',
    'Federal Republic of Nigeria': 'Nigeria',
    'Nigeria': 'Nigeria',
    'Republic of Kenya': 'Kenya',
    'Kenya': 'Kenya',
    'United Republic of Tanzania': 'Tanzania',
    'Tanzania': 'Tanzania',
    'Republic of Uganda': 'Uganda',
    'Uganda': 'Uganda',
    'Republic of Ghana': 'Ghana',
    'Ghana': 'Ghana',
    'Republic of the Congo': 'Congo',
    'Congo': 'Congo',
    'Congo-Brazzaville': 'Congo',
    'Democratic Republic of the Congo': 'DRC',
    'DRC': 'DRC',
    'Congo-Kinshasa': 'DRC',
    'Central African Republic': 'CAR',
    'CAR': 'CAR',
    'Republic of South Sudan': 'South Sudan',
    'South Sudan': 'South Sudan',
    'Republic of Sudan': 'Sudan',
    'Sudan': 'Sudan',
    'Libya': 'Libya',
    'Republic of Tunisia': 'Tunisia',
    'Tunisia': 'Tunisia',
    'People\'s Democratic Republic of Algeria': 'Algeria',
    'Algeria': 'Algeria',
    'Kingdom of Morocco': 'Morocco',
    'Morocco': 'Morocco',
    'Islamic Republic of Mauritania': 'Mauritania',
    'Mauritania': 'Mauritania',
    'Republic of Mali': 'Mali',
    'Mali': 'Mali',
    'Burkina Faso': 'Burkina Faso',
    'Republic of Niger': 'Niger',
    'Niger': 'Niger',
    'Republic of Chad': 'Chad',
    'Chad': 'Chad',
    'Republic of Cameroon': 'Cameroon',
    'Cameroon': 'Cameroon',
    'Gabonese Republic': 'Gabon',
    'Gabon': 'Gabon',
    'Republic of Equatorial Guinea': 'Equatorial Guinea',
    'Equatorial Guinea': 'Equatorial Guinea',
    'Republic of Angola': 'Angola',
    'Angola': 'Angola',
    'Republic of Zambia': 'Zambia',
    'Zambia': 'Zambia',
    'Republic of Zimbabwe': 'Zimbabwe',
    'Zimbabwe': 'Zimbabwe',
    'Republic of Botswana': 'Botswana',
    'Botswana': 'Botswana',
    'Kingdom of Eswatini': 'Eswatini',
    'Eswatini': 'Eswatini',
    'Swaziland': 'Eswatini',
    'Kingdom of Lesotho': 'Lesotho',
    'Lesotho': 'Lesotho',
    'Republic of Namibia': 'Namibia',
    'Namibia': 'Namibia',
    'Republic of Madagascar': 'Madagascar',
    'Madagascar': 'Madagascar',
    'Republic of Mauritius': 'Mauritius',
    'Mauritius': 'Mauritius',
    'Union of the Comoros': 'Comoros',
    'Comoros': 'Comoros',
    'Republic of Seychelles': 'Seychelles',
    'Seychelles': 'Seychelles',
    'Republic of Djibouti': 'Djibouti',
    'Djibouti': 'Djibouti',
    'State of Eritrea': 'Eritrea',
    'Eritrea': 'Eritrea',
    'Republic of Somalia': 'Somalia',
    'Somalia': 'Somalia',
    'Republic of Rwanda': 'Rwanda',
    'Rwanda': 'Rwanda',
    'Republic of Burundi': 'Burundi',
    'Burundi': 'Burundi',
    'Republic of Malawi': 'Malawi',
    'Malawi': 'Malawi',
    'Republic of Mozambique': 'Mozambique',
    'Mozambique': 'Mozambique',
    
    // Caribbean and Central America
    'Antigua and Barbuda': 'Antigua',
    'Antigua': 'Antigua',
    'Bahamas': 'Bahamas',
    'Barbados': 'Barbados',
    'Belize': 'Belize',
    'Costa Rica': 'Costa Rica',
    'Cuba': 'Cuba',
    'Dominica': 'Dominica',
    'Dominican Republic': 'Dominican Republic',
    'El Salvador': 'El Salvador',
    'Grenada': 'Grenada',
    'Guatemala': 'Guatemala',
    'Haiti': 'Haiti',
    'Honduras': 'Honduras',
    'Jamaica': 'Jamaica',
    'Nicaragua': 'Nicaragua',
    'Panama': 'Panama',
    'Saint Kitts and Nevis': 'St. Kitts',
    'St. Kitts': 'St. Kitts',
    'Saint Lucia': 'St. Lucia',
    'St. Lucia': 'St. Lucia',
    'Saint Vincent and the Grenadines': 'St. Vincent',
    'St. Vincent': 'St. Vincent',
    'Trinidad and Tobago': 'Trinidad',
    'Trinidad': 'Trinidad',
    
    // Pacific Islands
    'Fiji': 'Fiji',
    'Kiribati': 'Kiribati',
    'Marshall Islands': 'Marshall Islands',
    'Micronesia': 'Micronesia',
    'Federated States of Micronesia': 'Micronesia',
    'Nauru': 'Nauru',
    'Palau': 'Palau',
    'Papua New Guinea': 'Papua New Guinea',
    'Samoa': 'Samoa',
    'Solomon Islands': 'Solomon Islands',
    'Tonga': 'Tonga',
    'Tuvalu': 'Tuvalu',
    'Vanuatu': 'Vanuatu',
    'Cook Islands': 'Cook Islands',
    'Niue': 'Niue',
    'Tokelau': 'Tokelau',
    'Pitcairn Islands': 'Pitcairn',
    'Pitcairn': 'Pitcairn',
    'French Polynesia': 'French Polynesia',
    'New Caledonia': 'New Caledonia',
    'Wallis and Futuna': 'Wallis and Futuna',
    'American Samoa': 'American Samoa'
};

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

// Function to extract country name from series name
function extractCountryName(seriesName) {
    // Remove common prefixes and suffixes
    let cleanName = seriesName
        .replace(/^(RGDP Growth|GDP Growth|Real GDP Growth|GDP Per Capita|Salary Growth|Tech Job Density|Cost of Living|Rent|Tax|Job Demand|Layoffs|Underemployment|Time Unemployed|Housing Starts|Consumer Price Index|SWE Adjacent Growth|All Fields Growth)\s+/i, '')
        .replace(/\s+(Growth|Rate|Index|Density|Demand|Starts|Unemployed)$/i, '')
        .trim();
    
    // Check if it's a known country name
    if (Object.keys(countryNameMapping).includes(cleanName) || 
        Object.values(countryNameMapping).includes(cleanName)) {
        return cleanName;
    }
    
    // Check if it matches any country name in our mapping (case insensitive)
    const lowerCleanName = cleanName.toLowerCase();
    for (const [key, value] of Object.entries(countryNameMapping)) {
        if (key.toLowerCase() === lowerCleanName || value.toLowerCase() === lowerCleanName) {
            return value; // Return the standardized name
        }
    }
    
    return cleanName; // Return as-is if no mapping found
}

// Function to analyze economic data and determine coloring strategy
function analyzeEconomicData(data) {
    if (!data || !data.timeSeries) {
        return { isValid: false, reason: 'No timeSeries data found' };
    }
    
    // Extract and check country names
    const countryNames = data.timeSeries.map(series => extractCountryName(series.name));
    const hasCountryData = countryNames.some(name => 
        Object.keys(countryNameMapping).includes(name) || 
        Object.values(countryNameMapping).includes(name) ||
        name.length > 0 // Allow any non-empty name for now
    );
    
    if (!hasCountryData) {
        return { isValid: false, reason: 'No country data found in timeSeries' };
    }
    
    // Determine if data is scalar vs vector
    const sampleData = data.timeSeries[0]?.data || [];
    const isScalar = sampleData.every(point => typeof point.y === 'number' && !isNaN(point.y));
    
    if (!isScalar) {
        return { isValid: false, reason: 'Data is not numeric' };
    }
    
    // Get most recent values for each country
    const latestValues = {};
    data.timeSeries.forEach(series => {
        if (series.data && series.data.length > 0) {
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
async function createWorldMapWithData(dataFileName = 'realGDPGrowth') {
    // Get the map content box
    const mapContentBox = document.getElementById('mapContentBox');
    
    if (!mapContentBox) {
        console.error('Map content box not found');
        return;
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
    
    // Fetch economic data FIRST
    let economicData = null;
    if (dataFileName) {
        try {
            economicData = await fetchEconomicData(dataFileName);
            console.log(`Fetched economic data for ${dataFileName}:`, economicData);
        } catch (error) {
            console.warn(`Could not fetch economic data for ${dataFileName}:`, error);
        }
    }
    
    // Analyze the data
    const analysis = economicData ? analyzeEconomicData(economicData) : { isValid: false, reason: 'No data provided' };
    console.log('Economic data analysis:', analysis);
    
    // Load world topology data
    try {
        let worldTopology;
        try {
            worldTopology = await d3.json('https://unpkg.com/world-atlas@1/world/110m.json');
        } catch (firstError) {
            console.warn('First CDN failed, trying alternative:', firstError);
            // Try alternative CDN
            worldTopology = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/world/110m.json');
        }
        
        console.log('Loaded world topology data:', worldTopology);
        console.log('Available objects:', Object.keys(worldTopology.objects));
        
        // Convert TopoJSON to GeoJSON - try different possible object names
        let countries;
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
        console.log('Converted to GeoJSON:', countries);
        
        // Debug: Check what properties are available in the first few countries
        if (countries.features && countries.features.length > 0) {
            console.log('Sample country properties:', countries.features.slice(0, 3).map(f => ({
                name: f.properties.NAME || f.properties.NAME_EN || f.properties.name || f.properties.NAME_LONG || f.properties.ADMIN,
                allProps: Object.keys(f.properties)
            })));
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
        if (analysis.isValid && Object.keys(analysis.latestValues).length > 0) {
            const values = Object.values(analysis.latestValues);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);
            
            console.log('Economic data for coloring:', {
                latestValues: analysis.latestValues,
                values: values,
                minValue: minValue,
                maxValue: maxValue
            });
            
            // Create D3 color scale using our 4-color gradient
            colorScale = d3.scaleSequential()
                .domain([minValue, maxValue])
                .interpolator(d3.interpolate(['#fcf6bd', '#d0f4de', '#bde0fe', '#dec0f1']));
            
            console.log('Created color scale:', { minValue, maxValue });
        } else {
            console.log('No valid economic data for coloring:', analysis);
        }
        
        // Add ocean background
        svg.append('path')
            .datum({ type: 'Sphere' })
            .attr('class', 'ocean')
            .attr('d', path)
            .style('fill', '#212529'); // var(--primary)
        
        // Add countries
        const countryPaths = svg.append('g')
            .attr('class', 'countries')
            .selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'country')
            .style('stroke', '#6c757d') // var(--secondary)
            .style('stroke-width', 0.5)
            .style('fill', function(d) {
                if (!colorScale || !analysis.isValid) {
                    return '#343a40'; // var(--secondary) for no data
                }
                
                // Try to match country name with our data
                const countryName = d.properties.NAME || d.properties.NAME_EN || d.properties.name || d.properties.NAME_LONG || d.properties.ADMIN || d.properties.SOVEREIGNT || d.properties.SOV_A3;
                console.log(`Checking country: ${countryName}`, d.properties);
                
                // If still undefined, skip this country
                if (!countryName) {
                    console.log('Skipping country with no name:', d.properties);
                    return '#343a40';
                }
                
                // Direct lookup in our data
                let matchedCountry = null;
                let matchedValue = null;
                
                // First try direct name matching
                for (const [dataKey, dataValue] of Object.entries(analysis.latestValues)) {
                    const extractedName = extractCountryName(dataKey);
                    console.log(`Comparing "${countryName}" with extracted name "${extractedName}" from "${dataKey}"`);
                    
                    // Direct match
                    if (countryName === extractedName) {
                        matchedCountry = dataKey;
                        matchedValue = dataValue;
                        break;
                    }
                    
                    // Check if country name maps to our extracted name
                    if (countryNameMapping[countryName] === extractedName) {
                        matchedCountry = dataKey;
                        matchedValue = dataValue;
                        break;
                    }
                    
                    // Check if our extracted name maps to country name
                    if (countryNameMapping[extractedName] === countryName) {
                        matchedCountry = dataKey;
                        matchedValue = dataValue;
                        break;
                    }
                    
                    // Check if both are in the mapping and point to same value
                    if (countryNameMapping[countryName] && countryNameMapping[extractedName] && 
                        countryNameMapping[countryName] === countryNameMapping[extractedName]) {
                        matchedCountry = dataKey;
                        matchedValue = dataValue;
                        break;
                    }
                }
                
                if (matchedCountry && matchedValue !== null) {
                    console.log(`✅ Coloring ${countryName} with value ${matchedValue} (from ${matchedCountry})`);
                    return colorScale(matchedValue);
                } else {
                    console.log(`❌ No match found for ${countryName}`);
                    return '#343a40'; // var(--secondary) for no data
                }
            })
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                // Highlight country on hover
                d3.select(this)
                    .style('opacity', 1)
                    .style('stroke-width', 2);
                
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
                    showMapTooltip(event, countryName, value);
                }
            })
            .on('mouseout', function(event, d) {
                // Reset country appearance
                d3.select(this)
                    .style('opacity', 0.8)
                    .style('stroke-width', 0.5);
                
                hideMapTooltip();
            });
        
        console.log('D3.js world map created successfully');
        
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
function showMapTooltip(event, countryName, value) {
    const tooltip = d3.select('body').selectAll('.map-tooltip')
        .data([1])
        .enter()
        .append('div')
        .attr('class', 'map-tooltip')
        .style('position', 'absolute')
        .style('background-color', '#212529') // var(--primary)
        .style('border', '2px solid #6c757d') // var(--secondary)
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .style('opacity', 0);
    
    tooltip.html(`
                <div style="text-align: center;">
            <strong>${countryName}</strong><br>
            Value: ${value}
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
    'growthOpportunityHeader': 'Growth Opportunity metrics identify potential for career advancement',
        'mapTitleHeader': 'Interactive world map showing economic data by country and region'
    };
    
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
    setDynamicGridLayout();
});

function recalculateGridLayout() {
    setDynamicGridLayout();
}

// Function to recalculate just the map content box height
function recalculateMapContentBoxHeight() {
    calculateMapContentBoxHeight();
}
