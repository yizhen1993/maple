// Procedural 3D Models for MapleStory Henesys World (img2threejs pipeline)
// Upgraded: High-Fidelity Cygnus Knight / Dawn Warrior & Detailed Henesys Environment
(function () {
  const MapleModels = {};

  // =========================================================================
  // 1. PROCEDURAL CANVAS TEXTURES
  // =========================================================================

  // High-Detail Anime Face Texture for Dawn Warrior (images-2.jpeg)
  function createDawnWarriorFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);

    // Eyes: Bright turquoise / cyan anime eyes
    function drawEye(cx, cy, isLeft) {
      // White eye base
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 38, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#1a1a1a';
      ctx.stroke();

      // Iris gradient (turquoise / cyan)
      const grad = ctx.createLinearGradient(cx, cy - 40, cx, cy + 40);
      grad.addColorStop(0, '#005f73');
      grad.addColorStop(0.3, '#0a9396');
      grad.addColorStop(0.7, '#00b4d8');
      grad.addColorStop(1, '#90e0ef');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 3, 28, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, 14, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - (isLeft ? 8 : 10), cy - 14, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx + (isLeft ? 10 : 8), cy + 16, 6, 0, Math.PI * 2);
      ctx.fill();

      // Upper bold eyelash
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#111111';
      ctx.beginPath();
      ctx.arc(cx, cy - 12, 38, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Determined angled eyebrow
      ctx.lineWidth = 9;
      ctx.strokeStyle = '#2b1810';
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cx - 36, cy - 54);
        ctx.quadraticCurveTo(cx, cy - 70, cx + 38, cy - 58);
      } else {
        ctx.moveTo(cx - 38, cy - 58);
        ctx.quadraticCurveTo(cx, cy - 70, cx + 36, cy - 54);
      }
      ctx.stroke();
    }

    drawEye(170, 240, true);
    drawEye(342, 240, false);

    // Mouth: Cheerful open grin showing white teeth and tongue
    ctx.beginPath();
    ctx.moveTo(196, 310);
    ctx.quadraticCurveTo(256, 318, 316, 310);
    ctx.quadraticCurveTo(256, 385, 196, 310);
    ctx.fillStyle = '#b3261e';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#220000';
    ctx.stroke();

    // White teeth band
    ctx.beginPath();
    ctx.moveTo(206, 312);
    ctx.quadraticCurveTo(256, 318, 306, 312);
    ctx.quadraticCurveTo(256, 332, 206, 312);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Tongue
    ctx.beginPath();
    ctx.arc(256, 362, 28, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fillStyle = '#e85d75';
    ctx.fill();

    // Small nose dot
    ctx.fillStyle = '#7a422b';
    ctx.beginPath();
    ctx.arc(256, 290, 3, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Kite Shield Texture (Golden Wing & Ruby Emblem)
  function createShieldTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Metallic silver / gold gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
    bgGrad.addColorStop(0, '#e5e7eb');
    bgGrad.addColorStop(0.5, '#d1d5db');
    bgGrad.addColorStop(1, '#9ca3af');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Golden Wings Carving
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 6;

    // Wing feathers left & right
    for (let i = 0; i < 4; i++) {
      const y = 140 + i * 50;
      // Left feathers
      ctx.beginPath();
      ctx.moveTo(256, y);
      ctx.lineTo(80 + i * 25, y + 40);
      ctx.lineTo(256, y + 35);
      ctx.fill();
      ctx.stroke();

      // Right feathers
      ctx.beginPath();
      ctx.moveTo(256, y);
      ctx.lineTo(432 - i * 25, y + 40);
      ctx.lineTo(256, y + 35);
      ctx.fill();
      ctx.stroke();
    }

    // Golden Central Crest
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(256, 240, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Central Teardrop Ruby Red Jewel
    const rubyGrad = ctx.createRadialGradient(248, 260, 4, 256, 270, 35);
    rubyGrad.addColorStop(0, '#ff6b6b');
    rubyGrad.addColorStop(0.6, '#dc2626');
    rubyGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = rubyGrad;
    ctx.beginPath();
    ctx.ellipse(256, 275, 26, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#450a0a';
    ctx.stroke();

    // Upper Emerald Green Diamond Jewel
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(256, 120);
    ctx.lineTo(280, 150);
    ctx.lineTo(256, 180);
    ctx.lineTo(232, 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Outer shield golden border
    ctx.lineWidth = 22;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(10, 10, 492, 492);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Henesys Layered Grassy Earth Texture
  function createHenesysGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich meadow grass
    ctx.fillStyle = '#68be2b';
    ctx.fillRect(0, 0, 512, 512);

    // Textured tufts of vibrant grass
    ctx.fillStyle = '#7ed936';
    for (let i = 0; i < 900; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 5);
    }
    ctx.fillStyle = '#4f9420';
    for (let i = 0; i < 700; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 4, 4);
    }

    // Tiny white and yellow daisies
    for (let i = 0; i < 35; i++) {
      const fx = Math.random() * 500 + 6;
      const fy = Math.random() * 500 + 6;
      // Petals
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fef08a';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        ctx.beginPath();
        ctx.arc(fx + Math.cos(a) * 4, fy + Math.sin(a) * 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Center
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    tex.needsUpdate = true;
    return tex;
  }

  // Mushroom Polka Dot Cap Texture
  function createMushroomCapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ff5c16';
    ctx.fillRect(0, 0, 512, 512);

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, 'rgba(255, 140, 40, 0.3)');
    grad.addColorStop(1, 'rgba(190, 50, 0, 0.65)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Clean white spots
    ctx.fillStyle = '#ffffff';
    const spots = [
      [256, 120, 38], [160, 220, 30], [352, 220, 32],
      [85, 320, 26], [427, 320, 28], [256, 360, 34],
      [180, 420, 24], [332, 420, 26]
    ];
    spots.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  // =========================================================================
  // 2. CREATE DAWN WARRIOR MODEL (images-2.jpeg)
  // =========================================================================
  MapleModels.createPlayer = function () {
    const root = new THREE.Group();
    root.name = 'DawnWarrior';

    // Shared Materials
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xd4d8df,
      metalness: 0.88,
      roughness: 0.22
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.15,
      metalness: 0.82,
      roughness: 0.28
    });

    const bluePlateMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.45,
      roughness: 0.35
    });

    const redCapeMat = new THREE.MeshStandardMaterial({
      color: 0xc22525,
      roughness: 0.75,
      side: THREE.DoubleSide
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x331e15,
      roughness: 0.65
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdfcb,
      roughness: 0.45,
      metalness: 0.05
    });

    const gemGreenMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1
    });

    const gemBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.45,
      metalness: 0.9,
      roughness: 0.1
    });

    // Body Group (Center pivot at waist)
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 1.0;
    root.add(bodyGroup);

    // 1. Torso: Steel Breastplate with Gold Border
    const chestGeo = new THREE.CylinderGeometry(0.32, 0.34, 0.6, 16);
    const chest = new THREE.Mesh(chestGeo, steelMat);
    chest.castShadow = true;
    bodyGroup.add(chest);

    // Gold filigree breastplate trim
    const trimGeo = new THREE.CylinderGeometry(0.342, 0.352, 0.14, 16);
    const trim = new THREE.Mesh(trimGeo, goldMat);
    trim.position.y = 0.18;
    bodyGroup.add(trim);

    // Silver draped chest chain
    const chainMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.2 });
    for (let c = -1; c <= 1; c++) {
      const chainLink = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 6, 14, Math.PI * 0.8), chainMat);
      chainLink.rotation.x = Math.PI * 0.35;
      chainLink.position.set(c * 0.1, 0.12, 0.33);
      bodyGroup.add(chainLink);
    }

    // Belt & Gold Wing Buckle
    const beltGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x4a2c14, roughness: 0.5 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = -0.18;
    bodyGroup.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.14, 0.12, 0.05);
    const buckle = new THREE.Mesh(buckleGeo, goldMat);
    buckle.position.set(0, -0.18, 0.355);
    bodyGroup.add(buckle);

    // White Knight Tabard with Gold Crest
    const tabardGeo = new THREE.BoxGeometry(0.24, 0.42, 0.02);
    const tabardMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const tabard = new THREE.Mesh(tabardGeo, tabardMat);
    tabard.position.set(0, -0.32, 0.335);
    bodyGroup.add(tabard);

    // Blue tassets on hips
    const tassetGeo = new THREE.BoxGeometry(0.16, 0.3, 0.04);
    const leftTasset = new THREE.Mesh(tassetGeo, bluePlateMat);
    leftTasset.rotation.z = 0.25;
    leftTasset.position.set(-0.32, -0.3, 0);
    const rightTasset = leftTasset.clone();
    rightTasset.rotation.z = -0.25;
    rightTasset.position.x = 0.32;
    bodyGroup.add(leftTasset, rightTasset);

    // Red Hero Cape (Billowing Behind)
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 0.25, -0.28);
    const capeShape = new THREE.Shape();
    capeShape.moveTo(-0.35, 0);
    capeShape.lineTo(0.35, 0);
    capeShape.lineTo(0.55, -0.95);
    capeShape.lineTo(-0.55, -0.95);
    capeShape.closePath();
    const capeGeo = new THREE.ShapeGeometry(capeShape);
    const cape = new THREE.Mesh(capeGeo, redCapeMat);
    cape.rotation.x = 0.22; // Billow outward
    cape.castShadow = true;
    capeGroup.add(cape);
    bodyGroup.add(capeGroup);

    // 2. Head Group (Chibi Proportion)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.62, 0);
    bodyGroup.add(headGroup);

    // Head Base
    const headGeo = new THREE.SphereGeometry(0.42, 24, 20);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Face Decal Overlay
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xffdfcb,
      map: createDawnWarriorFaceTexture(),
      roughness: 0.35,
      transparent: true
    });
    const faceGeo = new THREE.PlaneGeometry(0.62, 0.62);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, -0.02, 0.415);
    headGroup.add(face);

    // Left Ear with Silver Hoop Earring (from images-2.jpeg)
    const earGeo = new THREE.SphereGeometry(0.09, 12, 10);
    earGeo.scale(0.5, 1, 1);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(0.4, -0.05, 0);
    const earring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16), steelMat);
    earring.position.set(0.42, -0.12, 0);
    earring.rotation.y = Math.PI * 0.5;
    headGroup.add(leftEar, earring);

    // 3. Spiky Dark Anime Hair (jutting out around helmet)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Front spiky locks
    const spikeCoords = [
      [-0.24, 0.32, 0.35, -0.25],
      [-0.12, 0.40, 0.38, -0.1],
      [0.0, 0.42, 0.40, 0.0],
      [0.12, 0.40, 0.38, 0.1],
      [0.24, 0.32, 0.35, 0.25],
      [-0.32, 0.18, 0.32, -0.4],
      [0.32, 0.18, 0.32, 0.4],
      [0, 0.48, 0.25, 0.0]
    ];
    spikeCoords.forEach(([x, y, z, rz]) => {
      const spikeGeo = new THREE.ConeGeometry(0.09, 0.32, 6);
      const spike = new THREE.Mesh(spikeGeo, hairMat);
      spike.rotation.z = rz;
      spike.rotation.x = 0.4;
      spike.position.set(x, y, z);
      hairGroup.add(spike);
    });

    // Back hair dome
    const backHairGeo = new THREE.SphereGeometry(0.44, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, 0.02, -0.05);
    hairGroup.add(backHair);

    // 4. Winged Knight Helmet (images-2.jpeg)
    const helmetGroup = new THREE.Group();
    headGroup.add(helmetGroup);

    // Forehead Polished Steel Diadem / Visor
    const visorGeo = new THREE.CylinderGeometry(0.435, 0.445, 0.18, 24, 1, true, -Math.PI * 0.55, Math.PI * 1.1);
    const visor = new THREE.Mesh(visorGeo, steelMat);
    visor.position.set(0, 0.24, 0);
    helmetGroup.add(visor);

    // Gold Forehead Plate & Eyebrow Arches
    const browGeo = new THREE.TorusGeometry(0.445, 0.04, 8, 24, Math.PI * 0.9);
    const brow = new THREE.Mesh(browGeo, goldMat);
    brow.rotation.x = Math.PI * 0.5;
    brow.position.set(0, 0.22, 0.05);
    helmetGroup.add(brow);

    // Central Forehead Crest with Emerald Jewel
    const crestGroup = new THREE.Group();
    crestGroup.position.set(0, 0.28, 0.44);

    const crestGeo = new THREE.ConeGeometry(0.12, 0.2, 4);
    const crestMesh = new THREE.Mesh(crestGeo, goldMat);
    crestMesh.rotation.y = Math.PI * 0.25;
    crestGroup.add(crestMesh);

    // Emerald Green Diamond
    const emeraldGeo = new THREE.OctahedronGeometry(0.065);
    const emerald = new THREE.Mesh(emeraldGeo, gemGreenMat);
    emerald.position.z = 0.06;
    crestGroup.add(emerald);
    helmetGroup.add(crestGroup);

    // Golden Side Wings (Left & Right Ear Guards)
    function createHelmetWing(isRight) {
      const wing = new THREE.Group();
      const dir = isRight ? 1 : -1;

      // Circular ear disc
      const discGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.04, 16);
      const disc = new THREE.Mesh(discGeo, goldMat);
      disc.rotation.z = Math.PI * 0.5;
      disc.position.set(dir * 0.43, 0.14, 0);
      wing.add(disc);

      // Gold wing feathers angling back & up
      for (let f = 0; f < 3; f++) {
        const featherGeo = new THREE.ConeGeometry(0.08 - f * 0.015, 0.38 - f * 0.05, 6);
        const feather = new THREE.Mesh(featherGeo, goldMat);
        feather.rotation.z = dir * (0.6 + f * 0.18);
        feather.rotation.y = -dir * 0.35;
        feather.rotation.x = -0.3;
        feather.position.set(dir * (0.46 + f * 0.08), 0.24 + f * 0.08, -f * 0.1);
        wing.add(feather);
      }
      return wing;
    }
    helmetGroup.add(createHelmetWing(false), createHelmetWing(true));

    // 5. Left Arm (Off-Hand holding Kite Shield)
    const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.34, 12);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.42, 0.18, 0);

    // Gold shoulder pauldron
    const pauldronGeo = new THREE.SphereGeometry(0.16, 14, 12);
    pauldronGeo.scale(1, 1.2, 1);
    const leftPauldron = new THREE.Mesh(pauldronGeo, goldMat);
    leftPauldron.position.y = 0.06;
    leftArmGroup.add(leftPauldron);

    const leftArm = new THREE.Mesh(armGeo, steelMat);
    leftArm.position.y = -0.16;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);

    // Armored gauntlet
    const gauntletGeo = new THREE.CylinderGeometry(0.095, 0.09, 0.16, 12);
    const leftGauntlet = new THREE.Mesh(gauntletGeo, goldMat);
    leftGauntlet.position.y = -0.26;
    leftArmGroup.add(leftGauntlet);

    // Kite Shield (Braced on Left Forearm)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.15, -0.2, 0.25);
    shieldGroup.rotation.y = Math.PI * 0.35;

    // Shield Plate Geometry
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(-0.45, 0.55);
    shieldShape.lineTo(0.45, 0.55);
    shieldShape.lineTo(0.38, 0);
    shieldShape.lineTo(0, -0.75);
    shieldShape.lineTo(-0.38, 0);
    shieldShape.closePath();

    const shieldGeo = new THREE.ShapeGeometry(shieldShape);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createShieldTexture(),
      metalness: 0.8,
      roughness: 0.25,
      side: THREE.DoubleSide
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.castShadow = true;
    shieldGroup.add(shieldMesh);

    // 3D Rim and Gems on Shield
    const rimMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), goldMat);
    shieldGroup.add(rimMesh);

    leftArmGroup.add(shieldGroup);
    bodyGroup.add(leftArmGroup);

    // 6. Right Arm (Main-Hand wielding Broadsword)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.42, 0.18, 0);

    const rightPauldron = new THREE.Mesh(pauldronGeo, goldMat);
    rightPauldron.position.y = 0.06;
    rightArmGroup.add(rightPauldron);

    const rightArm = new THREE.Mesh(armGeo, steelMat);
    rightArm.position.y = -0.16;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);

    const rightGauntlet = new THREE.Mesh(gauntletGeo, goldMat);
    rightGauntlet.position.y = -0.26;
    rightArmGroup.add(rightGauntlet);

    // Knight Broadsword (images-2.jpeg)
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0, -0.32, 0.1);

    // Double-edged Steel Blade with fuller
    const bladeGeo = new THREE.BoxGeometry(0.12, 1.15, 0.035);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.58;
    blade.castShadow = true;
    swordGroup.add(blade);

    // Sword Tip (Pointed Triangle)
    const tipGeo = new THREE.ConeGeometry(0.085, 0.2, 4);
    const tip = new THREE.Mesh(tipGeo, bladeMat);
    tip.rotation.y = Math.PI * 0.25;
    tip.position.y = 1.22;
    swordGroup.add(tip);

    // Royal Blue Winged Crossguard
    const guardGeo = new THREE.BoxGeometry(0.36, 0.08, 0.09);
    const guard = new THREE.Mesh(guardGeo, bluePlateMat);
    guard.position.y = 0.02;
    swordGroup.add(guard);

    // Central Guard Teal Jewel
    const guardGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045), gemGreenMat);
    guardGem.position.set(0, 0.02, 0.05);
    swordGroup.add(guardGem);

    // Handle & Gold Pommel Ring
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.26, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -0.13;
    swordGroup.add(handle);

    const pommelGeo = new THREE.TorusGeometry(0.055, 0.02, 8, 16);
    const pommel = new THREE.Mesh(pommelGeo, goldMat);
    pommel.position.y = -0.27;
    swordGroup.add(pommel);

    rightArmGroup.add(swordGroup);
    bodyGroup.add(rightArmGroup);

    // 7. Legs & Sabatons (Boots) with Gold Knee Wings & Blue Gems
    const legGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.36, 14);

    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.18, -0.3, 0);
    const leftLeg = new THREE.Mesh(legGeo, steelMat);
    leftLeg.position.y = -0.18;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);

    // Knee Guard with Diamond Blue Gem
    const leftKnee = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.08), goldMat);
    leftKnee.position.set(0, -0.16, 0.12);
    const leftKneeGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.04), gemBlueMat);
    leftKneeGem.position.set(0, -0.16, 0.16);
    leftLegGroup.add(leftKnee, leftKneeGem);

    // Steel Sabaton (Boot)
    const bootGeo = new THREE.BoxGeometry(0.2, 0.18, 0.32);
    const leftBoot = new THREE.Mesh(bootGeo, steelMat);
    leftBoot.position.set(0, -0.4, 0.05);
    leftLegGroup.add(leftBoot);
    bodyGroup.add(leftLegGroup);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.18, -0.3, 0);
    const rightLeg = new THREE.Mesh(legGeo, steelMat);
    rightLeg.position.y = -0.18;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);

    const rightKnee = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.08), goldMat);
    rightKnee.position.set(0, -0.16, 0.12);
    const rightKneeGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.04), gemBlueMat);
    rightKneeGem.position.set(0, -0.16, 0.16);
    rightLegGroup.add(rightKnee, rightKneeGem);

    const rightBoot = new THREE.Mesh(bootGeo, steelMat);
    rightBoot.position.set(0, -0.4, 0.05);
    rightLegGroup.add(rightBoot);
    bodyGroup.add(rightLegGroup);

    // 8. Dynamic Glowing Slash Arc (Cyan & Golden Blade Sweep)
    const slashShape = new THREE.Shape();
    slashShape.absarc(0, 0, 1.6, -Math.PI * 0.45, Math.PI * 0.45, false);
    slashShape.absarc(0, 0, 1.15, Math.PI * 0.45, -Math.PI * 0.45, true);
    const slashGeo = new THREE.ShapeGeometry(slashShape);
    const slashMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const slashArc = new THREE.Mesh(slashGeo, slashMat);
    slashArc.rotation.y = Math.PI * 0.5;
    slashArc.position.set(0.2, 0.7, 0.7);
    slashArc.visible = false;
    root.add(slashArc);

    // Golden inner slash trail
    const innerSlashMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const innerSlash = new THREE.Mesh(slashGeo, innerSlashMat);
    innerSlash.scale.set(0.85, 0.85, 0.85);
    slashArc.add(innerSlash);

    // Articulation points exposed for runtime controller
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
      facing: 1
    };

    return root;
  };

  // =========================================================================
  // 3. MONSTER MODELS (Orange Mushroom, Green Slime, Ribbon Pig)
  // =========================================================================

  // Orange Mushroom (Iconic Hop & Squash)
  MapleModels.createOrangeMushroom = function () {
    const root = new THREE.Group();
    root.name = 'OrangeMushroom';

    // Stalk
    const stalkGeo = new THREE.CylinderGeometry(0.38, 0.46, 0.65, 24);
    const stalkMat = new THREE.MeshStandardMaterial({ color: 0xf5edd8, roughness: 0.5 });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    stalk.position.y = 0.35;
    stalk.castShadow = true;
    root.add(stalk);

    // Cute Oval Eyes (Scaled SphereGeometry for full Three.js compatibility)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.SphereGeometry(0.05, 12, 10);
    eyeGeo.scale(0.8, 1.8, 0.6);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 0.44, 0.42);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 0.44, 0.42);
    root.add(leftEye, rightEye);

    // Eye Specular Dots
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const specGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const leftSpec = new THREE.Mesh(specGeo, specMat);
    leftSpec.position.set(-0.13, 0.48, 0.46);
    const rightSpec = new THREE.Mesh(specGeo, specMat);
    rightSpec.position.set(0.15, 0.48, 0.46);
    root.add(leftSpec, rightSpec);

    // Cap with white polka dots
    const capGeo = new THREE.SphereGeometry(0.72, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    capGeo.scale(1.2, 0.9, 1.2);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xff5a10,
      map: createMushroomCapTexture(),
      roughness: 0.4
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.65;
    cap.castShadow = true;
    root.add(cap);

    // Underside Rim
    const rimGeo = new THREE.TorusGeometry(0.78, 0.08, 16, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf5edd8, roughness: 0.6 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI * 0.5;
    rim.position.y = 0.64;
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

  // Green Slime (Translucent Jelly + Red Ribbon)
  MapleModels.createGreenSlime = function () {
    const root = new THREE.Group();
    root.name = 'GreenSlime';

    const bodyGeo = new THREE.SphereGeometry(0.48, 24, 20);
    bodyGeo.scale(1.1, 0.85, 1.1);

    const slimeMat = new THREE.MeshPhysicalMaterial({
      color: 0x47e852,
      emissive: 0x145218,
      emissiveIntensity: 0.2,
      roughness: 0.12,
      transmission: 0.75,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92
    });

    const body = new THREE.Mesh(bodyGeo, slimeMat);
    body.position.y = 0.42;
    body.castShadow = true;
    root.add(body);

    const coreGeo = new THREE.SphereGeometry(0.28, 16, 14);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x22aa30 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.38;
    root.add(core);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.SphereGeometry(0.055, 10, 10);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.16, 0.45, 0.44);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.16, 0.45, 0.44);
    root.add(leftEye, rightEye);

    // Red Ribbon on top
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const ribbonCenter = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), ribbonMat);
    ribbonCenter.position.set(0, 0.84, 0);

    const bowGeo = new THREE.ConeGeometry(0.09, 0.18, 8);
    const leftBow = new THREE.Mesh(bowGeo, ribbonMat);
    leftBow.rotation.z = Math.PI * 0.5;
    leftBow.position.set(-0.1, 0.84, 0);

    const rightBow = new THREE.Mesh(bowGeo, ribbonMat);
    rightBow.rotation.z = -Math.PI * 0.5;
    rightBow.position.set(0.1, 0.84, 0);

    root.add(ribbonCenter, leftBow, rightBow);

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

  // Ribbon / Black Pig (from reference image)
  MapleModels.createPig = function (isBlack) {
    const root = new THREE.Group();
    root.name = isBlack ? 'BlackPig' : 'RibbonPig';

    const skinColor = isBlack ? 0x2d3748 : 0xfbcfe8;
    const bodyMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });

    // Round Chubby Body
    const bodyGeo = new THREE.SphereGeometry(0.52, 20, 16);
    bodyGeo.scale(1.2, 0.9, 1.1);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.46;
    body.castShadow = true;
    root.add(body);

    // Snout
    const snoutGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16);
    const snoutMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
    const snout = new THREE.Mesh(snoutGeo, snoutMat);
    snout.rotation.x = Math.PI * 0.5;
    snout.position.set(0, 0.44, 0.58);
    root.add(snout);

    // Nostrils
    const nostrilMat = new THREE.MeshBasicMaterial({ color: 0x831843 });
    const nostrilGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const leftNos = new THREE.Mesh(nostrilGeo, nostrilMat);
    leftNos.position.set(-0.055, 0.44, 0.64);
    const rightNos = new THREE.Mesh(nostrilGeo, nostrilMat);
    rightNos.position.set(0.055, 0.44, 0.64);
    root.add(leftNos, rightNos);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.16, 0.54, 0.5);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.16, 0.54, 0.5);
    root.add(leftEye, rightEye);

    // Floppy Ears
    const earGeo = new THREE.ConeGeometry(0.1, 0.22, 6);
    const leftEar = new THREE.Mesh(earGeo, snoutMat);
    leftEar.rotation.z = 0.6;
    leftEar.position.set(-0.28, 0.72, 0.2);
    const rightEar = leftEar.clone();
    rightEar.rotation.z = -0.6;
    rightEar.position.x = 0.28;
    root.add(leftEar, rightEar);

    // Curly Tail
    const tailGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 16, Math.PI * 1.5);
    const tail = new THREE.Mesh(tailGeo, snoutMat);
    tail.position.set(0, 0.5, -0.62);
    root.add(tail);

    root.userData = {
      kind: 'pig',
      maxHp: 120,
      hp: 120,
      exp: 26,
      meso: 50,
      speed: 2.6,
      isAlive: true,
      body
    };
    return root;
  };

  // =========================================================================
  // 4. ENVIRONMENT PROPS (Platforms, Haystacks, Shop, Apple Trees)
  // =========================================================================

  // Multi-tiered Henesys Grass Platform
  MapleModels.createPlatform = function (width, height, depth) {
    const group = new THREE.Group();

    // Lush Grass Top Layer
    const grassGeo = new THREE.BoxGeometry(width, 0.32, depth);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x62bd28,
      map: createHenesysGrassTexture(),
      roughness: 0.65
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.receiveShadow = true;
    group.add(grass);

    // Layered Soil & Earth
    const dirtGeo = new THREE.BoxGeometry(width * 0.98, height - 0.32, depth * 0.95);
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x54361e, roughness: 0.9 });
    const dirt = new THREE.Mesh(dirtGeo, dirtMat);
    dirt.position.y = -(height - 0.32) * 0.5 - 0.16;
    dirt.receiveShadow = true;
    group.add(dirt);

    // Overhanging grass blades & root crags
    for (let x = -width * 0.48; x < width * 0.48; x += 0.6) {
      const overhangGeo = new THREE.ConeGeometry(0.12, 0.28, 6);
      const overhang = new THREE.Mesh(overhangGeo, grassMat);
      overhang.rotation.z = Math.PI;
      overhang.position.set(x + (Math.random() - 0.5) * 0.15, -0.16, depth * 0.49);
      group.add(overhang);
    }

    return group;
  };

  // Climbable Rope
  MapleModels.createRope = function (height) {
    const group = new THREE.Group();
    group.name = 'Rope';

    const ropeGeo = new THREE.CylinderGeometry(0.045, 0.045, height, 12);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xa8875b, roughness: 0.85 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.position.y = height * 0.5;
    rope.castShadow = true;
    group.add(rope);

    for (let y = 0.8; y < height; y += 1.1) {
      const knot = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.03, 8, 16), ropeMat);
      knot.rotation.x = Math.PI * 0.5;
      knot.position.y = y;
      group.add(knot);
    }
    return group;
  };

  // Stacked Straw Haystacks (from reference image)
  MapleModels.createHaystack = function (isDouble) {
    const group = new THREE.Group();
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xdeb447, roughness: 0.8 });
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0x5a3814 });

    function addBale(y, scale) {
      const baseGeo = new THREE.CylinderGeometry(1.2 * scale, 1.4 * scale, 1.8 * scale, 16);
      const base = new THREE.Mesh(baseGeo, strawMat);
      base.position.y = y + 0.9 * scale;
      base.castShadow = true;
      group.add(base);

      const topGeo = new THREE.ConeGeometry(1.25 * scale, 1.1 * scale, 16);
      const top = new THREE.Mesh(topGeo, strawMat);
      top.position.y = y + 2.3 * scale;
      top.castShadow = true;
      group.add(top);

      const band1 = new THREE.Mesh(new THREE.TorusGeometry(1.3 * scale, 0.045 * scale, 8, 24), ropeMat);
      band1.rotation.x = Math.PI * 0.5;
      band1.position.y = y + 0.6 * scale;
      const band2 = band1.clone();
      band2.position.y = y + 1.3 * scale;
      group.add(band1, band2);
    }

    addBale(0, 1.0);
    if (isDouble) {
      addBale(2.8, 0.75);
    }
    return group;
  };

  // Henesys ETC Vendor Shack (from reference image)
  MapleModels.createShopHut = function () {
    const group = new THREE.Group();

    // Wooden Cabin
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x94653b, roughness: 0.8 });
    const walls = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.6, 2.5), wallMat);
    walls.position.y = 1.3;
    walls.castShadow = true;
    group.add(walls);

    // Pink Tiled Roof
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.8, 4), roofMat);
    roof.rotation.y = Math.PI * 0.25;
    roof.position.y = 3.4;
    roof.castShadow = true;
    group.add(roof);

    // "ETC" Signboard
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#fff0f5';
    sctx.fillRect(0, 0, 256, 128);
    sctx.lineWidth = 10;
    sctx.strokeStyle = '#db2777';
    sctx.strokeRect(6, 6, 244, 116);
    sctx.fillStyle = '#9d174d';
    sctx.font = '900 56px system-ui, sans-serif';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText('ETC', 128, 64);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 2.3, 1.3);
    group.add(sign);

    return group;
  };

  // Full Apple Tree with Trunk and Red Apples
  MapleModels.createAppleTree = function () {
    const group = new THREE.Group();

    // Wooden Trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e451b, roughness: 0.85 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.48, 3.2, 12), trunkMat);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage Clusters
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 });
    for (let c = 0; c < 5; c++) {
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.3 + Math.random() * 0.4, 14, 12), leafMat);
      foliage.position.set((c - 2) * 0.7, 3.2 + (c % 2) * 0.5, (Math.random() - 0.5) * 0.6);
      foliage.castShadow = true;
      group.add(foliage);
    }

    // Bright Red Apples
    const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.15 });
    const appleGeo = new THREE.SphereGeometry(0.14, 10, 8);
    for (let i = 0; i < 9; i++) {
      const apple = new THREE.Mesh(appleGeo, appleMat);
      const angle = (i / 9) * Math.PI * 2;
      apple.position.set(
        Math.cos(angle) * 1.2,
        2.6 + (i % 3) * 0.45,
        Math.sin(angle) * 0.8
      );
      apple.castShadow = true;
      group.add(apple);
    }

    return group;
  };

  // Meso Coin
  MapleModels.createCoin = function (value) {
    const group = new THREE.Group();
    const isGold = value >= 25;

    const coinGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16);
    const coinMat = new THREE.MeshStandardMaterial({
      color: isGold ? 0xfbbf24 : 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.18
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI * 0.5;
    group.add(coin);

    group.userData = {
      value: value || 15,
      collected: false,
      vy: 4.8
    };
    return group;
  };

  // Golden Autumn Maple Leaf Particle
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
      opacity: 0.88
    });
    return new THREE.Mesh(geo, mat);
  };

  window.MapleModels = MapleModels;
})();
