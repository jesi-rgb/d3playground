var data = _.range(0, 20)

var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var canvas = d3.select("#chart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");

		
					
d3.csv("../data/SpotifyFeatures.csv", d3.autoType, function(data){
	var groups = _.countBy(data, "genre");

	var data_group = Object.keys(groups).map(group => {
		const aux = {};
		aux.genre = group;
		aux.count = groups[group];
		return aux
	});


	var x = d3.scaleBand()
		.range([0, width])
		.domain(_.map(data, d => {return d.genre}))
		.padding(0.2);
	

	canvas.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

	var y = d3.scaleLinear()
			.domain([0, d3.max(_.map(groups, d => {return d}))])
			.range([height, 0]);

	canvas.append("g")
		.call(d3.axisLeft(y));

	console.log(data_group);
	canvas.selectAll("mybar")
		.data(data_group)
		.enter()
		.append("rect")
			.attr("x", (d) => { return x(d.genre); })
			.attr("y", (d) => { return y(d.count); })
			.attr("width", x.bandwidth())
			.attr("height", (d) => { return height - y(d.count); })
			.attr("fill", "#BC96E6");
});




