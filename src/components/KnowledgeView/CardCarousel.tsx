import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PLANETS } from '../../data/planets';

const DEG = Math.PI / 180;
const INFO_LABELS: Record<string, string> = { diameter:'直径',mass:'质量',orbit:'公转',distSun:'距太阳',gravity:'重力',moons:'卫星',type:'类型',temp:'温度',age:'年龄',atmosphere:'大气' };

const BASE = import.meta.env.BASE_URL;
const TEXTURE_MAP: Record<string, string> = {
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
const textureLoader = new THREE.TextureLoader();

function genCardTex(p: typeof PLANETS[0]): THREE.CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256;
  const x = cv.getContext('2d')!; const co = new THREE.Color(p.color);
  const r = co.r*255|0, g = co.g*255|0, b = co.b*255|0;
  x.fillStyle = `rgb(${r},${g},${b})`; x.fillRect(0,0,512,256);
  if (p.isStar) { for(let i=0;i<1500;i++){const br=.5+Math.random()*.5;x.fillStyle=`rgba(${Math.min(255,r+40)},${(g*br)|0},${(b*.3*br)|0},${.3+Math.random()*.5})`;x.beginPath();x.arc(Math.random()*512,Math.random()*256,1+Math.random()*8,0,Math.PI*2);x.fill();} }
  else if (p.hasBands) { for(let y=0;y<256;y+=2){const n=Math.sin(y*.05)*30+Math.sin(y*.13)*15;x.fillStyle=`rgb(${Math.min(255,Math.max(0,r+n))},${Math.min(255,Math.max(0,g+n*.7))},${Math.min(255,Math.max(0,b+n*.3))})`;x.fillRect(0,y,512,3);} }
  else { for(let i=0;i<800;i++){const v=Math.random()*30-15;x.fillStyle=`rgba(${Math.min(255,r+v)},${Math.min(255,g+v)},${Math.min(255,b+v)},0.4)`;x.beginPath();x.arc(Math.random()*512,Math.random()*256,1+Math.random()*4,0,Math.PI*2);x.fill();} }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default function CardCarousel() {
  const [cardIdx, setCardIdx] = useState(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const scenesRef = useRef<{scene:THREE.Scene;camera:THREE.PerspectiveCamera;sphere:THREE.Mesh}[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer|null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const scenes = PLANETS.map(p => {
      const sc = new THREE.Scene(); sc.add(new THREE.AmbientLight(0x334466, 1.2));
      const dl = new THREE.DirectionalLight(0xffffff, 2.5); dl.position.set(3,2,4); sc.add(dl);
      if (p.isStar) sc.add(new THREE.PointLight(new THREE.Color(p.emissive!), 4, 50));
      const texPath = TEXTURE_MAP[p.id];
      const fallbackTex = genCardTex(p);
      const tex = texPath ? textureLoader.load(texPath, (t) => { t.colorSpace = THREE.SRGBColorSpace; }) : fallbackTex;
      if (texPath) tex.colorSpace = THREE.SRGBColorSpace;
      let mat: THREE.MeshStandardMaterial;
      if (p.isStar) mat = new THREE.MeshStandardMaterial({ map:tex, emissiveMap:tex, emissive:new THREE.Color(p.emissive!), emissiveIntensity:2.5 });
      else mat = new THREE.MeshStandardMaterial({ map:tex, roughness:p.roughness||.6, metalness:.1, emissive:new THREE.Color(p.color), emissiveIntensity:.05 });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(1,64,48), mat);
      const group = new THREE.Group(); group.add(sphere);
      if (p.hasRing) {
        const inR=1.4, outR=p.id==='saturn'?2.6:1.8;
        const rg = new THREE.RingGeometry(inR,outR,128); const uv=rg.attributes.uv, pos=rg.attributes.position;
        for(let i=0;i<uv.count;i++){const xx=pos.getX(i),yy=pos.getY(i);uv.setXY(i,(Math.sqrt(xx*xx+yy*yy)-inR)/(outR-inR),.5);}
        const rc=document.createElement('canvas');rc.width=512;rc.height=16;const rx=rc.getContext('2d')!;
        for(let xx=0;xx<512;xx++){const t2=xx/512;let a;if(p.id==='saturn'){a=(Math.sin(t2*60)*.3+.5)*(1-Math.abs(t2-.5)*1.5)*.7;rx.fillStyle=`rgba(210,195,170,${a})`;}else{a=.15*(1-Math.abs(t2-.5)*2);rx.fillStyle=`rgba(150,200,210,${a})`;}rx.fillRect(xx,0,1,16);}
        const ring=new THREE.Mesh(rg,new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(rc),transparent:true,side:THREE.DoubleSide,roughness:.8,depthWrite:false}));
        ring.rotation.x=-Math.PI/2+(p.axialTilt||0)*DEG; group.add(ring);
      }
      sphere.rotation.order='ZXY'; sphere.rotation.z=(p.axialTilt||0)*DEG; sc.add(group);
      const camDist=p.isStar?5:p.hasRing?7:4;
      const cam=new THREE.PerspectiveCamera(50,1,0.1,100); cam.position.set(0,camDist*0.15,camDist); cam.lookAt(0,0,0);
      return {scene:sc,camera:cam,sphere};
    });
    scenesRef.current = scenes;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer({ canvas:document.createElement('canvas'), alpha:true, antialias:true });
        rendererRef.current.setPixelRatio(Math.min(devicePixelRatio,2));
        rendererRef.current.toneMapping=THREE.ACESFilmicToneMapping; rendererRef.current.toneMappingExposure=1.6;
      }
      const renderer = rendererRef.current;
      [cardIdx-1,cardIdx,cardIdx+1].filter(i=>i>=0&&i<scenes.length).forEach(i => {
        const cs=scenes[i]; const cv=canvasRefs.current[i]; if(!cv||!cv.parentElement) return;
        const w=cv.parentElement.clientWidth, h=cv.parentElement.clientHeight; if(w<1||h<1) return;
        renderer.setSize(w,h); cs.camera.aspect=w/h; cs.camera.fov=w/h<1?50/Math.max(.5,w/h):50; cs.camera.updateProjectionMatrix();
        cs.sphere.rotation.y+=0.005; renderer.render(cs.scene,cs.camera);
        const pr=Math.min(devicePixelRatio,2); cv.width=w*pr; cv.height=h*pr; cv.style.width=w+'px'; cv.style.height=h+'px';
        const ctx=cv.getContext('2d'); if(ctx){ctx.clearRect(0,0,cv.width,cv.height);ctx.drawImage(renderer.domElement,0,0,cv.width,cv.height);}
      });
    }; animate();

    return () => { cancelAnimationFrame(animRef.current); if(rendererRef.current){rendererRef.current.dispose();rendererRef.current.forceContextLoss();rendererRef.current=null;} };
  }, [cardIdx]);

  const goCard = useCallback((idx:number) => setCardIdx(Math.max(0,Math.min(PLANETS.length-1,idx))), []);
  const cardW = Math.min(900, window.innerWidth * 0.85) + window.innerWidth * 0.04;

  return (<>
    <div className="cards-arrow prev" onClick={() => goCard(cardIdx-1)}>‹</div>
    <div className="cards-container" style={{transform:`translateX(${-cardIdx*cardW+window.innerWidth/2-cardW/2}px)`}}>
      {PLANETS.map((p,i) => (
        <div className="card" key={p.id}>
          <div className="card-visual"><canvas ref={el=>{canvasRefs.current[i]=el;}} /><div className="card-planet-name">{p.nameEn}</div></div>
          <div className="card-content">
            <div><h2>{p.name}</h2><div className="card-type">{p.type}</div></div>
            <div className="card-stats">{Object.entries(p.info).slice(0,6).map(([k,v])=>(<div className="card-stat" key={k}><div className="cs-label">{INFO_LABELS[k]||k}</div><div className="cs-value">{v}</div></div>))}</div>
            <div className="card-facts"><h4>你知道吗</h4>{p.funFacts.slice(0,3).map((f,fi)=><div className="card-fact-item" key={fi}>{f}</div>)}</div>
            <div className="card-milestones"><h4>探索里程碑</h4>{p.milestones.slice(0,3).map((m,mi)=><div className="cm-item" key={mi}><span className="cm-year">{m.year}</span><span className="cm-event">{m.event}</span></div>)}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="cards-arrow next" onClick={() => goCard(cardIdx+1)}>›</div>
    <div className="cards-nav">{PLANETS.map((_,i)=><div key={i} className={`dot${i===cardIdx?' active':''}`} onClick={()=>goCard(i)} />)}</div>
  </>);
}
