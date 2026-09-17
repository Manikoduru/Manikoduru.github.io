const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress=document.querySelector('.scroll-progress');
const rail=document.querySelector('.timeline-fill');
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;const pct=max?scrollY/max:0;progress.style.width=`${pct*100}%`;if(rail){const timeline=rail.parentElement.parentElement.getBoundingClientRect();const passed=Math.min(1,Math.max(0,(innerHeight*.7-timeline.top)/(timeline.height)));rail.style.height=`${passed*100}%`}}, {passive:true});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const menu=document.querySelector('.menu-button'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

if(!reduced){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateZ(0)`});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
  const words=['ships.','scales.','learns.','delivers.'];let wi=0;const word=document.querySelector('#changing-word');
  setInterval(()=>{word.style.opacity=0;word.style.transform='translateY(10px)';setTimeout(()=>{wi=(wi+1)%words.length;word.textContent=words[wi];word.style.opacity=1;word.style.transform=''},260)},2600);

  const scene=document.querySelector('.character-scene');
  let sceneX=0,sceneY=0,targetX=0,targetY=0;
  addEventListener('pointermove',e=>{
    targetX=(e.clientX/innerWidth-.5);
    targetY=(e.clientY/innerHeight-.5);
    scene.style.setProperty('--gaze-x',`${targetX*10}px`);
    scene.style.setProperty('--gaze-y',`${targetY*8}px`);
    scene.style.setProperty('--head-x',`${targetX*13}px`);
    scene.style.setProperty('--head-y',`${targetY*9}px`);
    scene.style.setProperty('--head-ry',`${targetX*9}deg`);
    scene.style.setProperty('--head-rx',`${targetY*-6}deg`);
  },{passive:true});
  addEventListener('scroll',()=>scene.style.setProperty('--scroll-depth',`${Math.min(scrollY*.055,32)}px`),{passive:true});
  const animateScene=()=>{
    sceneX+=(targetX-sceneX)*.055; sceneY+=(targetY-sceneY)*.055;
    scene.style.setProperty('--scene-x',`${sceneX*8}deg`);
    scene.style.setProperty('--scene-y',`${sceneY*-5}deg`);
    scene.style.setProperty('--scene-tx',`${sceneX*18}px`);
    scene.style.setProperty('--city-x',`${sceneX*14}px`);
    scene.style.setProperty('--city-y',`${sceneY*8}px`);
    scene.style.setProperty('--city-ry',`${sceneX*3.5}deg`);
    scene.style.setProperty('--city-rx',`${sceneY*-1.8}deg`);
    scene.style.setProperty('--near-x',`${sceneX*30}px`);
    scene.style.setProperty('--near-y',`${sceneY*15}px`);
    scene.style.setProperty('--avatar-x',`${sceneX*-24}px`);
    scene.style.setProperty('--avatar-y',`${sceneY*-14}px`);
    scene.style.setProperty('--avatar-ry',`${sceneX*-8}deg`);
    scene.style.setProperty('--avatar-rx',`${sceneY*4}deg`);
    scene.style.setProperty('--card-ry',`${sceneX*5.5}deg`);
    scene.style.setProperty('--card-rx',`${sceneY*-4}deg`);
    requestAnimationFrame(animateScene);
  };
  animateScene();

  const agentSystem=document.querySelector('.agent-system');
  if(agentSystem) agentSystem.addEventListener('pointermove',e=>{
    const r=agentSystem.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    agentSystem.querySelectorAll('.agent-node').forEach((node,i)=>node.style.transform=`perspective(700px) translate3d(${x*(i%2?22:-22)}px,${y*(i<2?18:-18)}px,${20+Math.abs(x)*35}px) rotateX(${-y*4}deg) rotateY(${x*5}deg)`);
    const core=agentSystem.querySelector('.agent-core');
    core.style.marginLeft=`${-95+x*12}px`;core.style.marginTop=`${-95+y*12}px`;
  });
}

const copyButton=document.querySelector('.copy-email');
if(copyButton) copyButton.addEventListener('click',async()=>{
  const email=copyButton.dataset.email,status=document.querySelector('.copy-status');
  try{
    if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(email);
    else{
      const input=document.createElement('textarea');input.value=email;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();
    }
    status.textContent='Copied';copyButton.textContent='Email copied ✓';
  }catch{status.textContent=email;}
});

const canvas=document.querySelector('#neural-canvas'),ctx=canvas.getContext('2d');let w,h,dpr,mouse={x:0,y:0};
const nodes=Array.from({length:55},()=>({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random(),v:(Math.random()*.0015+.0005)}));
function resize(){dpr=Math.min(devicePixelRatio,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}resize();addEventListener('resize',resize);
addEventListener('pointermove',e=>{mouse.x=(e.clientX/w-.5)*20;mouse.y=(e.clientY/h-.5)*20},{passive:true});
function draw(){ctx.clearRect(0,0,w,h);const points=[];for(const n of nodes){n.z+=n.v;if(n.z>1)n.z=0;const scale=.35+n.z*.9;const x=w/2+n.x*w*.62*scale+mouse.x*n.z;const y=h/2+n.y*h*.62*scale+mouse.y*n.z;points.push({x,y,z:n.z});ctx.beginPath();ctx.arc(x,y,.5+n.z*1.6,0,Math.PI*2);ctx.fillStyle=`rgba(124,247,255,${.08+n.z*.28})`;ctx.fill()}for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);if(dist<115&&Math.abs(a.z-b.z)<.2){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(113,139,255,${(1-dist/115)*.07})`;ctx.stroke()}}if(!reduced)requestAnimationFrame(draw)}draw();
