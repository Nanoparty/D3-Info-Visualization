var width =500;
var height= 500;



d3.csv("movies.csv", function(csv) {
   for (var i=0; i<csv.length; ++i) {
		csv[i].imdb_score = Number(csv[i].imdb_score);
		csv[i].title_year = (Number(csv[i].title_year);
		csv[i].budget = Number(csv[i].budget);
		csv[i].gross = Number(csv[i].gross);
		csv[i].duration = Number(csv[i].duration);
    }
    var imdb_score_max = d3.max(data, function(d) { return d.imdb_score; });
    var imdb_score_min = d3.min(data, function(d) { return d.imdb_score; });

    var title_year_max = d3.max(data, function(d) { return d.title_year; });
    var title_year_min = d3.min(data, function(d) { return d.title_year; });

    var budget_max = d3.max(data, function(d) { return d.budget; });
    var budget_min = d3.min(data, function(d) { return d.budget; });

    var gross_max = d3.max(data, function(d) { return d.gross; });
    var gross_min = d3.min(data, function(d) { return d.gross; });

    var duration_max = d3.max(data, function(d) { return d.duration; });
    var duration_min = d3.min(data, function(d) { return d.duration; });

    var csv_norm = csv;
    for (var i=0; i<csv.length; ++i) {
		csv_norm[i].imdb_score = (csv[i].imdb_score - imdb_score_min)/(imdb_score_max - imdb_score_min);
		csv_norm[i].title_year = (csv[i].title_year - title_year_min)/(title_year_max - title_year_min);
		csv_norm[i].budget = (csv[i].budget - budget_min)/(budget_max - budget_min);
		csv_norm[i].gross = (csv[i].gross - gross_min)/(gross_max - gross_min);
		csv_norm[i].duration = (csv[i].duration - duration_min)/(imdb_score_max - imdb_score_min);
    }
    // var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    // var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    // var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    // var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });


   /*  var satExtents = {
	"SATM": satmExtent,
	"SATV": satvExtent
    };
    var actExtents = {
    "ACT": actExtent,
	"GPA": gpaExtent
    }; */


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



	/******************************************/

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
