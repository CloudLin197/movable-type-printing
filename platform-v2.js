(function(){
'use strict';
const P={version:'2.35',teacherCode:'123456',badgeFiles:['assets/badges/badge-process.png','assets/badges/badge-speech.png','assets/badges/badge-heritage.png']};
const DATA_KEYS=['students','pretestRecords','progressRecords','studentActivity','speechWorks','heritageWorks','pretestQuizLeaderboardV2'];
const SNAPSHOT_SCHEMA='mtp-share-snapshot-v2';
const safeParse=(s,d=null)=>{try{return JSON.parse(s)}catch(e){return d}};
const b64e=o=>{const s=encodeURIComponent(JSON.stringify(o)).replace(/%([0-9A-F]{2})/g,(_,p)=>String.fromCharCode('0x'+p));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64d=s=>{try{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s);let pct='';for(let i=0;i<raw.length;i++)pct+='%'+raw.charCodeAt(i).toString(16).padStart(2,'0');return JSON.parse(decodeURIComponent(pct))}catch(e){return null}};
const bytesToB64=bytes=>{let out='';const step=0x8000;for(let i=0;i<bytes.length;i+=step)out+=String.fromCharCode(...bytes.subarray(i,i+step));return btoa(out).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64ToBytes=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out};
function currentStudent(){return safeParse(localStorage.getItem('currentStudent'),null)}
function studentKey(st=currentStudent()){return st?`${st.cls||st.className||''}-${st.seat||''}-${st.name||''}`:''}
function recordStudentKey(item){
 if(!item||typeof item!=='object')return '';
 if(item.studentKey)return String(item.studentKey);
 if(item.student&&typeof item.student==='object')return item.student.key||studentKey(item.student);
 if(item.key&&('cls'in item||'className'in item||'class'in item||'seat'in item||'name'in item))return String(item.key);
 const cls=item.cls||item.className||item.class||item.studentClass||'';
 const seat=item.seat||item.studentSeat||'';
 const name=item.studentName||((item.name&&!item.text)?item.name:'')||'';
 return cls&&name?`${cls}-${seat}-${name}`:'';
}
function recordSignature(key,item){
 if(!item||typeof item!=='object')return JSON.stringify(item);
 if(key==='students')return item.key||recordStudentKey(item);
 if(key==='pretestQuizLeaderboardV2')return item.key||recordStudentKey(item)||`${item.cls||''}-${item.name||''}`;
 return item.id||[recordStudentKey(item),item.time||'',item.ts||'',item.page||'',item.score??'',item.title||'',item.text||'',item.content||''].join('|');
}
function mergeSnapshotArray(key,incoming){
 const current=safeParse(localStorage.getItem(key),'[]')||[];
 if(key==='pretestQuizLeaderboardV2'){
  const map=new Map();
  current.concat(incoming||[]).forEach(x=>{if(!x||typeof x!=='object')return;const sig=recordSignature(key,x),old=map.get(sig);if(!old||Number(x.score||0)>Number(old.score||0)||(Number(x.score||0)===Number(old.score||0)&&Number(x.duration||Infinity)<Number(old.duration||Infinity)))map.set(sig,x)});
  localStorage.setItem(key,JSON.stringify([...map.values()]));return;
 }
 const map=new Map();
 current.concat(incoming||[]).forEach(x=>{if(x&&typeof x==='object')map.set(recordSignature(key,x),x)});
 localStorage.setItem(key,JSON.stringify([...map.values()]));
}
function readDataKey(key){const v=safeParse(localStorage.getItem(key),'[]');return Array.isArray(v)?v:[]}
function getStudentExtras(key){
 const extras={};
 [`badge1:${key}`,`badge2:${key}`,`badge3:${key}`,`thinkingStar:${key}`].forEach(k=>{const v=localStorage.getItem(k);if(v!==null)extras[k]=v});
 return extras;
}
function collectTeacherSnapshot(){
 const data={};DATA_KEYS.forEach(k=>data[k]=readDataKey(k));
 const extras={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^badge[123]:/.test(k)||/^thinkingStar:/.test(k))extras[k]=localStorage.getItem(k)}
 return{schema:SNAPSHOT_SCHEMA,kind:'teacher',version:P.version,generatedAt:new Date().toISOString(),source:location.origin+location.pathname,data,extras};
}
function collectStudentSnapshot(st,{includeImages=true}={}){
 const key=studentKey(st),data={};
 DATA_KEYS.forEach(k=>{
  const list=readDataKey(k);
  if(k==='students')data[k]=list.filter(x=>(x.key||recordStudentKey(x))===key);
  else data[k]=list.filter(x=>recordStudentKey(x)===key).map(x=>{
   if(includeImages||k!=='heritageWorks')return x;
   const y={...x};if(y.image)y.image='';return y;
  });
 });
 return{schema:SNAPSHOT_SCHEMA,kind:'student',studentKey:key,student:st,version:P.version,generatedAt:new Date().toISOString(),source:location.origin+location.pathname,data,extras:getStudentExtras(key),imagesOmitted:!includeImages};
}
async function encodeSnapshot(snapshot){
 const text=JSON.stringify(snapshot);
 if('CompressionStream'in window){const stream=new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));const buf=await new Response(stream).arrayBuffer();return'g.'+bytesToB64(new Uint8Array(buf))}
 return'j.'+b64e(snapshot);
}
async function decodeSnapshot(token){
 if(token.startsWith('g.')){if(!('DecompressionStream'in window))throw new Error('当前浏览器不支持解压数据快照');const bytes=b64ToBytes(token.slice(2));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(stream).text())}
 if(token.startsWith('j.'))return b64d(token.slice(2));return b64d(token);
}
function importSharedSnapshot(snapshot){
 // 兼容 V2.33 的教师快照。
 if(snapshot&&snapshot.schema==='mtp-teacher-snapshot-v1')snapshot={...snapshot,schema:SNAPSHOT_SCHEMA,kind:'teacher'};
 if(!snapshot||snapshot.schema!==SNAPSHOT_SCHEMA||!snapshot.data)throw new Error('数据快照格式不正确');
 Object.entries(snapshot.data).forEach(([k,v])=>{if(DATA_KEYS.includes(k)&&Array.isArray(v))mergeSnapshotArray(k,v)});
 Object.entries(snapshot.extras||{}).forEach(([k,v])=>{if(/^badge[123]:/.test(k)||/^thinkingStar:/.test(k))localStorage.setItem(k,String(v))});
 if(snapshot.kind==='student'&&snapshot.student){
  const st=upsertStudent({...snapshot.student});
  ['currentStudent','studentInfo','activeStudent','loginStudent'].forEach(k=>localStorage.setItem(k,JSON.stringify(st)));
 }
 return snapshot;
}
async function applyUrlSharedSnapshot(){
 const raw=location.hash.startsWith('#')?location.hash.slice(1):location.hash;if(!raw)return;
 const hp=new URLSearchParams(raw),tok=hp.get('snapshot');if(!tok)return;
 try{
  const snapshot=importSharedSnapshot(await decodeSnapshot(tok));
  hp.delete('snapshot');const cleanHash=hp.toString();history.replaceState({},'',location.pathname+location.search+(cleanHash?'#'+cleanHash:''));
  sessionStorage.setItem('mtpSharedSnapshotNotice',JSON.stringify({kind:snapshot.kind||'teacher',generatedAt:snapshot.generatedAt||'',version:snapshot.version||'',imagesOmitted:!!snapshot.imagesOmitted}));
  location.reload();
 }catch(e){console.error(e);alert('分享数据读取失败：'+(e.message||'链接可能不完整，请重新复制分享链接。'))}
}
function getSession(){return safeParse(localStorage.getItem('platformSession'),null)}
function setSession(s){
 localStorage.setItem('platformSession',JSON.stringify(s));
 if(s&&s.role==='student'&&s.student){
  localStorage.removeItem('teacherMode');localStorage.removeItem('teacherLoggedIn');
  const st=upsertStudent({...s.student});s.student=st;localStorage.setItem('platformSession',JSON.stringify(s));
  ['currentStudent','studentInfo','activeStudent','loginStudent'].forEach(k=>localStorage.setItem(k,JSON.stringify(st)));
 }
 if(s&&s.role==='teacher'){
  localStorage.setItem('teacherMode','true');localStorage.setItem('teacherLoggedIn','true');
  // 只清除“当前正在操作的学生身份”，不删除任何学生名单、成绩和作品。
  ['currentStudent','studentInfo','activeStudent','loginStudent'].forEach(k=>localStorage.removeItem(k));
 }
}
function clearSession(){
 localStorage.removeItem('platformSession');localStorage.removeItem('teacherMode');localStorage.removeItem('teacherLoggedIn');
 ['currentStudent','studentInfo','activeStudent','loginStudent'].forEach(k=>localStorage.removeItem(k));
}
function genPass(st){const key=`${st.cls}|${st.seat}|${st.name}`;let h=2166136261;for(const ch of key){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}const year=new Date().getFullYear();return `FX-${year}-${String(Math.abs(h)%1000000).padStart(6,'0')}`}
function extractGrade(cls=''){const m=String(cls).match(/(七|八|九|初一|初二|初三|高一|高二|高三|\d+)年?级?/);return m?m[0]:'未分年级'}
function upsertStudent(st){
 if(!st)return null;const list=readDataKey('students');st.key=st.key||studentKey(st);st.passNumber=st.passNumber||genPass(st);st.grade=st.grade||extractGrade(st.cls);st.lastLogin=st.lastLogin||new Date().toLocaleString();
 const i=list.findIndex(x=>(x.key||recordStudentKey(x))===st.key);if(i>=0)list[i]={...list[i],...st};else list.push(st);localStorage.setItem('students',JSON.stringify(list));return st;
}
function applyUrlSession(){const q=new URLSearchParams(location.search),tok=q.get('session');if(!tok)return;const s=b64d(tok);if(!s||!s.role)return;setSession(s);q.delete('session');history.replaceState({},'',location.pathname+(q.toString()?('?'+q):'')+location.hash)}
applyUrlSession();
applyUrlSharedSnapshot();
if(!getSession()&&localStorage.getItem('teacherLoggedIn')==='true')setSession({role:'teacher',loginAt:new Date().toISOString(),migratedFrom:'teacherLoggedIn'});
window.MTP2={
 getSession,setSession,clearSession,currentStudent,studentKey,genPass,upsertStudent,recordStudentKey,
 isTeacher:()=>getSession()?.role==='teacher'||localStorage.getItem('teacherMode')==='true'||localStorage.getItem('teacherLoggedIn')==='true',
 async shareLink(){
  const s=getSession();if(!s)return alert('请先登录后再生成分享链接。');
  const url=new URL(location.href);url.searchParams.set('session',b64e(s));
  let snapshot,message;
  if(s.role==='teacher'){
   snapshot=collectTeacherSnapshot();
   const counts={students:(snapshot.data.students||[]).length,speech:(snapshot.data.speechWorks||[]).length,heritage:(snapshot.data.heritageWorks||[]).length};
   message=`已复制教师登录与全部本机数据链接。\n链接包含 ${counts.students} 名学生记录、${counts.speech} 份解说词、${counts.heritage} 份非遗作品及测评、进度等数据。\n其他人打开后会进入教师状态，并看到生成链接这一刻的全部数据副本。`;
  }else{
   const st=s.student||currentStudent();if(!st)return alert('没有找到当前学生信息，请重新登录。');
   snapshot=collectStudentSnapshot(st,{includeImages:true});
   message=`已复制 ${st.cls||''} ${st.name||''} 的学生登录与作品链接。\n其他人打开后可以看到该账号已提交的解说词、非遗作品及学习记录。`;
  }
  let token=await encodeSnapshot(snapshot),hp=new URLSearchParams();hp.set('snapshot',token);url.hash=hp.toString();
  if(url.href.length>750000&&s.role==='student'){
   snapshot=collectStudentSnapshot(s.student||currentStudent(),{includeImages:false});token=await encodeSnapshot(snapshot);hp=new URLSearchParams();hp.set('snapshot',token);url.hash=hp.toString();message+='\n由于作品图片较大，分享链接中已保留文字内容并省略非遗作品图片。';
  }
  if(url.href.length>1200000){alert('当前数据过多，分享链接可能被聊天软件截断。请先删除过大的作品图片，或使用教师数据中心的“导出全部数据 JSON”。');return}
  try{await navigator.clipboard.writeText(url.href);alert(message)}catch(e){prompt('复制下面的分享链接：',url.href)}
 },
 logout(){clearSession();location.href='index.html'},
 badgeKey(n){const k=studentKey();return k?`badge${n}:${k}`:`badge${n}`},
 getBadge(n){return localStorage.getItem(this.badgeKey(n))==='unlocked'||localStorage.getItem(`badge${n}`)==='unlocked'},
 unlockBadge(n){localStorage.setItem(this.badgeKey(n),'unlocked');localStorage.setItem(`badge${n}`,'unlocked');this.syncStudentSnapshot()},
 thinkingStarKey(){const k=studentKey();return k?`thinkingStar:${k}`:''},
 getThinkingStar(){const k=this.thinkingStarKey();return !!k&&localStorage.getItem(k)==='unlocked'},
 unlockThinkingStar(){const k=this.thinkingStarKey();if(!k)return false;localStorage.setItem(k,'unlocked');this.syncStudentSnapshot();document.dispatchEvent(new CustomEvent('mengxiThinkingStarUnlocked'));return true},
 syncStudentSnapshot(){const st=currentStudent();if(!st)return;const list=readDataKey('students'),key=studentKey(st),i=list.findIndex(x=>(x.key||recordStudentKey(x))===key);const snap={...st,key,badges:[1,2,3].map(n=>this.getBadge(n)),thinkingStar:this.getThinkingStar(),lastSeen:new Date().toLocaleString()};if(i>=0)list[i]={...list[i],...snap};else list.push(snap);localStorage.setItem('students',JSON.stringify(list))}
};
function restoreStudentBadges(){const st=currentStudent();if(!st)return;const key=studentKey(st),rec=readDataKey('students').find(x=>(x.key||recordStudentKey(x))===key);if(rec&&Array.isArray(rec.badges))rec.badges.forEach((v,i)=>{if(v){localStorage.setItem(`badge${i+1}:${key}`,'unlocked');localStorage.setItem(`badge${i+1}`,'unlocked')}else localStorage.removeItem(`badge${i+1}`)});if(rec&&rec.thinkingStar)localStorage.setItem(`thinkingStar:${key}`,'unlocked')}
restoreStudentBadges();
function patchFunctions(){
 if(typeof window.saveStudentEverywhere==='function'){const old=window.saveStudentEverywhere;window.saveStudentEverywhere=function(st){st=upsertStudent(st);old(st);setSession({role:'student',student:st,loginAt:new Date().toISOString()});restoreStudentBadges();return st}}
 if(typeof window.setStudent==='function'){const old=window.setStudent;window.setStudent=function(st){st=upsertStudent(st);old(st);setSession({role:'student',student:st,loginAt:new Date().toISOString()});restoreStudentBadges();return st}}
 if(typeof window.saveProgress==='function'){const old=window.saveProgress;window.saveProgress=function(page,detail={}){old(page,detail);const st=currentStudent();if(st){const logs=readDataKey('studentActivity');logs.push({id:Date.now()+Math.random(),studentKey:studentKey(st),student:{...st},passNumber:st.passNumber,page,detail,time:new Date().toLocaleString(),ts:Date.now()});localStorage.setItem('studentActivity',JSON.stringify(logs));MTP2.syncStudentSnapshot()}return true}}
 if(typeof window.logout==='function')window.logout=function(){MTP2.logout()};
}
function moveNavIntoHero(){const hero=document.querySelector('.hero'),nav=document.querySelector('.site-nav-shell');if(hero&&nav&&nav.parentElement!==hero)hero.appendChild(nav)}
function addUserBar(){if(location.pathname.endsWith('index.html')||location.pathname.endsWith('/')||document.querySelector('.v2-userbar'))return;const s=getSession();const bar=document.createElement('div');bar.className='v2-userbar';let left='尚未登录';if(s?.role==='teacher')left='<span class="v2-teacher-flag">教师模式：全部展馆已解锁</span>';else if(s?.role==='student'&&s.student)left=`已登录：<b>${escapeHtml(s.student.cls)} ${escapeHtml(s.student.seat)}号 ${escapeHtml(s.student.name)}</b>　探展编号：<b>${escapeHtml(s.student.passNumber||'')}</b>${MTP2.getThinkingStar()?'<span class="v2-thinking-star" title="思辨之星">★ 思辨之星</span>':''}`;bar.innerHTML=`<div>${left}</div><div class="v2-userbar-actions"><button class="v2-mini-btn" onclick="MTP2.shareLink()">${s?.role==='teacher'?'分享教师数据链接':'分享本账号与作品'}</button>${s?'<button class="v2-mini-btn" onclick="MTP2.logout()">退出登录</button>':''}</div>`;const hero=document.querySelector('.hero');hero?.insertAdjacentElement('afterend',bar)}
function unlockTeacherView(){if(!MTP2.isTeacher())return;document.documentElement.classList.add('teacher-mode');document.querySelectorAll('.locked').forEach(el=>{el.classList.remove('locked');el.classList.add('unlocked')});document.querySelectorAll('.lock-cover').forEach(el=>el.style.display='none');document.querySelectorAll('button:disabled').forEach(b=>b.disabled=false);try{if(typeof window.unlockInquiryForTeacher==='function')window.unlockInquiryForTeacher();else{if(typeof window.unlockGallery==='function')window.unlockGallery();if(typeof window.unlockActiveInquiry==='function')window.unlockActiveInquiry()}}catch(e){}
}
function replaceBadgeEmoji(){document.querySelectorAll('.pass-badge-icon').forEach((el,i)=>{const n=(i%3)+1;if(!el.querySelector('img'))el.innerHTML=`<img src="${P.badgeFiles[n-1]}" alt="徽章${n}">`;if(MTP2.isTeacher()||MTP2.getBadge(n))el.classList.add('unlocked')});const old=document.querySelectorAll('#badge1Icon,#badge2Icon,#badge3Icon');old.forEach((el,i)=>{el.innerHTML=`<img src="${P.badgeFiles[i]}" alt="徽章${i+1}" style="width:100%;height:100%;object-fit:contain">`;if(MTP2.getBadge(i+1)||MTP2.isTeacher())el.classList.add('unlocked')})}
function addIndexSessionUI(){if(!location.pathname.endsWith('index.html')&&!location.pathname.endsWith('/'))return;const s=getSession();if(s?.role==='teacher'){const msg=document.getElementById('loginMsg');if(msg){msg.textContent='教师模式已登录：所有展馆均已解锁。';msg.style.color='#d9f2c4'}const target=document.querySelector('.teacher-link');if(target){const b=document.createElement('button');b.className='logout-btn';b.textContent='退出教师登录';b.onclick=()=>MTP2.logout();target.insertAdjacentElement('afterend',b)}}}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function patchTeacherLogin(){if(!location.pathname.endsWith('teacher.html'))return;const session=getSession();if(typeof window.checkCode==='function'){window.checkCode=function(){const input=document.getElementById('teacherCode');if(input&&input.value===P.teacherCode){setSession({role:'teacher',loginAt:new Date().toISOString()});document.getElementById('loginPanel').style.display='none';document.getElementById('dash').style.display='block';window.renderDashboard?.();addTeacherActions()}else{const m=document.getElementById('codeMsg');if(m){m.textContent='❌ 教师码错误';m.className='feedback error'}}}}
 if(session?.role==='teacher'){const lp=document.getElementById('loginPanel'),d=document.getElementById('dash');if(lp&&d){lp.style.display='none';d.style.display='block';window.renderDashboard?.();addTeacherActions()}}
}
function addTeacherActions(){const dash=document.getElementById('dash');if(!dash||dash.querySelector('.v2-teacher-actions'))return;const box=document.createElement('section');box.className='panel v2-teacher-actions';box.innerHTML='<div class="panel-title">🔐 教师模式与数据分享</div><p class="v2-cloud-note">学生在本机提交的测评、解说词和非遗作品会保存在当前浏览器。教师登录后可查看本机全部学生数据；复制教师数据链接后，其他设备打开即可载入生成链接时的完整数据副本。</p><button class="btn" onclick="MTP2.shareLink()">复制教师登录与全部数据链接</button><button class="btn" onclick="MTP2.logout()">退出教师登录</button><button class="btn" onclick="MTP2ImportData()">导入数据JSON</button>';dash.insertBefore(box,dash.children[1]||null)}
window.MTP2ImportData=function(){const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=()=>{const f=input.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);Object.entries(d).forEach(([k,v])=>localStorage.setItem(k,JSON.stringify(v)));alert('导入成功，页面将刷新。');location.reload()}catch(e){alert('导入失败：JSON格式错误')}};r.readAsText(f)};input.click()}
function enrichTeacherDashboard(){if(!location.pathname.endsWith('teacher.html'))return;const old=window.renderDashboard;if(typeof old!=='function'||old.__v2)return;window.renderDashboard=function(){old();const students=safeParse(localStorage.getItem('students'),'[]')||[];const activity=safeParse(localStorage.getItem('studentActivity'),'[]')||[];const holder=document.getElementById('studentTable');if(holder){holder.innerHTML='<tr><th>年段</th><th>班级</th><th>座号</th><th>姓名</th><th>探展编号</th><th>最近登录</th><th>徽章</th><th>思辨之星</th><th>活动记录</th></tr>'+students.map(s=>{const count=activity.filter(a=>a.studentKey===s.key).length;const badges=(s.badges||[]).filter(Boolean).length;return `<tr><td>${escapeHtml(s.grade||extractGrade(s.cls))}</td><td>${escapeHtml(s.cls)}</td><td>${escapeHtml(s.seat)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.passNumber||'')}</td><td>${escapeHtml(s.lastLogin||s.time||'')}</td><td>${badges}/3</td><td>${s.thinkingStar?'已点亮':'—'}</td><td>${count}</td></tr>`}).join('')||'<tr><td colspan="9">暂无学生记录</td></tr>'}
 const panels=document.querySelectorAll('#dash .panel');if(!document.getElementById('gradeSummary')){const p=document.createElement('section');p.className='panel';p.id='gradeSummary';p.innerHTML='<div class="panel-title">🏫 年段与班级情况</div><div id="gradeSummaryBody"></div>';const studentPanel=[...panels].find(x=>x.textContent.includes('学生学习记录'));studentPanel?.insertAdjacentElement('beforebegin',p)}const body=document.getElementById('gradeSummaryBody');if(body){const groups={};students.forEach(s=>{const g=s.grade||extractGrade(s.cls),c=s.cls||'未分班';groups[g]??={};groups[g][c]=(groups[g][c]||0)+1});body.innerHTML=Object.keys(groups).length?Object.entries(groups).map(([g,cs])=>`<div class="card" style="margin-bottom:12px"><b>${escapeHtml(g)}</b>：${Object.entries(cs).map(([c,n])=>`${escapeHtml(c)}（${n}人）`).join('　')}</div>`).join(''):'<div class="empty">暂无年段与班级数据</div>'}
};window.renderDashboard.__v2=true}
function sortEnhance(){if(!location.pathname.endsWith('inquiry.html'))return;const grid=document.getElementById('stepGrid');if(!grid)return;let drag=null;const prepare=()=>{[...grid.children].forEach(card=>{card.draggable=true;card.ondragstart=e=>{drag=card;card.classList.add('v2-dragging');e.dataTransfer.effectAllowed='move'};card.ondragend=()=>{card.classList.remove('v2-dragging');drag=null};card.ondragover=e=>e.preventDefault();card.ondrop=e=>{e.preventDefault();if(!drag||drag===card)return;const arr=[...grid.children],a=arr.indexOf(drag),b=arr.indexOf(card);if(a<b)grid.insertBefore(drag,card.nextSibling);else grid.insertBefore(drag,card);syncOrder()}})};const syncOrder=()=>{try{if(Array.isArray(window.currentOrder))window.currentOrder=[...grid.children].map(c=>c.dataset.id||c.getAttribute('data-id')||c.textContent.trim()).map(v=>isNaN(v)?v:Number(v))}catch(e){}};new MutationObserver(prepare).observe(grid,{childList:true});prepare();const hint=grid.parentElement?.querySelector('.muted');if(hint)hint.textContent='点击一张卡片，再点击另一张可交换位置；也可以直接拖动卡片完成排序。'}

function refreshThinkingStarUI(){
 const old=document.querySelector('.v2-userbar');if(old){old.remove();addUserBar()}
 try{if(typeof window.renderStudentPass==='function')window.renderStudentPass()}catch(e){}
 document.querySelectorAll('.thinking-star-mark').forEach(el=>el.classList.add('unlocked'));
}
document.addEventListener('mengxiThinkingStarUnlocked',()=>setTimeout(refreshThinkingStarUI,0));

function mediaCheck(){document.querySelectorAll('video source').forEach(s=>{if(!s.src&&s.dataset.src)s.src=s.dataset.src});}
document.addEventListener('DOMContentLoaded',()=>{patchFunctions();moveNavIntoHero();addUserBar();addIndexSessionUI();patchTeacherLogin();enrichTeacherDashboard();unlockTeacherView();replaceBadgeEmoji();sortEnhance();mediaCheck();const notice=sessionStorage.getItem('mtpSharedSnapshotNotice');if(notice){sessionStorage.removeItem('mtpSharedSnapshotNotice');setTimeout(()=>{const n=safeParse(notice,{})||{};alert((n.kind==='student'?'已载入学生账号与作品数据':'已载入教师登录与全部数据')+(n.generatedAt?'（生成时间：'+new Date(n.generatedAt).toLocaleString()+'）':'')+'。\n当前显示的是生成链接时的数据副本，之后新增的提交需要重新生成分享链接。'+(n.imagesOmitted?'\n因图片过大，非遗作品图片未写入链接。':''))},250)}setTimeout(()=>{unlockTeacherView();replaceBadgeEmoji()},350)});
})();
