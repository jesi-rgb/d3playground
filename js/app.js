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
        
                    
d3.csv("../data/SpotifyFeatures.csv", d3.autoType, function(data){
    
    // GENRE CANVAS //
    const g_groups = _.countBy(data, "genre");

    const data_group = Object.keys(g_groups).map(group => {
        const aux = {};
        aux.genre = group;
        aux.count = g_groups[group];
        return aux
    });

    const sorted = _.sortBy(data_group, 'count');


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

    const k_sorted = _.sortBy(keys_data_group, 'count');

    const xKeys = d3.scaleBand()
        .range([0, width])
        .domain(_.map(k_sorted, d => {return d.key}))
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


    // MEAN DURATION PER GENRE //
    const d_groups = _.groupBy(data, 'genre');
    
    // const duration_means = Object.keys(d_groups).map(group => {
    //     const aux = {};
    //     aux.genre = group;

    //     console.log(d_groups);

    // })

    const durations_group = Object.keys(d_groups).map(group => {
        const aux = {};

        aux.genre = group;

        let avg_durations = d3.mean(d_groups[group].map(d => d.duration_ms))
        aux.duration_ms = avg_durations;
        
        return aux
    });
    
    console.log(durations_group);

    
});




