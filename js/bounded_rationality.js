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
    'SWEAdjacentGrowthHeader': 'SWEAdjacentGrowth',
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
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.id = `chart-${metricId}`;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // Clear any existing content and add canvas
        contentBox.innerHTML = '';
        contentBox.appendChild(canvas);
        
        // Get the computed dimensions of the content box
        const contentBoxStyle = window.getComputedStyle(contentBox);
        const width = contentBox.offsetWidth;
        const height = contentBox.offsetHeight;
        
        console.log(`Creating chart for ${metricId}: ${width}x${height}px`);
        
        // Prepare Chart.js data
        const chartData = prepareChartData(data);
        
        // Create the chart
        const chart = new Chart(canvas, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: data.title,
                        font: {
                            size: 14,
                            color: 'white'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: 'white'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: data.xAxis.label,
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: data.yAxis.label,
                            color: 'white'
                        },
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                if (data.yAxis.format === 'currency') {
                                    return new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0
                                    }).format(value);
                                }
                                return value;
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
        
        console.log(`Chart created successfully for ${metricId}`);
        
    } catch (error) {
        console.error(`Error creating chart for ${metricId}:`, error);
    }
}

function prepareChartData(data) {
    const datasets = data.timeSeries.map(series => ({
        label: series.name,
        data: series.data.map(point => ({
            x: point.x,
            y: point.y
        })),
        borderColor: series.color,
        backgroundColor: series.color + '20', // Add transparency
        tension: 0.1,
        fill: false
    }));
    
    return {
        datasets: datasets
    };
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
            attributionControl: false // Remove attribution for cleaner look
        });
        
        // Add a simple, fast-loading tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 4, // Limit zoom levels for faster loading
            minZoom: 2
        }).addTo(worldMap);
        
        // Add fewer, more focused cities (Americas + Europe)
        const majorCities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060, salary: '$150,000' },
            { name: 'San Francisco', lat: 37.7749, lng: -122.4194, salary: '$160,000' },
            { name: 'London', lat: 51.5074, lng: -0.1278, salary: '$80,000' },
            { name: 'Berlin', lat: 52.5200, lng: 13.4050, salary: '$70,000' },
            { name: 'Toronto', lat: 43.6532, lng: -79.3832, salary: '$90,000' },
            { name: 'Paris', lat: 48.8566, lng: 2.3522, salary: '$75,000' }
        ];
        
        // Add markers for each city
        majorCities.forEach(city => {
            const marker = L.marker([city.lat, city.lng]).addTo(worldMap);
            marker.bindPopup(`
                <div style="text-align: center;">
                    <h3 style="margin: 0; color: #333;">${city.name}</h3>
                    <p style="margin: 5px 0; color: #666;">Avg SWE Salary: ${city.salary}</p>
                </div>
            `);
        });
        
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
    'SWEAdjacentGrowthHeader': 'Growth in software engineering adjacent fields and roles',
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
