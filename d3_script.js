// This function draws the chart with labels.
const drawChart = (data) => {
    // 1. Define dimensions and margins.
    const margin = { top: 20, right: 40, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 2. Set up the SVG container and the main group element.
    const svg = d3.select(".responsive-svg-container")
        .html("") // Clear the container
        .append("svg")
          .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 3. Create the scales.
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.mean)])
      .range([0, width]);

    // UPDATED: The domain now uses the 'brand' column.
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.brand))
      .range([0, height])
      .padding(0.25);

    // 4. Create a group for each data point (bar + labels).
    const barGroups = svg
      .selectAll("g.bar-group")
      .data(data)
      .join("g")
        .attr("class", "bar-group")
        // UPDATED: The transform now uses the 'brand' property.
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    // 5. Append rectangles (the bars) to each group.
    barGroups
      .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", d => xScale(d.mean))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#D988B9");

    // 6. Append category labels (the 'brand') to each group.
    barGroups
      .append("text")
        // UPDATED: The text now displays the 'brand'.
        .text(d => d.brand)
        .attr("x", -10)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "white")
        .style("font-size", "14px");

    // 7. Append value labels (the 'mean') to each group.
    barGroups
      .append("text")
        .text(d => d.mean.toFixed(2))
        .attr("x", d => xScale(d.mean) + 5)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("fill", "var(--main-color)")
        .style("font-size", "14px");
};

// Load the data, filter it, and draw the chart.
// UPDATED: Loading from 'brand.csv'.
d3.csv("data/brand.csv", d => {
  // UPDATED: Using 'brand' and 'mean' headers.
  return {
    brand: d.brand,
    mean: +d.mean
  };
}).then(data => {
  // Sort data by the 'mean' value, from highest to lowest.
  data.sort((a, b) => b.mean - a.mean);
  
  // Take only the top 15 rows from the sorted data.
  const topData = data.slice(0, 15);
  
  // Draw the chart using only the filtered data.
  drawChart(topData);

}).catch(error => {
  console.error("Error loading the CSV file:", error);
  d3.select(".responsive-svg-container")
    .text("Failed to load data. Please check the file path and ensure the server is running.");
});