var filteredData;
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y");
var words

function updateData(){
    d3.json('https://wordcloudapp.herokuapp.com/api', {
        method:"POST",
        body: JSON.stringify({
        business_id: '4JNXUYY8wbaaDmk3BPzlWw'
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(function(data){
        console.log(data);
        filteredData = {};
        sentences = [];
        for (var time in data) {   
            if (!data.hasOwnProperty(time)) {
                continue;
            }
            filteredData[time] = data[time];
            listarr = filteredData[time].map(function(d) { return d.word; });
            sentences.push(listarr);
    };
        myWords = filteredData["2011-02-26"];
        // for (i = 0; i < sentences.length; i++) {
        //     t = sentences[i].join(" ");
        //     myWords.push(t);
        // };
        // words = filteredData[time].map(function(d) { return d.pct_total*1000; })
        console.log(myWords.map(function(d) { return {text: d.word, size:d.pct_total*10000}; }));
    // words = filteredData[time].map(function(d) { return {text: d.word, size:d.pct_total*1000}, ; })

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
      .size([width, height])
      .words(myWords.map(function(d) { return {text: d.word, size:d.pct_total*7000, rank: d.rank, count: d.count, stars: d.star_review}; }))
      .padding(10)        //space between words
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .fontSize(function(d) { return d.size; })      // font size of words
      .on("end", draw);
    layout.start();
    
    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
      svg
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });

        
    }
    function update(data) {
        var t = d3.transition()
            .duration(750);
      
        // JOIN new data with old elements.
        var text = svg.selectAll("text")
          .data(data, function(d) { return d; });
      
        // EXIT old elements not present in new data.
        text.exit()
            .attr("class", "exit")
          .transition(t)
            .attr("y", 60)
            .style("fill-opacity", 1e-6)
            .remove();
      
        // UPDATE old elements present in new data.
        text.attr("class", "update")
            .attr("y", 0)
            .style("fill-opacity", 1)
          .transition(t)
            .attr("x", function(d, i) { return i * 32; });
      
        // ENTER new elements present in new data.
        text.enter().append("text")
            .attr("class", "enter")
            .attr("dy", ".35em")
            .attr("y", -60)
            .attr("x", function(d, i) { return i * 32; })
            .style("fill-opacity", 1e-6)
            .text(function(d) { return d; })
          .transition(t)
            .attr("y", 0)
            .style("fill-opacity", 1);
      }
      var words2 = [
        "You don't know about me without you have read a book called The Adventures of Tom Sawyer but that ain't no matter.",
    ]
      update(words2);

// Grab a random sample of letters from the alphabet, in alphabetical order.
    d3.interval(function() {
    update(d3.shuffle(words2)
        .slice(0, Math.floor(Math.random() * 26))
        .sort());
    }, 1500);
});
};
updateData();

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