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

    var parameters = [{id: "imdb_score", max: imdb_score_max, min: imdb_score_min, weight: 1},
    				  {id: "title_year", max: title_year_max, min: title_year_min, weight: 1},
    				  {id: "budget", max: budget_max, min: budget_min, weight: 1},
    				  {id: "gross", max: gross_max, min: gross_min, weight: 1},
    				  {id: "duration", max: duration_max, min: duration_min, weight: 1}];
    console.log(parameters);


    var imdb_score_Extent = d3.extent(csv, function(d) { return d.imdb_score; });
    var title_year_Extent = d3.extent(csv, function(d) { return d.title_year; });
    var budget_Extent = d3.extent(csv,  function(d) { return d.budget;  });
    var gross_Extent = d3.extent(csv,  function(d) {return d.gross;   });
    var duration_Extent = d3.extent(csv,  function(d) {return (d.duration-duration_min)/(duration_max-duration_min);   });
    console.log("duration_Extent: " + duration_Extent);


    // Axis setup
    var xScale = d3.scaleLinear().domain(duration_Extent).range([50, 800]);
    var yScale = d3.scaleLinear().domain([0, 1]).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    /*
    var listOfObjects = [];
	var a = ["car", "bike", "scooter"];
	a.forEach(function(entry) {
	    var singleObj = {};
	    singleObj['type'] = 'vehicle';
	    singleObj['value'] = entry;
	    listOfObjects.push(singleObj);
	});
	*/

	// This is going to be the object which will act as list of objects that looks like parameters.
	var function_list = [];

    //Create SVGs and <g> elements as containers for charts
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

    var numAtts = 1;
    addAttributes();

    function addAttributes(){
        chart1G.selectAll("select").remove()

        var data = ["Duration", "IMDB Score", "Year","Gross Revenue","Budget"];

            d3.select('#chart1')
            .append('input')
            .attr('type','text')
            .attr('name','weight'+numAtts)
            .attr('class','input'+numAtts)
            .attr('id',function(d,i){return 'weight-' + i;})
            .attr('value','1')
            .on('change',function(d,i){
                selectValue = d3.select(this).property('value')
                console.log(selectValue)
                selectValue2 = d3.select('#select-' + i).property('value')
                console.log(selectValue2)
                
                
            });

            var select = d3.select('#chart1')
            .append('select')
            .attr('class','select' + numAtts)
            .attr('id',function(d,i){return 'select-' + i;})
            .on('change',function(d,i){
                selectValue = d3.select(this).property('value')
                console.log(selectValue)
                selectValue2 = d3.select('#weight-' + i).property('value')
                console.log(selectValue2)
            });

            var options = select
            .selectAll('option')
            .data(data).enter()
            .append('option')
                .text(function (d) { return d; });



        for(var i = 0;i < numAtts;i++){
            console.log("set listener");
           function onchange() {
            selectValue = d3.select('select'+numAtts).property('value')
            console.log(selectValue+"value")
            };

        }

    }

    var chart2G = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');

	//add scatterplot points
    /* var temp1= chart1G.selectAll(".dot")
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
        }); */

    var formatComma = d3.format(","),
    	formatDecimal = d3.format(".1f");

    var temp2 = chart2G.selectAll(".dot")
				.data(csv)
				.enter()
				.append("circle")
				.classed('dot2', true) // Always remember to add the class you select the elements with
				.attr("id",function(d,i) {return i;} )
				.attr("stroke", "black")
				.attr("cx", function(d) { return xScale((d['duration']-duration_min)/(duration_max-duration_min)); })
				.attr("cy", height - 30.0-100)
				.attr("r", 5)
				.on("click", function(d,i)
				{
					 d3.selectAll('.dot2')
				   		.classed('dot--selected', false);
				   	d3.select(this)
				   		.classed('dot--selected', true);
			   		/* d3.selectAll('.dot1')
				   		.classed('dot--selected1', function(e) {
				      		return e==d;
			    		}); */
			   		d3.select('#movie').text(d.movie_title);
			   		d3.select('#director').text(d.director_name);
			   		d3.select('#gross_revenue').text(function() { return '$ ' + formatComma(d.gross); });
			   		d3.select('#imdb_score').text(function() { return formatComma(d.imdb_score); });
			   		d3.select('#genre').text(d.genres);
			   		d3.select('#duration').text(d.duration + " min");
			   		d3.select('#year').text(d.title_year);
		        });

  	/* chart1G // or something else that selects the SVG element in your visualizations
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

 	/* chart1G // or something else that selects the SVG element in your visualizations
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
		.style("fill", "black"); */

    chart2G.append("g") // create a group node
		.attr("transform", "translate(0,"+ (450)+ ")")
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
		.call(xAxis)
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

     /* chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA")
		.style("fill", "black"); */
	});
