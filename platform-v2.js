(function(){
'use strict';
const P={version:'2.41',teacherCode:'123456',badgeFiles:['assets/badges/badge-process.png','assets/badges/badge-speech.png','assets/badges/badge-heritage.png']};
const BADGE_META={
  1:{name:'工艺探究徽章',desc:'完成工序排序与六项工序探微'},
  2:{name:'云端解说徽章',desc:'完成并提交活字印刷解说词'},
  3:{name:'非遗传承徽章',desc:'完成一项课后分层传承任务'}
};
const DATA_KEYS=['students','pretestRecords','progressRecords','studentActivity','speechWorks','heritageWorks','pretestQuizLeaderboardV2'];
const SNAPSHOT_SCHEMA='mtp-share-snapshot-v2';
const safeParse=(s,d=null)=>{try{return JSON.parse(s)}catch(e){return d}};
// 保留 b64d 和 b64ToBytes 用于解码旧链接（兼容），删除 b64e 和 bytesToB64
const b64d=s=>{try{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s);let pct='';for(let i=0;i<raw.length;i++)pct+='%'+raw.charCodeAt(i).toString(16).padStart(2,'0');return JSON.parse(decodeURIComponent(pct))}catch(e){return null}};
const b64ToBytes=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out};
// 保留 decodeSnapshot 用于旧链接解码
async function decodeSnapshot(token){
 if(token.startsWith('g.')){if(!('DecompressionStream'in window))throw new Error('当前浏览器不支持解压数据快照');const bytes=b64ToBytes(token.slice(2));const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(stream).text())}
 if(token.startsWith('j.'))return b64d(token.slice(2));return b64d(token);
}
function currentStudent(){return safeParse(localStorage.getItem('currentStudent'),null)}
function studentKey(st=currentStudent()){return st?`${st.cls||st.className||''}-${st.seat||''}-${st.name||''}`:''}
function recordStudentKey(item){
 if(!item||typeof item!=='object')return '';
 if(item.studentKey)return String(item.studentKey);
 if(item.student&&typeof item.student==='object')return item.student.key||studentKey(item.student);
 if(item.key&&('cls'in item||'className'in item||'class'in item||'seat'in item||'name'in item))return String(item.key);
 const cls=item.cls||item.className||item.class||item.studentClass||'';
 const seat=item.seat||item.studentSeat||'';
 const name=item.studentName||item.authorName||item.ownerName||((item.name&&!item.text&&!item.content&&!item.title)?item.name:'')||((item.author&&!item.content)?item.author:'')||'';
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
function collectTeacherSnapshot({includeImages=true}={}){
 const data={};DATA_KEYS.forEach(k=>data[k]=readDataKey(k));
 if(!includeImages&&Array.isArray(data.heritageWorks))data.heritageWorks=data.heritageWorks.map(x=>({...x,image:''}));
 const extras={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^badge[123]:/.test(k)||/^thinkingStar:/.test(k))extras[k]=localStorage.getItem(k)}
 return{schema:SNAPSHOT_SCHEMA,kind:'teacher',version:P.version,generatedAt:new Date().toISOString(),source:location.origin+location.pathname,data,extras,imagesOmitted:!includeImages};
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
// ========== 新版的 applyUrlSharedSnapshot：支持短链接 ?shareId= 并兼容旧 hash ==========
async function applyUrlSharedSnapshot(){
    // 新方案：从 ?shareId= 读取
    const params = new URLSearchParams(location.search);
    const shareId = params.get('shareId');

    if (shareId) {
        try {
            const response = await fetch('/api/share-snapshot?id=' + encodeURIComponent(shareId));
            const result = await response.json();

            if (response.ok && result.data) {
                const snapshot = {
                    schema: result.schema || SNAPSHOT_SCHEMA,
                    kind: result.kind || 'teacher',
                    data: result.data,
                    extras: result.extras || {},
                    version: result.version || P.version,
                    generatedAt: result.generatedAt || new Date().toISOString(),
                    source: result.source || location.origin + location.pathname
                };

                importSharedSnapshot(snapshot);
                history.replaceState({}, document.title, location.pathname + location.hash);
                alert('✅ 已成功载入分享的数据！页面将刷新。');
                location.reload();
                return;
            } else {
                alert('❌ 链接无效或已过期：' + (result.error || ''));
            }
        } catch (error) {
            console.error('加载分享数据失败:', error);
            alert('❌ 无法加载分享数据，请检查网络');
        }
        history.replaceState({}, document.title, location.pathname + location.hash);
        return;
    }

    // 旧方案降级：从 URL Hash 读取（兼容旧链接）
    const raw = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash;
    if (!raw) return;

    const hp = new URLSearchParams(raw);
    const tok = hp.get('snapshot');
    if (!tok) return;

    try {
        const snapshot = importSharedSnapshot(await decodeSnapshot(tok));
        hp.delete('snapshot');
        const cleanHash = hp.toString();
        history.replaceState({}, '', location.pathname + location.search + (cleanHash ? '#' + cleanHash : ''));
        sessionStorage.removeItem('mtpSharedSnapshotNotice');
        alert('✅ 已从旧链接载入数据，页面将刷新。');
        location.reload();
    } catch (e) {
        console.error(e);
        alert('分享数据读取失败：' + (e.message || '链接可能不完整，请重新复制分享链接。'));
    }
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
 // ========== 新版的 shareLink：调用后端 API 生成短链接 ==========
 async shareLink() {
     const s = getSession();
     if (!s) return alert('请先登录后再生成分享链接。');

     let snapshot, displayInfo;
     if (s.role === 'teacher') {
         snapshot = collectTeacherSnapshot({ includeImages: true });
         const counts = {
             students: (snapshot.data.students || []).length,
             speech: (snapshot.data.speechWorks || []).length,
             heritage: (snapshot.data.heritageWorks || []).length
         };
         displayInfo = `教师数据：${counts.students} 名学生、${counts.speech} 份解说词、${counts.heritage} 份非遗作品`;
     } else {
         const st = s.student || currentStudent();
         if (!st) return alert('没有找到当前学生信息，请重新登录。');
         snapshot = collectStudentSnapshot(st, { includeImages: true });
         displayInfo = `${st.cls || ''} ${st.name || ''} 的学习数据`;
     }

     const payload = {
         schema: SNAPSHOT_SCHEMA,
         kind: s.role === 'teacher' ? 'teacher' : 'student',
         data: snapshot.data,
         extras: snapshot.extras || {},
         version: P.version,
         generatedAt: new Date().toISOString(),
         source: location.origin + location.pathname
     };

     // 如果数据太大，先省略图片再试
     let currentPayload = payload;
     let imagesOmitted = false;
     let estimatedSize = JSON.stringify(currentPayload).length;

     if (estimatedSize > 4_500_000) {
         if (currentPayload.data.heritageWorks) {
             currentPayload = {
                 ...currentPayload,
                 data: {
                     ...currentPayload.data,
                     heritageWorks: currentPayload.data.heritageWorks.map(w => {
                         const copy = { ...w };
                         if (copy.image) copy.image = '';
                         return copy;
                     })
                 },
                 imagesOmitted: true
             };
             imagesOmitted = true;
             estimatedSize = JSON.stringify(currentPayload).length;
         }
     }

     if (estimatedSize > 5_000_000) {
         alert('数据过大（超过 5MB），无法分享。请先删除过大的作品图片。');
         return;
     }

     try {
         const response = await fetch('/api/share-snapshot', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(currentPayload)
         });

         const result = await response.json();

         if (response.ok && result.id) {
             const shortUrl = window.location.origin + '?shareId=' + result.id;
             await navigator.clipboard.writeText(shortUrl);

             let message = `✅ 短链接已复制！\n\n📋 包含：${displayInfo}`;
             if (imagesOmitted) {
                 message += '\n⚠️ 作品图片已省略（保留文字、成绩和学习记录）';
             }
             message += `\n\n🔗 链接长度：${shortUrl.length} 字符`;
             alert(message);
         } else {
             alert('❌ 分享失败：' + (result.error || '未知错误，请重试'));
         }
     } catch (error) {
         console.error('分享请求失败:', error);
         alert('❌ 网络连接失败，请检查网络后重试');
     }
 },
 logout(){clearSession();location.href='index.html'},
 badgeKey(n){const k=studentKey();return k?`badge${n}:${k}`:''},
 getBadge(n){const k=this.badgeKey(n);return !!k&&localStorage.getItem(k)==='unlocked'},
 unlockBadge(n){const k=this.badgeKey(n);if(!k)return false;const isNew=localStorage.getItem(k)!=='unlocked';localStorage.setItem(k,'unlocked');this.syncStudentSnapshot();if(isNew)document.dispatchEvent(new CustomEvent('mtpBadgeUnlocked',{detail:{badge:n}}));return isNew},
 thinkingStarKey(){const k=studentKey();return k?`thinkingStar:${k}`:''},
 getThinkingStar(){const k=this.thinkingStarKey();return !!k&&localStorage.getItem(k)==='unlocked'},
 unlockThinkingStar(){const k=this.thinkingStarKey();if(!k)return false;localStorage.setItem(k,'unlocked');this.syncStudentSnapshot();document.dispatchEvent(new CustomEvent('mengxiThinkingStarUnlocked'));return true},
 syncStudentSnapshot(){const st=currentStudent();if(!st)return;const list=readDataKey('students'),key=studentKey(st),i=list.findIndex(x=>(x.key||recordStudentKey(x))===key);const snap={...st,key,badges:[1,2,3].map(n=>this.getBadge(n)),thinkingStar:this.getThinkingStar(),lastSeen:new Date().toLocaleString()};if(i>=0)list[i]={...list[i],...snap};else list.push(snap);localStorage.setItem('students',JSON.stringify(list))}
};
function migrateV237BadgeState(){
 if(localStorage.getItem('mtpBadgeMigrationV237')==='done')return;
 const students=readDataKey('students');
 const completeFor=key=>{const data=safeParse(localStorage.getItem(`inquiryProgress_${key}`),null);if(!data||!data.stepUnlocked)return false;const u=data.stepUnlocked,map={布字:'排版',炀版:'炀板',拆版:'拆板'},done={};Object.entries(u).forEach(([k,v])=>{done[map[k]||k]=!!v});return ['制字','设板','排版','炀板','印刷','拆板'].every(k=>done[k])};
 students.forEach(st=>{const key=st.key||recordStudentKey(st);if(!key)return;if(!completeFor(key)){if(Array.isArray(st.badges))st.badges[0]=false;localStorage.removeItem(`badge1:${key}`)}});
 localStorage.setItem('students',JSON.stringify(students));localStorage.setItem('mtpBadgeMigrationV237','done');
}
function restoreStudentBadges(){['badge1','badge2','badge3'].forEach(k=>localStorage.removeItem(k));const st=currentStudent();if(!st)return;const key=studentKey(st),rec=readDataKey('students').find(x=>(x.key||recordStudentKey(x))===key);if(rec&&Array.isArray(rec.badges)){const data=safeParse(localStorage.getItem(`inquiryProgress_${key}`),null),u=data&&data.stepUnlocked?data.stepUnlocked:{},map={布字:'排版',炀版:'炀板',拆版:'拆板'},done={};Object.entries(u).forEach(([k,v])=>{done[map[k]||k]=!!v});const processComplete=['制字','设板','排版','炀板','印刷','拆板'].every(k=>done[k]);if(!processComplete){rec.badges[0]=false;localStorage.removeItem(`badge1:${key}`);const all=readDataKey('students'),i=all.findIndex(x=>(x.key||recordStudentKey(x))===key);if(i>=0){all[i]={...all[i],badges:rec.badges};localStorage.setItem('students',JSON.stringify(all))}}rec.badges.forEach((v,i)=>{const k=`badge${i+1}:${key}`;if(v)localStorage.setItem(k,'unlocked');else localStorage.removeItem(k)})}if(rec&&rec.thinkingStar)localStorage.setItem(`thinkingStar:${key}`,'unlocked')}
migrateV237BadgeState();
restoreStudentBadges();
function patchFunctions(){
 if(typeof window.saveStudentEverywhere==='function'){const old=window.saveStudentEverywhere;window.saveStudentEverywhere=function(st){st=upsertStudent(st);old(st);setSession({role:'student',student:st,loginAt:new Date().toISOString()});restoreStudentBadges();return st}}
 if(typeof window.setStudent==='function'){const old=window.setStudent;window.setStudent=function(st){st=upsertStudent(st);old(st);setSession({role:'student',student:st,loginAt:new Date().toISOString()});restoreStudentBadges();return st}}
 if(typeof window.saveProgress==='function'){const old=window.saveProgress;window.saveProgress=function(page,detail={}){old(page,detail);const st=currentStudent();if(st){const logs=readDataKey('studentActivity');logs.push({id:Date.now()+Math.random(),studentKey:studentKey(st),student:{...st},passNumber:st.passNumber,page,detail,time:new Date().toLocaleString(),ts:Date.now()});localStorage.setItem('studentActivity',JSON.stringify(logs));MTP2.syncStudentSnapshot()}return true}}
 if(typeof window.logout==='function')window.logout=function(){MTP2.logout()};
}
function moveNavIntoHero(){const hero=document.querySelector('.hero'),nav=document.querySelector('.site-nav-shell');if(hero&&nav&&nav.parentElement!==hero)hero.appendChild(nav)}
function createLoginModal(){
 if(document.getElementById('v2LoginModal'))return document.getElementById('v2LoginModal');
 const modal=document.createElement('div');modal.id='v2LoginModal';modal.className='v2-login-modal';modal.setAttribute('aria-hidden','true');
 modal.innerHTML=`<div class="v2-login-backdrop" data-login-close></div><section class="v2-login-card" role="dialog" aria-modal="true" aria-labelledby="v2LoginTitle"><button class="v2-login-close" type="button" data-login-close aria-label="关闭">×</button><div class="v2-pass-kicker">福州活字印刷云展馆</div><h2 id="v2LoginTitle">研学探展证</h2><p class="v2-login-lead" id="v2LoginReason">请先领取探展证，再继续完成学习任务。</p><div class="v2-login-grid"><label>班级<input id="v2LoginClass" autocomplete="organization" placeholder="例如：七年级1班"></label><label>座号<input id="v2LoginSeat" inputmode="numeric" placeholder="例如：08"></label><label class="v2-login-full">姓名<input id="v2LoginName" autocomplete="name" placeholder="请输入姓名"></label></div><div class="v2-login-pass"><span>探展编号</span><strong id="v2LoginPass">填写信息后自动生成</strong></div><div class="v2-login-msg" id="v2LoginMsg"></div><button class="v2-login-submit" id="v2LoginSubmit" type="button">领取探展证，继续当前任务</button><p class="v2-login-note">登录只用于记录本机学习成果，不会离开当前展馆。</p></section>`;
 document.body.appendChild(modal);
 const cls=modal.querySelector('#v2LoginClass'),seat=modal.querySelector('#v2LoginSeat'),name=modal.querySelector('#v2LoginName'),pass=modal.querySelector('#v2LoginPass'),msg=modal.querySelector('#v2LoginMsg');
 const updatePass=()=>{const c=cls.value.trim(),s=seat.value.trim(),n=name.value.trim();pass.textContent=(c&&s&&n)?genPass({cls:c,seat:s,name:n}):'填写信息后自动生成'};
 [cls,seat,name].forEach(x=>x.addEventListener('input',updatePass));
 modal.querySelectorAll('[data-login-close]').forEach(x=>x.addEventListener('click',()=>closeLoginModal()));
 modal.querySelector('#v2LoginSubmit').addEventListener('click',()=>{
  const st={cls:cls.value.trim(),seat:seat.value.trim(),name:name.value.trim()};
  if(!st.cls||!st.seat||!st.name){msg.textContent='请把班级、座号和姓名填写完整。';msg.className='v2-login-msg error';return}
  st.passNumber=genPass(st);const saved=upsertStudent(st);setSession({role:'student',student:saved,loginAt:new Date().toISOString()});restoreStudentBadges();MTP2.syncStudentSnapshot();msg.textContent='探展证已生效，正在回到当前任务……';msg.className='v2-login-msg success';
  setTimeout(()=>location.reload(),360);
 });
 modal.addEventListener('keydown',e=>{if(e.key==='Escape')closeLoginModal();if(e.key==='Enter'&&!e.target.matches('textarea'))modal.querySelector('#v2LoginSubmit').click()});
 return modal;
}
function openLoginModal(reason='请先领取探展证，再继续完成学习任务。'){
 if(getSession())return false;const modal=createLoginModal();modal.querySelector('#v2LoginReason').textContent=reason;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('v2-modal-open');setTimeout(()=>modal.querySelector('#v2LoginClass')?.focus(),40);return true;
}
function closeLoginModal(){const modal=document.getElementById('v2LoginModal');if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('v2-modal-open')}
MTP2.openLoginModal=openLoginModal;MTP2.closeLoginModal=closeLoginModal;
function addUserBar(){
 if(/(?:^|\/)index(?:\(\d+\))?\.html$/.test(location.pathname)||location.pathname.endsWith('/')||document.querySelector('.v2-userbar'))return;
 const s=getSession(),bar=document.createElement('div');bar.className='v2-userbar';
 let left='<button class="v2-login-link" type="button" data-open-student-login>尚未登录 · 点击领取研学探展证</button>';
 if(s?.role==='teacher')left='<span class="v2-teacher-flag">教师模式：全部展馆已解锁，可使用全部功能</span>';
 else if(s?.role==='student'&&s.student)left=`已登录：<b>${escapeHtml(s.student.cls)} ${escapeHtml(s.student.seat)}号 ${escapeHtml(s.student.name)}</b>　探展编号：<b>${escapeHtml(s.student.passNumber||'')}</b>${MTP2.getThinkingStar()?'<span class="v2-thinking-star" title="思辨之星">★ 思辨之星</span>':''}`;
 const actions=s?`<button class="v2-mini-btn" onclick="MTP2.shareLink()">${s.role==='teacher'?'分享教师数据链接':'分享本账号与作品'}</button><button class="v2-mini-btn" onclick="MTP2.logout()">退出登录</button>`:'';
 bar.innerHTML=`<div>${left}</div><div class="v2-userbar-actions">${actions}</div>`;
 bar.querySelector('[data-open-student-login]')?.addEventListener('click',()=>openLoginModal('请先领取研学探展证，再继续浏览和作答。'));
 const hero=document.querySelector('.hero');hero?.insertAdjacentElement('afterend',bar);
}
function wireLoginPrompts(){
 if(getSession())return;
 document.querySelectorAll('#studentBadge').forEach(el=>{
  el.classList.add('v2-login-prompt');el.setAttribute('role','button');el.setAttribute('tabindex','0');el.title='点击领取研学探展证';
  const go=()=>openLoginModal('请先填写研学探展证，登录后会留在当前展馆继续学习。');el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
 });
}
function wireProtectedInteractions(){
 if(getSession()||MTP2.isTeacher()||/(?:^|\/)index(?:\(\d+\))?\.html$/.test(location.pathname)||location.pathname.endsWith('/')||location.pathname.endsWith('help.html')||location.pathname.endsWith('teacher.html'))return;
 const protectedSelector='.exhibit-hall input,.exhibit-hall textarea,.exhibit-hall select,.exhibit-hall button,.exhibit-hall [role="button"],.exhibit-hall .option,.exhibit-hall .step-card,.exhibit-hall [data-answer],.exhibit-hall [data-choice]';
 const blockGuest=e=>{const target=e.target.closest?.(protectedSelector);if(!target||target.closest('#v2LoginModal')||target.closest('.site-nav')||target.closest('.help-button')||target.closest('#studentBadge')||target.dataset.guestAllowed==='true')return false;e.preventDefault();e.stopImmediatePropagation?.();e.stopPropagation();openLoginModal('登录后才能记录这次作答。先领取研学探展证吧。');return true};
 document.addEventListener('pointerdown',blockGuest,true);
 document.addEventListener('click',blockGuest,true);
 document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;blockGuest(e)},true);
}
function unlockTeacherView(){if(!MTP2.isTeacher())return;document.documentElement.classList.add('teacher-mode');document.querySelectorAll('.locked').forEach(el=>{el.classList.remove('locked');el.classList.add('unlocked')});document.querySelectorAll('.lock-cover').forEach(el=>el.style.display='none');document.querySelectorAll('button:disabled').forEach(b=>b.disabled=false);try{if(typeof window.unlockInquiryForTeacher==='function')window.unlockInquiryForTeacher();else{if(typeof window.unlockGallery==='function')window.unlockGallery();if(typeof window.unlockActiveInquiry==='function')window.unlockActiveInquiry()}}catch(e){}
}
function replaceBadgeEmoji(){document.querySelectorAll('.pass-badge-icon').forEach((el,i)=>{const n=(i%3)+1;if(!el.querySelector('img'))el.innerHTML=`<img src="${P.badgeFiles[n-1]}" alt="徽章${n}">`;el.classList.toggle('unlocked',MTP2.isTeacher()||MTP2.getBadge(n))});const old=document.querySelectorAll('#badge1Icon,#badge2Icon,#badge3Icon');old.forEach((el,i)=>{el.innerHTML=`<img src="${P.badgeFiles[i]}" alt="徽章${i+1}" style="width:100%;height:100%;object-fit:contain">`;el.classList.toggle('unlocked',MTP2.isTeacher()||MTP2.getBadge(i+1))})}
function addIndexSessionUI(){if(!/(?:^|\/)index(?:\(\d+\))?\.html$/.test(location.pathname)&&!location.pathname.endsWith('/'))return;const s=getSession();if(s?.role==='teacher'){const msg=document.getElementById('loginMsg');if(msg){msg.textContent='教师模式已登录：所有展馆均已解锁。';msg.style.color='#d9f2c4'}const target=document.querySelector('.teacher-link');if(target){const b=document.createElement('button');b.className='logout-btn';b.textContent='退出教师登录';b.onclick=()=>MTP2.logout();target.insertAdjacentElement('afterend',b)}}}
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


function showBadgeCelebration(n){
 const meta=BADGE_META[n];if(!meta||MTP2.isTeacher())return;
 document.querySelector('.v2-badge-celebration')?.remove();
 const wrap=document.createElement('div');wrap.className='v2-badge-celebration';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label',`恭喜解锁${meta.name}`);
 wrap.innerHTML=`<div class="v2-badge-glow" aria-hidden="true"></div><section class="v2-badge-award-card"><button class="v2-badge-award-close" type="button" aria-label="关闭">×</button><div class="v2-badge-award-kicker">研学成就达成</div><div class="v2-badge-award-image"><span class="v2-badge-rays" aria-hidden="true"></span><img src="${P.badgeFiles[n-1]}" alt="${meta.name}"></div><h2>恭喜解锁</h2><h3>${meta.name}</h3><p>${meta.desc}</p><button class="v2-badge-award-ok" type="button">收下徽章</button></section>`;
 document.body.appendChild(wrap);requestAnimationFrame(()=>wrap.classList.add('show'));
 let timer=setTimeout(close,6200);
 function close(){clearTimeout(timer);wrap.classList.remove('show');setTimeout(()=>wrap.remove(),260)}
 wrap.querySelector('.v2-badge-award-close').addEventListener('click',close);
 wrap.querySelector('.v2-badge-award-ok').addEventListener('click',close);
 wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
}

function refreshThinkingStarUI(){
 const old=document.querySelector('.v2-userbar');if(old){old.remove();addUserBar()}
 try{if(typeof window.renderStudentPass==='function')window.renderStudentPass()}catch(e){}
 document.querySelectorAll('.thinking-star-mark').forEach(el=>el.classList.add('unlocked'));
}
document.addEventListener('mengxiThinkingStarUnlocked',()=>setTimeout(refreshThinkingStarUI,0));
document.addEventListener('mtpBadgeUnlocked',e=>setTimeout(()=>{replaceBadgeEmoji();try{if(typeof window.renderStudentPass==='function')window.renderStudentPass();if(typeof window.updateBadgeDisplay==='function')window.updateBadgeDisplay()}catch(err){}showBadgeCelebration(Number(e.detail&&e.detail.badge));},0));

function mediaCheck(){document.querySelectorAll('video source').forEach(s=>{if(!s.src&&s.dataset.src)s.src=s.dataset.src});}
document.addEventListener('DOMContentLoaded',()=>{patchFunctions();moveNavIntoHero();createLoginModal();addUserBar();addIndexSessionUI();patchTeacherLogin();enrichTeacherDashboard();unlockTeacherView();replaceBadgeEmoji();sortEnhance();mediaCheck();wireLoginPrompts();wireProtectedInteractions();sessionStorage.removeItem('mtpSharedSnapshotNotice');setTimeout(()=>{unlockTeacherView();replaceBadgeEmoji();wireLoginPrompts()},350)});
})();