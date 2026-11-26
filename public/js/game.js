// MapleStory 3D - Henesys Hunting Ground Interactive Game Engine
// Rebuilt with PBR PMREM Lighting, Henesys Backdrop & 360 Hero Inspect Camera
(function () {
  'use strict';

  const Game = {
    scene: null,
    camera: null,
    renderer: null,
    player: null,
    platforms: [],
    ropes: [],
    monsters: [],
    portals: [],
    bunny: null,
    coins: [],
    damageNumbers: [],
    particles: [],
    clouds: [],
    keys: {},
    inspectMode: false,
    orbit: {
      dragging: false,
      lastX: 0,
      lastY: 0,
      yaw: 0.35,
      pitch: 0.12,
      dist: 3.4
    },
    questKills: 0,
    questTarget: 5,
    playerState: {
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      facing: 1, // 1 = right, -1 = left
      isGrounded: false,
      isClimbing: false,
      currentRope: null,
      isAttacking: false,
      attackCooldown: 0,
      walkCycle: 0,
      level: 30,
      job: 'Dawn Warrior',
      name: 'Hero',
      hp: 850,
      maxHp: 850,
      mp: 420,
      maxMp: 420,
      exp: 49.35,
      mesos: 48920
    },
    clock: new THREE.Clock()
  };

  // Initialize Three.js Scene, Camera, PBR Tone Mapping & PMREM Environment
  function initScene() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    Game.scene = new THREE.Scene();
    Game.scene.background = new THREE.Color(0x73bef4);
    Game.scene.fog = new THREE.FogExp2(0xa7d6f9, 0.008);

    Game.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 140);
    Game.camera.position.set(0, 4.8, 16.0);

    Game.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    Game.renderer.setSize(width, height);
    Game.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    Game.renderer.shadowMap.enabled = true;
    Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    Game.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    Game.renderer.toneMappingExposure = 1.08;
    if (THREE.sRGBEncoding !== undefined) {
      Game.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    container.appendChild(Game.renderer.domElement);

    // Procedural Daylight Environment Map for metallic steel/gold/gems
    const envTex = MapleModels.createEnvironmentTexture(Game.renderer);
    if (envTex) {
      Game.scene.environment = envTex;
    }

    // Hemisphere + Key Sun + Rim/Fill Lighting
    const hemiLight = new THREE.HemisphereLight(0xf0f9ff, 0x5c8d38, 0.78);
    Game.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
    sunLight.position.set(10, 18, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 55;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 18;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0004;
    Game.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.48);
    fillLight.position.set(-12, 8, 9);
    Game.scene.add(fillLight);

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    Game.camera.aspect = width / height;
    Game.camera.updateProjectionMatrix();
    Game.renderer.setSize(width, height);
  }

  // Build Exact 3-Tiered Henesys Hunting Ground (202610291451187649.webp.jpeg)
  function buildWorld() {
    // Sky dome + distant hills + Giant Ancient Henesys Oak Tree
    Game.scene.add(MapleModels.createHenesysBackdrop());

    // 1. 3-Tiered Grassy Platforms
    createPlatform(0, 0, 42, 1.4, 4.8);     // Bottom Ground Floor
    createPlatform(0, 3.8, 36, 0.95, 4.1);  // Middle Tier
    createPlatform(0, 7.6, 36, 0.95, 4.1);  // Top Summit Tier

    // 2. Climbable Ropes & Top-Right Wooden Ladder (exact reference placement)
    createRope(-10, 0, 3.8);
    createRope(-1.5, 0, 3.8);
    createRope(-6, 3.8, 3.8);
    createRope(6, 3.8, 3.8);
    createLadder(15.2, 3.8, 3.8);

    // 3. Stacked Square Straw Hay Bales (Right side of tiers + top-left)
    const hayMidRight = MapleModels.createHaystack(true);
    hayMidRight.position.set(14.5, 3.8, -0.8);
    const hayTopRight = MapleModels.createHaystack(true);
    hayTopRight.position.set(14.2, 7.6, -0.8);
    const hayTopLeft = MapleModels.createHaystack(false);
    hayTopLeft.position.set(-15.2, 7.6, -0.8);
    Game.scene.add(hayMidRight, hayTopRight, hayTopLeft);

    // Upright Waist-Tied Golden Wheat Sheaves along bottom floor
    [-14.5, -5.5, 2.2, 5.2].forEach((wx) => {
      const sheaf = MapleModels.createWheatSheaf();
      sheaf.position.set(wx, 0, -1.25);
      Game.scene.add(sheaf);
    });

    // Bottom Right-Center Thatched Straw Cabin + Hanging Glow Lantern
    const thatchedHut = MapleModels.createThatchedHut();
    thatchedHut.position.set(8.6, 0, -1.35);
    Game.scene.add(thatchedHut);

    // Bottom Far-Right Pink "ETC" Vendor Stand
    const shop = MapleModels.createShopHut();
    shop.position.set(14.0, 0, -1.1);
    Game.scene.add(shop);

    // Ambient White Bunny near shop (bottom right of 202610291451187649.webp.jpeg)
    Game.bunny = MapleModels.createWhiteBunny();
    Game.bunny.position.set(16.6, 0, 0.5);
    Game.bunny.rotation.y = -0.6;
    Game.scene.add(Game.bunny);

    // Red-Apple Bushes on Middle Tier & Full Apple Trees
    const bushMidLeft = MapleModels.createAppleTree(true);
    bushMidLeft.position.set(-12.5, 3.8, -1.1);
    const bushMidCenter = MapleModels.createAppleTree(true);
    bushMidCenter.position.set(-3.2, 3.8, -1.1);
    const appleTreeLeft = MapleModels.createAppleTree(false);
    appleTreeLeft.position.set(-16.5, 0, -1.4);
    const appleTreeTop = MapleModels.createAppleTree(false);
    appleTreeTop.position.set(3.5, 7.6, -1.3);
    Game.scene.add(bushMidLeft, bushMidCenter, appleTreeLeft, appleTreeTop);

    // Floating Maple Leaf Portals / Glowing Markers
    [
      [-12.2, 0],
      [-1.0, 0],
      [-10.0, 3.8]
    ].forEach(([px, py]) => {
      const portal = MapleModels.createMaplePortal();
      portal.position.set(px, py, -0.5);
      Game.scene.add(portal);
      Game.portals.push(portal);
    });

    // Volumetric Layered Cartoon Clouds
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, emissive: 0xdbeafe, emissiveIntensity: 0.2 });
    for (let i = 0; i < 8; i++) {
      const cloudGroup = new THREE.Group();
      for (let j = 0; j < 5; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.5 + Math.random() * 0.9, 12, 10), cloudMat);
        puff.scale.set(1.3, 0.75, 0.8);
        puff.position.set((j - 2) * 1.45, (Math.random() - 0.5) * 0.45, (Math.random() - 0.5) * 0.4);
        cloudGroup.add(puff);
      }
      cloudGroup.position.set((Math.random() - 0.5) * 56, 10 + Math.random() * 6, -11 + Math.random() * 3);
      cloudGroup.userData = { speed: 0.28 + Math.random() * 0.35 };
      Game.scene.add(cloudGroup);
      Game.clouds.push(cloudGroup);
    }

    // Autumn Maple Leaf Particle System
    for (let i = 0; i < 36; i++) {
      const leaf = MapleModels.createMapleLeaf();
      leaf.position.set((Math.random() - 0.5) * 42, Math.random() * 15, (Math.random() - 0.5) * 4);
      leaf.userData = {
        vy: -0.6 - Math.random() * 0.8,
        swaySpeed: 1.5 + Math.random() * 2.0,
        swayRange: 0.35 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      };
      Game.scene.add(leaf);
      Game.particles.push(leaf);
    }
  }

  function createPlatform(x, y, width, height, depth) {
    const plat = MapleModels.createPlatform(width, height, depth);
    plat.position.set(x, y, 0);
    Game.scene.add(plat);
    Game.platforms.push({
      x,
      y,
      width,
      height,
      depth,
      minX: x - width * 0.5,
      maxX: x + width * 0.5,
      topY: y
    });
  }

  function createRope(x, bottomY, length) {
    const rope = MapleModels.createRope(length);
    rope.position.set(x, bottomY, 0);
    Game.scene.add(rope);
    Game.ropes.push({
      x,
      bottomY,
      topY: bottomY + length,
      mesh: rope
    });
  }

  function createLadder(x, bottomY, length) {
    const ladder = MapleModels.createLadder(length);
    ladder.position.set(x, bottomY, 0.25);
    Game.scene.add(ladder);
    Game.ropes.push({
      x,
      bottomY,
      topY: bottomY + length,
      mesh: ladder
    });
  }

  // Spawn Player & Monsters
  function spawnEntities() {
    Game.player = MapleModels.createPlayer();
    Game.player.position.set(0, 0, 0);
    Game.scene.add(Game.player);
    Game.playerState.x = 0;
    Game.playerState.y = 0;

    // Bottom Floor
    spawnMonster('mushroom', -8, 0, -17, 6);
    spawnMonster('slime', -3, 0, -17, 6);
    spawnMonster('pig', 4, 0, -17, 7, true);   // Black Pig

    // Middle Tier
    spawnMonster('slime', -10, 3.8, -16, 13);
    spawnMonster('mushroom', -3.5, 3.8, -16, 13);
    spawnMonster('pig', 2.5, 3.8, -16, 13, false); // Ribbon Pig
    spawnMonster('mushroom', 9, 3.8, -16, 13);

    // Top Tier
    spawnMonster('mushroom', -10, 7.6, -15, 13);
    spawnMonster('slime', -2, 7.6, -15, 13);
    spawnMonster('pig', 4.5, 7.6, -15, 13, true); // Black Pig
    spawnMonster('mushroom', 9.5, 7.6, -15, 13);
  }

  function spawnMonster(type, x, y, minX, maxX, isBlack) {
    let monster;
    if (type === 'mushroom') monster = MapleModels.createOrangeMushroom();
    else if (type === 'slime') monster = MapleModels.createGreenSlime();
    else monster = MapleModels.createPig(isBlack);

    monster.position.set(x, y, 0);
    monster.userData.minX = minX;
    monster.userData.maxX = maxX;
    monster.userData.tierY = y;
    monster.userData.patrolDir = Math.random() > 0.5 ? 1 : -1;
    monster.userData.hopTimer = Math.random() * 2;
    monster.userData.vy = 0;
    monster.userData.respawnTimer = 0;
    monster.userData.spawnPos = { x, y, minX, maxX };
    Game.scene.add(monster);
    Game.monsters.push(monster);
  }

  // Controls + 360 Hero Inspect Camera Controls
  function initControls() {
    window.addEventListener('keydown', (e) => {
      Game.keys[e.code] = true;

      if ((e.code === 'ControlLeft' || e.code === 'ControlRight' || e.code === 'KeyX') && !Game.playerState.isAttacking) {
        performAttack();
      }
      if ((e.code === 'Space' || e.code === 'AltLeft' || e.code === 'AltRight') && !e.repeat) {
        performJump();
      }
      if (e.code === 'KeyM') {
        toggleMute();
      }
      if (e.code === 'KeyC' && !e.repeat) {
        toggleInspectMode();
      }
    });

    window.addEventListener('keyup', (e) => {
      Game.keys[e.code] = false;
    });

    // Pointer drag orbit + scroll zoom when in Hero Inspect Mode
    const container = document.getElementById('canvas-container');
    if (container) {
      container.addEventListener('pointerdown', (e) => {
        if (!Game.inspectMode) return;
        Game.orbit.dragging = true;
        Game.orbit.lastX = e.clientX;
        Game.orbit.lastY = e.clientY;
      });
      window.addEventListener('pointermove', (e) => {
        if (!Game.inspectMode || !Game.orbit.dragging) return;
        const dx = e.clientX - Game.orbit.lastX;
        const dy = e.clientY - Game.orbit.lastY;
        Game.orbit.lastX = e.clientX;
        Game.orbit.lastY = e.clientY;
        Game.orbit.yaw -= dx * 0.008;
        Game.orbit.pitch = THREE.MathUtils.clamp(Game.orbit.pitch + dy * 0.006, -0.35, 0.85);
      });
      window.addEventListener('pointerup', () => {
        Game.orbit.dragging = false;
      });
      container.addEventListener('wheel', (e) => {
        if (!Game.inspectMode) return;
        Game.orbit.dist = THREE.MathUtils.clamp(Game.orbit.dist + e.deltaY * 0.003, 2.1, 7.0);
      }, { passive: true });
    }

    // Touch D-Pad & Action Buttons
    const btnAttack = document.getElementById('btn-attack');
    const btnJump = document.getElementById('btn-jump');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');

    function bindTouch(elem, keyName) {
      if (!elem) return;
      elem.addEventListener('touchstart', (e) => { e.preventDefault(); Game.keys[keyName] = true; });
      elem.addEventListener('touchend', (e) => { e.preventDefault(); Game.keys[keyName] = false; });
      elem.addEventListener('mousedown', () => { Game.keys[keyName] = true; });
      elem.addEventListener('mouseup', () => { Game.keys[keyName] = false; });
    }

    bindTouch(btnLeft, 'ArrowLeft');
    bindTouch(btnRight, 'ArrowRight');
    bindTouch(btnUp, 'ArrowUp');
    bindTouch(btnDown, 'ArrowDown');

    if (btnAttack) {
      btnAttack.addEventListener('touchstart', (e) => { e.preventDefault(); performAttack(); });
      btnAttack.addEventListener('click', performAttack);
    }
    if (btnJump) {
      btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); performJump(); });
      btnJump.addEventListener('click', performJump);
    }

    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) soundBtn.addEventListener('click', toggleMute);

    const inspectBtn = document.getElementById('btn-inspect');
    if (inspectBtn) inspectBtn.addEventListener('click', toggleInspectMode);
  }

  function toggleInspectMode() {
    Game.inspectMode = !Game.inspectMode;
    const btn = document.getElementById('btn-inspect');
    const hint = document.getElementById('inspect-hint');
    if (btn) {
      btn.textContent = Game.inspectMode ? '🎮 Play Map' : '📷 Inspect Hero';
    }
    if (hint) {
      hint.style.display = Game.inspectMode ? 'block' : 'none';
    }
    if (Game.inspectMode) {
      Game.orbit.yaw = 0.25;
      Game.orbit.pitch = 0.14;
      Game.orbit.dist = 3.2;
    }
  }

  function toggleMute() {
    const isMuted = MapleAudio.toggleMute();
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.innerHTML = isMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
      soundBtn.classList.toggle('muted', isMuted);
    }
  }

  function logMessage(msg) {
    const el = document.getElementById('chat-log');
    if (el) el.textContent = msg;
  }

  // Attack Action & Hitbox Check
  function performAttack() {
    if (Game.playerState.isAttacking || Game.playerState.isClimbing) return;
    Game.playerState.isAttacking = true;
    Game.playerState.attackCooldown = 0.32;

    MapleAudio.playAttack();

    const runtime = Game.player.userData.sculptRuntime;
    if (runtime && runtime.slashArc) {
      runtime.slashArc.visible = true;
      runtime.slashArc.material.opacity = 0.95;
      if (runtime.innerSlash) runtime.innerSlash.material.opacity = 0.85;
      runtime.slashArc.rotation.z = Game.playerState.facing > 0 ? 0 : Math.PI;
      runtime.slashArc.position.x = Game.playerState.facing * 0.55;
    }

    const px = Game.playerState.x;
    const py = Game.playerState.y;
    const attackRange = 2.7;

    Game.monsters.forEach((monster) => {
      if (!monster.userData.isAlive) return;
      const dx = monster.position.x - px;
      const dy = Math.abs(monster.position.y - py);
      const inFront = (Game.playerState.facing > 0 && dx > -0.4 && dx < attackRange) ||
                      (Game.playerState.facing < 0 && dx < 0.4 && dx > -attackRange);
      if (inFront && dy < 1.45) {
        hitMonster(monster);
      }
    });
  }

  function hitMonster(monster) {
    const isCrit = Math.random() < 0.42;
    const baseDmg = isCrit ? Math.floor(620 + Math.random() * 580) : Math.floor(130 + Math.random() * 90);

    monster.userData.hp -= baseDmg;
    MapleAudio.playHit(isCrit);
    flashMonster(monster);

    monster.position.x += Game.playerState.facing * 0.55;
    monster.position.y += 0.25;
    monster.userData.vy = 2.8;

    spawnDamageNumber(monster.position.x, monster.position.y + 1.35, baseDmg, isCrit);

    if (monster.userData.hp <= 0) {
      defeatMonster(monster);
    }
  }

  function flashMonster(monster) {
    monster.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        if (!child.userData.origColor) {
          child.userData.origColor = child.material.color.clone();
        }
        child.material.color.setHex(0xffffff);
        setTimeout(() => {
          if (child.material && child.userData.origColor) {
            child.material.color.copy(child.userData.origColor);
          }
        }, 100);
      }
    });
  }

  function defeatMonster(monster) {
    monster.userData.isAlive = false;
    monster.userData.respawnTimer = 4.0;

    Game.questKills += 1;
    if (Game.questKills > Game.questTarget) {
      Game.questKills = 1;
      Game.playerState.mesos += 250;
      logMessage('Quest Complete! +250 Mesos bonus!');
    } else {
      logMessage(`Defeated ${monster.name}! (+${monster.userData.exp} EXP)`);
    }

    addExp(monster.userData.exp);
    spawnCoin(monster.position.x, monster.position.y + 0.5, monster.userData.meso);

    let scale = 1.0;
    const shrinkInterval = setInterval(() => {
      scale -= 0.15;
      if (scale <= 0.05) {
        clearInterval(shrinkInterval);
        monster.visible = false;
      } else {
        monster.scale.set(scale, scale, scale);
      }
    }, 30);
  }

  function addExp(amount) {
    Game.playerState.exp += amount;
    if (Game.playerState.exp >= 100) {
      Game.playerState.exp -= 100;
      levelUp();
    }
    updateHUD();
  }

  function levelUp() {
    Game.playerState.level += 1;
    Game.playerState.maxHp += 65;
    Game.playerState.hp = Game.playerState.maxHp;
    Game.playerState.maxMp += 40;
    Game.playerState.mp = Game.playerState.maxMp;

    MapleAudio.playLevelUp();
    logMessage(`★ Congratulations! Reached Lv. ${Game.playerState.level}!`);
    spawnDamageNumber(Game.playerState.x, Game.playerState.y + 2.6, '★ LEVEL UP! ★', true);

    for (let i = 0; i < 24; i++) {
      const leaf = MapleModels.createMapleLeaf();
      leaf.position.set(Game.playerState.x, Game.playerState.y + 1.2, 0);
      const angle = (i / 24) * Math.PI * 2;
      const speed = 4.0 + Math.random() * 2.5;
      leaf.userData = {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 2.0,
        swaySpeed: 4.0,
        swayRange: 0.2,
        offset: Math.random()
      };
      Game.scene.add(leaf);
      Game.particles.push(leaf);
    }
  }

  function spawnDamageNumber(x, y, text, isCrit) {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 130;
    const ctx = canvas.getContext('2d');

    ctx.font = isCrit ? '900 74px "Impact", "Arial Black", sans-serif' : '800 60px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillText(text, 214, 69);

    ctx.lineWidth = 11;
    ctx.strokeStyle = '#180000';
    ctx.strokeText(text, 210, 65);

    const grad = ctx.createLinearGradient(0, 20, 0, 110);
    if (isCrit) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, '#fef08a');
      grad.addColorStop(0.65, '#f97316');
      grad.addColorStop(1, '#dc2626');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, '#d8b4fe');
      grad.addColorStop(0.75, '#9333ea');
      grad.addColorStop(1, '#581c87');
    }
    ctx.fillStyle = grad;
    ctx.fillText(text, 210, 65);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.4, 1.05, 1.0);
    sprite.position.set(x + (Math.random() - 0.5) * 0.4, y, 0.65);
    sprite.userData = { vy: 2.9, lifetime: 1.25 };

    Game.scene.add(sprite);
    Game.damageNumbers.push(sprite);
  }

  function spawnCoin(x, y, value) {
    const coin = MapleModels.createCoin(value);
    coin.position.set(x, y, 0);
    coin.userData.groundY = Game.playerState.y + 0.2;
    Game.scene.add(coin);
    Game.coins.push(coin);
  }

  function performJump() {
    if (Game.playerState.isClimbing) {
      Game.playerState.isClimbing = false;
      Game.playerState.vy = 8.8;
      MapleAudio.playJump();
      return;
    }

    if (Game.playerState.isGrounded && (Game.keys['ArrowDown'] || Game.keys['KeyS'])) {
      if (Game.playerState.y > 0.5) {
        Game.playerState.y -= 0.4;
        Game.playerState.isGrounded = false;
        Game.playerState.vy = -2.2;
        return;
      }
    }

    if (Game.playerState.isGrounded) {
      Game.playerState.vy = 12.5;
      Game.playerState.isGrounded = false;
      MapleAudio.playJump();
    }
  }

  function update(delta) {
    const ps = Game.playerState;

    if (ps.isAttacking) {
      ps.attackCooldown -= delta;
      const runtime = Game.player.userData.sculptRuntime;
      if (runtime && runtime.slashArc) {
        const alpha = Math.max(0, ps.attackCooldown / 0.32);
        runtime.slashArc.material.opacity = alpha;
        if (runtime.innerSlash) runtime.innerSlash.material.opacity = alpha * 0.85;
      }
      if (ps.attackCooldown <= 0) {
        ps.isAttacking = false;
        if (runtime && runtime.slashArc) runtime.slashArc.visible = false;
      }
    }

    let nearRope = null;
    Game.ropes.forEach((rope) => {
      if (Math.abs(ps.x - rope.x) < 0.75 && ps.y >= rope.bottomY - 0.25 && ps.y <= rope.topY + 0.45) {
        nearRope = rope;
      }
    });

    if (nearRope && (Game.keys['ArrowUp'] || Game.keys['KeyW'] || Game.keys['ArrowDown'] || Game.keys['KeyS'])) {
      if (!ps.isClimbing) {
        ps.isClimbing = true;
        ps.currentRope = nearRope;
        ps.x = nearRope.x;
        ps.vx = 0;
        ps.vy = 0;
      }
    }

    if (ps.isClimbing) {
      const climbSpeed = 4.2;
      if (Game.keys['ArrowUp'] || Game.keys['KeyW']) {
        ps.y += climbSpeed * delta;
        MapleAudio.playClimb();
      } else if (Game.keys['ArrowDown'] || Game.keys['KeyS']) {
        ps.y -= climbSpeed * delta;
        MapleAudio.playClimb();
      }

      if (ps.y > ps.currentRope.topY) {
        ps.y = ps.currentRope.topY;
        ps.isClimbing = false;
        ps.isGrounded = true;
      } else if (ps.y < ps.currentRope.bottomY) {
        ps.y = ps.currentRope.bottomY;
        ps.isClimbing = false;
        ps.isGrounded = true;
      }
    } else {
      const moveSpeed = 6.5;
      let moveDir = 0;
      if (Game.keys['ArrowLeft'] || Game.keys['KeyA']) moveDir -= 1;
      if (Game.keys['ArrowRight'] || Game.keys['KeyD']) moveDir += 1;

      if (moveDir !== 0) {
        ps.vx = moveDir * moveSpeed;
        ps.facing = moveDir;
        ps.walkCycle += delta * 14;
      } else {
        ps.vx *= 0.74;
        if (Math.abs(ps.vx) < 0.05) ps.vx = 0;
      }

      ps.vy -= 30.0 * delta;
      ps.x += ps.vx * delta;
      ps.y += ps.vy * delta;

      ps.isGrounded = false;
      const playerFootY = ps.y;
      const prevFootY = ps.y - ps.vy * delta;

      Game.platforms.forEach((plat) => {
        if (ps.x >= plat.minX - 0.45 && ps.x <= plat.maxX + 0.45) {
          if (prevFootY >= plat.topY - 0.12 && playerFootY <= plat.topY + 0.25 && ps.vy <= 0) {
            ps.y = plat.topY;
            ps.vy = 0;
            ps.isGrounded = true;
          }
        }
      });

      if (ps.y < 0) {
        ps.y = 0;
        ps.vy = 0;
        ps.isGrounded = true;
      }
    }

    ps.x = THREE.MathUtils.clamp(ps.x, -18.5, 18.5);
    Game.player.position.set(ps.x, ps.y, 0);
    // In inspect mode face forward slightly angled so user sees front sculpt immediately
    Game.player.rotation.y = Game.inspectMode ? 0 : (ps.facing > 0 ? 0.12 : Math.PI - 0.12);

    const runtime = Game.player.userData.sculptRuntime;
    if (runtime) {
      const baseY = runtime.baseBodyY || 0.78;
      if (ps.isClimbing) {
        const climbSwing = Math.sin(ps.y * 8) * 0.45;
        runtime.bodyGroup.position.y = baseY;
        runtime.leftArmGroup.rotation.x = -1.2 + climbSwing;
        runtime.rightArmGroup.rotation.x = -1.2 - climbSwing;
        runtime.leftLegGroup.rotation.x = climbSwing * 0.5;
        runtime.rightLegGroup.rotation.x = -climbSwing * 0.5;
      } else if (!ps.isGrounded) {
        runtime.bodyGroup.position.y = baseY;
        runtime.leftArmGroup.rotation.x = -0.65;
        runtime.rightArmGroup.rotation.x = -1.1;
        runtime.leftLegGroup.rotation.x = 0.55;
        runtime.rightLegGroup.rotation.x = -0.35;
        if (runtime.capeGroup) runtime.capeGroup.rotation.x = 0.35;
      } else if (Math.abs(ps.vx) > 0.1) {
        const swing = Math.sin(ps.walkCycle) * 0.62;
        runtime.bodyGroup.position.y = baseY + Math.abs(Math.cos(ps.walkCycle)) * 0.04;
        runtime.leftLegGroup.rotation.x = swing;
        runtime.rightLegGroup.rotation.x = -swing;
        runtime.leftArmGroup.rotation.x = -swing * 0.5;
        if (!ps.isAttacking) runtime.rightArmGroup.rotation.x = swing * 0.65;
        if (runtime.capeGroup) runtime.capeGroup.rotation.x = 0.18 + Math.abs(swing) * 0.18;
      } else {
        const breath = Math.sin(Game.clock.getElapsedTime() * 3.2) * 0.03;
        runtime.bodyGroup.position.y = baseY + breath;
        runtime.leftLegGroup.rotation.x = 0;
        runtime.rightLegGroup.rotation.x = 0;
        runtime.leftArmGroup.rotation.x = -0.1;
        if (!ps.isAttacking) runtime.rightArmGroup.rotation.x = -0.15;
        if (runtime.capeGroup) runtime.capeGroup.rotation.x = 0.08 + breath * 0.4;
      }

      if (ps.isAttacking) {
        const attackProgress = 1 - (ps.attackCooldown / 0.32);
        runtime.rightArmGroup.rotation.x = -Math.PI * 0.65 + attackProgress * Math.PI * 1.25;
        runtime.swordGroup.rotation.z = -Math.PI * 0.25 + attackProgress * Math.PI * 0.6;
        runtime.leftArmGroup.rotation.x = -0.4;
      } else {
        runtime.swordGroup.rotation.z = 0;
      }
    }

    // Update Monsters
    Game.monsters.forEach((monster) => {
      if (!monster.userData.isAlive) {
        monster.userData.respawnTimer -= delta;
        if (monster.userData.respawnTimer <= 0) {
          monster.userData.isAlive = true;
          monster.userData.hp = monster.userData.maxHp;
          monster.position.x = monster.userData.spawnPos.x;
          monster.position.y = monster.userData.spawnPos.y;
          monster.scale.set(1, 1, 1);
          monster.visible = true;
        }
        return;
      }

      const speed = monster.userData.speed;
      monster.position.x += monster.userData.patrolDir * speed * delta;
      if (monster.position.x < monster.userData.minX) {
        monster.position.x = monster.userData.minX;
        monster.userData.patrolDir = 1;
      } else if (monster.position.x > monster.userData.maxX) {
        monster.position.x = monster.userData.maxX;
        monster.userData.patrolDir = -1;
      }
      monster.rotation.y = monster.userData.patrolDir > 0 ? 0.35 : -0.35;

      monster.userData.hopTimer += delta * 4;
      const hop = Math.abs(Math.sin(monster.userData.hopTimer));
      monster.position.y = monster.userData.tierY + hop * 0.42;

      if (monster.userData.kind === 'mushroom') {
        const squash = 1 - hop * 0.14;
        monster.scale.set(1 / squash, squash, 1 / squash);
      } else if (monster.userData.kind === 'slime') {
        const wobble = 1 + Math.sin(monster.userData.hopTimer * 2) * 0.11;
        monster.scale.set(1 / wobble, wobble, 1 / wobble);
      } else if (monster.userData.kind === 'pig') {
        monster.position.y = monster.userData.tierY + hop * 0.22;
      }
    });

    // Ambient Bunny & Glowing Maple Portals
    const t = Game.clock.getElapsedTime();
    if (Game.bunny) {
      Game.bunny.position.y = Math.abs(Math.sin(t * 2.5)) * 0.18;
    }
    Game.portals.forEach((p, idx) => {
      if (p.userData.leaf) {
        p.userData.leaf.position.y = 0.85 + Math.sin(t * 2.2 + idx) * 0.18;
        p.userData.leaf.rotation.y = t * 1.4 + idx;
      }
      if (p.userData.aura) {
        const s = 0.9 + Math.sin(t * 3 + idx) * 0.12;
        p.userData.aura.scale.set(s, s, 1);
      }
    });

    // Damage Numbers
    for (let i = Game.damageNumbers.length - 1; i >= 0; i--) {
      const sprite = Game.damageNumbers[i];
      sprite.userData.lifetime -= delta;
      sprite.position.y += sprite.userData.vy * delta;
      sprite.userData.vy *= 0.94;
      sprite.material.opacity = Math.min(1.0, sprite.userData.lifetime * 1.6);
      if (sprite.userData.lifetime <= 0) {
        Game.scene.remove(sprite);
        Game.damageNumbers.splice(i, 1);
      }
    }

    // Meso Coins
    for (let i = Game.coins.length - 1; i >= 0; i--) {
      const coin = Game.coins[i];
      coin.rotation.z += delta * 6;
      coin.userData.vy -= 18.0 * delta;
      coin.position.y += coin.userData.vy * delta;
      const groundY = coin.userData.groundY || 0.2;
      if (coin.position.y < groundY) {
        coin.position.y = groundY;
        coin.userData.vy = -coin.userData.vy * 0.45;
        if (Math.abs(coin.userData.vy) < 0.4) coin.userData.vy = 0;
      }
      if (coin.position.distanceTo(Game.player.position) < 1.8) {
        MapleAudio.playCoin();
        ps.mesos += coin.userData.value;
        spawnDamageNumber(coin.position.x, coin.position.y + 0.6, `+${coin.userData.value} Mesos`, false);
        updateHUD();
        Game.scene.remove(coin);
        Game.coins.splice(i, 1);
      }
    }

    // Maple Leaf Particles
    Game.particles.forEach((leaf) => {
      leaf.position.y += leaf.userData.vy * delta;
      leaf.position.x += Math.sin(t * leaf.userData.swaySpeed + leaf.userData.offset) * leaf.userData.swayRange * delta;
      leaf.rotation.z += delta * 1.4;
      if (leaf.position.y < -0.5) {
        leaf.position.y = 12 + Math.random() * 3;
        leaf.position.x = (Math.random() - 0.5) * 42;
      }
    });

    // Clouds
    Game.clouds.forEach((cloud) => {
      cloud.position.x += cloud.userData.speed * delta;
      if (cloud.position.x > 30) cloud.position.x = -30;
    });

    // Smooth Camera: Gameplay Henesys Framing vs 360 Hero Inspect
    if (Game.inspectMode) {
      const targetFocus = new THREE.Vector3(ps.x, ps.y + 1.05, 0);
      const r = Game.orbit.dist;
      const cx = targetFocus.x + Math.sin(Game.orbit.yaw) * Math.cos(Game.orbit.pitch) * r;
      const cy = targetFocus.y + Math.sin(Game.orbit.pitch) * r + 0.15;
      const cz = targetFocus.z + Math.cos(Game.orbit.yaw) * Math.cos(Game.orbit.pitch) * r;
      Game.camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.14);
      Game.camera.lookAt(targetFocus);
    } else {
      const targetCamX = THREE.MathUtils.clamp(ps.x, -11.5, 11.5);
      const targetCamY = THREE.MathUtils.clamp(ps.y + 3.9, 4.4, 10.6);
      Game.camera.position.x += (targetCamX - Game.camera.position.x) * 0.08;
      Game.camera.position.y += (targetCamY - Game.camera.position.y) * 0.08;
      Game.camera.position.z += (16.0 - Game.camera.position.z) * 0.08;
      Game.camera.lookAt(Game.camera.position.x, Game.camera.position.y - 0.55, 0);
    }

    renderMiniMap();
  }

  function renderMiniMap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = 'rgba(18, 30, 48, 0.9)';
    ctx.fillRect(0, 0, w, h);

    function mapX(x) { return ((x + 21) / 42) * (w - 18) + 9; }
    function mapY(y) { return h - 10 - (y / 9.5) * (h - 20); }

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#62bd28';
    Game.platforms.forEach((plat) => {
      ctx.beginPath();
      ctx.moveTo(mapX(plat.minX), mapY(plat.topY));
      ctx.lineTo(mapX(plat.maxX), mapY(plat.topY));
      ctx.stroke();
    });

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#cca060';
    ctx.setLineDash([2, 2]);
    Game.ropes.forEach((rope) => {
      ctx.beginPath();
      ctx.moveTo(mapX(rope.x), mapY(rope.bottomY));
      ctx.lineTo(mapX(rope.x), mapY(rope.topY));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    Game.monsters.forEach((m) => {
      if (m.userData.isAlive) {
        ctx.beginPath();
        ctx.arc(mapX(m.position.x), mapY(m.position.y), 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(mapX(Game.playerState.x), mapY(Game.playerState.y), 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  function updateHUD() {
    const ps = Game.playerState;
    const hpText = document.getElementById('hud-hp-text');
    const hpBar = document.getElementById('hud-hp-bar');
    const mpText = document.getElementById('hud-mp-text');
    const mpBar = document.getElementById('hud-mp-bar');
    const expText = document.getElementById('hud-exp-text');
    const expBar = document.getElementById('hud-exp-bar');
    const levelText = document.getElementById('hud-level');
    const nameText = document.querySelector('.player-name');
    const mesosText = document.getElementById('hud-mesos');
    const questEl = document.getElementById('quest-progress');

    if (hpText) hpText.textContent = `[${ps.hp}/${ps.maxHp}]`;
    if (hpBar) hpBar.style.width = `${(ps.hp / ps.maxHp) * 100}%`;
    if (mpText) mpText.textContent = `[${ps.mp}/${ps.maxMp}]`;
    if (mpBar) mpBar.style.width = `${(ps.mp / ps.maxMp) * 100}%`;
    if (expText) expText.textContent = `${ps.exp.toFixed(2)}%`;
    if (expBar) expBar.style.width = `${ps.exp}%`;
    if (levelText) levelText.textContent = `LV. ${ps.level}`;
    if (nameText) nameText.textContent = `${ps.job} · ${ps.name}`;
    if (mesosText) mesosText.textContent = `${ps.mesos.toLocaleString()} Mesos`;
    if (questEl) questEl.textContent = `Hunt Henesys Monsters (${Game.questKills}/${Game.questTarget})`;
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(Game.clock.getDelta(), 0.1);
    update(delta);
    Game.renderer.render(Game.scene, Game.camera);
  }

  window.addEventListener('DOMContentLoaded', () => {
    initScene();
    buildWorld();
    spawnEntities();
    initControls();
    updateHUD();

    const startAudio = () => {
      MapleAudio.startBgm();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
    window.addEventListener('touchstart', startAudio);

    animate();
  });

  window.Game = Game;
})();
