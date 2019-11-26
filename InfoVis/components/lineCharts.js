//svgLineCharts
// svgLines

const margin_lines = {top : 10 , right: 10 , bottom: 0 , left : 80 };
const height_lines = 0.3 * window.innerHeight - (margin_lines.top + margin_lines.bottom);
const width_lines = 0.49 * window.innerWidth - (margin_lines.left + margin_lines.right);
    // const colors = ["steelblue", "darkorange", "lightblue"];
    // var edu_levels = ['Level1', 'Level2', 'Level3'];
    // var countries,years ; 


var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
 var linesChart = d3.select("#svgLines").append("g")
    //  .attr("transform", "translate(,-45)")
    .attr('height', height_lines + margin_lines.top + margin_lines.bottom)
    .attr('width', width_lines + margin_lines.left + margin_lines.right );
    //  .attr("transform", "translate(" + margin_lines.left + ", " + margin_lines.top + ")");

    var tip_lines = d3.tip().attr('class', 'd3-tip2')
    .html(function(d) {
        var country_code = d.Country;
        var text = "<strong style='color:red'>Country:</strong> <span style='color:white;text-transform:capitalize'>" + countries_ext_name[country_code] + "</span><br>";
        text += "<strong>Percentage:</strong> <span>" +  d.Percentage + "%" + "</span><br>";
        text += "<strong>Year:</strong> <span>" +  d.Year  + "</span><br>";

        // text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
        return text;
    });

    linesChart.call(tip_lines);

    var y_scale_perc = d3.scaleLinear().range([height_lines , margin_lines.top]);
    var x_scale_years = d3.scaleLinear().range([width_lines + margin_lines.left ,0]);
    var earlyLeaver_title = linesChart.append("text")
     .attr("x", (width + margin_lines.left)/2)
     .attr("y", 20)
     .attr("font-size", "18px")
     .style("text-anchor", "middle")
     .style("fill", "#AAA")
     .text("Education Early Leaver ");
  
    d3.json("content/data/early_leaver.json").then(function(data){
        var current_dataset = data;
        // console.log("Early_leaver : ", data);
        var years_lines   = [...new Set(data.map(d => d.Year))].reverse();
        var countries_lines = [...new Set(data.map(d => d.Country))];
        var countries_Indexes = countries_lines.map(i => countries_lines.indexOf(i));
        console.log(countries_Indexes);
        
        color_scale.domain([-17,17]);
        var percentages_lines =  [...new Set(data.map(d=> d.Percentage))];
        // console.log(years_lines);
        // console.log(countries_lines);
        // console.log(percentages_lines);
        

        // console.log("Height_lines : " , height_lines);
        // console.log("Width_lines : " , width_lines);


       linesChart.append("g")
       .attr("transform", "translate(" + margin_lines.left/2 + ", " + (height_lines + margin_lines.top) +")")
       .attr("class", "x-axis");
       x_scale_years.domain(d3.extent(data, function(d){return d.Year;}).reverse());
       linesChart.selectAll(".x-axis").call(d3.axisBottom(x_scale_years).tickFormat(d3.format("")));
       
        linesChart.append("g")
        .attr("transform", "translate(" + margin_lines.left/2 + ", " + margin_lines.top+")" )       
        .attr("class", "y-axis"); 
        y_scale_perc.domain([0, d3.max(percentages_lines) + 10]);
		linesChart.selectAll(".y-axis")
			.call(d3.axisLeft(y_scale_perc));

     // Create the paths
     var paths = [];
   
     countries_lines.forEach(function(d){ 
        var data_instances =  data.filter(elem => elem.Country == d);       
        var aux_array= [];
       
        data_instances.forEach(function(element){
            aux_array.push({'x' : x_scale_years(element.Year) + margin_lines.left/2, 'y': y_scale_perc(element.Percentage),
                            'Country': element.Country, 'Percentage': element.Percentage, 'Year': element.Year})       
        })
        
        paths.push(aux_array); 
    })
    // END create Paths
 
    // draw circles
    // 12. Appends a circle for each datapoint 
    linesChart.selectAll(".dot")
    .data(data)
    .enter().append("circle") // Uses the enter().append() method
    .on("mouseover", tip_lines.show)
    .on("mouseout", tip_lines.hide)
    .attr("class", "dot") // Assign a class for styling
    .attr("cx",  function(d) { return x_scale_years(d.Year) + margin_lines.left/2} )
    .attr("cy", function(d) { return y_scale_perc(d.Percentage) })
    .attr("fill","#ffab00")
    .attr("r", 4.5)
    
    // draw lines
    linesChart.append("g")
    .selectAll("path")
    .data(paths)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#efefef")
    // .attr("stroke", function(d){ return color_scale(countries_lines.indexOf(d[0].Country))})
    .attr("stroke-width", 1)
    .attr("d", d3.line().x(d => d.x).y(d => d.y))
      
     }

     ).catch(function(err){
     console.log(err);
 })
