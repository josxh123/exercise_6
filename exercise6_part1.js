document.addEventListener('DOMContentLoaded', () => {
    const container = d3.select('#chart-part-1');
    if (container.empty()) return;

    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const colors = { barColor: "#D988B9" };
    const xScale = d3.scaleLinear();
    const yScale = d3.scaleLinear();

    const binGenerator = d3.bin()
        .value(d => d.energyConsumption)
        .domain([0, 2000])
        .thresholds(20);

    let filters_screen = [
        { id: "all", label: "All", isActive: true },
        { id: "LED", label: "LED", isActive: false },
        { id: "OLED", label: "OLED", isActive: false },
        { id: "LCD", label: "LCD", isActive: false },
    ];

    d3.csv("data/Ex6_TVdata.csv", d => ({
        screenTech: d.screenTech,
        energyConsumption: +d.energyConsumption
    })).then(data => {
        if (!data || data.length === 0) {
            console.error("Data loading failed for Part 1.");
            return;
        }
        populateFilters(data);
        drawHistogram(data);
    }).catch(error => console.error("Error loading CSV for Part 1:", error));

    const drawHistogram = (data) => {
        const svg = container.select("#histogram-chart")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);
        
        const innerChart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const bins = binGenerator(data);

        xScale.domain([bins[0].x0, bins[bins.length - 1].x1]).range([0, innerWidth]);
        yScale.domain([0, d3.max(bins, d => d.length)]).range([innerHeight, 0]).nice();

        innerChart.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
            .attr("height", d => innerHeight - yScale(d.length))
            .attr("fill", colors.barColor);

        innerChart.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${innerHeight})`).call(d3.axisBottom(xScale));
        innerChart.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

        svg.append("text").attr("x", width / 2).attr("y", height - 10).attr("text-anchor", "middle").text("Energy Consumption (kWh/year)").attr("fill", "white");
        svg.append("text").attr("transform", "rotate(-90)").attr("y", 15).attr("x", -(height / 2)).attr("text-anchor", "middle").text("Frequency").attr("fill", "white");
    };

    const populateFilters = (allData) => {
        const filtersDiv = container.select("#filters");
        const buttons = filtersDiv.selectAll("button")
            .data(filters_screen)
            .join("button")
            .text(d => d.label)
            .attr("class", d => d.isActive ? "active" : "");

        buttons.on("click", (event, d) => {
            filters_screen.forEach(filter => filter.isActive = filter.id === d.id);
            buttons.attr("class", f => f.isActive ? "active" : "");
            updateHistogram(d.id, allData);
        });
    };

    const updateHistogram = (filterId, allData) => {
        const filteredData = (filterId === "all") ? allData : allData.filter(d => d.screenTech === filterId);
        const bins = binGenerator(filteredData);
        
        yScale.domain([0, d3.max(bins, d => d.length)]).nice();
        d3.select("#histogram-chart .y-axis").transition().duration(500).call(d3.axisLeft(yScale));

        const svg = d3.select("#histogram-chart svg g");

        svg.selectAll("rect")
            .data(bins)
            .join(
                enter => enter.append("rect").attr("x", d => xScale(d.x0)).attr("y", innerHeight).attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)).attr("height", 0).attr("fill", colors.barColor),
                update => update,
                exit => exit.transition().duration(500).attr("y", innerHeight).attr("height", 0).remove()
            )
            .transition()
            .duration(500)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
    };
});