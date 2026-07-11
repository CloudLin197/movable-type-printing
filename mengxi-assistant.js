// 沈括书童·梦溪：数字助教（对话框在右侧上方，不挡小人）
(function () {
  if (window.__mengxiAssistantLoaded) return;
  window.__mengxiAssistantLoaded = true;

  // 注入样式
  const style = document.createElement('style');
  style.textContent = `
    .mengxi-float {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9998;
      width: 150px;
      height: auto;
      cursor: pointer;
      filter: drop-shadow(0 8px 16px rgba(80,40,20,0.5));
      transition: transform 0.2s;
    }
    .mengxi-float:hover { transform: scale(1.08); }
    .mengxi-avatar-wrap { width: 100%; position: relative; }
    .mengxi-tip {
      position: absolute;
      top: -30px; left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.7); color: #f5e7c6;
      padding: 4px 12px; border-radius: 12px;
      font-size: 12px; white-space: nowrap;
      opacity: 0; transition: opacity 0.3s; pointer-events: none;
    }
    .mengxi-float:hover .mengxi-tip { opacity: 1; }
    .mengxi-avatar { width: 100%; }
    .mengxi-avatar img {
      width: 100%; height: auto; display: block;
      border-radius: 0; animation: mx-float-bounce 3s ease-in-out infinite;
    }
    @keyframes mx-float-bounce {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    /* 对话框在右侧，位置向上提高，不挡小人 */
    .mengxi-panel {
      position: fixed;
      bottom: 200px;           /* 提高到小人上方 */
      right: 24px;             /* 与小人同侧对齐 */
      width: 380px;
      max-height: 520px;
      background: #fef9f0;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(60,30,10,0.3);
      border: 1px solid #dac29c;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: 0.3s cubic-bezier(0.18,0.89,0.32,1.15);
      font-family: "KaiTi","Noto Serif SC",serif;
    }
    .mengxi-panel.open { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
    .mx-panel-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px; background: #e0cfaa; border-bottom: 1px solid #c9aa7a;
    }
    .mx-title-wrap { display: flex; align-items: center; gap: 12px; }
    .mx-head-img {
      width: 48px; height: 48px; border-radius: 50%; overflow: hidden;
      background: #f5efe6; border: 2px solid #dac29c; flex-shrink: 0;
    }
    .mx-head-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .mx-title-wrap h3 { font-size: 18px; color: #4e3620; margin: 0; letter-spacing: 2px; }
    .mx-title-wrap span { font-size: 12px; color: #7a5a3a; display: block; }
    .mx-close { background: none; border: none; font-size: 24px; color: #7a5a3a; cursor: pointer; padding: 0 4px; }
    .mx-chat {
      flex: 1; overflow-y: auto; padding: 16px; background: #fffbf5;
      display: flex; flex-direction: column; gap: 12px; max-height: 260px;
    }
    .mx-msg { display: flex; }
    .mx-msg.user { justify-content: flex-end; }
    .mx-msg.bot { justify-content: flex-start; }
    .mx-bubble {
      max-width: 80%; padding: 10px 14px; border-radius: 18px;
      font-size: 14px; line-height: 1.6;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); word-break: break-word;
    }
    .user .mx-bubble { background: #d3c1a1; color: #2e2416; }
    .bot .mx-bubble { background: #f2e8d9; color: #3e2e1f; border: 1px solid #e3d3b8; }
    .mx-chips {
      display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 8px;
    }
    .mx-chip {
      background: #f3ede5; border: 1px solid #dacbbc; border-radius: 20px;
      padding: 6px 14px; font-size: 13px; font-family: inherit;
      color: #4e3620; cursor: pointer; transition: 0.2s; white-space: nowrap;
    }
    .mx-chip:hover { background: #e0cfaa; }
    .mx-input {
      display: flex; gap: 8px; padding: 12px 16px;
      border-top: 1px solid #ddd0b8; background: #faf5ec;
    }
    .mx-input input {
      flex: 1; padding: 10px 16px; border: 1px solid #dac09a;
      border-radius: 24px; background: white; font-family: inherit;
      font-size: 14px; outline: none;
    }
    .mx-input button {
      background: #8b6b4b; border: none; color: white;
      padding: 0 20px; border-radius: 24px; font-weight: bold;
      font-family: inherit; cursor: pointer; transition: 0.2s;
    }
    .mx-input button:hover { background: #6b4f34; }
    @media (max-width: 480px) {
      .mengxi-panel {
        width: calc(100% - 20px);
        right: 10px;
        bottom: 180px;
        max-height: 60vh;
      }
      .mengxi-float { width: 110px; right: 10px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ===================== 问答库 =====================
  const QA = [
    {k:['沈括','作者','谁写','出处','梦溪笔谈'],a:'《活板》选自沈括《梦溪笔谈》。沈括（1031-1095），字存中，杭州钱塘人，北宋科学家、政治家。'},
    {k:['梦溪','书童','沈括','科学精神'],a:'沈括晚年隐居润州梦溪园，编撰《梦溪笔谈》。他重视观察记录，体现实证求真精神。'},
    {k:['毕昇','发明','活板','布衣'],a:'毕昇是北宋平民，发明了泥活字印刷术，把字刻在胶泥上，火烧令坚，再排版印刷。'},
    {k:['板印','板印书籍','唐人','尚未','盛为之'],a:'板印：雕版印刷。盛：大规模。为之：做这件事。全句：用雕版印刷书籍，唐朝人还没有大规模地这样做。'},
    {k:['已后','典籍','板本'],a:'已后：即“以后”，“已”通“以”。典籍：重要文献。板本：雕版印刷的本子。'},
    {k:['布衣','平民','毕昇'],a:'布衣：平民，古代没有官职的人穿布衣。毕昇是平民发明家，所以称“布衣毕昇”。'},
    {k:['钱唇','薄如','一字一印'],a:'钱唇：铜钱的边缘。毕昇用胶泥刻字，字薄得像铜钱边一样。每字制成一个字印。'},
    {k:['火烧令坚','火烧','令坚','火','令'],a:'火烧令坚：用火烧使它坚硬。“火”是名词作状语，意为“用火”。“令坚”是使动用法，即“使……坚固”。'},
    {k:['冒','松脂','蜡和纸灰','药'],a:'冒：覆盖。先设一铁板，在其上用松脂、蜡和纸灰之类覆盖。这种混合物即“药”，用于固定活字。'},
    {k:['铁范','铁模子','框'],a:'铁范：铁制的框子。排版时把铁范放在铁板上，在框内紧密排布活字。'},
    {k:['炀','镕','字平如砥','药稍镕'],a:'炀（yáng）：烘烤。镕（róng）：熔化。砥（dǐ）：磨刀石。把铁板靠近火烘烤，药稍熔化后，用平板按压字面，字面就平整如磨刀石。'},
    {k:['止印三二本','未为简易','神速'],a:'止：通“只”。如果只印几本，算不上简便；但印几十上百本，就极为快速。'},
    {k:['二铁板','更互','瞬息可就'],a:'常作二铁板：一块印刷，一块排字。更互：交替、轮流。瞬息可就：眨眼间就能完成。'},
    {k:['韵','帖','木格贮之','贮存'],a:'韵：音韵分类。帖：标签。每个韵部贴一标签，用木格贮存。这体现了活字分类管理的模块化思维。'},
    {k:['奇字','素','旋刻之','瞬息可成'],a:'奇字：生僻字。素：平时。旋：立即。平时没有备用的生僻字，立即刻制，用草火烧，很快就能完成。'},
    {k:['讫','再火','拂','殊不沾污'],a:'讫（qì）：完毕。用完后再次用火烤使药熔化，用手轻拂，活字自然落下，一点也不沾污。“拂”读fú。'},
    {k:['通假字','已后','止','板','已','止'],a:'文中通假字：①“已后”的“已”通“以”；②“止印三二本”的“止”通“只”。另外“板”通“版”。'},
    {k:['词类活用','火','名词作状语','令坚'],a:'词类活用：“火烧令坚”的“火”是名词作状语，译为“用火”；“令坚”是形容词的使动用法。'},
    {k:['全文翻译','译文','整篇','现代文'],a:'《活板》现代文大意：雕版印刷，唐朝人还没大规模使用。五代冯道开始印五经，以后的经典都是雕版本。宋代庆历年间，平民毕昇又发明了活字版。方法：用胶泥刻字，薄如铜钱边，每个字做一字印，用火烧使它坚固。先设一铁板，上面用松脂、蜡和纸灰覆盖。要印时，放一铁框在铁板上，紧密排满字印。整板靠近火烘烤，药稍熔，用平板按字面，字面平如磨刀石。只印两三本不算简便，印几十上百本就非常快。常用两块铁板，一板印刷，一板排字。印完一块，第二块已备好，交替使用，瞬间完成。每个字都有多个字印，常用字更多。不用时，按韵分类贴标签，放木格贮存。生僻字没准备的，马上刻制，用草火烧，一会儿就好。用完再火烤，用手拂落字印，一点也不沾污。'},
    {k:['板印书籍唐人尚未盛为之','翻译','第一句'],a:'“板印书籍，唐人尚未盛为之”译文：用雕版印刷书籍，唐朝人还没有大规模地推行它。'},
    {k:['庆历中有布衣毕昇又为活板','翻译','第二句'],a:'“庆历中，有布衣毕昇，又为活板”译文：庆历年间，有一位平民叫毕昇，又发明了活字版。'},
    {k:['其法胶泥刻字','翻译','方法'],a:'“其法：用胶泥刻字，薄如钱唇，每字为一印，火烧令坚”译文：他的方法是：用黏土刻字，薄得如同铜钱的边缘，每个字做一个字印，用火烧使它坚硬。'},
    {k:['先设一铁板','翻译','铁板','松脂'],a:'“先设一铁板，其上以松脂、蜡和纸灰之类冒之”译文：先设置一块铁板，在它的上面用松脂、蜡混合着纸灰这一类东西覆盖好。'},
    {k:['则字平如砥','翻译','砥'],a:'“则以一平板按其面，则字平如砥”译文：就用一块平板按在字印的面上，于是所有排在板上的字印就平整得像磨刀石一样。'},
    {k:['瞬息可就','翻译','更互'],a:'“更互用之，瞬息可就”译文：两块铁板交替使用，极短的时间就可以完成印刷。'},
    {k:['每韵为一帖','木格贮之','翻译'],a:'“不用，则以纸帖之，每韵为一帖，木格贮之”译文：不用的时候，就用纸条给它们做标签，每一个韵部的字做一个标签，用木格子把它们储藏起来。'},
    {k:['六道工序','工序','排序','流程'],a:'活字印刷六道工序：胶泥制字 → 设版覆药 → 布字排版 → 就火炀板 → 按平印刷 → 拆版归字。“先造字，再排版；先上墨，再印刷；印完归字可复用”。'},
    {k:['活','特点','活在哪里'],a:'“活”体现在：（1）每字一印——字是活的（2）密布字印——排版是活的（3）每一字皆有数印——字印数目是活的（4）有奇字素无备者，旋刻之——做法是活的（5）更互用之——用法是活的（6）以手拂之，其印自落——拆法是活的'},
    {k:['模块化','思维','组合','复用'],a:'活字印刷的深层价值是“模块化思维”：将整版文字拆成标准化活字，按需组合、替换、复用。如同现代积木、代码模块、零件装配。'},
    {k:['字音','炀','砥','镕','拂','韵'],a:'重点字音：炀（yáng）烘烤；砥（dǐ）磨刀石；镕（róng）熔化；拂（fú）轻轻擦拭；韵（yùn）音韵；贮（zhù）储存。'},
    {k:['断句','句读','朗读'],a:'断句示例：庆历中/有布衣毕昇/又为活板。其法/用胶泥刻字/薄如钱唇/每字为一印/火烧令坚。先设一铁板/其上以松脂蜡和纸灰之类冒之。'},
    {k:['四大发明','意义','价值'],a:'活字印刷是四大发明之一，降低书籍成本，促进知识传播、教育普及和文化交流，改变世界文明进程。'},
    {k:['福州','福建','非遗','连城','宁化','三坊七巷'],a:'福建印刷非遗丰富：福州三坊七巷有福建省非遗博览苑；连城四堡保留古雕版印刷技艺；宁化仍存木活字手工印刷传承。'},
    {k:['探究观点','思辨之星','观点'],a:'你可以这样表达：活字印刷的伟大在于把文字变成可组合、可复用的“模块”，改变了知识传播方式，是人类思维的一次飞跃。'},
    {k:['徽章','解锁','任务'],a:'本课件三枚徽章：匠艺之星（完成工序挑战）、博闻之星（解锁时间轴问答）、思辨之星（提交探究观点）。'},
    {k:['你好','梦溪','你是谁'],a:'小生梦溪，沈括身边的小书童。我可解答《活板》的字词、翻译、断句、印刷史等问题，也陪你讨论活字之“活”。'}
  ];
  const quick = ['“火烧令坚”怎么翻译？','“炀”字怎么读？','六道工序是什么？','活字“活”在哪里？','福建印刷非遗有哪些？'];

  function answer(q) {
    const text = (q || '').trim();
    if (!text) return '你可以问我字词解释、句子翻译、字音断句，或活字印刷的意义。';
    let best = null, score = 0;
    QA.forEach(item => {
      let s = 0;
      item.k.forEach(w => { if (text.includes(w)) s += 1; });
      if (s > score) { score = s; best = item; }
    });
    if (score > 0) return best.a;
    if (text.length >= 12 && /(我认为|我觉得|因为|所以|活字|印刷|发明|传播|文化|模块)/.test(text)) {
      localStorage.setItem('badge3', 'unlocked');
      document.dispatchEvent(new CustomEvent('mengxiBadge3Unlocked'));
      return '你的观点很有探究价值！我已为你点亮“💡 思辨之星”。可以再补充一句：它让知识传播从“整版复制”走向“灵活组合”。';
    }
    return '这个问题我可以试着解答。你可以更具体地问某个字词、句子翻译，或活字印刷的工序和意义。';
  }

  function el(tag, cls, html) { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; }
  function addMsg(chat, who, msg) { const row = el('div', 'mx-msg ' + who); const b = el('div', 'mx-bubble', msg); row.appendChild(b); chat.appendChild(row); chat.scrollTop = chat.scrollHeight; }

  function init() {
    const panel = el('div', 'mengxi-panel');
    panel.innerHTML = `
      <div class="mx-panel-head">
        <div class="mx-title-wrap">
          <div class="mx-head-img"><img src="assets/mengxi-ip.png" alt="梦溪"></div>
          <div>
            <h3>沈括书童 · 梦溪</h3>
            <span>数字助教</span>
          </div>
        </div>
        <button class="mx-close" title="关闭">&times;</button>
      </div>
      <div class="mx-chat"></div>
      <div class="mx-chips"></div>
      <div class="mx-input">
        <input placeholder="问字词、求翻译、探活字之妙……">
        <button>发送</button>
      </div>
    `;
    document.body.appendChild(panel);

    const float = el('div', 'mengxi-float');
    float.innerHTML = `
      <div class="mengxi-avatar-wrap" title="点击召唤梦溪">
        <div class="mengxi-tip">点击召唤梦溪</div>
        <div class="mengxi-avatar">
          <img src="assets/mengxi-ip.png" alt="梦溪">
        </div>
      </div>
    `;
    document.body.appendChild(float);

    const chat = panel.querySelector('.mx-chat');
    const chips = panel.querySelector('.mx-chips');
    const input = panel.querySelector('input');
    const btn = panel.querySelector('.mx-input button');

    addMsg(chat, 'bot', '同学你好，我是“沈括书童·梦溪”。你可以问我《活板》的字词解释、句子翻译、字音断句，以及活字印刷的历史与智慧。');
    quick.forEach(q => {
      const chip = el('button', 'mx-chip', q);
      chip.onclick = () => { input.value = q; send(); };
      chips.appendChild(chip);
    });

    function send() {
      const q = input.value.trim();
      if (!q) return;
      addMsg(chat, 'user', q);
      input.value = '';
      setTimeout(() => addMsg(chat, 'bot', answer(q)), 120);
    }

    float.onclick = () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) input.focus();
    };
    panel.querySelector('.mx-close').onclick = () => panel.classList.remove('open');
    btn.onclick = send;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

    document.addEventListener('mengxiBadge3Unlocked', () => {
      panel.classList.add('mx-think-unlocked');
      setTimeout(() => panel.classList.remove('mx-think-unlocked'), 1800);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();