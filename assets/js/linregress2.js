function run2(){
// set the dimensions and margins of the graph
var margin = {top: 10, right: 0, bottom: 10, left: 20},
    viewBox = {width: 500, height:300},
    width = viewBox.width - margin.left - margin.right,
    height = viewBox.height - margin.top - margin.bottom;

// animation settings
var randomization_skew = 50,
    animationDuration = 1500;

//globals
var userSSE = 0,
    userRMSE = 0,
    SSE = 0,
    RMSE = 0;


drag = d3.drag()
  .on("start", click)
  .on("drag", plotRandomizedPoints)
  .on("end", dragEnd);
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
// append the svg object to the body of the page
var svg = d3.select("#linregress2")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 "+viewBox.width+" "+viewBox.height+"")
  .call(drag)
  .classed("svg-content", true)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top +")");

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 1])
  .range([ 0, width]);

svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0,"+height+")")
  .call(d3.axisBottom(x).ticks(0));

//Add Y axis
var y = d3.scaleLinear()
  .domain([0, 10])
  .range([height, 0]);

svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(5));
  
var circles = [];
function click(){
  circles = [];
  svg.selectAll(".dot").remove();
  svg.selectAll(".regress_line").remove();
  svg.selectAll(".information_title").remove();
  svg.selectAll(".information_value").remove();
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
    var X = [];
    var Y = [];
    for (const circle in circles){
      X.push(circles[circle].x);
      Y.push(circles[circle].y);
    }
    linearRegress(X,Y);
}
function compute_error(){
    var X = [];
    var Y = [];
    for (const circle in circles){
        X.push(circles[circle].x);
        Y.push(circles[circle].y);
    }
    ul_s = slope("#user_line_segment2");
    ul_b = d3.select("#user_line_segment2").attr("y1");
    y_axis_length = 10;
    normalizedY = math.dotMultiply(Y, Array(Y.length).fill(y_axis_length/height));
    var Y_hat = math.add(math.dotMultiply(X,Array(X.length).fill(ul_s)), ul_b);
    normalizedY_hat = math.dotMultiply(Y_hat, Array(Y.length).fill(y_axis_length/height));
    var errors = math.subtract(normalizedY,normalizedY_hat);
    user_SSE = math.round(math.dot(errors, errors),2);
    user_RMSE = math.round(math.sqrt(user_SSE/X.length),2);
}
function compute_error_linregress(s,b){
    var X = [];
    var Y = [];
    for (const circle in circles){
        X.push(circles[circle].x);
        Y.push(circles[circle].y);
    }
    ul_s = s;
    ul_b = b;
    y_axis_length = 10;
    normalizedY = math.dotMultiply(Y, Array(Y.length).fill(y_axis_length/height));
    var Y_hat = math.add(math.dotMultiply(X,Array(X.length).fill(ul_s)), ul_b);
    normalizedY_hat = math.dotMultiply(Y_hat, Array(Y.length).fill(y_axis_length/height));
    var errors = math.subtract(normalizedY,normalizedY_hat);
    SSE = math.round(math.dot(errors, errors),2);
    RMSE = math.round(math.sqrt(SSE/X.length),2);
}
function linearRegress(X,Y){
  var YBar = math.mean(Y);
  var XBar = math.mean(X);
  s = ((math.dot(X,Y) - math.dot(X,Array(Y.length).fill(YBar)))
      /(math.dot(X,X) - math.dot(X,Array(Y.length).fill(XBar))));
  b = YBar - s*XBar;
  drawLinRegress(s,b);
};

function drawLinRegress(s, b){
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
    
    showLinRegressInfo(s, b);
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

function slope(line_id){
    var x1 = parseFloat(d3.select(line_id).attr('x1'));
    var y1 = parseFloat(d3.select(line_id).attr('y1'));
    var x2 = parseFloat(d3.select(line_id).attr('x2'));
    var y2 = parseFloat(d3.select(line_id).attr('y2'));
    return (y2 - y1)/(x2 - x1);
}

var lineDrag = d3.drag()
    .on('start', null)
    .on('drag', function(d){
        var x = d3.event.x;
        var y = d3.event.y;
        var dy = d3.event.dy;
        var x1 = parseFloat(d3.select("#user_line_segment2").attr('x1'));
        var y1New = parseFloat(d3.select("#user_line_segment2").attr('y1'))+ dy;
        var x2 = parseFloat(d3.select("#user_line_segment2").attr('x2'));
        var y2New = parseFloat(d3.select("#user_line_segment2").attr('y2'))+ dy;
        var slope = (y2New-y1New)/(x2-x1);

        userLineSegment.attr("x1",x1)
            .attr("y1",y1New)
            .attr("x2",x2)
            .attr("y2",y2New);


        var ul_x1 = parseFloat(d3.select("#user_line2").attr('x1'));
        var ul_y1 = parseFloat(d3.select("#user_line2").attr('y1'))+ dy;
        var ul_x2 = parseFloat(d3.select("#user_line2").attr('x2'));
        var ul_y2 = parseFloat(d3.select("#user_line2").attr('y2'))+ dy;
        userLine
            .attr("x1", ul_x1)
            .attr("y1", ul_y1)
            .attr("x2", ul_x2)
            .attr("y2", ul_y2);
        userLineVerticalDragger.attr("transform", "translate("+ 0 +","+ y1New + ")")
          .style("cursor", "grabbing");
        userLineRotator.attr("transform", "translate("+ x2 +","+ y2New +")");
        userLineCompute();
        }).on('end', function(){
    });

var lineRotate = d3.drag()
    .on('start', null)
    .on('drag', function(d){
        var x = d3.event.x;
        var y = d3.event.y;
        userLineSegment
            .attr("x2",x)
            .attr("y2",y);
        
        var ul_x1 = -margin.left;
        var ul_y1 = y-(x-ul_x1)*slope("#user_line_segment2");
        var ul_x2 = width;
        var ul_y2 = y-(x-ul_x2)*slope("#user_line_segment2");
        userLine
            .attr("x1", ul_x1)
            .attr("y1", ul_y1)
            .attr("x2", ul_x2)
            .attr("y2", ul_y2);
        userLineRotator.attr("transform", "translate("+ x +","+ y + ")")
          .style("cursor", "grabbing");
        userLineCompute();
        }).on('end', function(){
    }); 

function userLineCompute(){
    compute_error();
    userSSEValue.text(user_SSE);
    userRMSEValue.text(user_RMSE);
}
var userLineSegment = svg.append("line")
  .style("opacity","0")
  .attr("id", "user_line_segment2")
  .attr('x1',0)
  .attr('y1',height/2)
  .attr('x2', width*.95)
  .attr('y2',height/2);

var userLine = svg.append("line")
  .attr("class", "user_line")
  .attr("id", "user_line2")
  .attr('x1',-100)
  .attr('y1',height/2)
  .attr('x2', width + 100)
  .attr('y2',height/2);

var userLineVerticalDragger = svg.append("circle")
  .attr("transform", "translate(" + 0 + "," + height/2 + ")")
  .attr("class", "draggable_button")
  .attr("r", "6")
  .call(lineDrag);

var userLineRotator = svg.append("circle")
  .attr("transform", "translate(" + width*.95 + "," + height/2 + ")")
  .attr("class", "draggable_button")
  .attr("id", "user_line_r")
  .attr("r", "6")
  .call(lineRotate);


error_info_pos = {x:10, y:10};
error_info_col_dist = 35;
error_info_line_dist = 15;

svg.append("text")
  .attr("class", "user_information_title")
  .text("SSE: ")
  .attr("x", error_info_pos.x)
  .attr("y", error_info_pos.y);

var userSSEValue = svg.append("text")
  .attr("class", "user_information_value")
  .text("-")
  .attr("x", error_info_pos.x+error_info_col_dist)
  .attr("y", error_info_pos.y);

svg.append("text")
  .attr("class", "user_information_title")
  .text("RMSE: ")
  .attr("x", error_info_pos.x + 100)
  .attr("y", error_info_pos.y); 
var userRMSEValue = svg.append("text")
  .attr("class", "user_information_value")
  .text("-")
  .attr("x", error_info_pos.x+100+error_info_col_dist+10)
  .attr("y", error_info_pos.y);

function showLinRegressInfo(s,b){
    compute_error_linregress(s,b);
    error_info_pos = {x:10, y:10};
    error_info_col_dist = 35;
    error_info_line_dist = 15;
    error_info_pos.y += error_info_line_dist;
    var SSEText = svg.append("text")
    .attr("class", "information_title")
    .text("SSE: ")
    .attr("x", error_info_pos.x)
    .attr("y", error_info_pos.y);

    var SSEValue = svg.append("text")
    .attr("class", "information_value")
    .text(SSE)
    .attr("x", error_info_pos.x+error_info_col_dist)
    .attr("y", error_info_pos.y);

    var RMSEText = svg.append("text")
    .attr("class", "information_title")
    .text("RMSE: ")
    .attr("x", error_info_pos.x + 100)
    .attr("y", error_info_pos.y); 
    var RMSEValue = svg.append("text")
    .attr("class", "information_value")
    .text(RMSE)
    .attr("x", error_info_pos.x+100+error_info_col_dist+10)
    .attr("y", error_info_pos.y);
};

window.addEventListener('load',  function (){
  var starting_p = {x:50, y:120};
  for (i=0; i<40; i++){
    scatter(starting_p)
    starting_p = {x:starting_p.x+10, y:starting_p.y+2};
  }
  dragEnd();
});
}
run2();