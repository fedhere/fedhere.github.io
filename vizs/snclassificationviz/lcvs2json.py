import json
import pylab as pl
import numpy as np
#import pandas as pd

from scipy.io.idl import readsav


features={'snIa': {'Si':[[5872,6359],[3905,4102]],'S': [[5157,5586]]},
          'snIb': {'HeI':[[4240,4580],[5274,5838],[6387,6596],[6725,6983]]},
          'snIc': {'SiII':[[6161,6435]]},
          'snII': {'Ha':[[6300,6850]],'Hb':[[4658,4853]],'Hg':[[4153,4350]]},
          'snIcBL':{'SiII':[[5774,6335]]}
}

def blackbody_lam(lam, T):
    """ Blackbody as a function of wavelength (um) and temperature (K).

    returns units of erg/s/cm^2/cm/Steradian
    """
    from scipy.constants import h,k,c
    lam = 1e-6 * lam # convert to metres
    return 2*h*c**2 / (lam**5 * (np.exp(h*c / (lam*k*T)) - 1))

sntemplates={}
sn1a=np.genfromtxt("sn1a_flux.v1.2.dat")
snIa=sn1a[sn1a.T[0]==20][:,1:].T
#print snIa[1]
sntemplates['snIa']=[snIa[0].tolist(),(snIa[1]*1e8+blackbody_lam(snIa[0],0.7)*1e6).tolist(), [0.0]*len(snIa[0])]
#print sntemplates['snIa']
#snIa[0].tolist(),(snIa[1]+blackbody_lam(snIa[0],0.7)*1e7).tolist()]

sn2=np.genfromtxt("sn2p_flux.v1.2.dat")
snII=sn2[sn2.T[0]==11][:,1:].T
#print snIa[1]
sntemplates['snII']=[snII[0].tolist(),(snII[1]*1e8+blackbody_lam(snII[0],0.7)*1e6).tolist(), [0.0]*len(snII[0])]
#print sntemplates['snIa']
#snIa[0].tolist(),(snIa[1]+blackbody_lam(snIa[0],0.7)*1e7).tolist()]


#snIIb=np.genfromtxt("sn1996cb_CfA.lnw", usecols=(0,4),skiprows=11, unpack=True)
sn2b=readsav("meanspecIIb_1specperSN_0.sav")
#print sn2b.keys();
    #np.genfromtxt("sn1a_flux.v1.2.dat")
#snIa=sn1a[sn1a.T[0]==20][:,1:].T
sntemplates['snIIb']=[sn2b.wlog.tolist(),(sn2b.fmean+blackbody_lam(sn2b.wlog,0.7)*1e6).tolist(), sn2b.fsdev.tolist()]

#print sntemplates['snIIb']

#snIb=np.genfromtxt("sn2005hg_CfA.lnw", usecols=(0,13), skiprows=12, unpack=True)
#sntemplates['snIb']=[snIb[0].tolist(),(snIb[1]+blackbody_lam(snIb[0],0.7)*1e7).tolist()]
#print sntemplates['snIb']
sn1b=readsav("meanspecIb_1specperSN_0.sav")
    #np.genfromtxt("sn1a_flux.v1.2.dat")
#snIa=sn1a[sn1a.T[0]==20][:,1:].T
sntemplates['snIb']=[sn1b.wlog.tolist(),(sn1b.fmean+blackbody_lam(sn1b.wlog,0.7)*1e6).tolist(), sn1b.fsdev.tolist()]

#snIc=np.genfromtxt("sn1996cb_CfA.lnw", usecols=(0,13), skiprows=12, unpack=True)
#sntemplates['snIc']=[snIc[0].tolist(),(snIc[1]+blackbody_lam(snIc[0],0.7)*1e7).tolist()]
#print sntemplates['snIc']

sn1c=readsav("meanspecIc_1specperSN_0.sav")
    #np.genfromtxt("sn1a_flux.v1.2.dat")
#snIa=sn1a[sn1a.T[0]==20][:,1:].T
sntemplates['snIc']=[sn1c.wlog.tolist(),(sn1c.fmean+blackbody_lam(sn1c.wlog,0.7)*1e6).tolist(), sn1c.fsdev.tolist()]


sn1cBL=readsav("meanspecIcbroad_withgrb_1specperSN_0.sav")
    #np.genfromtxt("sn1a_flux.v1.2.dat")
#snIa=sn1a[sn1a.T[0]==20][:,1:].T
sntemplates['snIcBL']=[sn1cBL.wlog.tolist(),(sn1cBL.fmean+blackbody_lam(sn1cBL.wlog,0.7)*1e6).tolist(), sn1cBL.fsdev.tolist()]


for sn in sntemplates.iterkeys():
    thissn=sntemplates[sn]#print sn1a#[1.0]
    pl.plot(thissn[0],thissn[1], label=sn)
    pl.legend()
    pl.show()
for k in sntemplates.iterkeys():
    with open("spectemplates_%s.json"%k,"w") as f:
        j=(json.dumps([dict(t=sntemplates[k][0][i],f=sntemplates[k][1][i], e=sntemplates[k][2][i])  for i in np.where((np.array(sntemplates[k][0])>2000) & (np.array(sntemplates[k][0])<10000))[0]]))
#jsonarray = json.dumps(sntemplates)
        #f.write("var %s ="%k)
        print k
        f.write(j)
        #f.write(';')
        #f.write(" \n")
        #print "here"
    f.close()


for sn in features.iterkeys():
    for el in features[sn].iterkeys():
        for i,lims in enumerate(features[sn][el]):
            indx=(np.array(sntemplates[sn][0])>lims[0] )*( np.array(sntemplates[sn][0])<lims[1])
            thisfeature=[np.array(sntemplates[sn][0])[indx],np.array(sntemplates[sn][1])[indx]]
            #print thisfeature
            with open("specfeatures_%s_%s_%d.json"%(sn,el,i),"w") as f:
                j=(json.dumps([dict(t=thisfeature[0][j],f=thisfeature[1][j])  for j in range(len(thisfeature[0]))]))
#jsonarray = json.dumps(sntemplates)
        #f.write("var %s ="%k)
                f.write(j)
            print sn,el,i
            f.close()

#print sntemplates['snIc']
for sn in sntemplates.iterkeys():
    thissn=sntemplates[sn]#print sn1a#[1.0]
    pl.plot(thissn[0],thissn[1])
#pl.show()
