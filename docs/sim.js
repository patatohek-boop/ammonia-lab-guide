/* 教学双节点模型。参数为合成例题，不是超临界氨物性。 */
(function(root){
 'use strict';
 function simulate({amplitude=40,timing=0,tau=.5,Cw=30}={}){
  if(![amplitude,timing,tau,Cw].every(Number.isFinite)||tau<=0||Cw<=0||amplitude<0)throw new Error('Invalid teaching parameters');
  const dt=.01,Cf=10,H=5,F0=2,Tin=300,delay=.25;
  function run(amp){let Tw=314,Tf=310,flow=1,rows=[],maxEnergyError=0;
   for(let n=0;n<=1400;n++){
    const t=n*dt,cmd=(t>=2+timing&&t<5+timing)?1+amp/100:1;
    const delayed=(t-delay>=2+timing&&t-delay<5+timing)?1+amp/100:1;
    const P=(t>=2&&t<5)?40:20;
    if(n>0){flow=(flow+dt*delayed/tau)/(1+dt/tau);const F=F0*flow;
     const a=Cw/dt+H,b=-H,c=-H,d=Cf/dt+H+F,rb=Cw/dt*Tw+P,rf=Cf/dt*Tf+F*Tin,det=a*d-b*c;
     const nextW=(rb*d-b*rf)/det,nextF=(a*rf-c*rb)/det;
     maxEnergyError=Math.max(maxEnergyError,Math.abs((Cw*(nextW-Tw)+Cf*(nextF-Tf))/dt-(P-F*(nextF-Tin))));Tw=nextW;Tf=nextF;
    }
    rows.push({t,Tw,Tf,flow,cmd,P});
   }return {rows,maxEnergyError};
  }
  const base=run(0),controlled=run(amplitude),peakBase=Math.max(...base.rows.map(r=>r.Tw)),peakFlow=Math.max(...controlled.rows.map(r=>r.Tw));
  return {base,controlled,peakBase,peakFlow,reduction:peakBase-peakFlow,parameters:{amplitude,timing,tau,Cw},dt};
 }
 root.AmmoniaTeaching={simulate};
 if(typeof module!=='undefined'&&module.exports)module.exports={simulate};
})(typeof window!=='undefined'?window:globalThis);
