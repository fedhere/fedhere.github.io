function makecanvas(){
    var canvas = d3.select("body").append("svg:svg")
	.attr("id", "allplots")
	.attr("width",(width+margin.left+margin.right))
	.attr("height",(height+margin.bottom+margin.top))
	.append("g")
	.attr("transform","translate("+margin.left+","+margin.top+")");      
    return canvas;
}

function calcstuff(data,hist, width, height)
{
      xrng = [d3.min(hist.map(function(d) { if (d.x > 0) return d.x - d.dx; })),d3.max(hist.map(function(d) { return d.x + d.dx; }))]


      var x=d3.scale.linear()
         .domain(xrng)
         .range([0,width]);                

      var y=d3.scale.linear()
         .domain([0,d3.max(hist.map(function(i) { return i.length; }))])
         .range([0,height]);
      var yinv=d3.scale.linear()
         .domain([d3.max(hist.map(function(i) { return i.length; })),0])
         .range([0,height]);
    return [x,y,yinv, xrng];
    
}
function gaussianstuff(data,hist)
{
      var mean=0, std=0.0;

      for (var i=0; i<data.length; i++) {
		if (data[i]==undefined || isNaN(data[i])){
			console.log(data[i])
                } else {
		        mean += data[i];
		        std += data[i]*data[i];
                }
      }
      mean/= data.length;
      std /= data.length;
      std  = Math.sqrt(std - mean*mean);
      

      var ga = [];			    
      step=(d3.max(data)-d3.min(data))/100
      datah=hist.map(function (i){ return i.y});
				    
      for (i=0; i<100; i++) {
            xga = d3.min(data) + step*i;
            yga = Math.exp(-(xga-mean)*(xga-mean)/(2.0*std*std))
            ga.push({"x" : xga, "y" : d3.max(datah)*yga});
      }

     return ga;
}

function fillcanvas(canvas,width,height,margin,xAxis,yAxis,x,y,yinv,hist, mytext, ticks, xpos,ypos){
    
    canvas.append("text")
        .attr("x", xpos)
        .attr("y", ypos)
        .attr("fill","#000")
        .attr("text-anchor","right")
        .attr("font-size","20px")
	.text(mytext)

    canvas.append("text")      // text label for the x axis
        .attr("x", width/2)
        .attr("y", height+30 )
        .style("text-anchor", "middle")
	.text(mytext);

    
    var xax = canvas.append("g")
        .attr("class","x axis")
        .attr("transform","translate (0,"+height+")")
        .call(xAxis
	       .ticks(ticks)	
               .scale(x));
    var yax = canvas.append("g")
        .attr("class","y axis")
        .call(yAxis
               .scale(yinv));
    
    var bars = canvas.selectAll(".bar")
        .data(hist)
        .enter()
        .append("g");
    return bars
}
function putgaussian(canvas,ga,margin, height,varline){


    var path=  canvas.append("path")
       	.style("stroke","#990000")
	.style("stroke-width", 2)
	.attr("x", margin.left)
	.attr("y", margin.top)
	.attr("stroke-opacity", 0.4)
	.attr("fill-opacity", 0)
	.attr("d", varline(ga))

    var totalLength = path.node().getTotalLength();
    
    path
	.attr("stroke-dasharray", totalLength + " " + totalLength)
	.attr("stroke-dashoffset", totalLength)
	.transition()
        .duration(2500)
        .ease("linear")
        .attr("stroke-dashoffset", 0);


}

function putrect(x,height,y,width,xrng, bars,name)
{
    bars.append("rect")
        .attr("x",function(d){return x(d.x); })
        .attr("width", function(d){return width*d.dx/(xrng[1]-xrng[0])-1; })
        .attr("y",function(d){return height;})//-y(d.y);})
        .attr("height",0)//function(d){return y(d.y); })
	.attr("fill","#fff")
        .transition().attr("height", function(d) {return y(d.y);})
	.attr("y", function(d) {return height-y(d.y);})
	.duration(2500)
	.transition().attr("fill","#006699").duration(2500);

    bars.on("mouseover", function(d,i) {
            d3.select("#"+name + String(i))
		.transition().duration(500)
		.attr("y",function(d){return height-y(d.y)+5;})
		.attr("font-size","20px");
        })
        .on("mouseout", function(d,i) {
            d3.select("#"+name + String(i))
		.transition().duration(500)
		.attr("y",height)
		.attr("font-size","0px");
        });
}

function putrect_nomo(x,height,y,width,xrng, bars)
{
     bars.append("rect")
        .attr("x",function(d){return x(d.x+d.dx*0.5/3.0); })
        .attr("y",height)//function(d){return height-y(d.y);})
        .attr("width", function(d){return width*d.dx/3.0*2.0/(xrng[1]-xrng[0])-1; })
        .attr("height",0)//function(d){return y(d.y); }) 
	.attr("fill","#006699")
        .attr("fill-opacity",0)
        .transition().attr("height", function(d) {return y(d.y);})
	.attr("y", function(d) {return height-y(d.y);})
	.duration(2500)
	.transition().attr("fill","#e377c2").attr("fill-opacity", 0.6).duration(2500);
        
}

function puttext(x,height,y,width,xrng,bars, name)
{
     bars.append("text")
          .attr("id", function(d,i){return name + String(i);})
	  .attr("x",function(d){return x(d.x+d.dx/2.0); })
          .attr("y",height)
          .attr("fill","#fff")
          .attr("dy","10px")
          .attr("font-size","0px")
          .attr("text-anchor","middle")
          .text(function (d){return d.y;})
          .on("mouseover", function(d,i) {
            d3.select("#"+name + String(i))
               .transition().duration(100)
               .attr("y",function(d){return height-y(d.y);})
               .attr("font-size","15px");
          })
          .on("mouseout", function(d,i) {
            d3.select("#"+name + String(i))
               .transition().duration(100)
               .attr("y",height)
               .attr("font-size","0px");
          });
    return bars
}

function mylegend(legend,name,color,xpos,ypos,data, alpha){
    if (xpos == 'L'){xp = 100;}
    else if (xpos == 'R'){xp = width - 100;}

    legend.append('rect')
        .attr('x', xp)
        .attr('y', ypos)
        .attr('width', 30)
        .attr('height', 10)
        .style('fill', color)
        .style("fill-opacity",alpha);
    
    legend.append('text')
        .attr('x', xp+40)
        .attr('y', ypos+10)
        .attr("fill-opacity",alpha)
        .attr("text-anchor","right")
        .attr("font-size","16px")
	.attr("font-family", "serif")
        .text(name);

}

function plotage(canvas, age,histage, width, height, histageL){
    

    console.log("age here");
    /********age!!***********/

    coordarray=calcstuff(age,histage,width,height);
    xage=coordarray[0];
    yage=coordarray[1];
    yinvage=coordarray[2];
    xrngage=coordarray[3];
    
    gaage = gaussianstuff(age,histage)    
    
    fillcanvas(canvas,width,height,margin,xAxis,yAxis,xage,yage,yinvage,histage, "Age", 20, 20, 20);
    var legend = canvas.selectAll('g')
        .data(age)
        .enter()
	.append('g')
        .attr('class', 'legend');
    
    mylegend(legend,"all","#006699",'R',20,age, 1);
    mylegend(legend,"southpaw","#DDA0DD",'R',40,age, 0.6);

    var varline = d3.svg.line()
        .x(function(d) { return xage(d.x);})
        .y(function(d) { return height-yage(d.y);})
        .interpolate("linear");
    
    putgaussian(canvas,gaage,margin,height, varline)

    var barsage = canvas.selectAll(".bar")
        .data(histage)
        .attr("id","bars")
        .enter()
        .append("g");
    putrect(xage,height,yage,width,xrngage, barsage, "age")
    puttext(xage,height,yage,width,xrngage, barsage, "age")
    
    
    var barsageL = canvas.selectAll(".bar")
        .data(histageL)
        .attr("id","barsL")
        .enter()
        .append("g")
    console.log(histageL)
    putrect_nomo(xage,height,yage,width,xrngage, barsageL)      

return canvas
}

function plotbouts(canvas,bouts,histbouts, width, height){

    console.log("bouts here");
    /********bouts!!***********/

    coordarray=calcstuff(bouts,histbouts,width,height);
    xbouts=coordarray[0];
    ybouts=coordarray[1];
    yinvbouts=coordarray[2];
    xrngbouts=coordarray[3];
    
    gabouts = gaussianstuff(bouts,histbouts)
    
    fillcanvas(canvas,width,height,margin,xAxis,yAxis,xbouts,ybouts,yinvbouts,histbouts, "career fights", 10, width-90, 20)

      var varline = d3.svg.line()
         .x(function(d) { return xbouts(d.x);})
         .y(function(d) { return height-ybouts(d.y);})
         .interpolate("linear");

      putgaussian(canvas,gabouts,margin,height, varline)

      var barsbouts = canvas.selectAll(".bar")
          .data(histbouts)
          .attr("id","bars")
          .enter()
          .append("g");
      putrect(xbouts,height,ybouts,width,xrngbouts, barsbouts, "bouts")
      puttext(xbouts,height,ybouts,width,xrngbouts, barsbouts, "bouts")
return canvas   
}


function plotwins(canvas,wins,histwins, width, height, histwinsL){
    console.log("wins here");
    /********Wins!!***********/

    coordarray=calcstuff(wins,histwins,width,height);
    xwins=coordarray[0];
    ywins=coordarray[1];
    yinvwins=coordarray[2];
    xrngwins=coordarray[3];
    
    gawins = gaussianstuff(wins,histwins)
    
    fillcanvas(canvas,width,height,margin,xAxis,yAxis,xwins,ywins,yinvwins,histwins, "Win ratio", 5, 20, 20)
    var legend = canvas.selectAll('g')
        .data(age)
        .enter()
	.append('g')
        .attr('class', 'legend');
    
    mylegend(legend,"all","#006699",'L',40,wins, 1);
    mylegend(legend,"southpaw","#DDA0DD",'L',60,wins, 0.6);
    
    var varline = d3.svg.line()
        .x(function(d) { return xwins(d.x);})
        .y(function(d) { return height-ywins(d.y);})
        .interpolate("linear");
    
    putgaussian(canvas,gawins,margin,height, varline)
    
    var barswins = canvas.selectAll(".bar")
        .data(histwins)
        .attr("id","bars")
        .enter()
        .append("g");
    putrect(xwins,height,ywins,width,xrngwins, barswins, "wins")
    puttext(xwins,height,ywins,width,xrngwins, barswins, "wins")
    
    
    var barswinsL = canvas.selectAll(".bar")
        .data(histwinsL)
        .attr("id","barsL")
        .enter()
        .append("g")
    console.log(histwinsL)
    putrect_nomo(xwins,height,ywins,width,xrngwins, barswinsL)      
    return canvas
}


function plotkos(canvas,kos,histkos, width, height, histkosL){

    console.log("KOs here");
    /********kos!!***********/    

    coordarray=calcstuff(kos,histkos,width,height);
    xkos=coordarray[0];
    ykos=coordarray[1];
    yinvkos=coordarray[2];
    xrngkos=coordarray[3];
    
    gakos = gaussianstuff(kos,histkos)

    
    fillcanvas(canvas,width,height,margin,xAxis,yAxis,xkos,ykos,yinvkos,histkos, "KOs", 5, width - 50, 20)
    var legend = canvas.selectAll('g')
        .data(age)
        .enter()
	.append('g')
        .attr('class', 'legend');
    
    mylegend(legend,"all","#006699",'R',40,kos, 1);
    mylegend(legend,"southpaw","#DDA0DD",'R',60,kos, 0.6);

    var varline = d3.svg.line()
        .x(function(d) { return xkos(d.x);})
        .y(function(d) { return height-ykos(d.y);})
        .interpolate("linear");
    
    putgaussian(canvas,gakos,margin,height, varline)
    
    var barskos = canvas.selectAll(".bar")
        .data(histkos)
        .attr("id","bars")
        .enter()
        .append("g");

    putrect(xkos,height,ykos,width,xrngkos, barskos, "kos")
    puttext(xkos,height,ykos,width,xrngkos, barskos, "kos")
    
    
    var barskosL = canvas.selectAll(".bar")
        .data(histkosL)
        .attr("id","barsL")
        .enter()
        .append("g")
    console.log(histkosL)
    putrect_nomo(xkos,height,ykos,width,xrngkos, barskosL)      
    return canvas
}
