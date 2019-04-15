var width =500;
var height= 500;



d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
    for (var i=0; i<csv.length; ++i) {
		csv[i].GPA = Number(csv[i].GPA);
		csv[i].SATM = Number(csv[i].SATM);
		csv[i].SATV = Number(csv[i].SATV);
		csv[i].ACT = Number(csv[i].ACT);
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });    

    
    var satExtents = {
	"SATM": satmExtent,
	"SATV": satvExtent
    }; 
    var actExtents = {
    "ACT": actExtent,
	"GPA": gpaExtent
    };


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);
 
    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);
     
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
  
    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    //Create SVGs and <g> elements as containers for charts
    var chart1G = d3.select("#chart1")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


    var chart2G = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


	 /******************************************/
		
	//ADD BRUSHING CODE HERE

		// Create a <g> element inside chartG as the brush container. This is to ensure that
		//    The brush comes first in the HTML (before the dots) and thus is behind the dots (the <circle>s),
		//    which is desirable because by being behind the dots the brush does not occlude the dots
		//    or prevent certain mouse interaction with the dots to work.
	var brushContainerG1 = chart1G.append('g')
			.attr('id', 'brush-container');

	var brushContainerG2 = chart2G.append('g')
			.attr('id', 'brush-container');


	var brush1 = d3.brush();
	var brush2 = d3.brush();
	       		// .extent([[-10, -10], [w + 10, h + 10]]); // This sets the boundary of the area
                      // where your brush can go. We add 10 pixels of extra space
                      // in each direction so that the brush can fully contain
                      // the dots on the edge - This is only for visual purposes 

	    // In the following three lines we bind event listeners to our brush.
		// The event handlers functions passed here will be called when you start, move, and end the brush, specifically:
		//    handleBrushStart(): will be called whenever you mousedown to start making a brush
		//    handleBrushMove():  will be called whenever you hold your mouse and drag the brush around or resize it
		//    handleBrushEnd():   will be called whenever you release your mouse
		//    -- play with the brush and check out the printed messages in the console.
		// The definitions of the three handler functions is at the bottom of this script. 
		//    You can also define the functions inline (as we've been doing in other situations), we define
		//    them separately here for better organization.
		// Note that how you call these functions doesn't matter, but it's always good to be explicit.
	brush1.on('start', handleBrushStart1)
			.on('brush', handleBrushMove1)
			.on('end', handleBrushEnd1);
	brush2.on('start', handleBrushStart2) // in-line alternative: .on('start', function() { // do stuff })
	      	.on('brush', handleBrushMove2)
	      	.on('end', handleBrushEnd2);

	

	brushContainerG1.call(brush1);
	brushContainerG2.call(brush2); // This is how we add the brush we created above to the container
		// Make sure you call it on a <g>, not on the <svg>. If you call it on a selection of the svg, 
		//  for example if you do svg.call(brush) here, you might not be able to click the elements 
		//  when the brush is on.
		// Also note how we made sure that the brush is behind the <circle>s. since we added the container brushContainerG first,
		//   brushContainerG is the first child of chartG and is before any <circle>s, so anything in we added to brushContainerG
		//   is going to be before the <circle>s in the HTML and thus behind the dots on the page.

	function handleBrushStart1() {
	  	console.log('%cBrush1 START!!', 'color: green');

	  	// We don't need to do anything here in our example. 
	  	// In other cases, for example, if there are multiple charts that each has an independent brush, 
	  	//    you might want to clear the existing brush whenever you start a new brush on a different chart,
	  	//    so that there is only one brush at any given time.
	  	brush2.move(brushContainerG2, null);
	}

	function handleBrushStart2() {
	  	console.log('%cBrush2 START!!', 'color: green');
	  	brush1.move(brushContainerG1, null);
	}

	function handleBrushMove1() {
  		console.log('%cBrush1 MOVING....', 'color: blue');
  
	  	// console.log(d3.event.selection); // check it out in the console!
	  	var sel = d3.event.selection;
	  	if (!sel) { 
	    	// sel is null when we clear the brush
	    	return;
	  	}

  		// The d3.event.selection contains the boundary of your current brush. It is a nested array that has 
  		//  the form [[x0, y0], [x1, y1]], where (x0, y0) is the coordinate of the top-left corner and 
  		//  (x1, y1) is the coordinate of the bottom right corner.

  		// You can also think is as [[left, top], [right, bottom]] if that is more intuitive to you

  		// Get the boundaries.
  		var [[left, top], [right, bottom]] = sel;
  		console.log({left, top, right, bottom})

  		// Check all the dots, highlight the ones inside the brush
  		d3.selectAll('.dot1')
    		.classed('dot--selected1', function(d) {
	      		var cx = xScale(d['SATM']);
	      		var cy = yScale(d['SATV']);
	      		return left <= cx && cx <= right && top <= cy && cy <= bottom;
    		});
  
  		d3.selectAll('.dot2')
    		.classed('dot--selected2', function(d) {
    			var cx = xScale(d['SATM']);
      			var cy = yScale(d['SATV']);
      			return left <= cx && cx <= right && top <= cy && cy <= bottom; 
    		});

    	// Check all the text entries, highlight the ones that corresponding to the dots inside the brush
  		// d3.selectAll('.title')
    // 		.classed('title--selected', function(d) {
    //   		// Note how the logic below works the same as above - since the text entries are bound with the same data,
    //   		// every text entry has all the information to compute the position of corresponding dot in the 
    //   		// scatter plot. You don't have to first "find" the points in the scatterplot and then determine where it is.
    //   		var cx = xScale(d['IMDb Rating']);
    //   		var cy = yScale(d['Gross($M)']);
    //   		return left <= cx && cx <= right && top <= cy && cy <= bottom;
    // 	});

	  // Note that we iterate through all the dots and text entries everytime the brush is moved.
	  // This may be inefficient when the number of elements is very large - but in our case it doesn't matter 
	  //    and it's worth trading the negligible performance gain for simpler algorithm and better readability.
	}

	function handleBrushMove2() {
  		console.log('%cBrush2 MOVING....', 'color: blue');
  
	  	// console.log(d3.event.selection); // check it out in the console!
	  	var sel = d3.event.selection;
	  	if (!sel) { 
	    	// sel is null when we clear the brush
	    	return;
	  	}

  		var [[left, top], [right, bottom]] = sel;
  		console.log({left, top, right, bottom})

  		// Check all the dots, highlight the ones inside the brush
  		d3.selectAll('.dot2')
    		.classed('dot--selected2', function(d) {
      		var cx = xScale2(d['ACT']);
      		var cy = yScale2(d['GPA']);
      		return left <= cx && cx <= right && top <= cy && cy <= bottom;
    		});

    	d3.selectAll('.dot1')
    		.classed('dot--selected1', function(d) {
	      		var cx = xScale2(d['ACT']);
	      		var cy = yScale2(d['GPA']);
	      		return left <= cx && cx <= right && top <= cy && cy <= bottom;
    		});
  
	}

	function handleBrushEnd1() {
	  console.log('%cBrush1 END!!', 'color: red');

	  // Clear existing styles when the brush is reset
	  if (!d3.event.selection) {
	    clearSelected();
	  }

	  // We don't need to do anything else here in our example. But if there is anything that only relies on the
	  //   end state of the brush and does not have to be updated in real time as the brush moves, then
	  //   you can do it here.
	}

	function handleBrushEnd2() {
	  console.log('%cBrus2 END!!', 'color: red');

	  // Clear existing styles when the brush is reset
	  if (!d3.event.selection) {
	    clearSelected();
	  }
	}

	function clearSelected() {
	  d3.selectAll('.dot1').classed('dot--selected1', false);
	  d3.selectAll('.dot2').classed('dot--selected2', false);
	}

	/******************************************/

	//add scatterplot points
    var temp1= chart1G.selectAll(".dot")
	    .data(csv)
	    .enter()
	    .append("circle")
	    .classed('dot1', true) // Always remember to add the class you select the elements with
	    .attr("id",function(d,i) {return i;} )
	    .attr("stroke", "black")
	    .attr("cx", function(d) { return xScale(d['SATM']); })
	    .attr("cy", function(d) { return yScale(d['SATV']); })
	    .attr("r", 5)
	    .on("click", function(d,i)
	    { 
	    	brush2.move(brushContainerG2, null);
	    	d3.selectAll('.dot1')
		   		.classed('dot--slected1', false);
		   	d3.select(this)
		   		.classed('dot--selected1', true);
	   		d3.selectAll('.dot2')
		   		.classed('dot--selected2', function(e) {
		      		return e==d;
	    		});
	   		d3.select('#satm').text(d.SATM);
	   		d3.select('#satv').text(d.SATV);
	   		d3.select('#act').text(d.ACT);
	   		d3.select('#gpa').text(d.GPA);
        });

    var temp2= chart2G.selectAll(".dot")
		.data(csv)
		.enter()
		.append("circle")
		.classed('dot2', true) // Always remember to add the class you select the elements with
		.attr("id",function(d,i) {return i;} )
		.attr("stroke", "black")
		.attr("cx", function(d) { return xScale2(d['ACT']); })
		.attr("cy", function(d) { return yScale2(d['GPA']); })
		.attr("r", 5)
		.on("click", function(d,i)
		{	
			brush1.move(brushContainerG1, null);

			d3.selectAll('.dot2')
		   		.classed('dot--selected2', false);
		   	d3.select(this)
		   		.classed('dot--selected2', true);
	   		d3.selectAll('.dot1')
		   		.classed('dot--selected1', function(e) {
		      		return e==d;
	    		});
	   		d3.select('#satm').text(d.SATM);
	   		d3.select('#satv').text(d.SATV);
	   		d3.select('#act').text(d.ACT);
	   		d3.select('#gpa').text(d.GPA);
        });
    


    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("SATM")
		.style("fill", "black");

    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("SATV")
		.style("fill", "black");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis2)
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("ACT")
		.style("fill", "black");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis2)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA")
		.style("fill", "black");
	});