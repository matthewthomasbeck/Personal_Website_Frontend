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


/********** CHART.JS IMPLEMENTATION **********/

// Function to create a Chart.js chart
function createChart(container, data) {
    // Create a wrapper div for better control
    const chartWrapper = document.createElement('div');
    chartWrapper.style.cssText = `
        width: 100%;
        height: 250px;
        position: relative;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        border-radius: 8px;
        padding: 10px;
        box-sizing: border-box;
    `;
    
    // Create canvas element with proper sizing
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        width: 100% !important;
        height: 100% !important;
        max-width: 100%;
        max-height: 100%;
    `;
    
    chartWrapper.appendChild(canvas);
    container.appendChild(chartWrapper);

    // Prepare data for Chart.js
    const datasets = data.timeSeries.map((series, index) => ({
        label: series.name,
        data: series.data.map(point => ({
            x: point.x,
            y: point.y
        })),
        borderColor: series.color || `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: series.color ? series.color + '20' : `hsla(${index * 60}, 70%, 50%, 0.1)`,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: series.color || `hsl(${index * 60}, 70%, 50%)`,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: series.color || `hsl(${index * 60}, 70%, 50%)`,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
    }));

    // Chart configuration
    const config = {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                title: {
                    display: true,
                    text: data.title || 'Economic Data',
                    color: '#ffffff',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 10
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        font: {
                            size: 10
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            let formattedValue = value;
                            
                            // Format based on data type
                            if (data.yAxis?.format === 'currency') {
                                formattedValue = `$${value.toLocaleString()}`;
                            } else if (data.yAxis?.format === 'percentage') {
                                formattedValue = `${(value * 100).toFixed(1)}%`;
                            } else {
                                formattedValue = value.toLocaleString();
                            }
                            
                            return `${context.dataset.label}: ${formattedValue}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: data.xAxis?.label || 'Time',
                        color: '#ffffff',
                        font: {
                            size: 10,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#cccccc',
                        font: {
                            size: 9
                        },
                        maxTicksLimit: 6
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: data.yAxis?.label || 'Value',
                        color: '#ffffff',
                        font: {
                            size: 10,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#cccccc',
                        font: {
                            size: 9
                        },
                        callback: function(value) {
                            if (data.yAxis?.format === 'currency') {
                                return `$${value.toLocaleString()}`;
                            } else if (data.yAxis?.format === 'percentage') {
                                return `${(value * 100).toFixed(1)}%`;
                            } else {
                                return value.toLocaleString();
                            }
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    }
                }
            },
            elements: {
                line: {
                    borderJoinStyle: 'round',
                    borderCapStyle: 'round'
                }
            },
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            }
        }
    };

    // Create the chart
    const chart = new Chart(canvas, config);
    return chart;
}

// Function to display data in a metric content box
function displayMetricData(metricName, data) {
    const contentBox = document.querySelector(`#${metricName}Header`).closest('.categoryMetricBoxes').querySelector('.categoryMetricContentBoxes');
    
    if (!contentBox || !data) {
        console.error(`Could not find content box for ${metricName} or no data provided`);
        return;
    }

    // Clear existing content
    contentBox.innerHTML = '';

    // Check if data has the new structured format
    if (data.timeSeries && Array.isArray(data.timeSeries)) {
        // Create Chart.js visualization
        createChart(contentBox, data);
        
        // Add description if available
        if (data.description) {
            const descDiv = document.createElement('div');
            descDiv.style.cssText = `
                padding: 10px;
                margin: 10px 0;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                font-size: 12px;
                color: #ccc;
                font-style: italic;
            `;
            descDiv.textContent = data.description;
            contentBox.appendChild(descDiv);
        }
        
        // Add last updated info
        if (data.lastUpdated) {
            const updateDiv = document.createElement('div');
            updateDiv.style.cssText = `
                padding: 5px;
                margin: 5px 0;
                font-size: 10px;
                color: #888;
                text-align: right;
            `;
            updateDiv.textContent = `Last updated: ${data.lastUpdated}`;
            contentBox.appendChild(updateDiv);
        }
        
    } else if (Array.isArray(data)) {
        // Handle array data (legacy format)
        data.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'metricDataItem';
            itemDiv.style.cssText = `
                padding: 8px;
                margin: 4px 0;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                font-size: 14px;
            `;
            
            if (typeof item === 'object') {
                // Handle object data
                const keys = Object.keys(item);
                keys.forEach(key => {
                    const span = document.createElement('span');
                    span.innerHTML = `<strong>${key}:</strong> ${item[key]} `;
                    itemDiv.appendChild(span);
                });
            } else {
                // Handle simple values
                itemDiv.textContent = item;
            }
            
            contentBox.appendChild(itemDiv);
        });
    } else if (typeof data === 'object') {
        // Handle object data (legacy format)
        const keys = Object.keys(data);
        keys.forEach(key => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'metricDataItem';
            itemDiv.style.cssText = `
                padding: 8px;
                margin: 4px 0;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                font-size: 14px;
            `;
            itemDiv.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
            contentBox.appendChild(itemDiv);
        });
    } else {
        // Handle simple values
        const itemDiv = document.createElement('div');
        itemDiv.className = 'metricDataItem';
        itemDiv.style.cssText = `
            padding: 8px;
            margin: 4px 0;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            font-size: 14px;
        `;
        itemDiv.textContent = data;
        contentBox.appendChild(itemDiv);
    }
}

// Function to load and display data for all metrics
async function loadAllEconomicData() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }
    
    console.log('Chart.js is loaded:', Chart);
    
    // Only try the metrics you actually have JSON files for
    const metrics = [
        'salaries',
        'consumerPriceIndex', 
        'realGDPGrowth',
        'jobDemand',
        'housingStarts',
        'rent'
    ];

    for (const metric of metrics) {
        try {
            const data = await fetchEconomicData(metric);
            if (data) {
                displayMetricData(metric, data);
                console.log(`Loaded data for ${metric}`);
            } else {
                console.warn(`No data available for ${metric}`);
                // Display placeholder message
                const contentBox = document.querySelector(`#${metric}Header`).closest('.categoryMetricBoxes').querySelector('.categoryMetricContentBoxes');
                if (contentBox) {
                    contentBox.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Data coming soon...</div>';
                }
            }
        } catch (error) {
            console.error(`Error loading data for ${metric}:`, error);
        }
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
}


/********** TOGGLE MAP BUTTON **********/

const mapToggleButton = document.getElementById('mapToggleButton'); // find map toggle button
const mapToggleArrowRight = document.getElementById('mapToggleArrowRight'); // find map toggle arrow
const mapToggleArrowLeft = document.getElementById('mapToggleArrowLeft'); // find map toggle arrow
const mapBox = document.getElementById('mapBox'); // find map box

mapToggleButton.addEventListener('click', function() {

    /***** make map right 0→-65vw *****/

    if (mapBox.style.right === '0vw' || mapBox.style.right === '') { // make right attribute of mapBox -65vw to hide it
        mapToggleArrowRight.style.display = 'none';
        mapToggleArrowLeft.style.display = 'block';
        mapToggleButton.style.right = '0vw'; // move button to right edge of screen
        mapBox.style.right = 'calc(-65vw - 3px)'; // hide map

    } else {
        mapToggleArrowRight.style.display = 'block';
        mapToggleArrowLeft.style.display = 'none';
        mapToggleButton.style.right = 'calc(65vw + 3px)'; // move button to right edge of map
        mapBox.style.right = '0vw'; // show map
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
    'worldEconomicMapHeader': 'Interactive world map showing economic data by country and region'
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
    loadAllEconomicData(); // Load economic data when page loads
});

function recalculateGridLayout() {
    setDynamicGridLayout();
}
