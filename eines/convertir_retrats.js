/**
 * Converteix els retrats de art/retrats/<nom>_retrat.jpg a WebP transparent retallat (max. 340 px) a assets/retrats/<clau>.webp.
 *   node eines/convertir_retrats.js     (cal tenir "sharp" instal·lat)
 * La taula MAPA diu a quina clau del joc correspon cada fitxer.
 */
const fs=require('fs'),vm=require('vm');
const sharp=require('sharp');
const A=require('path').join(__dirname,'..');
const font=fs.readFileSync(A+'/js/assets.js','utf8');
const ctx={};
vm.runInNewContext(font.slice(font.indexOf('function treureFonsBlanc'),font.indexOf('// ---------- Dibuixos provisionals'))+'; this.f = treureFonsBlanc;',ctx);
// fitxer (sense _retrat.jpg) -> clau del sprite
const MAPA={charm:'monja_charm',eva:'eva',frederic:'frederic',garf:'garf',germaandreu:'germa_andreu',germafrancesc:'germa_francesc',ineu:'ineu',isidre:'isidre',jaumeta:'jaumeta',josep:'josep',nena_trenes:'nena_trenes',pains:'monja_pains',parealcui:'pare_alcui',paredaniel:'pare_daniel',parejordi:'pare_jordi',pastor_a:'pastor_a',pastor_b:'pastor_b',pastor_vell:'pastor_vell',phili:'monja_phili',pianista:'pianista',siscu:'ciscu',juli:'juli',tiller:'tiller',carry:'carry',venerables:'venerables',pastor_boira:'pastor_boira'};
(async()=>{
 for(const [f,k] of Object.entries(MAPA)){
  const src=A+'/art/retrats/'+f+'_retrat.jpg';
  const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  ctx.f(data,info.width,info.height);
  const fil=new Array(info.height).fill(0),col=new Array(info.width).fill(0);
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>128){fil[y]++;col[x]++;}
  const f0=a=>a.findIndex(v=>v>4), f1=a=>a.length-1-[...a].reverse().findIndex(v=>v>4);
  const x0=f0(col),x1=f1(col),y0=f0(fil),y1=f1(fil);
  const w=x1-x0+1,h=y1-y0+1,k2=340/Math.max(w,h);
  const r=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).extract({left:x0,top:y0,width:w,height:h}).resize({width:Math.round(w*k2),height:Math.round(h*k2),kernel:'lanczos3'}).webp({quality:88,alphaQuality:100,effort:6}).toFile(A+`/assets/retrats/${k}.webp`);
  console.log(k.padEnd(14),`${w}x${h} -> ${r.width}x${r.height}`,r.size);
 }
})();
