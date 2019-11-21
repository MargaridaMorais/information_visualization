

const initRadarChart = () => {

	const height = 0.5 * window.innerHeight + 20;
	const width = 0.3 * window.innerWidth - 20;


	var node = d3.select("#svgMap").append("g")
		 .attr('transform', 'translate(' + (width/2) +',' + (height/1.8) + ')');

}

d3.json("content/data/time_spend_reading.json", function(error, data) {

    
	// initRadarChart();
});