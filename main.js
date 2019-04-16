var width =500;
var height= 500;



d3.csv("movies.csv", function(csv) {
	csv = csv.filter(function(d) {
	        // if (!d.title_year=='' || !d.movie_title=='' || !d.movie_facebook_likes=='' || !d.director_name=='' || !d.director_facebook_likes==''
	        // 	|| !d.actor_1_name=='' || !d.actor_1_facebook_likes=='' || !d.actor_2_name=='' || !d.actor_2_facebook_likes==''
	        // 	|| !d.actor_3_name=='' || !d.actor_3_facebook_likes=='' || !d.cast_total_facebook_likes=='' || !d.facenumber_in_poster==''
	        // 	|| !d.num_critic_for_reviews=='' || !d.num_user_for_reviews=='' || !d.budget=='' || !d.gross=='' || !d.duration==''
	        // 	|| !d.genres=='' || !d.plot_keywords=='' || !d.imdb_score=='' || !d.movie_imdb_link=='' || !d.language=='' || !d.country==''
	        // 	|| !d.content_rating=='' || !d.aspect_ratio=='' || !d.color=='') {
	        if (   d.title_year==="null" || d.title_year===''
	        	|| d.budget==="null" 	 || d.budget==='' 
	        	|| d.gross==="null" 	 || d.gross===''
	        	|| d.duration==="null"	 || d.duration==='' 
	        	|| d.imdb_score==="null" || d.imdb_score==='' ) {
	            return false;
	        }
	        d.title_year = parseInt(d.title_year, 10);
	        d.budget = parseInt(d.budget, 10);
	        d.gross = parseInt(d.gross, 10);
	        d.duration = parseInt(d.duration, 10);
	        d.imdb_score = parseInt(d.imdb_score, 10);

	        return true;
    	});
	// for (var i=0; i<csv.length; ++i) {
	// 	csv[i].imdb_score = Number(csv[i].imdb_score);
	// 	csv[i].title_year = Number(csv[i].title_year);
	// 	csv[i].budget = Number(csv[i].budget);
	// 	csv[i].gross = Number(csv[i].gross);
	// 	csv[i].duration = Number(csv[i].duration);
 //    }
    var imdb_score_max = d3.max(csv, function(d) { return d.imdb_score; });
    console.log("imdb_score_max: " + imdb_score_max);
    var imdb_score_min = d3.min(csv, function(d) { return d.imdb_score; });
    // var imdb_score_min = d3.min(csv, function(d) { return d.imdb_score || Infinity; });
    console.log("imdb_score_min: " + imdb_score_min);

    var title_year_max = d3.max(csv, function(d) { return d.title_year; });
    console.log("title_year_max: " + title_year_max);
    var title_year_min = d3.min(csv, function(d) { return d.title_year; });
    // var title_year_min = d3.min(csv, function(d) { return d.title_year || Infinity; });
    console.log("title_year_min: " + title_year_min);

    var budget_max = d3.max(csv, function(d) { return d.budget; });
    console.log("budget_max: " + budget_max);
    var budget_min = d3.min(csv, function(d) { return d.budget; });
    // var budget_min = d3.min(csv, function(d) { return d.budget || Infinity; });
    console.log("budget_min: " + budget_min);

    var gross_max = d3.max(csv, function(d) { return d.gross; });
    console.log("gross_max: " + gross_max);
    var gross_min = d3.min(csv, function(d) { return d.gross; });
    // var gross_min = d3.min(csv, function(d) { return d.gross || Infinity; });
    console.log("gross_min: " + gross_min);

    var duration_max = d3.max(csv, function(d) { return d.duration; });
    console.log("duration_max: " + duration_max);
    var duration_min = d3.min(csv, function(d) { return d.duration; });
    // var duration_min = d3.min(csv, function(d) { return d.duration || Infinity; });
    console.log("duration_min: "  + duration_min);
    
    var csv_norm = csv;
    for (var i=0; i<csv.length; ++i) {
		csv_norm[i].imdb_score = (csv[i].imdb_score - imdb_score_min)/(imdb_score_max - imdb_score_min);
		csv_norm[i].title_year = (csv[i].title_year - title_year_min)/(title_year_max - title_year_min);
		csv_norm[i].budget = (csv[i].budget - budget_min)/(budget_max - budget_min);
		csv_norm[i].gross = (csv[i].gross - gross_min)/(gross_max - gross_min);
		csv_norm[i].duration = (csv[i].duration - duration_min)/(imdb_score_max - imdb_score_min);
    }


    var imdb_score_Extent = d3.extent(csv, function(row) { return row.imdb_score; });
    var title_year_Extent = d3.extent(csv, function(row) { return row.title_year; });
    var budget_Extent = d3.extent(csv,  function(row) { return row.budget;  });
    var gross_Extent = d3.extent(csv,  function(row) {return row.gross;   });
    var duration_Extent = d3.extent(csv,  function(row) {return row.duration;   });


    // Axis setup
    var xScale = d3.scaleLinear().domain(duration_Extent).range([50, 470]);
    var yScale = d3.scaleLinear().domain([0, 1]).range([470, 30]);

    // var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    // var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    // var xAxis2 = d3.axisBottom().scale(xScale2);
    // var yAxis2 = d3.axisLeft().scale(yScale2);

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
            .attr('value','1')
        
            var select = d3.select('#chart1')
            .append('select')
            .attr('class','select' + numAtts)
            .on('change',onchange)
            
            var options = select
            .selectAll('option')
            .data(data).enter()
            .append('option')
                .text(function (d) { return d; });
            
        
        
        for(var i = 0;i < numAtts;i++){
           function onchange() {
            selectValue = d3.select('select'+numAtts).property('value')
            d3.select('chart1')
                .append('p')
                .text(selectValue + ' is the last selected option.')
            };        
            
        }
            
    }
    
    

     


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
		.attr("cx", function(d) { return xScale(d['duration']); })
		.attr("cy", height - 30.0-100*Math.random())
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
	   		d3.select('#movie').text(d.movie_title);
	   		d3.select('#director').text(d.director_name);
	   		d3.select('#gross_revenue').text(d.gross);
	   		d3.select('#imdb_score').text(d.imdb_score);
	   		d3.select('#genre').text(d.genre);
	   		d3.select('#duration').text(d.duration);
	   		d3.select('#year').text(d.title_year);
        });



  //   chart1G // or something else that selects the SVG element in your visualizations
		// .append("g") // create a group node
		// .attr("transform", "translate(0,"+ (width -30)+ ")")
		// .call(xAxis) // call the axis generator
		// .append("text")
		// .attr("class", "label")
		// .attr("x", width-16)
		// .attr("y", -6)
		// .style("text-anchor", "end")
		// .text("SATM")
		// .style("fill", "black");

  //   chart1G // or something else that selects the SVG element in your visualizations
		// .append("g") // create a group node
		// .attr("transform", "translate(50, 0)")
		// .call(yAxis)
		// .append("text")
		// .attr("class", "label")
		// .attr("transform", "rotate(-90)")
		// .attr("y", 6)
		// .attr("dy", ".71em")
		// .style("text-anchor", "end")
		// .text("SATV")
		// .style("fill", "black");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis)
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
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA")
		.style("fill", "black");
	});
