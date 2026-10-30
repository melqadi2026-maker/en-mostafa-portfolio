/* A small, self-contained WebGL character. No models, libraries or network requests. */
(() => {
  'use strict';
  const canvas = document.getElementById('robot-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) {
    window.dispatchEvent(new CustomEvent('roboterror', { detail: 'WebGL is unavailable' }));
    return;
  }
  const vert = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUV;
    uniform mat4 uModel, uViewProjection;
    varying vec3 vPosition, vNormal;
    varying vec2 vUV;
    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vPosition = world.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      vUV = aUV;
      gl_Position = uViewProjection * world;
    }
  `;
  const frag = `
    precision mediump float;
    varying vec3 vPosition, vNormal;
    varying vec2 vUV;
    uniform vec3 uColor, uCamera;
    uniform float uEmission, uRoughness, uGlow;
    void main() {
      if (uGlow > 0.0) {
        vec2 p = vUV * 2.0 - 1.0;
        float a = pow(max(0.0, 1.0 - length(p)), 2.4) * uGlow;
        gl_FragColor = vec4(uColor * 1.5, a);
        return;
      }
      vec3 n = normalize(vNormal);
      vec3 v = normalize(uCamera - vPosition);
      vec3 l = normalize(vec3(-3.0, 4.5, 4.0));
      vec3 r = normalize(vec3(4.0, 2.0, -0.5));
      vec3 h = normalize(l + v);
      float diffuse = max(dot(n, l), 0.0);
      float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
      float keySpec = pow(max(dot(n, h), 0.0), mix(100.0, 15.0, uRoughness));
      float edgeSpec = pow(max(dot(n, normalize(r + v)), 0.0), 38.0);
      float top = max(n.y, 0.0) * 0.12;
      vec3 light = vec3(0.10, 0.13, 0.17) + vec3(1.0, 0.78, 0.58) * diffuse * 1.15 + top;
      vec3 color = uColor * light;
      color += keySpec * vec3(0.9, 0.83, 0.72) * (1.0 - uRoughness * 0.55);
      color += edgeSpec * vec3(0.25, 0.43, 0.56) * 0.65;
      color += rim * vec3(0.12, 0.20, 0.28) * (0.25 + max(n.x, 0.0));
      color += vec3(1.0, 0.23, 0.035) * max(dot(n, normalize(vec3(-3.0, -0.7, -1.5))), 0.0) * 0.12;
      color += uColor * uEmission;
      gl_FragColor = vec4(pow(max(color, vec3(0.0)), vec3(0.4545)), 1.0);
    }
  `;
  function shader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vert));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    window.dispatchEvent(new CustomEvent('roboterror', { detail: String(error) }));
    return;
  }
  gl.useProgram(program);
  const loc = {};
  ['uModel', 'uViewProjection', 'uColor', 'uCamera', 'uEmission', 'uRoughness', 'uGlow'].forEach(name => { loc[name] = gl.getUniformLocation(program, name); });
  const attrs = ['aPosition', 'aNormal', 'aUV'].map(name => gl.getAttribLocation(program, name));
  attrs.forEach(a => gl.enableVertexAttribArray(a));
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  // Column-major transforms; scales remain uniform for correctly lit mesh normals.
  const identity = () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  function multiply(a,b) {
    const o = new Float32Array(16);
    for (let c=0;c<4;c++) for (let r=0;r<4;r++) o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
    return o;
  }
  function transform(x=0,y=0,z=0,rx=0,ry=0,rz=0) {
    const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);
    const tx=new Float32Array([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1]);
    const ty=new Float32Array([cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]);
    const tz=new Float32Array([cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1]);
    const o=multiply(multiply(ty,tx),tz);o[12]=x;o[13]=y;o[14]=z;return o;
  }
  function perspective(aspect) {
    const f=1/Math.tan(38*Math.PI/360), n=.1, fz=30;
    return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(fz+n)/(n-fz),-1,0,0,2*fz*n/(n-fz),0]);
  }
  function lookAt(eye,target) {
    const normalize=a=>{const l=Math.hypot(...a);return a.map(x=>x/l);};
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const z=normalize(eye.map((x,i)=>x-target[i])),x=normalize(cross([0,1,0],z)),y=cross(z,x);
    return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1]);
  }
  function mesh(data, indices) {
    const v=gl.createBuffer(),i=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,v);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    return {v,i,count:indices.length};
  }
  const cache=new Map();
  function box(w,h,d,r=.05) {
    const key=`b${w},${h},${d},${r}`;if(cache.has(key))return cache.get(key);
    const data=[],indices=[],half=[w/2,h/2,d/2];
    r=Math.min(r,w/2,h/2,d/2);
    const grid=(h)=>[-h,-h+r*.22,-h+r*.57,-h+r,h-r,h-r*.57,h-r*.22,h];
    for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
      const u=(axis+1)%3,v=(axis+2)%3,gu=grid(half[u]),gv=grid(half[v]),base=data.length/8;
      for(let j=0;j<8;j++)for(let i=0;i<8;i++){
        const p=[0,0,0];p[axis]=half[axis]*sign;p[u]=gu[i];p[v]=gv[j];
        const q=p.map((p,k)=>Math.max(-half[k]+r,Math.min(half[k]-r,p)));
        const n=p.map((p,k)=>p-q[k]),l=Math.hypot(...n)||1;
        for(let k=0;k<3;k++)n[k]/=l;
        data.push(q[0]+n[0]*r,q[1]+n[1]*r,q[2]+n[2]*r,...n,i/7,j/7);
      }
      for(let j=0;j<7;j++)for(let i=0;i<7;i++){
        const a=base+j*8+i,b=a+1,c=a+8,d=c+1;
        if(sign>0)indices.push(a,b,c,b,d,c);else indices.push(a,c,b,b,c,d);
      }
    }
    const m=mesh(data,indices);cache.set(key,m);return m;
  }
  function cylinder(radius,depth,segments=32) {
    const key=`c${radius},${depth},${segments}`;if(cache.has(key))return cache.get(key);
    const data=[],indices=[];
    for(let i=0;i<=segments;i++){
      const a=i/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);
      data.push(radius*c,radius*s,-depth/2,c,s,0,i/segments,0,radius*c,radius*s,depth/2,c,s,0,i/segments,1);
      if(i<segments){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}
    }
    for(const sign of [-1,1]){
      const center=data.length/8;data.push(0,0,depth/2*sign,0,0,sign,.5,.5);
      for(let i=0;i<=segments;i++){
        const a=i/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);data.push(radius*c,radius*s,depth/2*sign,0,0,sign,(c+1)/2,(s+1)/2);
        if(i<segments){if(sign>0)indices.push(center,center+i+1,center+i+2);else indices.push(center,center+i+2,center+i+1);}
      }
    }
    const m=mesh(data,indices);cache.set(key,m);return m;
  }
  function torus(radius,tube,segments=40,sides=8) {
    const key=`t${radius},${tube}`;if(cache.has(key))return cache.get(key);
    const data=[],indices=[];
    for(let i=0;i<=segments;i++)for(let j=0;j<=sides;j++){
      const a=i/segments*Math.PI*2,b=j/sides*Math.PI*2,c=Math.cos(a),s=Math.sin(a),bc=Math.cos(b),bs=Math.sin(b);
      data.push((radius+tube*bc)*c,(radius+tube*bc)*s,tube*bs,bc*c,bc*s,bs,i/segments,j/sides);
      if(i<segments&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+1,k+sides+1,k+1,k+sides+2,k+sides+1);}
    }
    const m=mesh(data,indices);cache.set(key,m);return m;
  }
  const quad=mesh([-1,-1,0,0,0,1,0,0, 1,-1,0,0,0,1,1,0, -1,1,0,0,0,1,0,1, 1,1,0,0,0,1,1,1],[0,1,2,1,3,2]);
  const palette={shell:[.33,.38,.41],light:[.62,.66,.66],trim:[.13,.16,.18],black:[.018,.026,.035],graphite:[.07,.09,.115],amber:[1,.255,.034],hot:[1,.57,.20],silver:[.43,.48,.51]};
  const parts=[],glows=[];
  function part(g,color,x,y,z,group='body',options={}) {
    parts.push({g,color:palette[color]||color,m:transform(x,y,z,options.rx||0,options.ry||0,options.rz||0),group,emission:options.emission||0,roughness:options.roughness??.35});
  }
  function halo(color,x,y,z,sx,sy,group,intensity){const m=transform(x,y,z);m[0]=sx;m[5]=sy;glows.push({g:quad,color:palette[color],m,group,glow:intensity});}

  // The body: a layered shell, exposed black joints and an orange circular core.
  part(box(1.72,1.36,.79,.19),'graphite',0,-.60,0);
  part(box(1.60,1.08,.16,.12),'shell',0,-.48,.43);
  part(box(1.04,.16,.13,.04),'light',0,.03,.50);
  part(box(.43,.09,.04,.02),'amber',-.56,-.02,.56,'body',{rz:.13,emission:.4});
  part(box(.43,.09,.04,.02),'amber',.56,-.02,.56,'body',{rz:-.13,emission:.4});
  part(box(.73,.72,.16,.12),'trim',0,-.45,.56);
  part(cylinder(.30,.10),'black',0,-.43,.69);
  part(torus(.272,.027),'silver',0,-.43,.76);
  part(torus(.224,.025),'amber',0,-.43,.77,'body',{emission:1.2});
  part(cylinder(.163,.035),'amber',0,-.43,.76,'body',{emission:1.6});
  part(cylinder(.112,.04),'hot',0,-.43,.79,'body',{emission:1.3});
  halo('amber',0,-.43,.84,.58,.58,'body',.23);
  for(const x of [-1,1]){
    part(box(.23,.51,.13,.035),'trim',x*.61,-.49,.57,'body',{rz:x*-.08});
    for(let i=0;i<3;i++)part(box(.10,.026,.025,.009),'silver',x*.61,-.36-i*.12,.65);
    part(cylinder(.05,.025,12),'silver',x*.64,-.87,.53);
  }
  part(box(1.24,.14,.62,.055),'trim',0,-1.22,.015);
  part(box(.80,.35,.47,.06),'black',0,-1.43,-.015);
  for(let i=0;i<3;i++)part(box(.88,.038,.53,.015),'trim',0,-1.32-i*.11,.01);
  part(box(1.14,.28,.63,.08),'shell',0,-1.66,.025);
  part(box(.45,.075,.05,.02),'amber',0,-1.64,.365,'body',{emission:.6});
  part(cylinder(.29,.42),'black',0,.29,0,'body',{rx:Math.PI/2});
  part(torus(.28,.035),'silver',0,.34,0,'body',{rx:Math.PI/2});
  part(box(.37,.14,.43,.04),'trim',0,.44,.04);

  // Head coordinates are relative to the neck pivot; the visor is a real inset.
  part(box(1.75,1.38,1.16,.25),'shell',0,.72,0,'head');
  part(box(1.50,1.03,.17,.19),'trim',0,.70,.563,'head');
  part(box(1.37,.88,.11,.16),'black',0,.72,.665,'head');
  part(box(.93,.11,.13,.035),'light',0,1.29,.48,'head');
  part(box(.11,.22,.025,.018),'amber',0,1.30,.561,'head',{emission:.3});
  // Two rounded, slightly tilted eyes keep the character friendly and readable.
  for(const s of [-1,1]){
    part(box(.43,.17,.047,.067),'amber',s*.344,.78,.747,'head',{rz:s*-.06,emission:1.6});
    part(box(.34,.07,.023,.025),'hot',s*.344,.80,.777,'head',{rz:s*-.06,emission:2.3});
    part(box(.48,.065,.025,.021),'trim',s*.35,.98,.733,'head',{rz:s*.06});
    halo('amber',s*.344,.78,.795,.39,.29,'head',.25);
    part(box(.16,.31,.09,.04),'silver',s*.64,.39,.64,'head',{rz:s*-.30});
    part(cylinder(.235,.20),'trim',s*.866,.74,0,'head',{ry:Math.PI/2});
    part(cylinder(.182,.23),'silver',s*.912,.74,0,'head',{ry:Math.PI/2});
    part(torus(.143,.024),'amber',s*1.04,.74,0,'head',{ry:Math.PI/2,emission:.45});
    part(cylinder(.086,.245),'graphite',s*.927,.74,0,'head',{ry:Math.PI/2});
    part(box(.18,.45,.32,.06),'trim',s*.77,.80,-.48,'head');
  }
  part(box(.48,.065,.028,.025),'trim',0,.42,.739,'head');
  for(let i=0;i<3;i++)part(box(.065,.032,.02,.01),'amber',(i-1)*.10,.42,.76,'head',{emission:.55});
  part(box(.82,.12,.52,.06),'light',0,.09,.16,'head');
  part(box(.49,.045,.025,.014),'trim',0,.09,.44,'head');
  part(box(.06,.29,.06,.02),'trim',-.56,1.48,-.23,'head',{rz:-.12});
  part(cylinder(.07,.10,16),'amber',-.578,1.65,-.23,'head',{emission:1.3});

  // Separate articulated arms. The right shoulder drives the greeting motion.
  for(const sign of [-1,1]){
    const group=sign>0?'right':'left';
    part(cylinder(.24,.42),'black',0,0,0,group,{ry:Math.PI/2});
    part(box(.67,.55,.72,.17),'shell',sign*.09,-.02,.005,group,{rz:sign*-.13});
    part(box(.43,.14,.04,.035),'amber',sign*.10,.10,.38,group,{emission:.55,rz:sign*-.13});
    part(box(.41,.53,.43,.10),'trim',sign*.15,-.47,0,group,{rz:sign*.07});
    part(cylinder(.17,.48),'black',sign*.16,-.79,.015,group,{ry:Math.PI/2});
    part(cylinder(.105,.50),'silver',sign*.16,-.79,.015,group,{ry:Math.PI/2});
    part(box(.45,.48,.47,.10),'shell',sign*.17,-1.07,.045,group,{rz:sign*-.05});
    part(box(.26,.10,.025,.025),'trim',sign*.17,-1.0,.295,group);
    part(box(.30,.12,.37,.04),'black',sign*.17,-1.35,.035,group);
    part(box(.40,.29,.32,.07),'graphite',sign*.17,-1.51,.07,group);
    for(let f=0;f<3;f++)part(box(.065,.23,.08,.022),'silver',sign*.17+(f-1)*.095,-1.54,.26,group);
    part(box(.13,.18,.14,.035),'trim',sign*.17-sign*.25,-1.43,.11,group,{rz:sign*.32});
  }

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let motion=!reduced.matches,visible=true,request=0,lastFrame=0,width=1,height=1;
  let pointerX=0,pointerY=0,headX=0,headY=0;
  let introStart=performance.now(),waveStart=-10000,initial=true;
  let vp=identity();
  let camera=[.10,.65,7.05];
  function resize(){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.7);
    width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);
    schedule();
  }
  function bind(g){gl.bindBuffer(gl.ARRAY_BUFFER,g.v);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,g.i);gl.vertexAttribPointer(attrs[0],3,gl.FLOAT,false,32,0);gl.vertexAttribPointer(attrs[1],3,gl.FLOAT,false,32,12);gl.vertexAttribPointer(attrs[2],2,gl.FLOAT,false,32,24);}
  function draw(p,groups,glow=false){
    bind(p.g);gl.uniformMatrix4fv(loc.uModel,false,multiply(groups[p.group],p.m));
    gl.uniform3fv(loc.uColor,p.color);gl.uniform1f(loc.uEmission,p.emission||0);gl.uniform1f(loc.uRoughness,p.roughness||.35);gl.uniform1f(loc.uGlow,glow?p.glow:0);
    gl.drawElements(gl.TRIANGLES,p.g.count,gl.UNSIGNED_SHORT,0);
  }
  function render(now){
    request=0;if(document.hidden||!visible||gl.isContextLost())return;
    // A 30fps ceiling keeps the small scene light on laptop and mobile batteries.
    if(motion&&now-lastFrame<30){schedule();return;}lastFrame=now;
    const t=now*.001,elapsed=(now-introStart)/1000;
    const ease=motion?1-Math.pow(1-Math.min(elapsed/2.1,1),3):1;
    const bob=motion?Math.sin(t*1.35)*.044:0;
    headX+=(pointerY*.10-headX)*.07;headY+=(pointerX*.24-headY)*.07;
    camera=[.10,.65,7.05+(1-ease)*1.55];
    vp=multiply(perspective(width/height),lookAt(camera,[0,.05,0]));
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
    gl.uniformMatrix4fv(loc.uViewProjection,false,vp);gl.uniform3fv(loc.uCamera,camera);
    const root=transform(0,bob-(1-ease)*.18,0,0,-.17+(motion?Math.sin(t*.43)*.045:0)+(1-ease)*-.48,0);
    const head=transform(0,.45,0,motion?headX+Math.sin(t*.58)*.018:0,motion?headY:0,0);
    const w=(now-waveStart)/1000;
    let wave=0,wobble=0;
    if(motion&&w>=0&&w<3.4){wave=Math.sin(Math.min(w/.7,1)*Math.PI/2)*Math.sin(Math.min((3.4-w)/.7,1)*Math.PI/2)*2.25;wobble=Math.sin(w*10)*.14*Math.min(w,1)*Math.min(3.4-w,1);}
    const groups={
      body:root,
      head:multiply(root,head),
      left:multiply(root,transform(-1.13,-.12,-.02,0,0,-.09+(motion?Math.sin(t*.8)*.018:0))),
      right:multiply(root,transform(1.13,-.12,-.02,0,wave*.06,.09+wave+wobble))
    };
    gl.disable(gl.BLEND);gl.depthMask(true);parts.forEach(p=>draw(p,groups));
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);glows.forEach(p=>draw(p,groups,true));gl.depthMask(true);gl.disable(gl.BLEND);
    if(initial){initial=false;window.dispatchEvent(new CustomEvent('robotready'));}
    if(motion)schedule();
  }
  function schedule(){if(!request&&!document.hidden&&visible)request=requestAnimationFrame(render);}
  canvas.addEventListener('pointermove',event=>{if(!motion)return;const r=canvas.getBoundingClientRect();pointerX=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));pointerY=Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1));schedule();},{passive:true});
  canvas.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;},{passive:true});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(request)cancelAnimationFrame(request);request=0;window.dispatchEvent(new CustomEvent('roboterror',{detail:'Graphics context lost'}));});
  canvas.addEventListener('webglcontextrestored',()=>window.dispatchEvent(new CustomEvent('roboterror',{detail:'Please reload to restore the robot'})));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&request){cancelAnimationFrame(request);request=0;}else schedule();});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else if(request){cancelAnimationFrame(request);request=0;}},{rootMargin:'100px'}).observe(canvas);
  window.robotScene={
    setMotion(enabled){motion=Boolean(enabled);if(!motion&&request){cancelAnimationFrame(request);request=0;}schedule();},
    replay(){introStart=performance.now();schedule();},
    wave(){waveStart=performance.now();schedule();}
  };
  resize();schedule();
})();
