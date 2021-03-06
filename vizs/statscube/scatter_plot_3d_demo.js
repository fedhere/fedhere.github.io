// Create a 3d scatter plot within d3 selection parent.


function scatterPlot3d( parent)
{

  var color = d3.scale.linear()
    .domain([0, 1])
    .range([ "SteelBlue","IndianRed"]);

  var x3d = parent  
    .append("x3d")
      .style( "width", parseInt(parent.style("width"))+"px" )
      .style( "height", parseInt(parent.style("height"))+"px" )
      .style( "border", "none" )
      
  var scene = x3d.append("scene")

  scene.append("orthoviewpoint")
     .attr( "centerOfRotation", [5, 5, 5])
     .attr( "fieldOfView", [-5, -5, 15, 15])
     .attr( "orientation", [-0.5, 1, 0.2, 1.12*Math.PI/4])
     .attr( "position", [8, 4, 15])

  var rows = initializeDataGrid();
  var axisRange = [0, 10];
  var scales = [];
  var initialDuration = 0;
  var defaultDuration = 800;
  var ease = 'linear';
  var time = 0;
  var axisKeys = ['x','y','z']
  var axkeys = ['frequentist <==> bayesian','philosophical <==> pragmatic','subjective <==> objective']

  // Helper functions for initializeAxis() and drawAxis()
  function axisName( name, axisIndex ) {
      console.log("here", name);
    return ['x','y','z'][axisIndex] + name;
  }

  function constVecWithAxisValue( otherValue, axisValue, axisIndex ) {
    var result = [otherValue, otherValue, otherValue];
    result[axisIndex] = axisValue;
    return result;
  }

  // Used to make 2d elements visible
  function makeSolid(selection, color) {
    selection.append("appearance")
      .append("material")
         .attr("diffuseColor", color||"gray")
    return selection;
  }


  // Initialize the axes lines and labels.
  function initializePlot() {
    initializeAxis(0);
    initializeAxis(1);
    initializeAxis(2);
  }

  function initializeAxis( axisIndex )
  {
    var key = axisKeys[axisIndex];
    drawAxis( axisIndex, key, initialDuration );

    var scaleMin = axisRange[0];
    var scaleMax = axisRange[1];

    // the axis line
    var newAxisLine = scene.append("transform")
         .attr("class", axisName("Axis", axisIndex))
         .attr("rotation", ([[0,0,0,0],[0,0,1,Math.PI/2],[0,1,0,-Math.PI/2]][axisIndex]))
      .append("shape")
    newAxisLine
      .append("appearance")
      .append("material")
        .attr("emissiveColor", "lightgray")
    newAxisLine
      .append("polyline2d")
         // Line drawn along y axis does not render in Firefox, so draw one
         // along the x axis instead and rotate it (above).
        .attr("lineSegments", "0 0," + scaleMax + " 0")


   // axis labels
   var newAxisLabel = scene.append("transform")
       .attr("class", axisName("AxisLabel", axisIndex))
       .attr("translation", constVecWithAxisValue( 0, scaleMin + 1.1 * (scaleMax-scaleMin), axisIndex ))

   var newAxisLabelShape = newAxisLabel
     .append("billboard")
       .attr("axisOfRotation", "0 0 0") // face viewer
     .append("shape")
     .call(makeSolid)

   var labelFontSize = 0.6;

   newAxisLabelShape
     .append("text")
       .attr("class", axisName("AxisLabelText", axisIndex))
       .attr("solid", "true")
       .attr("string", axkeys[axisIndex])
    .append("fontstyle")
       .attr("size", labelFontSize)
       .attr("family", "SANS")
       .attr("justify", "END MIDDLE" )
  }

  // Assign key to axis, creating or updating its ticks, grid lines, and labels.
  function drawAxis( axisIndex, key, duration ) {

    var scale = d3.scale.linear()
      .domain( [-5,5] ) // demo data range
      .range( axisRange )
    
    scales[axisIndex] = scale;

    var numTicks = 8;
    var tickSize = 0.1;
    var tickFontSize = 0.5;

    // ticks along each axis
    var ticks = scene.selectAll( "."+axisName("Tick", axisIndex) )
       .data( scale.ticks( numTicks ));
    var newTicks = ticks.enter()
      .append("transform")
        .attr("class", axisName("Tick", axisIndex));
    newTicks.append("shape").call(makeSolid)
      .append("box")
        .attr("size", tickSize + " " + tickSize + " " + tickSize);
    // enter + update
    ticks.transition().duration(duration)
      .attr("translation", function(tick) { 
         return constVecWithAxisValue( 0, scale(tick), axisIndex ); })
    ticks.exit().remove();

    // tick labels
    var tickLabels = ticks.selectAll("billboard shape text")
      .data(function(d) { return [d]; });
    var newTickLabels = tickLabels.enter()
      .append("billboard")
         .attr("axisOfRotation", "0 0 0")     
      .append("shape")
      .call(makeSolid)
    newTickLabels.append("text")
      .attr("string", scale.tickFormat(10))
      .attr("solid", "true")
      .append("fontstyle")
        .attr("size", tickFontSize)
        .attr("family", "SANS")
        .attr("justify", "END MIDDLE" );
    tickLabels // enter + update
      .attr("string", scale.tickFormat(10))
    tickLabels.exit().remove();

    // base grid lines
    if (axisIndex==0 || axisIndex==2) {

      var gridLines = scene.selectAll( "."+axisName("GridLine", axisIndex))
         .data(scale.ticks( numTicks ));
      gridLines.exit().remove();
      
      var newGridLines = gridLines.enter()
        .append("transform")
          .attr("class", axisName("GridLine", axisIndex))
          .attr("rotation", axisIndex==0 ? [0,1,0, -Math.PI/2] : [0,0,0,0])
        .append("shape")

      newGridLines.append("appearance")
        .append("material")
          .attr("emissiveColor", "gray")
      newGridLines.append("polyline2d");

      gridLines.selectAll("shape polyline2d").transition().duration(duration)
        .attr("lineSegments", "0 0, " + axisRange[1] + " 0")

      gridLines.transition().duration(duration)
         .attr("translation", axisIndex==0
            ? function(d) { return scale(d) + " 0 0"; }
            : function(d) { return "0 0 " + scale(d); }
          )
    }  
  }

  // Update the data points (spheres) and stems.
  function plotData( duration ) {
    
    if (!rows) {
     console.log("no rows to plot.")
     return;
    }

    var x = scales[0], y = scales[1], z = scales[2];
    var sphereRadius = 0.2;

    // Draw a sphere at each x,y,z coordinate.
    var datapoints = scene.selectAll(".datapoint").data( rows );
    datapoints.exit().remove()

    //d3.json("cubevalues.json", function(data) {	
    var newDatapoints  = datapoints.enter()
      .append("transform")
        .attr("class", "datapoint")
        .attr("scale", [sphereRadius, sphereRadius, sphereRadius])
      .append("shape");
    newDatapoints
      .append("appearance")
      .append("material");
    newDatapoints
      .append("sphere")
	  .on("click", function() {
              d3.select(this).enter().append("text")
		  .text(function(d) {return d.x;})
		  .attr("x", function(d) {return x(d.x);})
		  .attr("y", function (d) {return y(d.y);}); });
       // Does not work on Chrome; use transform instead
       //.attr("radius", sphereRadius)

    datapoints.selectAll("shape appearance material")
        .attr("diffuseColor", function(row){
	    xx=+row[axisKeys[0]];
	    yy=+row[axisKeys[1]];
	    zz=+row[axisKeys[2]];
	    //console.log(xx,yy,zz,xx*xx+yy*yy+zz*zz);
	    //return color(Math.sqrt(xx*xx + yy*yy +  zz*zz));})
	    return color(row.color);})
    datapoints.transition().ease(ease).duration(duration)
        .attr("translation", function(row) { 
          return x(row[axisKeys[0]]) + " " + y(row[axisKeys[1]]) + " " + z(row[axisKeys[2]])})

    // Draw a stem from the x-z plane to each sphere at elevation y.
    // This convention was chosen to be consistent with x3d primitive ElevationGrid. 
    var stems = scene.selectAll(".stem").data( rows );
    stems.exit().remove();

    var newStems = stems.enter()
      .append("transform")
        .attr("class", "stem")
      .append("shape");
    newStems
      .append("appearance")
      .append("material")
        .attr("emissiveColor", "gray")
    newStems
      .append("polyline2d")
        .attr("lineSegments", function(row) { return "0 1, 0 0"; })

    stems.transition().ease(ease).duration(duration)
        .attr("translation", 
           function(row) { return   "0 0 0" ; })//"0 0 0";})
      //x(row[axisKeys[0]]) + " 0 " + z(row[axisKeys[2]]); })
        .attr("scale",
           function(row) { return x(row[axisKeys[0]]) +y(row[axisKeys[1]])+z(row[axisKeys[2]]);})//[ x(row[axisKeys[1]]),  y(row[axisKeys[1]]), z(row[axisKeys[1]])]; })
  }


  

  function initializeDataGrid() {
    var rows = [];
    // Follow the convention where y(x,z) is elevation.
    for (var tmp=0; tmp<=2; tmp+=1) {
        rows.push({x: 0, y: 0, z: 0});
     }
    return rows;
  }


 function updateData2() {
   d3.json("http://cosmo.nyu.edu/~fb55/vizs/statscube/cubevalues.json", function(data) {
      console.log(data[0]);  
    time = Math.PI;
    if ( x3d.node() && x3d.node().runtime ) {
	console.log("here");
	for (var r=0; r<data.length; ++r) {
	    console.log(data[r].x);
            rows[r].x = data[r].x;
            rows[r].z = data[r].z;
            rows[r].y = data[r].y;
	    rows[r].color=+data[r].age/100;
	}
      plotData( defaultDuration );
    } else {
      console.log('x3d not ready.');
    }});
  }


  initializeDataGrid();
  initializePlot();
  setInterval( updateData2(), defaultDuration );
}

       
