// Loads screensize_energyconsumption.csv
d3.csv("data/screensize_energyconsumption.csv", d => {
    return {
        screensize: +d.screenInch,
        energy: +d.energyConsumption
    };
}).then(data => {
    const container = d3.select("#scatter-plot-container");
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain(d3.extent(data, d => d.screensize)).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.energy)]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    svg.selectAll("circle").data(data).join("circle")
        .attr("cx", d => xScale(d.screensize))
        .attr("cy", d => yScale(d.energy))
        .attr("r", 4)
        .attr("fill", "#FF007F")
        .style("opacity", 0.7);

    svg.append("text").attr("text-anchor", "middle").attr("x", width / 2).attr("y", height + 40).text("Screen Size (Inches)").attr("fill", "white");
    svg.append("text").attr("text-anchor", "middle").attr("transform", "rotate(-90)").attr("y", -margin.left + 20).attr("x", -height / 2).text("Energy Consumption (kWh)").attr("fill", "white");
});