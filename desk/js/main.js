import { asset, esc } from './utils.js';
import { buildScene } from './scene.js';
import { createCamera } from './camera.js';

const data = window.SITE_DATA;
const world = document.getElementById('desk-world');
const stage = document.getElementById('desk-stage');
const surfaces = document.getElementById('surfaces');
const map = document.getElementById('object-map');
const labels = document.getElementById('object-labels');
const dialog = document.getElementById('preview');
const rick = data.projects.find(p => p.title === 'Rick and Morty Episodes');
const mood = data.projects.find(p => p.title === 'Data Diary of Mood');

const objects = buildScene(data, surfaces);
const camera = createCamera(stage, world, dialog);

map.innerHTML=`<defs><filter id="halo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="1.7"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="halo-strong" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`+objects.map(o=>`<g class="object" id="object-${o.id}" data-object="${o.id}" data-section="${o.section}" role="button" tabindex="0" aria-label="Explore ${esc(o.title)}" aria-haspopup="dialog"><path class="outline" fill-rule="evenodd" d="${o.path}"/></g>`).join('');
objects.forEach(o=>{
  const button=document.createElement('button');button.className='object-label';button.textContent=o.title;button.style.left=o.label[0]+'px';button.style.top=o.label[1]+'px';button.setAttribute('aria-label','Explore '+o.title);button.setAttribute('aria-haspopup','dialog');button.dataset.object=o.id;button.tabIndex=-1;labels.append(button);
  const shape=document.getElementById('object-'+o.id);
  const highlight=on=>{shape.classList.toggle('active',on);button.classList.toggle('active',on);};
  for(const el of [shape,button]){el.addEventListener('pointerenter',()=>highlight(true));el.addEventListener('pointerleave',()=>highlight(false));el.addEventListener('focus',()=>highlight(true));el.addEventListener('blur',()=>highlight(false));el.addEventListener('click',()=>{if(!camera.wasDragging)openPreview(o.id,el);});}
  shape.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPreview(o.id,shape);}});
});

const notes=document.getElementById('research-notes');
notes.innerHTML=data.profile.tags.map((tag,i)=>`<button class="research-note note-${i+1}" aria-label="About ${esc(tag)}">${esc(tag)}</button>`).join('');
notes.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{if(!camera.wasDragging)openPreview('about',button);}));

const miscPage=fetch('../misc/').then(r=>{if(!r.ok)throw Error('Unavailable');return r.text();}).then(html=>new DOMParser().parseFromString(html,'text/html')).catch(()=>null);
const localHref=href=>/^https?:/i.test(href)?href:asset(href);
const article=(title,description,img,link)=>`<article>${img?`<img src="${asset(img)}" alt="${esc(title)}">`:''}${title?`<h3>${esc(title)}</h3>`:''}${description?`<p>${esc(description)}</p>`:''}${link?`<a href="${esc(localHref(link))}" ${/^https?:/.test(link)?'target="_blank" rel="noopener noreferrer"':''}>Open →</a>`:''}</article>`;
let lastTrigger,previewToken=0;
async function openPreview(id,trigger) {
  const o=objects.find(item=>item.id===id);if(!o)return;
  const token=++previewToken;lastTrigger=trigger;location.hash=id;
  const content=document.getElementById('preview-content'),title=document.getElementById('preview-title'),link=document.getElementById('open-section');
  title.textContent=o.title;
  link.href=o.section==='blog'||o.section==='misc'?`../${o.section}/`:`../index.html#${o.section}`;
  link.textContent='Open '+(o.section==='misc'?'Misc':o.section[0].toUpperCase()+o.section.slice(1))+' →';
  link.hidden=id==='contact';
  if(id==='about'){title.textContent=data.profile.name;content.innerHTML=`<img class="preview-avatar" src="${asset(data.profile.avatar)}" alt="Yu Liu">${data.profile.intro.map(p=>`<p>${p}</p>`).join('')}<div class="tags">${data.profile.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;}
  if(id==='quote')content.innerHTML=`<blockquote class="quote-preview"><em>${esc(data.profile.quote)}</em></blockquote>`;
  if(id==='contact')content.innerHTML=`<div class="contact-links"><a href="mailto:${esc(data.profile.email.replace('[at]','@'))}"><span>Email</span><strong>${esc(data.profile.email)}</strong></a><a href="${esc(data.profile.linkedin)}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong>Yu Liu ↗</strong></a></div>`;
  if(id==='rick'||id==='mood'){
    const item=id==='rick'?rick:mood;title.textContent=item.title;
    content.innerHTML=article(item.title,item.description,id==='mood'?'projects/data-diary-of-mood/detail.png':item.wideImage,item.website)+`<p class="other-works">Projects</p>`+data.projects.filter(p=>p!==item).slice(0,2).map(p=>article(p.title,p.description,p.wideImage,p.website)).join('');
  }
  if(id.startsWith('paper-')){const index=Number(id.slice(-1));title.textContent='Publications';content.innerHTML=[data.publications[index],...data.publications.filter((_,i)=>i!==index)].map(p=>article(p.title,p.authors+' · '+p.venue+(p.award?' · '+p.award:''),p.thumbnail,p.links.paper||p.links.poster)).join('');}
  if(id==='blog')content.innerHTML=data.blog.slice(0,3).map(p=>article(p.title,p.date,p.thumbnail,p.link)).join('');
  if(id==='music'){const item=data.misc.find(p=>p.title==='Music Lover');content.innerHTML=article(item.title,item.description)+article('Singing Covers on Xiaohongshu','','misc/resources/rednote.jpg','misc/resources/rednote.jpg');}
  if(id==='climbing')content.innerHTML=article('Bouldering','Small attempts on the wall — currently around V3–V4.','misc/resources/bouldering-01.jpg')+article('','','misc/resources/bouldering-02.jpg')+article('Sports',data.misc.find(p=>p.title==='Sports').description);
  if(id==='books')content.innerHTML=article('Book List',data.misc.find(p=>p.title==='Book List').description);
  if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
  if(id==='books'){
    const page=await miscPage;if(!page||previewToken!==token||!dialog.open)return;
    content.innerHTML=[...page.querySelectorAll('.book-card')].map(a=>`<a class="book-item" href="${esc(a.getAttribute('href'))}" target="_blank" rel="noopener noreferrer">${esc(a.querySelector('strong').textContent)}<span>↗</span></a>`).join('');
  }
}
document.getElementById('close-preview').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{previewToken++;lastTrigger?.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

const mobile=document.getElementById('mobile-objects');
objects.forEach(o=>{
  const button=document.createElement('button');button.className='mobile-object';button.setAttribute('aria-label','Explore '+o.title);button.setAttribute('aria-haspopup','dialog');
  const [x,y,w,h]=o.crop;
  const relevant={about:['portrait'],quote:['quote-card'],rick:['laptop-screen'],mood:['phone-screen'],'paper-0':['paper-0'],'paper-1':['paper-1'],blog:['journal-left','journal-right'],books:['book-spine-0','book-spine-1','book-spine-2']}[o.id]||[];
  const inserts=relevant.map(id=>document.getElementById(id).outerHTML.replace(/ id="[^"]*"/g,'')).join('');
  button.innerHTML=`<svg viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><image href="${asset('assets/desk/studio-v6.webp')}" width="1672" height="941"/><foreignObject width="1672" height="941"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:1672px;height:941px">${inserts}</div></foreignObject></svg><span>${esc(o.title)}</span>`;
  button.onclick=()=>openPreview(o.id,button);mobile.append(button);
});

function restore(){const key=location.hash.slice(1),direct=objects.find(o=>o.id===key),matches=direct?[direct]:objects.filter(o=>o.section===key);matches.forEach(o=>document.getElementById('object-'+o.id).classList.add('returned'));setTimeout(()=>document.querySelectorAll('.returned').forEach(e=>e.classList.remove('returned')),2600);}
restore();window.addEventListener('hashchange',()=>{if(!dialog.open)restore();});
