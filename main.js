var width=1000;
var height=600;
var xaxis_height=500;

d3.csv("movies.csv", function(csv) {
	csv = csv.filter(function(d) {
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
	console.log(csv);

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


    console.log("imdb_score_max: " + imdb_score_max);
    console.log("imdb_score_min: " + imdb_score_min);

    console.log("title_year_max: " + title_year_max);
    console.log("title_year_min: " + title_year_min);

    console.log("budget_max: " + budget_max);
    console.log("budget_min: " + budget_min);

    console.log("gross_max: " + gross_max);
    console.log("gross_min: " + gross_min);

    console.log("duration_max: " + duration_max);
    console.log("duration_min: "  + duration_min);

    var parameters = [{id: "duration", max: duration_max, min: duration_min, weight: 1},
    				  {id: "imdb_score", max: imdb_score_max, min: imdb_score_min, weight: 1},
    				  {id: "title_year", max: title_year_max, min: title_year_min, weight: 1},
    				  {id: "budget", max: budget_max, min: budget_min, weight: 1},
    				  {id: "gross", max: gross_max, min: gross_min, weight: 1}];
    console.log(parameters);


    // var imdb_score_Extent = d3.extent(csv, function(d) { return d.imdb_score; });
    // var title_year_Extent = d3.extent(csv, function(d) { return d.title_year; });
    // var budget_Extent = d3.extent(csv,  function(d) { return d.budget;  });
    // var gross_Extent = d3.extent(csv,  function(d) {return d.gross;   });
    // var duration_Extent = d3.extent(csv,  function(d) {return d.duration;   });
    // console.log(duration_Extent);

    var xfunction_list = [];
    var yfunction_list = [];


    // Axis setup
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
            if(xnumAtts < 5){
                xnumAtts++;
                addXAttributes();
                updateXScale();
                updateXAxis();
                updateDots();
            }
        });

    chart2G = d3.select("#chart2")
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Add Y Attribute')
        .on('click', function() {
            if(ynumAtts < 5){
                ynumAtts++;
                addYAttributes();
            }
        });

    var xnumAtts=1;
    var ynumAtts=1;
    xfunction_list.push(parameters[0]); //make duration the first attribute of the page
    yfunction_list.push(parameters[0]); //make duration the first attribute of the page
    addXAttributes(); //initial call of add attributes to make duration the initial attribute with a weight of 1
    addYAttributes();

    function addXAttributes() {
        chart1G.selectAll("select").remove();

        var data = ["duration", "imdb_score", "title_year","gross","budget"];

        d3.select('#chart1')
            .append('input')
            .attr('type','text')
            .attr('name','xweight'+xnumAtts)
            .attr('class','xinput'+xnumAtts)
            .attr('id',function(d,i){return 'xweight'+xnumAtts;})
            .attr('value','1')
            .on('change',function(d,i){
                selectValue = d3.select(this).property('value');
                xfunction_list[this.id[7]-1].weight = +selectValue;
                updateXScale();
                updateXAxis();
                updateDots();

            }); 
            

        var select = d3.select('#chart1')
			            .append('select')
			            .attr('class','xselect'+xnumAtts)
			            .attr('id',function(d,i){return 'xselect'+xnumAtts;})
			            .on('change',function(d,i) {
			                // selectValue = d3.select(this).property('value');
			                // console.log(selectValue);
			             	// change dropdown
			                updateXScale();
			                updateXAxis();
			                updateDots();
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
            .attr('type','text')
            .attr('name','yweight'+ynumAtts)
            .attr('class','yinput'+ynumAtts)
            .attr('id',function(d,i){return 'yweight'+ynumAtts;})
            .attr('value','1')
            .on('change',function(d,i){
                selectValue = d3.select(this).property('value')
                yfunction_list[this.id[7]-1].weight = +selectValue;
                updateYScale();
                updateYAxis();
                updateDots();
            });

        var select = d3.select('#chart2')
			            .append('select')
			            .attr('class','yselect'+ynumAtts)
			            .attr('id',function(d,i){return 'yselect'+ynumAtts;})
			            .on('change',function(d,i) {
			                // selectValue = d3.select(this).property('value');
			                // console.log(selectValue);
			             	// change dropdown
			                updateYScale();
			                updateYAxis();
			                updateDots();
			            });

        var options = select.selectAll('option')
			            .data(data).enter()
			            .append('option')
			            .text(function (d) { return d; });
    }

    //Create chart3G which is going to hold the scatterplot
    var chart3G = d3.select("#chart3")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');
                    
    var chart5G = d3.select("#chart5")
	                .append("svg:svg")
	                .attr("width",20)
	                .attr("height",20)
                    .append('g');
                    
   
                    
                    
    var data2 = ["Action", "Adventure", "Animation", "Biography", "Crime", "Comedy", "Documentary", "Drama", "Family", "Fantasy", "History", 
    			"Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War",  "Western", ];                
    var select = d3.select('#chart5')
			            .append('select')
			            .attr('class','yselect'+ynumAtts)
			            .attr('id',function(d,i){return 'yselect'+ynumAtts;})
			            .on('change',function(d,i) {
			                 selectValue = d3.select(this).property('value');
			                 console.log(selectValue);
			             	// change dropdown
                            d3.selectAll(".dot2").classed('dot--selected', false);
			                d3.selectAll(".dot2").filter(function(d) { return d.genres.includes(selectValue); }).classed('dot--selected', true);
                            console.log(point);
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
                    .attr("cx", function(d) {
                    	var score = 0;
                    	for (var i = 0; i < xfunction_list.length; i++) {
                    		score += xfunction_list[i].weight*(d[xfunction_list[i].id]-xfunction_list[i].min)/(xfunction_list[i].max-xfunction_list[i].min)
                    	}
                    	return xScale(score); 
                    })
                    // .attr("cy", xaxis_height)
                    .attr("cy",function(d) {
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

                        d3.select('#movie').text(d.movie_title);
                        d3.select('#director').text(d.director_name);
                        d3.select('#gross').text(function() { return '$ '+formatComma(d.gross); });
                        d3.select('#budget').text(function() { return '$ '+formatComma(d.budget); });
                        d3.select('#imdb_score').text(function() { return formatComma(d.imdb_score); });
                        d3.select('#genre').text(d.genres);
                        d3.select('#duration').text(d.duration+" min");
                        d3.select('#year').text(d.title_year);
                    });

    //These are formatting functions for displaying info in chart4
    var formatComma = d3.format(","), 
    	formatDecimal = d3.format(".1f");

    // Draw the axis and labels the first time


    chart3G.append("g") // create a group node
		.attr("transform", "translate(0,"+xaxis_height+ ")")
		.attr("class", "x axis")
		.call(xAxis)

	chart3G.append("g") // create a group node
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

    chart3G.append("g") // create a group node
		.attr("transform", "translate(0,"+xaxis_height+ ")")
		//.call(xAxis)
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
        		xfunction_list.push(parameters[0]);
        	} else if (selectValue === parameters[1].id) {
        		xfunction_list.push(parameters[1]);
        	} else if (selectValue === parameters[2].id) {
        		xfunction_list.push(parameters[2]);
        	} else if (selectValue === parameters[3].id) {
        		xfunction_list.push(parameters[3]);
        	} else if (selectValue === parameters[4].id) {
        		xfunction_list.push(parameters[4]);
        	}
    	}
    	console.log("Updated xfunction_list in updateXScale():");
    	console.log(xfunction_list);

    	var weightTotal=0;
    	for (var i = 0; i<xfunction_list.length; i++) {
    		weightTotal+=xfunction_list[i].weight;
    	}

    	xScale = d3.scaleLinear().domain([0, weightTotal]).range([50, 500]);//xnumAtts should reflect the number of xattributes on the page
    	xAxis = d3.axisBottom().scale(xScale);
    }

    function updateYScale() {
    	yfunction_list = []; //clear the yfunction_list because we're about to read it from the webpage html

    	for (var i = 1; i <= ynumAtts; i++) {
    		var selectValue = d3.select('#yselect' + i).property('value');
    		//console.log(selectValue);
    		if (selectValue === parameters[0].id) {
        		yfunction_list.push(parameters[0]);
        	} else if (selectValue === parameters[1].id) {
        		yfunction_list.push(parameters[1]);
        	} else if (selectValue === parameters[2].id) {
        		yfunction_list.push(parameters[2]);
        	} else if (selectValue === parameters[3].id) {
        		yfunction_list.push(parameters[3]);
        	} else if (selectValue === parameters[4].id) {
        		yfunction_list.push(parameters[4]);
        	}
    	}
    	console.log("Updated yfunction_list in updatYScale():");
    	console.log(yfunction_list);

    	
    	var weightTotal=0;
    	for (var i = 0; i<yfunction_list.length; i++) {
    		weightTotal+=yfunction_list[i].weight;
    	}

    	yScale = d3.scaleLinear().domain([0, weightTotal]).range([500, 50]);//ynumAtts should reflect the number of yattributes on the page
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

});
