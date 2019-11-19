var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

var time = 0;
var interval;
var formattedData;
var trial;
var filteredData;

// Tooltip
// var tip = d3.tip().attr('class', 'd3-tip')
//     .html(function(d) {
//         var text = "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span><br>";
//         text += "<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";
//         text += "<strong>Life Expectancy:</strong> <span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
//         text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
//         text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
//         return text;
//     });
// g.call(tip);

// var continentColor = d3.scaleOrdinal(d3.schemePastel1);

// Labels
var timeLabel = g.append("text")
    .attr("y", height -10)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("1800");


// updateData();

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

function up(data) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

    // var business_id = $("#business-select").val();

    // var data = data.filter(function(d){
    //     return d.continent == continent;
    //     }
    // })

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


//// WORD CLOUD ALTERNATIVE ANIMATION //////

function updateData(){
    d3.json('https://wordcloudapp.herokuapp.com/api', {
        method:"POST",
        body: JSON.stringify({
        business_id: '4JNXUYY8wbaaDmk3BPzlWw'
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(function(data){
        // // Prepare and clean data
        filteredData = {};
        for (var time in data) {   
            if (!data.hasOwnProperty(time)) {
                continue;
            }
            filteredData[time] = data[time];
            filteredData[time].forEach(function(d){
                d["count"] = +d["count"];
                d["pct_total"] = +d["pct_total"];
                d["rank"] = +d["rank"];
                d["star_review"] = +d["star_review"];
            });
            console.log(filteredData);
        // update(formattedData[0]);
        };
        var trial = filteredData[time].map(function(d) { return d.word; });
        console.log(trial);
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(32," + (height / 2) + ")");

function update(data) {
  var t = d3.transition()
      .duration(750);

  // JOIN new data with old elements.
  var text = g.selectAll("text")
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

// The initial display.
update(trial);

// Grab a random sample of letters from the alphabet, in alphabetical order.
d3.interval(function() {
  update(d3.shuffle(trial)
      .slice(0, Math.floor(Math.random() * 26))
      .sort());
}, 1500);
});
};
updateData();

//     function wordCloud(selector) {

//         var fill = d3.scale.category20();
//         var margin = {top: 30, right: 50, bottom: 30, left: 50},
//         width = 800 - margin.left - margin.right,
//         height = 600 - margin.top - margin.bottom;

//         //Construct the word cloud's SVG element
//         var svg = d3.select(selector).append("svg")
//             .attr("width", width)
//             .attr("height", height)
//             .append("g")
//             .attr("transform", "translate(" + width/2 + "," + height/2 + ")");


//         //Draw the word cloud
//         function draw(words) {
//             var cloud = svg.selectAll("g text")
//                             .data(words, function(d) { return d.text; })

//             //Entering words
//             cloud.enter()
//                 .append("text")
//                 .style("font-family", "Impact")
//                 .style("fill", function(d, i) { return fill(i); })
//                 .attr("text-anchor", "middle")
//                 .attr('font-size', 1)
//                 .text(function(d) { return d.text; });

//             //Entering and existing words
//             cloud
//                 .transition()
//                     .duration(600)
//                     .style("font-size", function(d) { return d.size + "px"; })
//                     .attr("transform", function(d) {
//                         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//                     })
//                     .style("fill-opacity", 1);

//             //Exiting words
//             cloud.exit()
//                 .transition()
//                     .duration(200)
//                     .style('fill-opacity', 1e-6)
//                     .attr('font-size', 1)
//                     .remove();
//         }


//         //Use the module pattern to encapsulate the visualisation code. We'll
//         // expose only the parts that need to be public.
//         return {

//             //Recompute the word cloud for a new set of words. This method will
//             // asycnhronously call draw when the layout has been computed.
//             //The outside world will need to call this function, so make it part
//             // of the wordCloud return value.
//             update: function(words) {
//                 d3.layout.cloud().size([width, height])
//                     .words(words)
//                     .padding(5)
//                     .rotate(function() { return ~~(Math.random() * 2) * 90; })
//                     .font("Impact")
//                     .fontSize(function(d) { return d.size; })
//                     .on("end", draw)
//                     .start();
//             }
//         }

//     }
//     //Prepare one of the sample sentences by removing punctuation,
//     // creating an array of words and computing a random size attribute.
//     function getWords(i) {
//         return words[i]
//                 .replace(/[!\.,:;\?]/g, '')
//                 .replace(/[\[\]']+/g,'')
//                 .split(' ')
//                 .map(function(d) {
//                     return {text: d, size: 10 + Math.random() * 60};
//                 })
//         }
//     //This method tells the word cloud to redraw with a new set of words.
//     //In reality the new words would probably come from a server request,
//     // user input or some other source.
//     function showNewWords(vis, i) {
//         i = i || 0;

//         vis.update(getWords(i ++ % words.length))
//         setTimeout(function() { showNewWords(vis, i + 1)}, 2500)
//         }

//     //Create a new instance of the word cloud visualisation.
//     var myWordCloud = wordCloud('#chart-area');

//     //Start cycling through the demo data
//     showNewWords(myWordCloud);
// });
// }

// $("#play-button")
//     .on("click", function(){
//         var button = $(this);
//         if (button.text() == "Play"){
//             button.text("Pause");
//             interval = setInterval(step, 100);            
//         }
//         else {
//             button.text("Play");
//             clearInterval(interval);
//         }
//     })

// $("#reset-button")
//     .on("click", function(){
//         time = 0;
//         update(formattedData[0]);
//     })

// $("#continent-select")
//     .on("change", function(){
//         update(formattedData[time]);
//     })

// $("#date-slider").slider({
//     max: 2014,
//     min: 1800,
//     step: 1,
//     slide: function(event, ui){
//         time = ui.value - 1800;
//         update(formattedData[time]);
//     }
// })

// function step(){
//     // At the end of our data, loop back
//     time = (time < 214) ? time+1 : 0
//     update(formattedData[time]);
// }

// function update(data) {
//     // Standard transition time for the visualization
//     var t = d3.transition()
//         .duration(100);

//     var continent = $("#continent-select").val();

//     var data = data.filter(function(d){
//         if (continent == "all") { return true; }
//         else {
//             return d.continent == continent;
//         }
//     })

//     // JOIN new data with old elements.
//     var circles = g.selectAll("circle").data(data, function(d){
//         return d.country;
//     });

//     // EXIT old elements not present in new data.
//     circles.exit()
//         .attr("class", "exit")
//         .remove();

//     // ENTER new elements present in new data.
//     circles.enter()
//         .append("circle")
//         .attr("class", "enter")
//         .attr("fill", function(d) { return continentColor(d.continent); })
//         .on("mouseover", tip.show)
//         .on("mouseout", tip.hide)
//         .merge(circles)
//         .transition(t)
//             .attr("cy", function(d){ return y(d.life_exp); })
//             .attr("cx", function(d){ return x(d.income) })
//             .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI) });

//     // Update the time label
//     timeLabel.text(+(time + 1800))
//     $("#year")[0].innerHTML = +(time + 1800)

//     $("#date-slider").slider("value", +(time + 1800))
//     }