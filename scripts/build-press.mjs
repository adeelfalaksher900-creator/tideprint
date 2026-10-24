/** Anatomy Figure: a small paper press. The descending platen clamps the review
 * record without removing any sheets. This illustrates immutability, not Bitcoin.
 * Parts: 8 foot pads, base, 8 post/collar/cap parts, 2 crossheads, 2 guides,
 * 3 moving platen parts, 8 paper sheets, paper bed, 2 rails, 4 end stops,
 * 8 recessed bolt heads, 4 crosshead fixings, 2 label/ruler strips = 54 parts.
 * Every solid is a rectangular prism; there are no round solids, pipes or cables.
 */
import * as k from '../vendor/anatomy/iso-kit.mjs';
import {writeFileSync} from 'node:fs';
const base={x:-115,y:-65,w:230,d:150,r:6};
const P=k.fitProjection([...k.boxCorners(base,-14,0),[-96,-45,112],[96,-45,112],[0,53,84]],600,370,{pad:40,azimuth:43,elevation:32});
const parts=[];let count=0;
function slab(name,x,y,w,d,z,h,tone='mid',moving=false){const plan={x,y,w,d,r:Math.min(2,w/5,d/5)},paths=k.slabOf(plan,z,h,P,4,.5);parts.push({name,paths,tone,moving});count++;}
for(const x of[-100,84])for(const y of[-51,57]){slab('foot cushion',x,y,16,15,-14,4,'lo');slab('foot mount',x+2,y+2,12,11,-10,2,'mid');}
slab('cast base',-115,-65,230,150,-8,8,'lo');
for(const x of[-99,85]){slab('post mount',x-5,-47,24,24,0,5);slab('square guide post',x,-43,14,16,5,98);slab('post collar',x-2,-45,18,20,81,5);slab('post cap',x-3,-46,20,22,103,5);}
slab('rear crosshead',-85,-43,170,8,91,17);slab('front crosshead',-85,-27,170,10,91,17);
slab('left guide shoe',-55,-23,12,26,69,22);slab('right guide shoe',43,-23,12,26,69,22);
for(const x of[-99,85])for(const y of[-44,-26])slab('crosshead recessed fixing',x+3,y,5,5,108,.5,'hi');
slab('rear paper rail',-72,-11,145,5,0,4);slab('front paper rail',-72,49,145,5,0,4);
for(const x of[-76,69])for(const y of[-12,45])slab('rail end stop',x,y,7,11,0,7);
slab('paper bed',-68,-5,136,52,4,2,'mid');
for(let i=0;i<8;i++)slab('retained sheet '+(i+1),-60+(i%2)*.4,0,120,42,6+i*.8,.65,i===7?'hi':'mid');
slab('central plunger housing',-12,-27,24,42,91,17,'mid');slab('platen neck',-7,-1,14,14,48,43,'hi',false);parts.at(-1).closedPaths=k.slabOf({x:-7,y:-1,w:14,d:14,r:2},23.25,67.75,P,4,.5);slab('platen backing',-50,-3,100,42,40,8,'hi',true);slab('flat clamp face',-47,0,94,36,37,3,'hi',true);
for(const x of[-107,99])for(const y of[-56,64]){slab('base bolt recess',x-2,y-2,8,8,0,.4,'lo');slab('square bolt head',x,y,4,4,.4,.6,'hi');}
slab('serial plate',-82,66,68,8,0,.7,'mid');slab('ruler strip',3,66,83,8,0,.7,'mid');
const lines=[];
for(let i=0;i<3;i++)lines.push({d:k.lineOnTop([-77,68+i*1.6],[-28+i*7,68+i*1.6],.8,P),free:true});
const ticks=k.topTicks(7,82,5,5,66.7,.8,[2.2,4],P);lines.push({d:ticks.minor},{d:ticks.major});
for(const part of parts.filter(p=>p.name.startsWith('retained sheet')))lines.push({d:k.planOutline({x:-57,y:3,w:114,d:36,r:1},12.3,P),free:false});
const vector=k.iso([0,0,-24.75],P),origin=k.iso([0,0,0],P);
writeFileSync('src/press-data.json',JSON.stringify({parts,lines,move:[vector[0]-origin[0],vector[1]-origin[1]],count}));
console.log('Anatomy paper press:',count,'purposeful rectangular solids');
