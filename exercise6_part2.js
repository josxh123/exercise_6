document.addEventListener('DOMContentLoaded', () => {
    const container = d3.select('#chart-part-2');
    if (container.empty()) return;

    // --- 1. Setup Constants ---
    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // --- 2. Data Loading ---
    d3.csv("data/Ex6_TVdata.csv", d => {
        // UPDATED: Corrected the column names to match your CSV file
        return {
            star: +d.star,
            screenSize: +d.screenSize,
            screenTech: d.screenTech,
            brand: d.brand
        };
    }).then(data => {
        const filteredData = data.filter(d => !isNaN(d.star) && !isNaN(d.screenSize));
        if (filteredData.length === 0) {
            console.error("No valid data for Part 2 after filtering.");
            return;
        }
        drawScatterplot(filteredData);
    }).catch(error => console.error("Error loading CSV for Part 2:", error));

    // --- 3. Chart Drawing Function ---
    const drawScatterplot = (data) => {
        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
        
        const innerChart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().domain(d3.extent(data, d => d.star)).range([0, innerWidth]).nice();
        const yScale = d3.scaleLinear().domain(d3.extent(data, d => d.screenSize)).range([innerHeight, 0]).nice();
        colorScale.domain(Array.from(new Set(data.map(d => d.screenTech))));

        // Axes
        innerChart.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(xScale));
        innerChart.append("g").call(d3.axisLeft(yScale));
        
        // Axis Labels
        svg.append("text").attr("x", width / 2).attr("y", height - 10).attr("text-anchor", "middle").text("Star Rating").attr("fill", "white");
        svg.append("text").attr("transform", "rotate(-90)").attr("y", 15).attr("x", -(height / 2)).attr("text-anchor", "middle").text("Screen Size (cm)").attr("fill", "white");

        // Tooltip
        const tooltip = d3.select("body").append("div").attr("class", "tooltip");

        // Draw Circles
        innerChart.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => xScale(d.star))
            .attr("cy", d => yScale(d.screenSize))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.screenTech))
            .style("opacity", 0.7)
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                       .html(`Brand: ${d.brand}<br>Screen Size: ${d.screenSize} cm<br>Tech: ${d.screenTech}`)
                       .style("left", (event.pageX + 15) + "px")
                       .style("top", (event.pageY - 28) + "px");
                d3.select(event.currentTarget).transition().duration(100).attr("r", 8).style("opacity", 1);
            })
            .on("mouseout", (event) => {
                tooltip.style("opacity", 0);
                d3.select(event.currentTarget).transition().duration(100).attr("r", 5).style("opacity", 0.7);
            });
    };
});