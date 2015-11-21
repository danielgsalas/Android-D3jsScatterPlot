
/*
 * Calculate a visually pleasing number of ticks on a linear axis.
 * 
 * @param {Object} domain - The min and max values of the real-world values
 * @param {number} domain.min - The minimum value in the domain
 * @param {number} domain.max - The maximum value in the domain
 * 
 * @param {number} maxTickCount - Maximum number of ticks for the axis
 * @param {number} divisor - Number used to recursively reduce the tick count
 */
var calculateLinearTickCount = function(domain, maxTickCount, divisor) {
	
  var tickCount = domain.max - domain.min;

  while (tickCount > maxTickCount) {
      tickCount /= divisor;
  }
  
  return tickCount;
}

/*
 * Calculate where a value (between min and max display) should be placed on the chart 
 * with a given min/max pixel adjustment. The calculation is for either X or Y axis.
 * 
 * @param {number} domainValue - A number in the real world
 * 
 * @param {Object} domain - The min and max values of the real-world values
 * @param {number} domain.min - The minimum value of the domain values
 * @param {number} domain.max - The maximum value of the domain values
 * 
 * @param {Object} range - The min and max values of the display values
 * @param {Object} range.min - The minimum value of the display values
 * @param {Object} range.max - The maximum value of the display values
 * 
 * @param {boolean} ascendingScale - Specifies if the scale should order
 *                                   the numbers ascending from left to right
 *                                   (for a horizontal axis) or top to bottom
 *                                   (for a vertical axis).
 */
var calculatePixelLocationOnLinearScale = function(
  domainValue, domain, range, ascendingScale) {
	
  var decimalOfRange = (domainValue - domain.min) / (domain.max - domain.min);
  var rangeDiff = range.max - range.min;
  var rangeLocation;
  
  if (ascendingScale) {
	  rangeLocation = range.min + rangeDiff * decimalOfRange;
  }
  else {
	  rangeLocation = range.max - rangeDiff * decimalOfRange;	  
  }
    
  return rangeLocation;
}

/*
 * Draw a circular data point to the chart.
 * 
 * @param {Object} chart - Reference to the SVG element in the DOM
 * 
 * @param {Object} rangePoint - The display location of the point
 * @param {number} rangePoint.x - Location of the point on the horizontal scale
 * @param {number} rangePoint.y - Location of the point on the vertical scale
 * 
 * @param {number} radius - The circle's radius in pixels
 * @param {string} cssStyle - Reference to a class in a cascading style sheet
 */ 
var drawDataPointOnChart = function(chart, rangePoint, radius, cssStyle) {
    
    if (rangePoint.x > -1 && rangePoint.y > -1) {
    	
    	chart.append("circle")
   	         .attr("cx", rangePoint.x)
   	         .attr("cy", rangePoint.y)
   	         .attr("r", radius)
   	         .attr("id", "dataPoint")
   	         .attr("class", cssStyle)
    }
}

/*
 * Draw a dotted line on the chart from pointOne to pointTwo.
 * 
 * @param {Object} chart - Reference to the SVG element in the DOM
 * @param {string} lineId - Id of the line in the DOM
 * 
 * @param {Object} pointOne - Display location of the "from" point
 * @param {number} pointOne.x - Location of the point on the horizontal scale
 * @param {number} pointOne.y - Location of the point on the vertical scale
 * 
 * @param {Object} pointTwo - Display location of the "to" point
 * @param {number} pointTwo.x - Location of the point on the horizontal scale
 * @param {number} pointTwo.y - Location of the point on the vertical scale
 */
var drawDottedLine = function(chart, lineId, pointOne, pointTwo) {

  chart.append("line")
    .style("stroke", "gray")
    .style("stroke-dasharray", ("2, 2"))
    .attr("id", lineId)
    .attr("x1", pointOne.x)
    .attr("y1", pointOne.y)
    .attr("x2", pointTwo.x)
    .attr("y2", pointTwo.y);
}

/*
 * Draw an X axis with its labels and tick marks.
 * 
 * @param {Object} chart - Reference to the SVG element in the DOM
 * 
 * @param {Object} xDomain - The min and max values of the real-world values
 * @param {number} xDomain.min - The minimum value of the domain values
 * @param {number} xDomain.max - The maximum value of the domain values
 * 
 * @param {Object} xRange - The min and max values of the display values
 * @param {number} xRange.min - The minimum value of the display values
 * @param {number} xRange.max - The maximum value of the display values
 * 
 * @param {Object} xAxisAdjust - Display adjustment for the X axis
 * @param {number} xAxisAdjust.horizontal - Horizontal display adjustment
 * @param {number} xAxisAdjust.vertical - Vertical display adjustment
 * 
 * @param {boolean} ascendingScale - Specifies if the scale should order
 *                                   the numbers ascending from left to right
 *                                   (for a horizontal axis) or top to bottom
 *                                   (for a vertical axis).
 */
var drawXAxis = function(chart, xDomain, xRange, xAxisAdjust, ascendingScale) {

    var maxTickCount = 5;
    var tickCalculationDivisor = 2;
    var tickCount = calculateLinearTickCount(xDomain, maxTickCount, tickCalculationDivisor);

    var xScale = initLinearScale(xDomain, xRange, ascendingScale);    
    var xAxis = initLinearAxis(xScale, "bottom", tickCount);
    
    chart.append("svg:g")
       .call(xAxis)
       .attr("id","xAxis")
       .attr("transform","translate(" + xAxisAdjust.horizontal + "," + xAxisAdjust.vertical + ")")
       .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px' });
}

/*
 * Draw a Y axis with its labels and tick marks.
 * 
 * @param {Object} chart - Reference to the SVG element in the DOM
 * 
 * @param {Object} yDomain Domain - The min and max values of the real-world values
 * @param {number} yDomain.min - The minimum value of the domain values
 * @param {number} yDomain.max - The maximum value of the domain values
 * 
 * @param {Object} yRange - The min and max values of the display values
 * @param {number} yRange.min - The minimum value of the display values
 * @param {number} yRange.max - The maximum value of the display values
 * 
 * @param {Object} yAxisAdjust - Display adjustment for the Y axis
 * @param {number} yAxisAdjust.horizontal - Horizontal display adjustment
 * @param {number} yAxisAdjust.vertical - Vertical display adjustment
 * 
 * @param {boolean} ascendingScale - Specifies if the scale should order
 *                                   the numbers ascending from left to right
 *                                   (for a horizontal axis) or top to bottom
 *                                   (for a vertical axis).
 */
var drawYAxis = function(chart, yDomain, yRange, yAxisAdjust, ascendingScale) {

  var maxTickCount = 15;
  var tickCalculationDivisor = 2;
  var tickCount = calculateLinearTickCount(yDomain, maxTickCount, tickCalculationDivisor);
	  
  var yScale = initLinearScale(yDomain, yRange, ascendingScale);     
  var yAxis = initLinearAxis(yScale, "left", tickCount);

  chart.append("svg:g")
       .call(yAxis)
       .attr("id","yAxis")
       .attr("transform","translate(" + yAxisAdjust.horizontal + "," + yAxisAdjust.vertical + ")")
       .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px' });
}

/*
 * Initialize a linear axis with the given scale,
 * label orientation and tick count.
 * 
 * @param {Object} scale - Reference to a scale object
 * 
 * @param {Object} labelOrientation - Orientation of the labels. Value values
 *                                    include left, right, bottom, top.
 * 
 * @param {number} tickCount - Count of tick marks (and their labels)
 *                             along the axis.
 */
var initLinearAxis = function (scale, labelOrientation, tickCount) {

  return d3.svg.axis()
           .scale(scale)
           .orient(labelOrientation)
           .ticks(tickCount);
}

/*
 * Initialize a linear scale for the chart.
 * 
 * @param {Object} domain - The min and max values of the real-world values
 * @param {number} domain.min - The minimum value of the domain values
 * @param {number} domain.max - The maximum value of the domain values
 * 
 * @param {Object} range - The min and max values of the display values
 * @param {number} range.min - The minimum value of the display values
 * @param {number} range.max - The maximum value of the display values
 * 
 * @param {boolean} ascendingScale - Specifies if the scale should order
 *                                   the numbers ascending from left to right
 *                                   (for a horizontal axis) or top to bottom
 *                                   (for a vertical axis).
 */
var initLinearScale = function(domain, range, ascendingScale) {
  var scale;
  
  if (ascendingScale) {
	  scale = d3.scale.linear()
                 .range([range.min, range.max])
                 .domain([domain.min, domain.max]);
    
  }
  else {
	  scale = d3.scale.linear()
                .range([range.min, range.max])
                .domain([domain.max, domain.min]);
  }
  
  return scale;
}
