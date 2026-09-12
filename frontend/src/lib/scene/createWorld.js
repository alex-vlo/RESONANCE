import * as THREE from "three";

function sampleTorusKnot(count) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const q = 3;
    const r = 1.35 + (Math.random() - 0.5) * 0.55;
    const tube = 0.38 + Math.random() * 0.55;

    const ct = Math.cos(t);
    const st = Math.sin(t);
    const cqt = Math.cos(q * t);

    let x = r * (2 + cqt) * 0.5 * ct;
    let y = r * (2 + cqt) * 0.5 * st;
    let z = r * Math.sin(q * t) * 0.45;

    const nx = -st;
    const ny = ct;
    const angle = Math.random() * Math.PI * 2;
    x += Math.cos(angle) * tube * nx * 0.35;
    y += Math.cos(angle) * tube * ny * 0.35;
    z += Math.sin(angle) * tube;

    if (Math.random() > 0.72) {
      x += (Math.random() - 0.5) * 1.8;
      y += (Math.random() - 0.5) * 1.4;
      z += (Math.random() - 0.5) * 1.2;
    }

    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    seeds[i3] = x;
    seeds[i3 + 1] = y;
    seeds[i3 + 2] = z;
  }

  return { positions, seeds };
}

function createContours() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0x8d99aa,
    transparent: true,
    opacity: 0.42,
  });

  for (let i = 0; i < 24; i++) {
    const pts = [];
    const rx = 0.28 + i * 0.165;
    const ry = 0.16 + i * 0.105;
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.07) {
      const w = Math.sin(a * 2.2 + i * 0.18) * (0.015 + i * 0.006);
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * (rx + w),
          Math.sin(a) * (ry + w * 0.35),
          -i * 0.015
        )
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, material));
  }

  group.rotation.z = -0.12;
  group.rotation.y = 0.35;
  return group;
}

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 0, 9);

  const contours = createContours();
  contours.position.set(-3.55, 0.15, 0);
  scene.add(contours);

  const count = window.innerWidth < 768 ? 4500 : 11000;
  const { positions, seeds } = sampleTorusKnot(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x161616,
      size: 0.026,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    })
  );
  points.position.set(2.35, 0.1, 0);
  scene.add(points);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.22, 0.236, 64),
    new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide })
  );
  ring.position.set(1.15, -0.85, 0.8);
  scene.add(ring);

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    points.position.x = width < 900 ? 0.4 : 2.35;
    contours.position.x = width < 900 ? -1.6 : -3.55;
    contours.visible = width >= 720;
  }

  function onPointer(event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    target.x = (x / window.innerWidth) * 2 - 1;
    target.y = -(y / window.innerHeight) * 2 + 1;
  }

  let raf = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tick(time) {
    const t = time * 0.001;
    pointer.x += (target.x - pointer.x) * 0.045;
    pointer.y += (target.y - pointer.y) * 0.045;

    if (!reduce) {
      points.rotation.y = t * 0.08 + pointer.x * 0.35;
      points.rotation.x = pointer.y * 0.18;
      contours.rotation.y = 0.35 + pointer.x * 0.08;
      contours.position.y = 0.15 + pointer.y * 0.12;
      ring.position.x = 1.15 + pointer.x * 0.4;
      ring.position.y = -0.85 + pointer.y * 0.3;

      const attr = geometry.getAttribute("position");
      const array = attr.array;
      for (let i = 0; i < count; i += 7) {
        const i3 = i * 3;
        const wave = Math.sin(t * 0.9 + seeds[i3] * 1.4) * 0.035;
        array[i3] = seeds[i3] + wave * pointer.x;
        array[i3 + 1] = seeds[i3 + 1] + Math.cos(t * 0.7 + seeds[i3 + 1]) * 0.03;
      }
      attr.needsUpdate = true;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointer, { passive: true });
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      points.material.dispose();
      ring.geometry.dispose();
      ring.material.dispose();
      contours.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      renderer.dispose();
    },
  };
}
