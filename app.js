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

// Partículas LED reactivas a mouse y dedo
const canvas = document.querySelector('#particles');
const ctx = canvas.getContext('2d', { alpha: true });
let W = 0, H = 0, dpr = 1, particles = [], animationFrame = 0;
const pointer = { x: -9999, y: -9999, active: false, pressed: false };

function particleCount() {
  const area = innerWidth * innerHeight;
  const mobile = innerWidth < 700;
  // Más densidad, pero con límite para conservar fluidez en iPhone.
  return Math.min(mobile ? 900 : 2200, Math.max(mobile ? 420 : 900, Math.floor(area / (mobile ? 1800 : 1150))));
}

function makeParticle() {
  const depth = Math.random();
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - .5) * (.12 + depth * .25),
    vy: (Math.random() - .5) * (.12 + depth * .25),
    baseVx: (Math.random() - .5) * .035,
    baseVy: (Math.random() - .5) * .035,
    size: .45 + depth * 1.9,
    depth,
    hue: 190 + Math.random() * 105,
    phase: Math.random() * Math.PI * 2,
    square: Math.random() > .58
  };
}

function resizeParticles() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: particleCount() }, makeParticle);
}

function setPointer(e) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active = true;
}

addEventListener('resize', resizeParticles, { passive: true });
addEventListener('pointermove', setPointer, { passive: true });
addEventListener('pointerdown', e => {
  setPointer(e);
  pointer.pressed = true;
  // Explosión suave al tocar o hacer clic.
  for (const p of particles) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist < 250) {
      const force = (1 - dist / 250) * 4.2;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }
  }
}, { passive: true });
addEventListener('pointerup', () => pointer.pressed = false, { passive: true });
addEventListener('pointercancel', () => { pointer.active = false; pointer.pressed = false; }, { passive: true });
addEventListener('pointerleave', () => { pointer.active = false; pointer.pressed = false; }, { passive: true });

function drawConnections() {
  // Conexiones sutiles cerca del puntero solamente, para no bajar FPS.
  if (!pointer.active || innerWidth < 700) return;
  const nearby = particles.filter(p => Math.hypot(p.x - pointer.x, p.y - pointer.y) < 175).slice(0, 42);
  ctx.lineWidth = .55;
  for (let i = 0; i < nearby.length; i++) {
    for (let j = i + 1; j < nearby.length; j++) {
      const a = nearby[i], b = nearby[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 72) {
        ctx.strokeStyle = `rgba(90,190,255,${(1 - d / 72) * .18})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles(time = 0) {
  ctx.clearRect(0, 0, W, H);
  const pulse = time * .001;

  for (const p of particles) {
    p.phase += .004 + p.depth * .004;
    p.hue += .025;

    if (pointer.active) {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const dist = Math.hypot(dx, dy) || 1;
      const radius = 190;
      if (dist < radius) {
        const force = (1 - dist / radius);
        // Repulsión + giro para generar remolino.
        p.vx += (dx / dist) * force * .052;
        p.vy += (dy / dist) * force * .052;
        p.vx += (-dy / dist) * force * .018;
        p.vy += ( dx / dist) * force * .018;
      }
    }

    p.vx += p.baseVx * .012;
    p.vy += p.baseVy * .012;
    p.vx *= .985;
    p.vy *= .985;
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -8) p.x = W + 8;
    if (p.x > W + 8) p.x = -8;
    if (p.y < -8) p.y = H + 8;
    if (p.y > H + 8) p.y = -8;

    const glow = .28 + p.depth * .55 + Math.sin(p.phase + pulse) * .12;
    const size = p.size * (1 + Math.sin(p.phase) * .16);
    ctx.shadowBlur = 4 + p.depth * 10;
    ctx.shadowColor = `hsla(${p.hue},100%,68%,.62)`;
    ctx.fillStyle = `hsla(${p.hue},100%,${66 + p.depth * 12}%,${Math.max(.12, glow)})`;

    if (p.square) {
      ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.shadowBlur = 0;
  drawConnections();
  animationFrame = requestAnimationFrame(animateParticles);
}

resizeParticles();
cancelAnimationFrame(animationFrame);
animateParticles();

// Mini tubos del hero
const hero=document.querySelector('#heroTubes');hero.innerHTML=Array.from({length:12},(_,i)=>`<i></i>`).join('');let heroTick=0;setInterval(()=>{heroTick+=.12;[...hero.children].forEach((el,i)=>{const h=45+Math.sin(heroTick+i*.55)*30;el.style.height=`${h+35}%`;el.style.background=`hsl(${(heroTick*35+i*18)%360} 95% 60%)`;el.style.color=`hsl(${(heroTick*35+i*18)%360} 95% 60%)`})},50);

// Simulador
const wall=document.querySelector('#tubeWall');wall.innerHTML=Array.from({length:16},(_,i)=>`<div class="tube" data-i="${i}"></div>`).join('');let effect='wave',baseColor='#7c4dff',speed=.5,t=0;
function hexRgb(hex){const n=parseInt(hex.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function simLoop(){t+=.025*speed;const rgb=hexRgb(baseColor);[...wall.children].forEach((el,i)=>{let grad,color=baseColor;if(effect==='rainbow'){const h=(t*90+i*22)%360;grad=`linear-gradient(to top,hsl(${h} 95% 50%),hsl(${(h+80)%360} 95% 62%))`;color=`hsl(${h} 95% 55%)`}else if(effect==='chase'){const on=((i-Math.floor(t*8))%16+16)%16<4;grad=`linear-gradient(to top,rgba(${rgb.join(',')},${on?1:.12}),rgba(255,255,255,${on?.9:.05}))`}else if(effect==='static'){grad=baseColor}else{const pos=(Math.sin(t*3+i*.55)+1)/2*80;grad=`linear-gradient(to top,rgba(${rgb.join(',')},.12) 0%,${baseColor} ${pos}%,rgba(255,255,255,.95) ${Math.min(pos+18,100)}%,rgba(${rgb.join(',')},.15) 100%)`}el.style.setProperty('--tube-gradient',grad);el.style.setProperty('--tube-color',color)});requestAnimationFrame(simLoop)}simLoop();
document.querySelectorAll('#effectButtons button').forEach(b=>b.onclick=()=>{effect=b.dataset.effect;document.querySelectorAll('#effectButtons button').forEach(x=>x.classList.toggle('active',x===b))});
document.querySelector('#colorPicker').oninput=e=>baseColor=e.target.value;document.querySelector('#speedRange').oninput=e=>{speed=e.target.value/50;document.querySelector('#speedValue').textContent=e.target.value+'%'};document.querySelector('#simulatorQuote').onclick=()=>whatsapp(`Hola Deck Led, estuve probando el simulador de Tubos Pixel.\nEfecto: ${effect}\nColor: ${baseColor}\nVelocidad: ${Math.round(speed*50)}%\nQuiero consultar opciones y precio.`);

renderCategories();renderProducts();
