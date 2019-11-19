var filteredData;
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y");

d3.json("data/sample_data.json").then(function(data){
    console.log(data);
    // Prepare and clean data
    filteredData = {};
        for (var time in data) {   
            if (!data.hasOwnProperty(time)) {
                continue;
            }
            filteredData[time] = data[time];
            filteredData[time].forEach(function(d){
                d["rank"] = +d["rank"];
                d["count"] = +d["count"];
                d["avg_stars"] = +d["avg_stars"];
                d["pct_total"] = +d["pct_total"];
            });
            console.log(filteredData);
        }

    function wordCloud(selector) {

        var fill = d3.scale.category20();
        var margin = {top: 30, right: 50, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        //Construct the word cloud's SVG element
        var svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");


        //Draw the word cloud
        function draw(words) {
            var cloud = svg.selectAll("g text")
                            .data(words, function(d) { return d.text; })

            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr('font-size', 1)
                .text(function(d) { return d.text; });

            //Entering and existing words
            cloud
                .transition()
                    .duration(600)
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1);

            //Exiting words
            cloud.exit()
                .transition()
                    .duration(200)
                    .style('fill-opacity', 1e-6)
                    .attr('font-size', 1)
                    .remove();
        }


        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {

            //Recompute the word cloud for a new set of words. This method will
            // asycnhronously call draw when the layout has been computed.
            //The outside world will need to call this function, so make it part
            // of the wordCloud return value.
            update: function(words) {
                d3.layout.cloud().size([width, height])
                    .words(words)
                    .padding(5)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
            }
        }

    }
    //Prepare one of the sample sentences by removing punctuation,
    // creating an array of words and computing a random size attribute.
    function getWords(i) {
        return words[i]
                .replace(/[!\.,:;\?]/g, '')
                .replace(/[\[\]']+/g,'')
                .split(' ')
                .map(function(d) {
                    return {text: d, size: 10 + Math.random() * 60};
                })
        }
    //This method tells the word cloud to redraw with a new set of words.
    //In reality the new words would probably come from a server request,
    // user input or some other source.
    function showNewWords(vis, i) {
        i = i || 0;

        vis.update(getWords(i ++ % words.length))
        setTimeout(function() { showNewWords(vis, i + 1)}, 2500)
        }

    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('#chart-area');

    //Start cycling through the demo data
    showNewWords(myWordCloud);
});

$("#play-button")
    .on("click", function(){
        var button = $(this);
        if (button.text() == "Play"){
            button.text("Pause");
            interval = setInterval(step, 100);            
        }
        else {
            button.text("Play");
            clearInterval(interval);
        }
    })

$("#reset-button")
    .on("click", function(){
        time = 0;
        update(formattedData[0]);
    })

$("#continent-select")
    .on("change", function(){
        update(formattedData[time]);
    })

$("#date-slider").slider({
    max: 2014,
    min: 1800,
    step: 1,
    slide: function(event, ui){
        time = ui.value - 1800;
        update(formattedData[time]);
    }
})

function step(){
    // At the end of our data, loop back
    time = (time < 214) ? time+1 : 0
    update(formattedData[time]);
}

function update(data) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

    var continent = $("#continent-select").val();

    var data = data.filter(function(d){
        if (continent == "all") { return true; }
        else {
            return d.continent == continent;
        }
    })

    // JOIN new data with old elements.
    var circles = g.selectAll("circle").data(data, function(d){
        return d.country;
    });

    // EXIT old elements not present in new data.
    circles.exit()
        .attr("class", "exit")
        .remove();

    // ENTER new elements present in new data.
    circles.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill", function(d) { return continentColor(d.continent); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition(t)
            .attr("cy", function(d){ return y(d.life_exp); })
            .attr("cx", function(d){ return x(d.income) })
            .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI) });

    // Update the time label
    timeLabel.text(+(time + 1800))
    $("#year")[0].innerHTML = +(time + 1800)

    $("#date-slider").slider("value", +(time + 1800))
    }