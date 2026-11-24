// MapleStory 3D - Henesys Hunting Ground Interactive Game Engine
// Upgraded: Dawn Warrior Character & High-Detail Henesys Environment
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
    coins: [],
    damageNumbers: [],
    particles: [],
    clouds: [],
    keys: {},
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
      exp: 58.4,
      mesos: 48920
    },
    clock: new THREE.Clock()
  };

  // Initialize Three.js Scene, Camera, Lighting
  function initScene() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    Game.scene = new THREE.Scene();
    Game.scene.background = new THREE.Color(0x7dc2f5); // Henesys clear sky blue
    Game.scene.fog = new THREE.FogExp2(0x7dc2f5, 0.012);

    Game.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    Game.camera.position.set(0, 5.0, 15.5);

    Game.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    Game.renderer.setSize(width, height);
    Game.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    Game.renderer.shadowMap.enabled = true;
    Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(Game.renderer.domElement);

    // Ambient & Hemisphere Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x558833, 0.75);
    Game.scene.add(hemiLight);

    // Directional Sunlight (Sunbeams)
    const sunLight = new THREE.DirectionalLight(0xfffaea, 1.25);
    sunLight.position.set(10, 18, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 18;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0004;
    Game.scene.add(sunLight);

    // Soft Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xffe4b5, 0.45);
    fillLight.position.set(-10, 8, 8);
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

  // Build the Exact 3-Tiered Henesys Hunting Ground (from 202610291451187649.webp.jpeg)
  function buildWorld() {
    // 1. Exact 3-Tiered Platform Layout
    // Bottom Floor: Wide continuous grassy hunting floor
    createPlatform(0, 0, 40, 1.4, 4.5);

    // Middle Tier: Long suspended hunting platform
    createPlatform(0, 3.8, 36, 0.9, 4.0);

    // Top Tier: High summit hunting platform
    createPlatform(0, 7.6, 36, 0.9, 4.0);

    // 2. Climbable Vertical Ropes connecting tiers
    // Floor to Middle Tier
    createRope(-10, 0, 3.8);
    createRope(0, 0, 3.8);
    createRope(10, 0, 3.8);

    // Middle Tier to Top Tier
    createRope(-6, 3.8, 3.8);
    createRope(6, 3.8, 3.8);

    // 3. Exact Environment Props (matching 202610291451187649.webp.jpeg)
    // Haystacks / Straw Bales (stacked in clusters, especially on right side)
    const hayBottomRight = MapleModels.createHaystack(true);
    hayBottomRight.position.set(15.5, 0, -0.6);
    const hayMidRight = MapleModels.createHaystack(true);
    hayMidRight.position.set(14.5, 3.8, -0.6);
    const hayTopRight = MapleModels.createHaystack(false);
    hayTopRight.position.set(13.5, 7.6, -0.6);
    const hayTopLeft = MapleModels.createHaystack(false);
    hayTopLeft.position.set(-15, 7.6, -0.6);
    Game.scene.add(hayBottomRight, hayMidRight, hayTopRight, hayTopLeft);

    // Henesys ETC Vendor Shack (Pink Roof Shop on Bottom Floor Right)
    const shop = MapleModels.createShopHut();
    shop.position.set(11.5, 0, -0.8);
    Game.scene.add(shop);

    // Apple Trees & Apple Bushes
    const appleTree1 = MapleModels.createAppleTree();
    appleTree1.position.set(-14, 0, -1.2);
    const appleTree2 = MapleModels.createAppleTree();
    appleTree2.position.set(-4, 3.8, -1.0);
    const appleTree3 = MapleModels.createAppleTree();
    appleTree3.position.set(4, 7.6, -1.0);
    Game.scene.add(appleTree1, appleTree2, appleTree3);

    // Background Rolling Hills (Distant)
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x488a32, roughness: 0.95 });
    for (let i = -4; i <= 4; i++) {
      const hillGeo = new THREE.SphereGeometry(16, 16, 12);
      hillGeo.scale(1.8, 0.75, 1);
      const hill = new THREE.Mesh(hillGeo, hillMat);
      hill.position.set(i * 12, -4, -14);
      Game.scene.add(hill);
    }

    // Floating Cartoon Clouds
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.88 });
    for (let i = 0; i < 9; i++) {
      const cloudGroup = new THREE.Group();
      for (let j = 0; j < 5; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.4 + Math.random() * 0.9, 12, 10), cloudMat);
        puff.position.set((j - 2) * 1.4, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
        cloudGroup.add(puff);
      }
      cloudGroup.position.set((Math.random() - 0.5) * 50, 9 + Math.random() * 7, -9 + Math.random() * 4);
      cloudGroup.userData = { speed: 0.35 + Math.random() * 0.45 };
      Game.scene.add(cloudGroup);
      Game.clouds.push(cloudGroup);
    }

    // Autumn Maple Leaf Particle System
    for (let i = 0; i < 40; i++) {
      const leaf = MapleModels.createMapleLeaf();
      leaf.position.set((Math.random() - 0.5) * 40, Math.random() * 16, (Math.random() - 0.5) * 4);
      leaf.userData = {
        vy: -0.65 - Math.random() * 0.85,
        swaySpeed: 1.6 + Math.random() * 2.2,
        swayRange: 0.35 + Math.random() * 0.55,
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

  // Spawn Player & Monsters
  function spawnEntities() {
    // 1. Spawn Dawn Warrior Player
    Game.player = MapleModels.createPlayer();
    Game.player.position.set(0, 0, 0);
    Game.scene.add(Game.player);
    Game.playerState.x = 0;
    Game.playerState.y = 0;

    // 2. Spawn Monsters (Orange Mushrooms, Green Slimes, and Pigs across all 3 tiers)
    // Bottom Floor
    spawnMonster('mushroom', -7, 0, -16, 8);
    spawnMonster('slime', -2, 0, -16, 8);
    spawnMonster('pig', 5, 0, -16, 8, true); // Black Pig

    // Middle Tier
    spawnMonster('slime', -11, 3.8, -16, 16);
    spawnMonster('mushroom', -3, 3.8, -16, 16);
    spawnMonster('pig', 3, 3.8, -16, 16, false); // Ribbon Pig
    spawnMonster('mushroom', 9, 3.8, -16, 16);

    // Top Tier
    spawnMonster('mushroom', -10, 7.6, -16, 16);
    spawnMonster('slime', -2, 7.6, -16, 16);
    spawnMonster('mushroom', 6, 7.6, -16, 16);
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

  // Keyboard & Touch Controls
  function initControls() {
    window.addEventListener('keydown', (e) => {
      Game.keys[e.code] = true;

      // Attack on Ctrl or KeyX
      if ((e.code === 'ControlLeft' || e.code === 'ControlRight' || e.code === 'KeyX') && !Game.playerState.isAttacking) {
        performAttack();
      }

      // Jump on Space or Alt
      if ((e.code === 'Space' || e.code === 'AltLeft' || e.code === 'AltRight') && !e.repeat) {
        performJump();
      }

      // Music toggle shortcut (M)
      if (e.code === 'KeyM') {
        toggleMute();
      }
    });

    window.addEventListener('keyup', (e) => {
      Game.keys[e.code] = false;
    });

    // Mobile On-Screen Buttons
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
    if (soundBtn) {
      soundBtn.addEventListener('click', toggleMute);
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

  // Attack Action & Hitbox Check
  function performAttack() {
    if (Game.playerState.isAttacking || Game.playerState.isClimbing) return;
    Game.playerState.isAttacking = true;
    Game.playerState.attackCooldown = 0.32;

    MapleAudio.playAttack();

    // Show Glowing Slash Arc Effect
    const runtime = Game.player.userData.sculptRuntime;
    if (runtime && runtime.slashArc) {
      runtime.slashArc.visible = true;
      runtime.slashArc.material.opacity = 0.95;
      runtime.slashArc.rotation.z = Game.playerState.facing > 0 ? 0 : Math.PI;
      runtime.slashArc.position.x = Game.playerState.facing * 0.6;
    }

    // Check monster collisions within attack range
    const px = Game.playerState.x;
    const py = Game.playerState.y;
    const attackRange = 2.6;

    Game.monsters.forEach((monster) => {
      if (!monster.userData.isAlive) return;

      const mx = monster.position.x;
      const my = monster.position.y;
      const dx = mx - px;
      const dy = Math.abs(my - py);

      const inFront = (Game.playerState.facing > 0 && dx > -0.4 && dx < attackRange) ||
                      (Game.playerState.facing < 0 && dx < 0.4 && dx > -attackRange);

      if (inFront && dy < 1.4) {
        hitMonster(monster);
      }
    });
  }

  // Damage & Monster Reaction
  function hitMonster(monster) {
    const isCrit = Math.random() < 0.4;
    // High-impact Dawn Warrior critical hits
    const baseDmg = isCrit ? Math.floor(620 + Math.random() * 580) : Math.floor(120 + Math.random() * 85);

    monster.userData.hp -= baseDmg;
    MapleAudio.playHit(isCrit);

    // Flash white/red
    flashMonster(monster);

    // Knockback
    monster.position.x += Game.playerState.facing * 0.55;
    monster.position.y += 0.25;
    monster.userData.vy = 2.8;

    // Spawn classic Maple Damage Number popup
    spawnDamageNumber(monster.position.x, monster.position.y + 1.25, baseDmg, isCrit);

    if (monster.userData.hp <= 0) {
      defeatMonster(monster);
    }
  }

  function flashMonster(monster) {
    monster.traverse((child) => {
      if (child.isMesh && child.material) {
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
    spawnDamageNumber(Game.playerState.x, Game.playerState.y + 2.5, '★ LEVEL UP! ★', true);

    // Golden Maple leaf particle burst
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
        offset: Math.random(),
        lifetime: 1.8
      };
      Game.scene.add(leaf);
      Game.particles.push(leaf);
    }
  }

  // Classic MapleStory Damage Numbers Popup (Yellow/Orange Crits & Purple Regular)
  function spawnDamageNumber(x, y, text, isCrit) {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 130;
    const ctx = canvas.getContext('2d');

    ctx.font = isCrit ? '900 74px "Impact", "Arial Black", sans-serif' : '800 60px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillText(text, 214, 69);

    // Thick dark outer stroke
    ctx.lineWidth = 11;
    ctx.strokeStyle = '#180000';
    ctx.strokeText(text, 210, 65);

    // Inner bright gradient
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
    sprite.position.set(x + (Math.random() - 0.5) * 0.4, y, 0.6);

    sprite.userData = {
      vy: 2.9,
      lifetime: 1.25
    };

    Game.scene.add(sprite);
    Game.damageNumbers.push(sprite);
  }

  // Meso Coin Drop
  function spawnCoin(x, y, value) {
    const coin = MapleModels.createCoin(value);
    coin.position.set(x, y, 0);
    Game.scene.add(coin);
    Game.coins.push(coin);
  }

  // Jump Action
  function performJump() {
    if (Game.playerState.isClimbing) {
      Game.playerState.isClimbing = false;
      Game.playerState.vy = 8.8;
      MapleAudio.playJump();
      return;
    }

    // Drop down through platform with Down + Jump
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

  // Physics & Animation Loop
  function update(delta) {
    const ps = Game.playerState;

    // 1. Attack Cooldown & Slash Arc
    if (ps.isAttacking) {
      ps.attackCooldown -= delta;
      const runtime = Game.player.userData.sculptRuntime;
      if (runtime && runtime.slashArc) {
        runtime.slashArc.material.opacity = Math.max(0, ps.attackCooldown / 0.32);
      }
      if (ps.attackCooldown <= 0) {
        ps.isAttacking = false;
        if (runtime && runtime.slashArc) runtime.slashArc.visible = false;
      }
    }

    // 2. Rope Check (Climbing mode)
    let nearRope = null;
    Game.ropes.forEach((rope) => {
      const dx = Math.abs(ps.x - rope.x);
      if (dx < 0.7 && ps.y >= rope.bottomY - 0.25 && ps.y <= rope.topY + 0.45) {
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
      const climbSpeed = 4.0;
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
      // Horizontal Movement
      const moveSpeed = 6.4;
      let moveDir = 0;
      if (Game.keys['ArrowLeft'] || Game.keys['KeyA']) moveDir -= 1;
      if (Game.keys['ArrowRight'] || Game.keys['KeyD']) moveDir += 1;

      if (moveDir !== 0) {
        ps.vx = moveDir * moveSpeed;
        ps.facing = moveDir;
        ps.walkCycle += delta * 15;
      } else {
        ps.vx *= 0.74;
        if (Math.abs(ps.vx) < 0.05) ps.vx = 0;
      }

      // Gravity
      ps.vy -= 30.0 * delta;
      ps.x += ps.vx * delta;
      ps.y += ps.vy * delta;

      // Platform Landing
      ps.isGrounded = false;
      const playerFootY = ps.y;
      const prevFootY = ps.y - ps.vy * delta;

      Game.platforms.forEach((plat) => {
        if (ps.x >= plat.minX - 0.45 && ps.x <= plat.maxX + 0.45) {
          if (prevFootY >= plat.topY - 0.1 && playerFootY <= plat.topY + 0.25 && ps.vy <= 0) {
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

    // Update Player Mesh & Articulation
    Game.player.position.set(ps.x, ps.y, 0);
    Game.player.rotation.y = ps.facing > 0 ? 0 : Math.PI;

    const runtime = Game.player.userData.sculptRuntime;
    if (runtime) {
      if (ps.isClimbing) {
        const climbSwing = Math.sin(ps.y * 8) * 0.45;
        runtime.leftArmGroup.rotation.x = -1.2 + climbSwing;
        runtime.rightArmGroup.rotation.x = -1.2 - climbSwing;
        runtime.leftLegGroup.rotation.x = climbSwing * 0.5;
        runtime.rightLegGroup.rotation.x = -climbSwing * 0.5;
      } else if (!ps.isGrounded) {
        // Jump pose: Shield braced, sword raised
        runtime.leftArmGroup.rotation.x = -0.8;
        runtime.rightArmGroup.rotation.x = -1.2;
        runtime.leftLegGroup.rotation.x = 0.55;
        runtime.rightLegGroup.rotation.x = -0.35;
        if (runtime.capeGroup) runtime.capeGroup.rotation.x = 0.45; // Cape flies high in air
      } else if (Math.abs(ps.vx) > 0.1) {
        // Walk cycle
        const swing = Math.sin(ps.walkCycle) * 0.65;
        runtime.leftLegGroup.rotation.x = swing;
        runtime.rightLegGroup.rotation.x = -swing;
        runtime.leftArmGroup.rotation.x = -swing * 0.6;
        if (!ps.isAttacking) runtime.rightArmGroup.rotation.x = swing * 0.7;
        if (runtime.capeGroup) runtime.capeGroup.rotation.x = 0.25 + Math.abs(swing) * 0.2;
      } else {
        // Idle breathing
        const breath = Math.sin(Game.clock.getElapsedTime() * 3.5) * 0.04;
        runtime.bodyGroup.position.y = 1.0 + breath;
        runtime.leftLegGroup.rotation.x = 0;
        runtime.rightLegGroup.rotation.x = 0;
        runtime.leftArmGroup.rotation.x = 0;
        if (!ps.isAttacking) runtime.rightArmGroup.rotation.x = 0;
        if (runtime.capeGroup) runtime.capeGroup.rotation.x = 0.18 + breath * 0.5;
      }

      // Attack Sword Swing
      if (ps.isAttacking) {
        const attackProgress = 1 - (ps.attackCooldown / 0.32);
        runtime.rightArmGroup.rotation.x = -Math.PI * 0.65 + attackProgress * Math.PI * 1.25;
        runtime.swordGroup.rotation.z = -Math.PI * 0.25 + attackProgress * Math.PI * 0.6;
        runtime.leftArmGroup.rotation.x = -0.4; // Brace shield
      }
    }

    // 3. Update Monsters (Mushrooms, Slimes, Pigs)
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

      monster.rotation.y = monster.userData.patrolDir > 0 ? 0 : Math.PI;

      monster.userData.hopTimer += delta * 4;
      const hop = Math.abs(Math.sin(monster.userData.hopTimer));
      monster.position.y = monster.userData.tierY + hop * 0.45;

      if (monster.userData.kind === 'mushroom') {
        const squash = 1 - hop * 0.15;
        monster.scale.set(1 / squash, squash, 1 / squash);
      } else if (monster.userData.kind === 'slime') {
        const wobble = 1 + Math.sin(monster.userData.hopTimer * 2) * 0.12;
        monster.scale.set(1 / wobble, wobble, 1 / wobble);
      } else if (monster.userData.kind === 'pig') {
        // Pig trot bounce
        monster.position.y = monster.userData.tierY + hop * 0.25;
      }
    });

    // 4. Update Damage Numbers
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

    // 5. Update Meso Coins
    for (let i = Game.coins.length - 1; i >= 0; i--) {
      const coin = Game.coins[i];
      coin.rotation.z += delta * 6;
      coin.userData.vy -= 18.0 * delta;
      coin.position.y += coin.userData.vy * delta;

      if (coin.position.y < 0.2) {
        coin.position.y = 0.2;
        coin.userData.vy = -coin.userData.vy * 0.5;
        if (Math.abs(coin.userData.vy) < 0.4) coin.userData.vy = 0;
      }

      const dist = coin.position.distanceTo(Game.player.position);
      if (dist < 1.7) {
        MapleAudio.playCoin();
        ps.mesos += coin.userData.value;
        spawnDamageNumber(coin.position.x, coin.position.y + 0.6, `+${coin.userData.value} Mesos`, false);
        updateHUD();
        Game.scene.remove(coin);
        Game.coins.splice(i, 1);
      }
    }

    // 6. Update Maple Leaf Particles
    const time = Game.clock.getElapsedTime();
    Game.particles.forEach((leaf) => {
      leaf.position.y += leaf.userData.vy * delta;
      leaf.position.x += Math.sin(time * leaf.userData.swaySpeed + leaf.userData.offset) * leaf.userData.swayRange * delta;
      leaf.rotation.z += delta * 1.5;

      if (leaf.position.y < -0.5) {
        leaf.position.y = 12 + Math.random() * 3;
        leaf.position.x = (Math.random() - 0.5) * 40;
      }
    });

    // 7. Update Floating Clouds
    Game.clouds.forEach((cloud) => {
      cloud.position.x += cloud.userData.speed * delta;
      if (cloud.position.x > 28) cloud.position.x = -28;
    });

    // 8. Smooth Camera Follow
    const targetCamX = THREE.MathUtils.clamp(ps.x, -11, 11);
    const targetCamY = THREE.MathUtils.clamp(ps.y + 3.8, 4.5, 10.5);
    Game.camera.position.x += (targetCamX - Game.camera.position.x) * 0.08;
    Game.camera.position.y += (targetCamY - Game.camera.position.y) * 0.08;
    Game.camera.lookAt(Game.camera.position.x, Game.camera.position.y - 0.5, 0);

    renderMiniMap();
  }

  // Mini-Map 2D Canvas Renderer
  function renderMiniMap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = 'rgba(18, 30, 48, 0.88)';
    ctx.fillRect(0, 0, w, h);

    function mapX(x) { return ((x + 20) / 40) * (w - 20) + 10; }
    function mapY(y) { return h - 10 - (y / 9.5) * (h - 20); }

    // Platforms (Green lines)
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#5ca828';
    Game.platforms.forEach((plat) => {
      ctx.beginPath();
      ctx.moveTo(mapX(plat.minX), mapY(plat.topY));
      ctx.lineTo(mapX(plat.maxX), mapY(plat.topY));
      ctx.stroke();
    });

    // Ropes (Brown dashed lines)
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

    // Monsters (Red dots)
    ctx.fillStyle = '#ef4444';
    Game.monsters.forEach((m) => {
      if (m.userData.isAlive) {
        ctx.beginPath();
        ctx.arc(mapX(m.position.x), mapY(m.position.y), 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Player (Bright Yellow dot with white ring)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(mapX(Game.playerState.x), mapY(Game.playerState.y), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  // Update Status Bar HUD
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

    if (hpText) hpText.textContent = `[${ps.hp}/${ps.maxHp}]`;
    if (hpBar) hpBar.style.width = `${(ps.hp / ps.maxHp) * 100}%`;

    if (mpText) mpText.textContent = `[${ps.mp}/${ps.maxMp}]`;
    if (mpBar) mpBar.style.width = `${(ps.mp / ps.maxMp) * 100}%`;

    if (expText) expText.textContent = `${ps.exp.toFixed(2)}%`;
    if (expBar) expBar.style.width = `${ps.exp}%`;

    if (levelText) levelText.textContent = `Lv. ${ps.level}`;
    if (nameText) nameText.textContent = `${ps.job} ${ps.name}`;
    if (mesosText) mesosText.textContent = `${ps.mesos.toLocaleString()} Mesos`;
  }

  // Animation Loop
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
