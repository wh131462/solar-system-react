import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLANETS } from '../data/planets';
import { useApp } from '../store/AppContext';

const DEG = Math.PI / 180;
const ORBIT_SCALE = 3;

export interface SolarSystemHandle {
  focusOnPlanet: (idx: number) => void;
  resetView: () => void;
}

// Use Vite's import.meta.env.BASE_URL to resolve asset paths correctly
const BASE = import.meta.env.BASE_URL;

// Texture map: planet id -> texture file path
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

const SolarSystem3D = forwardRef<SolarSystemHandle>((_props, ref) => {
  const { state, focusOnPlanet: ctxFocus } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneDataRef = useRef<any>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useImperativeHandle(ref, () => ({
    focusOnPlanet: (idx: number) => {
      const sd = sceneDataRef.current; if (!sd) return;
      const d = PLANETS[idx], wp = new THREE.Vector3();
      sd.meshes[idx].getWorldPosition(wp);
      const off = d.radius * 4 + 5;
      sd.cameraAnim = { sp: sd.camera.position.clone(), ep: new THREE.Vector3(wp.x + off * .5, wp.y + off * .6, wp.z + off), st: sd.ctrl.target.clone(), et: wp, pr: 0 };
      sd.focusTarget = idx;
      ctxFocus(idx);
    },
    resetView: () => {
      const sd = sceneDataRef.current; if (!sd) return;
      sd.cameraAnim = { sp: sd.camera.position.clone(), ep: new THREE.Vector3(40, 60, 100), st: sd.ctrl.target.clone(), et: new THREE.Vector3(0, 0, 0), pr: 0 };
      sd.focusTarget = null;
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 2000);
    camera.position.set(40, 60, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    containerRef.current.appendChild(renderer.domElement);
    const ctrl = new OrbitControls(camera, renderer.domElement);
    ctrl.enableDamping = true; ctrl.dampingFactor = .06; ctrl.minDistance = 5; ctrl.maxDistance = 500;

    const loader = new THREE.TextureLoader();

    // Stars
    {const n=10000,g=new THREE.BufferGeometry(),p=new Float32Array(n*3),c=new Float32Array(n*3),s=new Float32Array(n);for(let i=0;i<n;i++){const r2=500+Math.random()*500,t=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);p[i*3]=r2*Math.sin(ph)*Math.cos(t);p[i*3+1]=r2*Math.sin(ph)*Math.sin(t);p[i*3+2]=r2*Math.cos(ph);const v=.6+Math.random()*.4;c[i*3]=v;c[i*3+1]=v;c[i*3+2]=v*(.85+Math.random()*.15);s[i]=.4+Math.random()*1.8;}g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(c,3));g.setAttribute('size',new THREE.BufferAttribute(s,1));scene.add(new THREE.Points(g,new THREE.ShaderMaterial({vertexShader:`attribute float size;varying vec3 vColor;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*(200./-mv.z);gl_Position=projectionMatrix*mv;}`,fragmentShader:`varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(vColor,(1.-smoothstep(0.,1.,d))*.9);}`,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));}

    // Lights
    scene.add(new THREE.PointLight(0xffffff, 5, 800, .3));
    scene.add(new THREE.PointLight(0xffddaa, 3, 1000, .2));
    scene.add(new THREE.AmbientLight(0x334466, 2));
    const fl1 = new THREE.DirectionalLight(0x223355, 1.5); fl1.position.set(-50, 30, -50); scene.add(fl1);
    const fl2 = new THREE.DirectionalLight(0x222244, 1); fl2.position.set(50, -20, 50); scene.add(fl2);

    // Create planets
    const meshes: THREE.Mesh[] = [], groups: THREE.Group[] = [], moonMeshes: THREE.Mesh[][] = [];
    const trailLines: Record<string, { line: THREE.Line; points: number[]; max: number }> = {};
    const cloudMeshes: THREE.Mesh[] = [];

    PLANETS.forEach((data, idx) => {
      const group = new THREE.Group();

      // Load real texture with callback to ensure material updates
      const texPath = TEXTURE_MAP[data.id];
      let mat: THREE.MeshStandardMaterial;
      if (data.isStar) {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(data.color),
          emissive: new THREE.Color(data.emissive!),
          emissiveIntensity: 3,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: data.roughness || .6,
          metalness: .1,
          emissive: new THREE.Color(data.color),
          emissiveIntensity: .15,
        });
      }
      // Load texture async and apply when ready
      if (texPath) {
        loader.load(texPath, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          if (data.isStar) { mat.emissiveMap = tex; }
          mat.needsUpdate = true;
        });
      }
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 64, 48), mat);
      mesh.userData = { data, idx }; group.add(mesh);

      // Earth atmosphere (blue glow)
      if (data.id === 'earth') {
        group.add(new THREE.Mesh(
          new THREE.SphereGeometry(data.radius * 1.04, 48, 36),
          new THREE.ShaderMaterial({
            vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
            fragmentShader: `varying vec3 vN;void main(){float i=pow(.65-dot(vN,vec3(0,0,1)),3.);gl_FragColor=vec4(.3,.6,1.,i*.8);}`,
            transparent: true, side: THREE.FrontSide, depthWrite: false, blending: THREE.AdditiveBlending
          })
        ));
        // Earth cloud layer
        const cloudMat = new THREE.MeshStandardMaterial({
          transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending
        });
        loader.load(`${BASE}textures/2k_earth_clouds.jpg`, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          cloudMat.map = tex;
          cloudMat.needsUpdate = true;
        });
        const cloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(data.radius * 1.02, 48, 36), cloudMat
        );
        group.add(cloudMesh);
        cloudMeshes.push(cloudMesh);
      }

      // Venus atmosphere (thick yellow-orange glow)
      if (data.id === 'venus') {
        group.add(new THREE.Mesh(
          new THREE.SphereGeometry(data.radius * 1.08, 48, 36),
          new THREE.ShaderMaterial({
            vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
            fragmentShader: `varying vec3 vN;void main(){float i=pow(.6-dot(vN,vec3(0,0,1)),2.5);gl_FragColor=vec4(.85,.7,.3,i*.7);}`,
            transparent: true, side: THREE.FrontSide, depthWrite: false, blending: THREE.AdditiveBlending
          })
        ));
      }

      // Star glow
      if (data.isStar) {
        group.add(new THREE.Mesh(new THREE.SphereGeometry(data.radius * 1.6, 32, 24), new THREE.ShaderMaterial({ vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragmentShader: `varying vec3 vN;void main(){float i=pow(.55-dot(vN,vec3(0,0,1)),2.5);gl_FragColor=vec4(1.,.7,.2,i*.6);}`, transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })));
        group.add(new THREE.Mesh(new THREE.SphereGeometry(data.radius * 2.5, 32, 24), new THREE.ShaderMaterial({ vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragmentShader: `varying vec3 vN;void main(){float i=pow(.4-dot(vN,vec3(0,0,1)),3.);gl_FragColor=vec4(1.,.6,.1,i*.15);}`, transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })));
      }

      // Ring (Saturn / Uranus)
      if (data.hasRing) {
        const inR = data.radius * 1.4, outR = data.radius * (data.id === 'saturn' ? 2.6 : 1.8);
        const rg = new THREE.RingGeometry(inR, outR, 128);
        const uv = rg.attributes.uv, pos = rg.attributes.position;
        for (let i = 0; i < uv.count; i++) { const xx = pos.getX(i), yy = pos.getY(i); uv.setXY(i, (Math.sqrt(xx * xx + yy * yy) - inR) / (outR - inR), .5); }

        let ringMat: THREE.MeshStandardMaterial;
        if (data.id === 'saturn') {
          // Use real Saturn ring texture
          ringMat = new THREE.MeshStandardMaterial({ color: 0xddccaa, transparent: true, side: THREE.DoubleSide, roughness: .8, depthWrite: false });
          loader.load(`${BASE}textures/2k_saturn_ring_alpha.png`, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            ringMat.map = tex;
            ringMat.needsUpdate = true;
          });
        } else {
          // Uranus: procedural faint ring
          const rc = document.createElement('canvas'); rc.width = 512; rc.height = 16; const rx = rc.getContext('2d')!;
          for (let xx = 0; xx < 512; xx++) { const t2 = xx / 512; const a = .15 * (1 - Math.abs(t2 - .5) * 2); rx.fillStyle = `rgba(150,200,210,${a})`; rx.fillRect(xx, 0, 1, 16); }
          ringMat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(rc), transparent: true, side: THREE.DoubleSide, roughness: .8, depthWrite: false });
        }
        const ring = new THREE.Mesh(rg, ringMat);
        ring.rotation.x = -Math.PI / 2 + (data.axialTilt || 0) * DEG; group.add(ring);
      }

      // Orbit line
      if (data.distance > 0) {
        const inc = (data.inclination || 0) * DEG * ORBIT_SCALE, seg = 256, pts = new Float32Array((seg + 1) * 3);
        for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2, xx = Math.cos(a) * data.distance, zz = Math.sin(a) * data.distance; pts[i * 3] = xx; pts[i * 3 + 1] = zz * Math.sin(inc); pts[i * 3 + 2] = zz * Math.cos(inc); }
        const og = new THREE.BufferGeometry(); og.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        scene.add(new THREE.Line(og, new THREE.LineBasicMaterial({ color: 0x4466aa, transparent: true, opacity: .4 })));
      }

      // Moons
      const moons: THREE.Mesh[] = [];
      if (data.moons) {
        data.moons.forEach(m => {
          let moonMat: THREE.MeshStandardMaterial;
          if (m.name === '月球') {
            // Use real moon texture
            moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: .9, metalness: .05 });
            loader.load(`${BASE}textures/2k_moon.jpg`, (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              moonMat.map = tex;
              moonMat.needsUpdate = true;
            });
          } else {
            const mc = new THREE.Color(m.color);
            moonMat = new THREE.MeshStandardMaterial({ color: m.color, roughness: .8, emissive: mc, emissiveIntensity: .1 });
          }
          const mm = new THREE.Mesh(new THREE.SphereGeometry(m.radius, 24, 16), moonMat);
          mm.userData = { moonData: m }; group.add(mm); moons.push(mm);
        });
      }

      // Trail
      const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(500 * 3), 3)); tg.setDrawRange(0, 0);
      const tl = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: data.color, transparent: true, opacity: .4 })); tl.visible = false; scene.add(tl);
      trailLines[data.id] = { line: tl, points: [], max: 500 };

      scene.add(group); meshes.push(mesh); groups.push(group); moonMeshes.push(moons);
    });

    // Asteroid belt
    {const n=1500,g=new THREE.BufferGeometry(),p=new Float32Array(n*3),s=new Float32Array(n);for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,d=47+Math.random()*6;p[i*3]=Math.cos(a)*d;p[i*3+1]=(Math.random()-.5)*2;p[i*3+2]=Math.sin(a)*d;s[i]=.15+Math.random()*.35;}g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('size',new THREE.BufferAttribute(s,1));scene.add(new THREE.Points(g,new THREE.ShaderMaterial({vertexShader:`attribute float size;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*(150./-mv.z);gl_Position=projectionMatrix*mv;}`,fragmentShader:`void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(.5,.45,.4,.7*(1.-d*.5));}`,transparent:true,depthWrite:false})));}

    // Gravity lines
    const gravityLines: { line: THREE.Line; idx: number }[] = [];
    function createGravLines() { clearGravLines(); for (let i = 1; i < PLANETS.length; i++) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3)); const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffaa33, transparent: true, opacity: .2 })); scene.add(l); gravityLines.push({ line: l, idx: i }); } }
    function clearGravLines() { gravityLines.forEach(g => { scene.remove(g.line); g.line.geometry.dispose(); }); gravityLines.length = 0; }

    // Mouse
    const rc2 = new THREE.Raycaster(), ms = new THREE.Vector2();
    const tooltip = document.getElementById('tooltip');
    renderer.domElement.onclick = (e: MouseEvent) => {
      if (stateRef.current.currentMode === 'knowledge') return;
      ms.x = (e.clientX / innerWidth) * 2 - 1; ms.y = -(e.clientY / innerHeight) * 2 + 1;
      rc2.setFromCamera(ms, camera); const h = rc2.intersectObjects(meshes);
      if (h.length) { const idx2 = h[0].object.userData.idx; ctxFocus(idx2); }
    };
    renderer.domElement.onmousemove = (e: MouseEvent) => {
      ms.x = (e.clientX / innerWidth) * 2 - 1; ms.y = -(e.clientY / innerHeight) * 2 + 1;
      rc2.setFromCamera(ms, camera); const h = rc2.intersectObjects(meshes);
      if (h.length && tooltip) { tooltip.textContent = h[0].object.userData.data.name; tooltip.style.opacity = '1'; tooltip.style.left = e.clientX + 15 + 'px'; tooltip.style.top = e.clientY - 10 + 'px'; renderer.domElement.style.cursor = 'pointer'; }
      else if (tooltip) { tooltip.style.opacity = '0'; renderer.domElement.style.cursor = 'grab'; }
    };

    const ease = (t2: number) => t2 < .5 ? 4 * t2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 3) / 2;

    const sd: any = { scene, camera, renderer, ctrl, meshes, groups, moonMeshes, trailLines, gravityLines, cameraAnim: null as any, focusTarget: null as number | null, createGravLines, clearGravLines };
    sceneDataRef.current = sd;

    const clock = new THREE.Clock();
    let trailCt = 0, animId = 0;
    let localElapsed = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta(), elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      if (!st.paused) localElapsed += delta * st.simSpeed;
      const simDays = st.simTime / 86400000;

      PLANETS.forEach((data, i) => {
        const lab = st.labState[data.id];
        if (data.distance > 0) {
          const baseDist = data.distance * lab.distMul, ecc = lab.ecc;
          const baseSpeed = data.speed * Math.pow(lab.distMul, -1.5);
          const angle = simDays * baseSpeed * .15;
          const incRad = (data.inclination || 0) * DEG * ORBIT_SCALE;
          const r3 = baseDist * (1 - ecc * ecc) / (1 + ecc * Math.cos(angle));
          const x2 = r3 * Math.cos(angle), z = r3 * Math.sin(angle);
          groups[i].position.set(x2, z * Math.sin(incRad), z * Math.cos(incRad));
          if (st.realisticScale) meshes[i].scale.setScalar(Math.max(.3, data.radius / 8));
          else meshes[i].scale.setScalar(1);
        }
        const axTilt = (data.axialTilt || 0) * DEG;
        meshes[i].rotation.order = 'ZXY'; meshes[i].rotation.z = axTilt;
        if (!st.paused) meshes[i].rotation.y += data.rotSpeed * st.simSpeed;

        if (data.moons && moonMeshes[i]) {
          data.moons.forEach((m, mi) => { const ma = localElapsed * m.speed + mi * 2; const mm = moonMeshes[i][mi]; if (mm) { mm.position.set(Math.cos(ma) * m.distance, Math.sin(ma * .3) * m.distance * .1, Math.sin(ma) * m.distance); } });
        }

        if (st.showTrails && data.distance > 0 && !st.paused) {
          trailCt++; if (trailCt % 3 === 0) {
            const t2 = trailLines[data.id]; const wp = new THREE.Vector3(); meshes[i].getWorldPosition(wp);
            t2.points.push(wp.x, wp.y, wp.z); if (t2.points.length / 3 > t2.max) t2.points.splice(0, 3);
            const arr = t2.line.geometry.attributes.position.array as Float32Array;
            for (let j = 0; j < t2.points.length; j++) arr[j] = t2.points[j];
            t2.line.geometry.attributes.position.needsUpdate = true; t2.line.geometry.setDrawRange(0, t2.points.length / 3);
          }
        }
      });

      // Rotate Earth clouds slowly
      if (!st.paused) { cloudMeshes.forEach(cm => { cm.rotation.y += 0.0003 * st.simSpeed; }); }

      // Trail visibility
      Object.values(trailLines).forEach(t2 => { t2.line.visible = st.showTrails; });

      // Gravity lines
      if (st.showGravity && gravityLines.length === 0) createGravLines();
      if (!st.showGravity && gravityLines.length > 0) clearGravLines();
      gravityLines.forEach(g => { const a = g.line.geometry.attributes.position.array as Float32Array; a[0] = a[1] = a[2] = 0; const w = new THREE.Vector3(); meshes[g.idx].getWorldPosition(w); a[3] = w.x; a[4] = w.y; a[5] = w.z; g.line.geometry.attributes.position.needsUpdate = true; (g.line.material as THREE.Material).opacity = Math.min(.4, 20 / w.length()); });

      meshes[0].scale.setScalar(st.realisticScale ? .5 * (1 + Math.sin(elapsed * 1.5) * .01) : 1 + Math.sin(elapsed * 1.5) * .01);

      if (sd.focusTarget !== null) { const wp = new THREE.Vector3(); meshes[sd.focusTarget].getWorldPosition(wp); if (!sd.cameraAnim) ctrl.target.lerp(wp, .05); }

      if (sd.cameraAnim) {
        sd.cameraAnim.pr += delta * 1.5;
        if (sd.cameraAnim.pr >= 1) { camera.position.copy(sd.cameraAnim.ep); ctrl.target.copy(sd.cameraAnim.et); sd.cameraAnim = null; }
        else { const t2 = ease(sd.cameraAnim.pr); camera.position.lerpVectors(sd.cameraAnim.sp, sd.cameraAnim.ep, t2); ctrl.target.lerpVectors(sd.cameraAnim.st, sd.cameraAnim.et, t2); }
      }

      ctrl.update(); renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />;
});

SolarSystem3D.displayName = 'SolarSystem3D';
export default SolarSystem3D;
