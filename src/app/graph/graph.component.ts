import {Component, ElementRef, Input, NgModule, OnInit, OnChanges, AfterViewInit, OnDestroy} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {miserables} from './data';
import * as d3 from 'd3';
import {nodeLocation} from './NodeLocationInterface';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit, OnDestroy {
  name: string;
  svg;
  gMain;
  height;
  width;
  rect;
  gDraw;
  zoom;
  color;
  simulation;
  link;
  node;
  id:string = '111';

  nodeId: Array<string> = []
  xx: any[]=[];
  xxx={};
  yy:any[]=[];
  yyy={};

  private tooltip1: any;
  private tooltip2: any;
  private tooltip3: any;
  private tooltip4: any;
  private tooltip5: any;
  private tooltip6: any;
  private tooltip7: any;
  private tooltip8: any;

  @Input()

  margin = {top: 20, right: 20, bottom: 30, left: 40};

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
  }

  onResize() {
  }

  ngAfterViewInit() {
    this.svg = d3.select('svg');

    var width = +this.svg.attr('width');
    var height = +this.svg.attr('height');

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    function dist() {
      return this.link.value + 20;
    }

    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return 50;
      }))
      .force("x", d3.forceX(width))
      .force("y", d3.forceY(height));

    this.gMain = this.svg.append('g')
      .classed('g-main', true);

    this.gDraw = this.gMain.append('g')
    this.rect = this.gDraw.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "snow");

    this.render(miserables);
  }

  ticked() {
    var t = this;
    var xw:any='';
    var yw:any='';
    var xw1:any='';
    var yw1:any='';
    this.node
      .attr('cx', function(d) {
        t.xxx={id:d.id,x:d.x};
        t.xx.push(t.xxx);
        return d.x; })

      .attr('cy', function(d) { 
        t.yyy={id:d.id,y:d.y};
        t.yy.push(t.yyy);
        return d.y; });

    this.link
      .attr('x1', function(d) {
        var source = d.source;
        for (let index = 0; index < t.xx.length; index++) {
          if(source==t.xx[index]['id']){
            xw=t.xx[index]['x'];
            t.xx.splice(index,1);
            break;
          }          
        }
        return xw;})

      .attr('y1', function(d) {
        var source = d.source;
        for (let index = 0; index < t.yy.length; index++) {
          if(source==t.yy[index]['id']){
            yw=t.yy[index]['y'];
            t.yy.splice(index,1);
            break;
          }          
        }
        return yw; })

      .attr('x2', function(d) {
        var target = d.target;
        for (let index = 0; index < t.xx.length; index++) {
          if(target==t.xx[index]['id']){
            xw1=t.xx[index]['x'];
            t.xx.splice(index,1);
            break;
          }          
        }
        return xw1; })

      .attr('y2', function(d) {
        var target = d.target;
        for (let index = 0; index < t.yy.length; index++) {
          if(target==t.yy[index]['id']){
            yw1=t.yy[index]['y'];
            t.yy.splice(index,1);
            break;
          }          
        }
        return yw1; });

    this.node
    .on("mouseover", 
      (d)=>{
        var [posX, posY] = [d3.event.x, d3.event.y];

        this.tooltip1 = this.gDraw.append('text')
          .attr("font-family", "Comic Sans MS")
          .attr("font-weight", "bold")
          .attr("text-decoration", "underline")
          .attr("font-size", "18px")
          .attr("fill", "Blue");

        this.tooltip1
          .attr("x", posX+10)
          .attr("y", posY-110)
          .text( d.name );
          
        this.tooltip2 = this.gDraw.append('text')
          .attr("font-family", "Comic Sans MS")
          .attr("font-size", "14px")
          .attr("fill", "voilet");

        this.tooltip2
          .attr("x", posX+10)
          .attr("y", posY-90)
          // .text( (d)=>{
          //   if (d.degreeCentrality != 0){
          //     return d.degreeCentrality;
          //   }
          //   else {
          //     return d.totalPaper;
          //   }
          // } );
          .text( "Degree centrality: "+d.degreeCentrality );
          
          this.tooltip3 = this.gDraw.append('text')
            .attr("font-family", "Comic Sans MS")
            .attr("font-size", "14px")
            .attr("fill", "voilet");
  
          this.tooltip3
            .attr("x", posX+10)
            .attr("y", posY-75)
            .text( "Degree centrality: "+d.closenessCentrality );
          
            this.tooltip4 = this.gDraw.append('text')
              .attr("font-family", "Comic Sans MS")
              .attr("font-size", "14px")
              .attr("fill", "voilet");
    
            this.tooltip4
              .attr("x", posX+10)
              .attr("y", posY-60)
              .text( "Degree centrality: "+d.betweennessCentrality );
          
              this.tooltip5 = this.gDraw.append('text')
                .attr("font-family", "Comic Sans MS")
                .attr("font-size", "14px")
                .attr("fill", "voilet");
      
              this.tooltip5
                .attr("x", posX+10)
                .attr("y", posY-45)
                .text( "Degree centrality: "+d.eigenvectorCentrality );

			})
      .on("mouseout", 
        (d)=>{
          this.tooltip1.style("visibility", "hidden");
          this.tooltip2.style("visibility", "hidden");
          this.tooltip3.style("visibility", "hidden");
          this.tooltip4.style("visibility", "hidden");
          this.tooltip5.style("visibility", "hidden");
        }
      )

			.on("mousemove", (d:any)=>{
				d3.select('.chart-tooltip1')
					.style("left", d3.event.pageX + 15 + "px")
					.style("top", d3.event.pageY - 25 + "px")
					.text(d[1] - d[0]);
      });    
      
    this.link
    .on("mouseover", 
      (d)=>{
        var [posX, posY] = [d3.event.x, d3.event.y];

        this.tooltip6 = this.gDraw.append('text')
          .attr("font-family", "Comic Sans MS")
          .attr("font-weight", "bold")
          .attr("text-decoration", "underline")
          .attr("font-size", "18px")
          .attr("fill", "Green");

        this.tooltip6
          .attr("x", posX+10)
          .attr("y", posY-100)
          .text( d.title );
          
        this.tooltip7= this.gDraw.append('text')
          .attr("font-family", "Comic Sans MS")
          .attr("font-size", "14px")
          .attr("fill", "voilet");

        this.tooltip7
          .attr("x", posX+10)
          .attr("y", posY-80)
          .text( "Year published: "+d.year );
          
        this.tooltip8 = this.gDraw.append('text')
          .attr("font-family", "Comic Sans MS")
          .attr("font-size", "14px")
          .attr("fill", "voilet");

        this.tooltip8
          .attr("x", posX+10)
          .attr("y", posY-65)
          .text( "About: "+d.overview );
          
			})
      .on("mouseout", 
        (d)=>{
          this.tooltip6.style("visibility", "hidden");
          this.tooltip7.style("visibility", "hidden");
          this.tooltip8.style("visibility", "hidden");
        }
      )

			.on("mousemove", (d:any)=>{
				d3.select('.chart-tooltip1')
					.style("left", d3.event.pageX + 15 + "px")
					.style("top", d3.event.pageY - 25 + "px")
					.text(d[1] - d[0]);
			});    

  }

  render(graph) {
    // this.simulation.force("link", d3.forceLink(graph.links));

    this.link = this.gDraw.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke-width', function(d) { return Math.sqrt(d.value); })
      .attr("stroke", (d)=> { return 'black'; });

    this.node = this.gDraw.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('r', (d)=>{
        if (this.id == d.id){
          // d.group = 3;
          return 20;
        }
        else{
          return 10;
        }
      })
      .attr('fill', (d) => this.color(d.group))
      .call(d3.drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', (d) => this.dragged(d))
        .on('end', (d) => this.dragended(d)));

    this.node.append('title')
      .text(function(d) { return "id: "+ d.id; });
    
    this.gDraw.call(d3.zoom().on("zoom",  (d) =>  {
        this.link.attr("transform", d3.event.transform);
        this.node.attr("transform", d3.event.transform);
     }))

    this.simulation
      .nodes(graph.nodes)
      .on('tick', () => this.ticked());

    this.simulation.force('link')
      .links(graph.links);
  }
  
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) { this.simulation.alphaTarget(0); }
    d.fx = null;
    d.fy = null;
  }

  dragstarted(d) {
    if (!d3.event.active) { this.simulation.alphaTarget(0.3).restart(); }
    d.fx = d.x;
    d.fy = d.y;
  }

  ngOnDestroy() {
  }
}
