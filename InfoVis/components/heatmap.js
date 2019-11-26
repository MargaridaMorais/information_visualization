//svgHeatmap

const initHeatMap = (data) => {


	const height = 0.5 * window.innerHeight;
    const width = 0.3 * window.innerWidth;

    var heatmap_svg= d3.select("#svgHeatmap").append("g")
        .attr("transform", "translate(45,-45)")

		 .attr('height', height - 5)
         .attr('width', width - 10);

        var y_scale = d3.scaleLinear().range([height - 10,30]);
         // var x_scale = d3.scaleLinear().range([margin.left, width]);

        var percentage_color_scale = d3.scaleSequential(d3.interpolateBuGn);

        var countries_scale = d3.scaleBand().range([width -20,20]);


        // #2 load the data from external file
        var countries, years ;
        var percentage_by_year = [];
        countries = [...new Set(data.map(function(d){return d.Country;}))]
        years = [...new Set(data.map(function(d){return d.Year;}))]
        y_scale(years);
        // heatmap_svg.append("rect")
        //         .attr("x",10)
        //         .attr("y", 100)
        //         .attr("fill", "red")
        //         .attr("width", 18)
        //         .attr("height", 18);
      var init_y = 160;
      for(var i= 0 ; i < 18; i++){
            for (var j = 0 ; j < 4 ; j++){
                heatmap_svg.append("rect")
                .attr("x", i*26 - 10)
                .attr("y", init_y + j*32 )
                .attr("fill", "red")
                .attr("width", 25)
                .attr("height", 30);
            }
      }

      heatmap_svg.append("text")
    //   .attr("transform", "rotate(-90)")
      // .attr("class", "axisText")
      .attr("y", 50)
      .attr("x", ((width + 40) / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#AAA")
      .text("Books and Newspapers: Household Expenditure");

}

d3.json("content/data/book_expenditure.json").then(function(data){
    data.forEach(function(d){
        d.Percentage = +d.Percentage;
    })
    console.log(data);

    initHeatMap(data);
 }).catch(function(err){
     console.log(err);
 })
