 /*
*    Table for Top Competitors and Best in Sector data
*/
Table = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};

Table.prototype.initVis = function(){
    var vis = this;
    
    vis.dataFiltered = filteredData[0].competitors

    vis.table = d3.select(vis.parentElement)
                .append("table")
                .attr("id", "ctable");
    
    vis.header = vis.table.append("thead").append("tr");
    vis.header
            .selectAll("#ctable th")
            .data(["Top Competitors"])
            .enter()
            .append("th")
            .text(function(d) { return d; })
                
    vis.tablebody = vis.table.append("tbody");

    vis.rows = vis.tablebody
            .selectAll("#ctable tr")
            .data(vis.dataFiltered)
            .enter()
            .append("tr")
            .text(function(d) {
                return d;
            })

    vis.dataFiltered2 = filteredData[0].bestinsector

    vis.table2 = d3.select(vis.parentElement)
                .append("table")
                .attr("id", "c2table");
    
    vis.header2 = vis.table2.append("thead").append("tr")

    vis.header2
            .selectAll("#c2table th")
            .data(["Best in Sector"])
            .enter()
            .append("th")
            .text(function(d) { return d; })
                
    vis.tablebody2 = vis.table2.append("tbody");

    vis.rows2 = vis.tablebody2
            .selectAll("#c2table tr")
            .data(vis.dataFiltered2)
            .enter()
            .append("tr")
            .text(function(d) {
                return d;
            })

    };
