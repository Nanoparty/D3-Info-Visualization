var width =1000;
var height= 500;

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
    var duration_Extent = d3.extent(csv,  function(d) {return d.duration;   });
    //console.log(duration_Extent);

    var function_list = [];


    // Axis setup
    var xScale = d3.scaleLinear().domain([0, 1]).range([50, 800]);
    //this xscale is not used bc it is written over in createAxis(), but needs to be here do keep d3 from complaining
    var yScale = d3.scaleLinear().domain([0, 1]).range([470, 30]);


    var xAxis = d3.axisBottom().scale(xScale);
    //this xaxis is not used bc it is written over in createAxis(), but needs to be here do keep d3 from complaining
    var yAxis = d3.axisLeft().scale(yScale);

    //Create chart1G where the the attribute boxes will go
    chart1G = d3.select("#chart1")
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Add Attribute')
        .on('click', function() {
            if(numAtts < 5){
                numAtts++;
                addAttributes();
            }
        });

    var numAtts= 0;
    function_list.push(parameters[0]); //make duration the first attribute of the page
    addAttributes(); //initial call of add attributes to make duration the initial attribute with a weight of 1

    function addAttributes() {
        chart1G.selectAll("select").remove();

        var data = ["duration", "imdb_score", "title_year","gross","budget"];

        numAtts++;

        d3.select('#chart1')
            .append('input')
            .attr('type','text')
            .attr('name','weight'+numAtts)
            .attr('class','input'+numAtts)
            .attr('id',function(d,i){return 'weight' + numAtts;})
            .attr('value','1')
            .on('change',function(d,i){
                selectValue = d3.select(this).property('value')
                console.log(selectValue)
                selectValue2 = d3.select('#select' + i).property('value')
                console.log(selectValue2) 
            });

        var select = d3.select('#chart1')
			            .append('select')
			            .attr('class','select' + numAtts)
			            .attr('id',function(d,i){return 'select' + numAtts;})
			            .on('change',function(d,i) {
			                // selectValue = d3.select(this).property('value');
			                // console.log(selectValue);
			             	// change dropdown
			                updateScale();
			                updateAxis();
			                updateDots();
			            });

        var options = select.selectAll('option')
			            .data(data).enter()
			            .append('option')
			            .text(function (d) { return d; });
    }

    //Create chart2G which is going to hold the scatterplot
    var chart2G = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');

//These are formatting functions for displaying info in chart3, but it's actually updated in the "on click" function
    var formatComma = d3.format(","), 
    	formatDecimal = d3.format(".1f");

    //populate the graph based on this function
    var temp2 = chart2G.selectAll(".dot")
                    .data(csv)
                    .enter()
                    .append("circle")
                    .classed('dot2', true) // Always remember to add the class you select the elements with
                    .attr("id",function(d,i) {return i;} )
                    .attr("stroke", "black")
                    .attr("cx", function(d) {
                    	var score = 0;
                    	for (var i = 0; i < function_list.length; i++) {
                    		score += (d[function_list[i].id]-function_list[i].min)/(function_list[i].max-function_list[i].min)
                    	}
                    	return xScale(score); })
                    .attr("cy", height - 30.0-100)
                    .attr("r", 5)
                    .on("click", function(d,i)
                    {
                        d3.selectAll('.dot2')
                            .classed('dot--selected', false);
                        d3.select(this)
                            .classed('dot--selected', true);

                        d3.select('#movie').text(d.movie_title);
                        d3.select('#director').text(d.director_name);
                        d3.select('#gross').text(function() { return '$ ' + formatComma(d.gross); });
                        d3.select('#budget').text(function() { return '$ ' + formatComma(d.budget); });
                        d3.select('#imdb_score').text(function() { return formatComma(d.imdb_score); });
                        d3.select('#genre').text(d.genres);
                        d3.select('#duration').text(d.duration + " min");
                        d3.select('#year').text(d.title_year);
                    });

    //These are formatting functions for displaying info in chart3
    var formatComma = d3.format(","), 
    	formatDecimal = d3.format(".1f");

    // Draw the axis and labels the first time


    chart2G.append("g") // create a group node
			.attr("transform", "translate(0,"+ (450)+ ")")
			.attr("class", "x axis")
			.call(xAxis)
			.append("text")
			.attr("class", "label")
			.attr("x", width-200)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("High Favorability")
			.style("fill", "black");

    chart2G.append("g") // create a group node
		.attr("transform", "translate(0,"+ (450)+ ")")
		//.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", 150)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Low Favorability")
		.style("fill", "black");

    chart2G.append("text")
        .attr("x", (400))
        .attr("y", (100))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Movie Favorability Graph");    

        


    function updateScale() {
    	function_list = []; //clear the function_list because we're about to read it from the webpage html

    	for (var i = 1; i <= numAtts; i++) {
    		var selectValue = d3.select('#select' + i).property('value');
    		//console.log(selectValue);
    		if (selectValue === parameters[0].id) {
        		function_list.push(parameters[0]);
        	} else if (selectValue === parameters[1].id) {
        		function_list.push(parameters[1]);
        	} else if (selectValue === parameters[2].id) {
        		function_list.push(parameters[2]);
        	} else if (selectValue === parameters[3].id) {
        		function_list.push(parameters[3]);
        	} else if (selectValue === parameters[4].id) {
        		function_list.push(parameters[4]);
        	}
    	}
    	console.log("Updated function_list in updateScale():");
    	console.log(function_list);

    	xScale = d3.scaleLinear().domain([0, numAtts]).range([50, 800]);//numAtts should reflect the number of attributeson the page
    	xAxis = d3.axisBottom().scale(xScale);
    }

    function updateAxis() {
    	chart2G.select(".x.axis")
	        .transition()
	        .duration(1000)
	        .call(xAxis);
    }

    function updateDots() {
        temp2.attr("cx", function(d) {
            	var score = 0;
            	for (var i = 0; i < function_list.length; i++) {
            		score += (d[function_list[i].id]-function_list[i].min)/(function_list[i].max-function_list[i].min)
            	}
        		return xScale(score); 
        	})
    }

});
