/**
 * Converteix els retrats de art/retrats/<nom>_retrat.jpg a WebP transparent retallat (max. 340 px) a assets/retrats/<clau>.webp.
 *   node eines/convertir_retrats.js [fitxer ...]    (cal tenir "sharp" instal·lat; amb noms, només converteix aquells)
 * La taula MAPA diu a quina clau del joc correspon cada fitxer.
 */
const fs=require('fs'),vm=require('vm');
const sharp=require('sharp');
const A=require('path').join(__dirname,'..');
const font=fs.readFileSync(A+'/js/assets.js','utf8');
const ctx={};
vm.runInNewContext(font.slice(font.indexOf('function treureFonsBlanc'),font.indexOf('// ---------- Dibuixos provisionals'))+'; this.f = treureFonsBlanc;',ctx);
// fitxer (sense _retrat.jpg) -> clau del sprite
const MAPA={ocellaire:'ocellaire',ocellaire_derrotat:'ocellaire_derrotat',carmelia:'carmelia',eve:'eve',senyor_budo:'senyor_budo',pomers:'pomers',galf:'galf',germaaldreu:'germa_aldreu',germafranci:'germa_franci',ineu:'ineu',isilder:'isilder',joaneta:'joaneta',jusef:'jusef',nena_trenes:'nena_trenes',dolora:'dolora',parealcovi:'pare_alcovi',paredaimiel:'pare_daimiel',parejorda:'pare_jorda',pastor_a:'pastor_a',pastor_b:'pastor_b',pastor_vell:'pastor_vell',pilaria:'pilaria',pianista:'pianista',iscu:'iscu',julius:'julius',tiller:'tiller',carry:'carry',venerables:'venerables',pastor_boira:'pastor_boira',follet_carro:'follet_carro',nen_uri:'nen_uri',nen_flam:'nen_flam',nen_sardin:'nen_sardin',ocellaire:'ocellaire',home_raim:'home_raim',rosansa:'rosansa',meus:'meus',molner:'molner',ombra:'ombra_monjo',mandu:'mandu',mandu_trencada:'mandu_trencada'};
// Retrats amb la roba blanca oberta pel cantó de baix (camisa blanca de ratlles blaves del Pomers): el fons blanc s'hi colava entre les ratlles i la camisa quedava transparent.
// Es fa un «tancament» (dilatar i erosionar) de la màscara per sota de la fila y0, i els forats recuperen el color original (blanc).
function tancaRoba(data, w, h, y0, r) {
  const M = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) M[p] = data[p * 4 + 3] > 128 ? 1 : 0;
  const integral = m => { const I = new Uint32Array((w + 1) * (h + 1)); for (let y = 0; y < h; y++) { let f = 0; for (let x = 0; x < w; x++) { f += m[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + f; } } return I; };
  const suma = (I, x0, y0_, x1, y1) => { x0 = Math.max(0, x0); y0_ = Math.max(0, y0_); x1 = Math.min(w, x1); y1 = Math.min(h, y1); return I[y1 * (w + 1) + x1] - I[y0_ * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0_ * (w + 1) + x0]; };
  const D = new Uint8Array(w * h), I1 = integral(M);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) D[y * w + x] = suma(I1, x - r, y - r, x + r + 1, y + r + 1) > 0 ? 1 : 0;
  const I2 = integral(D), tot = (2 * r + 1) * (2 * r + 1);
  for (let y = y0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x;
    if (!M[p] && suma(I2, x - r, y - r, x + r + 1, y + r + 1) === tot) data[p * 4 + 3] = 255;
  }
}
const POST = { pomers: d => tancaRoba(d.data, d.w, d.h, 1330, 55) };
(async()=>{
 const nomes=process.argv.slice(2);
 for(const [f,k] of Object.entries(MAPA)){
  if(nomes.length && !nomes.includes(f)) continue;
  const src=A+'/art/retrats/'+f+'_retrat.jpg';
  const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  ctx.f(data,info.width,info.height);
  if(POST[f]) POST[f]({data,w:info.width,h:info.height});
  const fil=new Array(info.height).fill(0),col=new Array(info.width).fill(0);
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>128){fil[y]++;col[x]++;}
  const f0=a=>a.findIndex(v=>v>4), f1=a=>a.length-1-[...a].reverse().findIndex(v=>v>4);
  const x0=f0(col),x1=f1(col),y0=f0(fil),y1=f1(fil);
  const w=x1-x0+1,h=y1-y0+1,k2=340/Math.max(w,h);
  const r=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).extract({left:x0,top:y0,width:w,height:h}).resize({width:Math.round(w*k2),height:Math.round(h*k2),kernel:'lanczos3'}).webp({quality:88,alphaQuality:100,effort:6}).toFile(A+`/assets/retrats/${k}.webp`);
  console.log(k.padEnd(14),`${w}x${h} -> ${r.width}x${r.height}`,r.size);
 }
})();
