'use strict'
class Scene{
  constructor(DOMElement){
    this.name = DOMElement.slice(1)
    this.viewBox = {width:600, height:50}
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

class Scene1{
  constructor(DOMElement){
    this.name = DOMElement.slice(1)
    this.viewBox = {width:650, height:50}
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
class Table0 extends Scene{
  constructor(DOMElement){
    super(DOMElement)
    this.state = [1,7]
    this.box = {width:40, height:40, spacing:10}
    this.pos = []
    for (let i=0; i<12; i++){
      this.pos.push(i*(this.box.width + this.box.spacing))
      this.svg
        .append("g")
    }
    this.drag1 = d3.drag()
      .on('start', null)
      .on('drag', this.separator1Drag.bind(this))
      .on('end', null)
    this.drag2 = d3.drag()
      .on('start', null)
      .on('drag', this.separator2Drag.bind(this))
      .on('end', null)
    this.draw()
  }
  separator1Drag(){
    if (d3.event.defaultPrevented) return;
    let x = d3.event.x
    let t = this.separator1
    
    let sx = parseFloat(t.attr("x"))
    if (!(x > 600) && x - sx > 35 ){
      if (this.state[0]+1 === this.state[1]){return}
      this.state[0] += 1
      this.draw()
    }
    else if(!(x < 0) && x - sx < -35){
      t.attr("x", sx - 50)
      this.state[0] -= 1
      this.draw()
    }
  }
  separator2Drag(){
    if (d3.event.defaultPrevented) return;
    let x = d3.event.x
    let t = this.separator2
    
    let sx = parseFloat(t.attr("x"))
    if (!(x > 600) && x - sx > 35 ){
      this.state[1] += 1
      this.draw()
    }
    else if(!(x < 0) && x - sx < -35){
      if (this.state[1]-1 === this.state[0]){return}
      t.attr("x", sx - 50)
      this.state[1] -= 1
      this.draw()
    }
  }
  draw(){
    this.svg.selectAll("*").remove()

    this.svg
      .selectAll("rect")
      .data(this.pos)
      .enter()
        .append("rect")
        .attr("x", d => d)
        .attr("y", "0")
        .attr("width", this.box.width)
        .attr("height", this.box.height)
        .attr("class", "bbox")
    this.separator1 = this.svg
      .append("rect")
      .attr("x", 15+this.state[0]*50)
      .attr("y", "0")
      .attr("width", "10")
      .attr("height", "40")
      .attr("class", "draggable_button")
      .call(this.drag1)
    this.separator2 = this.svg
      .append("rect")
      .attr("x", 15+this.state[1]*50)
      .attr("y", "0")
      .attr("width", "10")
      .attr("height", "40")
      .attr("class", "draggable_button")
      .call(this.drag2)
    
    this.placeCandies()
  }
  placeCandies(){
    let s1 = this.state[0]
    let s2 = this.state[1]
    let  crossSymbol = d3.symbol().size(500).type(d3.symbolCross)
    for(let i=0; i<s1; i++){
      this.svg
        .append("circle")
        .attr("cx", 20+i*50)
        .attr("cy", "20")
        .attr("r", "15")
        .attr("class", "dot")
    }
    for(let i=s1+1; i<s2; i++){
      this.svg
        .append("rect")
        .attr("x", 5+i*50)
        .attr("y", "5")
        .attr("width", 30)
        .attr("height", 30)
        .attr("class", "dot")
    }
    for(let i=s2+1; i<12; i++){
      this.svg
        .append("path")
        .attr("d", crossSymbol)
        .attr("class", "dot")
        .attr("transform", `translate(${20+i*50},20)`)
        
    }
  }
}
const table0 = new Table0("#interactive1")

class Table1 extends Scene1{
  constructor(DOMElement){
    super(DOMElement)
    this.state = [1,6,9]

    this.box = {width:40, height:40, spacing:10}
    this.pos = []
    for (let i=0; i<13; i++){
      this.pos.push(i*(this.box.width + this.box.spacing))
      this.svg
        .append("g")
    }
    this.drag1 = d3.drag()
      .on('start', null)
      .on('drag', this.separator1Drag.bind(this))
      .on('end', null)
    this.drag2 = d3.drag()
      .on('start', null)
      .on('drag', this.separator2Drag.bind(this))
      .on('end', null)
      this.drag3 = d3.drag()
      .on('start', null)
      .on('drag', this.separator3Drag.bind(this))
      .on('end', null)
    this.draw()
  }
  separator1Drag(){
    if (d3.event.defaultPrevented) return;
    let x = d3.event.x
    let t = this.separator1
    
    let sx = parseFloat(t.attr("x"))
    if (!(x > 600) && x - sx > 35 ){
      if (this.state[0]+1 === this.state[1]){return}
      this.state[0] += 1
      this.draw()
    }
    else if(!(x < 0) && x - sx < -35){
      t.attr("x", sx - 50)
      this.state[0] -= 1
      this.draw()
    }
  }
  separator2Drag(){
    if (d3.event.defaultPrevented) return;
    let x = d3.event.x
    let t = this.separator2
    
    let sx = parseFloat(t.attr("x"))
    if (!(x > 600) && x - sx > 35 ){
      this.state[1] += 1
      this.draw()
    }
    else if(!(x < 0) && x - sx < -35){
      if (this.state[1]-1 === this.state[0]){return}
      t.attr("x", sx - 50)
      this.state[1] -= 1
      this.draw()
    }
  }
  separator3Drag(){
    if (d3.event.defaultPrevented) return;
    let x = d3.event.x
    let t = this.separator3
    
    let sx = parseFloat(t.attr("x"))
    if (!(x > 650) && x - sx > 35 ){
      this.state[2] += 1
      this.draw()
    }
    else if(!(x < 0) && x - sx < -35){
      if (this.state[2]-1 === this.state[1]){return}
      t.attr("x", sx - 50)
      this.state[2] -= 1
      this.draw()
    }
  }
  draw(){
    this.svg.selectAll("*").remove()

    this.svg
      .selectAll("rect")
      .data(this.pos)
      .enter()
        .append("rect")
        .attr("x", d => d)
        .attr("y", "0")
        .attr("width", this.box.width)
        .attr("height", this.box.height)
        .attr("class", "bbox")
    this.separator1 = this.svg
      .append("rect")
      .attr("x", 15+this.state[0]*50)
      .attr("y", "0")
      .attr("width", "10")
      .attr("height", "40")
      .attr("class", "draggable_button")
      .call(this.drag1)
    this.separator2 = this.svg
      .append("rect")
      .attr("x", 15+this.state[1]*50)
      .attr("y", "0")
      .attr("width", "10")
      .attr("height", "40")
      .attr("class", "draggable_button")
      .call(this.drag2)
    this.separator3 = this.svg
      .append("rect")
      .attr("x", 15+this.state[2]*50)
      .attr("y", "0")
      .attr("width", "10")
      .attr("height", "40")
      .attr("class", "draggable_button")
      .call(this.drag3)
    this.placeCandies()
  }
  placeCandies(){
    let s1 = this.state[0]
    let s2 = this.state[1]
    let s3 = this.state[2]
    let  crossSymbol = d3.symbol().size(500).type(d3.symbolCross)
    for(let i=0; i<s1; i++){
      this.svg
        .append("circle")
        .attr("cx", 20+i*50)
        .attr("cy", "20")
        .attr("r", "15")
        .attr("class", "dot")
    }
    for(let i=s1+1; i<s2; i++){
      this.svg
        .append("rect")
        .attr("x", 5+i*50)
        .attr("y", "5")
        .attr("width", 30)
        .attr("height", 30)
        .attr("class", "dot")
    }
    for(let i=s2+1; i<s3; i++){
      this.svg
        .append("path")
        .attr("d", crossSymbol)
        .attr("class", "dot")
        .attr("transform", `translate(${20+i*50},20)`)
        
    }
    for(let i=s3+1; i<13; i++){
      this.svg
        .append("rect")
        .attr("class", "unavailable")
        .attr("x", 5+i*50)
        .attr("y", "15")
        .attr("width", 30)
        .attr("height", 10)
        

    }
  }
}
const table1 = new Table1("#interactive2")