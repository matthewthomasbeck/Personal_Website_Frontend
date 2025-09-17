/**********************************************************************************/
/* Copyright (c) 2025 Matthew Thomas Beck                                         */
/*                                                                                */
/* All rights reserved. This code and its associated files may not be reproduced, */
/* modified, distributed, or otherwise used, in part or in whole, by any person   */
/* or entity without the express written permission of the copyright holder,      */
/* Matthew Thomas Beck.                                                           */
/**********************************************************************************/





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


/********** EVENT LISTENERS **********/

document.addEventListener('DOMContentLoaded', function() {
    setDynamicGridLayout();
});

function recalculateGridLayout() {
    setDynamicGridLayout();
}
