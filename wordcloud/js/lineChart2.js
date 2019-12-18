 /*
*    Line chart for number of reviews data
*/
var parseYear = d3.timeParse("%Y");
var color = d3.scaleOrdinal(d3.schemeDark2);

LineChart2 = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};

LineChart2.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:70, right:50, top:90, bottom:50 };
    vis.height = 320 - vis.margin.top - vis.margin.bottom;
    vis.width = 450 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.svg.append("rect")
        .attr("id", "shadow")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("transform", "translate(" + 52 + 
            ", " + 30 + ")")
        .attr("fill", "#27293d");


    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + 
            ", " + vis.margin.top + ")");

    vis.defs = vis.svg.append("defs");

    //Filter for the outside glow
    vis.filter = vis.defs.append("filter")
        .attr("id","glow");
    vis.filter.append("feGaussianBlur")
        .attr("stdDeviation","4.5")
        .attr("result","coloredBlur");
    vis.feMerge = vis.filter.append("feMerge");
    vis.feMerge.append("feMergeNode")
        .attr("in","coloredBlur");
    vis.feMerge.append("feMergeNode")
        .attr("in","SourceGraphic");
        

    vis.t = function() { return d3.transition().duration(1000); }

    vis.bisectDate = d3.bisector(function(d) { return parseYear(d.year); }).left;

    vis.linePath = vis.g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", "3px");

    vis.title = vis.g.append("text")
    .attr("class", "chart-label")
    .attr("x", vis.width/2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    // .attr("font-family", "azo-sans-web, sans-serif")
    .style('fill', '#fff')
    .text("Number of Reviews")

    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.yAxisCall = d3.axisLeft()
    vis.xAxisCall = d3.axisBottom()
        .ticks(4);
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");

    vis.wrangleData();
};


LineChart2.prototype.wrangleData = function(){
    var vis = this;

    vis.dataFiltered = filteredData[0].review_by_year

    vis.updateVis();
};


LineChart2.prototype.updateVis = function(){
    var vis = this;

    // Update scales
    vis.x.domain(d3.extent(vis.dataFiltered, function(d) { return parseYear(d.year); }));
    vis.y.domain([d3.min(vis.dataFiltered, function(d) { return d.total; }) / 1.005, 
        d3.max(vis.dataFiltered, function(d) { return d.total; }) * 1.005]);

    // Update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    // vis.yAxisCall.scale(vis.y);
    // vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

    // Discard old tooltip elements
    d3.select("#chart-area2 .focus").remove();
    d3.select("#chart-area2 .overlay").remove();

    var focus = vis.g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", vis.height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", vis.width);

    focus.append("circle")
        .attr("r", 5);

    focus.append("text")
        .attr("x", 15)
        .style("fill", "#fff")
        .attr("dy", ".31em");

    vis.svg.append("rect")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .attr("class", "overlay")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemover);

    function mousemover() {
        var x0 = vis.x.invert(d3.mouse(this)[0]),
            i = vis.bisectDate(vis.dataFiltered, x0, 1),
            d0 = vis.dataFiltered[i - 1],
            d1 = vis.dataFiltered[i],
            d = (d1 && d0) ? (x0 - d0.year > d1.year - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + vis.x(parseYear(d.year)) + "," + vis.y(d.total) + ")");
        focus.select("text").text(function() { return d.total; });
        focus.select(".x-hover-line").attr("y2", vis.height - vis.y(d.total));
        focus.select(".y-hover-line").attr("x2", -vis.x(parseYear(d.year)));
    }

    var line = d3.line()
        .x(function(d) { return vis.x(parseYear(d.year)); })
        .y(function(d) { return vis.y(d.total); })
        .curve(d3.curveMonotoneX);

    vis.g.select(".line").merge(vis.linePath)
        .attr("d", line(vis.dataFiltered))
        .attr("stroke", "url(#linear-gradient)")
        .attr("stroke-width", "1")
        .attr("fill", "none");

    var totalLength = vis.linePath.node().getTotalLength();
    
    vis.linePath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
            .duration(2000)
            .ease(d3.easeCubic)
            .attr("stroke-dashoffset", 0);

    vis.g.select(".line")
        .attr("stroke", "#2081d9")
        .transition(vis.t)
        .attr("d", line(vis.dataFiltered));
    
    d3.selectAll(".line")
        .style("filter", "url(#glow)");

};

