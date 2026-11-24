# 🍁 MapleStory 3D — Henesys Hunting Ground

An interactive, playable 3D recreation of the classic **MapleStory Henesys Hunting Ground (Victoria Island)** built with procedural Three.js using the **`img2threejs`** reconstruction pipeline.

- **🎮 Playable Game**: [https://maple.kopipeng.online](https://maple.kopipeng.online)
- **📦 GitHub Repository**: [https://github.com/yizhen1993/maple](https://github.com/yizhen1993/maple)

---

## 📸 Reference & Reconstruction

Reconstructed from the iconic Henesys hunting grounds reference image (`202610291451187649.webp`):

```
Reference Image
       │
       ▼ (img2threejs pipeline: probe → assessment → sculpt-spec → factory)
Procedural Three.js Geometries & Procedural Canvas Shaders (Zero heavy external 3D models)
       │
       ▼
Interactive 3D Game Engine (Physics, Combat, Monster AI, Web Audio, Classic HUD)
```

### ✨ Reconstructed Assets (`public/js/models.js`)
1. **Maple Player (`MapleModels.createPlayer`)**:
   - Chibi proportions, procedural anime eyes & face canvas texture, blush, and smile.
   - Stylized dark chestnut hair locks.
   - Authentic Asian straw conical hat (笠帽) with bamboo woven canvas texture and chin strap.
   - Martial arts adventurer tunic with leather belt and golden buckle.
   - Articulated shoulder, arms, hands, legs, and boots.
   - Katana blade with glowing cyan/white crescent slash arc effect (`MeshBasicMaterial` additive blending).
2. **Orange Mushroom (`MapleModels.createOrangeMushroom`)**:
   - Squashed spherical orange cap with white polka dots and underside rim.
   - Smooth beige stalk with cartoon vertical capsule eyes and specular reflection dots.
   - Squash-and-stretch hopping animations.
3. **Green Slime (`MapleModels.createGreenSlime`)**:
   - Droplet-shaped translucent emerald green jelly body (`MeshPhysicalMaterial` transmission `0.75`, clearcoat `1.0`).
   - Signature MapleStory red ribbon bow on top.
   - Spring squish wobble animations.
4. **Henesys Stage & Scenery**:
   - Multi-tiered grassy earth platforms with procedural grass tuft canvas textures and hanging overhangs.
   - Climbable vertical ropes connecting tiers with hemp twist and knot details.
   - Straw haystacks, apple bushes, wooden merchant hut with pink tile roof and "ETC" sign.
   - Parallax scrolling cartoon clouds and autumn Maple leaf falling particle system.

---

## 🕹️ Controls & Gameplay

| Action | Keyboard Controls | Mobile Touch |
|---|---|---|
| **Move Left / Right** | `A` / `D` or `←` / `→` | On-screen D-Pad `◀` / `▶` |
| **Jump** | `Space` or `Alt` | On-screen `JUMP` button |
| **Attack (Slash)** | `Ctrl` or `X` | On-screen `ATTACK` button |
| **Climb Ropes** | `W` / `S` or `↑` / `↓` | On-screen D-Pad `▲` / `▼` |
| **Drop Down Platform** | `↓` + `Jump` | D-Pad `▼` + `JUMP` |
| **Toggle Music** | `M` key | Top-Right `🔊 Sound` button |

### ⚔️ Game Mechanics
- **Combat & Damage**: Striking monsters displays classic MapleStory bouncy damage numbers (yellow/orange criticals and purple regular hits).
- **Monster AI**: Orange Mushrooms and Slimes patrol platforms, hop, take knockback, flash on hit, and respawn.
- **Drops & Mesos**: Defeated monsters burst into bouncing gold/silver Meso coins with pickup chime sounds.
- **Leveling**: Accumulating EXP triggers a classic `LEVEL UP!` fanfare, full-screen golden Maple Leaf particle explosion, and stat restoration.
- **Web Audio**: 100% procedural sound effects (jump, blade slash, squish hit, coin chime, level-up arpeggio, and nostalgic looping Henesys BGM).

---

## 📁 Project Structure

```
maple/
├── Dockerfile                   # Node.js 18 Alpine production container
├── docker-compose.yml           # Service definition on kopipeng-net (port 3013:3000)
├── package.json                 # Express & CORS dependencies
├── server.js                    # Production web server & /health endpoint
├── sculpt-spec-maple.json       # img2threejs sculpt spec
├── assessment.json              # img2threejs pre-spec assessment
└── public/
    ├── index.html               # Main HTML entry with Classic Maple HUD
    ├── css/
    │   └── style.css            # MapleStory retro UI styling
    ├── js/
    │   ├── vendor/
    │   │   └── three.min.js     # Self-contained Three.js library
    │   ├── audio.js             # Web Audio procedural sound synthesizer & BGM
    │   ├── models.js            # Procedural 3D models (Player, Mushrooms, Slimes, World)
    │   └── game.js              # 2.5D platformer physics, combat loop & mini-map
    └── assets/
        ├── reference.png        # Source reference image
        └── reference.webp
```

---

## 🚀 Running Locally

```bash
# With Node.js
npm install
npm start
# Open http://localhost:3000

# With Docker Compose
docker compose up -d --build
# Open http://localhost:3013
```
