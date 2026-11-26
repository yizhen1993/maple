// Procedural 3D Models for MapleStory Henesys World
// Rebuilt step-by-step from references:
// - Character: images-2.jpeg (Dawn Warrior / Cygnus Hero chibi sculpt)
// - Environment: 202610291451187649.webp.jpeg (Henesys Hunting Ground 3-tier map)
(function () {
  'use strict';
  const MapleModels = {};

  function setSRGBTexture(tex) {
    if (THREE.sRGBEncoding !== undefined) {
      tex.encoding = THREE.sRGBEncoding;
    }
    tex.needsUpdate = true;
    return tex;
  }

  // =========================================================================
  // 1. PROCEDURAL PBR TEXTURES
  // =========================================================================

  // High-detail anime face texture matching images-2.jpeg
  function createDawnWarriorFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Warm anime skin base across UV patch
    ctx.fillStyle = '#ffe0cc';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle peach cheek/forehead shading
    const cheekGrad = ctx.createRadialGradient(300, 620, 15, 300, 620, 110);
    cheekGrad.addColorStop(0, 'rgba(255, 130, 120, 0.32)');
    cheekGrad.addColorStop(1, 'rgba(255, 130, 120, 0)');
    ctx.fillStyle = cheekGrad;
    ctx.fillRect(150, 500, 300, 240);

    const cheekGradR = ctx.createRadialGradient(724, 620, 15, 724, 620, 110);
    cheekGradR.addColorStop(0, 'rgba(255, 130, 120, 0.32)');
    cheekGradR.addColorStop(1, 'rgba(255, 130, 120, 0)');
    ctx.fillStyle = cheekGradR;
    ctx.fillRect(574, 500, 300, 240);

    function drawAnimeEye(cx, cy, isLeft) {
      // Sclera (bright clean white)
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 86, 110, 0, 0, Math.PI * 2);
      ctx.fill();

      // Clip iris inside sclera
      ctx.clip();

      // Cyan-teal gradient iris matching images-2.jpeg
      const irisGrad = ctx.createLinearGradient(cx, cy - 95, cx, cy + 95);
      irisGrad.addColorStop(0, '#043949');
      irisGrad.addColorStop(0.28, '#087f99');
      irisGrad.addColorStop(0.65, '#06b6d4');
      irisGrad.addColorStop(1, '#7ce7f8');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 8, 66, 92, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lower glowing cyan crescent inside iris
      ctx.fillStyle = 'rgba(165, 243, 252, 0.55)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 56, 44, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep dark pupil
      ctx.fillStyle = '#091520';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, 34, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // Primary crisp top-left catchlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx - 24, cy - 34, 20, 25, -0.25, 0, Math.PI * 2);
      ctx.fill();

      // Secondary small bottom-right sparkle
      ctx.beginPath();
      ctx.arc(cx + 24, cy + 44, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Outer eye contour
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#181311';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 86, 110, 0, -Math.PI * 0.12, Math.PI * 1.12, true);
      ctx.stroke();

      // Bold upper eyelash wing
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#110d0b';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, 92, 114, 0, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Delicate lower lash accent
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(24, 19, 17, 0.65)';
      ctx.beginPath();
      ctx.arc(cx, cy + 14, 92, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();

      // Determined expressive eyebrow angled toward bridge
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#2c1910';
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cx - 86, cy - 126);
        ctx.quadraticCurveTo(cx - 10, cy - 156, cx + 82, cy - 112);
      } else {
        ctx.moveTo(cx - 82, cy - 112);
        ctx.quadraticCurveTo(cx + 10, cy - 156, cx + 86, cy - 126);
      }
      ctx.stroke();
    }

    drawAnimeEye(344, 480, true);
    drawAnimeEye(680, 480, false);

    // Subtle nose dot/line
    ctx.strokeStyle = '#b47458';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(510, 588);
    ctx.lineTo(516, 600);
    ctx.stroke();

    // Cheerful open hero grin with white upper teeth and pink tongue
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(392, 650);
    ctx.quadraticCurveTo(512, 672, 632, 650);
    ctx.quadraticCurveTo(618, 780, 512, 785);
    ctx.quadraticCurveTo(406, 780, 392, 650);
    ctx.closePath();
    ctx.fillStyle = '#8b1e24';
    ctx.fill();
    ctx.clip();

    // Upper teeth band
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(390, 646);
    ctx.quadraticCurveTo(512, 674, 634, 646);
    ctx.lineTo(634, 704);
    ctx.quadraticCurveTo(512, 720, 390, 704);
    ctx.closePath();
    ctx.fill();

    // Pink tongue
    ctx.fillStyle = '#f06278';
    ctx.beginPath();
    ctx.ellipse(512, 772, 92, 52, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Crisp mouth outline
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#240b0c';
    ctx.beginPath();
    ctx.moveTo(392, 650);
    ctx.quadraticCurveTo(512, 672, 632, 650);
    ctx.quadraticCurveTo(618, 780, 512, 785);
    ctx.quadraticCurveTo(406, 780, 392, 650);
    ctx.stroke();

    return setSRGBTexture(new THREE.CanvasTexture(canvas));
  }

  // Front white tabard cloth crest texture (checkered red/silver diamond + gold border)
  function createTabardTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 256, 384);

    // Subtle fabric fold shading
    const shade = ctx.createLinearGradient(0, 0, 256, 0);
    shade.addColorStop(0, 'rgba(148, 163, 184, 0.35)');
    shade.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    shade.addColorStop(1, 'rgba(148, 163, 184, 0.35)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, 256, 384);

    // Gold border trim
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 18;
    ctx.strokeRect(9, 9, 238, 366);

    // Checkered 2x2 diamond crest (images-2.jpeg)
    const cx = 128;
    const cy = 192;
    const r = 42;
    const quads = [
      { dx: 0, dy: -r, color: '#dc2626' },
      { dx: r, dy: 0, color: '#94a3b8' },
      { dx: 0, dy: r, color: '#dc2626' },
      { dx: -r, dy: 0, color: '#94a3b8' }
    ];
    quads.forEach((q) => {
      ctx.fillStyle = q.color;
      ctx.beginPath();
      ctx.moveTo(cx + q.dx, cy + q.dy - r * 0.45);
      ctx.lineTo(cx + q.dx + r * 0.45, cy + q.dy);
      ctx.lineTo(cx + q.dx, cy + q.dy + r * 0.45);
      ctx.lineTo(cx + q.dx - r * 0.45, cy + q.dy);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    return setSRGBTexture(new THREE.CanvasTexture(canvas));
  }

  // Painted Henesys sky backdrop gradient (matching 202610291451187649.webp.jpeg)
  function createHenesysSkyTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, '#3a84dc');
    grad.addColorStop(0.38, '#5ca8ef');
    grad.addColorStop(0.72, '#a7d6f9');
    grad.addColorStop(1.0, '#ebf6fd');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 512);
    return setSRGBTexture(new THREE.CanvasTexture(canvas));
  }

  // Henesys meadow top grass + tiny pastel pink/white/yellow blossoms
  function createHenesysGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#68c229';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle organic meadow mottling
    for (let i = 0; i < 650; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#7edd38' : '#53a31e';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 4, 7);
    }

    // Pink, white, and golden meadow flowers (visible on top of platforms in reference)
    const petalColors = ['#fbcfe8', '#ffffff', '#fef08a'];
    for (let i = 0; i < 42; i++) {
      const fx = Math.random() * 490 + 11;
      const fy = Math.random() * 490 + 11;
      ctx.fillStyle = petalColors[i % petalColors.length];
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2.5) {
        ctx.beginPath();
        ctx.arc(fx + Math.cos(a) * 4.5, fy + Math.sin(a) * 4.5, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = setSRGBTexture(new THREE.CanvasTexture(canvas));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 1);
    return tex;
  }

  // Dark soil cross-section with pebbles & strata (matching 202610291451187649.webp.jpeg)
  function createHenesysDirtTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#4f331c');
    grad.addColorStop(0.55, '#3e2715');
    grad.addColorStop(1, '#2b1a0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Subtle earthen pebbles & roots
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 240 + 8;
      const rx = 4 + Math.random() * 14;
      const ry = 3 + Math.random() * 7;
      ctx.fillStyle = i % 3 === 0 ? '#654428' : i % 3 === 1 ? '#321e0f' : '#735334';
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = setSRGBTexture(new THREE.CanvasTexture(canvas));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(8, 1);
    return tex;
  }

  // Straw hay bale woven texture (golden fibers + darker crevices)
  function createStrawTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dcb042';
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.fillStyle = i % 3 === 0 ? '#f3ce63' : i % 3 === 1 ? '#b78924' : '#e6be51';
      ctx.fillRect(x, y, 14 + Math.random() * 16, 2);
    }

    const tex = setSRGBTexture(new THREE.CanvasTexture(canvas));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // Mushroom polka-dot cap texture
  function createMushroomCapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ff8524');
    grad.addColorStop(0.55, '#ff5d14');
    grad.addColorStop(1, '#c93800');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#fff9ee';
    const spots = [
      [110, 210, 34], [256, 175, 42], [405, 220, 32],
      [60, 330, 28], [185, 345, 36], [335, 335, 34],
      [460, 340, 26], [125, 435, 24], [275, 440, 28], [400, 430, 22]
    ];
    spots.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = setSRGBTexture(new THREE.CanvasTexture(canvas));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // Procedural daylight studio/meadow environment map for realistic metallic PBR armor
  MapleModels.createEnvironmentTexture = function (renderer) {
    if (!THREE.PMREMGenerator) return null;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x90cdf4);

    // Bright upper sky sphere
    const skyDome = new THREE.Mesh(
      new THREE.SphereGeometry(20, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0xbde4ff, side: THREE.BackSide })
    );
    envScene.add(skyDome);

    // Warm sun highlight card & soft cool fill card for crisp metal reflections
    const sunCard = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ color: 0xfff8dc, side: THREE.DoubleSide })
    );
    sunCard.position.set(8, 12, 10);
    sunCard.lookAt(0, 0, 0);
    envScene.add(sunCard);

    const coolCard = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 12),
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe, side: THREE.DoubleSide })
    );
    coolCard.position.set(-10, 6, 8);
    coolCard.lookAt(0, 0, 0);
    envScene.add(coolCard);

    const groundCard = new THREE.Mesh(
      new THREE.CircleGeometry(18, 24),
      new THREE.MeshBasicMaterial({ color: 0x4f9128, side: THREE.DoubleSide })
    );
    groundCard.rotation.x = -Math.PI * 0.5;
    groundCard.position.y = -8;
    envScene.add(groundCard);

    const envRT = pmrem.fromScene(envScene, 0.04);
    pmrem.dispose();
    return envRT.texture;
  };

  // =========================================================================
  // 2. DAWN WARRIOR HERO CHARACTER (Sculpted to match images-2.jpeg)
  // =========================================================================

  function createWingFeatherShape(length, width, curve) {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(width * 0.65, length * 0.45, curve, length);
    s.quadraticCurveTo(-width * 0.35, length * 0.55, -width * 0.25, 0);
    s.closePath();
    return s;
  }

  // Custom 3D double-edged diamond cross-section broadsword blade
  function createDiamondBladeGeometry() {
    const geo = new THREE.BufferGeometry();
    const wBase = 0.095;
    const wMid = 0.115;
    const tBase = 0.036;
    const tMid = 0.032;
    const yMid = 0.88;
    const yTip = 1.24;

    const L0 = [-wBase, 0, 0];
    const R0 = [wBase, 0, 0];
    const F0 = [0, 0, tBase];
    const B0 = [0, 0, -tBase];

    const L1 = [-wMid, yMid, 0];
    const R1 = [wMid, yMid, 0];
    const F1 = [0, yMid, tMid];
    const B1 = [0, yMid, -tMid];

    const TIP = [0, yTip, 0];

    const verts = [];
    function pushTri(a, b, c) {
      verts.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    }
    function pushQuad(a, b, c, d) {
      pushTri(a, b, c);
      pushTri(a, c, d);
    }

    // Main shaft facets (4 beveled planes)
    pushQuad(L0, F0, F1, L1);
    pushQuad(F0, R0, R1, F1);
    pushQuad(R0, B0, B1, R1);
    pushQuad(B0, L0, L1, B1);

    // Tapered diamond tip
    pushTri(L1, F1, TIP);
    pushTri(F1, R1, TIP);
    pushTri(R1, B1, TIP);
    pushTri(B1, L1, TIP);

    // Bottom cap
    pushTri(L0, R0, F0);
    pushTri(R0, L0, B0);

    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }

  // Curved 3D draped red cape with ruffled hem
  function createDrapedCapeGeometry() {
    const segX = 14;
    const segY = 16;
    const positions = [];
    const indices = [];

    for (let iy = 0; iy <= segY; iy++) {
      const v = iy / segY; // 0 top, 1 bottom
      const y = -v * 0.96;
      const halfW = 0.25 + v * 0.32;
      const curveBack = -0.04 - Math.sin(v * Math.PI * 0.65) * 0.28 - v * 0.16;

      for (let ix = 0; ix <= segX; ix++) {
        const u = ix / segX; // 0 left, 1 right
        const nx = (u - 0.5) * 2;
        const x = nx * halfW;
        // Billow + pleat waves + tattered edge notch at bottom
        const fold = Math.sin(nx * Math.PI * 2.5) * 0.045 * v;
        const arch = (1 - nx * nx) * 0.06 * v;
        const tatter = v > 0.85 ? -Math.abs(Math.sin(nx * Math.PI * 3)) * 0.06 * ((v - 0.85) / 0.15) : 0;
        positions.push(x, y + tatter, curveBack - fold - arch);
      }
    }

    for (let iy = 0; iy < segY; iy++) {
      for (let ix = 0; ix < segX; ix++) {
        const a = iy * (segX + 1) + ix;
        const b = a + 1;
        const c = (iy + 1) * (segX + 1) + ix;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }

  MapleModels.createPlayer = function () {
    const root = new THREE.Group();
    root.name = 'DawnWarrior';

    // Materials tuned for realistic PBR sheen under PMREM environment
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.22
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.82,
      roughness: 0.32
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0x78350f,
      emissiveIntensity: 0.12,
      metalness: 0.86,
      roughness: 0.24
    });

    const bluePlateMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.55,
      roughness: 0.28
    });

    const underSuitMat = new THREE.MeshStandardMaterial({
      color: 0x1e242c,
      roughness: 0.72,
      metalness: 0.1
    });

    const redCapeMat = new THREE.MeshStandardMaterial({
      color: 0xc82323,
      roughness: 0.72,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x3b2317,
      roughness: 0.58,
      metalness: 0.05
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffe0cc,
      roughness: 0.48,
      metalness: 0.02
    });

    const gemEmeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.1
    });

    const gemBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.42,
      metalness: 0.85,
      roughness: 0.1
    });

    const gemRubyMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.42,
      metalness: 0.82,
      roughness: 0.12
    });

    const gemAmberMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x9a3412,
      emissiveIntensity: 0.35,
      metalness: 0.78,
      roughness: 0.16
    });

    // Chibi waist/chest center group (feet touch y = 0)
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 0.78;
    root.add(bodyGroup);

    // ---------------------------------------------------------------------
    // A. TORSO ARMOR, CHEST CHAIN, TABARD, TASSETS & 3D CAPE
    // ---------------------------------------------------------------------
    // Contoured breastplate silhouette via LatheGeometry
    const torsoPts = [
      new THREE.Vector2(0.01, -0.22),
      new THREE.Vector2(0.28, -0.22),
      new THREE.Vector2(0.27, -0.05),
      new THREE.Vector2(0.32, 0.12),
      new THREE.Vector2(0.31, 0.24),
      new THREE.Vector2(0.20, 0.28),
      new THREE.Vector2(0.01, 0.28)
    ];
    const chestGeo = new THREE.LatheGeometry(torsoPts, 24);
    chestGeo.scale(1.05, 1.0, 0.88);
    const chest = new THREE.Mesh(chestGeo, steelMat);
    chest.castShadow = true;
    bodyGroup.add(chest);

    // Royal blue upper collar / yoke
    const yokeGeo = new THREE.CylinderGeometry(0.23, 0.32, 0.14, 20);
    yokeGeo.scale(1.06, 1.0, 0.9);
    const yoke = new THREE.Mesh(yokeGeo, bluePlateMat);
    yoke.position.y = 0.21;
    bodyGroup.add(yoke);

    // Gold collarbone filigree rim
    const collarRim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.024, 10, 24), goldMat);
    collarRim.rotation.x = Math.PI * 0.5;
    collarRim.scale.set(1.06, 0.9, 1);
    collarRim.position.y = 0.16;
    bodyGroup.add(collarRim);

    // Twin shoulder chest clasps (gold + ruby diamonds) connected by silver curb chain
    [-1, 1].forEach((side) => {
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), goldMat);
      clasp.rotation.z = Math.PI * 0.25;
      clasp.position.set(side * 0.17, 0.15, 0.26);
      const claspGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.025), gemRubyMat);
      claspGem.position.set(side * 0.17, 0.15, 0.285);
      bodyGroup.add(clasp, claspGem);
    });
    for (let i = -3; i <= 3; i++) {
      const t = i / 3;
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.008, 6, 12), steelMat);
      link.position.set(t * 0.13, 0.08 + t * t * 0.06, 0.285 - t * t * 0.02);
      link.rotation.y = (i % 2) * 0.8;
      bodyGroup.add(link);
    }

    // Brown leather belt & golden winged diamond buckle
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x5c3419, roughness: 0.55 });
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.31, 0.09, 20), beltMat);
    belt.scale.set(1.05, 1, 0.9);
    belt.position.y = -0.15;
    bodyGroup.add(belt);

    const buckleBase = new THREE.Mesh(new THREE.OctahedronGeometry(0.065), goldMat);
    buckleBase.scale.set(1.1, 1.2, 0.45);
    buckleBase.position.set(0, -0.15, 0.285);
    bodyGroup.add(buckleBase);
    [-1, 1].forEach((dir) => {
      const bw = new THREE.Mesh(
        new THREE.ExtrudeGeometry(createWingFeatherShape(0.11, 0.04, dir * 0.05), { depth: 0.015, bevelEnabled: false }),
        goldMat
      );
      bw.rotation.z = -dir * 0.85;
      bw.position.set(dir * 0.04, -0.15, 0.28);
      bodyGroup.add(bw);
    });

    // Front White Knight Tabard with checkered crest
    const tabardShape = new THREE.Shape();
    tabardShape.moveTo(-0.12, 0);
    tabardShape.lineTo(0.12, 0);
    tabardShape.lineTo(0.145, -0.32);
    tabardShape.lineTo(0, -0.39);
    tabardShape.lineTo(-0.145, -0.32);
    tabardShape.closePath();
    const tabardGeo = new THREE.ExtrudeGeometry(tabardShape, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 });
    const tabardMat = new THREE.MeshStandardMaterial({ map: createTabardTexture(), roughness: 0.6 });
    const tabard = new THREE.Mesh(tabardGeo, tabardMat);
    tabard.position.set(0, -0.17, 0.255);
    tabard.rotation.x = -0.14;
    tabard.castShadow = true;
    bodyGroup.add(tabard);

    // Royal blue hip tassets with gold trim & green diamond accent
    [-1, 1].forEach((dir) => {
      const tassetGroup = new THREE.Group();
      const tassetShape = new THREE.Shape();
      tassetShape.moveTo(-0.12, 0.14);
      tassetShape.lineTo(0.12, 0.14);
      tassetShape.lineTo(0.15, -0.14);
      tassetShape.lineTo(0, -0.2);
      tassetShape.lineTo(-0.15, -0.14);
      tassetShape.closePath();

      const tasset = new THREE.Mesh(
        new THREE.ExtrudeGeometry(tassetShape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }),
        bluePlateMat
      );
      const tassetRim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.045), goldMat);
      tassetRim.position.y = -0.13;
      const scaleGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.035), gemEmeraldMat);
      scaleGem.position.set(0, -0.03, 0.035);

      tassetGroup.add(tasset, tassetRim, scaleGem);
      tassetGroup.position.set(dir * 0.24, -0.22, 0.11);
      tassetGroup.rotation.y = dir * 0.55;
      tassetGroup.rotation.z = -dir * 0.22;
      bodyGroup.add(tassetGroup);
    });

    // Billowing 3D Draped Red Hero Cape
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 0.22, -0.21);
    const capeMesh = new THREE.Mesh(createDrapedCapeGeometry(), redCapeMat);
    capeMesh.castShadow = true;
    capeGroup.add(capeMesh);
    // Gold cape clasp trim at shoulders
    const capeCollar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 8, 20, Math.PI), goldMat);
    capeCollar.rotation.x = Math.PI * 0.42;
    capeCollar.rotation.z = Math.PI;
    capeCollar.position.set(0, 0.03, 0.04);
    capeGroup.add(capeCollar);
    bodyGroup.add(capeGroup);

    // ---------------------------------------------------------------------
    // B. CHIBI HEAD, CURVED FACE, DUAL-JEWELRY EARS, HAIR & WINGED HELMET
    // ---------------------------------------------------------------------
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.72, 0.02);
    bodyGroup.add(headGroup);

    // Chibi head core (wide rosy cheeks)
    const headGeo = new THREE.SphereGeometry(0.47, 32, 26);
    headGeo.scale(1.06, 0.96, 1.0);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Curved spherical face shell (never clips or floats like a flat plane!)
    const facePatchGeo = new THREE.SphereGeometry(
      0.474,
      32,
      24,
      Math.PI * 0.26,
      Math.PI * 0.48,
      Math.PI * 0.24,
      Math.PI * 0.54
    );
    facePatchGeo.scale(1.06, 0.96, 1.0);
    const facePatchMat = new THREE.MeshStandardMaterial({
      map: createDawnWarriorFaceTexture(),
      roughness: 0.42,
      metalness: 0.02
    });
    const facePatch = new THREE.Mesh(facePatchGeo, facePatchMat);
    headGroup.add(facePatch);

    // Both ears peeking below cheekguards + dual jewelry on left ear (+X)
    [-1, 1].forEach((side) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 12), skinMat);
      ear.scale.set(0.55, 1.05, 0.85);
      ear.position.set(side * 0.485, -0.08, -0.02);
      ear.rotation.z = -side * 0.2;
      headGroup.add(ear);

      if (side === 1) {
        // Silver hoop earring at lower lobe (matches images-2.jpeg viewer's right)
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.011, 8, 18), steelMat);
        hoop.position.set(0.505, -0.16, -0.01);
        hoop.rotation.y = Math.PI * 0.42;
        headGroup.add(hoop);

        // Small golden winged ear cuff higher up on the helix
        const cuff = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.075, 5), goldMat);
        cuff.rotation.z = -1.1;
        cuff.position.set(0.52, -0.04, -0.02);
        headGroup.add(cuff);
      }
    });

    // Spiky Espresso-Brown Anime Hair (bursting above/behind helmet + bangs under visor)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Full back & upper hair dome
    const backHairGeo = new THREE.SphereGeometry(0.495, 24, 18, Math.PI * 0.62, Math.PI * 1.76, 0.1, Math.PI * 0.72);
    backHairGeo.scale(1.06, 1.02, 1.04);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, 0.04, -0.04);
    hairGroup.add(backHair);

    // Sculpted extruded bang locks sweeping down over the brow from beneath the circlet
    function createSpikeMesh(length, width, depth) {
      const s = new THREE.Shape();
      s.moveTo(-width * 0.5, 0);
      s.quadraticCurveTo(-width * 0.25, length * 0.6, 0, length);
      s.quadraticCurveTo(width * 0.35, length * 0.55, width * 0.5, 0);
      s.closePath();
      const geo = new THREE.ExtrudeGeometry(s, {
        depth,
        bevelEnabled: true,
        bevelThickness: depth * 0.35,
        bevelSize: width * 0.14,
        bevelSegments: 2
      });
      geo.center();
      return new THREE.Mesh(geo, hairMat);
    }

    // Top crown spiky anime hair (fanning dynamically above helmet just like images-2.jpeg)
    const topSpikes = [
      { pos: [-0.30, 0.48, 0.05], rot: [0.18, 0.1, 0.65], len: 0.42, w: 0.18, d: 0.09 },
      { pos: [-0.18, 0.56, 0.10], rot: [0.22, 0.08, 0.38], len: 0.50, w: 0.20, d: 0.10 },
      { pos: [-0.04, 0.60, 0.11], rot: [0.24, 0.0, 0.12], len: 0.54, w: 0.22, d: 0.10 },
      { pos: [0.12, 0.57, 0.09], rot: [0.20, -0.1, -0.18], len: 0.48, w: 0.20, d: 0.09 },
      { pos: [0.27, 0.50, 0.02], rot: [0.14, -0.18, -0.46], len: 0.40, w: 0.18, d: 0.09 },
      { pos: [-0.26, 0.44, -0.18], rot: [-0.25, 0.15, 0.52], len: 0.44, w: 0.20, d: 0.10 },
      { pos: [0.0, 0.52, -0.22], rot: [-0.30, 0.0, 0.05], len: 0.46, w: 0.22, d: 0.10 },
      { pos: [0.25, 0.44, -0.18], rot: [-0.25, -0.15, -0.45], len: 0.42, w: 0.20, d: 0.10 }
    ];
    topSpikes.forEach((sp) => {
      const m = createSpikeMesh(sp.len, sp.w, sp.d);
      m.position.set(sp.pos[0], sp.pos[1], sp.pos[2]);
      m.rotation.set(sp.rot[0], sp.rot[1], sp.rot[2]);
      m.castShadow = true;
      hairGroup.add(m);
    });

    // Forehead hanging bangs peeking below the silver circlet
    const bangSpikes = [
      { pos: [-0.24, 0.24, 0.43], rot: [2.85, 0, -0.25], len: 0.22, w: 0.13, d: 0.05 },
      { pos: [-0.11, 0.27, 0.46], rot: [2.85, 0, -0.12], len: 0.24, w: 0.13, d: 0.05 },
      { pos: [0.14, 0.26, 0.45], rot: [2.85, 0, 0.18], len: 0.21, w: 0.12, d: 0.05 },
      { pos: [0.28, 0.22, 0.40], rot: [2.82, 0, 0.34], len: 0.19, w: 0.11, d: 0.05 }
    ];
    bangSpikes.forEach((sp) => {
      const m = createSpikeMesh(sp.len, sp.w, sp.d);
      m.position.set(sp.pos[0], sp.pos[1], sp.pos[2]);
      m.rotation.set(sp.rot[0], sp.rot[1], sp.rot[2]);
      hairGroup.add(m);
    });

    // Lower nape hair tufts behind cheekguards
    [-1, 1].forEach((dir) => {
      const nape = createSpikeMesh(0.22, 0.14, 0.06);
      nape.position.set(dir * 0.34, -0.28, -0.28);
      nape.rotation.set(2.55, 0, dir * 0.4);
      hairGroup.add(nape);
    });

    // Winged Knight Circlet & Cheekguards (images-2.jpeg)
    const helmetGroup = new THREE.Group();
    headGroup.add(helmetGroup);

    // Silver brow circlet shell around temples & forehead
    const browBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.495, 0.505, 0.15, 32, 1, true, Math.PI * 0.22, Math.PI * 1.56),
      steelMat
    );
    browBand.position.set(0, 0.20, 0.01);
    helmetGroup.add(browBand);

    // Upper & lower gold trim bands along the circlet
    [0.27, 0.13].forEach((ry) => {
      const trimArc = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.02, 8, 32, Math.PI * 1.3), goldMat);
      trimArc.rotation.x = Math.PI * 0.5;
      trimArc.rotation.z = -Math.PI * 0.15;
      trimArc.position.set(0, ry, 0.02);
      helmetGroup.add(trimArc);
    });

    // Contoured Cheekguards (silver outer + gold inner border hugging cheeks)
    [-1, 1].forEach((dir) => {
      const cgShape = new THREE.Shape();
      cgShape.moveTo(0, 0.14);
      cgShape.lineTo(0.16, 0.12);
      cgShape.lineTo(0.14, -0.22);
      cgShape.lineTo(0.02, -0.32);
      cgShape.lineTo(-0.04, -0.18);
      cgShape.closePath();

      const cgMesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(cgShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }),
        steelMat
      );
      cgMesh.position.set(dir * 0.41, 0.02, 0.22);
      cgMesh.rotation.y = dir * 1.15;
      helmetGroup.add(cgMesh);

      const cgTrim = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.34, 0.055), goldMat);
      cgTrim.position.set(dir * 0.37, -0.06, 0.32);
      cgTrim.rotation.y = dir * 0.55;
      cgTrim.rotation.z = dir * 0.14;
      helmetGroup.add(cgTrim);
    });

    // Center Winged Emerald Forehead Crest (sweeping down into V-peak)
    const browCrest = new THREE.Group();
    browCrest.position.set(0, 0.18, 0.49);

    const vPlateShape = new THREE.Shape();
    vPlateShape.moveTo(0, 0.12);
    vPlateShape.lineTo(0.14, 0.04);
    vPlateShape.lineTo(0, -0.13);
    vPlateShape.lineTo(-0.14, 0.04);
    vPlateShape.closePath();
    const vPlate = new THREE.Mesh(
      new THREE.ExtrudeGeometry(vPlateShape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }),
      goldMat
    );
    browCrest.add(vPlate);

    const emeraldDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.068), gemEmeraldMat);
    emeraldDiamond.scale.set(0.75, 1.25, 0.5);
    emeraldDiamond.position.set(0, 0.01, 0.04);
    browCrest.add(emeraldDiamond);

    // Mini brow wings flanking emerald
    [-1, 1].forEach((dir) => {
      const miniWing = new THREE.Mesh(
        new THREE.ExtrudeGeometry(createWingFeatherShape(0.14, 0.055, dir * 0.05), { depth: 0.015, bevelEnabled: false }),
        goldMat
      );
      miniWing.rotation.z = -dir * 1.05;
      miniWing.position.set(dir * 0.06, 0.01, 0.02);
      browCrest.add(miniWing);
    });
    helmetGroup.add(browCrest);

    // Large Sculpted Side Temple Hubs + Amber Cabochons + 3-Feather Swept Golden Wings
    [-1, 1].forEach((dir) => {
      const templeGroup = new THREE.Group();
      templeGroup.position.set(dir * 0.49, 0.19, -0.02);

      const hubRing = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.05, 20), steelMat);
      hubRing.rotation.z = Math.PI * 0.5;
      templeGroup.add(hubRing);

      const hubInner = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.06, 16), darkSteelMat);
      hubInner.rotation.z = Math.PI * 0.5;
      templeGroup.add(hubInner);

      const amberStud = new THREE.Mesh(new THREE.OctahedronGeometry(0.065), gemAmberMat);
      amberStud.scale.set(0.75, 1.0, 1.0);
      amberStud.position.x = dir * 0.035;
      templeGroup.add(amberStud);

      // 3 distinct swept golden wing feathers rising up & back
      const featherSpecs = [
        { len: 0.44, w: 0.11, curve: dir * 0.08, rz: -dir * 0.42, ry: -dir * 0.25, py: 0.06, pz: -0.03 },
        { len: 0.34, w: 0.095, curve: dir * 0.06, rz: -dir * 0.68, ry: -dir * 0.28, py: 0.02, pz: -0.07 },
        { len: 0.25, w: 0.08, curve: dir * 0.04, rz: -dir * 0.95, ry: -dir * 0.30, py: -0.02, pz: -0.10 }
      ];
      featherSpecs.forEach((f) => {
        const fGeo = new THREE.ExtrudeGeometry(createWingFeatherShape(f.len, f.w, f.curve), {
          depth: 0.024,
          bevelEnabled: true,
          bevelThickness: 0.006,
          bevelSize: 0.006,
          bevelSegments: 2
        });
        const feather = new THREE.Mesh(fGeo, goldMat);
        feather.position.set(dir * 0.02, f.py, f.pz);
        feather.rotation.set(-0.18, f.ry, f.rz);
        feather.castShadow = true;
        templeGroup.add(feather);
      });

      helmetGroup.add(templeGroup);
    });

    // ---------------------------------------------------------------------
    // C. LEFT ARM + ARTICULATED GAUNTLET + 3D BEVELED KITE SHIELD
    // ---------------------------------------------------------------------
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.37, 0.18, 0.02);

    // Royal blue shoulder pauldron with gold border & wing accent
    const leftPauldron = new THREE.Mesh(new THREE.SphereGeometry(0.165, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), bluePlateMat);
    leftPauldron.rotation.z = 0.35;
    leftPauldron.position.set(-0.02, 0.04, 0);
    leftArmGroup.add(leftPauldron);
    const leftPauldronTrim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.022, 8, 20), goldMat);
    leftPauldronTrim.rotation.x = Math.PI * 0.5;
    leftPauldronTrim.rotation.y = -0.35;
    leftPauldronTrim.position.set(-0.04, -0.01, 0);
    leftArmGroup.add(leftPauldronTrim);

    // Dark sleeve + flared silver/gold gauntlet cuff + cyan gem
    const leftSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.075, 0.24, 12), underSuitMat);
    leftSleeve.position.y = -0.13;
    leftSleeve.castShadow = true;
    leftArmGroup.add(leftSleeve);

    const leftCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.088, 0.18, 14), steelMat);
    leftCuff.position.y = -0.28;
    const leftCuffTrim = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 8, 18), goldMat);
    leftCuffTrim.rotation.x = Math.PI * 0.5;
    leftCuffTrim.position.y = -0.21;
    const leftWristGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.032), gemBlueMat);
    leftWristGem.position.set(-0.09, -0.26, 0.04);
    leftArmGroup.add(leftCuff, leftCuffTrim, leftWristGem);

    // 3D Beveled Kite Shield (images-2.jpeg: gold frame, eagle wings, emerald top, ruby center)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.18, -0.26, 0.22);
    shieldGroup.rotation.set(0.08, Math.PI * 0.36, 0.05);

    const shieldOuterShape = new THREE.Shape();
    shieldOuterShape.moveTo(0, 0.54);
    shieldOuterShape.lineTo(0.42, 0.38);
    shieldOuterShape.lineTo(0.36, -0.08);
    shieldOuterShape.lineTo(0, -0.62);
    shieldOuterShape.lineTo(-0.36, -0.08);
    shieldOuterShape.lineTo(-0.42, 0.38);
    shieldOuterShape.closePath();

    const shieldBaseGeo = new THREE.ExtrudeGeometry(shieldOuterShape, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 2
    });
    const shieldBodyMat = new THREE.MeshStandardMaterial({
      color: 0xc2b28f,
      metalness: 0.72,
      roughness: 0.28
    });
    const shieldMesh = new THREE.Mesh(shieldBaseGeo, shieldBodyMat);
    shieldMesh.castShadow = true;
    shieldGroup.add(shieldMesh);

    // Raised Golden Shield Frame
    const framePts = shieldOuterShape.getPoints(24);
    for (let i = 0; i < framePts.length - 1; i++) {
      const a = framePts[i];
      const b = framePts[i + 1];
      const len = a.distanceTo(b);
      const midX = (a.x + b.x) * 0.5;
      const midY = (a.y + b.y) * 0.5;
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(len + 0.03, 0.055, 0.08), goldMat);
      bar.position.set(midX, midY, 0.035);
      bar.rotation.z = ang;
      shieldGroup.add(bar);
    }

    // Top Emerald Crest Gem
    const shieldEmerald = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), gemEmeraldMat);
    shieldEmerald.scale.set(0.75, 1.25, 0.55);
    shieldEmerald.position.set(0, 0.42, 0.075);
    shieldGroup.add(shieldEmerald);

    // 3D Sculpted Golden Eagle Crest + Wings across Shield Face
    const eagleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.36, 12), goldMat);
    eagleBody.position.set(0, -0.06, 0.07);
    shieldGroup.add(eagleBody);
    [-1, 1].forEach((dir) => {
      for (let f = 0; f < 3; f++) {
        const wingF = new THREE.Mesh(
          new THREE.ExtrudeGeometry(createWingFeatherShape(0.30 - f * 0.05, 0.085, dir * 0.06), {
            depth: 0.025,
            bevelEnabled: false
          }),
          goldMat
        );
        wingF.position.set(dir * 0.04, 0.04 - f * 0.06, 0.06);
        wingF.rotation.z = -dir * (0.95 + f * 0.22);
        shieldGroup.add(wingF);
      }
    });

    // Glowing Ruby Cabochon Center
    const shieldRuby = new THREE.Mesh(new THREE.SphereGeometry(0.082, 16, 14), gemRubyMat);
    shieldRuby.scale.set(0.72, 1.28, 0.5);
    shieldRuby.position.set(0, -0.07, 0.095);
    shieldGroup.add(shieldRuby);

    leftArmGroup.add(shieldGroup);
    bodyGroup.add(leftArmGroup);

    // ---------------------------------------------------------------------
    // D. RIGHT ARM + SEGMENTED GAUNTLET + 3D BEVELED BROADWORD
    // ---------------------------------------------------------------------
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.37, 0.18, 0.02);

    const rightPauldron = leftPauldron.clone();
    rightPauldron.rotation.z = -0.35;
    rightPauldron.position.set(0.02, 0.04, 0);
    rightArmGroup.add(rightPauldron);
    const rightPauldronTrim = leftPauldronTrim.clone();
    rightPauldronTrim.rotation.y = 0.35;
    rightPauldronTrim.position.set(0.04, -0.01, 0);
    rightArmGroup.add(rightPauldronTrim);

    const rightSleeve = leftSleeve.clone();
    rightArmGroup.add(rightSleeve);

    const rightCuff = leftCuff.clone();
    const rightCuffTrim = leftCuffTrim.clone();
    const rightWristGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.032), gemBlueMat);
    rightWristGem.position.set(0.09, -0.26, 0.04);
    rightArmGroup.add(rightCuff, rightCuffTrim, rightWristGem);

    // Articulated silver gauntlet knuckles gripping hilt
    for (let k = 0; k < 4; k++) {
      const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 10), steelMat);
      knuckle.rotation.z = Math.PI * 0.5;
      knuckle.position.set(0.02, -0.37 - k * 0.035, 0.08);
      rightArmGroup.add(knuckle);
    }

    // Knight Broadsword (images-2.jpeg)
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0.02, -0.38, 0.10);
    swordGroup.rotation.x = Math.PI * 0.08;

    const bladeGeo = createDiamondBladeGeometry();
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.94,
      roughness: 0.12
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.04;
    blade.castShadow = true;
    swordGroup.add(blade);

    // Golden spine accent rising along center blade base
    const goldSpine = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.32, 4), goldMat);
    goldSpine.rotation.y = Math.PI * 0.25;
    goldSpine.scale.set(0.9, 1.0, 0.45);
    goldSpine.position.set(0, 0.2, 0);
    swordGroup.add(goldSpine);

    // Royal Blue Flared Winged Crossguard with gold trim & teal gem
    [-1, 1].forEach((dir) => {
      const guardWingShape = new THREE.Shape();
      guardWingShape.moveTo(0, -0.05);
      guardWingShape.lineTo(dir * 0.22, -0.10);
      guardWingShape.lineTo(dir * 0.24, 0.08);
      guardWingShape.lineTo(dir * 0.06, 0.04);
      guardWingShape.closePath();
      const gWing = new THREE.Mesh(
        new THREE.ExtrudeGeometry(guardWingShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }),
        bluePlateMat
      );
      gWing.position.set(0, 0.02, -0.025);
      swordGroup.add(gWing);
    });
    const guardCore = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.08), goldMat);
    guardCore.position.y = 0.02;
    const guardGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045), gemEmeraldMat);
    guardGem.scale.set(0.8, 1.2, 0.5);
    guardGem.position.set(0, 0.02, 0.048);
    swordGroup.add(guardCore, guardGem);

    // Grip & Gold Ring Pommel + Red Cord Loop
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.24, 12), underSuitMat);
    grip.position.y = -0.14;
    const pommelRing = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.018, 8, 18), goldMat);
    pommelRing.position.y = -0.28;
    const redCord = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.01, 6, 12), redCapeMat);
    redCord.position.set(-0.02, -0.33, 0);
    swordGroup.add(grip, pommelRing, redCord);

    rightArmGroup.add(swordGroup);
    bodyGroup.add(rightArmGroup);

    // ---------------------------------------------------------------------
    // E. LEGS, WINGED KNEE GUARDS & CRESTED STEEL SABATONS
    // ---------------------------------------------------------------------
    function createLegAssembly(dir) {
      const legGroup = new THREE.Group();
      legGroup.position.set(dir * 0.17, -0.22, 0);

      // Dark thigh
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.095, 0.22, 14), underSuitMat);
      thigh.position.y = -0.11;
      thigh.castShadow = true;
      legGroup.add(thigh);

      // Steel shin greave + gold cuff band
      const greave = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.13, 0.24, 16), steelMat);
      greave.position.y = -0.32;
      greave.castShadow = true;
      const greaveGold = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.125, 0.05, 16), goldMat);
      greaveGold.position.y = -0.24;
      legGroup.add(greave, greaveGold);

      // Gold-framed Royal Blue Diamond Knee Guard + mini gold side winglet
      const kneePlate = new THREE.Mesh(new THREE.OctahedronGeometry(0.082), goldMat);
      kneePlate.scale.set(0.95, 1.15, 0.45);
      kneePlate.position.set(0, -0.21, 0.115);
      const kneeBlue = new THREE.Mesh(new THREE.OctahedronGeometry(0.062), bluePlateMat);
      kneeBlue.scale.set(0.9, 1.1, 0.48);
      kneeBlue.position.set(0, -0.21, 0.126);
      const kneeWing = new THREE.Mesh(
        new THREE.ExtrudeGeometry(createWingFeatherShape(0.10, 0.04, dir * 0.04), { depth: 0.015, bevelEnabled: false }),
        goldMat
      );
      kneeWing.rotation.z = -dir * 0.7;
      kneeWing.position.set(dir * 0.07, -0.20, 0.08);
      legGroup.add(kneePlate, kneeBlue, kneeWing);

      // Rounded Armored Steel Sabaton Boot + Toe Wing Crest + Teal Gem
      const bootBody = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.14, 0.16, 16), steelMat);
      bootBody.position.set(0, -0.48, 0.02);
      const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 12), steelMat);
      toeCap.scale.set(1.0, 0.85, 1.55);
      toeCap.position.set(0, -0.49, 0.10);
      toeCap.castShadow = true;
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.045, 0.36), underSuitMat);
      sole.position.set(0, -0.545, 0.08);

      // Toe crest gem & mini silver wing emblem
      const toeGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.028), gemEmeraldMat);
      toeGem.position.set(0, -0.45, 0.24);
      const ankleWing = new THREE.Mesh(
        new THREE.ExtrudeGeometry(createWingFeatherShape(0.11, 0.04, dir * 0.03), { depth: 0.014, bevelEnabled: false }),
        goldMat
      );
      ankleWing.rotation.z = -dir * 0.65;
      ankleWing.position.set(dir * 0.11, -0.42, -0.02);

      legGroup.add(bootBody, toeCap, sole, toeGem, ankleWing);
      return legGroup;
    }

    const leftLegGroup = createLegAssembly(-1);
    const rightLegGroup = createLegAssembly(1);
    bodyGroup.add(leftLegGroup, rightLegGroup);

    // ---------------------------------------------------------------------
    // F. DYNAMIC DAWN WARRIOR SLASH ARC (Cyan & Golden Crescent)
    // ---------------------------------------------------------------------
    const slashShape = new THREE.Shape();
    slashShape.absarc(0, 0, 1.75, -Math.PI * 0.46, Math.PI * 0.46, false);
    slashShape.absarc(0, 0, 1.18, Math.PI * 0.46, -Math.PI * 0.46, true);
    const slashGeo = new THREE.ShapeGeometry(slashShape);
    const slashMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const slashArc = new THREE.Mesh(slashGeo, slashMat);
    slashArc.rotation.y = Math.PI * 0.5;
    slashArc.position.set(0.35, 0.85, 0.65);
    slashArc.visible = false;
    root.add(slashArc);

    const innerSlashMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const innerSlash = new THREE.Mesh(slashGeo, innerSlashMat);
    innerSlash.scale.set(0.84, 0.84, 0.84);
    slashArc.add(innerSlash);

    root.userData.sculptRuntime = {
      bodyGroup,
      headGroup,
      capeGroup,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
      swordGroup,
      shieldGroup,
      slashArc,
      innerSlash,
      baseBodyY: 0.78,
      facing: 1
    };

    return root;
  };

  // =========================================================================
  // 3. MONSTER & PET MODELS (202610291451187649.webp.jpeg)
  // =========================================================================

  MapleModels.createOrangeMushroom = function () {
    const root = new THREE.Group();
    root.name = 'OrangeMushroom';

    const stalkGeo = new THREE.CylinderGeometry(0.36, 0.45, 0.56, 24);
    const stalkMat = new THREE.MeshStandardMaterial({ color: 0xfbf3df, roughness: 0.5 });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    stalk.position.y = 0.28;
    stalk.castShadow = true;
    root.add(stalk);

    // Smiling curved eyes + rosy cheeks
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1412 });
    const eyeGeo = new THREE.SphereGeometry(0.052, 12, 10);
    eyeGeo.scale(0.8, 1.7, 0.6);
    [-1, 1].forEach((dir) => {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(dir * 0.14, 0.38, 0.39);
      const spec = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      spec.position.set(dir * 0.14 + 0.01, 0.42, 0.425);
      root.add(eye, spec);
    });

    // Cute smile arc
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 12, Math.PI), eyeMat);
    smile.rotation.x = Math.PI;
    smile.position.set(0, 0.28, 0.415);
    root.add(smile);

    // Smooth dome cap + cream underside collar
    const capGeo = new THREE.SphereGeometry(0.74, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.56);
    capGeo.scale(1.18, 0.92, 1.18);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createMushroomCapTexture(),
      roughness: 0.36
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.55;
    cap.castShadow = true;
    root.add(cap);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.81, 0.075, 14, 32), stalkMat);
    rim.rotation.x = Math.PI * 0.5;
    rim.position.y = 0.53;
    root.add(rim);

    root.userData = {
      kind: 'mushroom',
      maxHp: 90,
      hp: 90,
      exp: 18,
      meso: 35,
      speed: 1.8,
      isAlive: true,
      originalY: 0,
      stalk,
      cap
    };
    return root;
  };

  MapleModels.createGreenSlime = function () {
    const root = new THREE.Group();
    root.name = 'GreenSlime';

    const bodyGeo = new THREE.SphereGeometry(0.49, 26, 20);
    bodyGeo.scale(1.14, 0.86, 1.14);

    const slimeMat = new THREE.MeshPhysicalMaterial({
      color: 0x4ade57,
      emissive: 0x155e1d,
      emissiveIntensity: 0.18,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.88
    });

    const body = new THREE.Mesh(bodyGeo, slimeMat);
    body.position.y = 0.42;
    body.castShadow = true;
    root.add(body);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 14),
      new THREE.MeshBasicMaterial({ color: 0x1ca32c })
    );
    core.position.y = 0.38;
    root.add(core);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    [-1, 1].forEach((dir) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), eyeMat);
      eye.position.set(dir * 0.16, 0.45, 0.46);
      root.add(eye);
    });

    // Red bow tie on crown
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.38 });
    const ribbonCenter = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), ribbonMat);
    ribbonCenter.position.set(0, 0.86, 0);
    [-1, 1].forEach((dir) => {
      const bow = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.19, 8), ribbonMat);
      bow.rotation.z = -dir * Math.PI * 0.5;
      bow.position.set(dir * 0.11, 0.86, 0);
      root.add(bow);
    });
    root.add(ribbonCenter);

    root.userData = {
      kind: 'slime',
      maxHp: 55,
      hp: 55,
      exp: 12,
      meso: 22,
      speed: 2.2,
      isAlive: true,
      body
    };
    return root;
  };

  MapleModels.createPig = function (isBlack) {
    const root = new THREE.Group();
    root.name = isBlack ? 'BlackPig' : 'RibbonPig';

    const bodyMat = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x262d38 : 0xfbcfe8,
      roughness: 0.55
    });
    const snoutMat = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x9ca3af : 0xf472b6,
      roughness: 0.48
    });

    const bodyGeo = new THREE.SphereGeometry(0.50, 22, 18);
    bodyGeo.scale(1.15, 0.88, 1.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.48;
    body.castShadow = true;
    root.add(body);

    const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16), snoutMat);
    snout.rotation.x = Math.PI * 0.5;
    snout.position.set(0, 0.44, 0.58);
    root.add(snout);

    const nostrilMat = new THREE.MeshBasicMaterial({ color: isBlack ? 0x111827 : 0x831843 });
    [-1, 1].forEach((dir) => {
      const nos = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), nostrilMat);
      nos.position.set(dir * 0.055, 0.44, 0.645);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      eye.position.set(dir * 0.16, 0.56, 0.49);
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 6), bodyMat);
      ear.rotation.z = -dir * 0.55;
      ear.position.set(dir * 0.28, 0.76, 0.22);
      // Four tiny trotters
      [-0.22, 0.22].forEach((tz) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.18, 10), snoutMat);
        leg.position.set(dir * 0.2, 0.09, tz);
        root.add(leg);
      });
      root.add(nos, eye, ear);
    });

    if (!isBlack) {
      // Pink Ribbon Pig red bow behind ears
      const bowMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
      const bow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), bowMat);
      bow.position.set(0, 0.85, -0.05);
      root.add(bow);
    }

    const tail = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 16, Math.PI * 1.5), snoutMat);
    tail.position.set(0, 0.52, -0.60);
    root.add(tail);

    root.userData = {
      kind: 'pig',
      maxHp: 120,
      hp: 120,
      exp: 26,
      meso: 50,
      speed: 2.5,
      isAlive: true,
      body
    };
    return root;
  };

  // Ambient White Bunny pet (bottom right of 202610291451187649.webp.jpeg)
  MapleModels.createWhiteBunny = function () {
    const group = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf9a8d4, roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), furMat);
    body.scale.set(1.0, 0.9, 1.15);
    body.position.y = 0.24;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 14), furMat);
    head.position.set(0, 0.48, 0.16);

    [-1, 1].forEach((dir) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.34, 10), furMat);
      ear.position.set(dir * 0.09, 0.74, 0.12);
      ear.rotation.z = -dir * 0.15;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      eye.position.set(dir * 0.09, 0.50, 0.36);
      group.add(ear, eye);
    });
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), pinkMat);
    nose.position.set(0, 0.46, 0.38);
    group.add(body, head, nose);
    return group;
  };

  // =========================================================================
  // 4. EXACT HENESYS ENVIRONMENT PROPS (202610291451187649.webp.jpeg)
  // =========================================================================

  // Multi-tiered Henesys Platform with Scalloped Grass Lip & Rocky Earth
  MapleModels.createPlatform = function (width, height, depth) {
    const group = new THREE.Group();

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createHenesysGrassTexture(),
      roughness: 0.65
    });
    const turfLipMat = new THREE.MeshStandardMaterial({
      color: 0x3b8a1b,
      roughness: 0.72
    });
    const dirtMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createHenesysDirtTexture(),
      roughness: 0.92
    });

    // Top walkable lush meadow crust
    const grass = new THREE.Mesh(new THREE.BoxGeometry(width, 0.32, depth), grassMat);
    grass.position.y = -0.16;
    grass.receiveShadow = true;
    group.add(grass);

    // Rich brown rocky earth cross-section below grass
    const dirtH = Math.max(0.55, height - 0.32);
    const dirt = new THREE.Mesh(new THREE.BoxGeometry(width * 0.99, dirtH, depth * 0.95), dirtMat);
    dirt.position.y = -0.32 - dirtH * 0.5;
    dirt.receiveShadow = true;
    group.add(dirt);

    // Continuous dark-green scalloped turf overhang (rounded lobes matching 202610291451187649.webp.jpeg)
    const lobeGeo = new THREE.SphereGeometry(0.24, 10, 8);
    lobeGeo.scale(1.1, 0.85, 0.65);
    const step = 0.38;
    for (let x = -width * 0.49; x <= width * 0.49; x += step) {
      const lobe = new THREE.Mesh(lobeGeo, turfLipMat);
      const jitterY = Math.sin(x * 3.1) * 0.05;
      lobe.position.set(x, -0.31 + jitterY, depth * 0.485);
      group.add(lobe);
    }

    // Lush rear hedge bushes lining the back edge of the platform
    const bushDarkMat = new THREE.MeshStandardMaterial({ color: 0x2f7d1c, roughness: 0.75 });
    const bushBrightMat = new THREE.MeshStandardMaterial({ color: 0x56b62f, roughness: 0.7 });
    for (let x = -width * 0.46; x <= width * 0.46; x += 2.2) {
      if (Math.sin(x * 1.7) > -0.25) {
        const bGroup = new THREE.Group();
        const r = 0.75 + Math.abs(Math.sin(x * 2.3)) * 0.45;
        const m1 = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), bushDarkMat);
        m1.scale.set(1.2, 0.85, 0.9);
        const m2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.75, 10, 8), bushBrightMat);
        m2.position.set(r * 0.45, r * 0.22, 0.15);
        bGroup.add(m1, m2);
        bGroup.position.set(x, 0.35, -depth * 0.36);
        group.add(bGroup);
      }
    }

    return group;
  };

  // Painted Sky Backdrop + Distant Golden Pasture Hills + Giant Ancient Henesys Oak Tree
  MapleModels.createHenesysBackdrop = function () {
    const backdrop = new THREE.Group();
    backdrop.name = 'HenesysBackdrop';

    // Sky gradient billboard far back
    const skyPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 62),
      new THREE.MeshBasicMaterial({ map: createHenesysSkyTexture(), depthWrite: false })
    );
    skyPlane.position.set(0, 14, -26);
    backdrop.add(skyPlane);

    // Distant blue-green silhouettes + warm ochre/tan sunlit Henesys hills (matching reference horizon!)
    const distantBlueHillMat = new THREE.MeshBasicMaterial({ color: 0x99c4e0 });
    for (let i = -3; i <= 3; i++) {
      const mtn = new THREE.Mesh(new THREE.SphereGeometry(18, 18, 12), distantBlueHillMat);
      mtn.scale.set(1.9, 0.55, 0.4);
      mtn.position.set(i * 18, 1.5, -22);
      backdrop.add(mtn);
    }

    const goldenHillMat = new THREE.MeshStandardMaterial({ color: 0xcab178, roughness: 0.95 });
    for (let i = -4; i <= 4; i++) {
      const hill = new THREE.Mesh(new THREE.SphereGeometry(14, 18, 12), goldenHillMat);
      hill.scale.set(1.85, 0.45, 0.6);
      hill.position.set(i * 13 + 3, -1.2, -16);
      backdrop.add(hill);
    }

    // Giant Ancient Henesys Oak Tree in right-center background (seen behind middle/bottom tiers)
    const oakGroup = new THREE.Group();
    oakGroup.position.set(5.8, -0.5, -6.5);

    const oakBarkMat = new THREE.MeshStandardMaterial({ color: 0x5c3c22, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.85, 9.5, 16), oakBarkMat);
    trunk.position.y = 4.6;
    trunk.castShadow = true;
    oakGroup.add(trunk);

    // Twisted branches
    [-1, 1].forEach((dir) => {
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.8, 4.5, 12), oakBarkMat);
      branch.position.set(dir * 1.9, 7.6, 0.2);
      branch.rotation.z = -dir * 0.72;
      oakGroup.add(branch);
    });

    // Huge lush layered oak canopy
    const oakLeafDark = new THREE.MeshStandardMaterial({ color: 0x2c781d, roughness: 0.78 });
    const oakLeafLight = new THREE.MeshStandardMaterial({ color: 0x4ca929, roughness: 0.72 });
    const canopyPuffs = [
      [0, 10.2, 0, 3.6, true],
      [-3.1, 9.2, 0.3, 2.7, false],
      [3.2, 9.4, 0.2, 2.8, false],
      [-1.5, 11.4, -0.2, 2.5, true],
      [1.8, 11.2, 0.3, 2.4, true],
      [0, 8.6, 0.8, 2.3, false]
    ];
    canopyPuffs.forEach(([x, y, z, r, isLight]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), isLight ? oakLeafLight : oakLeafDark);
      puff.scale.set(1.2, 0.85, 0.85);
      puff.position.set(x, y, z);
      oakGroup.add(puff);
    });

    backdrop.add(oakGroup);
    return backdrop;
  };

  // Climbable Vertical Knotted Rope
  MapleModels.createRope = function (height) {
    const group = new THREE.Group();
    group.name = 'Rope';

    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xb59160, roughness: 0.85 });
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, height, 10), ropeMat);
    rope.position.y = height * 0.5;
    rope.castShadow = true;
    group.add(rope);

    for (let y = 0.65; y < height; y += 0.9) {
      const knot = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.028, 8, 14), ropeMat);
      knot.rotation.x = Math.PI * 0.5;
      knot.position.y = y;
      group.add(knot);
    }
    return group;
  };

  // Climbable Wooden Rung Ladder (top-right of 202610291451187649.webp.jpeg)
  MapleModels.createLadder = function (height) {
    const group = new THREE.Group();
    group.name = 'Ladder';

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.82 });
    [-0.28, 0.28].forEach((rx) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, height, 10), woodMat);
      rail.position.set(rx, height * 0.5, 0);
      rail.castShadow = true;
      group.add(rail);
    });
    for (let y = 0.4; y < height; y += 0.55) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.62, 10), woodMat);
      rung.rotation.z = Math.PI * 0.5;
      rung.position.set(0, y, 0);
      group.add(rung);
    }
    return group;
  };

  // Square Stacked Straw Hay Bales (right side of tiers in 202610291451187649.webp.jpeg)
  MapleModels.createHaystack = function (isDouble) {
    const group = new THREE.Group();
    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStrawTexture(),
      roughness: 0.82
    });
    const twineMat = new THREE.MeshStandardMaterial({ color: 0x5c3614, roughness: 0.9 });

    function addCubeBale(x, y, z, w, h, d) {
      const bale = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), strawMat);
      bale.position.set(x, y + h * 0.5, z);
      bale.castShadow = true;
      bale.receiveShadow = true;
      group.add(bale);

      [-w * 0.26, w * 0.26].forEach((tx) => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.08, h + 0.04, d + 0.04), twineMat);
        strap.position.set(x + tx, y + h * 0.5, z);
        group.add(strap);
      });
    }

    addCubeBale(-0.85, 0, 0, 1.5, 1.1, 1.25);
    addCubeBale(0.75, 0, 0.05, 1.5, 1.1, 1.25);
    addCubeBale(0, 1.1, 0.02, 1.55, 1.05, 1.2);
    if (isDouble) {
      addCubeBale(0.6, 2.15, -0.05, 1.35, 0.95, 1.1);
    }
    return group;
  };

  // Waist-Cinched Upright Golden Wheat Sheaves (bottom tier in 202610291451187649.webp.jpeg)
  MapleModels.createWheatSheaf = function () {
    const group = new THREE.Group();
    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createStrawTexture(),
      roughness: 0.78
    });
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x6b3e19, roughness: 0.85 });

    const pts = [
      new THREE.Vector2(0.01, 0),
      new THREE.Vector2(0.68, 0),
      new THREE.Vector2(0.36, 0.85),
      new THREE.Vector2(0.65, 1.75),
      new THREE.Vector2(0.45, 2.05),
      new THREE.Vector2(0.01, 2.05)
    ];
    const sheaf = new THREE.Mesh(new THREE.LatheGeometry(pts, 18), strawMat);
    sheaf.castShadow = true;
    group.add(sheaf);

    const band = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 8, 20), bandMat);
    band.rotation.x = Math.PI * 0.5;
    band.position.y = 0.85;
    group.add(band);

    return group;
  };

  // Cozy Wooden Thatched Straw Cabin + Hanging Glow Lantern (bottom-right center of reference)
  MapleModels.createThatchedHut = function () {
    const group = new THREE.Group();
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x6b4524, roughness: 0.85 });
    const darkWallMat = new THREE.MeshStandardMaterial({ color: 0x3b2615, roughness: 0.9 });
    const thatchMat = new THREE.MeshStandardMaterial({
      color: 0xd9ad4e,
      map: createStrawTexture(),
      roughness: 0.82
    });

    // Timber base & posts
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, 2.4), darkWallMat);
    body.position.y = 1.05;
    body.castShadow = true;
    group.add(body);

    [-1.65, 1.65].forEach((px) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 2.2, 10), timberMat);
      post.position.set(px, 1.1, 1.18);
      group.add(post);
    });

    // Pitched golden thatched roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.85, 1.65, 4), thatchMat);
    roof.rotation.y = Math.PI * 0.25;
    roof.scale.set(1.15, 1.0, 0.95);
    roof.position.y = 2.8;
    roof.castShadow = true;
    group.add(roof);

    // Warm orange hanging paper lantern under eave
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xff7b29,
      emissive: 0xf97316,
      emissiveIntensity: 0.75,
      roughness: 0.3
    });
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), lanternMat);
    lantern.scale.set(1, 1.25, 1);
    lantern.position.set(0, 1.85, 1.45);
    group.add(lantern);

    return group;
  };

  // Henesys Pink Candy-Colored "ETC" Vendor Stand (far bottom-right of reference)
  MapleModels.createShopHut = function () {
    const group = new THREE.Group();

    const boothMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 });
    const trimPinkMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.4 });
    const interiorMat = new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.7 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xa1622d, roughness: 0.75 });

    // Lower counter + side walls
    const lowerCounter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.1, 2.1), boothMat);
    lowerCounter.position.y = 0.55;
    lowerCounter.castShadow = true;
    group.add(lowerCounter);

    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.14, 2.3), woodMat);
    counterTop.position.y = 1.15;
    group.add(counterTop);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.5, 0.25), interiorMat);
    backWall.position.set(0, 1.9, -0.85);
    group.add(backWall);

    [-1.58, 1.58].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.55, 2.0), boothMat);
      pillar.position.set(px, 1.9, 0);
      group.add(pillar);
    });

    // Pink angled awning roof with scalloped front edge
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.35, 2.55), boothMat);
    roof.position.set(0, 2.82, 0.1);
    roof.rotation.x = 0.14;
    roof.castShadow = true;
    group.add(roof);

    for (let sx = -1.6; sx <= 1.6; sx += 0.46) {
      const scallop = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), trimPinkMat);
      scallop.scale.set(1.0, 0.7, 0.6);
      scallop.position.set(sx, 2.6, 1.32);
      group.add(scallop);
    }

    // "ETC" signboard banner
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#fff5f8';
    sctx.fillRect(0, 0, 256, 128);
    sctx.lineWidth = 10;
    sctx.strokeStyle = '#ec4899';
    sctx.strokeRect(6, 6, 244, 116);
    sctx.fillStyle = '#831843';
    sctx.font = '900 62px system-ui, sans-serif';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText('ETC', 128, 66);

    const signTex = setSRGBTexture(new THREE.CanvasTexture(signCanvas));
    const sign = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.1), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(-0.9, 2.25, 1.12);
    group.add(sign);

    // Tiny potion jars on counter
    [0xef4444, 0x3b82f6, 0xfacc15].forEach((c, idx) => {
      const jar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.28, 10),
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.2 })
      );
      jar.position.set(0.3 + idx * 0.35, 1.35, 0.7);
      group.add(jar);
    });

    return group;
  };

  // Apple Tree / Low Red-Apple Shrub (middle tier of 202610291451187649.webp.jpeg)
  MapleModels.createAppleTree = function (isBushOnly) {
    const group = new THREE.Group();
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2ea626, roughness: 0.72 });
    const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.18 });

    const baseY = isBushOnly ? 0.65 : 2.9;
    if (!isBushOnly) {
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e451b, roughness: 0.85 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 2.8, 12), trunkMat);
      trunk.position.y = 1.4;
      trunk.castShadow = true;
      group.add(trunk);
    }

    const clusters = isBushOnly ? 3 : 5;
    for (let c = 0; c < clusters; c++) {
      const radius = isBushOnly ? 0.72 + (c % 2) * 0.18 : 1.15 + (c % 2) * 0.25;
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 10), leafMat);
      foliage.position.set((c - (clusters - 1) * 0.5) * 0.65, baseY + (c % 2) * 0.28, (c % 2 - 0.5) * 0.3);
      foliage.castShadow = true;
      group.add(foliage);
    }

    const appleCount = isBushOnly ? 6 : 9;
    const appleGeo = new THREE.SphereGeometry(0.13, 10, 8);
    for (let i = 0; i < appleCount; i++) {
      const apple = new THREE.Mesh(appleGeo, appleMat);
      const angle = (i / appleCount) * Math.PI * 2;
      apple.position.set(
        Math.cos(angle) * (isBushOnly ? 0.75 : 1.15),
        baseY + (i % 3 - 1) * 0.28,
        Math.abs(Math.sin(angle)) * 0.6 + 0.35
      );
      group.add(apple);
    }

    return group;
  };

  // Glowing Golden Maple Leaf Portal / Marker (seen floating on platforms in reference)
  MapleModels.createMaplePortal = function () {
    const group = new THREE.Group();
    const leaf = MapleModels.createMapleLeaf();
    leaf.scale.set(2.4, 2.4, 2.4);
    leaf.position.y = 0.85;
    group.add(leaf);

    const aura = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.75, 24),
      new THREE.MeshBasicMaterial({
        color: 0xfde047,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      })
    );
    aura.rotation.x = -Math.PI * 0.5;
    aura.position.y = 0.06;
    group.add(aura);
    group.userData = { leaf, aura };
    return group;
  };

  // Meso Coin
  MapleModels.createCoin = function (value) {
    const group = new THREE.Group();
    const isGold = value >= 25;

    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16),
      new THREE.MeshStandardMaterial({
        color: isGold ? 0xfbbf24 : 0xe2e8f0,
        metalness: 0.88,
        roughness: 0.16
      })
    );
    coin.rotation.x = Math.PI * 0.5;
    group.add(coin);

    group.userData = {
      value: value || 15,
      collected: false,
      vy: 4.8
    };
    return group;
  };

  // Autumn Maple Leaf Particle
  MapleModels.createMapleLeaf = function () {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.04, 0.1);
    shape.lineTo(0.16, 0.12);
    shape.lineTo(0.08, 0.19);
    shape.lineTo(0.2, 0.26);
    shape.lineTo(0.06, 0.28);
    shape.lineTo(0, 0.38);
    shape.lineTo(-0.06, 0.28);
    shape.lineTo(-0.2, 0.26);
    shape.lineTo(-0.08, 0.19);
    shape.lineTo(-0.16, 0.12);
    shape.lineTo(-0.04, 0.1);
    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    return new THREE.Mesh(geo, mat);
  };

  window.MapleModels = MapleModels;
})();
