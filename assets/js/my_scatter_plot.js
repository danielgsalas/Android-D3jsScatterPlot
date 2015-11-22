
var svgHeight = 500;
var svgWidth = 500;

var chartHeight = svgHeight * 0.75; // leave room for axis labels
var chartWidth = svgWidth * 0.75;   // leave room for axis labels

var domain = { x : null, y : null };

var xRange = { min : 10, max : chartWidth - 10 }; 
var yRange = { min : 10, max : chartHeight - 10 };

var xAxisAscending = true;    // from left to right
var yAxisAscending = false;   // from top to bottom

var xAxisAdjust = {
	horizontal : svgWidth * 0.20,
	vertical : chartHeight - 10
};

var yAxisAdjust = {
	horizontal : svgHeight * 0.22,
	vertical : 0
};

/*
 * Add a data point to the chart.
 * 
 * @param {string} chartId - id of the SVG element in the HTML file
 * @param {number} x - A domain location on a horizontal line
 *                     in a Cartesian coordinate system
 * @param {number} y - A domain location on a vertical line
 *                     in a Cartesian coordinate system
 */ 
var addDataPoint = function(chartId, x, y) {
	
	var chart = d3.select("#" + chartId);
	
	var domainPoint = { x : x, y : y };
	var rangePoint = calculateRangePoint(domainPoint);	
	var radius = 5;
	
	var cssStyle = null;
	
	if (inQuadrantOne(x,y)) {
    	cssStyle = "dataPointSafe";
    }
    else if (inQuadrantTwo(x,y) || inQuadrantThree(x,y)) {
    	cssStyle = "dataPointWarning";
    }
    else {
    	cssStyle = "dataPointDanger";
    }
	
	drawDataPointOnChart(chart, rangePoint, radius, cssStyle);
}

/*
 * Build the chart's axes and mid-lines using values specific to this chart.
 * 
 * @param {string} chartId - id of the SVG element in the HTML file
 * 
 * @param {Object} xDomain - Metadata about the domain values on a 
 *                           horizontal line of a Cartesian coordinate system
 * @param {number} xDomain.min - Minimum of the domain's horizontal values
 * @param {number} xDomain.max - Maximum of the domain's horizontal values
 * 
 * @param {Object} yDomain - Metadata about the domain values on a 
 *                           vertical line of a Cartesian coordinate system
 * @param {number} yDomain.min - Minimum of the domain's vertical values
 * @param {number} yDomain.max - Maximum of the domain's vertical values
 */
var buildChart = function(chartId, xDomain, yDomain) {
 
    var chart = d3.select("#" + chartId);
    
    domain.x = xDomain;
    domain.y = yDomain;
    domain.x.mid = (domain.x.max - domain.x.min) / 2 + domain.x.min;
    domain.y.mid = (domain.y.max - domain.y.min) / 2 + domain.y.min;
 
    drawXAxis(chart, domain.x, xRange, xAxisAdjust, xAxisAscending);
    drawYAxis(chart, domain.y, yRange, yAxisAdjust, yAxisAscending);

    drawMidlineHorizontal(chart);
    drawMidlineVertical(chart);
}

/*
 * Create a range point from a domain point.
 * 
 * @param {Object} domainPoint - A point in the real world
 * @param {number} domainPoint.x - A location on a horizontal line
 *                                 in a Cartesian coordinate system
 * @param {number} domainPoint.y - A location on a vertical line
 *                                 in a Cartesian coordinate system
 */
var calculateRangePoint = function(domainPoint) {
	
	// calculate range x
	var x = calculatePixelLocationOnLinearScale(domainPoint.x, domain.x, xRange, xAxisAscending);	
	x += xAxisAdjust.horizontal;
	
	// calculate range y
	var y = calculatePixelLocationOnLinearScale(domainPoint.y, domain.y, yRange, yAxisAscending);
	
	var rangePoint = { x : x, y : y };
	
	return rangePoint;
}

/*
 * Draw a horizontal mid-line on the chart.
 * 
 * @param {Object} chart - Reference to the SVG element in the DOM
 */
var drawMidlineHorizontal = function(chart) {

	var domainPointStart = { x : domain.x.min, y : domain.y.mid };
	var domainPointEnd = { x : domain.x.max, y : domain.y.mid };
	
	var rangePointStart = calculateRangePoint(domainPointStart);
	var rangePointEnd = calculateRangePoint(domainPointEnd);
	
	drawDottedLine(chart, "midwayHorizontal", rangePointStart, rangePointEnd);
}

/*
 * Draw a vertical mid-line on the chart.
 * 
 * @param {Object} chart - Reference to the SVG element in the DOM
 */
var drawMidlineVertical = function(chart) {

	var domainPointStart = { x : domain.x.mid, y : yDomain.min };
	var domainPointEnd = { x : domain.x.mid, y : yDomain.max };
	
	var rangePointStart = calculateRangePoint(domainPointStart);
	var rangePointEnd = calculateRangePoint(domainPointEnd);
	
	drawDottedLine(chart, "midwayVertical", rangePointStart, rangePointEnd);
}


/*
 * Determine if the input values map to the upper right quadrant 
 * of the Cartesian coordinate system for the existing domain.
 * 
 * @param {number} x - A domain location on a horizontal line
 *                     in a Cartesian coordinate system
 * @param {number} y - A domain location on a vertical line
 *                     in a Cartesian coordinate system
 */
var inQuadrantOne = function(x,y) {
    return x >= domain.x.mid && y >= domain.y.mid;
}

/*
 * Determine if the input values map to the upper left quadrant 
 * of the Cartesian coordinate system for the existing domain.
 * 
 * @param {number} x - A domain location on a horizontal line
 *                     in a Cartesian coordinate system
 * @param {number} y - A domain location on a vertical line
 *                     in a Cartesian coordinate system
 */
var inQuadrantTwo = function(x,y) {
    return x < domain.x.mid && y >= domain.y.mid;
}

/*
 * Determine if the input values map to the lower right quadrant 
 * of the Cartesian coordinate system for the existing domain.
 * 
 * @param {number} x - A domain location on a horizontal line
 *                     in a Cartesian coordinate system
 * @param {number} y - A domain location on a vertical line
 *                     in a Cartesian coordinate system
 */
var inQuadrantThree = function(x,y) {
    return x >= domain.x.mid && y < domain.y.mid;
}