 /*
*    Main.js for Yelp Insights dashboard
*/
var lineChart;
var lineChart2;
var bellCurve;
var posnegchart;
var histogram;
var table;
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d-%m-%Y");

// Event listeners
$("#var-select").on("change", onSelectChange)

function onSelectChange() {
    getData();
    updateStats();
}

function getData(){
    d3.json('https://wordcloudapp.herokuapp.com/dashboard', {
        method:"POST",
        body: JSON.stringify({
        business_id: $("#var-select").val()
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(function(data){ 

        console.log(data);
        filteredData = data;

        d3.selectAll("svg").remove();
        d3.selectAll("#ctable").remove();
        d3.selectAll("#c2table").remove();
        lineChart = new LineChart("#chart-area1");
        lineChart2 = new LineChart2("#chart-area2");
        bellCurve = new BellCurve("#chart-area3");
        posnegchart = new PosNegChart("#chart-area4");
        histogram = new Histogram("#chart-area5");
        table = new Table("#chart-area6");

        })
}
getData();

// function updateCharts(){
//     lineChart.wrangleData()
//     lineChart2.wrangleData()
//     bellCurve.wrangleData()
//     posnegchart.wrangleData()
//     histogram = wrangleData();
//     table = wrangleData();
// }

// $("#var-select").on("change", function(){
//     getData();
//     lineChart.transitionNew();
// })