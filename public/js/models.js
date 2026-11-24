// Procedural 3D Models for MapleStory Henesys World (img2threejs pipeline)
(function () {
  const MapleModels = {};

  // Procedural Canvas Texture Generators
  function createFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 512, 512);

    // Eyes: Classic Anime / Maple chibi eyes
    function drawEye(x, y) {
      // White eye base
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(x, y, 32, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#222222';
      ctx.stroke();

      // Pupil (dark navy/black with gradient)
      const grad = ctx.createLinearGradient(x, y - 40, x, y + 40);
      grad.addColorStop(0, '#152536');
      grad.addColorStop(0.5, '#204060');
      grad.addColorStop(1, '#3b6c96');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y + 4, 24, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight circles
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - 8, y - 10, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 8, y + 14, 5, 0, Math.PI * 2);
      ctx.fill();

      // Eyelash line
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#181818';
      ctx.beginPath();
      ctx.arc(x, y - 14, 34, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }

    drawEye(180, 260);
    drawEye(332, 260);

    // Blush
    function drawBlush(x, y) {
      const grad = ctx.createRadialGradient(x, y, 2, x, y, 25);
      grad.addColorStop(0, 'rgba(255, 120, 140, 0.6)');
      grad.addColorStop(1, 'rgba(255, 120, 140, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
    drawBlush(150, 310);
    drawBlush(362, 310);

    // Mouth: Cute small smiling arc
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#5a2d28';
    ctx.beginPath();
    ctx.arc(256, 320, 14, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createStrawHatTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base bamboo straw color
    ctx.fillStyle = '#d9b36c';
    ctx.fillRect(0, 0, 512, 512);

    // Concentric straw weaving lines
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(120, 80, 30, 0.35)';
    for (let r = 20; r < 360; r += 14) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial weave rays
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(256 + Math.cos(a) * 360, 256 + Math.sin(a) * 360);
      ctx.stroke();
    }

    // Edge border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#6e461b';
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  function createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Rich meadow grass base
    ctx.fillStyle = '#65b32e';
    ctx.fillRect(0, 0, 256, 256);

    // Tufts of grass & color noise
    ctx.fillStyle = '#78cf36';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.fillRect(x, y, 3, 3);
    }
    ctx.fillStyle = '#509420';
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      ctx.fillRect(x, y, 4, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    tex.needsUpdate = true;
    return tex;
  }

  function createMushroomCapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Vibrant Orange
    ctx.fillStyle = '#ff6014';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle darker orange gradient at bottom
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, 'rgba(255, 120, 30, 0.3)');
    grad.addColorStop(1, 'rgba(210, 60, 0, 0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // White polka dots
    ctx.fillStyle = '#ffffff';
    const spots = [
      [256, 120, 36], [160, 220, 28], [352, 220, 30],
      [90, 320, 24], [422, 320, 26], [256, 360, 32],
      [180, 420, 22], [332, 420, 24]
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

  // 1. CREATE MAPLE PLAYER
  MapleModels.createPlayer = function () {
    const root = new THREE.Group();
    root.name = 'MaplePlayer';

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdfcb,
      roughness: 0.5,
      metalness: 0.05
    });

    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xffdfcb,
      map: createFaceTexture(),
      roughness: 0.4,
      transparent: true
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x422617,
      roughness: 0.6
    });

    const tunicMat = new THREE.MeshStandardMaterial({
      color: 0x245580, // Classic blue adventurer tunic
      roughness: 0.5
    });

    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x3d2110,
      roughness: 0.4
    });

    const buckleMat = new THREE.MeshStandardMaterial({
      color: 0xf0c040,
      metalness: 0.8,
      roughness: 0.2
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1f364d,
      roughness: 0.6
    });

    const bootsMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c14,
      roughness: 0.5
    });

    // Body Group (centered pivot)
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 0.9;
    root.add(bodyGroup);

    // Torso / Tunic
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.55, 16);
    const torso = new THREE.Mesh(torsoGeo, tunicMat);
    torso.position.y = 0;
    torso.castShadow = true;
    bodyGroup.add(torso);

    // Belt & Buckle
    const beltGeo = new THREE.CylinderGeometry(0.325, 0.325, 0.1, 16);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = -0.15;
    bodyGroup.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.12, 0.1, 0.04);
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, -0.15, 0.325);
    bodyGroup.add(buckle);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.52, 0);
    bodyGroup.add(headGroup);

    // Head Base (Chibi rounded sphere)
    const headGeo = new THREE.SphereGeometry(0.38, 24, 20);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Face Decal Overlay (front of head)
    const faceGeo = new THREE.PlaneGeometry(0.52, 0.52);
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, 0.02, 0.375);
    headGroup.add(face);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.08, 12, 10);
    earGeo.scale(0.5, 1, 1);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.position.set(-0.36, 0, 0);
    const rightEar = leftEar.clone();
    rightEar.position.x = 0.36;
    headGroup.add(leftEar, rightEar);

    // Hair: Stylized locks surrounding head
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Bangs & locks
    for (let i = -3; i <= 3; i++) {
      const lockGeo = new THREE.ConeGeometry(0.09, 0.28, 8);
      const lock = new THREE.Mesh(lockGeo, hairMat);
      lock.rotation.z = i * 0.18;
      lock.rotation.x = 0.35;
      lock.position.set(i * 0.09, 0.22, 0.28);
      hairGroup.add(lock);
    }
    // Back hair
    const backHairGeo = new THREE.SphereGeometry(0.4, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const backHair = new THREE.Mesh(backHairGeo, hairMat);
    backHair.position.set(0, 0.02, -0.04);
    hairGroup.add(backHair);

    // Straw Conical Hat (笠帽)
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 0.28, 0);
    headGroup.add(hatGroup);

    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xdeb86e,
      map: createStrawHatTexture(),
      roughness: 0.65
    });
    const hatGeo = new THREE.ConeGeometry(0.68, 0.34, 32);
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 0.1;
    hat.castShadow = true;
    hatGroup.add(hat);

    // Hat chin strap
    const strapMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const strapGeo = new THREE.TorusGeometry(0.38, 0.015, 8, 24, Math.PI);
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.rotation.x = Math.PI;
    strap.position.set(0, -0.15, 0);
    headGroup.add(strap);

    // Left Arm
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.35, 12);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 0.15, 0);
    const leftArm = new THREE.Mesh(armGeo, tunicMat);
    leftArm.position.y = -0.16;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    const handGeo = new THREE.SphereGeometry(0.085, 12, 10);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.34;
    leftArmGroup.add(leftHand);
    bodyGroup.add(leftArmGroup);

    // Right Arm (Weapon Wielding)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 0.15, 0);
    const rightArm = new THREE.Mesh(armGeo, tunicMat);
    rightArm.position.y = -0.16;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.34;
    rightArmGroup.add(rightHand);
    bodyGroup.add(rightArmGroup);

    // Weapon: Classic Wooden Katana / Blade
    const weaponGroup = new THREE.Group();
    weaponGroup.position.set(0, -0.34, 0.05);

    // Blade
    const bladeGeo = new THREE.BoxGeometry(0.06, 0.75, 0.025);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.85,
      roughness: 0.15
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.38;
    blade.castShadow = true;
    weaponGroup.add(blade);

    // Tsuba (Guard)
    const guardGeo = new THREE.BoxGeometry(0.16, 0.03, 0.1);
    const guard = new THREE.Mesh(guardGeo, buckleMat);
    guard.position.y = 0.02;
    weaponGroup.add(guard);

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.22, 10);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x6e2c14, roughness: 0.7 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -0.11;
    weaponGroup.add(handle);

    rightArmGroup.add(weaponGroup);

    // Left Leg
    const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.32, 12);
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.16, -0.28, 0);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.y = -0.16;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);

    const bootGeo = new THREE.BoxGeometry(0.18, 0.18, 0.28);
    const leftBoot = new THREE.Mesh(bootGeo, bootsMat);
    leftBoot.position.set(0, -0.36, 0.04);
    leftLegGroup.add(leftBoot);
    bodyGroup.add(leftLegGroup);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.16, -0.28, 0);
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.y = -0.16;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);

    const rightBoot = new THREE.Mesh(bootGeo, bootsMat);
    rightBoot.position.set(0, -0.36, 0.04);
    rightLegGroup.add(rightBoot);
    bodyGroup.add(rightLegGroup);

    // Attack Slash Arc Trail Effect (initially hidden)
    const arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, 1.35, -Math.PI * 0.45, Math.PI * 0.45, false);
    arcShape.absarc(0, 0, 0.95, Math.PI * 0.45, -Math.PI * 0.45, true);
    const arcGeo = new THREE.ShapeGeometry(arcShape);
    const arcMat = new THREE.MeshBasicMaterial({
      color: 0x5be9ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const slashArc = new THREE.Mesh(arcGeo, arcMat);
    slashArc.rotation.y = Math.PI * 0.5;
    slashArc.position.set(0.2, 0.6, 0.6);
    slashArc.visible = false;
    root.add(slashArc);

    // Expose runtime articulation points for animation
    root.userData.sculptRuntime = {
      bodyGroup,
      headGroup,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup,
      weaponGroup,
      slashArc,
      facing: 1 // 1 = right, -1 = left
    };

    return root;
  };

  // 2. CREATE ORANGE MUSHROOM (Iconic Maple Monster)
  MapleModels.createOrangeMushroom = function () {
    const root = new THREE.Group();
    root.name = 'OrangeMushroom';

    // Mushroom Stalk / Body
    const stalkGeo = new THREE.CylinderGeometry(0.38, 0.46, 0.65, 24);
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0xf5edd8,
      roughness: 0.5
    });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    stalk.position.y = 0.35;
    stalk.castShadow = true;
    root.add(stalk);

    // Eyes: Two cute vertical black ovals
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.SphereGeometry(0.05, 12, 10);
    eyeGeo.scale(0.8, 1.8, 0.6);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 0.44, 0.42);
    root.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 0.44, 0.42);
    root.add(rightEye);

    // Eye specular dots
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const specGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const leftSpec = new THREE.Mesh(specGeo, specMat);
    leftSpec.position.set(-0.13, 0.48, 0.46);
    const rightSpec = new THREE.Mesh(specGeo, specMat);
    rightSpec.position.set(0.15, 0.48, 0.46);
    root.add(leftSpec, rightSpec);

    // Mushroom Cap
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

    // Monster properties
    root.userData = {
      kind: 'mushroom',
      maxHp: 80,
      hp: 80,
      exp: 15,
      meso: 25,
      speed: 1.8,
      isAlive: true,
      originalY: 0,
      stalk,
      cap
    };

    return root;
  };

  // 3. CREATE GREEN SLIME (Jelly monster with red ribbon)
  MapleModels.createGreenSlime = function () {
    const root = new THREE.Group();
    root.name = 'GreenSlime';

    // Translucent Droplet Body
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

    // Inner core for depth
    const coreGeo = new THREE.SphereGeometry(0.28, 16, 14);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x22aa30 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.38;
    root.add(core);

    // Eyes: Two shiny round black eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.SphereGeometry(0.055, 10, 10);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.16, 0.45, 0.44);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.16, 0.45, 0.44);
    root.add(leftEye, rightEye);

    // Red Ribbon on top
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xdd1e1e, roughness: 0.4 });
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
      maxHp: 50,
      hp: 50,
      exp: 10,
      meso: 18,
      speed: 2.2,
      isAlive: true,
      body
    };

    return root;
  };

  // 4. CREATE HENESYS PLATFORMS (Multi-tier grass blockout)
  MapleModels.createPlatform = function (width, height, depth) {
    const group = new THREE.Group();

    // Grass Top Layer
    const grassGeo = new THREE.BoxGeometry(width, 0.3, depth);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x62bd28,
      map: createGrassTexture(),
      roughness: 0.7
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = 0;
    grass.receiveShadow = true;
    group.add(grass);

    // Soil/Rock Lower Layer
    const dirtGeo = new THREE.BoxGeometry(width * 0.98, height - 0.3, depth * 0.95);
    const dirtMat = new THREE.MeshStandardMaterial({
      color: 0x5a3b22,
      roughness: 0.9
    });
    const dirt = new THREE.Mesh(dirtGeo, dirtMat);
    dirt.position.y = -(height - 0.3) * 0.5 - 0.15;
    dirt.receiveShadow = true;
    group.add(dirt);

    // Decorative grass blade overhangs
    for (let x = -width * 0.48; x < width * 0.48; x += 0.8) {
      const overhangGeo = new THREE.ConeGeometry(0.12, 0.25, 6);
      const overhang = new THREE.Mesh(overhangGeo, grassMat);
      overhang.rotation.z = Math.PI;
      overhang.position.set(x + (Math.random() - 0.5) * 0.2, -0.15, depth * 0.49);
      group.add(overhang);
    }

    return group;
  };

  // 5. CREATE CLIMBING ROPE
  MapleModels.createRope = function (height) {
    const group = new THREE.Group();
    group.name = 'Rope';

    const ropeGeo = new THREE.CylinderGeometry(0.045, 0.045, height, 12);
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0xa8875b,
      roughness: 0.85
    });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.position.y = height * 0.5;
    rope.castShadow = true;
    group.add(rope);

    // Rope knots at intervals
    for (let y = 1.0; y < height; y += 1.2) {
      const knotGeo = new THREE.TorusGeometry(0.06, 0.03, 8, 16);
      const knot = new THREE.Mesh(knotGeo, ropeMat);
      knot.rotation.x = Math.PI * 0.5;
      knot.position.y = y;
      group.add(knot);
    }

    return group;
  };

  // 6. CREATE HAYSTACK (Straw bale)
  MapleModels.createHaystack = function () {
    const group = new THREE.Group();
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xdeb447, roughness: 0.8 });
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0x6e451b });

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 1.8, 16);
    const base = new THREE.Mesh(baseGeo, strawMat);
    base.position.y = 0.9;
    base.castShadow = true;
    group.add(base);

    const topGeo = new THREE.ConeGeometry(1.25, 1.1, 16);
    const top = new THREE.Mesh(topGeo, strawMat);
    top.position.y = 2.3;
    top.castShadow = true;
    group.add(top);

    // Tying ropes
    const band1 = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.04, 8, 24), ropeMat);
    band1.rotation.x = Math.PI * 0.5;
    band1.position.y = 0.6;
    const band2 = band1.clone();
    band2.position.y = 1.3;
    group.add(band1, band2);

    return group;
  };

  // 7. CREATE ETC SHOP HUT (Henesys style with pink roof)
  MapleModels.createShopHut = function () {
    const group = new THREE.Group();

    // Wooden Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x94653b, roughness: 0.8 });
    const walls = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 2.4), wallMat);
    walls.position.y = 1.2;
    walls.castShadow = true;
    group.add(walls);

    // Pastel Pink Roof Tiles
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xf58aa8, roughness: 0.5 });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.6, 4), roofMat);
    roof.rotation.y = Math.PI * 0.25;
    roof.position.y = 3.2;
    roof.castShadow = true;
    group.add(roof);

    // Shop Sign "ETC"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#fff0f5';
    sctx.fillRect(0, 0, 256, 128);
    sctx.lineWidth = 10;
    sctx.strokeStyle = '#d64d73';
    sctx.strokeRect(5, 5, 246, 118);
    sctx.fillStyle = '#a62449';
    sctx.font = 'bold 52px system-ui, sans-serif';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText('ETC', 128, 64);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), signMat);
    sign.position.set(0, 2.2, 1.25);
    group.add(sign);

    return group;
  };

  // 8. CREATE APPLE BUSH
  MapleModels.createAppleBush = function () {
    const group = new THREE.Group();
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x3d8224, roughness: 0.7 });
    const appleMat = new THREE.MeshStandardMaterial({ color: 0xe62525, roughness: 0.2 });

    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 12), leafMat);
    bush.position.y = 0.85;
    bush.castShadow = true;
    group.add(bush);

    // Apples
    const appleGeo = new THREE.SphereGeometry(0.12, 10, 8);
    for (let i = 0; i < 7; i++) {
      const apple = new THREE.Mesh(appleGeo, appleMat);
      const angle = (i / 7) * Math.PI * 2;
      apple.position.set(
        Math.cos(angle) * 0.75,
        0.75 + (i % 3) * 0.2,
        Math.sin(angle) * 0.75
      );
      group.add(apple);
    }

    return group;
  };

  // 9. CREATE MESO COIN DROP
  MapleModels.createCoin = function (value) {
    const group = new THREE.Group();
    const isGold = value >= 20;

    const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
    const coinMat = new THREE.MeshStandardMaterial({
      color: isGold ? 0xffcc00 : 0xd8d8d8,
      metalness: 0.85,
      roughness: 0.2
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI * 0.5;
    group.add(coin);

    group.userData = {
      value: value || 10,
      collected: false,
      vy: 4.5
    };
    return group;
  };

  // 10. CREATE MAPLE LEAF PARTICLE GEOMETRY
  MapleModels.createMapleLeaf = function () {
    const shape = new THREE.Shape();
    // 5-lobed maple leaf outline
    shape.moveTo(0, 0);
    shape.lineTo(0.04, 0.1);
    shape.lineTo(0.15, 0.12);
    shape.lineTo(0.08, 0.18);
    shape.lineTo(0.18, 0.25);
    shape.lineTo(0.06, 0.26);
    shape.lineTo(0, 0.35);
    shape.lineTo(-0.06, 0.26);
    shape.lineTo(-0.18, 0.25);
    shape.lineTo(-0.08, 0.18);
    shape.lineTo(-0.15, 0.12);
    shape.lineTo(-0.04, 0.1);
    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff7b1c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    return new THREE.Mesh(geo, mat);
  };

  window.MapleModels = MapleModels;
})();
