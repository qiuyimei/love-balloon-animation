# Production guide · Love Confession / Paper Paris

Read ANIMATION_GUIDE.md, this file, STORYBOARD.md, then the actual src files before building.

The human requested the WHOLE song with the original recording, continuing the approved orange/pink Clawds, with much more movement like their supplied reference. A character must actually travel, run, jump, spin through DRAWN key views, change expression, interact with props and move between illustrated windows. Slight bobbing in one place is insufficient. Keep the characters readable and large (usually u 30–40). Each shot needs cause, event, reaction; most shots 3–6 seconds. At least one substantial body displacement or clear choreographed change per shot. Vary the movement; do not replace storytelling with nonstop shaking.

## Hard rules

- No song lyrics anywhere, including comments or reports. No on-screen text, UI labels or logos. Paper windows have abstract dots and drawings.
- Only edit your assigned chapter file. Other files and chapters are shared and owned by the lead. Report shared bugs.
- Frames are pure functions of absolute time. Never Math.random or accumulated state. Seed each separate painted prop with boilSeed().
- All actors go through MV.actor / MV.leap, preserving their orange/pink design. All visual marks use paint / inkLine. Flat 2D, no projected 3D.
- Every MV.begin must have MV.end. Every local push must have pop.
- Keep foot contact, held objects and balloon threads connected. The actor return value contains true arm-tip positions.
- Use broad visible movement. Travelling shots can move 300–900 world px; jumps 100–180 px; smooth cameras should follow. Keep feet and balloon inside the frame.
- Do not alter PROJECT, core, casts, sets, audio, studio or render scripts. Do not run full --frames renders. Only render your own compact review images, strips and crops.
- Use only 1 headless review process at a time per builder. The GPU is shared.

## Clock

Native canvas 1920×1080, output 24 fps, full recording padded to 216 seconds. BPM 90.08, BEAT 0.66607, OFF 1.9961. All music time stays identical to the downloaded source.

`SONG.bounds = [0,12.71,39.40,60.69,90.05,108.66,129.86,151.29,174.96,193.55,216]`.

`barT(k)` and `beatT(k,b)` give the grid; `MV.at(bar,beat)` snaps to a real strong accent. `SONG.near(seconds)` snaps arbitrary times to the nearest measured strong audio accent. Register each real cut as `MV.shot(at, fn, options)`; this automatically snaps and connects cuts. Define your shot's start once as a local constant, and use its actual snapped value for all local timing, e.g. `const a=SONG.near(65.94); MV.shot(a,(t,lt,dur)=>{...})`. Your final shot must not extend registration into the next builder's range. There is no extra registration at your endpoint.

## Cast and animation API

Read src/cast.js for exact signatures. The public namespace is MV; engine globals include clamp, ease, easeOut, seg, lerp, kf, mixCol, arcPt, jump, turn, spinView, pulse and bpOf.

`MV.actor(who, x, groundY, u, absoluteT, options={})` paints a character and returns `{who,x,y,u,pose,L:[x,y],R:[x,y]}`. `who` is `boy` or `girl`. Pink girl has a bow. Defaults preserve custom palette. Options:

- `mood`: any EMO key, e.g. shy, hopeful, happy, surprised, love, playful. `keys`: an emotions timeline using absolute times, e.g. `[[start,'hopeful',{emote:null}],[hit,'happy',{emote:null}]]`; use this for acted changes. Never swap eyes abruptly.
- `action`: idle, walk, run, dance, spin, float, wave. These are proved recipes. `phase` offsets movement in beats, `amp` scales some movement, `dir:-1` faces left for runs. Override a pose field after the action: `view`, `flip`, `dx`, `dy`, `sq`, `rot`, `aL`, `aR`, `walk`, `legLift`, `legSplay`, `armLen`, `frontArm`. Do not use flip to fake 3D; spin uses drawn key views.
- `sing:true` gives simple singing mouth animation without any written lyrics; use selectively for performance shots.
- `emote` default null; avoid clutter.

`MV.leap(who,t,t0,t1,fromXY,toXY,u=32,height=150,options)` is an anticipated jump with a clean landing. It clamps position before/after. Do not keep it squashed for seconds after landing: use another action when settled. Read the helper.

`MV.balloon(x,y,r,t,anchorXY=null,options={})` draws a red heart balloon and connected thread. `MV.heldBalloon(actorReturn,t,{hand:'R'|'L',r:82,rise:270,dx:30})` derives its position from a real hand; the helper returns balloon centre XY. Use `aR:.2` or `aL:.2` for a steady held arm, overriding action's arm swing.

`MV.joinHands(leftActor,rightActor,t,{a:'R',b:'L',width:12})` draws the small meeting of hands if they are within 100 px. Use u around36, centres about505px apart for a front-facing pair; their inner arms should be near `.15` rad. Ensure centres suit actual hand positions; do not stretch a ribbon across empty space.

`MV.heart(x,y,r,t,col)`, `MV.hearts(x,y,t,age,n=3,{r,life,col})` floating hearts with staggered birth and fade; age is time since event. `MV.trail(x,y,t,dir)` small speed strokes.

Props: `MV.paperFrame(x,y,w,h,t,{col,bar,ink})` painted window/paper with abstract dots; `MV.coffee(x,y,r,t,{col})` cup whose base is y; `MV.boat(x,y,width,t,{col})` paper boat with top surface at y; `MV.plane(x,y,r,t,{rot,col})` paper plane. Draw boat back/sides first, characters above, then a front rim if needed with paint(). Use original props with seed keys when adding anything privately.

## Sets and cameras

`MV.begin(kind,t,options)` opens a camera and paints the set. Always end with `MV.end()`. `options.cam=[cx,cy,zoom,rotation]` defaults `[960,540,1,0]`. World floor is `MV.FLOOR=878`. `MV.backdrop(kind,t,o)` can be used inside an existing custom camera. Kinds:

- `desk`: blue-grey desktop, a large cream illustrated window, subtle page guides. `{pages:true}` adds two small windows. Main window bounds x105..1815, y95..990. Treat its contents as a drawing, not real operating-system UI.
- `cafe`: pale café wall, two paper windows and a striped awning. Counter y850. `{cups:false}` removes default cups. Otherwise large cups centred x435 and1510 at base853.
- `river`: Paris skyline, tower at430, river y714.., promenade floor850.. with rail at776. `{boatOnly:true}` removes promenade/rail for a boat scene. `{towerX,night}` allowed.
- `roofs`: terrace floor870, skyline/tower, overhead string lights. `{night:true,lights:false}` allowed.
- `garden`: sky, skyline and a few large flowers at the bottom; floor820.
- `stage`: dusk terrace, stage at x235..1685 y870 and bunting/string lights.
- `sky`: peach sky or `{night:true}` plus stars. Add `MV.skyline(t,night,{towerX})` near the bottom if needed.

Standard wide `[960,540,1]`, medium pair `[960,620,1.15]`, close individual `[characterX,680,1.5]`. Keep within world background coverage (-700..2700). Large lateral travel should move the camera with the actor, without losing the other character or balloon. No arbitrary camera shake.

## Shot registration and seams

`MV.shot(start,(t,lt,dur)=>{...},{transition:'paper'|'balloon'|'iris'|'none',name:'descriptive-name'})`. The helper automatically covers a real seam for .17s before/after, using the INCOMING shot's transition. Do not paint manual chapter transitions; they would double up. `none` only for a truly continuous camera/action using the same absolute scene function. Otherwise use paper for page movement, balloon for emotional payoff, iris sparingly. One seam cover is fully opaque at the exact cut, so hidden set changes are allowed. Within shots do the full movement in the original scene, not a run of motionless cuts.

| boundary | incoming set / state | transition |
|---|---|---|
| 60.69 A→B | River sunset; boy left, girl right; girl now holds red heart balloon; both happy after gift | paper |
| 90.05 within B | Paper river scene; boat enters carrying them, balloon still with girl | paper or balloon |
| 108.66 B→C | Cream postcard/desktop window; same pair safely arrives from boat; balloon still with girl | paper |
| 129.86 within C | Rooftop terrace; the pair head toward dusk and lights | paper |
| 151.29 within C | City-festival / stage; the pair dance together, more little hearts/balloons than earlier | balloon |
| 174.96 C→D | Dusk skyline; the pair enter a light paper basket/boat with red balloons | balloon |
| 193.55 within D | Original cream desktop paper window; pair returns together for the ending | paper |

World-state escalation: 0–39 separated pages and one unattached red balloon;39–60.69 gift offered and accepted;60.69–108.66 pair explores together, girl carries balloon;108.66–174.96 shared date becomes a city celebration;174.96–193.55 a few balloons carry their paper vessel through the sky;193.55–216 they land together in one shared picture. Keep the primary red heart balloon recognisable even if extra small balloons appear.

## Review

Node: `C:/Users/Zllyh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
Chrome flag: `--chrome=C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe` (quote the full flag in PowerShell).
Run from this project. Example:

`& '<node path>' render.mjs '--chrome=C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' --sheet=61.5,65.5,70,75 --cols=2 --w=640 --out=out/check/b_keyframes.jpg 2>&1 | Where-Object { $_ -notmatch 'WebGL: INVALID_OPERATION: uniform' }`

The WebGL uniform warnings are expected and harmless; page errors are not. `--strip=65.0:65.35 --cols=5 --w=384` checks every frame in a key motion. `--crop-at=960,650,1200,600` focuses a pair's face/hands. Use your file prefix a/b/c/d. Look at the resulting images with view_image. At least one keyframe per shot, a strip per major motion type, and close-up detail for important faces or held props. Check your first/last frames. Aim for <0.3 sec/frame in the efficient watercolour-wash mode; it still uses p5.brush for all drawing.

The foundation model and motion sheets are out/check/foundation-models.jpg and foundation-motion.jpg. You MUST look at them before drawing.

Report: exact registered shot times, image paths you viewed, what you fixed, any shared-file problems, and measured ms/frame. Do not describe work as finished until your file is complete and reviewed. The lead handles all full-frame renders, audio, final encoding and final MP4 checks.
