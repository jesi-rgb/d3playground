var data = _.range(0, 20)

var width = 500;
var height = 500;
var barHeight = 50;

var xScale = d3.scaleLinear()
               .domain([0, d3.max(data)])
               .range([0, width]);

var yScale = d3.scaleLinear()
                .domain([0, data.length])
                .range([height, barHeight]);

var colorScale = d3.scaleLinear()
                    .domain([d3.min(data), d3.max(data)])
                    .range(["pink", "red", "blue"]);

var canvas = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


var bars = canvas.selectAll("rect")
             .data(data)
             .enter()
                .append("rect")
                .attr("width", (d) => {return xScale(d);})
                .attr("height", (d) => {return yScale(d);})
                .attr("fill", (d) => {return colorScale(d)})
                .attr("y", (d, i) => {return i*(barHeight+5);});

// d3.csv("../data/SpotifyFeatures.csv", d3.autoType, function(data){
//     console.log(data)
// })




