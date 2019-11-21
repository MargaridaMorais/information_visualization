const initScatterPlot = (data) => {


	const height = 0.7 * window.innerHeight;
    const width = 0.49 * window.innerWidth;
     
    var edu_levels = ['Level1', 'Level2', 'Level3'];
    var years =  [... new Set(data.map(d => d.Year))];
    var countries = [... new Set(data.map(d=> d.Country))];

    var speed = 0
    // var options = d3.select("#year").selectAll("option")
	// 	.data(year)
	// .enter().append("option")
	// 	.text(d => d)

    var stackedBars = d3.select("#svgStackedBars").append("g")
        .attr("transform", "translate(45,-45)")
    
		 .attr('height', height - 50)
         .attr('width', width -10);
         
    var y = d3.scaleLinear().domain([0,5]).rangeRound([height - 10, 100]);

    var x = d3.scaleBand().range([20, width +20]).padding(.2);
    var z   = d3.scaleOrdinal().range(["steelblue", "darkorange", "lightblue"]).domain(edu_levels);
    // update(d3.select("#year").property("value"), 0)
        
	// function update(input, speed) {

	// 	var data = data.filter(f => f.Year == input)

	// 	data.forEach(function(d) {
	// 		d.total = d3.sum(edu_levels, k => +d[k])
	// 		return d
    // 	})
    
    y.domain([0, d3.max(data, d => d3.sum(edu_levels, k => +d[k]))]).nice();
    
    stackedBars.selectAll(".y-axis")
    // .transition()
    // .duration(speed)
            .call(d3.axisLeft(y));
            // .ticks(null, "s"))

    // data.sort(d3.select("#sort").property("checked")
	// 		? (a, b) => b.total - a.total
    //         : (a, b) => countries.indexOf(a.Country) - countries.indexOf(b.Country));
    x.domain(data.map(d => d.Country));

    stackedBars.selectAll(".x-axis")
        // .transition().duration(speed)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            
    // HELLO
    var group = stackedBars.selectAll("g.layer")
			.data(d3.stack().keys(edu_levels)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		var bars = stackedBars.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => e.data.Country);

		bars.exit().remove()

		bars.enter().append("rect")
			.attr("width", x.bandwidth())
			.merge(bars)
		.transition().duration(speed)
			.attr("x", d => x(d.data.Country))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]))

		var text = stackedBars.selectAll(".text")
			.data(data, d => d.Country);

		text.exit().remove()

		text.enter().append("text")
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.merge(text)
		.transition().duration(speed)
			.attr("x", d => x(d.Country) + x.bandwidth() / 2)
			.attr("y", d => y(d.total) - 5)
			.text(d => d.total)
/*
    scale_countries.domain(data.map(function(d){return d.Country;})); 
    
    var axis_countries  = d3.axisBottom(scale_countries);


   node.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(20," + (height-15)  + ")")
        .call(axis_countries.tickSizeOuter(0));

    node.append("g")
    .attr("class", "y axis")    
    .attr("transform", "translate(15,0)")    
    .call(d3.axisLeft(y).tickSizeOuter(0));



    node.append("text")
        .attr("transform", "rotate(-90)")
        // .attr("class", "axisText")
        .attr("y", -40)
        .attr("x",0 - ((height + 40) / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "#AAA")
        .text("Percentage (%)");  */
}

d3.json("content/data/income_by_edu.json").then(function(data){
    // data.forEach(function(d){
    //     d.Percentage = +d.Percentage;
    // })
    // console.log(data);

    initScatterPlot(data);
 }).catch(function(err){
     console.log(err);
 })
 