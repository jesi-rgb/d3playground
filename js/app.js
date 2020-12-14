// Declare some genre_canvas constiables that will be useful 
const margin = {top: 30, right: 30, bottom: 100, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;


//  
const genre_canvas = d3.select("#genre_hist")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

const key_canvas = d3.select("#key_hist")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

const avg_dur_canvas = d3.select("#avg_dur_hist")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");
        
                    
d3.csv("../data/spoty_short.csv", d3.autoType, function(data){
    
    // GENRE CANVAS //
    const g_groups = _.countBy(data, "genre");

    const data_group = Object.keys(g_groups).map(group => {
        const aux = {};
        aux.genre = group;
        aux.count = g_groups[group];
        return aux
    });

    const sorted = _.sortBy(data_group, "count");


    const xGenre = d3.scaleBand()
        .range([0, width])
        .domain(_.map(sorted, d => {return d.genre}))
        .padding(0.2);
    

    genre_canvas.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xGenre))
                .selectAll("text")
                .attr("transform", "translate(-13,10)rotate(-90)")
                .style("text-anchor", "end");


    const yGenre = d3.scaleLinear()
            .domain([0, d3.max(_.map(data_group, d => d.count))])
            .range([height, 0]);

    const scaleColorG = d3.scaleLinear()
                        .domain([0, d3.max(_.map(data_group, d => d.count))])
                        .range(["#69b3a2", "#5B8FBA", "#BC96E6"])



    genre_canvas.append("g")
        .call(d3.axisLeft(yGenre));


    genre_canvas.selectAll("mybar")
        .data(sorted)
        .enter()
        .append("rect")
            .attr("x", (d) => { return xGenre(d.genre); })
            .attr("y", (d) => { return yGenre(d.count); })
            .attr("width", xGenre.bandwidth())
            .attr("height", (d) => { return height - yGenre(d.count); })
            .attr("fill", (d) => {return scaleColorG(d.count); });


    // KEY CANVAS //
    const k_groups = _.countBy(data, "key");

    const keys_data_group = Object.keys(k_groups).map(group => {
        const aux = {};
        aux.key = group;
        aux.count = k_groups[group];
        return aux
    });

    const k_sorted = _.sortBy(keys_data_group, "count");


    const xKeys = d3.scaleBand()
        .range([0, width])
        .domain(k_sorted.map(d => d.key))
        .padding(0.2);

    const scaleColorK = d3.scaleLinear()
                        .domain([0, d3.max(_.map(keys_data_group, d => d.count))])
                        .range(["#69b3a2", "#5B8FBA", "#BC96E6"])
    

    key_canvas.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xKeys))


    const yKeys = d3.scaleLinear()
            .domain([0, d3.max(_.map(keys_data_group, d => d.count))])
            .range([height, 0]);



    key_canvas.append("g")
            .call(d3.axisLeft(yKeys));


    key_canvas.selectAll("mybar")
            .data(k_sorted)
            .enter()
            .append("rect")
                .attr("x", (d) => { return xKeys(d.key); })
                .attr("y", (d) => { return yKeys(d.count); })
                .attr("width", xKeys.bandwidth())
                .attr("height", (d) => { return height - yKeys(d.count); })
                .attr("fill", (d) => {return scaleColorK(d.count)});


    // Bubbles //

    const props = data.map(d => {
        const aux = {};
        aux.genre = d.genre;
        aux.loudness = +d.loudness;
        aux.duration_ms = +d.duration_ms;
        return aux;
    })


    const xAvgDuration = d3.scaleBand()
                        .domain(props.map(d => d.genre))
                        .range([0, width])
                        .padding(1);

    

    avg_dur_canvas.append("g")
                    .attr("transform", "translate(" + 0 + "," + height + ")")
                    .call(d3.axisBottom(xAvgDuration))
                    .selectAll("text")
                    .attr("transform", "translate(-13,10)rotate(-90)")
                    .style("text-anchor", "end");

    

    const yAvgDuration = d3.scaleLinear()
                        .domain([d3.min(props.map(d => d.loudness)), 0])
                        .range([height, 0]);

    avg_dur_canvas.append("g")
                    .call(d3.axisLeft(yAvgDuration));

    
    
    const sizeAvgDuration = d3.scaleLinear()
                            .domain([0, d3.max(props.map(d => d.duration_ms))])
                            .range([3, 20])

    const alphaScaler = d3.scaleLinear()
                        .domain([0, d3.max(props.map(d => d.duration_ms))])
                        .range([0, 1])


                                console.log(d3.min(props.map(d => d.duration_ms)));
    avg_dur_canvas.selectAll("circles")
                    .data(props)
                    .enter()
                    .append("circle")
                    .attr("cx", (d) => {return xAvgDuration(d.genre);})
                    .attr("cy", (d) => {return yAvgDuration(d.loudness);})
                    .attr('r', (d) => {return sizeAvgDuration(d.duration_ms)}) // 
                    .attr("fill", "#BC96E6")
                    .attr('opacity', d => {return alphaScaler(d.duration_ms)})
                    .attr('stroke', "black")
    
    // console.log(avg_dur.map(d => yAvgDuration(d.duration_ms)));

});




