
// declare the const  variables
const mapChart_margin = { top:0 , left:0, bottom:30,right:0}
const mapChart_h = 0.6 * window.innerHeight - (mapChart_margin.top + mapChart_margin.bottom);
const mapChart_w = 0.3 * window.innerWidth - (mapChart_margin.left + mapChart_margin.right);

var mapChart = d3.select("#svgMap").append("g")
     .attr('height', mapChart_h + mapChart_margin.top + mapChart_margin.bottom)
     .attr('width', mapChart_w + mapChart_margin.left + mapChart_margin.right )
	 .attr("transform", "translate(" + mapChart_margin.left + ", " + mapChart_margin.top + ")");

// Label : Idiom legend
var readingtime_title = mapChart.append("text")
.attr("x", (width + margin_lines.right* 2)/ 2  - 155)
.attr("y", 20)
.attr("font-size", "18px")
.style("text-anchor", "middle")
.style("fill", "#AAA")
.text("Average Time Spent Reading");

// Tooltip
var map_tip = d3.tip().attr('class', 'd3-tip3')
    .html(function(d,i,json,m_data) {
		// var country_code = d.data.Country;
					// get the country name
			var country_name = json.features[i].properties.NAME;
			// get the country code
			var country_code = json.features[i].properties.ISO2;
			var country_obj = m_data.filter(d=> d.Country == country_code);
			var time_reading =  country_obj.length == 0 ? "No Data" : country_obj[0].Minutes + " minutes" ;
            var text = "<strong style='color:red'>Country:</strong> <span style='color:white;text-transform:capitalize'>" + country_name + "  </span><br>";
            text += "<strong>Avg Time:</strong> " +  time_reading + "</span><br>";
         return text;
	});
	
// Color list
var color_list = ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"];
var countryList = [];
var projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
						.center([ 30, 60 ]) //comment centrer la carte, longitude, latitude
						.translate([ mapChart_w/2 + 150 , mapChart_h/2.7 ]) // centrer l'image obtenue dans le svg
						.scale([ mapChart_w/1.35])// zoom, plus la valeur est petit plus le zoom est gros 
					.rotate([0,0,-2.7]);

//Define path generator
var geo_path = d3.geoPath().projection(projection);
var data_time_spend_reading ;
//
mapChart.call(map_tip);
// Load reading habits data 
d3.json("content/data/time_spend_reading.json").then(function(data){
   data_time_spend_reading = data;
}).catch(function(err){
	console.log("Error in loading time_spend_reading json file : ", err)
})

//Load in GeoJSON data
d3.json("content/data/us-10m.v1.json").then( function(json) {

	//Bind data and create one path per GeoJSON feature
	mapChart.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", geo_path)
		.on("mouseover", function(d,i){ 
			this.style["fill"]="rgba(8, 81, 156, 0.2)";

			// map_tip.show(d,i,json);
			map_tip.show(d,i,json,data_time_spend_reading);
			map_tip.style("left", (d3.event.pageX - 50) + "px")
            .style("top", (d3.event.pageY - 60) + "px");
			
           
		})
		.on("mouseout", function(d, i){ this.style["fill"] = color_list[i%5]; map_tip.hide(d,i,json); })
		.on("click", function(d, i){ 
			var name = json.features[i].properties.NAME;
			// get the country to ma
			var code = json.features[i].properties.ISO2;
			var index = countryList.indexOf(name);

			if(index > -1){
				this.style["stroke"] = "#AAA"; 
				countryList.splice(index, 1);
			} else {
				countryList.push(name);
				this.style["stroke"]="rgba(1, 1, 1, 0.2)";
			}
			
			})
	//    .attr("stroke", "rgba(8, 81, 156, 0.2)")
	//    .attr("stroke", "white")
		.attr("stroke", "#AAA")
		.attr("fill", function(d,i){ return color_list[i%5];  })
	//    .attr("fill", "rgba(8, 81, 156, 0.6)")

		;

		// console.log("Printing other json file  :" ,  data_time_spend_reading);
}).catch( function(err){
	console.log(err);
}
);





