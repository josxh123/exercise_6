
d3.csv("data/screensize_by_frequency.csv", d => {
    return {
        screensize: +d.screenInch,
        frequency: +d["Count*(Submit_ID)"]
    };
}).then(data => {
   
    data.sort((a, b) => a.screensize - b.screensize);

    const container = d3.select("#line-chart-container");
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain(d3.extent(data, d => d.screensize)).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.frequency)]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale)).selectAll("text").attr("fill", "white");
    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").attr("fill", "white");

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#FB8500")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(d => xScale(d.screensize))
            .y(d => yScale(d.frequency))
        );
        
    svg.append("text").attr("text-anchor", "middle").attr("x", width / 2).attr("y", height + 40).text("Screen Size (Inches)").attr("fill", "white");
    svg.append("text").attr("text-anchor", "middle").attr("transform", "rotate(-90)").attr("y", -margin.left + 20).attr("x", -height / 2).text("Number of Models (Frequency)").attr("fill", "white");
});