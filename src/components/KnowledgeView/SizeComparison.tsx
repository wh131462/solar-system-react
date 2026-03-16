import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PLANETS } from '../../data/planets';

type Dimension = 'size' | 'mass' | 'gravity' | 'temp';
const planetData = PLANETS.map(p => ({ name:p.name, diameter:p.diameterKm, color:'#'+new THREE.Color(p.color).getHexString(), mass:p.mass, gravity:p.gravity, temp:p.tempC, hasRing:p.hasRing }));
function shadeColor(c:string,p:number):string{const col=parseInt(c.slice(1),16);let r=(col>>16)+Math.round(255*p);let g=((col>>8)&0xff)+Math.round(255*p);let b=(col&0xff)+Math.round(255*p);return'#'+((1<<24)+(Math.max(0,Math.min(255,r))<<16)+(Math.max(0,Math.min(255,g))<<8)+Math.max(0,Math.min(255,b))).toString(16).slice(1);}

const BASE = import.meta.env.BASE_URL;
const TEXTURE_PATHS: Record<string, string> = {
  sun: `${BASE}textures/2k_sun.jpg`,
  mercury: `${BASE}textures/2k_mercury.jpg`,
  venus: `${BASE}textures/2k_venus_atmosphere.jpg`,
  earth: `${BASE}textures/2k_earth_daymap.jpg`,
  mars: `${BASE}textures/2k_mars.jpg`,
  jupiter: `${BASE}textures/2k_jupiter.jpg`,
  saturn: `${BASE}textures/2k_saturn.jpg`,
  uranus: `${BASE}textures/2k_uranus.jpg`,
  neptune: `${BASE}textures/2k_neptune.jpg`,
};

export default function SizeComparison() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dim, setDim] = useState<Dimension>('size');
  const zoomRef = useRef(1), panRef = useRef(0), dragRef = useRef({dragging:false,lastX:0});
  const texImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const texLoadedRef = useRef(false);

  // 预加载贴图
  useEffect(() => {
    let count = 0;
    const total = Object.keys(TEXTURE_PATHS).length;
    Object.entries(TEXTURE_PATHS).forEach(([id, path]) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        texImagesRef.current[id] = img;
        count++;
        if (count >= total) { texLoadedRef.current = true; }
      };
      img.src = path;
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const wrap = canvas.parentElement; if (!wrap) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = wrap.clientWidth * devicePixelRatio; canvas.height = wrap.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = wrap.clientWidth, H = wrap.clientHeight; ctx.clearRect(0,0,W,H);
    const zoom = zoomRef.current, panX = panRef.current;
    let values: number[];
    if (dim==='size') values=planetData.map(p=>p.diameter);
    else if (dim==='mass') values=planetData.map(p=>Math.log10(Math.max(.001,p.mass))+4);
    else if (dim==='gravity') values=planetData.map(p=>p.gravity);
    else values=planetData.map(p=>p.temp+300);
    const maxVal=Math.max(...values), baseY=H*0.55, spacing=120*zoom, startX=W/2-spacing*4+panX;

    PLANETS.forEach((p,i) => {
      const x=startX+i*spacing; if(x<-100||x>W+100) return;
      const v=values[i]; let r:number;
      if(dim==='size') r=i===0?Math.min(H*.4,(v/maxVal)*200*zoom):Math.max(3,(v/maxVal)*200*zoom);
      else r=Math.max(5,(v/maxVal)*80*zoom);
      const col=planetData[i].color;
      const texImg = texImagesRef.current[p.id];
      const cy = (i===0&&dim==='size'&&r>H*.3) ? baseY : baseY-r;

      if (texImg && r > 2) {
        // 使用贴图绘制圆形星球
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI*2);
        ctx.clip();
        ctx.drawImage(texImg, x-r, cy-r, r*2, r*2);
        ctx.restore();
        // 添加球体光影效果
        const shadow = ctx.createRadialGradient(x-r*.3, cy-r*.3, 0, x, cy, r);
        shadow.addColorStop(0, 'rgba(255,255,255,0.1)');
        shadow.addColorStop(0.7, 'rgba(0,0,0,0)');
        shadow.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = shadow;
        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI*2);
        ctx.fill();
      } else {
        // fallback: 渐变圆
        const gr=ctx.createRadialGradient(x-r*.2,cy-r*.2,0,x,cy,r); gr.addColorStop(0,col); gr.addColorStop(1,shadeColor(col,-.3));
        ctx.fillStyle=gr; ctx.beginPath();
        ctx.arc(x,cy,r,0,Math.PI*2);
        ctx.fill();
      }

      if(p.hasRing&&dim==='size'){ctx.strokeStyle=`${col}88`;ctx.lineWidth=Math.max(1,r*.15);ctx.beginPath();ctx.ellipse(x,cy,r*2,r*.3,0,0,Math.PI*2);ctx.stroke();}
      ctx.fillStyle='#aab';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(p.name,x,baseY+20);
      if(dim!=='size'){const barH=(v/maxVal)*100*zoom;ctx.fillStyle=col+'44';ctx.fillRect(x-12,baseY+30,24,barH);ctx.fillStyle=col;ctx.fillRect(x-12,baseY+30,24,2);ctx.fillStyle='#889';ctx.font='10px sans-serif';let vLabel:string;if(dim==='mass')vLabel=p.mass>=1?p.mass.toFixed(1)+'x':p.mass.toFixed(3)+'x';else if(dim==='gravity')vLabel=p.gravity+' m/s²';else vLabel=p.tempC+'°C';ctx.fillText(vLabel,x,baseY+30+barH+14);}
      else{ctx.fillStyle='#667';ctx.font='10px sans-serif';const dLabel=p.diameterKm>100000?(p.diameterKm/1000).toFixed(0)+'千km':p.diameterKm.toLocaleString()+' km';ctx.fillText(dLabel,x,baseY+34);}
    });
  }, [dim]);

  useEffect(() => { draw(); const h = () => draw(); window.addEventListener('resize',h);
    // 贴图加载后重绘
    const tid = setInterval(() => { if (texLoadedRef.current) { draw(); clearInterval(tid); } }, 100);
    return () => { window.removeEventListener('resize',h); clearInterval(tid); };
  }, [draw]);
  useEffect(() => {
    const hm = (e:MouseEvent) => { if(dragRef.current.dragging){panRef.current+=e.clientX-dragRef.current.lastX;dragRef.current.lastX=e.clientX;draw();} };
    const hu = () => { dragRef.current.dragging=false; };
    window.addEventListener('mousemove',hm); window.addEventListener('mouseup',hu);
    return () => { window.removeEventListener('mousemove',hm); window.removeEventListener('mouseup',hu); };
  }, [draw]);

  return (<>
    <div className="size-toolbar">
      {(['size','mass','gravity','temp'] as Dimension[]).map(d => (<button key={d} className={dim===d?'active':''} onClick={()=>setDim(d)}>{{size:'大小',mass:'质量',gravity:'重力',temp:'温度'}[d]}</button>))}
      <span className="spacer" /><span className="zoom-label">滚轮缩放 · 拖拽平移</span>
    </div>
    <div id="size-canvas-wrap"
      onWheel={e=>{e.preventDefault();zoomRef.current=Math.max(.3,Math.min(5,zoomRef.current*(1-e.deltaY*.001)));draw();}}
      onMouseDown={e=>{dragRef.current={dragging:true,lastX:e.clientX};}}>
      <canvas ref={canvasRef} id="size-canvas" />
    </div>
  </>);
}
