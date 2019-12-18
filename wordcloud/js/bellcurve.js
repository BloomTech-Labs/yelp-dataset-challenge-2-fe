 /*
*    Bell curve for percentile score data
*/

BellCurve = function(_parentElement, _variable, _title){
    this.parentElement = _parentElement;
    this.variable = _variable;
    this.title = _title;

    this.initVis();
};

BellCurve.prototype.initVis = function(){
    var vis = this;
    
    vis.mean = 30
    vis.stddev = 15; 
    
    vis.array = Random_normal_Dist(vis.mean, vis.stddev);
    
    vis.margin = { left:50, right:100, top:50, bottom:50 };
    vis.height = 300 - vis.margin.top - vis.margin.bottom;
    vis.width = 400 - vis.margin.left - vis.margin.right;

	vis.x = d3.scaleLinear().rangeRound([0, vis.width]);

    vis.min_d = d3.min(vis.array, function (d) {return d.q;}); 
    vis.max_d = d3.max(vis.array, function (d) {return d.q;});
    vis.max_p = d3.max(vis.array, function (d) {return d.p;});

    vis.x.domain([vis.min_d, vis.max_d]).nice;

    vis.y = d3.scaleLinear()
            .domain([0, vis.max_p])
            .range([vis.height, 0]);

    vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.gX = vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x))
  				.selectAll(".tick")
  				.remove();
 
    vis.line = d3.line()
            .x(function (d) { return vis.x(d.q); })
            .y(function (d) { return vis.y(d.p); });

    vis.title = vis.svg.append("text")
                .attr("class", "chart-label")
                .attr("x", vis.width/2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                // .attr("font-family", "azo-sans-web, sans-serif")
                // .style('fill', '#fff')
                .text("Sector Ranking")
	
    //draw a rect
    vis.svg.append("clipPath")
            .attr("id", "rect-clip")  
            .append("rect")
            .attr("class", "rect")
            .attr("x",150)
            .attr("y",0)
            .attr("width", vis.width)
            .attr("height", vis.height)
            .style("fill", "#FE4A49")
  
  //no clip path
    vis.svg.append("path")
            .attr("id", "path")
            .datum(vis.array)
            .attr("class", "line")
            .attr("d", vis.line)
            .style("opacity", 0)
            .style("fill", "rgb(204, 204, 204)")
                .transition()
                .duration(800)
                .ease(d3.easeLinear)
                // .delay((d, i) => { return i * 100; })
            .style("opacity", 1)
            .style("fill", "#FE4A49")

   //no clip path
    vis.svg.append("path")
        .attr("id", "path")
        .datum(vis.array)
        .attr("class", "line")
        .attr("d", vis.line)
        .style("fill", "rgb(204, 204, 204)")
            .attr("clip-path","url(#rect-clip)")


    vis.svg.append("line") 
        .attr("id", "cutoffline")
        .attr("x1", 150) 
            .attr("x2", 150)
            .attr("y1", 10)
            .attr("y2", 0)
            .transition()
                .duration(800)
                .ease(d3.easeLinear)
            .attr("y2", vis.height)
        .style("stroke", "#600000") 
  
    vis.svg.append("text") 
        .attr("id", "cutofflbl")
            .attr("dx",5)
        .attr("x", 150)  
            .attr("y", 10)  
            .style("font-family","Franklin Gothic Book")
            .style("font-size","11px")
        .style("opacity", 0)
            .transition()
            .duration(800)
            .ease(d3.easeLinear)
        .style("opacity", 1)
        .style("fill", "#600000")
            .text("Percentile: " + filteredData[0].percentile.toFixed(2))
   

    function Random_normal_Dist(mean, sd) {
        data = [];
        for (var i = mean - 4 * sd; i < mean + 4 * sd; i += 1) {
            q = i
            p = jStat.normal.pdf(i, mean, sd);
            arr = {
                "q": q,
                "p": p
            }
            data.push(arr);
        };
        return data;
    }
    
    var Z_MAX = 6;
    function poz(z) {
    
        var y, x, w;
    
        if (z == 0.0) {
            x = 0.0;
        } else {
            y = 0.5 * Math.abs(z);
            if (y > (Z_MAX * 0.5)) {
                x = 1.0;
            } else if (y < 1.0) {
                w = y * y;
                x = ((((((((0.000124818987 * w
                        - 0.001075204047) * w + 0.005198775019) * w
                        - 0.019198292004) * w + 0.059054035642) * w
                        - 0.151968751364) * w + 0.319152932694) * w
                        - 0.531923007300) * w + 0.797884560593) * y * 2.0;
            } else {
                y -= 2.0;
                x = (((((((((((((-0.000045255659 * y
                            + 0.000152529290) * y - 0.000019538132) * y
                            - 0.000676904986) * y + 0.001390604284) * y
                            - 0.000794620820) * y - 0.002034254874) * y
                            + 0.006549791214) * y - 0.010557625006) * y
                            + 0.011630447319) * y - 0.009279453341) * y
                            + 0.005353579108) * y - 0.002141268741) * y
                            + 0.000535310849) * y + 0.999936657524;
            }
        }
        return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
    }
    
    function critz(p) {
        var Z_EPSILON = 0.000001;
        var minz = -Z_MAX;
        var maxz = Z_MAX;
        var zval = 0.0;
        var pval;
        if( p < 0.0 ) p = 0.0;
        if( p > 1.0 ) p = 1.0;
    
        while ((maxz - minz) > Z_EPSILON) {
            pval = poz(zval);
            if (pval > p) {
                maxz = zval;
            } else {
                minz = zval;
            }
            zval = (maxz + minz) * 0.5;
        }
        return(zval);
    }
    
    window.updateBell = function(pcnt){
    
        var cutoff_Zscore = critz(pcnt/100.005);
        var cutoff_val = cutoff_Zscore*vis.stddev + vis.mean;
        
        d3.select("#rect-clip").select("rect")
            .attr("x",vis.x(cutoff_val))
            .attr("y",0)
            .style("fill", "#FE4A49") 
        
        d3.select("#cutoffline") 
            .attr("x1", vis.x(cutoff_val))
            .attr("x2", vis.x(cutoff_val)) 
        
        d3.select("#cutofflbl") 
            .attr("x", vis.x(cutoff_val)) 
        
    }
    vis.wrangleData();
};


BellCurve.prototype.wrangleData = function(){
    var vis = this;

    vis.dataFiltered = filteredData[0].percentile
    
    updateBell(vis.dataFiltered);
}