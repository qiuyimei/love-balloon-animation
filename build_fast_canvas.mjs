import {readFileSync,writeFileSync} from 'node:fs';
const core=readFileSync('src/core.js','utf8');
const head=core.slice(0,core.indexOf('// ---------- paint wrapper'));
const paper=core.slice(core.indexOf('function lcg(seed)'),core.indexOf('// ---------- custom brushes'));
writeFileSync('src/fast-core.js',head+'\n'+paper+'\n'+readFileSync('src/canvas-adapter.js','utf8'));
let html=readFileSync('studio.html','utf8').replace('<script src="node_modules/p5/lib/p5.min.js"></script><script src="node_modules/p5.brush/dist/p5.brush.js"></script>','').replace('src/core.js','src/fast-core.js').replace('<script src="src/fx.js"></script>','').replace('<script>const loopName=','<script>fastInit();const loopName=');
writeFileSync('studio_fast.html',html);
console.log('Native canvas page ready');
