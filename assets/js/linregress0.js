function run0(){
  // set the dimensions and margins of the graph
var margin = {top: 0, right: 0, bottom: 10, left: 10},
    viewBox = {width: 500, height:300}
    width = viewBox.width - margin.left - margin.right,
    height = viewBox.height - margin.top - margin.bottom;

// animation settings
var randomization_skew = 50,
    animationDuration = 1500;

drag = d3.drag()
  .on("start", click)
  .on("drag", plotRandomizedPoints)
  .on("end", dragEnd);

// append the svg object to the body of the page
var svg = d3.select("#linregress")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 "+viewBox.width+" "+viewBox.height+"")
  .classed("svg-content", true)
  .call(drag)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top +")");

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 1])
  .range([ 0, width ]);

svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0,"+height+")")
  .call(d3.axisBottom(x).ticks(0));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);

svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(0));

var circles = [];
function click(){
  circles = [];
  svg.selectAll(".dot").remove();
  svg.selectAll(".regress_line").remove();
}
function plotRandomizedPoints(){
  // Ignore the click event if it was suppressed
  if (d3.event.defaultPrevented) return;

  if (circles.length > 0){
      dist_x = d3.event.x - margin.left - circles[circles.length-1].x;
      dist_y = d3.event.y - margin.top - circles[circles.length-1].y;
      dist = Math.sqrt(Math.pow(dist_x,2) + Math.pow(dist_y,2));
      if (dist < 20){
          return;
      }
  } 
  
  // Extract the click location
  var point = d3.mouse(this)
  , p = {x: point[0]-margin.left, y: point[1] - margin.top };

  scatter(p);
  
  }
function dragEnd(){
    var X = []
    var Y = []
    for (const circle in circles){
      X.push(circles[circle].x);
      Y.push(circles[circle].y);
    }
    linearRegress(X,Y);
    
}
function linearRegress(X,Y){
  var YBar = math.mean(Y);
  var XBar = math.mean(X);
  s = ((math.dot(X,Y) - math.dot(X,Array(Y.length).fill(YBar)))
      /(math.dot(X,X) - math.dot(X,Array(Y.length).fill(XBar))));
  b = YBar - s*XBar;
  drawLine(s,b);
}
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function drawLine(s, b){
  sleep(animationDuration).then(() => {
    svg.append("line")
        .style("opacity", "0")
        .attr("class", "regress_line")
        .attr('x1',0)
        .attr('y1',b)
        .attr('x2', width)
        .attr('y2',b + width*s)
        .transition(1000)
          .style("opacity", "1");
  })
  
}
function scatter(p){
  for (var i=0; i<5;i++){
    randx = math.random(-randomization_skew,randomization_skew);
    randy = math.random(-randomization_skew,randomization_skew);
    
    var n = {x:0, y:0};

    svg.append("circle")
        .attr("transform", "translate(" + p.x + "," + p.y + ")")
        .attr("r", "3")
        .attr("class", "dot")
        .transition()
          .duration(animationDuration)
          .ease(d3.easeBackOut.overshoot(1))
          .attr("transform", function(d){
              n.x = p.x + randx;
              n.y = p.y + randy; 
              return "translate("+ (n.x) + "," + (n.y) + ")"});

    //Update circles array
    circles.push(n);
    }
}
window.addEventListener('load', async function (){
  await sleep(1000);
  var starting_p = {x:50, y:230};
  for (i=0; i<40; i++){
    await sleep(30);
    scatter(starting_p)
    starting_p = {x:starting_p.x+10, y:starting_p.y-4};
  }
  dragEnd();
});
}
run0();