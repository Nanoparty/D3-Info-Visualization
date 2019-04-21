var width=1000;
var height=600;
var xaxis_height=500;

d3.csv("movies.csv", function(csv) {
	csv = csv.filter(function(d) { //filter out movies with incomplete info
	        if (   d.title_year==="null" || d.title_year===''
	        	|| d.budget==="null" 	 || d.budget===''
	        	|| d.gross==="null" 	 || d.gross===''
	        	|| d.duration==="null"	 || d.duration===''
	        	|| d.imdb_score==="null" || d.imdb_score==='' ) {
	            return false;
	        }
	        d.title_year = +d.title_year;
	        d.budget = +d.budget;
	        d.gross = +d.gross;
	        d.duration = +d.duration;
	        d.imdb_score = +d.imdb_score;
            d.height = null;

	        return true;
    	});
	//find all the max and min values for each attribute
    var imdb_score_max = d3.max(csv, function(d) { return d.imdb_score; });
    var imdb_score_min = d3.min(csv, function(d) { return d.imdb_score; });

    var title_year_max = d3.max(csv, function(d) { return d.title_year; });
    var title_year_min = d3.min(csv, function(d) { return d.title_year; });

    var budget_max = d3.max(csv, function(d) { return d.budget; });
    var budget_min = d3.min(csv, function(d) { return d.budget; });

    var gross_max = d3.max(csv, function(d) { return d.gross; });
    var gross_min = d3.min(csv, function(d) { return d.gross; });

    var duration_max = d3.max(csv, function(d) { return d.duration; });
    var duration_min = d3.min(csv, function(d) { return d.duration; });


    // create an array of nodes which represent each attrubute that will be in the dropdown menu
    // there is also an arbitrary starting weight
    var parameters = [{id: "duration", max: duration_max, min: duration_min, weight: 1},
    				  {id: "imdb_score", max: imdb_score_max, min: imdb_score_min, weight: 1},
    				  {id: "title_year", max: title_year_max, min: title_year_min, weight: 1},
    				  {id: "budget", max: budget_max, min: budget_min, weight: 1},
    				  {id: "gross", max: gross_max, min: gross_min, weight: 1}];


    var xfunction_list = [];
    var yfunction_list = [];


    // Axis setup
    // It is sufficient to make the domain [0,1] for the first time the axes are drawn because this is the range for the normalized
    // durations before weight is changed
    var xScale = d3.scaleLinear().domain([0, 1]).range([50, 500]);
    var yScale = d3.scaleLinear().domain([0, 1]).range([500, 50]);


    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    //Create chart1G where the the attribute boxes will go
    chart1G = d3.select("#chart1")
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Add X Attribute')
        .on('click', function() {
            if(xnumAtts < 5){ //can't add more than 5 attributes to the x position calculation
                xnumAtts++;
                addXAttributes();
                updateXScale();
                updateXAxis();
                updateDots();
                updateXFunction();
            }
        });

    chart2G = d3.select("#chart2")
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Add Y Attribute')
        .on('click', function() {
            if(ynumAtts < 5){ //can't add more than 5 attributes to the y position calculation
                ynumAtts++;
                addYAttributes();
                updateYScale();
                updateYAxis();
                updateDots();
                updateYFunction();
            }
        });

    var xnumAtts=1;
    var ynumAtts=1;
    xfunction_list.push(parameters[0]); //make duration the first x attribute of the page
    yfunction_list.push(parameters[0]); //make duration the first y attribute of the page
    addXAttributes(); //initial call of add attributes to make duration the initial attribute with a weight of 1
    addYAttributes();

    function addXAttributes() {
        chart1G.selectAll("select").remove();

        var data = ["duration", "imdb_score", "title_year","gross","budget"];

        d3.select('#chart1')
            .append('input')
            .attr('type','range')
            .attr('name','xweight'+xnumAtts)
            .attr('class','xinput'+xnumAtts)
            .attr("min", -1)
			.attr("max", 1)
            .attr("step", ".1")
            .attr('id',function(d,i){return 'xweight'+xnumAtts;})
            .attr('value','1')
            .on('change',function(d,i){
                // only call update functions, the update functions read in the new function_list from the webpage
                updateXScale();
                updateXAxis();
                updateDots();
                updateXFunction();

            }); 
            

        var select = d3.select('#chart1')
            .append('select')
            .attr('class','xselect'+xnumAtts)
            .attr('id',function(d,i){return 'xselect'+xnumAtts;})
            .on('change',function(d,i) {
                // only call update functions, the update functions read in the new function_list from the webpage
                updateXScale();
                updateXAxis();
                updateDots();
                updateXFunction();
            });

        var options = select.selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function (d) { return d; });
    }

    function addYAttributes() {
        chart2G.selectAll("select").remove();

        var data = ["duration", "imdb_score", "title_year","gross","budget"];

       	d3.select('#chart2')
            .append('input')
            .attr('type','range')
            .attr("min", -1)
			.attr("max", 1)
            .attr("step", ".1")
            .attr('name','yweight'+ynumAtts)
            .attr('class','yinput'+ynumAtts)
            .attr('id',function(d,i){return 'yweight'+ynumAtts;})
            .attr('value','1')
            .on('change',function(d,i){
                // only call update functions, the update functions read in the new function_list from the webpage
                updateYScale();
                updateYAxis();
                updateDots();
                updateYFunction();
            });

        var select = d3.select('#chart2')
            .append('select')
            .attr('class','yselect'+ynumAtts)
            .attr('id',function(d,i){return 'yselect'+ynumAtts;})
            .on('change',function(d,i) {
                // only call update functions, the update functions read in the new function_list from the webpage
                updateYScale();
                updateYAxis();
                updateDots();
                updateYFunction();
            });

        var options = select.selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function (d) { return d; });
    }



    //Create chart3G which is going to hold the scatterplot
    var chart3G = d3.select("#chart3")
    	.attr("width",width)
    	.attr("height",height)
        .append("svg:svg")
        .attr('id', 'plot')
        .attr("width",550)
        .attr("height",height)
        .attr("style", "float:left")
        .append('g');

    // Display the Functions the first time
    var functions = d3.select("#function")
		.append("div")
		.attr('id', 'xfunction')
		.text(function() {
			var string = "X function = ";
			for (var i = 0; i<xfunction_list.length; i++) {
				string += xfunction_list[i].weight + " x " + xfunction_list[i].id + " + ";
			}
			return string.slice(0, string.length-3);
		});

    d3.select("#function")
		.append("div")
		.attr('id', 'yfunction')
		.text(function() {
			var string = "Y function = ";
			for (var i = 0; i<yfunction_list.length; i++) {
				string += yfunction_list[i].weight + " x " + yfunction_list[i].id + " + ";
			}
			return string.slice(0, string.length-3);
		});

                    
    var chart5G = d3.select("#chart3")
        .append("div")
        .attr('id', "genreChoice")
        .text("Highlight Genre:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "movie")
    .text("Movie Title:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "director")
    .text("Director:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "budget")
    .text("Budget:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "gross")
    .text("Gross:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "imdb_score")
    .text("IMDb Score:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "genre")
    .text("Genre:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "duration")
    .text("Duration:");

    d3.select("#chart3")
    .append('div')
    .attr('id', "year")
    .text("Release Year:");
                                
    var data2 = ["Action", "Adventure", "Animation", "Biography", "Crime", "Comedy", "Documentary", "Drama", "Family", "Fantasy", "History", 
    			"Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War",  "Western"];

    var select = d3.select('#genreChoice')
			            .append('select')
			            .attr('class','yselect'+ynumAtts)
			            .attr('id',function(d,i){return 'yselect'+ynumAtts;})
			            .on('change',function(d,i) {
			                 selectValue = d3.select(this).property('value');
			                 console.log(selectValue);
			             	// change dropdown
                            d3.selectAll(".dot2").classed('dot--selected', false);
			                d3.selectAll(".dot2").filter(function(d) { return d.genres.includes(selectValue); }).classed('dot--selected', true);
                            
			            });

    var options2 = select.selectAll('option')
	    .data(data2).enter()
	    .append('option')
	    .text(function (d) { return d; });
                        
            

	//These are formatting functions for displaying info in chart4, but it's actually updated in the "on click" function
    var formatComma = d3.format(","), 
    	formatDecimal = d3.format(".1f");

    //populate the graph based on this function
    var temp3 = chart3G.selectAll(".dot")
                    .data(csv)
                    .enter()
                    .append("circle")
                    .classed('dot2', true) // Always remember to add the class you select the elements with
                    .attr("id",function(d,i) {return 'dot2-' + i;;} )
                    .attr("stroke", "black")
                    .attr("cx", function(d) {//This is how the scatterplot is drawn the first time, from now on, the dots are updated in updateDots();
                    	var score = 0;
                    	for (var i = 0; i < xfunction_list.length; i++) {
                    		score += xfunction_list[i].weight*(d[xfunction_list[i].id]-xfunction_list[i].min)/(xfunction_list[i].max-xfunction_list[i].min)
                    	}
                    	return xScale(score); 
                    })
                    .attr("cy",function(d) {//This is how the scatterplot is drawn the first time, from now on, the dots are updated in updateDots();
                    	var score = 0;
                    	for (var i = 0; i < yfunction_list.length; i++) {
                    		score += yfunction_list[i].weight*(d[yfunction_list[i].id]-yfunction_list[i].min)/(yfunction_list[i].max-yfunction_list[i].min)
                    	}
                    	return yScale(score); 
			        })
                    .attr("r", 5)
                    .on("click", function(d,i)
                    {
                        d3.selectAll('.dot2')
                            .classed('dot--selected', false);
                        d3.select(this)
                            .classed('dot--selected', true);

                        d3.select('#movie').text("Movie Title: "+d.movie_title);
                        d3.select('#director').text("Director: "+d.director_name);
                        d3.select('#gross').text(function() { return 'Gorss: $ '+formatComma(d.gross); });
                        d3.select('#budget').text(function() { return 'Budget: $ '+formatComma(d.budget); });
                        d3.select('#imdb_score').text(function() { return "Imdb Score: "+ formatComma(d.imdb_score); });
                        d3.select('#genre').text("Genre: "+d.genres);
                        d3.select('#duration').text("Duration: "+d.duration+" min");
                        d3.select('#year').text("Release Year: "+d.title_year);
                    });

    // Draw the axis and labels the first time
    chart3G.append("g") 
		.attr("transform", "translate(0,"+xaxis_height+ ")")
		.attr("class", "x axis")
		.call(xAxis)

	chart3G.append("g") 
		.attr("transform", "translate(50, 0)")
		.attr("class", "y axis")
		.call(yAxis)

	chart3G.append("text")
	.attr("transform", "translate(0,"+xaxis_height+ ")")
		.attr("class", "label")
		.attr("x", 500)
		.attr("y", 30)
		.style("text-anchor", "end")
		.text("High Favorability")
		.style("fill", "black");

    chart3G.append("g") 
		.attr("transform", "translate(0,"+xaxis_height+ ")")
		.append("text")
		.attr("class", "label")
		.attr("x", 140)
		.attr("y", 30)
		.style("text-anchor", "end")
		.text("Low Favorability")
		.style("fill", "black");

    chart3G.append("text")
        .attr("x", (400))
        .attr("y", (25))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Movie Favorability Graph");    

        


    function updateXScale() {
    	xfunction_list = []; //clear the xfunction_list because we're about to read it from the webpage html

    	for (var i = 1; i <= xnumAtts; i++) {
    		var selectValue = d3.select('#xselect' + i).property('value');
    		//console.log(selectValue);
    		if (selectValue === parameters[0].id) {
        		xfunction_list.push({id: parameters[0].id, max: parameters[0].max, min: parameters[0].min, weight:d3.select('#xweight' + i).property('value')});
        	} else if (selectValue === parameters[1].id) {
        		xfunction_list.push({id: parameters[1].id, max: parameters[1].max, min: parameters[1].min, weight:d3.select('#xweight' + i).property('value')});
        	} else if (selectValue === parameters[2].id) {
        		xfunction_list.push({id: parameters[2].id, max: parameters[2].max, min: parameters[2].min, weight:d3.select('#xweight' + i).property('value')});
        	} else if (selectValue === parameters[3].id) {
        		xfunction_list.push({id: parameters[3].id, max: parameters[3].max, min: parameters[3].min, weight:d3.select('#xweight' + i).property('value')});
        	} else if (selectValue === parameters[4].id) {
        		xfunction_list.push({id: parameters[4].id, max: parameters[4].max, min: parameters[4].min, weight:d3.select('#xweight' + i).property('value')});
        	}
    	}
    	console.log("Updated xfunction_list in updateXScale():");
    	console.log(xfunction_list);

    	var potential_max=0;
    	var potential_min=0;
    	for (var i = 0; i<xfunction_list.length; i++) {
    		if (xfunction_list[i].weight >0) {
    			potential_max+= +xfunction_list[i].weight;
    		} else {
    			potential_min+= +xfunction_list[i].weight;
    		}
    	}

    	xScale = d3.scaleLinear().domain([potential_min, potential_max]).range([50, 500]);
    	xAxis = d3.axisBottom().scale(xScale);
    }

    function updateYScale() {
    	yfunction_list = []; //clear the yfunction_list because we're about to read it from the webpage html

    	for (var i = 1; i <= ynumAtts; i++) {
    		var selectValue = d3.select('#yselect' + i).property('value');
    		//console.log(selectValue);
    		if (selectValue === parameters[0].id) {
        		yfunction_list.push({id: parameters[0].id, max: parameters[0].max, min: parameters[0].min, weight:d3.select('#yweight' + i).property('value')});
        	} else if (selectValue === parameters[1].id) {
        		yfunction_list.push({id: parameters[1].id, max: parameters[1].max, min: parameters[1].min, weight:d3.select('#yweight' + i).property('value')});
        	} else if (selectValue === parameters[2].id) {
        		yfunction_list.push({id: parameters[2].id, max: parameters[2].max, min: parameters[2].min, weight:d3.select('#yweight' + i).property('value')});
        	} else if (selectValue === parameters[3].id) {
        		yfunction_list.push({id: parameters[3].id, max: parameters[3].max, min: parameters[3].min, weight:d3.select('#yweight' + i).property('value')});
        	} else if (selectValue === parameters[4].id) {
        		yfunction_list.push({id: parameters[4].id, max: parameters[4].max, min: parameters[4].min, weight:d3.select('#yweight' + i).property('value')});
        	}
    	}
    	console.log("Updated yfunction_list in updatYScale():");
    	console.log(yfunction_list);

    	var potential_max=0;
    	var potential_min=0;
    	for (var i = 0; i<yfunction_list.length; i++) {
    		if (yfunction_list[i].weight >0) {
    			potential_max+= +yfunction_list[i].weight;
    		} else {
    			potential_min+= +yfunction_list[i].weight;
    		}
    	}

    	
    	yScale = d3.scaleLinear().domain([potential_min, potential_max]).range([500, 50]);//ynumAtts should reflect the number of yattributes on the page
    	yAxis = d3.axisLeft().scale(yScale);
    }

    function updateXAxis() {
    	chart3G.select(".x.axis")
	        .transition()
	        .duration(1000)
	        .call(xAxis);
	}

	function updateYAxis() {
    	chart3G.select(".y.axis")
	        .transition()
	        .duration(1000)
	        .call(yAxis);
    }

    function updateDots() {
        temp3.attr("cx", function(d) {
            	var score = 0;
            	for (var i = 0; i < xfunction_list.length; i++) {
            		score += xfunction_list[i].weight*(d[xfunction_list[i].id]-xfunction_list[i].min)/(xfunction_list[i].max-xfunction_list[i].min)
            	}
        		return xScale(score); 
        	})
        temp3.attr("cy", function(d) {
            	var score = 0;
            	for (var i = 0; i < yfunction_list.length; i++) {
            		score += yfunction_list[i].weight*(d[yfunction_list[i].id]-yfunction_list[i].min)/(yfunction_list[i].max-yfunction_list[i].min)
            	}
        		return yScale(score); 
        	})
    }

    function updateXFunction() { //changes the displayed function to reflect the most current fucntion_list.
    	d3.select('#xfunction')
    	.text(function() {
    		var string = "X function = ";
    		for (var i = 0; i<xfunction_list.length; i++) {
    			string += xfunction_list[i].weight + " x " + xfunction_list[i].id + " + ";
    		}
    		return string.slice(0, string.length-3);
    	});
    }

    function updateYFunction() { //changes the displayed function to reflect the most current fucntion_list.
    	d3.select('#yfunction')
    	.text(function() {
    		var string = "Y function = ";
    		for (var i = 0; i<yfunction_list.length; i++) {
    			string += yfunction_list[i].weight + " x " + yfunction_list[i].id + " + ";
    		}
    		return string.slice(0, string.length-3);
    	});
    }

});
