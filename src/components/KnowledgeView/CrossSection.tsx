import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLANETS } from '../../data/planets';

const BASE_R = 2;
const BASE = import.meta.env.BASE_URL;

// Planet id → texture file path
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

export default function CrossSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [planetIdx, setPlanetIdx] = useState(3);
  const [highlightLayer, setHighlightLayer] = useState<number | null>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    layerGroup: THREE.Group;
  } | null>(null);
  const animRef = useRef<number>(0);
  const planet = PLANETS[planetIdx];

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    // No auto-rotate on camera; we rotate the model group instead

    scene.add(new THREE.AmbientLight(0x667788, 4));
    const dl1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dl1.position.set(4, 5, 6); scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(0x6688bb, 1.5);
    dl2.position.set(-3, 1, -2); scene.add(dl2);
    // Light from behind to illuminate the cross-section face
    const dl3 = new THREE.DirectionalLight(0xaabbcc, 2);
    dl3.position.set(0, 2, -6); scene.add(dl3);

    const layerGroup = new THREE.Group();
    // Tilt the model slightly so the cross-section face is nicely visible
    layerGroup.rotation.x = -0.15;
    scene.add(layerGroup);
    sceneRef.current = { scene, camera, renderer, controls, layerGroup };

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      controls.update();
      // Slowly rotate the model group so cross-section is always partially visible
      layerGroup.rotation.y += 0.005;
      const wrap = canvas.parentElement;
      if (wrap) {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        if (canvas.width !== w * devicePixelRatio || canvas.height !== h * devicePixelRatio) {
          renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
        }
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(animRef.current); controls.dispose(); renderer.dispose(); };
  }, []);

  // Build layers
  useEffect(() => {
    const ref = sceneRef.current; if (!ref) return;
    const group = ref.layerGroup;
    // Reset rotation Y so cross-section face initially faces the camera at 3/4 view
    group.rotation.y = Math.PI * 0.75;

    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }

    const layers = planet.structure || [];
    const loader = new THREE.TextureLoader();
    const texPath = TEXTURE_MAP[planet.id];

    // === Half-sphere shells (phiLength = PI) ===
    // The half sphere extends into +Z, with the flat opening at z=0
    // phiStart=0, phiLength=PI: from -X through +Z to +X (the +Z hemisphere)
    layers.forEach((l, li) => {
      const r = l.r * BASE_R;
      const color = new THREE.Color(l.color);
      const isOutermost = li === layers.length - 1;

      const shellGeo = new THREE.SphereGeometry(r, 64, 48, 0, Math.PI);
      const shellMat = new THREE.MeshStandardMaterial({
        color: isOutermost ? 0xffffff : color,
        roughness: isOutermost ? 0.6 : 0.5,
        metalness: isOutermost ? 0.05 : 0.08,
        side: THREE.DoubleSide,
        depthWrite: true,
        ...(isOutermost && planet.isStar ? {
          emissive: new THREE.Color(planet.emissive || 0xff8800),
          emissiveIntensity: 1.5,
        } : {}),
      });

      // Load real texture for the outermost shell
      if (isOutermost && texPath) {
        loader.load(texPath, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          shellMat.map = tex;
          if (planet.isStar) shellMat.emissiveMap = tex;
          shellMat.needsUpdate = true;
        });
      }

      const shell = new THREE.Mesh(shellGeo, shellMat);
      shell.renderOrder = li;
      shell.userData = { layerIdx: li, origColor: l.color, type: 'shell', isOutermost };
      group.add(shell);
    });

    // === Cross-section face: full circle at z=0, XY plane ===
    // Shows concentric colored rings for each layer
    layers.forEach((l, li) => {
      const outerR = l.r * BASE_R;
      const innerR = li > 0 ? layers[li - 1].r * BASE_R : 0;
      const color = new THREE.Color(l.color);

      const geo = li === 0
        ? new THREE.CircleGeometry(outerR, 64)
        : new THREE.RingGeometry(innerR, outerR, 64);

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color.clone().multiplyScalar(0.3),
        emissiveIntensity: 1,
        roughness: 0.4,
        metalness: 0.02,
        side: THREE.DoubleSide,
        depthWrite: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });

      const face = new THREE.Mesh(geo, mat);
      // CircleGeometry is in XY plane, facing +Z by default — perfect for our opening
      face.renderOrder = 50 + li;
      face.userData = { layerIdx: li, origColor: l.color, type: 'face' };
      group.add(face);
    });

    // === Edge rings at layer boundaries ===
    layers.forEach((l, li) => {
      if (li === layers.length - 1) return;
      const r = l.r * BASE_R;

      // Full circle edge on the cross-section face
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0.002));
      }
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false,
      });
      const edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), edgeMat);
      edge.renderOrder = 100;
      edge.userData = { type: 'edge' };
      group.add(edge);
    });

    ref.camera.position.set(0, 1, 5);
    ref.controls.target.set(0, 0, 0);
  }, [planetIdx]);

  // Highlight effect
  useEffect(() => {
    const ref = sceneRef.current; if (!ref) return;
    ref.layerGroup.children.forEach(child => {
      if (!(child instanceof THREE.Mesh)) return;
      const mat = child.material as THREE.MeshStandardMaterial;
      const li = child.userData.layerIdx;
      const type = child.userData.type;
      const isOutermost = child.userData.isOutermost;
      if (type === 'edge') return;

      if (highlightLayer !== null) {
        if (li === highlightLayer) {
          mat.emissive = new THREE.Color(child.userData.origColor);
          mat.emissiveIntensity = type === 'face' ? 0.5 : 0.3;
          mat.transparent = false;
          mat.opacity = 1;
        } else {
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
          if (type === 'shell') {
            // Shells above highlighted layer become transparent to reveal it
            mat.transparent = li > highlightLayer;
            mat.opacity = li > highlightLayer ? 0.1 : 1.0;
          } else {
            mat.transparent = true;
            mat.opacity = 0.2;
          }
        }
      } else {
        // Default: reset to normal
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveIntensity = 0;
        // Restore star emissive
        if (isOutermost && planet.isStar) {
          mat.emissive = new THREE.Color(planet.emissive || 0xff8800);
          mat.emissiveIntensity = 1.5;
        }
        mat.transparent = false;
        mat.opacity = 1.0;
      }
    });
  }, [highlightLayer, planetIdx]);

  return (<>
    <div id="cross-3d"><canvas ref={canvasRef} id="cross-canvas" /></div>
    <div id="cross-info">
      <div id="cross-planet-select">
        {PLANETS.map((p, i) => (
          <button key={p.id} className={i === planetIdx ? 'active' : ''} onClick={() => setPlanetIdx(i)}>
            <span className="cps-dot" style={{ background: p.structure?.[p.structure.length - 1]?.color || '#666' }} />
            {p.name}
          </button>
        ))}
      </div>
      <h3>
        <span className="cross-title-icon">◉</span>
        {planet.name} <span className="cross-title-sub">内部结构</span>
      </h3>
      <div className="cross-layers">
        {(planet.structure || []).map((l, li) => (
          <div
            key={li}
            className={`layer-card${highlightLayer === li ? ' active' : ''}`}
            onMouseEnter={() => setHighlightLayer(li)}
            onMouseLeave={() => setHighlightLayer(null)}
          >
            <div className="lc-color-bar" style={{ background: l.color }} />
            <div className="lc-body">
              <div className="lc-name" style={{ color: l.color }}>{l.name}</div>
              <div className="lc-detail">
                <div className="lc-row"><span className="lc-label">温度</span><span className="lc-value">{l.temp}</span></div>
                <div className="lc-row"><span className="lc-label">成分</span><span className="lc-value">{l.comp}</span></div>
                <div className="lc-row"><span className="lc-label">厚度</span><span className="lc-value">{l.thick}</span></div>
              </div>
            </div>
            <div className="lc-depth-bar">
              <div className="lc-depth-fill" style={{ height: `${l.r * 100}%`, background: l.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>);
}
