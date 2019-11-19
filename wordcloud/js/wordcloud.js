var ItemSelect;
var filteredData;
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%m/%d/%Y");
var time;
var words;
var cloud;
var instance = 0;
var interval;

var fill = d3.scaleLinear()
        .domain([0, 25, 50, 75, 100, 125, 150])
        .range(["#98C0D9", "#8DA1D7", "#8A82D6", "#A178D5", 
                "#C06ED4", "#D364C1", "#d25a94"]);

var setcolor = d3.scaleLinear()
        .domain([1, 2, 3, 4, 5])
        .range(["#8A82D6", "#8A82D6", "#8A82D6", "#A178D5", "#d25a94"]);

var margin = {top: 30, right: 50, bottom: 30, left: 50},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

function loadData(){
    d3.json('https://wordcloudapp.herokuapp.com/api', {
        method:"POST",
        body: JSON.stringify({
        business_id: ItemSelect
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
            var maxValue = d3.max(filteredData[dates], function(d){
                            return d.pct_total;});
            sentences = filteredData[dates].map(function(d) { return {text: d.word,
                        size:d.pct_total*(130/maxValue), stars: d.star_review}; });
            words.push(sentences);
    };

    d = d3.keys(filteredData);
    time = d.filter(function (el) {
        return el != "undefined";
      });
    console.log(words);
    console.log(time);
    window.wordCloud = function () {

        function draw(words) {
            var cloud = svg.selectAll("g text")
                            .data(words, function(d) { return d.text; })

            cloud.enter()
                .append("text")
                .style("font-family", "Nunito Sans")
                .style("fill", function(d) { return fill(d.size); })
                .attr("text-anchor", "middle")
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1)
                .text(function(d) { return d.text; });

            
            cloud
                .transition()
                    .duration(600)
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("fill", function(d) { return fill(d.size); })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .style("fill-opacity", 1);

        
            cloud.exit()
                .transition()
                    .duration(200)
                    .style('fill-opacity', 1e-6)
                    // .attr('font-size', 1)
                    .remove();
        }


        return {

            update: function(words) {
                d3.layout.cloud().size([width, height])
                    .words(words)
                    .padding(6)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Nunito Sans")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
            }
        }

    }
    
    
    window.firstWords = function (words) {
        d3.layout.cloud().size([width, height])
                    .words(words)
                    .padding(6)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Nunito Sans")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();

            function draw(words) {
                var cloud = svg.selectAll("g text")
                                .data(words)
    
                cloud.enter()
                    .append("text")
                    .style("font-family", "Nunito Sans")
                    // .style("fill", "#d25a94")
                    .style("fill", function(d) { return fill(d.size); })
                    .attr("text-anchor", "middle")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .transition()
                    .duration(600)
                    .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("fill-opacity", 1)
                    .text(function(d) { return d.text; });
            }
        }

    
    window.setBackground = function (instance) {
        star = [];

        var f = d3.format(".2f");

        for (var rating in words) {
            review = words[rating].map(function(d) { return d.stars; })
            star.push(d3.mean(review));
        }

        var reviews = star;

        d3.select("#avg-stars")
            .transition()
            .duration(600)
            .style("color", setcolor(reviews[instance]))
            .text(f(reviews[instance]));

    }

    window.showNewWordsTwo = function (vis, instance) {
        vis.update(words[instance]);
        $("#date-slider").slider("value", instance);
        $("#dateLabel1").text(formatTime(new Date(time[instance])));
        }
    
    var myWordCloud = wordCloud();
    
    firstWords(words[0]);
    setBackground(0);
    $("#dateLabel1").text(formatTime(new Date(time[0])));
    setBackground(0);


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
        setBackground(0);
    })

    
    $(function() {
        $("#date-slider").slider({
            min: 0,
            max: time.length - 1,
            step: 1,
            slide: function(event, ui) {                        
                $("#dateLabel1").text(formatTime(new Date(time[ui.value])));
                instance = time.indexOf(time[ui.value]);
                showNewWordsTwo(wordCloud(), instance);
                setBackground(instance);
            }
        });
    });
});
};

function getInput(){
    if (typeof ItemSelect == 'undefined'){
        ItemSelect = '4JNXUYY8wbaaDmk3BPzlWw';
        console.log(ItemSelect);
        return ItemSelect;
    } else {
    console.log(ItemSelect);
    return ItemSelect;
    }
}

getInput();
loadData();

$("#play-button")
.on("click", function(){
    var button = $(this);
    if (button.text() == "Play"){
        button.text("Pause");
        interval = setInterval(step, 2500);        
    }
    else {
        button.text("Play");
        clearInterval(interval);
    }
})


function step(){
    instance = (instance < 10) ? instance+1 : 0
    showNewWordsTwo(wordCloud(), instance);
    setBackground(instance);
}

$("#var-select")
.on("change", function(){
    updatevis();
})


function updatevis() {
    
    var t = d3.transition()
        .duration(100);

    var cloud = svg.selectAll("g text")
                            .data(words, function(d) { return d.text; });

    cloud.exit()
         .attr("class", "exit")
         .remove();

    instance = 0;
    
    loadData();
    }