/**********************************************************************************/
/* Copyright (c) 2025 Matthew Thomas Beck                                         */
/*                                                                                */
/* All rights reserved. This code and its associated files may not be reproduced, */
/* modified, distributed, or otherwise used, in part or in whole, by any person   */
/* or entity without the express written permission of the copyright holder,      */
/* Matthew Thomas Beck.                                                           */
/**********************************************************************************/



/*****************************************************/
/*************** DYNAMIC GRID LAYOUT *****************/
/*****************************************************/

/**
 * Dynamically sets grid template rows for category content boxes
 * based on the number of metric boxes they contain
 */
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

/**
 * Initialize the dynamic grid layout when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    setDynamicGridLayout();
});

/**
 * Recalculate grid layout if content changes dynamically
 * Call this function whenever you add/remove metric boxes
 */
function recalculateGridLayout() {
    setDynamicGridLayout();
}
