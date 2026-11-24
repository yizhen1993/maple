// MapleStory 3D - Henesys Hunting Ground Interactive Game Engine
(function () {
  'use strict';

  // Game State
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
      level: 25,
      job: 'Magician',
      name: 'Ashtray',
      hp: 584,
      maxHp: 584,
      mp: 991,
      maxMp: 991,
      exp: 49.35, // percentage
      mesos: 15420
    },
    clock: new THREE.Clock()
  };

  // Initialize Scene, Camera, Lighting
  function initScene() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    Game.scene = new THREE.Scene();
    Game.scene.background = new THREE.Color(0x7ec0ee); // Henesys clear sky blue
    Game.scene.fog = new THREE.FogExp2(0x7ec0ee, 0.015);

    Game.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    Game.camera.position.set(0, 4.5, 14.5);

    Game.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    Game.renderer.setSize(width, height);
    Game.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    Game.renderer.shadowMap.enabled = true;
    Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(Game.renderer.domElement);

    // Ambient & Hemisphere Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x669944, 0.7);
    Game.scene.add(hemiLight);

    // Directional Sun Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.1);
    sunLight.position.set(8, 16, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -18;
    sunLight.shadow.camera.right = 18;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0005;
    Game.scene.add(sunLight);

    // Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xffddaa, 0.4);
    fillLight.position.set(-8, 6, 8);
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

  // Build the Henesys Hunting Ground World
  function buildWorld() {
    // 1. Multi-tier Platforms
    // Ground Tier (Floor)
    createPlatform(0, 0, 36, 1.2, 4);

    // Tier 1 (Lower middle platforms)
    createPlatform(-7, 3.2, 12, 0.8, 3.5);
    createPlatform(7, 3.2, 12, 0.8, 3.5);

    // Tier 2 (Upper middle platforms)
    createPlatform(0, 6.4, 18, 0.8, 3.5);

    // Tier 3 (Top summit platforms)
    createPlatform(-8, 9.6, 10, 0.8, 3.5);
    createPlatform(8, 9.6, 10, 0.8, 3.5);

    // 2. Vertical Climbing Ropes
    createRope(-4, 0, 3.2);  // Floor to Tier 1 Left
    createRope(4, 0, 3.2);   // Floor to Tier 1 Right
    createRope(-2, 3.2, 3.2); // Tier 1 to Tier 2 Center
    createRope(2, 3.2, 3.2);  // Tier 1 to Tier 2 Center
    createRope(-5, 6.4, 3.2); // Tier 2 to Tier 3 Left
    createRope(5, 6.4, 3.2);  // Tier 2 to Tier 3 Right

    // 3. Decorative Scenery from reference image
    // Haystacks (Straw bales)
    const hay1 = MapleModels.createHaystack();
    hay1.position.set(13.5, 0, -0.6);
    const hay2 = MapleModels.createHaystack();
    hay2.position.set(10.5, 3.2, -0.6);
    hay2.scale.set(0.85, 0.85, 0.85);
    const hay3 = MapleModels.createHaystack();
    hay3.position.set(-14, 0, -0.6);
    Game.scene.add(hay1, hay2, hay3);

    // ETC Shop Hut (Right side of Floor)
    const shop = MapleModels.createShopHut();
    shop.position.set(12, 0, -0.8);
    Game.scene.add(shop);

    // Apple Bushes
    const bush1 = MapleModels.createAppleBush();
    bush1.position.set(-3.5, 3.2, -0.5);
    const bush2 = MapleModels.createAppleBush();
    bush2.position.set(3.5, 3.2, -0.5);
    const bush3 = MapleModels.createAppleBush();
    bush3.position.set(-10, 0, -0.5);
    Game.scene.add(bush1, bush2, bush3);

    // Background Rolling Hills (Distant)
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x4d9438, roughness: 0.9 });
    for (let i = -3; i <= 3; i++) {
      const hillGeo = new THREE.SphereGeometry(14, 16, 12);
      hillGeo.scale(1.6, 0.7, 1);
      const hill = new THREE.Mesh(hillGeo, hillMat);
      hill.position.set(i * 12, -4, -12);
      Game.scene.add(hill);
    }

    // Floating Clouds
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 8; i++) {
      const cloudGroup = new THREE.Group();
      for (let j = 0; j < 5; j++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 12, 10), cloudMat);
        puff.position.set((j - 2) * 1.3, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
        cloudGroup.add(puff);
      }
      cloudGroup.position.set((Math.random() - 0.5) * 45, 8 + Math.random() * 6, -8 + Math.random() * 4);
      cloudGroup.userData = { speed: 0.3 + Math.random() * 0.4 };
      Game.scene.add(cloudGroup);
      Game.clouds.push(cloudGroup);
    }

    // Autumn Maple Leaf Particle System
    for (let i = 0; i < 35; i++) {
      const leaf = MapleModels.createMapleLeaf();
      leaf.position.set((Math.random() - 0.5) * 36, Math.random() * 14, (Math.random() - 0.5) * 4);
      leaf.userData = {
        vy: -0.6 - Math.random() * 0.8,
        swaySpeed: 1.5 + Math.random() * 2.0,
        swayRange: 0.3 + Math.random() * 0.5,
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
    // 1. Spawn Player
    Game.player = MapleModels.createPlayer();
    Game.player.position.set(0, 0, 0);
    Game.scene.add(Game.player);
    Game.playerState.x = 0;
    Game.playerState.y = 0;

    // 2. Spawn Monsters (Orange Mushrooms & Green Slimes across platforms)
    // Floor Monsters
    spawnMonster('mushroom', -6, 0, -12, 12);
    spawnMonster('slime', 3, 0, -12, 12);
    spawnMonster('mushroom', 7, 0, -12, 12);

    // Tier 1 Monsters
    spawnMonster('slime', -8, 3.2, -12, -2);
    spawnMonster('mushroom', 8, 3.2, 2, 12);

    // Tier 2 Monsters
    spawnMonster('mushroom', -3, 6.4, -8, 8);
    spawnMonster('slime', 3, 6.4, -8, 8);

    // Tier 3 Monsters
    spawnMonster('mushroom', -8, 9.6, -12, -4);
    spawnMonster('slime', 8, 9.6, 4, 12);
  }

  function spawnMonster(type, x, y, minX, maxX) {
    const monster = type === 'mushroom' ? MapleModels.createOrangeMushroom() : MapleModels.createGreenSlime();
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

  // Keyboard & Touch Input Handling
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

    // On-screen touch buttons for mobile
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

    // Show Slash Arc Effect
    const runtime = Game.player.userData.sculptRuntime;
    if (runtime && runtime.slashArc) {
      runtime.slashArc.visible = true;
      runtime.slashArc.material.opacity = 0.95;
      runtime.slashArc.rotation.z = Game.playerState.facing > 0 ? 0 : Math.PI;
      runtime.slashArc.position.x = Game.playerState.facing * 0.5;
    }

    // Check monster collisions within attack range
    const px = Game.playerState.x;
    const py = Game.playerState.y;
    const attackRange = 2.4;

    Game.monsters.forEach((monster) => {
      if (!monster.userData.isAlive) return;

      const mx = monster.position.x;
      const my = monster.position.y;
      const dx = mx - px;
      const dy = Math.abs(my - py);

      // Hit if in front of player and on same platform level
      const inFront = (Game.playerState.facing > 0 && dx > -0.4 && dx < attackRange) ||
                      (Game.playerState.facing < 0 && dx < 0.4 && dx > -attackRange);

      if (inFront && dy < 1.4) {
        hitMonster(monster);
      }
    });
  }

  // Damage & Monster Reaction
  function hitMonster(monster) {
    const isCrit = Math.random() < 0.35;
    const baseDmg = isCrit ? Math.floor(180 + Math.random() * 120) : Math.floor(45 + Math.random() * 40);

    monster.userData.hp -= baseDmg;
    MapleAudio.playHit(isCrit);

    // Flash white/red
    flashMonster(monster);

    // Knockback
    monster.position.x += Game.playerState.facing * 0.45;
    monster.position.y += 0.2;
    monster.userData.vy = 2.5;

    // Spawn classic Maple Damage Number popup
    spawnDamageNumber(monster.position.x, monster.position.y + 1.2, baseDmg, isCrit);

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
    monster.userData.respawnTimer = 4.0; // 4 seconds respawn

    // Add EXP & check level up
    addExp(monster.userData.exp);

    // Drop Meso Coins
    spawnCoin(monster.position.x, monster.position.y + 0.5, monster.userData.meso);

    // Shrink death animation
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
    Game.playerState.maxHp += 45;
    Game.playerState.hp = Game.playerState.maxHp;
    Game.playerState.maxMp += 30;
    Game.playerState.mp = Game.playerState.maxMp;

    MapleAudio.playLevelUp();

    // Show Level Up celebration text
    spawnDamageNumber(Game.playerState.x, Game.playerState.y + 2.4, '★ LEVEL UP! ★', true);

    // Burst of golden Maple leaf particles
    for (let i = 0; i < 20; i++) {
      const leaf = MapleModels.createMapleLeaf();
      leaf.position.set(Game.playerState.x, Game.playerState.y + 1.2, 0);
      const angle = (i / 20) * Math.PI * 2;
      const speed = 3.5 + Math.random() * 2.5;
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

  // Damage Number Canvas Billboards
  function spawnDamageNumber(x, y, text, isCrit) {
    const canvas = document.createElement('canvas');
    canvas.width = 380;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    // Classic Maple typography: bold cartoon numbers with shadow & outline
    ctx.font = isCrit ? '900 68px "Impact", "Arial Black", sans-serif' : '800 56px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(text, 194, 64);

    // Outer thick dark stroke
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#220000';
    ctx.strokeText(text, 190, 60);

    // Inner bright gradient fill
    const grad = ctx.createLinearGradient(0, 20, 0, 100);
    if (isCrit) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#ffea00');
      grad.addColorStop(0.7, '#ff6a00');
      grad.addColorStop(1, '#ff0033');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#e0a0ff');
      grad.addColorStop(1, '#8020d0');
    }
    ctx.fillStyle = grad;
    ctx.fillText(text, 190, 60);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.2, 1.0, 1.0);
    sprite.position.set(x + (Math.random() - 0.5) * 0.4, y, 0.5);

    sprite.userData = {
      vy: 2.8,
      opacity: 1.0,
      lifetime: 1.2
    };

    Game.scene.add(sprite);
    Game.damageNumbers.push(sprite);
  }

  // Meso Coin Drops
  function spawnCoin(x, y, value) {
    const coin = MapleModels.createCoin(value);
    coin.position.set(x, y, 0);
    Game.scene.add(coin);
    Game.coins.push(coin);
  }

  // Jump Action (with Drop-Down support)
  function performJump() {
    if (Game.playerState.isClimbing) {
      // Jump off rope
      Game.playerState.isClimbing = false;
      Game.playerState.vy = 8.5;
      MapleAudio.playJump();
      return;
    }

    // Drop down through platform if pressing Down
    if (Game.playerState.isGrounded && (Game.keys['ArrowDown'] || Game.keys['KeyS'])) {
      // Don't drop through ground floor (topY <= 0)
      if (Game.playerState.y > 0.5) {
        Game.playerState.y -= 0.4;
        Game.playerState.isGrounded = false;
        Game.playerState.vy = -2.0;
        return;
      }
    }

    if (Game.playerState.isGrounded) {
      Game.playerState.vy = 12.0;
      Game.playerState.isGrounded = false;
      MapleAudio.playJump();
    }
  }

  // Game Loop: Update Physics, Monster AI, Animations
  function update(delta) {
    const ps = Game.playerState;

    // 1. Attack Cooldown & Slash Arc Animation
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
      if (dx < 0.65 && ps.y >= rope.bottomY - 0.2 && ps.y <= rope.topY + 0.4) {
        nearRope = rope;
      }
    });

    if (nearRope && (Game.keys['ArrowUp'] || Game.keys['KeyW'] || Game.keys['ArrowDown'] || Game.keys['KeyS'])) {
      if (!ps.isClimbing) {
        ps.isClimbing = true;
        ps.currentRope = nearRope;
        ps.x = nearRope.x; // Snap horizontally to rope
        ps.vx = 0;
        ps.vy = 0;
      }
    }

    if (ps.isClimbing) {
      const climbSpeed = 3.8;
      if (Game.keys['ArrowUp'] || Game.keys['KeyW']) {
        ps.y += climbSpeed * delta;
        MapleAudio.playClimb();
      } else if (Game.keys['ArrowDown'] || Game.keys['KeyS']) {
        ps.y -= climbSpeed * delta;
        MapleAudio.playClimb();
      }

      // Check rope ends
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
      // 3. Horizontal Walking Movement
      const moveSpeed = 6.2;
      let moveDir = 0;
      if (Game.keys['ArrowLeft'] || Game.keys['KeyA']) moveDir -= 1;
      if (Game.keys['ArrowRight'] || Game.keys['KeyD']) moveDir += 1;

      if (moveDir !== 0) {
        ps.vx = moveDir * moveSpeed;
        ps.facing = moveDir;
        ps.walkCycle += delta * 14;
      } else {
        ps.vx *= 0.75; // Friction
        if (Math.abs(ps.vx) < 0.05) ps.vx = 0;
      }

      // Gravity
      ps.vy -= 30.0 * delta;
      ps.x += ps.vx * delta;
      ps.y += ps.vy * delta;

      // Platform Collisions (Landing on top of one-way platforms)
      ps.isGrounded = false;
      const playerFootY = ps.y;
      const prevFootY = ps.y - ps.vy * delta;

      Game.platforms.forEach((plat) => {
        if (ps.x >= plat.minX - 0.4 && ps.x <= plat.maxX + 0.4) {
          // Landing condition
          if (prevFootY >= plat.topY - 0.1 && playerFootY <= plat.topY + 0.25 && ps.vy <= 0) {
            ps.y = plat.topY;
            ps.vy = 0;
            ps.isGrounded = true;
          }
        }
      });

      // Ground level clamp
      if (ps.y < 0) {
        ps.y = 0;
        ps.vy = 0;
        ps.isGrounded = true;
      }
    }

    // World horizontal bounds clamp
    ps.x = Math.max(-17, Math.min(17, ps.x));

    // Update Player Mesh Transforms & Rig Animations
    Game.player.position.set(ps.x, ps.y, 0);
    Game.player.rotation.y = ps.facing > 0 ? 0 : Math.PI;

    const runtime = Game.player.userData.sculptRuntime;
    if (runtime) {
      if (ps.isClimbing) {
        // Climbing pose
        const climbSwing = Math.sin(ps.y * 8) * 0.4;
        runtime.leftArmGroup.rotation.x = -1.2 + climbSwing;
        runtime.rightArmGroup.rotation.x = -1.2 - climbSwing;
        runtime.leftLegGroup.rotation.x = climbSwing * 0.5;
        runtime.rightLegGroup.rotation.x = -climbSwing * 0.5;
      } else if (!ps.isGrounded) {
        // Jump pose
        runtime.leftArmGroup.rotation.x = -1.0;
        runtime.rightArmGroup.rotation.x = -1.0;
        runtime.leftLegGroup.rotation.x = 0.5;
        runtime.rightLegGroup.rotation.x = -0.3;
      } else if (Math.abs(ps.vx) > 0.1) {
        // Walk cycle
        const swing = Math.sin(ps.walkCycle) * 0.6;
        runtime.leftLegGroup.rotation.x = swing;
        runtime.rightLegGroup.rotation.x = -swing;
        runtime.leftArmGroup.rotation.x = -swing * 0.8;
        if (!ps.isAttacking) runtime.rightArmGroup.rotation.x = swing * 0.8;
      } else {
        // Idle breathing
        const breath = Math.sin(Game.clock.getElapsedTime() * 3.5) * 0.04;
        runtime.bodyGroup.position.y = 0.9 + breath;
        runtime.leftLegGroup.rotation.x = 0;
        runtime.rightLegGroup.rotation.x = 0;
        runtime.leftArmGroup.rotation.x = 0;
        if (!ps.isAttacking) runtime.rightArmGroup.rotation.x = 0;
      }

      // Attack Arm Swing
      if (ps.isAttacking) {
        const attackProgress = 1 - (ps.attackCooldown / 0.32);
        runtime.rightArmGroup.rotation.x = -Math.PI * 0.6 + attackProgress * Math.PI * 1.1;
        runtime.weaponGroup.rotation.z = -Math.PI * 0.2 + attackProgress * Math.PI * 0.5;
      }
    }

    // 4. Update Monster AI & Bouncing
    Game.monsters.forEach((monster) => {
      if (!monster.userData.isAlive) {
        // Respawn logic
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

      // Patrol movement
      const speed = monster.userData.speed;
      monster.position.x += monster.userData.patrolDir * speed * delta;
      if (monster.position.x < monster.userData.minX) {
        monster.position.x = monster.userData.minX;
        monster.userData.patrolDir = 1;
      } else if (monster.position.x > monster.userData.maxX) {
        monster.position.x = monster.userData.maxX;
        monster.userData.patrolDir = -1;
      }

      // Face direction
      monster.rotation.y = monster.userData.patrolDir > 0 ? 0 : Math.PI;

      // Hop / Bouncing animation
      monster.userData.hopTimer += delta * 4;
      const hop = Math.abs(Math.sin(monster.userData.hopTimer));
      monster.position.y = monster.userData.tierY + hop * 0.45;

      // Squash and stretch
      if (monster.userData.kind === 'mushroom') {
        const squash = 1 - hop * 0.15;
        monster.scale.set(1 / squash, squash, 1 / squash);
      } else if (monster.userData.kind === 'slime') {
        const wobble = 1 + Math.sin(monster.userData.hopTimer * 2) * 0.1;
        monster.scale.set(1 / wobble, wobble, 1 / wobble);
      }
    });

    // 5. Update Damage Numbers
    for (let i = Game.damageNumbers.length - 1; i >= 0; i--) {
      const sprite = Game.damageNumbers[i];
      sprite.userData.lifetime -= delta;
      sprite.position.y += sprite.userData.vy * delta;
      sprite.userData.vy *= 0.94; // Slow down upward float
      sprite.material.opacity = Math.min(1.0, sprite.userData.lifetime * 1.5);

      if (sprite.userData.lifetime <= 0) {
        Game.scene.remove(sprite);
        Game.damageNumbers.splice(i, 1);
      }
    }

    // 6. Update Meso Coins (Bounce & Pickup)
    for (let i = Game.coins.length - 1; i >= 0; i--) {
      const coin = Game.coins[i];
      coin.rotation.z += delta * 6; // Spin

      // Physics
      coin.userData.vy -= 18.0 * delta;
      coin.position.y += coin.userData.vy * delta;

      // Floor bounce
      if (coin.position.y < 0.2) {
        coin.position.y = 0.2;
        coin.userData.vy = -coin.userData.vy * 0.5;
        if (Math.abs(coin.userData.vy) < 0.4) coin.userData.vy = 0;
      }

      // Magnet/Pickup by Player
      const dist = coin.position.distanceTo(Game.player.position);
      if (dist < 1.6) {
        MapleAudio.playCoin();
        ps.mesos += coin.userData.value;
        spawnDamageNumber(coin.position.x, coin.position.y + 0.6, `+${coin.userData.value} Mesos`, false);
        updateHUD();
        Game.scene.remove(coin);
        Game.coins.splice(i, 1);
      }
    }

    // 7. Update Particles (Maple Leaves)
    const time = Game.clock.getElapsedTime();
    Game.particles.forEach((leaf) => {
      leaf.position.y += leaf.userData.vy * delta;
      leaf.position.x += Math.sin(time * leaf.userData.swaySpeed + leaf.userData.offset) * leaf.userData.swayRange * delta;
      leaf.rotation.z += delta * 1.5;

      // Reset when falling below ground
      if (leaf.position.y < -0.5) {
        leaf.position.y = 12 + Math.random() * 2;
        leaf.position.x = (Math.random() - 0.5) * 36;
      }
    });

    // 8. Update Floating Clouds
    Game.clouds.forEach((cloud) => {
      cloud.position.x += cloud.userData.speed * delta;
      if (cloud.position.x > 26) {
        cloud.position.x = -26;
      }
    });

    // 9. Smooth Camera Follow
    const targetCamX = THREE.MathUtils.clamp(ps.x, -10, 10);
    const targetCamY = THREE.MathUtils.clamp(ps.y + 3.8, 4.2, 11);
    Game.camera.position.x += (targetCamX - Game.camera.position.x) * 0.08;
    Game.camera.position.y += (targetCamY - Game.camera.position.y) * 0.08;
    Game.camera.lookAt(Game.camera.position.x, Game.camera.position.y - 0.5, 0);

    // Update Mini-Map
    renderMiniMap();
  }

  // Mini-Map 2D Canvas Renderer
  function renderMiniMap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = 'rgba(20, 35, 55, 0.85)';
    ctx.fillRect(0, 0, w, h);

    // World mapping: X [-18, 18] -> [10, w-10], Y [0, 11] -> [h-10, 10]
    function mapX(x) { return ((x + 18) / 36) * (w - 20) + 10; }
    function mapY(y) { return h - 10 - (y / 11) * (h - 20); }

    // Draw Platforms (green lines)
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#5ca828';
    Game.platforms.forEach((plat) => {
      ctx.beginPath();
      ctx.moveTo(mapX(plat.minX), mapY(plat.topY));
      ctx.lineTo(mapX(plat.maxX), mapY(plat.topY));
      ctx.stroke();
    });

    // Draw Ropes (brown vertical dashed lines)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#cca060';
    ctx.setLineDash([2, 2]);
    Game.ropes.forEach((rope) => {
      ctx.beginPath();
      ctx.moveTo(mapX(rope.x), mapY(rope.bottomY));
      ctx.lineTo(mapX(rope.x), mapY(rope.topY));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw Monsters (Red dots)
    ctx.fillStyle = '#ff3333';
    Game.monsters.forEach((m) => {
      if (m.userData.isAlive) {
        ctx.beginPath();
        ctx.arc(mapX(m.position.x), mapY(m.position.y), 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Player (Bright Yellow dot with ring)
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(mapX(Game.playerState.x), mapY(Game.playerState.y), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  // Update Bottom Status Bar HUD
  function updateHUD() {
    const ps = Game.playerState;
    const hpText = document.getElementById('hud-hp-text');
    const hpBar = document.getElementById('hud-hp-bar');
    const mpText = document.getElementById('hud-mp-text');
    const mpBar = document.getElementById('hud-mp-bar');
    const expText = document.getElementById('hud-exp-text');
    const expBar = document.getElementById('hud-exp-bar');
    const levelText = document.getElementById('hud-level');
    const mesosText = document.getElementById('hud-mesos');

    if (hpText) hpText.textContent = `[${ps.hp}/${ps.maxHp}]`;
    if (hpBar) hpBar.style.width = `${(ps.hp / ps.maxHp) * 100}%`;

    if (mpText) mpText.textContent = `[${ps.mp}/${ps.maxMp}]`;
    if (mpBar) mpBar.style.width = `${(ps.mp / ps.maxMp) * 100}%`;

    if (expText) expText.textContent = `${ps.exp.toFixed(2)}%`;
    if (expBar) expBar.style.width = `${ps.exp}%`;

    if (levelText) levelText.textContent = `Lv. ${ps.level}`;
    if (mesosText) mesosText.textContent = `${ps.mesos.toLocaleString()} Mesos`;
  }

  // Main Render Loop
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(Game.clock.getDelta(), 0.1);
    update(delta);
    Game.renderer.render(Game.scene, Game.camera);
  }

  // Start Everything
  window.addEventListener('DOMContentLoaded', () => {
    initScene();
    buildWorld();
    spawnEntities();
    initControls();
    updateHUD();

    // Start Henesys nostalgic BGM on first user interaction
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
