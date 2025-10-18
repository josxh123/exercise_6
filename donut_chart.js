// Loads distribution_screensize.csv
d3.csv("data/distribution_screensize.csv", d => {
    return {
        technology: d.Screen_Tech,
        count: +d["Count*(Submit_ID)"]
    };
}).then(data => {
    const container = d3.select("#donut-chart-container");
    const width = 450, height = 450, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.technology))
        .range(["#FBE79C", "#00F5D4", "#FF007F"]);

    const pie = d3.pie().value(d => d.count);
    const data_ready = pie(data);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);
        
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    // Draw the donut slices
    svg.selectAll('path')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.technology))
        .attr("stroke", "#080808")
        .style("stroke-width", "2px");

    // Add the polylines (leader lines)
    svg.selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
          .attr("stroke", "white")
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr('points', function(d) {
              const posA = arc.centroid(d);
              const posB = outerArc.centroid(d);
              const posC = outerArc.centroid(d);
              const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              posC[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
              return [posA, posB, posC];
          });

    // Add the text labels
    svg.selectAll('allLabels')
        .data(data_ready)
        .join('text')
          .text(d => d.data.technology)
          .attr('transform', function(d) {
              const pos = outerArc.centroid(d);
              const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              pos[0] = radius * 1.05 * (midangle < Math.PI ? 1 : -1);
              return `translate(${pos})`;
          })
          .style('text-anchor', function(d) {
              const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
              return (midangle < Math.PI ? 'start' : 'end');
          })
          // --- UPDATED STYLES FOR LABELS ---
          .attr("fill", "var(--main-color)") // Use the bright theme color
          .style("font-size", "16px")        // Increased font size
          .style("font-weight", "bold");     // Made the font bold
});