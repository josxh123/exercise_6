
d3.csv("data/Energy_by_tech.csv", d => {
    return {
        technology: d.Screen_Tech,
        avg_consumption: +d["Mean(Labelled energy consumption (kWh/year))"]
    };
}).then(data => {
    const container = d3.select("#bar-chart-container");
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().domain(data.map(d => d.technology)).range([0, width]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.avg_consumption)]).range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale)).selectAll("text").attr("fill", "white");
    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").attr("fill", "white");

    svg.selectAll("rect").data(data).join("rect")
        .attr("x", d => xScale(d.technology))
        .attr("y", d => yScale(d.avg_consumption))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.avg_consumption))
        .attr("fill", "#9B5DE5");
});