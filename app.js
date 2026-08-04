const data = window.DECKLED_DATA;
const money = value => value == null ? '' : new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(value);
let activeCategory = 'all';

function whatsapp(message){
  const number = (data.brand.whatsapp || '').replace(/\D/g,'');
  const url = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener');
}

function renderCategories(){
  document.querySelector('#categoryGrid').innerHTML = data.categories.map(c=>`<article class="category-card" data-category="${c.id}"><img src="${c.image}" alt="${c.name}"><div><h3>${c.name}</h3><p>${c.description}</p></div></article>`).join('');
  document.querySelectorAll('.category-card').forEach(el=>el.addEventListener('click',()=>setFilter(el.dataset.category)));
  const filters=[{id:'all',name:'Todos'},...data.categories];
  document.querySelector('#filters').innerHTML=filters.map(f=>`<button data-filter="${f.id}" class="${f.id==='all'?'active':''}">${f.name}</button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.filter)));
}
function setFilter(id){activeCategory=id;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===id));renderProducts();document.querySelector('#filters').scrollIntoView({behavior:'smooth',block:'center'});}
function renderProducts(){
  const list=activeCategory==='all'?data.products:data.products.filter(p=>p.category===activeCategory);
  document.querySelector('#productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><span class="badge">${p.badge}</span><img src="${p.image}" alt="${p.name}"></div><div class="product-info"><h3>${p.name}</h3><p>${p.subtitle}</p><div class="product-bottom"><div class="price"><small>${p.priceLabel}</small><strong>${p.price?money(p.price):'A consultar'}</strong></div><button class="view-btn" data-product="${p.id}">Ver opciones</button></div></div></article>`).join('');
  document.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>openProduct(b.dataset.product)));
}
function openProduct(id){
  const p=data.products.find(x=>x.id===id); if(!p)return;
  const options=Object.entries(p.options||{}).map(([key,values])=>`<div class="option-row"><label>${key}</label><select data-option="${key}">${values.map(v=>`<option>${v}</option>`).join('')}</select></div>`).join('');
  document.querySelector('#modalContent').innerHTML=`<div class="modal-product"><img src="${p.image}" alt="${p.name}"><div class="modal-details"><div class="eyebrow">${p.badge}</div><h2>${p.name}</h2><p>${p.description}</p><div class="feature-list">${p.features.map(f=>`<div>✓ ${f}</div>`).join('')}</div>${options}<div class="modal-price">${p.price?`${p.priceLabel} ${money(p.price)}`:p.priceLabel}</div><button class="primary-btn wide" id="quoteProduct">${p.category==='rental'?'Cotizar este alquiler':'Consultar para comprar'}</button></div></div>`;
  const modal=document.querySelector('#productModal');modal.showModal();
  document.querySelector('#quoteProduct').onclick=()=>{
    const selected=[...document.querySelectorAll('#modalContent [data-option]')].map(s=>`${s.dataset.option}: ${s.value}`).join('\n');
    whatsapp(`Hola Deck Led, quiero consultar por:\n\nProducto: ${p.name}\n${selected}\nPrecio publicado: ${p.price?money(p.price):p.priceLabel}\n\n¿Me indican disponibilidad, plazo y precio final?`);
  };
}
document.querySelectorAll('dialog .modal-close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
document.querySelectorAll('[data-open-contact]').forEach(b=>b.onclick=()=>document.querySelector('#contactModal').showModal());
document.querySelector('#sendGeneral').onclick=()=>whatsapp(document.querySelector('#contactText').value);
document.querySelector('[data-rental-filter]').onclick=()=>setFilter('rental');

// Partículas reactivas a mouse y dedo
const canvas=document.querySelector('#particles'),ctx=canvas.getContext('2d');let W,H,dpr,particles=[],pointer={x:-9999,y:-9999,active:false};
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(120,Math.floor(W*H/12000));particles=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.7+.5}));}
addEventListener('resize',resize);addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true});addEventListener('pointerleave',()=>pointer.active=false);addEventListener('pointerdown',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true});
function animateParticles(){ctx.clearRect(0,0,W,H);for(const p of particles){if(pointer.active){const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);if(d<140&&d>1){const force=(140-d)/140;p.vx+=dx/d*force*.045;p.vy+=dy/d*force*.045}}p.vx*=.992;p.vy*=.992;p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.fillStyle='rgba(150,190,255,.65)';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(animateParticles)}resize();animateParticles();

// Mini tubos del hero
const hero=document.querySelector('#heroTubes');hero.innerHTML=Array.from({length:12},(_,i)=>`<i></i>`).join('');let heroTick=0;setInterval(()=>{heroTick+=.12;[...hero.children].forEach((el,i)=>{const h=45+Math.sin(heroTick+i*.55)*30;el.style.height=`${h+35}%`;el.style.background=`hsl(${(heroTick*35+i*18)%360} 95% 60%)`;el.style.color=`hsl(${(heroTick*35+i*18)%360} 95% 60%)`})},50);

// Simulador
const wall=document.querySelector('#tubeWall');wall.innerHTML=Array.from({length:16},(_,i)=>`<div class="tube" data-i="${i}"></div>`).join('');let effect='wave',baseColor='#7c4dff',speed=.5,t=0;
function hexRgb(hex){const n=parseInt(hex.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function simLoop(){t+=.025*speed;const rgb=hexRgb(baseColor);[...wall.children].forEach((el,i)=>{let grad,color=baseColor;if(effect==='rainbow'){const h=(t*90+i*22)%360;grad=`linear-gradient(to top,hsl(${h} 95% 50%),hsl(${(h+80)%360} 95% 62%))`;color=`hsl(${h} 95% 55%)`}else if(effect==='chase'){const on=((i-Math.floor(t*8))%16+16)%16<4;grad=`linear-gradient(to top,rgba(${rgb.join(',')},${on?1:.12}),rgba(255,255,255,${on?.9:.05}))`}else if(effect==='static'){grad=baseColor}else{const pos=(Math.sin(t*3+i*.55)+1)/2*80;grad=`linear-gradient(to top,rgba(${rgb.join(',')},.12) 0%,${baseColor} ${pos}%,rgba(255,255,255,.95) ${Math.min(pos+18,100)}%,rgba(${rgb.join(',')},.15) 100%)`}el.style.setProperty('--tube-gradient',grad);el.style.setProperty('--tube-color',color)});requestAnimationFrame(simLoop)}simLoop();
document.querySelectorAll('#effectButtons button').forEach(b=>b.onclick=()=>{effect=b.dataset.effect;document.querySelectorAll('#effectButtons button').forEach(x=>x.classList.toggle('active',x===b))});
document.querySelector('#colorPicker').oninput=e=>baseColor=e.target.value;document.querySelector('#speedRange').oninput=e=>{speed=e.target.value/50;document.querySelector('#speedValue').textContent=e.target.value+'%'};document.querySelector('#simulatorQuote').onclick=()=>whatsapp(`Hola Deck Led, estuve probando el simulador de Tubos Pixel.\nEfecto: ${effect}\nColor: ${baseColor}\nVelocidad: ${Math.round(speed*50)}%\nQuiero consultar opciones y precio.`);

renderCategories();renderProducts();
