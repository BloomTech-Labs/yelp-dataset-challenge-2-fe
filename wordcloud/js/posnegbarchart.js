 /*
*    Positive-Negative bar chart for sentiment chunks data
*/

PosNegChart = function(_parentElement, _variable, _title){
    this.parentElement = _parentElement;
    this.variable = _variable;
    this.title = _title;

    this.initVis();
};

PosNegChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:50, right:70, top:70, bottom:50 };
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.width = 400 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select("#chart-area4")
            .append("svg")
                .attr("width", vis.width + vis.margin.left + vis.margin.right)
                .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
                .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.title = vis.svg.append("text")
    .attr("class", "chart-label")
    .attr("x", vis.width/2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    // .attr("font-family", "azo-sans-web, sans-serif")
    // .style('fill', '#fff')
    .text("Top Positive and Negative Phrases")

    vis.x = d3.scaleLinear()
            .range([0,vis.width]);

    vis.y = d3.scaleBand()
            .rangeRound([vis.height,0])
            .padding(0.2);

    vis.wrangleData();
};


PosNegChart.prototype.wrangleData = function(){
    var vis = this;

    vis.dataFiltered = filteredData[0].chunk_sentiment

    vis.x.domain(d3.extent(vis.dataFiltered, function(d){ return d.sentiment; }));
    vis.y.domain(vis.dataFiltered.map(function(d) { return d.chunks; }));

    vis.svg.selectAll(".bar")
            .data(vis.dataFiltered)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("y", function(d){ return vis.y(d.chunks); })
						.attr("height", vis.y.bandwidth())
                        .attr("fill", function(d){ return d.sentiment < 0 ? "#d7191c": "#1a9641"; })
            .attr("x",  d => { return vis.width/2; })
                        .attr("width", 0)
                            .transition()
                            .duration(800)
                            .delay((d, i) => { return i * 100; })
                        .attr("x", function(d){
                                if (d3.min(vis.dataFiltered, function(d) { return d.sentiment;} ) > 0){
                                    return 150;
                                } else {
                                    return d.sentiment < 0 ? vis.x(d.sentiment) : vis.x(0);
                                }
                            })
                        .attr("width", function(d){ return d.sentiment < 0 ? vis.x(d.sentiment * -1) - vis.x(0) : vis.x(d.sentiment) - vis.x(0); })
            

	vis.svg.selectAll(".value")
            .data(vis.dataFiltered)
        .enter().append("text")
            .attr("class", "value")
            .attr("y", function(d){ return vis.y(d.chunks); })
            .attr("dy", vis.y.bandwidth() - 2.55)
            .attr("x",  d => { return vis.width/2; })
                        .attr("width", 0)
                            .transition()
                            .duration(800)
                            .delay((d, i) => { return i * 100; })
            .attr("x", function(d){
                if (d3.min(vis.dataFiltered, function(d) { return d.sentiment;} ) > 0){
                    return 190;
                } else {
                    if (d.sentiment < 0){
                        return (vis.x(d.sentiment * -1) - vis.x(0)) > 20 ? vis.x(d.sentiment) + 2 : vis.x(d.sentiment) - 1;
                    } else {
                        return (vis.x(d.sentiment) - vis.x(0)) > 20 ? vis.x(d.sentiment) - 2 : vis.x(d.sentiment) + 1;
                    }
                }
            })
            .attr("text-anchor", function(d){
                if (d.sentiment < 0){
                    return (vis.x(d.sentiment * -1) - vis.x(0)) > 20 ? "start" : "end";
                } else {
                    return (vis.x(d.sentiment) - vis.x(0)) > 20 ? "end" : "start";
                }
            })
            .style("fill", function(d){
                if (d.sentiment < 0){
                    return (vis.x(d.sentiment * -1) - vis.x(0)) > 20 ? "#fff" : "#3a403d";
                } else {
                    return (vis.x(d.sentiment) - vis.x(0)) > 20 ? "#fff" : "#3a403d";
                }
            })
            .text(function(d){ return d.sentiment.toFixed(2); });

	vis.svg.selectAll(".name")
            .data(vis.dataFiltered)
        .enter().append("text")
            .attr("class", "name")
            .attr("x", function(d){
                if (d3.min(vis.dataFiltered, function(d) { return d.sentiment;} ) > 0){
                    return 140;
                } else {
                return d.sentiment < 0 ? vis.x(0) + 2.55 : vis.x(0) - 2.55
                }
            })
            .attr("y", function(d){ return vis.y(d.chunks); })
            .attr("dy", vis.y.bandwidth() - 2.55)
            .attr("text-anchor", function(d){ return d.sentiment < 0 ? "start" : "end"; })
            .text(function(d){ return d.chunks; });

	vis.svg.append("line")
            .attr("x1", vis.x(0))
            .attr("x2", vis.x(0))
            .attr("y1", 0 + 12)
            .attr("y2", vis.height - 12)
            .attr("stroke", "#3a403d")
            .attr("stroke-width", "1px");

      };

      function types(d){
				d.value = +d.value;
				return d;
      }