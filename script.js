const $ = (id) => document.getElementById(id);
const toast = (message) => { const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove('show'),2100); };

// Navigation
function openView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  $('view-'+name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  $('crumb').textContent=({overview:'Overview',editor:'Code editor',colors:'Color picker',json:'JSON formatter',url:'URL encoder',notes:'Quick notes',pomodoro:'Pomodoro'})[name];
  $('sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view)));
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.open)));
$('menuBtn').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('devspace-theme',document.body.classList.contains('light')?'light':'dark')});
if(localStorage.getItem('devspace-theme')==='light')document.body.classList.add('light');

// Copy helper
async function copyText(value){try{await navigator.clipboard.writeText(value);toast('Copied to clipboard!')}catch(e){toast('Clipboard unavailable — select and copy the text.')}}
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText($(b.dataset.copy).value)));

// Code editor
let activeTab='html';
document.querySelectorAll('.editor-tab').forEach(b=>b.addEventListener('click',()=>{
  activeTab=b.dataset.tab;
  document.querySelectorAll('.editor-tab').forEach(t=>t.classList.toggle('selected',t===b));
  ['html','css','js'].forEach(t=>$ (t+'Code').classList.toggle('hidden',t!==activeTab));
}));
const defaults={
 html:'<h1>Hello, DevSpace!</h1>\\n<p>Start creating something awesome.</p>\\n<button onclick="document.querySelector(\\'p\\').textContent=\\'You clicked the button!\\'">Click me</button>',
 css:'body {\\n  font-family: Arial, sans-serif;\\n  padding: 30px;\\n  color: #18213a;\\n}\\nh1 { color: #7057f5; }\\nbutton { padding: 10px 16px; border: 0; border-radius: 8px; background: #7057f5; color: white; cursor: pointer; }',
 js:'// Write your JavaScript here\\nconsole.log("Hello from DevSpace!");'
};
function runPreview(){
  const html=$('htmlCode').value, css=$('cssCode').value, js=$('jsCode').value;
  const doc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css.replace(/<\\/style/gi,'<\\\\/style')+'</style></head><body>'+html+'<script>\\n'+js.replace(/<\\/script/gi,'<\\\\/script')+'\\n<\\/script></body></html>';
  $('preview').srcdoc=doc;
  toast('Preview updated!');
}
$('runCode').addEventListener('click',runPreview);
$('resetCode').addEventListener('click',()=>{if(confirm('Reset the editor to its starter code?')){Object.keys(defaults).forEach(k=>$(k+'Code').value=defaults[k]);runPreview();}});
runPreview();

// Color picker
const paletteColors=['#7057F5','#FF6B9A','#FF9F43','#F6C945','#42C99A','#38BDF8','#6477F5','#A78BFA','#F472B6','#14B8A6','#F97316','#94A3B8','#E879F9','#84CC16','#0EA5E9','#1E293B'];
function setColor(hex){$('colorInput').value=hex;$('colorStage').style.background=hex;$('largeSwatch').style.background=hex;$('hexValue').value=hex.toUpperCase();$('colorHexLabel').textContent=hex.toUpperCase();const n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;$('rgbValue').value=`rgb(${r}, ${g}, ${b})`;}
$('colorInput').addEventListener('input',e=>setColor(e.target.value));
$('hexValue').addEventListener('change',e=>{let v=e.target.value.trim();if(!v.startsWith('#'))v='#'+v;if(/^#[0-9a-fA-F]{6}$/.test(v))setColor(v);else toast('Enter a valid 6-digit HEX color.')});
$('palette').innerHTML=paletteColors.map(c=>`<button class="swatch" style="background:${c}" data-color="${c}" aria-label="Use ${c}" title="${c}"></button>`).join('');
$('palette').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(b)setColor(b.dataset.color)});
setColor('#7057f5');

// JSON formatter
function validateJson(){try{const value=JSON.parse($('jsonInput').value);$('jsonStatus').textContent='✓ Valid JSON';$('jsonStatus').className='result success';return value}catch(e){$('jsonStatus').textContent='✕ Invalid JSON: '+e.message;$('jsonStatus').className='result error';return null}}
$('formatJson').addEventListener('click',()=>{try{$('jsonInput').value=JSON.stringify(JSON.parse($('jsonInput').value),null,2);$('jsonStatus').textContent='✓ JSON formatted successfully';$('jsonStatus').className='result success'}catch(e){$('jsonStatus').textContent='✕ '+e.message;$('jsonStatus').className='result error'}});
$('minifyJson').addEventListener('click',()=>{try{$('jsonInput').value=JSON.stringify(JSON.parse($('jsonInput').value));$('jsonStatus').textContent='✓ JSON minified';$('jsonStatus').className='result success'}catch(e){$('jsonStatus').textContent='✕ '+e.message;$('jsonStatus').className='result error'}});
$('clearJson').addEventListener('click',()=>{$('jsonInput').value='';$('jsonStatus').textContent='Cleared';$('jsonStatus').className='result neutral'});
$('copyJson').addEventListener('click',()=>copyText($('jsonInput').value));
$('jsonInput').addEventListener('input',()=>validateJson());

// URL encoder
$('encodeUrl').addEventListener('click',()=>{try{$('urlOutput').value=encodeURIComponent($('urlInput').value);$('urlStatus').textContent='✓ Text encoded';$('urlStatus').className='result success'}catch(e){$('urlStatus').textContent='✕ Could not encode text';$('urlStatus').className='result error'}});
$('decodeUrl').addEventListener('click',()=>{try{$('urlOutput').value=decodeURIComponent($('urlInput').value);$('urlStatus').textContent='✓ Text decoded';$('urlStatus').className='result success'}catch(e){$('urlStatus').textContent='✕ Invalid encoded text';$('urlStatus').className='result error'}});
$('clearUrl').addEventListener('click',()=>{$('urlInput').value='';$('urlOutput').value='';$('urlStatus').textContent='Ready';$('urlStatus').className='result neutral'});
$('copyUrl').addEventListener('click',()=>copyText($('urlOutput').value));

// Notes (stored only in this browser)
let notes=JSON.parse(localStorage.getItem('devspace-notes')||'[]');
function renderNotes(){
  $('noteCount').textContent=notes.length;$('notesSubtitle').textContent=notes.length?`${notes.length} saved note${notes.length===1?'':'s'}`:'No notes yet';
  $('notesList').innerHTML=notes.length?notes.map(n=>`<article class="note-item"><div class="note-item-head"><b>${escapeHtml(n.title)}</b><button class="delete-note" data-delete="${n.id}" aria-label="Delete note">✕</button></div><p>${escapeHtml(n.body)}</p><small>${new Date(n.date).toLocaleString()}</small></article>`).join(''):'<div class="empty-state">✎<b>Your space is empty</b><span>Save your first note to see it here.</span></div>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('saveNote').addEventListener('click',()=>{const title=$('noteTitle').value.trim(),body=$('noteBody').value.trim();if(!title||!body){toast('Add a title and some note text first.');return}notes.unshift({id:Date.now(),title,body,date:Date.now()});localStorage.setItem('devspace-notes',JSON.stringify(notes));$('noteTitle').value='';$('noteBody').value='';renderNotes();toast('Note saved locally!')});
$('notesList').addEventListener('click',e=>{const b=e.target.closest('[data-delete]');if(!b)return;notes=notes.filter(n=>n.id!==Number(b.dataset.delete));localStorage.setItem('devspace-notes',JSON.stringify(notes));renderNotes();toast('Note deleted.')});
$('clearNotes').addEventListener('click',()=>{if(!notes.length)return;if(confirm('Delete all saved notes from this browser?')){notes=[];localStorage.removeItem('devspace-notes');renderNotes();toast('All notes deleted.')}});
renderNotes();

// Pomodoro timer
let totalSeconds=25*60,remaining=totalSeconds,interval=null,sessions=0;
function showTimer(){const m=Math.floor(remaining/60),s=remaining%60;$('timerDisplay').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');const progress=(totalSeconds-remaining)/totalSeconds;$('timerRing').style.background=`conic-gradient(#8b75ff ${progress*360}deg,#302b51 ${progress*360}deg)`;document.title=$('timerDisplay').textContent+' — DevSpace'}
function stopTimer(){if(interval){clearInterval(interval);interval=null}}
document.querySelectorAll('.mode-btn').forEach(b=>b.addEventListener('click',()=>{stopTimer();document.querySelectorAll('.mode-btn').forEach(x=>x.classList.toggle('active',x===b));totalSeconds=Number(b.dataset.minutes)*60;remaining=totalSeconds;$('timerMode').textContent=b.dataset.mode+' time';$('timerStart').textContent='▶ Start';showTimer()}));
$('timerStart').addEventListener('click',()=>{if(interval){stopTimer();$('timerStart').textContent='▶ Resume';return}$('timerStart').textContent='Ⅱ Pause';interval=setInterval(()=>{remaining--;showTimer();if(remaining<=0){stopTimer();$('timerStart').textContent='▶ Start';if($('timerMode').textContent.startsWith('Focus')){$('sessions').textContent=++sessions}toast('Time is up! Take a moment before the next session.');if('Notification'in window&&Notification.permission==='granted')new Notification('DevSpace timer',{body:'Your timer has finished.'})}},1000)});
$('timerReset').addEventListener('click',()=>{stopTimer();remaining=totalSeconds;$('timerStart').textContent='▶ Start';showTimer()});
showTimer();
