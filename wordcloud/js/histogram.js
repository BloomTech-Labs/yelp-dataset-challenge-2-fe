 /*
*    Histogram for distribution of stars data
*/
Histogram = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};

Histogram.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:50, right:50, top:80, bottom:50 };
    vis.height = 450 - vis.margin.top - vis.margin.bottom;
    vis.width = 400 - vis.margin.left - vis.margin.right;

    vis.x = d3.scaleBand().rangeRound([0, vis.width]).padding(0.1);

    vis.y = d3.scaleLinear().range([vis.height, 0]);

    var tickLabels = ['1','2','3','4','5']
    vis.xAxis = d3.axisBottom(vis.x)
                .tickFormat(function(d, i){ return tickLabels[i];});

    vis.yAxis = d3.axisLeft(vis.y);

    vis.svg = d3.select(vis.parentElement).append("svg")
                .attr("width", vis.width + vis.margin.left + vis.margin.right)
                .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
                .attr("transform", 
                    "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svg.append("rect")
                .attr("id", "shadow")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("transform", "translate(" + 0 + 
                    ", " + 30 + ")")
                .attr("fill", "#27293d");

    vis.title = vis.svg.append("text")
                .attr("class", "chart-label")
                .attr("x", vis.width/2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                // .attr("font-family", "azo-sans-web, sans-serif")
                .style('fill', '#fff')
                .text("Distribution of Star Ratings")

    vis.wrangleData();
};

Histogram.prototype.wrangleData = function(){
    var vis = this;
    var greyColor = "#898989";

    vis.dataFiltered = filteredData[0].count_by_star
	
    vis.x.domain(vis.dataFiltered.map(function(d) { return d.stars; }));
    vis.y.domain([0, d3.max(vis.dataFiltered, function(d) { return d.count; })]);

    vis.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height*1.09 + ")")
        .call(vis.xAxis)
        .selectAll("text")
            .style("text-anchor", "middle")
            // .attr("transform", "translate(" + 0 + 
            // ", " + 30 + ")")

    // vis.svg.append("g")
    //     .attr("class", "y axis")
    //     .call(vis.yAxis)

    vis.svg.selectAll("bar")
        .data(vis.dataFiltered)
        .enter().append("rect")
        .style("fill", "#2081d9")
        .attr("transform", "translate(" + 0 + 
            ", " + 30 + ")")
        .attr("x", function(d) { return vis.x(d.stars); })
        .attr("width", vis.x.bandwidth())
        .attr("y", function(d) { return vis.height; })
        .attr("height", 0)
                .transition()
                .duration(800)
                .delay((d, i) => { return i * 150; })
        .attr("y", function(d) { return vis.y(d.count); })
        .attr("height", function(d) { return vis.height - vis.y(d.count); });

};