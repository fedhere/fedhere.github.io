function readparsedata(data){

console.log(data)

   var bouts=data.map(function (i){if (i.bouts > 0) return parseFloat(i.bouts)});
   var histbouts  = d3.layout.histogram()
   .bins(15)
   (bouts)
   
   var age=data.map(function (i){return parseInt(i.age)});
   var histage  = d3.layout.histogram()
   .bins(20)
   (age)
   
   var ageL=data.map(function (i){if (i.stance==1) return parseInt(i.age)});
   var histageL  = d3.layout.histogram()
   .range([d3.min(age),d3.max(age)])
   .bins(20)
   (ageL)
   
   var wins=data.map(function (i){if (i.bouts>0) return parseFloat(i.wins)/parseFloat(i.bouts)});
   var histwins  = d3.layout.histogram()
   .bins(10)
   (wins)
   
   var winsL=data.map(function (i){if (i.stance==1) return parseFloat(i.wins)/parseFloat(i.bouts)});
   var histwinsL  = d3.layout.histogram()
   .range([d3.min(wins),d3.max(wins)])
   .bins(10)
   (winsL)
   
   var kos=data.map(function (i){ return parseInt(i.KOs)});
   var histkos  = d3.layout.histogram()
   .bins(10)
   (kos)
   
   var kosL=data.map(function (i){if (i.stance==1) return parseInt(i.KOs)});
   var histkosL  = d3.layout.histogram()
   .range([d3.min(kos),d3.max(kos)])
   .bins(10)
   (kosL)

    return [   age,histage,ageL,histageL,bouts,histbouts,wins,histwins,winsL,histwinsL,kos,histkos,kosL,histkosL]
   }
