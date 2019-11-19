var filteredData;
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%m/%d/%Y");
var time;
var words;
var cloud;
var instance = 0;
var interval;

var fill = d3.scaleOrdinal(d3.schemeCategory10);
var margin = {top: 30, right: 50, bottom: 30, left: 50},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

//Construct the word cloud's SVG element
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

function loadData(){
    d3.json('https://wordcloudapp.herokuapp.com/api', {
        method:"POST",
        body: JSON.stringify({
        business_id: $("#business-select").val()
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(function(data){
        console.log(data);
        filteredData = {};
        words = [];
        filteredData[dates] = data[dates];
        for (var dates in data) {   
            if (!data.hasOwnProperty(dates)) {
                continue;
            }
            filteredData[dates] = data[dates];
            sentences = filteredData[dates].map(function(d) { return {text: d.word,
                        size:d.pct_total*7000, stars: d.star_review}; });
            words.push(sentences);
    };
        // update(filteredData[d3.keys(filteredData)[0]]);
    // console.log(filteredData[d3.keys(filteredData)[0]]);
    d = d3.keys(filteredData);
    time = d.filter(function (el) {
        return el != "undefined";
      });
    console.log(words);
    console.log(time);
    window.wordCloud = function () {

         //Date label
        //  var timeLabel = svg.append("text")
        //     .attr("y", height -10)
        //     .attr("x", width - 40)
        //     .attr("font-size", "40px")
        //     .attr("opacity", "0.4")
        //     .attr("text-anchor", "middle")
        //     .text(d3.keys(filteredData)[0]);

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
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1)
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
                    // .attr('font-size', 1)
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
    
    
    window.firstWords = function (words) {
        d3.layout.cloud().size([width, height])
                    .words(words)
                    .padding(5)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();

            // This function takes the output of 'layout' above and draw the words
            // Wordcloud features that are THE SAME from one word to the other can be here
            function draw(words) {
                var cloud = svg.selectAll("g text")
                                .data(words)
    
                //Entering words
                cloud.enter()
                    .append("text")
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { return fill(i); })
                    .attr("text-anchor", "middle")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("fill-opacity", 1)
                    .text(function(d) { return d.text; });
            }
        }

    function showNewWords(vis, i) {
        i = i || 0;

        vis.update(words[i ++ % words.length])
        setTimeout(function() { showNewWords(vis, i + 1)}, 2500)
        }

    window.showNewWordsTwo = function (vis, instance) {
        vis.update(words[instance]);
        $("#date-slider").slider("value", instance);
        $("#dateLabel1").text(formatTime(new Date(time[instance])));
        }
    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud();
    //Start cycling through the data
    firstWords(words[0]);

    function updateSameData(instance) {
        // Standard transition time for the visualization
        var t = d3.transition()
            .duration(100);
        
        showNewWords(wordCloud(), instance)
    
        // Update the time label
        // timeLabel.text(+(time + 1800))
        // $("#year")[0].innerHTML = +(time + 1800)
    
        // $("#date-slider").slider("value", +(time + 1800))
        }

    $("#reset-button")
    .on("click", function(){
        var t = d3.transition()
            .duration(100);
    
        var cloud = svg.selectAll("g text")
            .data(words, function(d) { return d.text; });
    
        cloud.exit()
            .attr("class", "exit")
            .remove();
        
        $("#date-slider").slider("value", 0);
        $("#dateLabel1").text(formatTime(new Date(time[0])));
        firstWords(words[0]);
    })

    
    $(function() {
        $("#date-slider").slider({
            min: 0,
            max: time.length - 1,
            step: 1,
            slide: function(event, ui) {                        
                $("#dateLabel1").text(formatTime(new Date(time[ui.value])));
                // $("#dateLabel2").text(formatTime(new Date(time[ui.values[1]])));
                instance = time.indexOf(time[ui.value]);
                showNewWordsTwo(wordCloud(), instance);
            }
        });
        // $("#dateLabel1").text(formatTime(new Date(time[$("#date-slider").slider("values", 0)])));
        // $("#dateLabel2").text(formatTime(new Date(time[$("#date-slider").slider("values", 1)])));
        });

});
};
loadData();

$("#play-button")
.on("click", function(){
    var button = $(this);
    if (button.text() == "Play"){
        button.text("Pause");
        // showNewWords(wordCloud());
        interval = setInterval(step, 2500);        
    }
    else {
        button.text("Play");
        // d3.select(this).finish();
        clearInterval(interval);
    }
})


function step(){
    // At the end of our data, loop back
    instance = (instance < 10) ? instance+1 : 0
    showNewWordsTwo(wordCloud(), instance);
}

$("#business-select")
.on("change", function(){
    updatevis();
})

// $("#date-slider").slider("value", time[instance]);

function updatevis() {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);
    
    // var any = d3.selectAll("svg")
    //     .exit()
    //     .attr("class", "exit")
    //     .remove();
    var cloud = svg.selectAll("g text")
                            .data(words, function(d) { return d.text; });

    cloud.exit()
         .attr("class", "exit")
         .remove();

    instance = 0;

    // $("#play-button").off();
    // d3.selectAll("svg").remove();
    
    loadData();

    // Update the time label
    // timeLabel.text(+(time + 1800))
    // $("#year")[0].innerHTML = +(time + 1800)

    // $("#date-slider").slider("value", +(time + 1800))
    }


    ///////sparklines///////

    window.sparklines = function () {

        var graph = d3.select("#graph1")
            // .data(words, function(d) { return d.stars; })
            .append("svg:svg")
            .attr("width", "100%")
            .attr("height", "100%");    
    
        star = [];

        for (var rating in words) {
            review = words[rating].map(function(d) { return d.stars; })
            star.push(d3.mean(review));
        }

        var data = star;

        // var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 9];

        console.log(data);
        // X scale will fit values from 0-10 within pixels 0-100
        var x = d3.scaleLinear().domain([0, 10]).range([-5, 300]); // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
        // Y scale will fit values from 0-10 within pixels 0-100
        var y = d3.scaleLinear().domain([4, 4.5]).range([0, 30]);

        // create a line object that represents the SVN line we're creating
        var line = d3.line()
            // assign the X function to plot our line as we wish
            .x(function(d,i) { 
                // verbose logging to show what's actually being done
                //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                // return the X coordinate where we want to plot this datapoint
                return x(i); 
            })
            .y(function(d) { 
                // verbose logging to show what's actually being done
                //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                // return the Y coordinate where we want to plot this datapoint
                return y(d); 
            })
            .curve(d3.curveBasis);
    
            // display the line by appending an svg:path element with the data line we created above
            graph.append("svg:path").attr("d", line(data));
            // or it can be done like this
            //graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line);
            
            
            function redrawWithAnimation() {
                // update with animation
                graph.selectAll("path")
                    .data([data]) // set the new data
                    .attr("transform", "translate(" + x(1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
                    .attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
                    .transition() // start a transition to bring the new value into view
                    .ease(d3.easeLinear)
                    .duration(2500) // for this demo we want a continual slide so set this to the same as the setInterval amount below
                    .attr("transform", "translate(" + x(0) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value
                    
                    /* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
            }
            
            setInterval(function() {
               var v = data.shift(); // remove the first element of the array
               data.push(v); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
                   redrawWithAnimation();}, 2500);
        }