'use strict'
class Scene{
  constructor(DOMElement){
    this.name = DOMElement.slice(1)
    this.viewBox = {width:500, height:300}
    this.svg = d3.select(DOMElement)
      .append("svg")
        .attr("id", this.name)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.viewBox.width} ${this.viewBox.height}`)
        .classed("svg-content", true)
    this.updateSize()
  }
  updateSize(){
    this.clientSVGWidth = document.getElementById(this.name).clientWidth
    this.clientSVGHeight = document.getElementById(this.name).clientHeight
    this.S2VX = d3.scaleLinear()
      .domain([0,this.clientSVGWidth])
      .range([0, this.viewBox.width])
    this.S2VY = d3.scaleLinear()
      .domain([0,this.clientSVGHeight])
      .range([0, this.viewBox.height])
  }
}

class EmptyGraph extends Scene{
  constructor(DOMElement){
    super(DOMElement)

    this.margin = {top: 10, right: 10, bottom: 20, left: 25}

    this.boundedWidth = this.viewBox.width
      - this.margin.left
      - this.margin.right
    this.boundedHeight = this.viewBox.height
      - this.margin.top
      - this.margin.bottom
    this.gX = 1
    this.gY = 1
    this.bounds = this.svg.append("g")
      .attr("transform", `translate(${
        this.margin.left
      }, ${
        this.margin.top
      })`)

    this.x = d3.scaleLinear()
      .domain([0, this.gX])
      .range([0, this.boundedWidth])
    
    this.y = d3.scaleLinear()
      .domain([0, this.gY])
      .range([this.boundedHeight, 0])
    
    this.yAxis = this.bounds.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft().scale(this.y).ticks(0))
    
    this.xAxis = this.bounds.append("g")
      .attr("class", "axis")
      .call(d3.axisBottom().scale(this.x).ticks(0))
      .attr("transform", `translate(0, ${
        this.boundedHeight
      })`)
  }
  cPos(input_type, p){
    // input type:  [s]vg: Top left origin
    //              [v]iewBox: Top left origin
    //              [g]raph (Cartesian; origin at the intersection of the axes)
    // p: an object with x and y attributes
    let sp, vp, gp;
    if (input_type == "s"){
      sp = {x: p.x, y: p.y}
      vp = {x: this.S2VX(p.x), y: this.S2VY(p.y)}
      gp = {x: this.x.invert(vp.x - this.margin.left),
            y: this.y.invert(vp.y - this.margin.top)}
    }
    else if (input_type == "v"){
      vp = {x: p.x, y: p.y}
      sp = {x: this.S2VX.invert(p.x),
            y: this.S2VY.invert(p.y)}
      gp = this.cPos("s", sp).g
    }
    else if (input_type == "g"){
      gp = {x: p.x, y: p.y}
      vp = {x: this.x(p.x) + this.margin.left,
            y: this.y(p.y) + this.margin.top}
      sp = this.cPos("v", vp).s
    }
    else{
      console.log("cPos Type isn't recognized")
    }
    return {s:sp, v:vp, g:gp}
  }
}

class ScatterGraph extends EmptyGraph{
  constructor(DOMElement){
    super(DOMElement)   
    this.randomizationSkew = 0.15
    this.animationDuration = 1500
    this.dot_pos = []
    this.lastMousePos = {x: null, y:null}
    this.drag = d3.drag()
      .on("start", this.dragStart.bind(this))
      .on("drag", this.dragging.bind(this))
      .on("end", this.dragEnd.bind(this))
  }
  dragStart(){
    this.dot_pos = [];
    this.svg.selectAll(".dot").remove();
    this.svg.selectAll(".regress_line").remove();
  }
  dragging(){
    // Ignore the click event if it was suppressed    
    if (d3.event.defaultPrevented) return;

    let pos = this.cPos("s", {x: d3.event.x, y:d3.event.y})
    if (this.dot_pos.length > 0){
        let dist_x = pos.g.x - this.lastMousePos.x
        let dist_y = pos.g.y - this.lastMousePos.y
        let dist = Math.sqrt(Math.pow(dist_x,2) + Math.pow(dist_y,2));
        if (dist < 0.03){ return; }
    }
    this.scatter(pos);
    this.lastMousePos = pos.g
  }
  dragEnd(){
    let  X = [], Y = [];
    this.dot_pos.forEach(dot => {
      X.push(dot.x)
      Y.push(dot.y)
    })
    this.drawLinearRegress(X,Y)
  }
  drawLinearRegress(X,Y){
    this.linRegressParams = linearRegress(X,Y)
    this.drawLine(this.linRegressParams.s, this.linRegressParams.b)
  }
  scatter(dot){
    // dot comes in as a pos object
    for (var i=0; i<5;i++){
      const randx = math.random(-this.randomizationSkew,this.randomizationSkew);
      const randy = math.random(-this.randomizationSkew,this.randomizationSkew);
      const n = this.cPos("g", {x: dot.g.x + randx, y: dot.g.y + randy})
      this.svg.append("circle")
        .attr("cx", dot.v.x)
        .attr("cy", dot.v.y)
        .attr("r", "3")
        .attr("class", "dot")
        .transition()
          .duration(this.animationDuration)
          .ease(d3.easeBackOut.overshoot(1))
          .attr("cx", n.v.x)
          .attr("cy", n.v.y);

      this.dot_pos.push(n.g);
    }
  }
  drawLine(s, b){
    sleep(this.animationDuration).then(() => {
      let gp1 = {x: 0, y: b},
          vp1 = this.cPos("g", gp1).v,
          gp2 = {x: this.gX, y: s*this.gX + b},
          vp2 = this.cPos("g", gp2).v
      
      this.svg.append("line")
        .style("opacity", "0")
        .attr("class", "regress_line")
        .attr('x1', vp1.x)
        .attr('y1', vp1.y)
        .attr('x2', vp2.x)
        .attr('y2', vp2.y)
        .transition(1000)
          .style("opacity", "1");
    })
  }
}
// Helpers
function linearRegress(X,Y){
  let YBar = math.mean(Y), XBar = math.mean(X);
  const s = ((math.dot(X,Y) - math.dot(X,Array(Y.length).fill(YBar)))
      /(math.dot(X,X) - math.dot(X,Array(Y.length).fill(XBar))));
  const b = YBar - s*XBar;
  return {s:s, b:b}
}
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
//-----

let gr = new ScatterGraph("#linregress0")
gr.svg.call(gr.drag)

window.addEventListener("resize", gr.updateSize.bind(gr))
window.addEventListener('load', async function (){
  await sleep(1000);
  let starting_gp = gr.cPos("g",{x:0.15, y:0.25})
  for (let i=0; i<40; i++){
    await sleep(30);
    gr.scatter(starting_gp)
    starting_gp = gr.cPos("g",{x:starting_gp.g.x+0.02, y:starting_gp.g.y+0.015})
  }
  gr.dragEnd();
});

class CostGraph extends ScatterGraph{
  constructor(DOMElement){
    super(DOMElement)
    this.error_info_pos = {x:this.margin.left+10, y:this.margin.top+10};
    this.error_info_col_dist = 35;
    this.error_info_line_dist = 15;
    this.xAxis.call(d3.axisBottom(this.x).ticks(1))
    this.yAxis.call(d3.axisLeft(this.y).ticks(1))
    this.userSSEText = this.svg.append("text")
      .attr("class", "user_information_title")
      .text("SSE: ")
      .attr("x", this.error_info_pos.x)
      .attr("y", this.error_info_pos.y);

    this.userSSEValue = this.svg.append("text")
      .attr("class", "user_information_value")
      .text("-")
      .attr("x", this.error_info_pos.x + this.error_info_col_dist)
      .attr("y", this.error_info_pos.y);

    this.userRMSEText = this.svg.append("text")
      .attr("class", "user_information_title")
      .text("RMSE: ")
      .attr("x", this.error_info_pos.x + 100)
      .attr("y", this.error_info_pos.y);
      
    this.userRMSEValue = this.svg.append("text")
      .attr("class", "user_information_value")
      .text("-")
      .attr("x", this.error_info_pos.x+100 + this.error_info_col_dist+10)
      .attr("y", this.error_info_pos.y);
    this.addUserInteractable()
  }
  addUserInteractable(){
    
    const p1 = this.cPos("g", {x:0,y:0.5})
    const p2 = this.cPos("g", {x:1,y:0.5})
    this.userLineSegment = this.svg.append("line")
      .style("opacity","0")
      .attr("id", "user_line_segment")
    this.userLine = this.svg.append("line")
      .attr("class", "user_line")
      .attr("id", "user_line")
    this.userLineVerticalDragger = this.svg.append("circle")
      .attr("class", "draggable_button")
      .attr("r", "6")
      .call(this.lineDrag);
    this.userLineRotator = this.svg.append("circle")
      .attr("class", "draggable_button")
      .attr("id", "user_line_r")
      .attr("r", "6")
      .call(this.lineRotate);

    this.updateUserInteractable(p1,p2)
  }
  lineDragging(){
    if (d3.event.defaultPrevented) return;
    
    var dy = d3.event.dy;
    let p1 = {x:null, y:null}
    let p2 = {x:null, y:null}
    p1.x = this.userLineSegment.attr("x1");
    p1.y = parseFloat(this.userLineSegment.attr('y1'))+ dy;
    p2.x = parseFloat(this.userLineSegment.attr('x2'));
    p2.y = parseFloat(this.userLineSegment.attr('y2'))+ dy;
    p1 = this.cPos("v", p1)
    p2 = this.cPos("v", p2)
    this.userLineVerticalDragger
      .style("cursor", "grabbing")
    this.update(p1,p2)
  }
  lineRotate = d3.drag()
    .on('start', null)
    .on('drag', function(d){
      let dx = d3.event.dx
      let dy = d3.event.dy
      let p1 = {x:null, y:null}
      let p2 = {x:null, y:null}
      p1.x = parseFloat(this.userLineSegment.attr('x1'))
      p1.y = parseFloat(this.userLineSegment.attr('y1'))
      p2.x = parseFloat(this.userLineSegment.attr('x2')) + dx;
      p2.y = parseFloat(this.userLineSegment.attr('y2'))+ dy;
      p1 = this.cPos("v", p1)
      p2 = this.cPos("v", p2)
      this.update(p1,p2)
      this.userLineRotator
        .style("cursor", "grabbing")
      // userLineCompute();
      }.bind(this)).on('end', function(){
        this.userLineRotator
          .style("cursor", "grab")
    }.bind(this));
  update(p1, p2){
    this.updateUserInteractable(p1,p2)
    this.updateErrors(p1,p2)

  }
  updateErrors(p1,p2){
    let user_SSE = this.computeErrors(p1,p2).SSE,
        user_RMSE = this.computeErrors(p1,p2).RMSE
    this.userSSEValue.text(user_SSE)
    this.userRMSEValue.text(user_RMSE)
  }
  updateUserInteractable(p1,p2){
    const slope = this.slope(p1.v,p2.v)
    
    this.userLineSegment
      .attr('x1',p1.v.x)
      .attr('y1',p1.v.y)
      .attr('x2', p2.v.x)
      .attr('y2',p2.v.y);
    var ul_x1 = 0;
    var ul_y1 = p1.v.y-(p1.v.x-ul_x1)*slope;
    var ul_x2 = this.viewBox.width;
    var ul_y2 = p2.v.y-(p2.v.x-ul_x2)*slope;
    this.userLine
      .attr('x1',ul_x1)
      .attr('y1',ul_y1)
      .attr('x2',ul_x2)
      .attr('y2',ul_y2);
    this.userLineVerticalDragger
      .attr("cx", p1.v.x)
      .attr("cy", p1.v.y)
    this.userLineRotator
      .attr("cx", p2.v.x)
      .attr("cy", p2.v.y)
      .attr("class", "draggable_button")
  }
  lineDrag = d3.drag()
    .on('start', null)
    .on('drag', this.lineDragging.bind(this))
    .on('end', this.lineDragEnd.bind(this))

  lineDragEnd(){
    this.userLineVerticalDragger
      .style("cursor", "grab")
  }
  computeErrors(p1,p2){
    var X = [];
    var Y = [];
    this.dot_pos.forEach(dot => {
        X.push(dot.x);
        Y.push(dot.y);
    })
    let ul_s = this.slope(p1.g, p2.g),
        ul_b = p1.g.y
    var Y_hat = math.add(math.dotMultiply(X,Array(X.length).fill(ul_s)), ul_b);
    var errors = math.subtract(Y,Y_hat);
    let SSE = math.round(math.dot(errors, errors),2)
    return {SSE: SSE,
            RMSE: math.round(math.sqrt(SSE/X.length),4)}
  }
  slope(p1,p2){
    return (p2.y - p1.y)/(p2.x - p1.x);
  }

}
const linregress1 = new CostGraph("#linregress1")

window.addEventListener("resize", linregress1.updateSize.bind(linregress1))
window.addEventListener('load', async function (){
  await sleep(1000);
  var starting_p = linregress1.cPos("g",{x:0.15, y:0.25})
  for (let i=0; i<40; i++){
    await sleep(30);
    linregress1.scatter(starting_p)
    starting_p = linregress1.cPos("g",{x:starting_p.g.x+0.02, y:starting_p.g.y+0.015})
  }
});

class CostRegressGraph extends CostGraph{
  constructor(DOMElement){
    super(DOMElement)
    this.error_info_pos.y += this.error_info_line_dist
  }
  dragStart(){
    super.dragStart()
    this.svg.selectAll(".information_title").remove();
    this.svg.selectAll(".information_value").remove();
  }
  dragEnd(){
    super.dragEnd()
    sleep(this.animationDuration).then(() => {
      
      this.showLinRegressInfo()
    })
    
  }
  showLinRegressInfo(){
    let p1 = this.cPos("g", {x:0, y:this.linRegressParams.b})
    let p2 = this.cPos("g", {x:this.gX, y:this.linRegressParams.b
                             + this.linRegressParams.s*this.gX})
    let bestSSE = this.computeErrors(p1,p2).SSE
    let bestRMSE = this.computeErrors(p1,p2).RMSE
    
    var SSEText = this.svg.append("text")
    .attr("class", "information_title")
    .text("SSE: ")
    .attr("x", this.error_info_pos.x)
    .attr("y", this.error_info_pos.y);

    var SSEValue = this.svg.append("text")
    .attr("class", "information_value")
    .text(bestSSE)
    .attr("x", this.error_info_pos.x+this.error_info_col_dist)
    .attr("y", this.error_info_pos.y);

    var RMSEText = this.svg.append("text")
    .attr("class", "information_title")
    .text("RMSE: ")
    .attr("x", this.error_info_pos.x + 100)
    .attr("y", this.error_info_pos.y); 
    var RMSEValue = this.svg.append("text")
    .attr("class", "information_value")
    .text(bestRMSE)
    .attr("x", this.error_info_pos.x+100+this.error_info_col_dist+10)
    .attr("y", this.error_info_pos.y);
}
}
const linregress2 = new CostRegressGraph("#linregress2")
linregress2.svg.call(linregress2.drag)
window.addEventListener("resize", linregress2.updateSize.bind(linregress2))
window.addEventListener('load', async function (){
  await sleep(1000);
  var starting_p = linregress2.cPos("g",{x:0.15, y:0.25})
  for (let i=0; i<40; i++){
    await sleep(30);
    linregress2.scatter(starting_p)
    starting_p = linregress2.cPos("g",{x:starting_p.g.x+0.02, y:starting_p.g.y+0.015})
  }
  linregress2.dragEnd()
});