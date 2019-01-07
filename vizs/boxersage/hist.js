
function clear_radio_buttons() {
    for (var i = 0; i < document.form1.radio1.length; i++) {
	document.form1.radio1[i].checked = false;
    }} 
     

function change(name) {
    console.log ("&******** ",name);		
    d3.select("#allplots").remove()
    if (name == 'age'){
	canvas = makecanvas();			
	return  canvas=
	    plotage(canvas,age,histage, width, height, histageL); }
    else if (name == 'bouts'){
	canvas = makecanvas();
	return  canvas=
	    plotbouts(canvas,bouts,histbouts, width, height); }
    else if (name == 'wins'){
	canvas = makecanvas();
	return  canvas=
	    plotwins(canvas,wins,histwins, width, height, histwinsL); }
    else if (name == 'kos'){
	canvas = makecanvas();
	return  canvas=
	    plotkos(canvas,kos,histkos, width, height, histkosL); }
}

    
function radioClicked() {   
    // find out which radio button was clicked and
    // disable/enable appropriate input elements
    console.log("im here now!!")
    switch(this.value) {
    case "age" :
        change("age");
        break;
    case "bouts" :
        change("bouts");
        break;
    case "wins" :
        change("wins");
        break;
    case "kos" :
        change("kos");
        break;
    }
    
}




