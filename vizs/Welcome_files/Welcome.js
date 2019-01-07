
// Created by iWeb 3.0.3 local-build-20111027

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({stroke_1:new IWStrokeParts([{rect:new IWRect(-2,2,4,106),url:'Welcome_files/stroke_8.png'},{rect:new IWRect(-2,-2,4,4),url:'Welcome_files/stroke_9.png'},{rect:new IWRect(2,-2,118,4),url:'Welcome_files/stroke_10.png'},{rect:new IWRect(120,-2,4,4),url:'Welcome_files/stroke_11.png'},{rect:new IWRect(120,2,4,106),url:'Welcome_files/stroke_12.png'},{rect:new IWRect(120,108,4,4),url:'Welcome_files/stroke_13.png'},{rect:new IWRect(2,108,118,4),url:'Welcome_files/stroke_14.png'},{rect:new IWRect(-2,108,4,4),url:'Welcome_files/stroke_15.png'}],new IWSize(122,110)),stroke_0:new IWStrokeParts([{rect:new IWRect(-2,2,4,102),url:'Welcome_files/stroke.png'},{rect:new IWRect(-2,-2,4,4),url:'Welcome_files/stroke_1.png'},{rect:new IWRect(2,-2,164,4),url:'Welcome_files/stroke_2.png'},{rect:new IWRect(166,-2,4,4),url:'Welcome_files/stroke_3.png'},{rect:new IWRect(166,2,4,102),url:'Welcome_files/stroke_4.png'},{rect:new IWRect(166,104,4,4),url:'Welcome_files/stroke_5.png'},{rect:new IWRect(2,104,164,4),url:'Welcome_files/stroke_6.png'},{rect:new IWRect(-2,104,4,4),url:'Welcome_files/stroke_7.png'}],new IWSize(168,106)),stroke_2:new IWStrokeParts([{rect:new IWRect(-2,2,4,217),url:'Welcome_files/stroke_16.png'},{rect:new IWRect(-2,-2,4,4),url:'Welcome_files/stroke_17.png'},{rect:new IWRect(2,-2,386,4),url:'Welcome_files/stroke_18.png'},{rect:new IWRect(388,-2,4,4),url:'Welcome_files/stroke_19.png'},{rect:new IWRect(388,2,4,217),url:'Welcome_files/stroke_20.png'},{rect:new IWRect(388,219,4,4),url:'Welcome_files/stroke_21.png'},{rect:new IWRect(2,219,386,4),url:'Welcome_files/stroke_22.png'},{rect:new IWRect(-2,219,4,4),url:'Welcome_files/stroke_23.png'}],new IWSize(390,221))});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('Welcome_files/WelcomeMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');Widget.onload();fixupAllIEPNGBGs();fixAllIEPNGs('Media/transparent.gif');fixupIECSS3Opacity('id4');applyEffects()}
function onPageUnload()
{Widget.onunload();}


/******menu******/
function loadmenu() {
    cont = document.getElementById("menu");
    cont.innerHTML = '<ul> \
		    <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/index.html\">home</a></li> \
		    <li><a href=\"#\">publications</a> \
		      <ul> \
		      <li><a href=\"http://adsabs.harvard.edu/cgi-bin/nph-abs_connect?library&libname=fbb&libid=5256d0a870\">ads, all</a></li> \
		         <li><a href=\"http://adsabs.harvard.edu/cgi-bin/nph-abs_connect?library&libname=fbb_refd&libid=5256d0a870\">ads, refereed</a></li> \
		         <li><a href=\"http://inspirehep.net/search?ln=en&ln=en&p=find+a+%22bianco,+f%22&action_search=Search&sf=&so=d&rm=&rg=25&sc=0&of=hb\">inSPIRE</a></li> \
			 </ul> \
            </li> \
		    <li><a href=\"#\">talks</a> \
		      <ul> \
		         <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/talks.html\"> selected talks</a></li> \
			    <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/upcomingtalks.html\">upcoming talks</a></li> \
			    <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/publictalks.html\">public talk movies</a></li> \
			</ul> \
			</li> \
\
		    <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/outreach.html\"> teaching+outreach</a> \
                         <ul> \
			   <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/outreach.html\">outreach</a></li> \
			   <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/PUI2018\">Principles of Urban Informatics</a></li>\
			   <li><a href=\"http://cosmo.nyu.edu/~fb55/obsast_fall2013/\">observational astro 2013</a></li> \
			    </ul> \
		    </li> \
\
		    <li><a href=\"http://cosmo.nyu.edu/~fb55/vizs\">vizs</a></li>\
            <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/cv-FBB/cv-FBB\">cv</a> \
                         <ul> \
			   <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/cv-FBB/cv-FBB\">html</a></li> \
			   <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/cv-FBB/cv-FBB.pdf\">pdf</a></li> \
			   <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/cv-FBB/fbbresume.pdf\">resume</a></li> \
			 </ul> \
		    </li> \
		    <li><a href=\"https://serv.cusp.nyu.edu/~fbianco/fbbspace/science/press.html\">press</a> \
		    </li> \
		    <li><a href=\"http://cuspuo.org\">CUSP-UO</a></li> \
		    <li><a href=\"https://www.lsst.org/scientists\">LSST</a> \
		    <li><a href=\"https://lsst-tvssc.github.io/\">LSST-TVS</a></li> \
		    </li> \
		  </ul>		   ';
}
