/* STPI 1A Open - DS1 Mécanique du point : cours, conseils, générateur de sujets blancs (PDF via impression) */
(function(){
'use strict';
const r=String.raw,G=9.81;
const nf=(x,d=3)=>isFinite(x)?String(parseFloat(x.toPrecision(d))).replace('.',','):'?';
const tx=(x,d=3)=>nf(x,d).replace(',','{,}');
const rad=d=>d*Math.PI/180,sn=d=>Math.sin(rad(d)),cs=d=>Math.cos(rad(d)),tn=d=>Math.tan(rad(d));
const deg=x=>x*180/Math.PI;
const BOX=s=>`<span class="res">${s}</span>`;
const RQ=s=>`<p class="rq">${s}</p>`;
/* Un encadré contient déjà ses $...$ : on referme la formule extérieure avant lui pour ne jamais imbriquer deux $ */
const unnest=s=>{
  let out='',inm=false,i=0,closed=false;
  while(i<s.length){
    if(s.startsWith('<span class="res">',i)){
      const j=s.indexOf('</span>',i)+7;
      if(inm){if(out.endsWith('$'))out=out.slice(0,-1);else out+='$ ';inm=false;closed=true}
      out+=s.slice(i,j);i=j;
      if(closed&&s[i]==='$')i++;
      closed=false;continue;
    }
    if(s[i]==='$')inm=!inm;
    out+=s[i++];
  }
  return out;
};
const Q=(w,q,sol,bar,lab)=>({w,q,sol:sol.map(unnest),bar,lab});

/* ---------- RNG à graine : un numéro de sujet = un sujet reproductible ---------- */
function rng(seed){
  let a=(seed>>>0)||1;
  const f=()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
  return{r:f,
    pick:a=>a[Math.floor(f()*a.length)],
    int:(lo,hi)=>lo+Math.floor(f()*(hi-lo+1)),
    shuffle:a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(f()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}};
}

/* ---------- Figures SVG (noir sur blanc, imprimables) ---------- */
const DEF=`<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#111" stroke="none"/></marker></defs>`;
const SV=(w,h,b)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Georgia,'Times New Roman','DejaVu Serif',serif" font-size="13" fill="none" stroke="#111" stroke-width="1.4">${DEF}${b}</svg>`;
const T=(x,y,s,a='start')=>`<text x="${x}" y="${y}" text-anchor="${a}" stroke="none" fill="#111" font-style="italic">${s}</text>`;
const AR=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ah)"/>`;
const DL=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-dasharray="4 3" stroke-width="1"/>`;
const F2=x=>Math.round(x*10)/10;

function figCar(){
  return SV(330,130,
    `<line x1="15" y1="100" x2="315" y2="100"/><rect x="80" y="68" width="62" height="24" fill="#e6e6e6"/><rect x="95" y="54" width="34" height="14" fill="#e6e6e6"/>`+
    `<circle cx="96" cy="95" r="7" fill="#fff"/><circle cx="126" cy="95" r="7" fill="#fff"/>`+
    AR(150,76,210,76)+T(214,80,'v₀')+DL(40,100,40,115)+T(40,127,'O','middle')+T(300,118,'route horizontale','end'));
}
function figIncline(o){
  const a=rad(o.alpha),x0=36,y0=150,Wd=Math.min(250,115/Math.tan(a)),ri=Wd*Math.tan(a),x1=x0+Wd,y1=y0-ri;
  let s=`<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
  s+=`<path d="M${F2(x0+34)} ${y0}A34 34 0 0 0 ${F2(x0+34*Math.cos(a))} ${F2(y0-34*Math.sin(a))}"/>`+T(x0+42,y0-6,'α');
  if(o.dims){s+=DL(x1,y0,x1,y1)+T(x1+6,F2((y0+y1)/2),'h')+T(F2((x0+x1)/2),y0+16,'d','middle')+T(x0-4,y0+15,'M₀','end')+T(x1+4,y1-6,'M₁')+`<circle cx="${x0}" cy="${y0}" r="3" fill="#111"/><circle cx="${x1}" cy="${y1}" r="3" fill="#111"/>`;}
  if(o.block){
    const f=o.f||.55,px=x0+f*Wd,py=y0-f*ri,cx=F2(px-8.5*Math.sin(a)),cy=F2(py-8.5*Math.cos(a));
    s+=`<g transform="translate(${F2(px)} ${F2(py)}) rotate(${-o.alpha})"><rect x="-15" y="-17" width="30" height="17" fill="#e4e4e4"/></g><circle cx="${cx}" cy="${cy}" r="2.5" fill="#111"/>`+T(cx-16,cy-12,'M','end');
    if(o.beta){const b=a+rad(o.beta);
      s+=AR(cx,cy,F2(cx+78*Math.cos(b)),F2(cy-78*Math.sin(b)))+T(F2(cx+84*Math.cos(b)),F2(cy-78*Math.sin(b)),'T')+
        `<path d="M${F2(cx+44*Math.cos(a))} ${F2(cy-44*Math.sin(a))}A44 44 0 0 0 ${F2(cx+44*Math.cos(b))} ${F2(cy-44*Math.sin(b))}" stroke-width="1"/>`+T(F2(cx+52*Math.cos((a+b)/2)),F2(cy-52*Math.sin((a+b)/2)),'β');}
  }
  return SV(330,175,s);
}
function figCaisse(beta){
  const b=rad(beta);
  return SV(330,140,`<line x1="15" y1="110" x2="315" y2="110"/><rect x="80" y="76" width="56" height="34" fill="#e4e4e4"/><circle cx="108" cy="93" r="2.5" fill="#111"/>`+T(100,88,'M','end')+
    AR(108,93,F2(108+90*Math.cos(b)),F2(93-90*Math.sin(b)))+T(F2(108+96*Math.cos(b)),F2(93-90*Math.sin(b)),'T')+
    `<path d="M168 93A60 60 0 0 0 ${F2(108+60*Math.cos(b))} ${F2(93-60*Math.sin(b))}" stroke-width="1"/>`+T(176,F2(93-12),'β')+
    DL(108,93,175,93)+AR(190,128,250,128)+T(256,132,'mouvement')+T(24,130,'sol rugueux (μ)'));
}
function figBall(o){
  if(o.mode==='cliff') return SV(330,185,
    `<line x1="10" y1="165" x2="320" y2="165"/><polygon points="10,70 85,70 85,165 10,165" fill="#e8e8e8"/><path d="M85 70Q155 -25 285 165" stroke-dasharray="5 3"/>`+
    `<circle cx="85" cy="70" r="3" fill="#111"/>`+T(78,62,'A','end')+AR(85,70,F2(85+48*Math.cos(rad(o.alpha))),F2(70-48*Math.sin(rad(o.alpha))))+T(F2(85+52*Math.cos(rad(o.alpha))),F2(70-48*Math.sin(rad(o.alpha))-3),'v₀')+
    DL(85,70,150,70)+`<path d="M121 70A36 36 0 0 0 ${F2(85+36*Math.cos(rad(o.alpha)))} ${F2(70-36*Math.sin(rad(o.alpha)))}" stroke-width="1"/>`+T(126,62,'α')+
    DL(55,70,55,165).replace('stroke-dasharray','stroke-dasharray')+T(48,122,'h','end')+T(285,182,'sol','middle'));
  return SV(330,185,
    `<line x1="10" y1="170" x2="320" y2="170"/>`+DL(40,110,40,170)+T(32,145,'h₁','end')+DL(255,56,255,170)+T(262,118,'H')+
    `<path d="M40 110Q125 -15 255 56" stroke-dasharray="5 3"/>`+`<circle cx="40" cy="110" r="3" fill="#111"/>`+T(30,104,'O','end')+
    `<line x1="248" y1="56" x2="272" y2="56" stroke-width="3"/>`+T(268,48,'B')+AR(40,110,F2(40+50*Math.cos(rad(o.alpha))),F2(110-50*Math.sin(rad(o.alpha))))+T(F2(40+54*Math.cos(rad(o.alpha))),F2(110-50*Math.sin(rad(o.alpha))-2),'v₀')+
    DL(40,110,100,110)+`<path d="M76 110A36 36 0 0 0 ${F2(40+36*Math.cos(rad(o.alpha)))} ${F2(110-36*Math.sin(rad(o.alpha)))}" stroke-width="1"/>`+T(82,102,'α')+
    `<line x1="40" y1="180" x2="255" y2="180" marker-start="url(#ah)" marker-end="url(#ah)" stroke-width="1"/>`+T(148,178,'L','middle').replace('y="178"','y="177"'));
}
function figHill(){
  return SV(330,170,
    `<line x1="15" y1="140" x2="315" y2="140" stroke-dasharray="4 3" stroke-width="1"/><polyline points="20,140 130,50 300,140"/>`+DL(130,50,130,140)+T(136,98,'h')+
    `<path d="M60 140A40 40 0 0 0 52 114" stroke-width="1"/>`+T(64,132,'α')+`<path d="M260 140A40 40 0 0 1 268 123" stroke-width="1"/>`+T(246,133,'β','end')+
    `<circle cx="20" cy="140" r="3" fill="#111"/><circle cx="130" cy="50" r="3" fill="#111"/><circle cx="300" cy="140" r="3" fill="#111"/>`+T(14,157,'A','end')+T(130,42,'S','middle')+T(306,157,'B')+
    `<g transform="translate(62 94) rotate(-39)"><rect x="-13" y="-14" width="26" height="14" fill="#e4e4e4"/></g>`+AR(78,92,106,69)+T(110,70,'v₀')+T(44,100,'M','end')+T(165,163,'figure non à l’échelle'));
}
function figPend(th){
  const L=110,ox=170,oy=22,a=rad(th),bx=F2(ox-L*Math.sin(a)),by=F2(oy+L*Math.cos(a));
  return SV(330,155,`<line x1="100" y1="${oy}" x2="240" y2="${oy}" stroke-width="3"/><circle cx="${ox}" cy="${oy}" r="3" fill="#111"/>`+T(ox+8,oy-6,'O')+DL(ox,oy,ox,oy+L+10)+`<line x1="${ox}" y1="${oy}" x2="${bx}" y2="${by}"/><circle cx="${bx}" cy="${by}" r="7" fill="#d8d8d8"/>`+T(F2(bx-12),F2(by+4),'M','end')+
    `<path d="M${ox} ${oy+40}A40 40 0 0 1 ${F2(ox-40*Math.sin(a))} ${F2(oy+40*Math.cos(a))}" stroke-width="1"/>`+T(ox-4,oy+56,'θ','end')+T(F2((ox+bx)/2-12),F2((oy+by)/2-2),'L','end')+
    AR(ox+60,oy+70,ox+60,oy+22)+T(ox+66,oy+30,'z')+AR(ox+60,oy+70,ox+105,oy+70)+T(ox+108,oy+74,'x'));
}
function figTrack(){
  return SV(340,150,
    `<path d="M30 15A92 92 0 0 0 122 107L250 107"/><path d="M122 114L250 114" stroke-dasharray="2 3" stroke-width="1"/>`+`<polyline points="250,107 256,97 266,117 276,97 286,117 296,97 302,107"/><line x1="302" y1="85" x2="302" y2="125" stroke-width="3"/>`+
    T(22,16,'A','end')+T(116,128,'B','end')+T(250,128,'C','middle')+T(310,112,'D')+T(52,68,'r')+DL(30,15,122,15)+DL(122,15,122,107)+T(186,132,'L','middle')+`<line x1="122" y1="136" x2="250" y2="136" marker-start="url(#ah)" marker-end="url(#ah)" stroke-width="1"/>`.replace('y1="136"','y1="140"').replace('y2="136"','y2="140"'));
}

/* ---------- Banque d'exercices : chaque modèle renvoie énoncé, questions pondérées et correction rédigée ---------- */
const AX=['x','y','z'];
const ev=(i,s=1)=>(s<0?'-':'')+r`\vec{e}_${AX[i]}`;
const cyc=(i,j)=>((j-i+3)%3===1)?1:-1;

function exBond(g){
  const p=g.shuffle([0,1,2]),sg=[0,1,2].map(()=>g.r()<.4?-1:1),c=cyc(p[0],p[1]),pr=sg[0]*sg[1]*c,dir=pr===sg[2];
  const i=g.int(0,2),j=(i+1+g.int(0,1))%3,k=3-i-j,s1=g.r()<.5?-1:1,s2=g.r()<.5?-1:1,w=s1*s2*cyc(i,j);
  const a=g.int(0,2),b=(a+1+g.int(0,1))%3;
  const xa=g.int(0,3),ya=g.int(0,3),xb=xa+g.pick([2,3,4,5]),yb=ya+g.pick([-2,-1,1,2,3]);
  const th=g.pick([30,60,45,40]),F=g.pick([10,20,50,100]),dx=xb-xa,dy=yb-ya,Wk=F*(dx*cs(th)+dy*sn(th));
  const tri=g.pick([[3,4,12,13],[2,3,6,7],[1,2,2,3],[4,4,7,9],[2,6,9,11],[6,6,7,11]]);
  return{id:'bond',fam:'BOND',len:'court',title:'Calcul vectoriel et bases orthonormées directes',fig:'',
    intro:r`Dans tout l'exercice, $\mathcal B(\vec e_x,\vec e_y,\vec e_z)$ désigne une base orthonormée directe.`,
    qs:[
      Q(1,r`La base $\big(${ev(p[0],sg[0])},\ ${ev(p[1],sg[1])},\ ${ev(p[2],sg[2])}\big)$ est-elle directe ? Justifier.`,
        [r`Une base $(\vec u_1,\vec u_2,\vec u_3)$ est directe si $\vec u_1\wedge\vec u_2=\vec u_3$ (règle du tire-bouchon). On utilise la permutation circulaire $\vec e_x\wedge\vec e_y=\vec e_z$, $\vec e_y\wedge\vec e_z=\vec e_x$, $\vec e_z\wedge\vec e_x=\vec e_y$ (le signe change dans l'autre sens).`,
         r`Ici $${ev(p[0],sg[0])}\wedge${ev(p[1],sg[1])}=${ev(p[2],pr)}$, à comparer au troisième vecteur $${ev(p[2],sg[2])}$ : la base est ${BOX(dir?'directe':'indirecte')}.`],
        'justification par le produit vectoriel (pas seulement « oui/non »)'),
      Q(1,r`Quel vecteur $\vec w$ faut-il choisir pour que $\big(${ev(i,s1)},\ ${ev(j,s2)},\ \vec w\big)$ soit une base orthonormée directe ?`,
        [r`Pour une base directe, $\vec w=\vec u_1\wedge\vec u_2=${ev(i,s1)}\wedge${ev(j,s2)}=${BOX(r`$\vec w=${ev(k,w)}$`)}$.`],
        'calcul du produit vectoriel, signe correct'),
      Q(.5,r`Que valent $${ev(a)}\cdot${ev(b)}$ et $${ev(k)}\cdot${ev(k)}$ ?`,
        [r`Les vecteurs d'une base orthonormée sont orthogonaux entre eux et unitaires : $${ev(a)}\cdot${ev(b)}=${BOX('$0$')}$ et $${ev(k)}\cdot${ev(k)}=\|${ev(k)}\|^2=${BOX('$1$')}$.`],
        'orthogonal = 0, unitaire = 1'),
      Q(2,r`Un point se déplace de $A(${xa}\,;\,${ya}\,;\,0)$ à $B(${xb}\,;\,${yb}\,;\,0)$ (coordonnées en mètres) sous l'action d'une force constante $\vec F$ de norme $F=${F}\ \mathrm{N}$, contenue dans le plan $(\vec e_x,\vec e_y)$ et faisant un angle $\theta=${th}^\circ$ avec $\vec e_x$. Écrire les coordonnées de $\overrightarrow{AB}$ et de $\vec F$, puis calculer le travail $W_{A\to B}(\vec F)$.`,
        [r`$\overrightarrow{AB}\begin{vmatrix}x_B-x_A\\y_B-y_A\\z_B-z_A\end{vmatrix}=\begin{vmatrix}${dx}\\${dy}\\0\end{vmatrix}$ (en m) et $\vec F\begin{vmatrix}F\cos\theta\\F\sin\theta\\0\end{vmatrix}=\begin{vmatrix}${tx(F*cs(th))}\\${tx(F*sn(th))}\\0\end{vmatrix}$ (en N).`,
         r`Le travail est le produit scalaire des coordonnées : $W_{A\to B}(\vec F)=\vec F\cdot\overrightarrow{AB}=F\cos\theta\times(${dx})+F\sin\theta\times(${dy})=${BOX(r`$${tx(Wk)}\ \mathrm{J}$`)}$.`,
         RQ(`Le travail est un scalaire (un nombre réel) : il peut être négatif (force résistante).`)],
        'coordonnées de AB, coordonnées de F, produit scalaire calculé, unité (J)'),
      Q(.5,r`Calculer la norme du vecteur vitesse $\vec v\begin{vmatrix}${tri[0]}\\${tri[1]}\\${tri[2]}\end{vmatrix}$ (en m/s).`,
        [r`$\|\vec v\|=\sqrt{${tri[0]}^2+${tri[1]}^2+${tri[2]}^2}=\sqrt{${tri[0]**2+tri[1]**2+tri[2]**2}}=${BOX(r`$${tri[3]}\ \mathrm{m/s}$`)}$ (une norme est toujours positive).`],
        'racine de la somme des carrés')
    ],
    rem:[`Un vecteur s'écrit toujours avec une flèche ; quand on écrit ses coordonnées en colonne, les vecteurs de la base n'apparaissent pas.`]};
}

/* ================= FAMILLE TRC ================= */
function exFreinTRC(g){
  const m=g.pick([700,850,1000,1200]),F=g.pick([2000,2500,3000,3500]),vk=g.pick([30,50,70,90]),v0=vk/3.6,tau=m*v0/F,L=m*v0*v0/(2*F);
  return{id:'freinTRC',fam:'TRC',len:'moyen',title:"Freinage d'une voiture le long d'une route rectiligne",fig:figCar(),
    intro:r`Une voiture de masse $m=${m}\ \mathrm{kg}$ roule à la vitesse constante $v_0=${vk}\ \mathrm{km/h}$ sur une route droite horizontale. Un obstacle se présente et le conducteur freine. On modélise le freinage par une force constante de valeur $F=${F}\ \mathrm{N}$ exercée par le sol sur la voiture ; les autres frottements (air...) sont négligés. On prend $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(1.5,r`Faire un bilan des forces sur la voiture et préciser leurs coordonnées dans une base de votre choix (à représenter sur un schéma).`,
        [r`On choisit le repère $(O,\vec e_x,\vec e_y,\vec e_z)$ : $O$ est la position de la voiture à $t=0$, $\vec e_x$ est dirigé dans le sens du mouvement, $\vec e_y$ est vertical ascendant (base orthonormée directe).`,
         r`Bilan des forces : le poids $\vec P=-mg\,\vec e_y$ ; la réaction normale $\vec R_N=R_N\,\vec e_y$ (la norme $R_N$ est inconnue) ; la force de freinage $\vec F=-F\,\vec e_x$. En colonnes : $\vec P\begin{vmatrix}0\\-mg\\0\end{vmatrix}$, $\vec R_N\begin{vmatrix}0\\R_N\\0\end{vmatrix}$, $\vec F\begin{vmatrix}-F\\0\\0\end{vmatrix}$.`,
         RQ(`Remarque : la norme $F$ est donnée. C'est une force de frottement, mais il ne faut pas l'exprimer avec la loi de Coulomb : la voiture ne glisse pas, les roues roulent sur la route.`)],
        'base directe choisie et dessinée, 3 forces, coordonnées correctes, schéma'),
      Q(2.5,r`En appliquant le théorème de la résultante cinétique, déterminer $v(t)$ puis $x(t)$ (le freinage commence à $t=0$ et $x$ est la distance parcourue depuis ce début).`,
        [r`La voiture reste en contact avec le sol et sur la route : pas de mouvement selon $\vec e_y$ ni $\vec e_z$. Donc $\overrightarrow{OM}=x\,\vec e_x$, $\vec v=\dot x\,\vec e_x$, $\vec a=\ddot x\,\vec e_x$.`,
         r`TRC (référentiel terrestre supposé galiléen) : $m\vec a=\vec P+\vec R_N+\vec F$. Projection selon $\vec e_x$ : $m\ddot x=-F$, soit $\ddot x=-\dfrac{F}{m}$. Projection selon $\vec e_y$ : $0=R_N-mg$, donc $R_N=mg$ (pas utilisé ensuite).`,
         r`On intègre avec les conditions initiales $\dot x(0)=v_0$ et $x(0)=0$ : ${BOX(r`$v(t)=\dot x(t)=-\dfrac{F}{m}\,t+v_0$`)} et ${BOX(r`$x(t)=-\dfrac12\dfrac{F}{m}\,t^2+v_0\,t$`)}.`],
        'TRC écrit puis projeté, accélération, intégration avec conditions initiales, deux résultats'),
      Q(2,r`Déterminer la durée de freinage $\tau$ et la distance de freinage $L$ en fonction de $m$, $F$ et $v_0$. Comment varient-elles avec la vitesse initiale ?`,
        [r`La voiture est arrêtée quand $\dot x(\tau)=0$ : $-\dfrac{F}{m}\tau+v_0=0$, d'où ${BOX(r`$\tau=\dfrac{mv_0}{F}$`)}.`,
         r`$L=x(\tau)=-\dfrac12\dfrac{F}{m}\left(\dfrac{mv_0}{F}\right)^2+v_0\,\dfrac{mv_0}{F}$, d'où ${BOX(r`$L=\dfrac12\,\dfrac{m\,v_0^2}{F}$`)}.`,
         r`$\tau$ est proportionnelle à $v_0$ ; $L$ est proportionnelle à $v_0^2$ : si la vitesse double, la durée double mais la distance de freinage est multipliée par 4.`],
        'condition v(τ)=0, L=x(τ), commentaire sur les proportionnalités'),
      Q(1,r`Application numérique : calculer $\tau$ et $L$. Quelle serait la distance de freinage à la vitesse $2v_0$ ?`,
        [r`On convertit : $v_0=${vk}\ \mathrm{km/h}=${tx(v0)}\ \mathrm{m/s}$ (division par 3,6).`,
         r`$\tau=\dfrac{${m}\times${tx(v0)}}{${F}}=${BOX(r`$${tx(tau)}\ \mathrm{s}$`)}$ et $L=\dfrac12\dfrac{${m}\times${tx(v0)}^2}{${F}}=${BOX(r`$${tx(L)}\ \mathrm{m}$`)}$. À $2v_0$ : $L'=4L=${tx(4*L)}\ \mathrm{m}$.`],
        'conversion km/h → m/s, valeurs et unités')
    ],
    rem:[`Piège classique : oublier de convertir les km/h en m/s avant l'application numérique.`]};
}

function exProj(g){
  if(g.r()<.55){
    const al=g.pick([45,50,55,60]),h1=g.pick([1.8,2,2.2]),L=g.pick([4,4.5,5]),H=3.05,m=g.pick([480,570,624]);
    const v0=Math.sqrt(G*L*L/(2*cs(al)**2*(h1+L*tn(al)-H))),t=L/(v0*cs(al));
    return{id:'basket',fam:'TRC',len:'moyen',title:"Lancer parabolique d'un ballon de basket",fig:figBall({alpha:al}),
      intro:r`Lors d'un lancer franc, un joueur lance le ballon, assimilé à un point matériel $M$ de masse $m=${m}\ \mathrm{g}$, depuis une hauteur $h_1=${tx(h1)}\ \mathrm{m}$ au-dessus du sol, avec une vitesse $\vec v_0$ faisant un angle $\alpha=${al}^\circ$ avec l'horizontale. Le panier (point $B$) est à une distance horizontale $L=${tx(L)}\ \mathrm{m}$ du joueur et à une hauteur $H=3{,}05\ \mathrm{m}$. On néglige les frottements de l'air et la rotation du ballon. $g=9{,}81\ \mathrm{m/s^2}$.`,
      qs:[
        Q(3,r`Faire un bilan des forces sur le ballon, puis déterminer les équations horaires de son mouvement (on prendra pour origine la position initiale du ballon).`,
          [r`Base : $\vec e_x$ horizontal vers le panier, $\vec e_z$ vertical ascendant, $\vec e_y$ complétant la base directe. Origine $O$ : position du ballon à $t=0$. Le ballon n'est soumis qu'à son poids $\vec P\begin{vmatrix}0\\0\\-mg\end{vmatrix}$.`,
           r`TRC : $m\vec a=\vec P$, soit les trois équations scalaires $\ddot x=0$, $\ddot y=0$, $\ddot z=-g$.`,
           r`Conditions initiales : $\vec v_0\begin{vmatrix}v_0\cos\alpha\\0\\v_0\sin\alpha\end{vmatrix}$ et $\overrightarrow{OM}(0)=\vec 0$. Première intégration : $\dot x=v_0\cos\alpha$ ; $\dot y=0$ ; $\dot z=-gt+v_0\sin\alpha$.`,
           r`Seconde intégration : ${BOX(r`$x(t)=v_0\cos\alpha\;t$`)} ; ${BOX('$y(t)=0$')} ; ${BOX(r`$z(t)=-\dfrac12gt^2+v_0\sin\alpha\;t$`)}.`,
           RQ(`Remarque : avec une autre origine (par exemple le sol), $z(t)$ contient aussi $h_1$ ; le résultat dépend du choix de l'origine.`)],
          'bilan des forces, TRC projeté, conditions initiales, deux intégrations, trois équations horaires'),
        Q(1,r`En déduire l'équation de la trajectoire $z=f(x)$.`,
          [r`On inverse la première équation horaire : $t=\dfrac{x}{v_0\cos\alpha}$, puis on reporte dans $z(t)$ : ${BOX(r`$z(x)=\tan\alpha\;x-\dfrac{g}{2v_0^2\cos^2\alpha}\,x^2$`)}. C'est une parabole.`],
          'élimination de t'),
        Q(3,r`Déterminer la valeur de $v_0$ nécessaire pour que le ballon atteigne le centre du panier. Faire l'application numérique.`,
          [r`Le point $B$ a pour coordonnées $\overrightarrow{OB}\begin{vmatrix}L\\0\\H-h_1\end{vmatrix}$. On impose $z(L)=H-h_1$ : $H-h_1=L\tan\alpha-\dfrac{gL^2}{2v_0^2\cos^2\alpha}$.`,
           r`Donc $\dfrac{gL^2}{2v_0^2\cos^2\alpha}=L\tan\alpha+h_1-H$ et ${BOX(r`$v_0=\sqrt{\dfrac{gL^2}{2\cos^2\alpha\,(L\tan\alpha+h_1-H)}}$`)}.`,
           r`A.N. : $v_0=${BOX(r`$${tx(v0)}\ \mathrm{m/s}$`)}$, soit environ $${tx(v0*3.6,3)}\ \mathrm{km/h}$.`],
          'condition z(L)=H−h1, isolation de v0, A.N. avec unité'),
        Q(1,r`Déterminer la durée $t_B$ nécessaire au ballon pour atteindre le panier.`,
          [r`Le plus simple : $x_B=L=v_0\cos\alpha\;t_B$, d'où ${BOX(r`$t_B=\dfrac{L}{v_0\cos\alpha}=${tx(t)}\ \mathrm{s}$`)}.`,
           RQ(`Remarque : résoudre $z(t_B)=H-h_1$ donne une équation du 2nd degré à deux racines ; la bonne est la plus grande (le ballon est dans sa phase descendante).`)],
          'méthode la plus directe (x = L), valeur et unité')
      ],
      rem:[`La masse du ballon ne sert à rien : elle se simplifie dans le TRC.`,`Vérifier que la calculatrice est en degrés avant de calculer $\\cos\\alpha$.`]};
  }
  const al=g.pick([30,40,50,60]),v0=g.pick([12,15,18,20]),h=g.pick([20,30,40]),ts=v0*sn(al)/G,zm=h+(v0*sn(al))**2/(2*G),tv=(v0*sn(al)+Math.sqrt((v0*sn(al))**2+2*G*h))/G,P=v0*cs(al)*tv;
  return{id:'falaise',fam:'TRC',len:'moyen',title:"Projectile lancé du haut d'une falaise",fig:figBall({mode:'cliff',alpha:al}),
    intro:r`Un projectile assimilé à un point matériel $M$ est lancé à $t=0$ depuis le point $A$, situé en haut d'une falaise à la hauteur $h=${h}\ \mathrm{m}$ au-dessus du sol horizontal, avec une vitesse $\vec v_0$ de norme $v_0=${v0}\ \mathrm{m/s}$ faisant un angle $\alpha=${al}^\circ$ au-dessus de l'horizontale. On néglige tout frottement. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(3,r`Faire le bilan des forces et déterminer les équations horaires du mouvement (origine $O$ au pied de la falaise, à la verticale de $A$).`,
        [r`Base : $\vec e_x$ horizontal dans le sens du lancer, $\vec e_z$ vertical ascendant. Seule force : le poids $\vec P\begin{vmatrix}0\\0\\-mg\end{vmatrix}$.`,
         r`TRC : $m\vec a=\vec P$ donc $\ddot x=0$, $\ddot y=0$, $\ddot z=-g$. Conditions initiales : $\overrightarrow{OM}(0)\begin{vmatrix}0\\0\\h\end{vmatrix}$ et $\vec v(0)\begin{vmatrix}v_0\cos\alpha\\0\\v_0\sin\alpha\end{vmatrix}$.`,
         r`Après intégrations : ${BOX(r`$x(t)=v_0\cos\alpha\;t$`)} ; ${BOX('$y(t)=0$')} ; ${BOX(r`$z(t)=-\dfrac12gt^2+v_0\sin\alpha\;t+h$`)}.`],
        'TRC projeté, conditions initiales avec h, équations horaires'),
      Q(1.5,r`Déterminer l'altitude maximale atteinte par le projectile (par rapport au sol). A.N.`,
        [r`Au sommet $\dot z=0$ : $-gt_s+v_0\sin\alpha=0$ donc $t_s=\dfrac{v_0\sin\alpha}{g}=${tx(ts)}\ \mathrm{s}$.`,
         r`${BOX(r`$z_{max}=z(t_s)=h+\dfrac{(v_0\sin\alpha)^2}{2g}=${tx(zm)}\ \mathrm{m}$`)}.`],
        'condition ż = 0, expression puis valeur'),
      Q(2.5,r`Déterminer la durée du vol jusqu'au sol.`,
        [r`Le projectile touche le sol quand $z(t_v)=0$ : $-\dfrac12gt_v^2+v_0\sin\alpha\,t_v+h=0$, équation du second degré de discriminant $\Delta=v_0^2\sin^2\alpha+2gh>0$.`,
         r`Les deux racines sont $\dfrac{v_0\sin\alpha\pm\sqrt\Delta}{g}$ ; on garde la racine positive : ${BOX(r`$t_v=\dfrac{v_0\sin\alpha+\sqrt{v_0^2\sin^2\alpha+2gh}}{g}=${tx(tv)}\ \mathrm{s}$`)}.`],
        'équation z=0, discriminant, choix de la racine positive justifié'),
      Q(1.5,r`En déduire la portée $d$ (distance horizontale parcourue entre la falaise et le point d'impact).`,
        [r`${BOX(r`$d=x(t_v)=v_0\cos\alpha\;t_v=${tx(P)}\ \mathrm{m}$`)}.`],
        'x(t_v), valeur et unité')
    ],
    rem:[`Quand une équation du second degré apparaît, toujours justifier le choix de la racine (temps positif, bonne phase du mouvement).`]};
}

function exIncline(g){
  const al=g.pick([30,35,40]),mu=g.pick([.15,.2,.25,.3]),m=g.pick([3,5,8]),vt=g.pick([1.5,2,2.5]),al2=Math.round(deg(Math.atan(mu))*.6);
  const a=G*(sn(al)-mu*cs(al)),ac=deg(Math.atan(mu)),t=vt/a,d=vt*vt/(2*a);
  return{id:'incline',fam:'TRC',len:'moyen',title:'Frottement solide et glissement sur un plan incliné',fig:figIncline({alpha:al,block:true}),
    intro:r`Une caisse de masse $m=${m}\ \mathrm{kg}$, assimilée à un point matériel $M$, est posée sur un plan initialement horizontal que l'on incline peu à peu d'un angle $\alpha$. Le coefficient de frottement entre la caisse et le plan est $\mu=${tx(mu)}$ (on suppose les coefficients statique et dynamique égaux). $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(4,r`On choisit $\alpha=${al}^\circ$ et on observe que la caisse glisse (lâchée sans vitesse initiale). Faire le bilan des forces puis déterminer l'équation horaire du mouvement.`,
        [r`Base : $\vec e_x$ le long de la pente vers le bas (sens du mouvement), $\vec e_y$ normal au plan, $\vec e_z$ complétant la base directe. $O$ : position de la caisse à $t=0$. Le contact avec le plan impose $\dot y=\ddot y=0$ : $\vec a=\ddot x\,\vec e_x$.`,
         r`Forces : poids $\vec P=mg\sin\alpha\,\vec e_x-mg\cos\alpha\,\vec e_y$ ; réaction normale $\vec R_N=R_N\,\vec e_y$ ; frottement solide $\vec R_T=-R_T\,\vec e_x$ (il s'oppose au glissement).`,
         r`TRC : $m\vec a=\vec P+\vec R_N+\vec R_T$. Selon $\vec e_y$ : $0=-mg\cos\alpha+R_N$, donc $R_N=mg\cos\alpha$. Selon $\vec e_x$ : $m\ddot x=mg\sin\alpha-R_T$.`,
         r`Il y a glissement : loi de Coulomb $R_T=\mu R_N=\mu mg\cos\alpha$. Donc $\ddot x=g(\sin\alpha-\mu\cos\alpha)=${tx(a)}\ \mathrm{m/s^2}$.`,
         r`Avec $\dot x(0)=0$ et $x(0)=0$ : $\dot x(t)=g(\sin\alpha-\mu\cos\alpha)\,t$ et ${BOX(r`$x(t)=\dfrac12\,g(\sin\alpha-\mu\cos\alpha)\,t^2$`)}.`],
        'base inclinée, 3 forces et coordonnées, N=mg cosα, Coulomb avec glissement, x(t)'),
      Q(1.5,r`Pour un angle plus faible, la caisse ne glisse pas. Déterminer les composantes de l'action mécanique exercée par le support sur la caisse.`,
        [r`La caisse est immobile : $\vec v=\vec a=\vec 0$ et le TRC devient la première loi de la statique $\vec P+\vec R_N+\vec R_T=\vec 0$.`,
         r`Selon $\vec e_x$ : $0=mg\sin\alpha-R_T$ donc ${BOX(r`$R_T=mg\sin\alpha$`)}. Selon $\vec e_y$ : $0=-mg\cos\alpha+R_N$ donc ${BOX(r`$R_N=mg\cos\alpha$`)}.`,
         RQ(`Remarque : sans glissement, $R_T$ ne vaut plus $\\mu\\,mg\\cos\\alpha$ ; la loi de Coulomb devient une inégalité $R_T<\\mu R_N$.`)],
        'statique, deux composantes, remarque sur Coulomb'),
      Q(2,r`Déterminer l'angle $\alpha_c$ à partir duquel la caisse se met à glisser. A.N.`,
        [r`Tant qu'il n'y a pas glissement, $R_T<\mu R_N$ : $mg\sin\alpha<\mu\,mg\cos\alpha$, soit ${BOX(r`$\tan\alpha<\mu$`)}.`,
         r`$\alpha_c=\arctan\mu=\arctan(${tx(mu)})=${BOX(r`$${tx(ac)}^\circ$`)}$ : la caisse glisse pour $\alpha>\alpha_c$ (et $\alpha=${al}^\circ$ était bien au-delà). Par exemple, à $\alpha=${al2}^\circ$ elle reste immobile.`],
        'inégalité de Coulomb, tan α < μ, A.N. en degrés'),
      Q(2,r`Pour $\alpha=${al}^\circ$, au bout de combien de temps et à quelle distance de son point de départ la vitesse de la caisse atteint-elle $${tx(vt)}\ \mathrm{m/s}$ ?`,
        [r`$\dot x(t_1)=a\,t_1=${tx(vt)}$ donc ${BOX(r`$t_1=\dfrac{${tx(vt)}}{g(\sin\alpha-\mu\cos\alpha)}=${tx(t)}\ \mathrm{s}$`)}.`,
         r`${BOX(r`$d=x(t_1)=\dfrac12a\,t_1^2=\dfrac{${tx(vt)}^2}{2a}=${tx(d)}\ \mathrm{m}$`)}.`],
        'durée, distance, unités'),
      Q(.5,r`Quel est le rôle de la masse de la caisse dans ce problème ?`,
        [r`Aucun sur le mouvement : $m$ se simplifie dans $\ddot x=g(\sin\alpha-\mu\cos\alpha)$ et dans la condition $\tan\alpha_c=\mu$. La masse intervient seulement dans l'intensité des forces ($R_N$, $R_T$).`],
        'simplification de m')
    ],
    rem:[`La norme de la réaction normale se trouve toujours en projetant le TRC sur la normale au support (ici $R_N=mg\\cos\\alpha$, pas $mg$).`]};
}

function exSki(g){
  if(g.r()<.55){
    const m=g.pick([70,80,95,100]),mu=g.pick([.1,.15,.2]),al=g.pick([20,25,30]),be=g.pick([30,35,40,45]);
    const den=cs(be)+mu*sn(be),T=m*G*(sn(al)+mu*cs(al))/den;
    return{id:'ski',fam:'TRC',len:'moyen',title:'Skieur remontant une pente (téléski)',fig:figIncline({alpha:al,block:true,beta:be}),
      intro:r`Un skieur de masse $m=${m}\ \mathrm{kg}$, assimilé à un point matériel $M$, remonte une pente faisant l'angle $\alpha=${al}^\circ$ avec l'horizontale grâce à un téléski. La perche exerce une force de traction $\vec T$ de norme $T$ faisant l'angle $\beta=${be}^\circ$ avec la pente. Le coefficient de frottement solide entre la neige et les skis est $\mu=${tx(mu)}$. On appelle $\vec e_x$ le vecteur unitaire dirigé selon la pente, vers le haut. $g=9{,}81\ \mathrm{m/s^2}$.`,
      qs:[
        Q(1.5,r`Compléter le schéma avec une base orthonormée directe $(\vec e_x,\vec e_y,\vec e_z)$, puis donner les vecteurs position, vitesse et accélération de $M$ dans cette base ($O$ au bas de la pente).`,
          [r`On prend $\vec e_y$ normal à la pente (vers le haut) ; $\vec e_z$ sort de la feuille pour que la base soit directe.`,
           r`La trajectoire est rectiligne selon $\vec e_x$ : ${BOX(r`$\overrightarrow{OM}=x\,\vec e_x$, $\vec v=\dot x\,\vec e_x$, $\vec a=\ddot x\,\vec e_x$`)}.`],
          'base directe dessinée, vecteurs simplifiés'),
        Q(2,r`Faire le bilan des forces sur le skieur et préciser leurs coordonnées dans cette base.`,
          [r`Poids $\vec P=-mg\sin\alpha\,\vec e_x-mg\cos\alpha\,\vec e_y$ ; traction de la perche $\vec T=T\cos\beta\,\vec e_x+T\sin\beta\,\vec e_y$ ; réaction normale $\vec R_N=R_N\,\vec e_y$ ; réaction tangentielle (le skieur monte, donc le frottement est dirigé vers le bas) $\vec R_T=-R_T\,\vec e_x$.`],
          '4 forces, sens du frottement, coordonnées'),
        Q(2.5,r`En exploitant le TRC et le fait que le skieur glisse, exprimer l'accélération $\ddot x$ en fonction de $T$, $m$, $g$, $\mu$, $\alpha$ et $\beta$.`,
          [r`TRC : $m\vec a=\vec P+\vec T+\vec R_N+\vec R_T$. Selon $\vec e_y$ : $0=-mg\cos\alpha+T\sin\beta+R_N$, donc $R_N=mg\cos\alpha-T\sin\beta$.`,
           r`Il y a glissement : $R_T=\mu R_N$. Selon $\vec e_x$ : $m\ddot x=-mg\sin\alpha+T\cos\beta-\mu(mg\cos\alpha-T\sin\beta)$, soit ${BOX(r`$\ddot x=-g(\sin\alpha+\mu\cos\alpha)+\dfrac{T}{m}(\cos\beta+\mu\sin\beta)$`)}.`,
           RQ(`Remarque : la réaction normale n'est pas $mg\\cos\\alpha$ ici, car la perche tire le skieur « vers le haut » : $T\\sin\\beta$ allège l'appui.`)],
          'projection selon e_y puis e_x, Coulomb avec glissement, expression finale'),
        Q(2,r`Le skieur atteint une vitesse constante. Exprimer la tension $T$ de la perche puis la calculer.`,
          [r`Vitesse constante : $\ddot x=0$, donc ${BOX(r`$T=\dfrac{mg\,(\sin\alpha+\mu\cos\alpha)}{\cos\beta+\mu\sin\beta}$`)}.`,
           r`A.N. : $T=\dfrac{${m}\times9{,}81\times(\sin ${al}^\circ+${tx(mu)}\cos ${al}^\circ)}{\cos ${be}^\circ+${tx(mu)}\sin ${be}^\circ}=${BOX(r`$${tx(T)}\ \mathrm{N}$`)}$.`],
          'ẍ = 0, isolation de T, A.N.')
      ],
      rem:[`Mouvement de glissement : la loi de Coulomb s'écrit avec une égalité $R_T=\\mu R_N$.`]};
  }
  const m=g.pick([20,30,40,50]),mu=g.pick([.2,.3,.4]),be=g.pick([20,25,30,35]),den=cs(be)+mu*sn(be),T=mu*m*G/den,Tm=m*G/sn(be),a2=.25*T*den/m;
  return{id:'caisseTiree',fam:'TRC',len:'moyen',title:'Caisse tirée par un câble sur un sol horizontal',fig:figCaisse(be),
    intro:r`Une caisse de masse $m=${m}\ \mathrm{kg}$, assimilée à un point matériel $M$, est tirée sur un sol horizontal par un câble exerçant une force de traction $\vec T$ de norme $T$ faisant un angle $\beta=${be}^\circ$ avec l'horizontale. Le coefficient de frottement entre la caisse et le sol est $\mu=${tx(mu)}$. La caisse glisse sur le sol. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(2,r`Choisir une base orthonormée directe adaptée, puis faire le bilan des forces avec leurs coordonnées.`,
        [r`$\vec e_x$ horizontal dans le sens du mouvement, $\vec e_y$ vertical ascendant, $\vec e_z$ complétant la base directe. Le mouvement est rectiligne selon $\vec e_x$ : $\vec a=\ddot x\,\vec e_x$.`,
         r`Poids $\vec P=-mg\,\vec e_y$ ; traction $\vec T=T\cos\beta\,\vec e_x+T\sin\beta\,\vec e_y$ ; réaction normale $\vec R_N=R_N\,\vec e_y$ ; frottement solide $\vec R_T=-R_T\,\vec e_x$.`],
        'base, 4 forces, coordonnées, sens du frottement'),
      Q(2.5,r`Appliquer le TRC : exprimer la réaction normale $R_N$ puis l'accélération $\ddot x$ en fonction de $T$.`,
        [r`Selon $\vec e_y$ : $0=-mg+T\sin\beta+R_N$, donc ${BOX(r`$R_N=mg-T\sin\beta$`)}.`,
         r`Selon $\vec e_x$ avec $R_T=\mu R_N$ (glissement) : $m\ddot x=T\cos\beta-\mu(mg-T\sin\beta)$, soit ${BOX(r`$\ddot x=\dfrac{T}{m}(\cos\beta+\mu\sin\beta)-\mu g$`)}.`],
        'projections, Coulomb, expression de ẍ'),
      Q(2,r`La caisse avance à vitesse constante. Calculer la tension $T$ du câble.`,
        [r`$\ddot x=0$ donne ${BOX(r`$T=\dfrac{\mu mg}{\cos\beta+\mu\sin\beta}$`)}, soit $T=\dfrac{${tx(mu)}\times${m}\times9{,}81}{\cos ${be}^\circ+${tx(mu)}\sin ${be}^\circ}=${BOX(r`$${tx(T)}\ \mathrm{N}$`)}$.`],
        'ẍ = 0, A.N. avec unité'),
      Q(1.5,r`Si la tension devient trop grande, la caisse peut décoller du sol. Déterminer la valeur de $T$ au-delà de laquelle cela se produit. Calculer l'accélération quand $T=1{,}25$ fois la valeur de la question précédente.`,
        [r`La caisse reste au contact tant que $R_N>0$ : $mg-T\sin\beta>0$, donc elle décolle pour $T>T_{max}=\dfrac{mg}{\sin\beta}=${BOX(r`$${tx(Tm)}\ \mathrm{N}$`)}$.`,
         r`Pour $T'=1{,}25\,T_0$ : $\ddot x=\dfrac{0{,}25\,T_0(\cos\beta+\mu\sin\beta)}{m}=${BOX(r`$${tx(a2)}\ \mathrm{m/s^2}$`)}$ (toujours en dessous de $T_{max}$, donc pas de décollage).`],
        'condition R_N = 0, valeur de T_max, accélération')
    ],
    rem:[`Une réaction normale ne peut pas être négative : $R_N=0$ signifie que le contact est rompu.`]};
}

/* ================= FAMILLE TEC ================= */
function exProjTEC(g){
  const h=g.pick([30,40,50,60]),V0=g.pick([10,15,20]),m=g.pick([.3,.5,.8]),th=g.pick([30,45,60]);
  const v1=Math.sqrt(V0*V0+2*G*h),zm=h+V0*V0/(2*G),zt=h+(V0*cs(th))**2/(2*G),vt=V0*sn(th);
  return{id:'projTEC',fam:'TEC',len:'moyen',title:'Lancer de projectile et théorème de l\u2019énergie cinétique',fig:'',
    intro:r`Un projectile de masse $m=${tx(m)}\ \mathrm{kg}$, assimilé à un point matériel, est lancé à $t=0$ d'un point $A$ situé à $h=${h}\ \mathrm{m}$ au-dessus du sol, avec une vitesse initiale de norme $V_0=${V0}\ \mathrm{m/s}$. Tout frottement est négligé. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(1.5,r`La vitesse initiale est verticale, dirigée vers le bas. Calculer directement la vitesse d'impact au sol.`,
        [r`Seul le poids travaille (il n'y a pas d'autre force) : $W_{A\to sol}(\vec P)=+mgh$ (descente : travail moteur).`,
         r`TEC : $\dfrac12mv_1^2-\dfrac12mV_0^2=mgh$, d'où ${BOX(r`$v_1=\sqrt{V_0^2+2gh}=\sqrt{${V0}^2+2\times9{,}81\times${h}}=${tx(v1)}\ \mathrm{m/s}$`)}.`],
        'bilan des forces, travail du poids avec le bon signe, TEC, A.N.'),
      Q(1.5,r`Le projectile est maintenant lancé vers le haut avec la même vitesse $V_0$. Déterminer l'altitude maximale atteinte (par rapport au sol).`,
        [r`Au sommet, la vitesse est nulle. TEC entre $A$ et le sommet : $0-\dfrac12mV_0^2=-mg(z_{max}-h)$.`,
         r`${BOX(r`$z_{max}=h+\dfrac{V_0^2}{2g}=${tx(zm)}\ \mathrm{m}$`)}.`],
        'TEC avec travail négatif du poids dans la montée'),
      Q(1.5,r`Quelle est la vitesse d'impact dans ce cas ? Comparer avec la question 1 et préciser avec quelle vitesse le projectile repasse par $A$ en redescendant.`,
        [r`Le travail du poids ne dépend que de la différence d'altitude entre $A$ et le sol, pas du chemin suivi : le TEC entre $A$ et le sol est le même que dans la question 1. ${BOX(r`$v=v_1=${tx(v1)}\ \mathrm{m/s}$`)}, identique, quelle que soit la direction (haut ou bas) du lancer.`,
         r`En repassant par $A$, le travail du poids depuis le lancer est nul : la vitesse vaut de nouveau $V_0$ (en norme).`],
        'argument « travail du poids indépendant du chemin »'),
      Q(1,r`On lance enfin le projectile avec la même vitesse $V_0$, vers le haut, dans une direction inclinée de $\theta=${th}^\circ$ par rapport à la verticale. Calculer sa vitesse d'impact.`,
        [r`Le travail du poids est encore $mgh$ : le TEC donne exactement le même résultat, ${BOX(r`$v=${tx(v1)}\ \mathrm{m/s}$`)}.`],
        'réutilisation du TEC (la direction ne compte pas)'),
      Q(2.5,r`Le TEC suffit-il pour calculer l'altitude maximale dans ce dernier cas ? De quelle information supplémentaire a-t-on besoin et comment l'obtenir ? Calculer alors $z_{max}$ puis la vitesse au sommet.`,
        [r`Non : au sommet la vitesse n'est pas nulle (il reste une composante horizontale), et le TEC seul ne la donne pas. Il faut connaître la vitesse au sommet.`,
         r`On l'obtient avec le TRC : le poids est vertical donc $\ddot x=0$ et la composante horizontale de la vitesse reste égale à sa valeur initiale $V_0\sin\theta$ (angle $\theta$ mesuré par rapport à la verticale). Au sommet, ${BOX(r`$v_s=V_0\sin\theta=${tx(vt)}\ \mathrm{m/s}$`)}.`,
         r`TEC entre $A$ et le sommet : $\dfrac12mV_0^2\sin^2\theta-\dfrac12mV_0^2=-mg(z_{max}-h)$, soit ${BOX(r`$z_{max}=h+\dfrac{V_0^2\cos^2\theta}{2g}=${tx(zt)}\ \mathrm{m}$`)}.`,
         RQ(`Conclusion : le TEC relie vitesses et positions sans passer par le temps, mais il ne donne que la norme de la vitesse ; le TRC donne la direction du mouvement (composantes, équations horaires).`)],
        'limite du TEC identifiée, TRC pour la composante horizontale, TEC final')
    ],
    rem:[`Le travail du poids vaut $\\pm mgh$ : positif en descente, négatif en montée, quelle que soit la trajectoire.`]};
}

function exFreinTEC(g){
  const m=g.pick([700,850,1000,1200]),mu=g.pick([.3,.35,.5,.7]),vk=g.pick([50,90,130]),v=vk/3.6,Fm=mu*m*G,L=v*v/(2*mu*G);
  return{id:'freinTEC',fam:'TEC',len:'moyen',title:'Distance de freinage minimale (frottement solide)',fig:figCar(),
    intro:r`Une voiture de masse $m=${m}\ \mathrm{kg}$ roule à la vitesse constante $v_0=${vk}\ \mathrm{km/h}$ sur une route droite horizontale. Le conducteur freine à fond. La seule force horizontale est la force de frottement solide $\vec R_T$ du sol sur les pneus, de norme $F$ supposée constante ; le coefficient de frottement des pneus sur la route est $\mu=${tx(mu)}$. On néglige les frottements de l'air. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(1,r`Exprimer le travail de la force de freinage lorsque la voiture a parcouru une distance quelconque $d$ depuis le début du freinage.`,
        [r`La force $\vec R_T=-F\,\vec e_x$ est constante et le déplacement est $d\,\vec e_x$ : ${BOX(r`$W(\vec R_T)=\vec R_T\cdot d\,\vec e_x=-F\,d$`)}. Il est négatif : force résistante.`],
        'produit scalaire, signe négatif commenté'),
      Q(1.5,r`En déduire, par le TEC, la distance de freinage $L$ en fonction de $F$, $m$ et $v_0$.`,
        [r`Seule $\vec R_T$ travaille : le poids et la réaction normale sont perpendiculaires au déplacement, leur travail est nul.`,
         r`TEC entre le début du freinage et l'arrêt : $0-\dfrac12mv_0^2=-F\,L$, d'où ${BOX(r`$L=\dfrac12\dfrac{mv_0^2}{F}$`)}.`],
        'travaux nuls justifiés, TEC écrit, résultat'),
      Q(1.5,r`Déterminer l'expression et la valeur de la force de freinage maximale $F_{max}$ avant que les roues ne glissent.`,
        [r`Vertical : $R_N=mg$ (équilibre selon la normale). Tant que les roues ne glissent pas, la loi de Coulomb donne $F\le\mu R_N$.`,
         r`${BOX(r`$F_{max}=\mu\,mg=${tx(mu)}\times${m}\times9{,}81=${tx(Fm)}\ \mathrm{N}$`)}. Au-delà, les roues se bloquent et la voiture glisse : le freinage est alors moins efficace.`],
        'N = mg, Coulomb sans glissement, valeur'),
      Q(1.5,r`En déduire la distance d'arrêt minimale $L_{min}$. Pourquoi ne dépend-elle pas de la masse de la voiture ?`,
        [r`${BOX(r`$L_{min}=\dfrac12\dfrac{mv_0^2}{\mu mg}=\dfrac{v_0^2}{2\mu g}$`)}. La masse se simplifie : l'énergie cinétique à dissiper et la force de frottement maximale sont toutes deux proportionnelles à $m$.`],
        'simplification de m expliquée'),
      Q(1.5,r`Application numérique : calculer $L_{min}$ pour $v_0=${vk}\ \mathrm{km/h}$, puis sur route mouillée où le coefficient est divisé par 2.`,
        [r`$v_0=${tx(v)}\ \mathrm{m/s}$ ; $L_{min}=\dfrac{${tx(v)}^2}{2\times${tx(mu)}\times9{,}81}=${BOX(r`$${tx(L)}\ \mathrm{m}$`)}$.`,
         r`Route mouillée : $\mu'=\mu/2$, donc $L'_{min}=2L_{min}=${BOX(r`$${tx(2*L)}\ \mathrm{m}$`)}$ ($L_{min}$ est inversement proportionnelle à $\mu$).`],
        'conversion en m/s, deux valeurs avec unité')
    ],
    rem:[`Le TEC ne demande pas de projeter : on calcule directement des travaux (scalaires). La réaction normale ne travaille jamais sur un support fixe.`]};
}

function exPalet(g){
  const h=g.pick([1,1.5,2,2.5]),d=g.pick([3,4,5]),mu=g.pick([.1,.2,.3]),m=g.pick([.2,.5,1]);
  const al=deg(Math.atan(h/d)),f=mu*m*G*cs(al),Wf=-mu*m*G*d,v0=Math.sqrt(2*G*(h+mu*d)),v0n=Math.sqrt(2*G*h);
  return{id:'palet',fam:'TEC',len:'moyen',title:'Vitesse minimale pour gravir un plan incliné',fig:figIncline({alpha:al,dims:true}),
    intro:r`On lance un palet de masse $m=${tx(m)}\ \mathrm{kg}$ depuis $M_0$ avec une vitesse $v_0$, de sorte qu'il arrive en $M_1$ avec une vitesse nulle. Le palet glisse sur le plan incliné en étant soumis à une force de frottement solide $\vec f$ de coefficient $\mu=${tx(mu)}$. $M_1$ est situé à la hauteur $h=${tx(h)}\ \mathrm{m}$ au-dessus de $M_0$ et à la distance horizontale $d=${d}\ \mathrm{m}$. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(1.5,r`Faire le bilan des forces exercées sur le palet pendant la montée (schéma, base choisie).`,
        [r`Base : $\vec e_x$ le long de la pente vers le haut, $\vec e_y$ normal au plan. Forces : poids $\vec P=-mg\sin\alpha\,\vec e_x-mg\cos\alpha\,\vec e_y$ ; réaction normale $\vec R_N=R_N\,\vec e_y$ ; frottement $\vec f=-f\,\vec e_x$ (opposé au mouvement, donc vers le bas de la pente).`],
        'base, 3 forces, sens de f'),
      Q(1.5,r`Montrer que $f=\mu\,mg\cos\alpha$ et exprimer $\alpha$ en fonction de $h$ et $d$.`,
        [r`TRC selon $\vec e_y$ (pas de mouvement normal au plan) : $0=-mg\cos\alpha+R_N$, donc $R_N=mg\cos\alpha$. Il y a glissement : ${BOX(r`$f=\mu R_N=\mu\,mg\cos\alpha$`)}.`,
         r`Géométrie : $\tan\alpha=\dfrac{h}{d}$ donc $\alpha=\arctan\dfrac{h}{d}=${tx(al)}^\circ$.`],
        'projection normale, Coulomb avec glissement, angle'),
      Q(3,r`En utilisant le théorème de l'énergie cinétique entre $M_0$ et $M_1$, déterminer $v_0$ en fonction de $\mu$, $g$, $h$ et $d$.`,
        [r`Travaux entre $M_0$ et $M_1$ : $W(\vec R_N)=0$ ; $W(\vec P)=-mgh$ (montée) ; $W(\vec f)=-f\times\dfrac{d}{\cos\alpha}=-\mu\,mg\cos\alpha\times\dfrac{d}{\cos\alpha}=-\mu\,mg\,d$ (longueur parcourue $M_0M_1=d/\cos\alpha$).`,
         r`TEC : $0-\dfrac12mv_0^2=-mgh-\mu\,mg\,d$, donc ${BOX(r`$v_0=\sqrt{2g\,(h+\mu d)}$`)}.`,
         RQ(`Remarque : le travail du frottement ne dépend que de $d$ (la composante horizontale), l'angle disparaît.`)],
        'trois travaux (dont R_N nul), TEC, résultat littéral'),
      Q(2,r`Application numérique. Quelle serait la vitesse minimale sans frottement ?`,
        [r`$v_0=\sqrt{2\times9{,}81\times(${tx(h)}+${tx(mu)}\times${d})}=${BOX(r`$${tx(v0)}\ \mathrm{m/s}$`)}$. Travail du frottement : $W(\vec f)=${tx(Wf)}\ \mathrm{J}$.`,
         r`Sans frottement ($\mu=0$) : $v_0=\sqrt{2gh}=${BOX(r`$${tx(v0n)}\ \mathrm{m/s}$`)}$ : il faut lancer plus vite en présence de frottement.`],
        'A.N., comparaison')
    ],
    rem:[`Le travail d'une force de frottement est toujours négatif.`]};
}

function exPiste(g){
  const rr=g.pick([2,2.5,3]),L=g.pick([2,2.5,3]),mu=g.pick([.2,.25,.3]),m=g.pick([.5,1,2]);
  const vB=Math.sqrt(2*G*rr),W=-mu*m*G*L,vC=Math.sqrt(2*G*(rr-mu*L)),vB2=Math.sqrt(2*G*(rr-2*mu*L)),h=rr-2*mu*L;
  return{id:'piste',fam:'TEC',len:'moyen',title:'Étude énergétique d\u2019un bloc sur une piste avec ressort',fig:figTrack(),
    intro:r`On envisage la piste schématisée ci-contre. La section $AB$ est un quart de cercle de rayon $r=${tx(rr)}\ \mathrm{m}$, parfaitement lisse. La section $BC$ est horizontale, de longueur $L=${tx(L)}\ \mathrm{m}$, avec un coefficient de frottement $\mu=${tx(mu)}$. Dans la section $CD$, sous le ressort, le frottement est négligeable. Un bloc ponctuel de masse $m=${tx(m)}\ \mathrm{kg}$ est lâché en $A$ sans vitesse initiale, comprime le ressort, puis est renvoyé vers la gauche. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(1.5,r`Déterminer la vitesse $v_B$ du bloc en $B$.`,
        [r`Sur $AB$ : la réaction normale ne travaille pas (piste lisse, $\vec R_N\perp$ déplacement) ; le poids travaille : $W=mg\,r$ (descente de la hauteur $r$).`,
         r`TEC : $\dfrac12mv_B^2-0=mgr$, d'où ${BOX(r`$v_B=\sqrt{2gr}=${tx(vB)}\ \mathrm{m/s}$`)}.`],
        'travaux justifiés, TEC, A.N.'),
      Q(1,r`Calculer le travail de la force de frottement de $B$ à $C$.`,
        [r`Sur $BC$ : $R_N=mg$, donc $f=\mu mg$ (glissement). Le déplacement est $L$, colinéaire et de sens opposé à $\vec f$ : ${BOX(r`$W_{B\to C}(\vec f)=-\mu\,mg\,L=${tx(W)}\ \mathrm{J}$`)}.`],
        'signe négatif, valeur, unité'),
      Q(1.5,r`En déduire la vitesse $v_C$ du bloc en $C$.`,
        [r`TEC entre $B$ et $C$ : $\dfrac12mv_C^2-\dfrac12mv_B^2=-\mu mgL$, d'où ${BOX(r`$v_C=\sqrt{v_B^2-2\mu gL}=\sqrt{2g\,(r-\mu L)}=${tx(vC)}\ \mathrm{m/s}$`)}.`],
        'TEC B→C, A.N.'),
      Q(1.5,r`Le bloc repasse par $C$ avec la même vitesse qu'à l'aller. Déterminer sa vitesse $v_B'$ à son passage par $B$ au retour.`,
        [r`De $C$ à $B$, le frottement dissipe de nouveau $\mu mgL$ : $\dfrac12mv_B'^2-\dfrac12mv_C^2=-\mu mgL$.`,
         r`${BOX(r`$v_B'=\sqrt{v_C^2-2\mu gL}=\sqrt{2g\,(r-2\mu L)}=${tx(vB2)}\ \mathrm{m/s}$`)}.`],
        'TEC C→B, A.N.'),
      Q(1.5,r`À quelle hauteur $h$ au-dessus de la piste horizontale le bloc remonte-t-il sur le quart de cercle ?`,
        [r`Sur le quart de cercle lisse, TEC entre $B$ et le point le plus haut (vitesse nulle) : $0-\dfrac12mv_B'^2=-mgh$.`,
         r`${BOX(r`$h=\dfrac{v_B'^2}{2g}=r-2\mu L=${tx(h)}\ \mathrm{m}$`)}, inférieure à $r$ : l'énergie perdue par frottement l'empêche de remonter jusqu'en $A$.`],
        'TEC sur AB, h, interprétation')
    ],
    rem:[`Découper le problème par tronçons : un TEC par portion de trajectoire, en travaillant avec des travaux (scalaires).`]};
}

function exPendule(g){
  const L=g.pick([.5,.8,1,1.2,1.5]),m=g.pick([.1,.2,.5]),th0=g.pick([40,50,60,70]),th1=g.pick([10,15,20,25]),thm=g.pick([40,50,60]);
  const v0=Math.round(Math.sqrt(2*G*L*(1-cs(thm)))*10)/10,thmax=deg(Math.acos(1-v0*v0/(2*G*L))),vmax=Math.sqrt(2*G*L),vth=Math.sqrt(2*G*L*(cs(th1)-cs(th0)));
  return{id:'pendule',fam:'TEC',len:'moyen',title:'Mouvement d\u2019un pendule simple',fig:figPend(th0),
    intro:r`Un pendule simple est formé d'une bille ponctuelle $M$ de masse $m=${tx(m)}\ \mathrm{kg}$ suspendue à l'extrémité d'un fil idéal de longueur $L=${tx(L)}\ \mathrm{m}$ attaché en un point fixe $O$. Il oscille dans le plan vertical $(xOz)$, sans frottement, et sa position est repérée par l'angle orienté $\theta$ par rapport à la verticale descendante. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(2.5,r`La bille est lâchée sans vitesse initiale depuis la position où le fil est tendu horizontalement ($\theta_0=90^\circ$). En utilisant le TEC, exprimer sa vitesse en fonction de $\theta$, puis sa vitesse maximale (A.N.).`,
        [r`Forces : le poids $\vec P$ et la tension $\vec T$ du fil. La tension est perpendiculaire à la vitesse (le fil est tendu, la trajectoire est circulaire) : elle ne travaille pas.`,
         r`Le poids travaille : la bille descend de la hauteur $L\cos\theta$ entre $\theta_0=90^\circ$ et $\theta$, donc $W(\vec P)=mgL\cos\theta$.`,
         r`TEC : $\dfrac12mv^2-0=mgL\cos\theta$, d'où ${BOX(r`$v(\theta)=\sqrt{2gL\cos\theta}$`)}.`,
         r`La vitesse est maximale pour $\theta=0$ (point le plus bas) : ${BOX(r`$v_{max}=\sqrt{2gL}=${tx(vmax)}\ \mathrm{m/s}$`)}.`],
        'tension ne travaille pas, travail du poids, TEC, v_max'),
      Q(2,r`La bille est maintenant lâchée sans vitesse initiale depuis la position $\theta_0=${th0}^\circ$. Exprimer sa vitesse en fonction de $\theta$ et la calculer pour $\theta=${th1}^\circ$.`,
        [r`Entre $\theta_0$ et $\theta$, le poids fournit $W(\vec P)=mgL(\cos\theta-\cos\theta_0)$ (la bille descend si $\theta<\theta_0$).`,
         r`TEC : ${BOX(r`$v(\theta)=\sqrt{2gL\,(\cos\theta-\cos\theta_0)}$`)}. A.N. : $v(${th1}^\circ)=\sqrt{2\times9{,}81\times${tx(L)}\times(\cos ${th1}^\circ-\cos ${th0}^\circ)}=${BOX(r`$${tx(vth)}\ \mathrm{m/s}$`)}$.`],
        'travail du poids avec θ0, v(θ), A.N.'),
      Q(2.5,r`À l'aide du théorème de la puissance cinétique, déterminer l'équation différentielle régissant $\theta(t)$.`,
        [r`Dans la base $(\vec e_x,\vec e_z)$ avec $\vec e_z$ ascendant : $\overrightarrow{OM}=L\sin\theta\,\vec e_x-L\cos\theta\,\vec e_z$, donc $\vec v=L\dot\theta\,(\cos\theta\,\vec e_x+\sin\theta\,\vec e_z)$ et $E_c=\dfrac12mL^2\dot\theta^2$.`,
         r`Puissances : $\mathcal P(\vec T)=0$ (tension $\perp$ vitesse) et $\mathcal P(\vec P)=\vec P\cdot\vec v=-mg\,\vec e_z\cdot\vec v=-mgL\dot\theta\sin\theta$.`,
         r`TPC : $\dfrac{dE_c}{dt}=mL^2\dot\theta\ddot\theta=-mgL\dot\theta\sin\theta$. En simplifiant par $mL\dot\theta$ : ${BOX(r`$\ddot\theta+\dfrac{g}{L}\sin\theta=0$`)}.`,
         RQ(`Remarque : pour de petits angles, $\\sin\\theta\\approx\\theta$ et on obtient l'équation d'un oscillateur harmonique.`)],
        'E_c et puissances écrites, dérivée, simplification, équation finale'),
      Q(3,r`À $t=0$, on lance la bille depuis le point le plus bas ($\theta=0$) avec la vitesse $v_0=${tx(v0)}\ \mathrm{m/s}$. Exprimer puis calculer l'angle maximal $\theta_{max}$ atteint.`,
        [r`Au point le plus haut, la vitesse est nulle. TEC entre $\theta=0$ et $\theta_{max}$ : $0-\dfrac12mv_0^2=-mgL\,(1-\cos\theta_{max})$.`,
         r`Donc $\cos\theta_{max}=1-\dfrac{v_0^2}{2gL}$ et ${BOX(r`$\theta_{max}=\arccos\!\left(1-\dfrac{v_0^2}{2gL}\right)=${tx(thmax)}^\circ$`)}.`],
        'TEC entre les deux positions, expression, A.N. en degrés')
    ],
    rem:[`La tension d'un fil ne travaille jamais sur une trajectoire circulaire : elle est toujours perpendiculaire à la vitesse.`]};
}

/* ================= Exercice long, type annale (côte et descente) ================= */
function exLong(g){
  let P;
  for(let k=0;k<80;k++){
    const m=g.pick([1000,1250,1500]),al=g.pick([6,8,10]),be=g.pick([4,5,6]),vk=g.pick([70,80,90]),h=g.pick([6,8,10]),mu=g.pick([.1,.15,.2]);
    const V0=vk/3.6,ell=h/sn(al),a=G*(sn(al)+mu*cs(al)),V2s=V0*V0-2*a*ell,V3s=V2s+2*G*h*(1-mu/tn(be));
    P={m,al,be,vk,h,mu,V0,ell,a,V2s,V3s,V1s:V0*V0-2*G*h};
    if(V2s>9&&V3s>4&&P.V1s>0&&V0*V0/(2*a)>ell*1.1)break;
    P=null;
  }
  if(!P){const m=1250,al=8,be=5,vk=80,h=8,mu=.15,V0=vk/3.6,ell=h/sn(al),a=G*(sn(al)+mu*cs(al)),V2s=V0*V0-2*a*ell;P={m,al,be,vk,h,mu,V0,ell,a,V2s,V3s:V2s+2*G*h*(1-mu/tn(be)),V1s:V0*V0-2*G*h};}
  const {m,al,be,vk,h,mu,V0,ell,a,V2s,V3s,V1s}=P,V1=Math.sqrt(V1s),V2=Math.sqrt(V2s),V3=Math.sqrt(V3s),tS=(V0-V2)/a,Fm=m*G*(sn(al)+mu*cs(al)),Pm=Fm*V0,dstop=V0*V0/(2*a),ab=G*(sn(be)-mu*cs(be)),dE=-mu*m*G*h*(1/tn(al)+1/tn(be));
  const V2i=Math.sqrt(V0*V0-2*G*h*(1+mu/tn(al)));
  return{id:'long',fam:'LONG',len:'long',title:'Montée et descente d\u2019un véhicule',fig:figHill(),
    intro:r`On étudie le mouvement d'un véhicule, assimilé à un point $M$ de masse $m=${m}\ \mathrm{kg}$, sur une route présentant successivement une côte puis une descente. Le véhicule arrive en $A$ avec la vitesse $V_0=${vk}\ \mathrm{km/h}$. Sauf mention contraire, le moteur est coupé à partir de $A$ : le véhicule n'avance qu'avec son élan. Les points $A$ et $B$ sont à la même altitude ; le sommet $S$ est à la hauteur $h=${h}\ \mathrm{m}$ au-dessus de $A$. L'angle de la côte avec l'horizontale est $\alpha=${al}^\circ$ et celui de la descente est $\beta=${be}^\circ$. $g=9{,}81\ \mathrm{m/s^2}$.`,
    qs:[
      Q(1.5,r`On néglige d'abord les frottements. Après un rapide bilan des forces, exprimer directement la vitesse $V_1$ du véhicule au sommet $S$. A.N.`,lsol1(),'bilan, travail de R_N nul, travail du poids négatif, TEC','1a'),
      Q(1,r`Calculer, en justifiant précisément, la vitesse du véhicule au point $B$.`,[r`Forces : poids et réaction normale. $A$ et $B$ sont à la même altitude donc $W_{A\to B}(\vec P)=0$ ; $W(\vec R_N)=0$. TEC : ${BOX(r`$V_B=V_0=${tx(V0)}\ \mathrm{m/s}=${vk}\ \mathrm{km/h}$`)}.`],'travail du poids nul entre deux points de même altitude','1b'),
      Q(2,r`On tient compte à présent des frottements : force de frottement solide de coefficient $\mu=${tx(mu)}$ entre la route et les roues. On étudie le mouvement de $A$ à $S$. Choisir un repère et une base, représenter-les, faire le bilan des forces et préciser leurs coordonnées.`,
        [r`Base : $\vec e_x$ le long de la côte vers le haut, $\vec e_y$ normal à la route, $\vec e_z$ complétant la base directe ; $O=A$.`,
         r`Forces : $\vec P\begin{vmatrix}-mg\sin\alpha\\-mg\cos\alpha\\0\end{vmatrix}$ ; $\vec R_N\begin{vmatrix}0\\R_N\\0\end{vmatrix}$ ; $\vec R_T\begin{vmatrix}-R_T\\0\\0\end{vmatrix}$ (le frottement s'oppose au mouvement, donc dirigé vers le bas de la côte).`],'base, 3 forces, coordonnées, schéma','2a'),
      Q(2.5,r`Justifier que la norme de la force de frottement est constante pendant la montée. Exprimer puis calculer l'accélération du véhicule. Quelle est la nature du mouvement ?`,
        [r`TRC selon $\vec e_y$ : $0=-mg\cos\alpha+R_N$, donc $R_N=mg\cos\alpha$ ; il y a glissement : $R_T=\mu R_N=\mu mg\cos\alpha$, constante puisque $m$, $g$, $\mu$ et $\alpha$ le sont.`,
         r`TRC selon $\vec e_x$ : $m\ddot x=-mg\sin\alpha-R_T$, d'où ${BOX(r`$\ddot x=-g(\sin\alpha+\mu\cos\alpha)=${tx(-a)}\ \mathrm{m/s^2}$`)}.`,
         r`L'accélération est constante et opposée à la vitesse : mouvement rectiligne uniformément décéléré.`],'R_N, Coulomb, ẍ littérale et numérique, nature du mouvement','2b'),
      Q(2,r`Déterminer l'équation horaire du véhicule et vérifier qu'il ne s'arrête pas avant d'atteindre $S$.`,
        [r`Avec $\dot x(0)=V_0$ et $x(0)=0$ : $\dot x(t)=V_0-g(\sin\alpha+\mu\cos\alpha)\,t$ et ${BOX(r`$x(t)=V_0\,t-\dfrac12g(\sin\alpha+\mu\cos\alpha)\,t^2$`)}.`,
         r`Il s'arrêterait au bout de $\dfrac{V_0^2}{2g(\sin\alpha+\mu\cos\alpha)}=${tx(dstop)}\ \mathrm{m}$, alors que la distance $AS=\dfrac{h}{\sin\alpha}=${tx(ell)}\ \mathrm{m}$ est plus courte : il atteint bien $S$.`],'x(t) avec conditions initiales, comparaison AS / distance d\u2019arrêt','2c'),
      Q(2.5,r`Déterminer la durée nécessaire pour arriver en $S$ et la vitesse $V_2$ en $S$.`,
        [r`On résout $x(t_S)=AS=\dfrac{h}{\sin\alpha}$ : $\dfrac12a\,t_S^2-V_0t_S+AS=0$ avec $a=g(\sin\alpha+\mu\cos\alpha)$. On garde la plus petite racine (premier passage en $S$) : ${BOX(r`$t_S=\dfrac{V_0-\sqrt{V_0^2-2a\,AS}}{a}=${tx(tS)}\ \mathrm{s}$`)}.`,
         r`${BOX(r`$V_2=V_0-a\,t_S=${tx(V2)}\ \mathrm{m/s}$`)}.`,
         RQ(`Vérification par le TEC : $V_2=\\sqrt{V_0^2-2gh\\,(1+\\mu/\\tan\\alpha)}=${tx(V2i)}\\ \\mathrm{m/s}$.`)],'équation du 2nd degré, choix de la racine, V_2','2d'),
      Q(1,r`$V_2$ dépend-elle de l'inclinaison $\alpha$ de la route ? Pour que $V_2$ soit maximale (sans changer l'altitude de $S$), a-t-on intérêt à ce que la pente soit plus raide ou moins raide ?`,
        [r`Par le TEC : $V_2^2=V_0^2-2gh-\dfrac{2\mu gh}{\tan\alpha}$ : oui, elle dépend de $\alpha$ par le travail du frottement $-\mu mgh/\tan\alpha$.`,
         r`Plus la pente est raide, plus $\tan\alpha$ est grand, plus le travail résistant du frottement est faible (distance parcourue plus courte) : $V_2$ est maximale pour une pente plus raide.`],'expression de V_2, interprétation','2e'),
      Q(1.5,r`On rallume le moteur pour monter la côte à la vitesse constante $V_0$. Calculer la force motrice nécessaire (dans le sens du mouvement) et la puissance du moteur.`,
        [r`Vitesse constante : $\ddot x=0$ avec une force motrice supplémentaire $F_m\vec e_x$ : $0=-mg\sin\alpha-\mu mg\cos\alpha+F_m$, donc ${BOX(r`$F_m=mg(\sin\alpha+\mu\cos\alpha)=${tx(Fm)}\ \mathrm{N}$`)}.`,
         r`Puissance : $\mathcal P=\vec F_m\cdot\vec v=F_mV_0=${BOX(r`$${tx(Pm/1000)}\ \mathrm{kW}$`)}$.`],'F_m, P = F·v, unités','2f'),
      Q(1.5,r`On étudie maintenant la descente de $S$ à $B$, moteur coupé, avec le même coefficient de frottement. Choisir une base, faire le bilan des forces avec leurs coordonnées.`,
        [r`Base : $\vec e_x'$ le long de la pente vers le bas (sens du mouvement), $\vec e_y'$ normal à la route. Forces : $\vec P\begin{vmatrix}mg\sin\beta\\-mg\cos\beta\\0\end{vmatrix}$ ; $\vec R_N\begin{vmatrix}0\\R_N\\0\end{vmatrix}$ ; $\vec R_T\begin{vmatrix}-R_T\\0\\0\end{vmatrix}$ avec $R_N=mg\cos\beta$ et $R_T=\mu mg\cos\beta$.`],'base, forces, coordonnées','3a'),
      Q(1,r`Le véhicule accélère-t-il ou ralentit-il dans la descente ?`,
        [r`TRC selon $\vec e_x'$ : ${BOX(r`$\ddot x'=g(\sin\beta-\mu\cos\beta)=${tx(ab)}\ \mathrm{m/s^2}$`)}. ${ab>0?r`Cette valeur est positive : le véhicule accélère (on a $\tan\beta>\mu$).`:r`Cette valeur est négative : le véhicule ralentit (on a $\tan\beta<\mu$ : la pente est trop faible pour compenser le frottement).`}`],'signe de ẍ, condition tan β comparé à μ','3b'),
      Q(2,r`À partir du théorème de l'énergie cinétique entre $S$ et $B$, exprimer la vitesse $V_3$ du véhicule en $B$.`,
        [r`Longueur $SB=\dfrac{h}{\sin\beta}$. Travaux : $W(\vec P)=+mgh$ ; $W(\vec R_N)=0$ ; $W(\vec R_T)=-\mu mg\cos\beta\times\dfrac{h}{\sin\beta}=-\dfrac{\mu mgh}{\tan\beta}$.`,
         r`TEC : $\dfrac12mV_3^2-\dfrac12mV_2^2=mgh-\dfrac{\mu mgh}{\tan\beta}$, d'où ${BOX(r`$V_3=\sqrt{V_2^2+2gh\left(1-\dfrac{\mu}{\tan\beta}\right)}$`)}.`],'trois travaux, TEC, expression','3c'),
      Q(1.5,r`Calculer $V_3$ et conclure en comparant avec la vitesse initiale $V_0$.`,
        [r`${BOX(r`$V_3=${tx(V3)}\ \mathrm{m/s}=${tx(V3*3.6,3)}\ \mathrm{km/h}$`)}, à comparer à $V_0=${vk}\ \mathrm{km/h}$.`,
         r`Conclusion : le véhicule arrive en $B$ nettement moins vite qu'au départ. Comme $A$ et $B$ sont à la même altitude, le poids ne contribue pas au bilan : toute la variation d'énergie cinétique $\Delta E_c=\dfrac12m(V_3^2-V_0^2)=${tx(dE/1000)}\ \mathrm{kJ}$ est due au travail résistant des frottements, $-\mu mgh\left(\dfrac1{\tan\alpha}+\dfrac1{\tan\beta}\right)$. Sans moteur, le véhicule perd de la vitesse.`],'A.N., conclusion énergétique','3d')
    ],
    rem:[`Un seul TEC « A → B » donne directement $V_3$ : $\\tfrac12m(V_3^2-V_0^2)=-\\mu mgh\\,(1/\\tan\\alpha+1/\\tan\\beta)$.`,`Dans une montée, le frottement et la composante du poids vont dans le même sens ; dans une descente ils s'opposent.`]};
  function lsol1(){return[r`Forces : le poids $\vec P$ et la réaction normale $\vec R_N$ (pas de frottement). $\vec R_N$ est perpendiculaire au déplacement : son travail est nul. Le poids travaille : $W_{A\to S}(\vec P)=-mgh$ (montée : travail résistant).`,
    r`TEC entre $A$ et $S$ : $\dfrac12mV_1^2-\dfrac12mV_0^2=-mgh$, d'où ${BOX(r`$V_1=\sqrt{V_0^2-2gh}=\sqrt{${tx(V0)}^2-2\times9{,}81\times${h}}=${tx(V1)}\ \mathrm{m/s}$`)} (avec $V_0=${vk}\ \mathrm{km/h}=${tx(V0)}\ \mathrm{m/s}$).`]}
}

/* ================= Génération d'un sujet complet ================= */
const FAM={TRC:[exFreinTRC,exProj,exIncline,exSki],TEC:[exProjTEC,exFreinTEC,exPalet,exPiste,exPendule]};
function scale(ex,target){
  const W=ex.qs.reduce((s,q)=>s+q.w,0);let tot=0,imax=0;
  ex.qs.forEach((q,i)=>{q.p=Math.max(.5,Math.round(q.w/W*target*2)/2);tot+=q.p;if(q.w>ex.qs[imax].w)imax=i});
  ex.qs[imax].p+=target-tot;ex.pts=target;
}
function build(seed,fmt,focus){
  const g=rng(seed);
  let f=fmt==='auto'?g.pick(['2','3']):fmt,fns,targets,mins;
  if(f==='long'){fns=[exLong];targets=[20];mins=[55];}
  else{
    const pickN=(fam,n)=>g.shuffle(FAM[fam]).slice(0,n);
    const main=focus==='trc'?pickN('TRC',2):focus==='tec'?pickN('TEC',2):[pickN('TRC',1)[0],pickN('TEC',1)[0]];
    if(f==='3'){fns=[exBond,...main];targets=[4,8,8];mins=[10,25,25];}else{fns=main;targets=[10,10];mins=[30,30];}
  }
  const exs=fns.map((fn,i)=>{const e=fn(g);scale(e,targets[i]);e.min=mins[i];return e});
  return{seed,fmt:f,focus,exs};
}

const ROM=['I','II','III','IV'];
const pt=x=>nf(x,3)+(x>1?' pts':' pt');
const para=s=>s.startsWith('<p')?s:`<p>${s}</p>`;
const HEAD=(t)=>`<div class="hd"><span><b>INSA Centre Val de Loire</b> · STPI 1A · UE Sciences appliquées et industrielles 1</span><span>Mécanique du point</span></div>${t}`;

function renderSujet(S){
  const n=S.exs.length;
  return `<div class="paper sujet">${HEAD(`<h2 class="pt">Devoir surveillé n° 1 · sujet blanc n° ${S.seed}</h2>
  <p class="meta">Durée : 1 h · Barème sur 20 points · ${n===1?'un seul problème':n+' exercices indépendants'} · Sujet d'entraînement non officiel</p>
  <ul class="cons"><li>Les schémas, les bases choisies et les bilans de forces sont à faire sur la copie et sont notés.</li><li>Les résultats sont d'abord donnés sous forme littérale, puis avec l'application numérique, encadrés et avec leur unité.</li><li>Le barème est donné à titre indicatif. $g=9{,}81\\ \\mathrm{m/s^2}$.</li></ul>`)}
  ${S.exs.map((e,i)=>`<section class="exo"><h3>${n===1?'Problème':'Exercice '+ROM[i]} : ${e.title} <span class="ptt">(${pt(e.pts)} · environ ${e.min} min)</span></h3>
    <div class="st">${e.intro}</div>${e.fig?`<div class="figw">${e.fig}</div>`:''}
    <div class="ql">${e.qs.map((q,k)=>`<div class="qi"><b>${q.lab||(k+1)}${q.lab?')':')'}</b> <span>${q.q}</span> <span class="qp">(${pt(q.p)})</span></div>`).join('')}</div></section>`).join('')}
  <p class="fin">Fin du sujet</p></div>`;
}
function renderCorr(S){
  const n=S.exs.length;
  return `<div class="paper corr" hidden>${HEAD(`<h2 class="pt">Correction du sujet blanc n° ${S.seed}</h2>
  <p class="meta noprint">Coche les questions pour lesquelles tu aurais eu tous les points : ta note estimée /20 : <b id="note">0</b></p>`)}
  ${S.exs.map((e,i)=>`<section class="exo cx"><h3 class="red">Correction de ${n===1?'l\u2019exercice long':'l\u2019exercice '+ROM[i]} : ${e.title}</h3>
    ${e.fig?`<div class="figw">${e.fig}</div>`:''}
    ${e.qs.map((q,k)=>`<div class="cq"><div class="cqh"><b>${q.lab||(k+1)}${')'}</b><span class="bar">Barème : ${pt(q.p)}. À valoriser : ${q.bar}.</span><label class="noprint chk"><input type="checkbox" data-p="${q.p}"> acquis</label></div>${q.sol.map(para).join('')}</div>`).join('')}
    ${e.rem.map(x=>`<p class="rq">${x}</p>`).join('')}</section>`).join('')}
  <div class="recap"><b>Récapitulatif du barème</b> : ${S.exs.map((e,i)=>`${n===1?'problème':'exercice '+ROM[i]} ${pt(e.pts)}`).join(' · ')} · total ${pt(20)}.</div></div>`;
}

/* ================= Cours ================= */
const COURS=[
['bond','1. Bases, repères et calcul vectoriel',[
r`<p><b>Base orthonormée</b> : trois vecteurs unitaires, orthogonaux deux à deux, notée $\mathcal B(\vec e_x,\vec e_y,\vec e_z)$. Elle est <b>directe</b> (B.O.N.D.) si elle respecte la règle du tire-bouchon ou de la main droite : on visse de $\vec e_x$ vers $\vec e_y$ et $\vec e_z$ pointe vers la pointe du tire-bouchon.</p>`,
r`<p>Test algébrique : $\vec e_x\wedge\vec e_y=\vec e_z$, $\vec e_y\wedge\vec e_z=\vec e_x$, $\vec e_z\wedge\vec e_x=\vec e_y$ (permutation circulaire) ; en sens inverse le signe change. Une base $(\vec u_1,\vec u_2,\vec u_3)$ est directe si $\vec u_1\wedge\vec u_2=\vec u_3$.</p>`,
r`<p><b>Représentation dans le plan</b> : on dessine deux vecteurs de la base dans le plan de la feuille ; le troisième est représenté par $\odot$ s'il pointe vers nous, par $\otimes$ s'il rentre vers le fond.</p>`,
r`<p><b>Repère</b> $\mathcal R(O,\vec e_x,\vec e_y,\vec e_z)$ = base + origine. Position : $\overrightarrow{OM}=x\,\vec e_x+y\,\vec e_y+z\,\vec e_z$. Pour $A(x_A,y_A,z_A)$ et $B(x_B,y_B,z_B)$ : $\overrightarrow{AB}=(x_B-x_A)\,\vec e_x+(y_B-y_A)\,\vec e_y+(z_B-z_A)\,\vec e_z$.</p>`,
r`<p><b>Norme et produit scalaire</b> : $\|\vec u\|=\sqrt{u_x^2+u_y^2+u_z^2}$ ; $\vec u\cdot\vec v=u_xv_x+u_yv_y+u_zv_z=\|\vec u\|\,\|\vec v\|\cos\varphi$. Deux vecteurs orthogonaux ont un produit scalaire nul ; $\vec e_i\cdot\vec e_j=\delta_{ij}$.</p>`,
r`<p><b>Coordonnées d'un vecteur de norme $F$</b> faisant l'angle $\theta$ avec $\vec e_x$ dans le plan $(\vec e_x,\vec e_y)$ : $\vec F\begin{vmatrix}F\cos\theta\\F\sin\theta\\0\end{vmatrix}$. Le cosinus va avec l'angle mesuré par rapport à l'axe considéré.</p>`,
`<p class="rq">Attention : un vecteur s'écrit toujours avec une flèche ; en colonne, les vecteurs de la base n'apparaissent pas ; un produit scalaire est un nombre ; une norme est positive ou nulle.</p>`]],
['cine','2. Cinématique : position, vitesse, accélération',[
r`<p>Dans un repère cartésien fixe du référentiel $\mathfrak R$, les vecteurs de base sont constants. Pour un point mobile $M$ :</p>
$$\overrightarrow{OM}=x\,\vec e_x+y\,\vec e_y+z\,\vec e_z,\qquad \vec v=\frac{d\overrightarrow{OM}}{dt}=\dot x\,\vec e_x+\dot y\,\vec e_y+\dot z\,\vec e_z,\qquad \vec a=\frac{d\vec v}{dt}=\ddot x\,\vec e_x+\ddot y\,\vec e_y+\ddot z\,\vec e_z$$`,
r`<p>La notation $\dot x$ est réservée à la dérivée par rapport au temps. <b>Savoir simplifier</b> : mouvement rectiligne selon $\vec e_x$ : $\overrightarrow{OM}=x\vec e_x$, $\vec v=\dot x\vec e_x$, $\vec a=\ddot x\vec e_x$. Mouvement <i>uniforme</i> : la norme de $\vec v$ est constante (ce n'est pas forcément $\vec a=\vec 0$ si la trajectoire n'est pas une droite).</p>`,
r`<p><b>Intégrer les équations du mouvement</b> : deux méthodes équivalentes. (1) Primitive + constante déterminée par les conditions initiales. (2) Intégrale : $v_x(t)=v_{x,0}+\int_{t_0}^{t}a_x(t')\,dt'$, qui donne directement « la bonne » solution.</p>`,
r`<p>Accélération constante : $v(t)=v_0+at$ ; $x(t)=x_0+v_0t+\tfrac12at^2$ ; et sans le temps : $v^2-v_0^2=2a\,(x-x_0)$.</p>`]],
['newton','3. Les lois de Newton',[
r`<p><b>1<sup>re</sup> loi (inertie)</b> : dans un référentiel galiléen $\mathfrak R_g$, un point isolé est au repos ou en mouvement rectiligne uniforme ($\vec v=$ cste, $\vec a=\vec 0$).</p>`,
r`<p><b>2<sup>e</sup> loi (TRC, théorème de la résultante cinétique)</b> : avec $\vec p=m\vec v$, $\ \dfrac{d\vec p}{dt}=\sum\vec F_{ext}$. Pour une masse constante :</p>$$m\,\vec a=\sum_i\vec F_i$$<p>C'est une équation <b>vectorielle</b> : on la projette sur les axes de la base pour obtenir 1 à 3 équations scalaires. Si $M$ est immobile : première loi de la statique $\sum\vec F=\vec 0$.</p>`,
r`<p><b>3<sup>e</sup> loi (action-réaction)</b> : $\vec F_{1\to2}=-\vec F_{2\to1}$, même droite d'action.</p>`]],
['forces','4. Forces usuelles',[
`<div class="tbl"><table><thead><tr><th>Force</th><th>Direction, sens</th><th>Norme</th><th>Expression</th></tr></thead><tbody>
<tr><td>Poids</td><td>verticale, vers le bas</td><td>$mg$</td><td>$\\vec P=m\\vec g$ (avec $\\vec e_z$ ascendant : $-mg\\,\\vec e_z$)</td></tr>
<tr><td>Tension d'un fil</td><td>celle du fil, du point d'attache vers l'autre extrémité</td><td>$T$ <b>inconnue</b>, varie si $M$ bouge</td><td>$\\vec T=T\\,\\vec e$</td></tr>
<tr><td>Poussée d'Archimède</td><td>verticale, vers le haut</td><td>$\\rho_F V g$</td><td>$\\vec\\Pi_a=-\\rho_F V\\vec g$ (coule si $\\Pi_a<P$, flotte si $\\Pi_a>P$)</td></tr>
<tr><td>Frottement fluide linéaire</td><td>opposé à la vitesse</td><td>$\\alpha v$ ($\\alpha$ en kg/s)</td><td>$\\vec F=-\\alpha\\,\\vec v$</td></tr>
<tr><td>Réaction d'un support</td><td>$\\vec R=\\vec R_N+\\vec R_T$</td><td>inconnues</td><td>support lisse : $\\vec R=\\vec R_N$ (normale)</td></tr></tbody></table></div>`,
`<p class="rq">À retenir : toutes les forces s'appliquent en $M$ (point matériel). La réaction normale n'est jamais nulle pendant un contact et sa norme se trouve en projetant le TRC sur la normale au support.</p>`]],
['coulomb','5. Frottement solide : loi de Coulomb',[
r`<p>Sur un support rugueux, la réaction est la somme d'une composante normale $\vec R_N$ et d'une composante tangentielle $\vec R_T$ (frottement solide) qui <b>s'oppose au glissement</b> ou à sa tentative.</p>`,
`<div class="tbl"><table><thead><tr><th>Situation</th><th>Loi de Coulomb</th><th>Angle de la réaction</th></tr></thead><tbody>
<tr><td>Sans glissement (immobile, ou roulement parfait)</td><td>$\\|\\vec R_T\\|<\\mu_0\\|\\vec R_N\\|$ (inégalité, $R_T$ se calcule par la statique)</td><td>$\\tan\\varphi<\\mu_0$</td></tr>
<tr><td>Avec glissement</td><td>$\\|\\vec R_T\\|=\\mu\\|\\vec R_N\\|$ (égalité)</td><td>$\\tan\\varphi=\\mu$</td></tr></tbody></table></div>`,
r`<p>En pratique $\mu\approx\mu_0$. <b>Plan incliné d'angle $\alpha$</b> : la caisse commence à glisser pour $\tan\alpha>\mu$, et en glissant $\ddot x=g(\sin\alpha-\mu\cos\alpha)$ (la masse disparaît).</p>`,
`<p class="rq">Piège : ne pas écrire $R_T=\\mu R_N$ quand il n'y a pas glissement (voiture qui roule, caisse immobile). Dans ce cas on utilise la statique ou une force donnée.</p>`]],
['methode','6. Méthode de résolution d\'un problème de dynamique',[
`<ol class="steps"><li><b>Modéliser</b> : référentiel galiléen ; choisir la base la plus adaptée (un vecteur colinéaire à la trajectoire, base inclinée sur une pente) et la <i>dessiner</i> ; bilan des forces ; analyser les conditions du mouvement (contact avec un support : pas de mouvement selon la normale).</li>
<li><b>Mettre en équations</b> : écrire $\\overrightarrow{OM}$, $\\vec v$, $\\vec a$ simplifiés ; écrire le TRC <i>sous forme vectorielle</i>, puis le projeter.</li>
<li><b>Résoudre</b> : intégrer avec les conditions initiales sur la position et la vitesse pour obtenir les équations horaires ; répondre aux questions.</li>
<li><b>Vérifier</b> : unités, signes, ordre de grandeur, cas limites (ex. $\\mu=0$).</li></ol>`,
r`<p>Un problème est résolu quand le mouvement de $M$ est entièrement déterminé et qu'il ne reste plus de force inconnue.</p>`,
r`<p><b>Exemple de référence (glissement sur un plan incliné)</b> : $\vec P=mg\sin\alpha\,\vec e_x-mg\cos\alpha\,\vec e_y$ ; $\vec R_N=R_N\vec e_y$ ; $\vec R_T=-R_T\vec e_x$. TRC selon $\vec e_y$ : $R_N=mg\cos\alpha$ ; Coulomb : $R_T=\mu R_N$ ; TRC selon $\vec e_x$ : $m\ddot x=mg\sin\alpha-\mu mg\cos\alpha$.</p>`]],
['travail','7. Travail et puissance d\'une force constante',[
r`<p>$W_{A\to B}(\vec F)=\vec F\cdot\overrightarrow{AB}$ (en joules, J). Si la force est constante, le travail ne dépend que des positions $A$ et $B$, pas du chemin. Il est associatif : $W(\vec F_1+\vec F_2)=W(\vec F_1)+W(\vec F_2)$.</p>`,
r`<p><b>Puissance</b> : $\mathcal P(\vec F)=\dfrac{\delta W}{dt}=\vec F\cdot\vec v$ (en watts). $\mathcal P>0$ : force motrice ; $\mathcal P<0$ : force résistante ; $\mathcal P=0$ : la force ne modifie pas l'énergie du mobile.</p>`,
`<div class="tbl"><table><thead><tr><th>Force</th><th>Travail entre $A$ et $B$</th></tr></thead><tbody>
<tr><td>Poids</td><td>$W=-mg\\,(z_B-z_A)$ avec $z$ ascendant : $+mgh$ en descente, $-mgh$ en montée</td></tr>
<tr><td>Réaction normale</td><td>$0$ (perpendiculaire au déplacement)</td></tr>
<tr><td>Frottement solide constant</td><td>$-f\\times$ longueur parcourue, <b>toujours négatif</b></td></tr>
<tr><td>Tension d'un fil (trajectoire circulaire)</td><td>$0$ (perpendiculaire à la vitesse)</td></tr></tbody></table></div>`]],
['tec','8. Énergie cinétique, TEC et TPC',[
r`<p>$E_c=\dfrac12mv^2$ (en J). Mouvement rectiligne : $E_c=\dfrac12m\dot x^2$ ; quelconque : $E_c=\dfrac12m(\dot x^2+\dot y^2+\dot z^2)$. Elle dépend du référentiel.</p>`,
r`<p><b>TEC</b> (théorème de l'énergie cinétique, référentiel galiléen) : $\ E_c(B)-E_c(A)=\sum W_{A\to B}(\vec F_{ext})$.</p><p><b>TPC</b> (théorème de la puissance cinétique) : $\ \dfrac{dE_c}{dt}=\sum\mathcal P(\vec F_{ext})$.</p>`,
r`<p><b>Méthode TEC</b> : (1) bilan des forces ; (2) travail de chacune entre $A$ et $B$ (normales : 0) ; (3) $\tfrac12mv_B^2-\tfrac12mv_A^2=\sum W$ ; (4) isoler $v_B$. Les masses se simplifient souvent (poids, frottement $\propto m$).</p>`,
r`<p><b>Pendule simple</b> (angle $\theta$ par rapport à la verticale descendante, sans frottement) : $v^2=2gL(\cos\theta-\cos\theta_0)$ pour un lâcher sans vitesse en $\theta_0$ ; le TPC donne $\ddot\theta+\dfrac{g}{L}\sin\theta=0$.</p>`]],
['choix','9. TRC ou TEC ? Les 10 exercices en une ligne',[
`<div class="tbl"><table><thead><tr><th>On cherche…</th><th>Outil</th><th>Pourquoi</th></tr></thead><tbody>
<tr><td>accélération, $x(t)$, durée, forces inconnues ($R_N$, $T$), trajectoire</td><td><b>TRC</b> + intégration</td><td>il contient le temps et les directions</td></tr>
<tr><td>vitesse en fonction de la position, hauteur atteinte, distance d'arrêt</td><td><b>TEC</b></td><td>pas de projection, pas d'intégration, réactions normales absentes</td></tr>
<tr><td>norme <i>et</i> direction de la vitesse en un point (ex. sommet d'un tir oblique)</td><td>TRC pour la direction, puis TEC</td><td>le TEC ne donne que la norme</td></tr></tbody></table></div>`,
`<div class="tbl"><table><thead><tr><th>Exo</th><th>Thème</th><th>Résultat clé à savoir retrouver</th></tr></thead><tbody>
<tr><td><a href="#ex1">I</a></td><td>B.O.N.D.</td><td>règle du tire-bouchon, $\\vec e_i\\cdot\\vec e_j$, $\\vec u_1\\wedge\\vec u_2=\\vec u_3$</td></tr>
<tr><td><a href="#ex2">II</a></td><td>Freinage (TRC)</td><td>$\\tau=\\dfrac{mv_0}{F}$, $L=\\dfrac{mv_0^2}{2F}$</td></tr>
<tr><td><a href="#ex3">III</a></td><td>Ballon (TRC)</td><td>$z=x\\tan\\alpha-\\dfrac{gx^2}{2v_0^2\\cos^2\\alpha}$, puis $v_0$ pour passer par $B$</td></tr>
<tr><td><a href="#ex4">IV</a></td><td>Plan incliné, Coulomb</td><td>$a=g(\\sin\\alpha-\\mu\\cos\\alpha)$, $\\tan\\alpha_c=\\mu$</td></tr>
<tr><td><a href="#ex5">V</a></td><td>Skieur, téléski</td><td>$T=\\dfrac{mg(\\sin\\alpha+\\mu\\cos\\alpha)}{\\cos\\beta+\\mu\\sin\\beta}$ à vitesse constante</td></tr>
<tr><td><a href="#ex6">VI</a></td><td>Projectile (TEC)</td><td>$v=\\sqrt{V_0^2+2gh}$ quelle que soit la direction ; limite du TEC</td></tr>
<tr><td><a href="#ex7">VII</a></td><td>Freinage (TEC)</td><td>$L_{min}=\\dfrac{v_0^2}{2\\mu g}$, indépendante de $m$</td></tr>
<tr><td><a href="#ex8">VIII</a></td><td>Palet sur un plan</td><td>$v_0=\\sqrt{2g(h+\\mu d)}$</td></tr>
<tr><td><a href="#ex9">IX</a></td><td>Piste et ressort</td><td>un TEC par tronçon ; $h=r-2\\mu L$</td></tr>
<tr><td><a href="#ex10">X</a></td><td>Pendule</td><td>$v=\\sqrt{2gL(\\cos\\theta-\\cos\\theta_0)}$, $\\ddot\\theta+\\dfrac{g}{L}\\sin\\theta=0$</td></tr></tbody></table></div>`]]
];

/* ================= Conseils ================= */
const TIPS=[
['Avant le DS',[
`Refais <b>les 10 exercices sans regarder la correction</b>, puis compare. Une fois refaits à chaud, ils deviennent des réflexes. Utilise les énoncés générés de l'onglet Exercices : nouvelles valeurs, même méthode.`,
`Apprends à retrouver, pas à réciter : $\\tau=\\dfrac{mv_0}{F}$ ou $a=g(\\sin\\alpha-\\mu\\cos\\alpha)$ se redémontrent en 1 minute avec le TRC.`,
`Fais au moins <b>un sujet blanc en conditions réelles</b> : 1 h chrono, calculatrice, brouillon, sans le cours.`,
`Prépare ta calculatrice : mode <b>degrés</b>, fonctions $\\arctan$, $\\sqrt{\\ }$, puissances. Un DS perd souvent des points à cause d'un mode radians.`]],
['Gérer l\'heure',[
`<b>3 minutes</b> pour lire tout le sujet. Commence par l'exercice où tu te sens le plus sûr : les points rassurants d'abord.`,
`Environ 1 minute par point : un exercice à 10 points mérite 25 à 30 minutes. Si tu bloques plus de 5 minutes sur une question, passe à la suivante en laissant de la place.`,
`Garde <b>5 minutes</b> de relecture à la fin : signes, unités, encadrer les résultats.`,
`Les questions s'enchaînent souvent : un résultat littéral faux se paie sur les A.N. suivantes. Si tu es coincé, <b>invente une notation</b> pour le résultat manquant et poursuis.`]],
['Les points « gratuits »',[
`<b>Le schéma et la base.</b> Dessine toujours la base $(\\vec e_x,\\vec e_y,\\vec e_z)$ sur le schéma, avec $\\vec e_z$ en $\\odot$ ou $\\otimes$ pour qu'elle soit directe.`,
`<b>Le bilan des forces</b> avec leurs coordonnées dans ta base, même si la suite te bloque. Pense à toutes les forces : poids, réaction normale, frottement, tension.`,
`<b>L'énoncé du théorème</b> : écris « TRC (ou TEC) appliqué à $M$ dans le référentiel galiléen », puis l'équation vectorielle <i>avant</i> de la projeter.`,
`<b>Les conditions initiales</b> écrites explicitement : $x(0)=\\dots$, $\\dot x(0)=\\dots$.`,
`<b>Les remarques</b> demandées : rôle de la masse, variation avec $v_0$, interprétation d'un signe.`]],
['Rédaction qui rapporte',[
`Écris le TRC vectoriel, <b>puis</b> les projections ligne par ligne : « selon $\\vec e_x$ : … ; selon $\\vec e_y$ : … ».`,
`Justifie les simplifications : « la voiture reste sur la route donc $\\dot y=\\ddot y=0$ ».`,
`Résultat <b>littéral d'abord</b>, application numérique ensuite, avec l'unité, <b>encadré</b>.`,
`Utilise des mots-clés : « il y a glissement donc $R_T=\\mu R_N$ », « la réaction normale ne travaille pas », « le travail du poids ne dépend que de la différence d'altitude ».`,
`Pour une racine d'équation du 2<sup>e</sup> degré, <b>justifie ton choix</b> (temps positif, phase montante ou descendante).`]],
['Les pièges classiques',[
`<b>Conversions</b> : km/h → m/s (÷ 3,6), g → kg, cm → m. Une vitesse de 90 donne $L=\\dots$ en <i>mètres</i> seulement si $v$ est en m/s.`,
`<b>Signes</b> : poids positif en descente, négatif en montée ; frottement toujours négatif ; frottement orienté <i>contre</i> le mouvement (vers le bas de la pente quand on monte).`,
`<b>Réaction normale</b> : $R_N=mg\\cos\\alpha$ sur un plan incliné <i>sans autre force</i>, mais $R_N=mg\\cos\\alpha-T\\sin\\beta$ avec une traction. Toujours la projeter.`,
`<b>Coulomb</b> : égalité $R_T=\\mu R_N$ avec glissement ; inégalité sans glissement.`,
`<b>TEC</b> : ne donne que la norme de la vitesse. Pour une composante ou une durée, il faut le TRC.`,
`<b>Cos et sin</b> d'un angle : par rapport à quel axe est-il mesuré ? (ex. $\\theta$ par rapport à la <i>verticale</i> échange $\\sin$ et $\\cos$).`,
`Ne pas oublier que le travail du poids vaut $\\pm mgh$ quelle que soit la trajectoire.`]],
['Avant de rendre la copie',[
`<b>Unités</b> cohérentes sur chaque résultat ; homogénéité des formules littérales (une distance en m, une vitesse en m/s).`,
`<b>Ordre de grandeur</b> : un ballon à 27 km/h, une voiture qui freine en 30 m à 50 km/h, une caisse à 1 m/s² : plausible ?`,
`<b>Cas limite</b> : $\\mu=0$ doit redonner le cas sans frottement ; $\\alpha=0$ doit redonner le plan horizontal.`,
`<b>Signe</b> : une décélération doit être négative dans la base choisie ; une durée ou une norme positive.`,
`Chaque question a-t-elle une réponse encadrée ? Les schémas sont-ils tous faits ?`]]
];

/* ================= Pages ================= */
const D=()=>window.DS1;
function pageCours(){
  D().show(`<section class="wrap">
    <h1>Cours de mécanique du point</h1>
    <p class="lead">Résumé des chapitres utiles pour le DS1 (parties 1 et 2 du poly : fondamentaux, travail et énergie cinétique). Notations du poly : TRC, B.O.N.D., $\\mathfrak R_g$. Coordonnées cylindriques, moment cinétique et énergie potentielle viennent après le DS1.</p>
    <div class="chips toc noprint">${COURS.map(c=>`<button class="tag" data-x="go" data-id="c-${c[0]}">${c[1].replace(/^\d+\.\s*/,'')}</button>`).join('')}</div>
    ${COURS.map(c=>`<div class="card cours" id="c-${c[0]}"><h3>${c[1]}</h3>${c[2].join('')}</div>`).join('')}
    <div class="ctas"><a class="btn-primary" href="#sujets">Faire un sujet blanc</a><a class="btn-ghost" href="#conseils">Conseils pour gagner des points</a><a class="btn-ghost" href="#formules">Aide-mémoire</a></div>
  </section>`);
}
function pageTips(){
  D().show(`<section class="wrap">
    <h1>Conseils pour gagner des points</h1>
    <p class="lead">Méthode et réflexes pour le DS1 (1 h, 1 à 3 exercices). Ces conseils s'appuient sur la façon dont les corrections du poly sont rédigées : schéma, base, bilan des forces, théorème, projection, intégration, résultat encadré.</p>
    <div class="grid2" style="margin-top:28px">${TIPS.map(t=>`<div class="card tipc"><h3>${t[0]}</h3><ul>${t[1].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
    <h2>Plan type pour 1 heure</h2>
    <div class="card tbl"><table><thead><tr><th>Minutes</th><th>Action</th></tr></thead><tbody>
      <tr><td>0 – 3</td><td>Lire tout le sujet, repérer les questions faciles, noter les unités à convertir</td></tr>
      <tr><td>3 – 30</td><td>Premier exercice (le plus sûr) : schéma, base, bilan, théorème, projections, résultats encadrés</td></tr>
      <tr><td>30 – 55</td><td>Deuxième exercice (ou troisième : écrire au moins schéma, bilan et théorème)</td></tr>
      <tr><td>55 – 60</td><td>Relecture : signes, unités, A.N. en degrés, résultats encadrés</td></tr></tbody></table></div>
    <div class="ctas"><a class="btn-primary" href="#sujets">Tester sur un sujet blanc</a><a class="btn-ghost" href="#cours">Revoir le cours</a></div>
  </section>`);
}

let ST={seed:null,fmt:'auto',focus:'mixte',corr:false};
function newSeed(){return 1000+Math.floor(Math.random()*9000)}
function pageSujets(){
  if(ST.seed===null)ST.seed=newSeed();
  const S=build(ST.seed,ST.fmt,ST.focus);
  D().show(`<section class="wrap">
    <div class="noprint">
    <h1>Générateur de sujets blancs</h1>
    <p class="lead">Un sujet d'1 h sur le modèle du DS1 (exercices I à X), noté sur 20, avec une correction rédigée comme dans les corrigés du poly. Le numéro du sujet permet de le régénérer à l'identique : donne-le à un ami pour comparer vos copies.</p>
    <div class="card gen">
      <label>Format<select id="g-fmt"><option value="auto">Surprise (2 ou 3 exercices)</option><option value="2">2 exercices (≈ 30 min chacun)</option><option value="3">3 exercices (1 court + 2 moyens)</option><option value="long">1 problème long (type annale)</option></select></label>
      <label>Thème<select id="g-focus"><option value="mixte">Mixte TRC + TEC</option><option value="trc">TRC uniquement (I à V)</option><option value="tec">TEC uniquement (VI à X)</option></select></label>
      <label>N° du sujet<input id="g-seed" inputmode="numeric" value="${ST.seed}"></label>
      <div class="ctas" style="margin-top:0"><button class="btn-primary sm" data-x="gen">Générer</button><button class="btn-ghost sm" data-x="rand">Nouveau sujet au hasard</button></div>
    </div>
    <div class="ctas"><button class="btn-primary sm" data-x="print-s">Imprimer le sujet (PDF)</button><button class="btn-primary sm" data-x="print-c">Imprimer la correction (PDF)</button><button class="btn-ghost sm" data-x="print-a">Sujet + correction (PDF)</button><button class="btn-ghost sm" data-x="tog">${ST.corr?'Masquer':'Afficher'} la correction</button></div>
    <p class="note">Pour obtenir un PDF : clique sur un bouton « Imprimer », puis choisis « Enregistrer au format PDF » comme imprimante (A4, marges par défaut, graphiques d'arrière-plan activés pour les cadres colorés de la correction).</p>
    </div>
    ${renderSujet(S)}${renderCorr(S)}
  </section>`);
  D().app.querySelector('#g-fmt').value=ST.fmt;D().app.querySelector('#g-focus').value=ST.focus;
  const c=D().app.querySelector('.corr');c.hidden=!ST.corr;
}
function gradeSum(){
  const a=D().app,n=a.querySelector('#note');if(!n)return;
  n.textContent=nf([...a.querySelectorAll('.corr input[type=checkbox]:checked')].reduce((s,x)=>s+parseFloat(x.dataset.p),0),4);
}
function doPrint(mode){
  const b=document.body,cl={s:'ps',c:'pc',a:'pa'}[mode];
  b.classList.add(cl);
  const un=()=>{b.classList.remove('ps','pc','pa');window.removeEventListener('afterprint',un)};
  window.addEventListener('afterprint',un);
  setTimeout(()=>window.print(),60);
}
function onClick(ev){
  const b=ev.target.closest('[data-x]');if(!b)return;
  const x=b.dataset.x,a=D().app;
  if(x==='go'){const el=document.getElementById(b.dataset.id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(x==='gen'||x==='rand'){
    ST.fmt=a.querySelector('#g-fmt').value;ST.focus=a.querySelector('#g-focus').value;
    const v=parseInt(a.querySelector('#g-seed').value,10);
    ST.seed=(x==='gen'&&v>0)?v:newSeed();pageSujets();window.scrollTo(0,0);return}
  if(x==='tog'){ST.corr=!ST.corr;const c=a.querySelector('.corr');c.hidden=!ST.corr;b.textContent=(ST.corr?'Masquer':'Afficher')+' la correction';return}
  if(x.startsWith('print-'))doPrint(x.slice(6));
}
function install(){
  const a=D().app;
  a.addEventListener('click',onClick);
  a.addEventListener('change',e=>{if(e.target.matches('.corr input[type=checkbox]'))gradeSum()});
}
window.DS1X={cours:pageCours,conseils:pageTips,sujets:pageSujets,install,build,renderSujet,renderCorr,_ex:{exBond,exFreinTRC,exProj,exIncline,exSki,exProjTEC,exFreinTEC,exPalet,exPiste,exPendule,exLong}};
})();
