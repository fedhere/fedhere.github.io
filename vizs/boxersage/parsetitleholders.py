from HTMLParser import HTMLParser
import os,codecs,sys,time,optparse,datetime



UPDATE=False
INCH2CM=2.54
DAYS2YEARS=0.00273791
names=open("names",'w')
weightclass={'Super heavyweight':100,'Heavyweight':91,'Light heavyweight':81,'Middleweight':75,'Welterweight':69,'Light welterweight':64,'Lightweight':60,'Featherweight':57,'Bantamweight':56,'Light bantamweight':52,'Flyweight':52,'Light flyweight':49,'Pinweight':46}
def printf(fmt, *varargs):
    sys.stdout.write(fmt % varargs)

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
    global names
    def init(self):
        self.fullname=[]
#    def handle_starttag(self, tag, attrs):
#        print "Encountered a start tag:", tag
#    def handle_endtag(self, tag):
#        print "Encountered an end tag :", tag
    def handle_data(self, data):
        if data:
            print  >>names , data

def age(l):
    if "|" in l[1:]:
        i0=l.index('|1')
        year=int(l[i0+1:i0+5])
        i0+=6
        try:
            mo=int(l[i0:i0+2])
            i0=i0+3
        except:
            mo=int(l[i0:i0+1])
            i0=i0+2
        try:
            day=int(l[i0:i0+2])
        except:
            day=int(l[i0:i0+1])
        print year,mo,day
        dob=datetime.date(year,mo,day)

    else: 
        if '=' in l:
            try: 
                i0=l.index('=')
                print l[i0+1:].replace('  ','').strip(' ').strip(),"fuckyou"
                dob=datetime.datetime.strptime(l[i0+1:].replace('  ','').strip(' ').strip(), "%d %B %Y")
                dob=datetime.date(dob.year,dob.month,dob.day)
            except:
                return 0
    today=datetime.date.today()
    age=abs(today-dob)
    return int(age.days*DAYS2YEARS)

def reach(l):
    if 'convert' in l.lower():
        if '|in|cm|' in l:
            i0=l.lower().index('convert|')+len('convert|')
            i1=l.index('|in')
            print  l[i0:i1]
            reach = INCH2CM*float(l[i0:i1])
        if '|cm|in|' in l:                
            i0=l.index('convert|')+len('convert|')
            i1=l.index('|cm')
            print  l[i0:i1]
            reach = float(l[i0:i1])                              
            
    elif 'cm' in l:
        i0=l.index('cm')
        i1=i0
        i0=i0-1
        while i0>0 and l[i0-1].isdigit():
            i0-=1
        print l[i0:i1]
        reach = float(l[i0:i1])                              
    elif 'in' in l:
        i0=l.index('in')
        i1=i0
        i0=i0-1
        while i0>0 and l[i0-1].isdigit():
            i0-=1
        print l[i0:i1]
        reach = INCH2CM*float(l[i0:i1])                              
    else:
        reach= 0
    print "reach...",reach
    return reach


def stance(l):
    if 'orthodox'  in l.lower():
        return 0
    elif 'south' in l.lower():
        return 1
    else : return 0
    
def weight(l):
    for w in weightclass.iterkeys():
        if w in l:
            return weightclass[w]

def countfct(l):
    try:    
        i0=l.index('=')
        return float(l[i0+1:].replace(' ',''))
    except:
        return -99

def parsekeyline(l,k):
    print k,l
    if k == 'birth_date':
        return age(l)
    elif k == 'reach':
        return reach(l)
    elif k == 'weight':
        return weight(l)
    elif k == 'style':
        return stance(l)
    elif k == 'total':
        return countfct(l)
    elif k == 'wins':
        return countfct(l)
    elif k == 'losses':
        return countfct(l)
    elif k == 'KO':
        return countfct(l)


def getmykey(k,allines):
    for l in  allines:
        if "|"+k in l  or "| "+k in l:
#            print l
            datum=parsekeyline(l,k)
            return True,datum

    return False,0
def main():
    NODOUBLE=False

    parser = optparse.OptionParser(usage="python parsetitleholders.py  ", conflict_handler="resolve")
    parser.add_option('--age', default=False ,action="store_true" ,
                      help='title holder\'s age'),
    parser.add_option('--weight', default=False ,action="store_true" ,
                      help='weight class'),
    parser.add_option('--bouts', default=False ,action="store_true" ,
                      help='number of bouts')
    parser.add_option('--wins', default=False ,action="store_true" ,
                      help='number of wins'),
    parser.add_option('--kos', default=False ,action="store_true" ,
                      help='number of KOs'),
    parser.add_option('--winratio', default=False ,action="store_true" ,
                      help='win percentage'),
    parser.add_option('--stance', default=False ,action="store_true" ,
                      help='stance'),
    parser.add_option('--reach', default=False ,action="store_true" ,
                      help='title holder\'s reach'),
    parser.add_option('--nodouble', default=False ,action="store_true" ,
                      help='dont double count the fighters')



    options,  args = parser.parse_args()
    print options
    mykeyword = []
    mylabels = {}
    if options.age:
        mykeyword.append('birth_date')
        mylabels[mykeyword[-1]]='age'
    if options.reach:
        mykeyword.append( 'reach')
        mylabels[mykeyword[-1]]='reach'
    if options.weight:
        mykeyword.append( 'weight')
        mylabels[mykeyword[-1]]='weight'
    if options.bouts:
        mykeyword.append( 'total')
        mylabels[mykeyword[-1]]='bouts'
    if options.wins:
        mykeyword.append( 'wins')
        mylabels[mykeyword[-1]]='wins'
#    if options.stance:
    mykeyword.append( 'style')
    mylabels[mykeyword[-1]]='stance'
    if options.kos:
        mykeyword.append( 'KO')
        mylabels[mykeyword[-1]]='KOs'
    if options.winratio:
        if not 'wins' in mykeyword:
            mykeyword.append('wins')
            mylabels[mykeyword[-1]]='wins'
        mykeyword.append('losses')
        mylabels[mykeyword[-1]]='win percentage'
    if len(mykeyword)==0:
        print "choose an option: "
        sys.argv.append('--help')    
        options,  args = parser.parse_args()
        sys.exit(0)
    if options.nodouble:
        NODOUBLE=True


    global names

    # instantiate the parser and fed it some HTML
    parser = MyHTMLParser()
    f=open("titleholders")
    alltitleholders=[]
    for l in f.readlines():
        fullname=[]
        fullname=parser.feed(l)
        alltitleholders.append(fullname)

    names.close()
    allnames=[]
    import re
    f=open("names",'r')
    names=f.readlines()
    name=[]
    
    data={}
    for k in mykeyword:
        data[k]=[]

    for i,n in enumerate(names):
        name.append(n.strip())
        if i<len(names)-1 and names[i+1] == '\n':
            allnames.append(" ".join(name))
            name=[]
    allnames=filter(lambda a: a != '',allnames)
    allnames=[a[1:].replace(" ","_") for a in allnames]
    
    print allnames
    import urllib 


#    try:
#        from BeautifulSoup import BeautifulSoup  
#    except:
#        from bs4 import BeautifulSoup  
    done={}
    for n in allnames:
        if n == 'Tim_Bradley' : n = 'Timothy_Bradley'
        if n == 'Juan_Estrada': n = 'Juan_Francisco_Estrada'
        done[n]=False


    allfighters={}
    for i,n in enumerate(allnames):
        if n == 'Tim_Bradley' : n = 'Timothy_Bradley'
        if n == 'Juan_Estrada': n = 'Juan_Francisco_Estrada'
        if n == 'Chris_Van_Heerden' or n == 'Khabib_Allakhverdiev' or n == 'Simpiwe_Vetyeka' or n == 'Edrin_Dapudong' or n == 'Jonathan_Romero' or n == 'Thabo_Sonjica' or n == 'Ryo_Miyazaki' or n == "Hekkie_Budler":
            continue
        if done[n] and NODOUBLE:
            continue
        else:
            done[n]=True
        allfighters[n]={}
        print "fetching ",n
        if not os.path.isfile("local/"+n ) or UPDATE:
            urllib.urlretrieve("http://en.wikipedia.org/w/index.php?action=raw&title="+n+"_(boxer)", filename="local/"+n)
        else: 
            print "file is there already"
        f=codecs.open("local/"+n, encoding='utf-8')
        allines=f.readlines()
        if len(allines)==0 :
            doc = urllib.urlretrieve("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles="+n+"_(boxer)", filename="local/"+n)
            f=codecs.open("local/"+n, encoding='utf-8')
            allines=f.readlines()
            if len(allines)==0 :
                continue
        if 'REDIRECT' in allines[0]:
            print "fetching redirected file"
            doc = urllib.urlretrieve("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles="+n+"_(boxer)&redirects", filename="local/"+n)
            f=codecs.open("local/"+n, encoding='utf-8')
            allines=f.readlines()
        foundd = False
        foundall=[]
        for i,k in enumerate(mykeyword):
            foundd,datum=getmykey(k, allines)
            
            if not foundd: datum=-99
            data[k].append(datum)
            allfighters[n][k]=datum
            foundall.append(foundd)
            print k, data[k],foundd
    
        if not True in foundall:
            print "data not there, trying without 'boxer' in the title"
            doc = urllib.urlretrieve("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles="+n+"&redirects", filename="local/"+n)
            f=codecs.open("local/"+n, encoding='utf-8')
            allines=f.readlines()
            if 'REDIRECT' in allines[0]:
                doc = urllib.urlretrieve("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles="+n+"&redirects", filename="local/"+n)
                f=codecs.open("local/"+n, encoding='utf-8')
                allines=f.readlines()
            foundd = False
            for i,k in enumerate(mykeyword):
                foundd,datum=getmykey(k, allines)
                if not foundd: datum=-99
                data[k][-1]=datum
                allfighters[n][k]=datum
            
    if 'losses' in mykeyword:
        for i,n in enumerate(allnames):
            if n == 'Tim_Bradley' : n = 'Timothy_Bradley'
            if n == 'Juan_Estrada': n = 'Juan_Francisco_Estrada'
            if n == 'Chris_Van_Heerden' or n == 'Khabib_Allakhverdiev' or n == 'Simpiwe_Vetyeka' or n == 'Edrin_Dapudong' or n == 'Jonathan_Romero' or n == 'Thabo_Sonjica' or n == 'Ryo_Miyazaki' or n == "Hekkie_Budler":
                continue

            allfighters[n]['ratio']=allfighters[n]['wins']/(allfighters[n]['wins']+allfighters[n]['losses'])    
        mylabels['ratio']=mylabels['losses']

    if NODOUBLE:
        f=open('titleholdersnodouble.csv','w')
    else:
        f=open('titleholders.csv','w')

    for k in mykeyword:
        f.write("%s,"%mylabels[k])
    f.write("\n")
    for i in range(len(data[mykeyword[0]])):
        for k in mykeyword:
#            if k == 'style':
#                continue
            try:
                f.write("%.1f,"%data[k][i])
            except:
                f.write("%s,"%data[k][i])
        f.write("\n")
#    if 'style' in mykeyword:


    for i,k in enumerate(mykeyword):
        import pylab as plt
        import matplotlib.mlab as mlab
        import numpy as np
        if k in ['birth_date','reach','total','wins','KO','ratio']:
            if 'reach' in k:
                datanew=[allfighters[f][k] for f in allfighters if allfighters[f][k] > 100]
                datanewL=[allfighters[f][k] for f in allfighters if allfighters[f]['style']>0 and allfighters[f][k] >100]   
            else:
                datanew=[allfighters[f][k] for f in allfighters if not allfighters[f][k] == -99 and not allfighters[f][k] == None]
                datanewL=[allfighters[f][k] for f in allfighters if allfighters[f]['style']>0 and not allfighters[f][k] == -99 and not allfighters[f][k] == None]
            n, bins, patches = plt.hist(datanew, 20, 
                                        normed=1, 
                                        facecolor='blue', 
                                        alpha=0.5)
            y = mlab.normpdf( bins, np.mean(datanew), 
                              np.std(data[k]))
            plt.plot(bins, y, 'k--', linewidth=1)
            plt.xlabel(mylabels[k])
            plt.grid(True)
            if NODOUBLE:
                plt.savefig(mylabels[k].replace(' ','')+"_nd.png")
            else:
                plt.savefig(mylabels[k].replace(' ','')+".png")
            plt.plot(bins, y*max(n)/max(y), 'k--', linewidth=1)
#            plt.show()
            hist, bins = np.histogram(datanew, bins=bins, normed=True)
            hist1, bins1 = np.histogram(datanew, bins=bins)
            histL, binsL = np.histogram(datanewL , bins=bins)
            if NODOUBLE:
                fnew=open(mylabels[k].replace(' ','')+"_nd.csv","w")
            else:
                fnew=open(mylabels[k].replace(' ','')+".csv","w")
            print >> fnew,mylabels[k]+",fighterspc,fighters,lfighters,gauss"
            for ii,h in enumerate(hist):
                print >>fnew,"%f,%f,%f,%f,%f"%(bins[ii],h,hist1[ii],histL[ii], y[ii]*max(n)/max(y))
            fnew.close()
            
            widths = np.diff(bins1)

            plt.bar(bins[:-1],hist1,widths,
                    facecolor='blue', alpha=0.5)
            plt.bar(binsL[:-1],histL,widths,
                    facecolor='red', alpha=0.5)
            
            plt.xlabel(mylabels[k])
            plt.grid(True)
            if NODOUBLE:
                plt.savefig(mylabels[k].replace(' ','')+".pc_nd.png")
            else:
                plt.savefig(mylabels[k].replace(' ','')+".pc.png")
            plt.clf()
#            plt.ion()
#            plt.show()

            
    time.sleep(3)
            
if __name__ == "__main__":
    main()
