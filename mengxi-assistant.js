// 沈括书童·梦溪：数字助教（对话框在右侧上方，不挡小人）
(function () {
  if (window.__mengxiAssistantLoaded) return;
  window.__mengxiAssistantLoaded = true;

  // 注入样式
  const style = document.createElement('style');
  style.textContent = `
    .mengxi-float {
      position: fixed;
      bottom: 22px;
      right: 24px;
      z-index: 9998;
      width: 170px;
      height: auto;
      cursor: pointer;
      filter: drop-shadow(0 10px 18px rgba(80,40,20,.48));
      transition: transform .2s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .mengxi-float:hover,
    .mengxi-float:focus-within { transform: scale(1.035); }
    .mengxi-avatar-wrap { width: 100%; position: relative; }
    .mengxi-callout {
      position: absolute;
      top: 38px;
      right: 136px;
      width: 194px;
      min-height: 62px;
      display: grid;
      grid-template-columns: 42px 1fr;
      align-items: center;
      gap: 10px;
      padding: 9px 14px 9px 10px;
      border: 1px solid rgba(152,105,48,.78);
      border-radius: 18px;
      background:
        linear-gradient(135deg,rgba(255,253,245,.98),rgba(236,224,197,.98));
      color: #4d321d;
      box-shadow:
        0 10px 24px rgba(59,31,12,.20),
        inset 0 0 0 3px rgba(255,250,236,.72),
        inset 0 -1px 0 rgba(129,83,35,.16);
      font-family: "KaiTi","Noto Serif SC",serif;
      text-align: left;
      animation: mx-callout-float 3.4s ease-in-out infinite;
      transition: transform .2s ease, box-shadow .2s ease;
      overflow: visible;
    }
    .mengxi-callout::before {
      content: "";
      position: absolute;
      inset: 5px;
      border: 1px solid rgba(185,139,77,.34);
      border-radius: 13px;
      pointer-events: none;
    }
    .mengxi-callout::after {
      content: "";
      position: absolute;
      right: -20px;
      bottom: 13px;
      width: 30px;
      height: 12px;
      background:
        radial-gradient(circle at 6px 6px,#d4aa66 0 4px,transparent 4.5px),
        radial-gradient(circle at 20px 6px,#f4dfb4 0 3px,transparent 3.5px);
      filter: drop-shadow(0 1px 1px rgba(79,45,17,.28));
    }
    .mengxi-float:hover .mengxi-callout,
    .mengxi-float:focus-within .mengxi-callout {
      transform: translateY(-3px);
      box-shadow:
        0 14px 30px rgba(59,31,12,.26),
        inset 0 0 0 3px rgba(255,250,236,.78),
        inset 0 -1px 0 rgba(129,83,35,.16);
    }
    .mengxi-callout .mx-call-icon {
      position: relative;
      z-index: 1;
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #fff9ed;
      background:
        radial-gradient(circle at 35% 30%,#9cbab0 0 18%,#688f84 48%,#456b61 100%);
      border: 2px solid #d7b06d;
      box-shadow:
        0 4px 10px rgba(63,48,27,.20),
        inset 0 1px 0 rgba(255,255,255,.45);
    }
    .mengxi-callout .mx-call-icon svg {
      width: 21px;
      height: 21px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .mx-call-copy { position: relative; z-index: 1; min-width: 0; }
    .mx-call-main {
      display: block;
      font-size: 18px;
      line-height: 1.12;
      font-weight: 900;
      letter-spacing: 1.2px;
      color: #59391f;
      white-space: nowrap;
    }
    .mx-call-sub {
      display: block;
      margin-top: 4px;
      font-family: "Noto Serif SC","Songti SC",serif;
      font-size: 12px;
      line-height: 1.2;
      letter-spacing: .4px;
      color: #866242;
      white-space: nowrap;
    }
    .mengxi-avatar { width: 100%; }
    .mengxi-avatar img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 0;
      animation: mx-float-bounce 3s ease-in-out infinite;
    }
    @keyframes mx-float-bounce {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes mx-callout-float {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    .mengxi-panel {
      position: fixed;
      bottom: 208px;
      right: 24px;
      width: 420px;
      max-height: min(650px,calc(100vh - 230px));
      background: #fef9f0;
      border-radius: 24px;
      box-shadow: 0 20px 45px rgba(60,30,10,.34);
      border: 1px solid #dac29c;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(.95);
      transition: .3s cubic-bezier(.18,.89,.32,1.15);
      font-family: "KaiTi","Noto Serif SC",serif;
    }
    .mengxi-panel.open { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
    .mx-panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: linear-gradient(180deg,#e7d7b6,#d7bf93);
      border-bottom: 1px solid #c9aa7a;
    }
    .mx-title-wrap { display: flex; align-items: center; gap: 12px; }
    .mx-head-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      background: #f5efe6;
      border: 2px solid #b88750;
      flex-shrink: 0;
    }
    .mx-head-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .mx-title-wrap h3 { font-size: 19px; color: #4e3620; margin: 0; letter-spacing: 2px; }
    .mx-title-wrap span { font-size: 13px; color: #725237; display: block; margin-top: 2px; }
    .mx-close { background: none; border: none; font-size: 28px; color: #6f4e2e; cursor: pointer; padding: 0 5px; line-height: 1; }
    .mx-chat {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #fffbf5;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 220px;
      max-height: 320px;
    }
    .mx-msg { display: flex; }
    .mx-msg.user { justify-content: flex-end; }
    .mx-msg.bot { justify-content: flex-start; }
    .mx-bubble {
      max-width: 84%;
      padding: 11px 14px;
      border-radius: 18px;
      font-size: 15px;
      line-height: 1.65;
      box-shadow: 0 1px 3px rgba(0,0,0,.05);
      word-break: break-word;
    }
    .user .mx-bubble { background: #d3c1a1; color: #2e2416; }
    .bot .mx-bubble { background: #f2e8d9; color: #3e2e1f; border: 1px solid #e3d3b8; }
    .mx-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 0 16px 9px; background:#fffbf5; }
    .mx-chip {
      background: #f3ede5;
      border: 1px solid #dacbbc;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 13px;
      font-family: inherit;
      color: #4e3620;
      cursor: pointer;
      transition: .2s;
      white-space: nowrap;
    }
    .mx-chip:hover { background: #e0cfaa; transform: translateY(-1px); }
    .mx-voice-status {
      min-height: 35px;
      padding: 7px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #715236;
      background: #f6eddf;
      border-top: 1px solid #eadbc5;
      font-size: 13px;
      line-height: 1.4;
    }
    .mx-voice-status::before {
      content: "●";
      color: #9b7a55;
      font-size: 12px;
    }
    .mx-voice-status.listening::before { color: #b83f32; animation: mx-listen-blink .8s ease-in-out infinite; }
    @keyframes mx-listen-blink { 50% { opacity: .25; transform: scale(1.35); } }

    .mx-guide-progress {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed rgba(155,122,85,.42);
      font-family: "Noto Serif SC","Songti SC",serif;
    }
    .mx-guide-label {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      color:#7b5a39;
      font-size:12px;
      line-height:1.4;
      margin-bottom:5px;
    }
    .mx-guide-label b { color:#5f4329; font-size:12px; }
    .mx-guide-track {
      height:7px;
      overflow:hidden;
      border-radius:999px;
      background:#e6d7c1;
      box-shadow:inset 0 1px 2px rgba(69,40,20,.12);
    }
    .mx-guide-track i {
      display:block;
      height:100%;
      border-radius:inherit;
      background:linear-gradient(90deg,#9d7955,#c49a62);
      transition:width .35s ease;
    }
    .mx-input {
      display: grid;
      grid-template-columns: 1fr 44px 44px 64px;
      gap: 7px;
      padding: 11px 12px 13px;
      border-top: 1px solid #ddd0b8;
      background: #faf5ec;
    }
    .mx-input input {
      min-width: 0;
      padding: 10px 14px;
      border: 1px solid #b99a73;
      border-radius: 22px;
      background: #fffdf8;
      color: #2f2117 !important;
      -webkit-text-fill-color: #2f2117 !important;
      caret-color: #7b4a24;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      outline: none;
      opacity: 1;
    }
    .mx-input input::placeholder {
      color: #8a725d !important;
      -webkit-text-fill-color: #8a725d !important;
      opacity: 1;
      font-weight: 400;
    }
    .mx-input input:focus { border-color:#8d5d31; background:#fff; box-shadow:0 0 0 3px rgba(141,93,49,.16); }
    .mx-input input::selection { background:#d8bd92; color:#24170f; -webkit-text-fill-color:#24170f; }
    .mx-input button {
      min-width: 0;
      border: none;
      border-radius: 22px;
      font-weight: bold;
      font-family: inherit;
      cursor: pointer;
      transition: .2s;
    }
    .mx-send { background: #8b6b4b; color: white; font-size: 14px; }
    .mx-send:hover { background: #6b4f34; }
    .mx-mic,.mx-speaker {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #eee1ce;
      color: #644325;
      border: 1px solid #d2b995 !important;
      font-family: Arial,"Noto Sans SC",sans-serif !important;
      font-size: 19px;
    }
    .mx-mic:hover,.mx-speaker:hover { background: #e1cba8; }
    .mx-mic.listening { background:#b74e40; color:#fff; border-color:#92362c !important; animation:mx-mic-pulse 1s infinite; }
    @keyframes mx-mic-pulse { 50% { box-shadow:0 0 0 6px rgba(183,78,64,.16); } }
    .mx-speaker.muted { opacity:.58; filter:grayscale(1); }
    .mx-input button:disabled { opacity:.42; cursor:not-allowed; transform:none; }
    .mx-voice-hint { font-weight:700; }
    .mx-socratic-tag {
      display:inline-flex;
      align-items:center;
      gap:6px;
      margin:0 0 7px;
      padding:4px 9px;
      border:1px solid #c7a46f;
      border-radius:999px;
      background:#f5ead6;
      color:#6b4726;
      font-size:12px;
      font-weight:900;
      letter-spacing:.3px;
    }
    .mx-socratic-progress {
      display:block;
      margin-top:8px;
      padding:7px 9px;
      border-left:4px solid #8f6a3f;
      border-radius:7px;
      background:#f8f1e6;
      color:#5c432d;
      font-size:13px;
      line-height:1.6;
    }

    @media (max-width: 620px) {
      .mengxi-panel {
        width: calc(100% - 20px);
        right: 10px;
        bottom: 178px;
        max-height: calc(100vh - 195px);
      }
      .mengxi-float { width: 118px; right: 8px; bottom: 12px; }
      .mengxi-callout {
        top: -16px;
        right: 82px;
        width: 172px;
        min-height: 56px;
        grid-template-columns: 36px 1fr;
        gap: 8px;
        padding: 8px 11px 8px 8px;
      }
      .mengxi-callout .mx-call-icon { width:34px;height:34px; }
      .mengxi-callout .mx-call-icon svg { width:18px;height:18px; }
      .mx-call-main { font-size:16px;letter-spacing:.8px; }
      .mx-call-sub { font-size:11px;margin-top:3px; }
      .mengxi-callout::after { right:-17px;bottom:12px;transform:scale(.85);transform-origin:right center; }
      .mx-chat { max-height: 38vh; }
      .mx-input { grid-template-columns:1fr 42px 42px; }
      .mx-send { grid-column:1/4; min-height:40px; }
    }
`;
  document.head.appendChild(style);


  // ===================== 丰富字词库 =====================
  // 先用专题词库提供“读音 + 释义 + 课文关联/常用词”，再用离线汉字读音表兜底。
  const RICH_LEXICON = [
    {term:'沈括',pinyin:'shěn kuò',meaning:'北宋科学家、政治家，《梦溪笔谈》的作者。',textbook:['《活板》的作者'],words:['沈括','梦溪丈人']},
    {term:'毕昇',pinyin:'bì shēng',meaning:'北宋平民工匠，泥活字印刷术的发明者。',textbook:['《活板》“有布衣毕昇，又为活板”']},
    {term:'梦溪笔谈',pinyin:'mèng xī bǐ tán',meaning:'沈括撰写的综合性笔记体著作。',textbook:['《活板》选自《梦溪笔谈》卷十八《技艺》']},
    {term:'活字印刷',pinyin:'huó zì yìn shuā',meaning:'把单个字印按需排列成版、印后拆下并重复使用的印刷方法。'},
    {term:'活板',pinyin:'huó bǎn',meaning:'用活字排成的印刷版。',textbook:['《活板》篇题与正文“又为活板”'],note:'“板”同“版”。',textbookNote:true},
    {term:'已',pinyin:'yǐ',meaning:'在“已后”中同“以”。',textbook:['《活板》“五经已后”'],textbookNote:true},
    {term:'已自',pinyin:'yǐ zì',meaning:'已经。',textbook:['《活板》“一板已自布字”'],textbookNote:true},
    {term:'坚',pinyin:'jiān',meaning:'坚硬。',textbook:['《活板》“火烧令坚”'],textbookNote:true},
    {term:'具',pinyin:'jù',meaning:'准备（好了）。',textbook:['《活板》“此印者才毕，则第二板已具”'],textbookNote:true},
    {term:'木理',pinyin:'mù lǐ',meaning:'木头的纹理。',textbook:['《活板》“木理有疏密”'],textbookNote:true},
    {term:'宝藏',pinyin:'bǎo cáng',meaning:'珍藏。',textbook:['《活板》“至今宝藏”'],note:'这里“藏”读 cáng，“宝藏”用作动词。',textbookNote:true},
    {term:'庆历',pinyin:'qìng lì',meaning:'北宋宋仁宗的年号，庆历年间为1041年至1048年。',textbook:['《活板》“庆历中，有布衣毕昇，又为活板”']},
    {term:'瀛',pinyin:'yíng',meaning:'海。',words:['东瀛','瀛洲'],alwaysExpand:true},
    {term:'砥',pinyin:'dǐ',meaning:'磨刀石。',textbook:['《活板》“字平如砥”','《白杨礼赞》“坦荡如砥”'],words:['砥砺前行'],idioms:['中流砥柱'],alwaysExpand:true},
    {term:'砺',pinyin:'lì',meaning:'磨刀石；引申为磨炼。',words:['砥砺','磨砺'],idioms:['砥砺前行']},
    {term:'炀',pinyin:'yáng',meaning:'烘烤。',textbook:['《活板》“持就火炀之”'],textbookNote:true},
    {term:'脂',pinyin:'zhī',meaning:'油脂；在“松脂”中指松树分泌的树脂。',textbook:['《活板》“其上以松脂、蜡和纸灰之类冒之”'],words:['松脂','树脂','脂肪']},
    {term:'松脂',pinyin:'sōng zhī',meaning:'松树分泌的树脂。《活板》中与蜡、纸灰等混合，用来固定字印。',textbook:['《活板》“其上以松脂、蜡和纸灰之类冒之”']},
    {term:'令',pinyin:'lìng / líng / lǐng',meaning:'多音字，须结合词语和句子判断。',textbook:['《活板》“火烧令坚”'],note:'在“火烧令坚”中读 lìng，意为“使、让”。'},
    {term:'镕',pinyin:'róng',meaning:'同“熔”，用高温使固态物质转变为液态。',textbook:['《活板》“药稍镕”“用讫再火令药镕”'],textbookNote:true},
    {term:'昇',pinyin:'shēng',meaning:'同“升”。',words:['毕昇'],note:'人名“毕昇”中的“昇”读 shēng。'},
    {term:'讫',pinyin:'qì',meaning:'完毕。',textbook:['《活板》“用讫再火令药镕”'],words:['收讫','付讫'],textbookNote:true},
    {term:'贮',pinyin:'zhù',meaning:'储存。',textbook:['《活板》“木格贮之”'],words:['贮存','贮藏']},
    {term:'拂',pinyin:'fú',meaning:'轻轻擦过或掸去。',textbook:['《活板》“以手拂之”'],words:['拂晓','春风拂面']},
    {term:'韵',pinyin:'yùn',meaning:'指韵部，韵书中把同韵的字归在一起成为一部。',textbook:['《活板》“每韵为一帖”'],words:['韵律','押韵'],textbookNote:true},
    {term:'范',pinyin:'fàn',meaning:'模子、框子。',textbook:['《活板》“置铁范乃密布字印”'],words:['模范','规范']},
    {term:'铁范',pinyin:'tiě fàn',meaning:'这里指铁制模框。',textbook:['《活板》“置铁范乃密布字印”'],note:'排版时用它限定字印排列的范围。',textbookNote:true},
    {term:'钱唇',pinyin:'qián chún',meaning:'铜钱的边缘。',textbook:['《活板》“薄如钱唇”'],textbookNote:true},
    {term:'冒',pinyin:'mào',meaning:'覆盖。',textbook:['《活板》“以松脂、蜡和纸灰之类冒之”'],textbookNote:true},
    {term:'印',pinyin:'yìn',meaning:'字印、字模。',textbook:['《活板》“每一字皆有数印”“每字有二十余印”'],note:'这里不是印章，也不是印刷次数。'},
    {term:'药',pinyin:'yào',meaning:'指上文说的松脂、蜡等的混合物。',textbook:['《活板》“药稍镕”“再火令药镕”'],note:'它受热软化，用于固定字印；再次加热又便于拆版。',textbookNote:true},
    {term:'木格',pinyin:'mù gé',meaning:'木制的格子。',textbook:['《活板》“木格贮之”'],note:'句中名词作状语，译为“用木格子储存它们”。'},
    {term:'更',pinyin:'gēng',meaning:'交替、轮流。',textbook:['《活板》“更互用之”'],note:'这里读 gēng，不读 gèng。'},
    {term:'就',pinyin:'jiù',meaning:'根据语境可表示“靠近”或“完成”。',textbook:['《活板》“持就火炀之”“瞬息可就”'],note:'“持就火炀之”中的“就”是靠近；“瞬息可就”中的“就”是完成。',textbookNote:true},
    {term:'燔',pinyin:'fán',meaning:'烧。',textbook:['《活板》“不若燔土”'],textbookNote:true},
    {term:'群从',pinyin:'qún zòng',meaning:'指堂兄弟及诸子侄。',textbook:['《活板》“其印为予群从所得”'],textbookNote:true},
    {term:'和',pinyin:'huò',meaning:'混合。',textbook:['《活板》“蜡和纸灰之类”'],note:'这里读 huò，不读 hé。',textbookNote:true},
    {term:'旋',pinyin:'xuán',meaning:'立即、随即。',textbook:['《活板》“有奇字素无备者，旋刻之”']},
    {term:'素',pinyin:'sù',meaning:'平时、向来。',textbook:['《活板》“有奇字素无备者”']},
    {term:'奇字',pinyin:'qí zì',meaning:'生僻字。',textbook:['《活板》“有奇字素无备者”'],textbookNote:true},
    {term:'更互',pinyin:'gēng hù',meaning:'交替，轮流。',textbook:['《活板》“更互用之，瞬息可就”'],textbookNote:true},
    {term:'瞬息可就',pinyin:'shùn xī kě jiù',meaning:'极短时间内就能完成。',textbook:['《活板》“更互用之，瞬息可就”']},
    {term:'字平如砥',pinyin:'zì píng rú dǐ',meaning:'（所有排在铁板上的）活字平得像磨刀石。',textbook:['《活板》“则字平如砥”'],note:'砥，磨刀石。',textbookNote:true},
    {term:'板印',pinyin:'bǎn yìn',meaning:'指雕版印刷。',textbook:['《活板》“板印书籍”'],textbookNote:true},
    {term:'板本',pinyin:'bǎn běn',meaning:'版印书籍，相对于抄本而言。',textbook:['《活板》“典籍皆为板本”'],textbookNote:true},
    {term:'布衣',pinyin:'bù yī',meaning:'平民。',textbook:['《活板》“有布衣毕昇”'],words:['布衣之交'],note:'古代平民不能穿锦绣，故称“布衣”。',textbookNote:true},
    {term:'典籍',pinyin:'diǎn jí',meaning:'重要文献或古代典章书籍。',textbook:['《活板》“五经已后，典籍皆为板本”']},
    {term:'盛',pinyin:'shèng',meaning:'大规模、盛行。',textbook:['《活板》“唐人尚未盛为之”']},
    {term:'殊',pinyin:'shū',meaning:'用在否定副词“不”“无”前面，表示否定程度达到极限，可译作“根本”“一点儿”“完全”。',textbook:['《活板》“殊不沾污”'],note:'“殊不沾污”即“根本不沾污”。',textbookNote:true},
    {term:'止',pinyin:'zhǐ',meaning:'同“只”，只是。',textbook:['《活板》“止印三二本”']},
    {term:'已后',pinyin:'yǐ hòu',meaning:'以后；“已”同“以”。',textbook:['《活板》“五经已后”'],textbookNote:true},
    {term:'帖',pinyin:'tiè',meaning:'标签；在“以纸帖之”中用作动词，意为用标签标记。',textbook:['《活板》“以纸帖之，每韵为一帖”'],note:'“每韵为一帖”中的“帖”用作名词，意为标签。',textbookNote:true},

    {term:'谪',pinyin:'zhé',meaning:'封建时代把官吏降职并调往边远地区。',textbook:['《岳阳楼记》“滕子京谪守巴陵郡”'],words:['贬谪']},
    {term:'属',pinyin:'zhǔ',meaning:'通“嘱”，嘱托。',textbook:['《岳阳楼记》“属予作文以记之”'],note:'这里读 zhǔ。'},
    {term:'霏',pinyin:'fēi',meaning:'雨、雪纷纷飘落的样子。',textbook:['《岳阳楼记》“淫雨霏霏”'],words:['烟霏云敛']},
    {term:'曜',pinyin:'yào',meaning:'光芒、照耀。',textbook:['《岳阳楼记》“日星隐曜”'],words:['曜灵']},
    {term:'樯',pinyin:'qiáng',meaning:'帆船上的桅杆。',textbook:['《岳阳楼记》“樯倾楫摧”']},
    {term:'楫',pinyin:'jí',meaning:'划船用的桨。',textbook:['《岳阳楼记》“樯倾楫摧”'],words:['舟楫']},
    {term:'汀',pinyin:'tīng',meaning:'水边平地或小洲。',textbook:['《岳阳楼记》“岸芷汀兰”'],words:['汀洲']},
    {term:'芷',pinyin:'zhǐ',meaning:'香草名。',textbook:['《岳阳楼记》“岸芷汀兰”'],words:['白芷']},
    {term:'偕',pinyin:'xié',meaning:'一起、共同。',textbook:['《岳阳楼记》“宠辱偕忘”'],words:['白头偕老']},
    {term:'觥',pinyin:'gōng',meaning:'古代酒器。',textbook:['《醉翁亭记》“觥筹交错”'],idioms:['觥筹交错']},
    {term:'伛',pinyin:'yǔ',meaning:'弯腰、曲背。',textbook:['《醉翁亭记》“伛偻提携”']},
    {term:'偻',pinyin:'lǚ',meaning:'弯曲着背。',textbook:['《醉翁亭记》“伛偻提携”'],words:['佝偻']},
    {term:'翳',pinyin:'yì',meaning:'遮蔽。',textbook:['《醉翁亭记》“树林阴翳”'],words:['阴翳']},
    {term:'颓然',pinyin:'tuí rán',meaning:'倒下的样子；文中形容醉倒。',textbook:['《醉翁亭记》“颓然乎其间者”']},

    {term:'圮',pinyin:'pǐ',meaning:'倒塌。',textbook:['《河中石兽》“山门圮于河”']},
    {term:'棹',pinyin:'zhào',meaning:'划船；也可指船桨。',textbook:['《河中石兽》“棹数小舟”']},
    {term:'曳',pinyin:'yè',meaning:'拖、拉。',textbook:['《河中石兽》“曳铁钯”'],words:['摇曳']},
    {term:'啮',pinyin:'niè',meaning:'咬；文中指水流冲刷。',textbook:['《河中石兽》“迎水处啮沙为坎穴”'],words:['啮合']},
    {term:'湮',pinyin:'yān',meaning:'埋没。',textbook:['《河中石兽》“湮于沙上”'],words:['湮没']},
    {term:'臆',pinyin:'yì',meaning:'主观推测。',textbook:['《河中石兽》“可据理臆断欤”'],words:['臆断']},
    {term:'杮',pinyin:'fèi',meaning:'削下来的木片。',textbook:['《河中石兽》“是非木杮”'],note:'“杮”不是水果“柿”。'},

    {term:'矜',pinyin:'jīn',meaning:'夸耀。',textbook:['《卖油翁》“公亦以此自矜”'],words:['自矜']},
    {term:'圃',pinyin:'pǔ',meaning:'园子。',textbook:['《卖油翁》“尝射于家圃”'],words:['花圃']},
    {term:'睨',pinyin:'nì',meaning:'斜着眼看。',textbook:['《卖油翁》“睨之久而不去”']},
    {term:'颔',pinyin:'hàn',meaning:'点头。',textbook:['《卖油翁》“但微颔之”'],words:['颔首']},
    {term:'忿',pinyin:'fèn',meaning:'愤怒。',textbook:['《卖油翁》“康肃忿然曰”'],words:['忿然']},
    {term:'酌',pinyin:'zhuó',meaning:'倒酒；文中指倒油。',textbook:['《卖油翁》“乃取一葫芦置于地，以钱覆其口，徐以杓酌油沥之”'],words:['斟酌']},
    {term:'沥',pinyin:'lì',meaning:'一滴一滴地落下。',textbook:['《卖油翁》“酌油沥之”'],words:['沥青','呕心沥血']},
    {term:'遣',pinyin:'qiǎn',meaning:'打发、送走。',textbook:['《卖油翁》“笑而遣之”'],words:['派遣']},

    {term:'亵',pinyin:'xiè',meaning:'亲近而不庄重。',textbook:['《爱莲说》“可远观而不可亵玩焉”'],words:['亵渎']},
    {term:'濯',pinyin:'zhuó',meaning:'洗涤。',textbook:['《爱莲说》“濯清涟而不妖”'],words:['洗濯']},
    {term:'涟',pinyin:'lián',meaning:'水波。',textbook:['《爱莲说》“濯清涟而不妖”'],words:['涟漪']},
    {term:'蕃',pinyin:'fán',meaning:'多。',textbook:['《爱莲说》“可爱者甚蕃”']},
    {term:'淤',pinyin:'yū',meaning:'水中沉积的泥沙。',textbook:['《爱莲说》“出淤泥而不染”'],words:['淤泥','淤塞']},
    {term:'蔓',pinyin:'màn',meaning:'生藤蔓；文中用作动词，横生藤蔓。',textbook:['《爱莲说》“不蔓不枝”'],words:['蔓延']},
    {term:'鲜',pinyin:'xiǎn',meaning:'少。',textbook:['《爱莲说》“陶后鲜有闻”'],note:'这里读 xiǎn，不读 xiān。'},

    {term:'贻',pinyin:'yí',meaning:'赠送。',textbook:['《核舟记》“尝贻余核舟一”'],words:['贻笑大方']},
    {term:'罔',pinyin:'wǎng',meaning:'无、没有。',textbook:['《核舟记》“罔不因势象形”']},
    {term:'髯',pinyin:'rán',meaning:'两腮的胡须，也泛指胡须。',textbook:['《核舟记》“中峨冠而多髯者为东坡”'],words:['美髯公']},
    {term:'袒',pinyin:'tǎn',meaning:'脱去或敞开上衣。',textbook:['《核舟记》“袒胸露乳”'],words:['袒露']},
    {term:'诎',pinyin:'qū',meaning:'弯曲；同“屈”。',textbook:['《核舟记》“诎右臂支船”']},
    {term:'篆',pinyin:'zhuàn',meaning:'篆书；也指用篆体书写。',textbook:['《核舟记》“又用篆章一”'],words:['篆书','篆刻']},

    {term:'荇',pinyin:'xìng',meaning:'水生植物。',textbook:['《记承天寺夜游》“水中藻、荇交横”'],words:['荇菜']},
    {term:'寝',pinyin:'qǐn',meaning:'睡觉。',textbook:['《记承天寺夜游》“怀民亦未寝”'],words:['就寝']},
    {term:'篁',pinyin:'huáng',meaning:'竹林。',textbook:['《小石潭记》“隔篁竹，闻水声”'],words:['篁竹']},
    {term:'冽',pinyin:'liè',meaning:'寒冷；文中形容水清凉。',textbook:['《小石潭记》“水尤清冽”'],words:['凛冽']},
    {term:'佁',pinyin:'yǐ',meaning:'静止的样子。',textbook:['《小石潭记》“佁然不动”']},
    {term:'俶',pinyin:'chù',meaning:'忽然。',textbook:['《小石潭记》“俶尔远逝”']},
    {term:'翕',pinyin:'xī',meaning:'迅疾、轻快。',textbook:['《小石潭记》“往来翕忽”'],words:['翕动']},
    {term:'怆',pinyin:'chuàng',meaning:'悲伤。',textbook:['《小石潭记》“悄怆幽邃”'],words:['悲怆']},
    {term:'邃',pinyin:'suì',meaning:'深远。',textbook:['《小石潭记》“悄怆幽邃”'],words:['深邃']},
    {term:'坻',pinyin:'chí',meaning:'水中的小块陆地。',textbook:['《小石潭记》“为坻，为屿”']},
    {term:'嵁',pinyin:'kān',meaning:'不平的岩石。',textbook:['《小石潭记》“为嵁，为岩”']},

    {term:'蒹',pinyin:'jiān',meaning:'没有长穗的芦苇。',textbook:['《蒹葭》“蒹葭苍苍”']},
    {term:'葭',pinyin:'jiā',meaning:'初生的芦苇。',textbook:['《蒹葭》“蒹葭苍苍”']},
    {term:'溯',pinyin:'sù',meaning:'逆流而上。',textbook:['《蒹葭》“溯洄从之”“溯游从之”'],words:['追溯']},
    {term:'湄',pinyin:'méi',meaning:'岸边、水与草交接的地方。',textbook:['《蒹葭》“在水之湄”']},
    {term:'跻',pinyin:'jī',meaning:'升高、登上。',textbook:['《蒹葭》“道阻且跻”']},
    {term:'涘',pinyin:'sì',meaning:'水边。',textbook:['《蒹葭》“在水之涘”']},
    {term:'沚',pinyin:'zhǐ',meaning:'水中的小块陆地。',textbook:['《蒹葭》“宛在水中沚”']},
    {term:'窈窕',pinyin:'yǎo tiǎo',meaning:'文静美好的样子。',textbook:['《关雎》“窈窕淑女”']},
    {term:'逑',pinyin:'qiú',meaning:'配偶。',textbook:['《关雎》“君子好逑”']},
    {term:'寤寐',pinyin:'wù mèi',meaning:'醒着和睡着，指日日夜夜。',textbook:['《关雎》“寤寐求之”']},
    {term:'芼',pinyin:'mào',meaning:'挑选、采摘。',textbook:['《关雎》“左右芼之”']},

    {term:'晞',pinyin:'xī',meaning:'晒干。',textbook:['《长歌行》“朝露待日晞”']},
    {term:'曦',pinyin:'xī',meaning:'日光。',textbook:['《三峡》“不见曦月”'],words:['晨曦']},
    {term:'襄',pinyin:'xiāng',meaning:'上、漫上。',textbook:['《三峡》“夏水襄陵”']},
    {term:'湍',pinyin:'tuān',meaning:'急流。',textbook:['《三峡》“素湍绿潭”'],words:['湍急']},
    {term:'巘',pinyin:'yǎn',meaning:'山峰。',textbook:['《三峡》“绝巘多生怪柏”']},
    {term:'属引',pinyin:'zhǔ yǐn',meaning:'接连不断。',textbook:['《三峡》“属引凄异”']},
    {term:'阙',pinyin:'quē',meaning:'空隙、中断。',textbook:['《三峡》“略无阙处”'],note:'这里读 quē。'},

    {term:'缥',pinyin:'piǎo',meaning:'青白色。',textbook:['《与朱元思书》“水皆缥碧”'],words:['缥碧']},
    {term:'泠',pinyin:'líng',meaning:'形容水声清越。',textbook:['《与朱元思书》“泉水激石，泠泠作响”']},
    {term:'嘤',pinyin:'yīng',meaning:'鸟鸣声。',textbook:['《与朱元思书》“好鸟相鸣，嘤嘤成韵”']},
    {term:'鸢',pinyin:'yuān',meaning:'老鹰。',textbook:['《与朱元思书》“鸢飞戾天者”'],words:['纸鸢']},
    {term:'戾',pinyin:'lì',meaning:'至、到达。',textbook:['《与朱元思书》“鸢飞戾天者”']},
    {term:'经纶',pinyin:'jīng lún',meaning:'筹划、治理。',textbook:['《与朱元思书》“经纶世务者”']},
    {term:'柯',pinyin:'kē',meaning:'树木的枝干。',textbook:['《与朱元思书》“横柯上蔽”'],words:['南柯一梦']},
    {term:'反',pinyin:'fǎn',meaning:'同“返”，返回。',textbook:['《与朱元思书》“窥谷忘反”']},

    {term:'祗',pinyin:'zhǐ',meaning:'只是。',textbook:['《马说》“祗辱于奴隶人之手”']},
    {term:'骈',pinyin:'pián',meaning:'两马并驾；文中指并列。',textbook:['《马说》“骈死于槽枥之间”'],words:['骈文']},
    {term:'槽枥',pinyin:'cáo lì',meaning:'喂牲口用的食槽。',textbook:['《马说》“骈死于槽枥之间”']},
    {term:'粟',pinyin:'sù',meaning:'泛指粮食。',textbook:['《马说》“一食或尽粟一石”'],words:['沧海一粟']},
    {term:'邪',pinyin:'yé',meaning:'表示疑问，相当于“吗”。',textbook:['《马说》“其真无马邪”'],note:'这里读 yé。'},

    {term:'俟',pinyin:'sì',meaning:'等待。',textbook:['《送东阳马生序》“俟其欣悦”']},
    {term:'叱咄',pinyin:'chì duō',meaning:'训斥、呵责。',textbook:['《送东阳马生序》“未尝稍降辞色”“或遇其叱咄”']},
    {term:'皲',pinyin:'jūn',meaning:'皮肤因寒冷干燥而裂开。',textbook:['《送东阳马生序》“足肤皲裂而不知”'],words:['皲裂']},
    {term:'箧',pinyin:'qiè',meaning:'小箱子。',textbook:['《送东阳马生序》“负箧曳屣”'],words:['书箧']},
    {term:'屣',pinyin:'xǐ',meaning:'鞋。',textbook:['《送东阳马生序》“负箧曳屣”']},
    {term:'媵',pinyin:'yìng',meaning:'古代陪嫁的人；文中指服侍的人。',textbook:['《送东阳马生序》“媵人持汤沃灌”']},
    {term:'烨',pinyin:'yè',meaning:'光彩鲜明。',textbook:['《送东阳马生序》“烨然若神人”'],words:['烨烨']},
    {term:'臭',pinyin:'xiù',meaning:'气味；“容臭”指香袋。',textbook:['《送东阳马生序》“右备容臭”'],note:'这里读 xiù。'}
  ];

  const LEXICON_MAP = new Map(RICH_LEXICON.map(item => [item.term, item]));
  const HAN_RE = /[\u3400-\u9FFF\uF900-\uFAFF]/u;

  function pinyinOf(text) {
    const dict = window.MX_HANZI_PINYIN || {};
    const chars = Array.from(text || '').filter(ch => HAN_RE.test(ch));
    if (!chars.length) return '';
    const values = chars.map(ch => dict[ch] || '').filter(Boolean);
    return values.length === chars.length ? values.map(v => v.replace(/,/g, '/')).join(' ') : '';
  }

  function extractPronunciationTarget(text) {
    const q = (text || '').trim();
    const cue = '(?:怎么读|读什么|读音|拼音|怎么念|念什么|读作)';

    // “脂怎么读”“脂字怎么读”“……的脂怎么读”：优先锁定被明确点名的单字。
    const singlePatterns = [
      new RegExp('(?:^|[\\s，,。；;：:、]|的)([\\u3400-\\u9FFF\\uF900-\\uFAFF])(?:字)?(?:的)?' + cue, 'gu'),
      new RegExp('([\\u3400-\\u9FFF\\uF900-\\uFAFF])字(?:的)?' + cue, 'gu')
    ];
    for (const re of singlePatterns) {
      const matches = Array.from(q.matchAll(re));
      if (matches.length) return matches[matches.length - 1][1];
    }

    // 带引号的内容通常就是完整提问对象，如“火烧令坚”怎么读。
    let m = q.match(new RegExp('["“「『]([\\u3400-\\u9FFF\\uF900-\\uFAFF]{1,20})["”」』]\\s*' + cue, 'u'));
    if (m) return m[1];

    // 没有分隔符时，把问句末尾、读音提示词之前的连续汉字视为完整词句。
    m = q.match(new RegExp('([\\u3400-\\u9FFF\\uF900-\\uFAFF]{1,20})(?:这个)?(?:词语|词|句子|原句)?(?:的)?' + cue + '[？?。！!\\s]*$', 'u'));
    if (m) {
      return m[1].replace(/^(?:请问|请读|这个|请告诉我)/, '');
    }
    return '';
  }

  function extractLookupTarget(text) {
    const q = (text || '').trim();

    if (isPronunciationIntent(q)) {
      const pronunciationTarget = extractPronunciationTarget(q);
      if (pronunciationTarget) return pronunciationTarget;
    }

    let m = q.match(/["“「『]([\u3400-\u9FFF\uF900-\uFAFF]{1,8})["”」』]/u);
    if (m) return m[1];
    m = q.match(/([\u3400-\u9FFF\uF900-\uFAFF])字(?:的)?(?:是什么意思|什么意思|何意|怎么解释|字义)/u);
    if (m) return m[1];
    m = q.match(/([\u3400-\u9FFF\uF900-\uFAFF]{1,8})(?:是什么意思|什么意思|何意|怎么解释|的意思)/u);
    if (m) return m[1].replace(/^(这个|请问)/, '');
    m = q.match(/([\u3400-\u9FFF\uF900-\uFAFF]{1,8}?)(?:还)?(?:在哪些课文|在哪篇课文|在其他哪些课文|在哪里出现|哪里出现|有什么成语|有哪些成语|有哪些词语|能组什么词|的成语|的词语)/u);
    if (m) return m[1];
    const compact = q.replace(/[“”「」『』\"'‘’\s，。！？、；：,.!?;:]/g, '');
    if (compact.length <= 8 && Array.from(compact).every(ch => HAN_RE.test(ch))) return compact;
    return '';
  }

  function formatLexiconAnswer(item, question) {
    const q = question || '';
    const asksPronunciation = isPronunciationIntent(q);
    const wantsMeaning = /(是什么意思|什么意思|何意|怎么解释|字义|词义)/.test(q);
    const wantsLinks = /(课文|出现|成语|词语|组词|哪里学过|拓展|联系)/.test(q);

    // 明确只问读音时，先直接回答读音，不擅自展开成整段知识。
    if (asksPronunciation && !wantsMeaning && !wantsLinks && item.term !== '令') {
      return `${item.term}（${item.pinyin}）。`;
    }

    let answer = `${item.term}${item.pinyin ? `（${item.pinyin}）` : ''}：${item.meaning}`;
    const extras = [];
    if (item.note) extras.push(item.note);
    if (item.alwaysExpand || wantsLinks) {
      if (item.textbook?.length) extras.push(`课文关联：${item.textbook.join('；')}。`);
      if (item.words?.length) extras.push(`常见词语：${item.words.join('、')}。`);
      if (item.idioms?.length) extras.push(`常见成语：${item.idioms.join('、')}。`);
    } else if (item.words?.length && item.term === '瀛') {
      extras.push(`常见于“${item.words.join('”“')}”。`);
    }
    return answer + (extras.length ? ' ' + extras.join(' ') : '');
  }

  let lastKnowledgeTopic = '';
  let lastPronunciationTarget = '';
  let lastHistoryTopic = '';

  function isBareSourcePhrase(text) {
    const q = (text || '').trim();
    if (!q || q.length < 4 || q.length > 45) return false;
    if (/[？?！!]/.test(q)) return false;
    if (/(怎么|什么|为何|为什么|意思|解释|翻译|读音|怎么读|作用|体现|分析|请问)/.test(q)) return false;
    return /[其之以而乃则者于]/.test(q);
  }

  function contextualFollowupForTarget(target, sourceText) {
    const sentence = (sourceText || '').trim().replace(/[？?。！!]+$/g, '');
    if (!target || !sentence.includes(target)) return '';

    if (target === '脂' && /松脂/.test(sentence)) {
      return '“脂”读 zhī。“松脂”读 sōng zhī，指松树分泌的树脂。';
    }
    if (target === '令' && /火烧令坚/.test(sentence)) {
      lastKnowledgeTopic = '令的其他读音';
      return '“火烧令坚”中的“令”读 lìng，解释为“使、让”；整句意思是“用火烧使它坚硬”。你还想知道“令”的其他读音及用法吗？';
    }
    if (target === '和' && /蜡和纸灰/.test(sentence)) {
      return '“蜡和纸灰”中的“和”读 huò，表示把蜡与纸灰混合。';
    }
    const item = LEXICON_MAP.get(target);
    const py = item?.pinyin || pinyinOf(target);
    if (!py) return '';
    const meaning = item?.meaning ? `这里可理解为：${item.meaning}` : '';
    return `“${sentence}”中的“${target}”读 ${py}。${meaning}`.trim();
  }

  const CONTEXT_PRONUNCIATION = [
    {
      phrase:'火烧令坚',
      pinyin:'huǒ shāo lìng jiān',
      answer:'“火烧令坚”读作：huǒ shāo lìng jiān。这里“令”读 lìng，解释为“使、让”；整句意思是“用火烧使它坚硬”。'
    },
    {
      phrase:'用讫再火令药镕',
      pinyin:'yòng qì zài huǒ lìng yào róng',
      answer:'“用讫再火令药镕”读作：yòng qì zài huǒ lìng yào róng。这里“令”读 lìng，解释为“使、让”；整句意思是“印刷完毕后，再用火烘烤，使黏合材料熔化”。'
    }
  ];

  function contextualPronunciationAnswer(target, question) {
    const normalized = (target || '').replace(/[“”「」『』"'\s，。！？、；：,.!?;:]/g, '');
    const hit = CONTEXT_PRONUNCIATION.find(item =>
      normalized.includes(item.phrase) ||
      (normalized.length >= 4 && item.phrase.includes(normalized))
    );
    if (hit && /(怎么读|读什么|读音|拼音|怎么念|念什么|读作)/.test(question || '')) {
      return hit.answer;
    }
    return '';
  }

  function polyphonicAnswer(target, question) {
    if (target !== '令') return '';
    const q = question || '';
    if (/(怎么读|读什么|读音|拼音|怎么念|念什么|读作|多音字)/.test(q)) {
      lastKnowledgeTopic = '令的其他读音';
      return '“令”是多音字，常见读音有 lìng、líng、lǐng。本文“火烧令坚”中的“令”读 lìng，解释为“使、让”；整句意思是“用火烧使它坚硬”。你还想知道“令”的其他读音及用法吗？';
    }
    return '';
  }

  function genericPronunciationAnswer(target) {
    const py = pinyinOf(target);
    if (!py) return '';
    if (Array.from(target).length === 1) return `${target}（${py}）。`;
    return `${target}读作：${py}。`;
  }

  function isPronunciationIntent(text) {
    return /怎么读|读什么|读音|拼音|怎么念|念什么|读作/.test(text || '');
  }

  function isLexicalIntent(text) {
    const q = (text || '').trim();
    if (/怎么读|读什么|读音|拼音|怎么念|念什么|是什么意思|什么意思|何意|怎么解释|字义|词义|组词|成语|哪些课文|哪篇课文|哪里出现|在哪.*出现/.test(q)) return true;
    const compact = q.replace(/[“”「」『』"'‘’\s，。！？、；：,.!?;:]/g, '');
    return compact.length > 0 && compact.length <= 2 && Array.from(compact).every(ch => HAN_RE.test(ch));
  }

  const TEXTBOOK_NOTE_TERMS = new Set([
    '活板','板印','已','已后','板本','布衣','钱唇','坚','和','冒','铁范','就','炀','药','镕',
    '字平如砥','已自','具','更互','帖','韵','奇字','木理','燔','讫','殊','群从','宝藏'
  ]);
  let textbookNoteLeadIndex = 0;

  function textbookNoteLead() {
    const leads = [
      '这个词正藏在课下注释里，小生陪你核对一下：',
      '先看看书页旁的小注释，它已经给了我们线索：',
      '课本在这里递来了一张“小纸条”：',
      '这处不用猜太久，课下注释写得很清楚：'
    ];
    const lead = leads[textbookNoteLeadIndex % leads.length];
    textbookNoteLeadIndex += 1;
    return lead;
  }

  function textbookNoteAnswer(text) {
    const q = (text || '').trim();
    const hasNoteCue = /怎么读|读音|拼音|怎么念|是什么意思|是什么|什么意思|何意|怎么解释|字义|词义|指什么|的意思/.test(q);
    if (!isLexicalIntent(q) && !hasNoteCue) return '';
    let target = extractLookupTarget(q);
    if (!target || !TEXTBOOK_NOTE_TERMS.has(target)) {
      target = Array.from(TEXTBOOK_NOTE_TERMS)
        .filter(term => q.includes(term))
        .sort((a,b) => b.length - a.length)[0] || '';
    }
    if (!target || !TEXTBOOK_NOTE_TERMS.has(target)) return '';
    const item = LEXICON_MAP.get(target);
    if (!item) return '';

    if (isPronunciationIntent(q)) {
      const contextual = contextualPronunciationAnswer(target, q);
      if (contextual) return `${textbookNoteLead()}${contextual}`;
      const polyphonic = polyphonicAnswer(target, q);
      if (polyphonic) return `${textbookNoteLead()}${polyphonic}`;
      return `${textbookNoteLead()}${target}（${item.pinyin}）。`;
    }

    let meaning = item.meaning;
    let note = item.note || '';
    if (target === '就') {
      if (/持就火|就火炀/.test(q)) { meaning = '靠近。'; note = '“持就火炀之”是拿着铁板靠近火去烘烤。'; }
      else if (/瞬息可就/.test(q)) { meaning = '完成。'; note = '“瞬息可就”是极短时间内就能完成。'; }
    }
    if (target === '已') {
      if (/已自/.test(q)) { meaning = '已经。'; note = '“一板已自布字”中的“已自”就是“已经”。'; }
      else { meaning = '同“以”。'; note = '见“五经已后”，即“五经以后”。'; }
    }
    if (target === '帖') {
      if (/以纸帖之/.test(q)) { meaning = '用标签标记。'; note = '这里“帖”用作动词。'; }
      else if (/每韵为一帖/.test(q)) { meaning = '标签。'; note = '这里“帖”用作名词。'; }
    }
    return `${textbookNoteLead()}“${target}”${item.pinyin ? `读作 ${item.pinyin}，` : ''}${meaning}${note ? ` ${note}` : ''}`;
  }

  function preciseAnswer(text) {
    const target = extractLookupTarget(text);
    if (!target) return '';

    // 原文短语优先按具体语境判断，不能把完整句子机械拆成“可能有多音字”。
    const contextual = contextualPronunciationAnswer(target, text);
    if (contextual) return contextual;

    // 多音字先给出常见读音，再明确本文语境中的读音、词义和句意。
    const polyphonic = polyphonicAnswer(target, text);
    if (polyphonic) return polyphonic;

    const direct = LEXICON_MAP.get(target);
    if (direct) return formatLexiconAnswer(direct, text);

    const known = Array.from(target)
      .map(ch => LEXICON_MAP.get(ch))
      .filter(Boolean);
    if (known.length && known.length === Array.from(target).length) {
      return known.map(item => formatLexiconAnswer(item, text)).join(' ');
    }

    // 只有明确询问读音时，才使用离线拼音表兜底；内容问题不再误判成逐字注音。
    return isPronunciationIntent(text) ? genericPronunciationAnswer(target) : '';
  }



  // ===================== 课文精读与高频迷惑题 =====================
  // 这一层只处理“问题指向非常明确”的提问，优先级高于普通字词联想。
  // 目的：学生问读音就答读音，问区别就答区别，问原因就解释原因，不被句中其他关键词带偏。
  const LESSON_INTENT_QA = [
    {
      p:[/字平如砥.*(?:砥.*(?:是什么|什么意思)|为什么.*(?:平|按平)|非要.*平)/,/砥.*(?:到底|究竟)?(?:是什么|什么意思).*(?:为什么|为何).*(?:平|平整)/],
      a:'“砥”指细磨刀石。“字平如砥”是说排版后所有字印的上表面要像磨刀石一样平整。印刷时要在字面上着墨、覆纸并施压；如果字面高低不一，高处容易墨重，低处可能印不清，所以必须按平，才能让整页字迹清楚、均匀。这也说明毕昇的排版工艺很精细。'
    },
    {
      p:[/为什么.*(?:字印|活字|字面).*(?:平|平整)|为什么.*平板.*按|按其面.*(?:为什么|作用)|字平如砥.*为什么/],
      a:'因为单个字印逐个排入铁范后，高低可能略有差异。趁“药”稍微熔化时用平板按压，可以让所有字面处在同一平面；这样着墨和受压才均匀，印出的文字不会有的过黑、有的模糊。'
    },
    {
      p:[/每一字皆有数印.*(?:印.*(?:是什么|什么意思)|印章|次数)|每字有二十余印.*(?:印.*(?:是什么|什么意思)|印章|次数)|[“\"「『]?数印[”\"」』]?(?:中|里|里面)?的?[“\"「『]?印[”\"」』]?(?:是|指|表示)?(?:什么|什么意思)?/],
      a:'这里的“印”指字印、字模，不是印章，也不是印刷次数。“每一字皆有数印”就是每个字都准备好几个字模；“之”“也”等常用字还准备二十多个，以免同一版里重复出现时不够用。'
    },
    {
      p:[/火烧令坚.*持就火炀之.*(?:不同|区别|一样吗)|持就火炀之.*火烧令坚.*(?:不同|区别|一样吗)|两个.*火.*(?:不同|区别)/],
      a:'两处都用火，但目的不同。“火烧令坚”发生在制字阶段，是把刻好的胶泥字烧硬，属于字印的成型处理；“持就火炀之”发生在排版阶段，是把铁板靠近火烘烤，使松脂、蜡和纸灰等混合材料稍微熔化，从而固定并按平字印。可以记成：前者“烧硬字印”，后者“烤软黏合材料”。'
    },
    {
      p:[/持就火炀之.*炀.*(?:怎么读|读什么|读音|为什么.*读错)|炀.*(?:到底|究竟).*(?:怎么读|读什么|读音)|炀.*为什么.*(?:读错|误读)/],
      a:'“炀”读 yáng，文中意思是烘烤。“持就火炀之”就是拿着铁板靠近火去烘烤，使黏合材料稍微熔化。它不读 yàng，也不是“烫”；容易读错，是因为字形里有“火”旁，学生常凭形旁误猜读音。'
    },
    {
      p:[/更互用之.*(?:更.*怎么读|更.*读音).*(?:瞬息可就.*就|就.*怎么读)|更.*瞬息可就.*读音|更和就.*(?:怎么读|读音|意思)/],
      a:'“更互用之”的“更”读 gēng，意思是交替、轮流；“瞬息可就”的“就”读 jiù，意思是完成。还要注意，“持就火炀之”的“就”也读 jiù，但意思是靠近。同一个“就”，在课文里有“靠近”和“完成”两个意思。'
    },
    {
      p:[/药.*(?:是中药|是不是中药|是什么).*(?:帖|写错|通假)|帖.*(?:是不是写错|怎么读|读音).*(?:药|中药)|药和帖/],
      a:'这里有两个容易混淆的点。“药”不是中药，而是松脂、蜡和纸灰等组成的混合材料，用来固定字印；“帖”也没有写错。教材中“以纸帖之”和“每韵为一帖”的“帖”都读 tiè：前一个用作动词，意为用标签标记；后一个用作名词，意为标签。'
    },
    {
      p:[/文中.*药.*(?:是什么|是不是中药)|药.*(?:是中药吗|是什么)|药稍镕.*药/],
      a:'文中的“药”不是治病的药，而是松脂、蜡和纸灰等组成的混合材料。加热时它会软化，便于固定并按平字印；印刷结束后再次加热，它又能软化，便于拆下字印。'
    },
    {
      p:[/以纸帖之.*(?:帖.*怎么读|帖.*意思|是不是写错)|每韵为一帖.*(?:帖.*怎么读|帖.*意思)|两处.*帖/],
      a:'教材中这两处“帖”都读 tiè。“以纸帖之”里的“帖”用作动词，意思是用标签标记；“每韵为一帖”里的“帖”用作名词，意思是标签。这里不需要改成“贴”。'
    },
    {
      p:[/[“"「『]?冒[”"」』]?(?:字)?(?:到底|究竟)?(?:是什么意思|什么意思|是冒烟吗|是冒险吗|的古义|的现代义)|(?:句中|文中|这里|里面|里的)[“"「『]?冒[”"」』]?.*(?:意思|冒烟|冒险)/],
      a:'这里的“冒”不是冒烟，也不是冒险，而是“覆盖”的意思。“其上以松脂、蜡和纸灰之类冒之”就是在铁板上用这些混合材料覆盖一层。'
    },
    {
      p:[/布衣毕昇.*(?:布衣.*什么意思|穿布衣服|身份)|有布衣毕昇.*(?:布衣|怎么翻译)/],
      a:'“布衣”在古文中指平民，不是简单翻译成“穿布衣服的人”。“有布衣毕昇”应译为“有一个叫毕昇的平民”。这个称呼交代了毕昇没有官职，也突出了普通劳动者的创造智慧。'
    },
    {
      p:[/松脂.*蜡.*纸灰.*和.*(?:怎么读|读音|意思)|句子.*和.*(?:读什么|什么意思)|蜡和纸灰.*和/],
      a:'这里的“和”读 huò，意思是混合。“松脂、蜡和纸灰之类”是说把松脂、蜡同纸灰等混合起来，作为排版时固定字印的材料；不是表示“和平、以及”的 hé。'
    },
    {
      p:[/木格贮之.*(?:木格.*名词|状语|怎么翻译)|木格.*(?:名词作状语|翻译)|为什么翻译成用木格/],
      a:'“木格”本来是名词，在“木格贮之”中放在动词“贮”前，表示使用的工具，所以是名词作状语。应译为“用木格子储存这些字印”，不能译成“木格子储存它们”。同类用法还有“火烧令坚”的“火”和“板印书籍”的“板”。'
    },
    {
      p:[/课文.*(?:好几次|多个).*为.*(?:一次讲清|意思|用法|怎么读)/,/又为活板.*每字为一印.*(?:怎么理解|为字)/,/为字.*(?:意思|用法|怎么读)/,/几个“?为”?字.*(?:怎么解释|怎么读)/,/其印为予群从所得.*(?:中的为|为字).*(?:什么意思|怎么解释|用法|读音)/],
      a:'《活板》里的“为”都读 wéi，但意义要看语境：①“又为活板”——发明、制作；②“每字为一印”——做成；③“满铁范为一板”——成为；④“不以木为之者”——制作；⑤“其印为予群从所得”——被，是“为……所……”被动结构。不要只背一个意思，要看它在句中的作用。'
    },
    {
      p:[/为什么不用木头.*(?:刻字|做活字)|不以木为之.*(?:为什么|原因)|木活字.*课文.*原因/],
      a:'课文给出两个直接原因：一是木材纹理有疏有密，沾水后容易高低不平；二是木字容易与“药”粘连，拆版时不容易取下。胶泥字烧硬后，用完再次加热使“药”熔化，用手一拂，字印就能脱落，所以在这套工艺中更合适。'
    },
    {
      p:[/松脂.*蜡.*纸灰.*(?:各自|分别).*(?:作用|干什么)|为什么.*松脂.*蜡.*纸灰.*混|只放蜡.*(?:行吗|可以吗)|为什么不用胶水/],
      a:'课文能确定的是：松脂、蜡和纸灰等构成可受热软化的混合材料，用来固定字印，之后还能再次加热拆版。至于三种材料各自承担“流动、黏结、隔离”等具体分工，原文没有逐项说明，可以作为工艺推测，但不应当作课文明确结论。现代胶水也不是课文讨论对象；这套材料的关键优势是可加热软化、冷却固定、再加热拆开。'
    },
    {
      p:[/标题.*活板.*(?:哪句话|最能体现|为什么不叫泥板|为什么叫活板)|为什么.*不写.*泥板|整篇.*活.*体现/],
      a:'题目强调“活”，不是强调材料。“活”体现在：单个字印可以移动和替换，版面可以重新组合，常用字可多备，生僻字可临时刻，两块铁板可交替使用，印完还能拆下归类再用。最集中体现效率的是“更互用之，瞬息可就”，但“活”的核心贯穿制字、排版、使用和拆版全过程。叫“泥板”只说明材料，不能概括这项技术的灵活性。'
    },
    {
      p:[/为什么.*活字印刷.*没有.*(?:全面取代|取代).*雕版|宋朝.*活字.*雕版.*并存|活字.*后来.*(?:失传|消失)/],
      a:'活字印刷并没有简单“失传”，而是长期与雕版并存。汉字字数多，制字、检字、排版和归类管理复杂；少量印刷时，排版准备未必划算；而成熟雕版适合长期反复印同一部书。因此，两种技术各有适用场景，后世还继续发展出木活字和金属活字。'
    },
    {
      p:[/为什么不用.*(?:铁活字|铜活字|金属活字)|铁不是更结实|泥活字.*金属活字.*为什么/],
      a:'《活板》只直接解释了为什么不用木头，没有说明为什么不用铁或铜。结合当时条件可以推测：胶泥便宜、易刻、易快速烧成，适合大量制作单字；金属活字需要更复杂的铸造、刻制和字库管理。后世确实出现了金属活字，所以不能说金属一定不能印，而应说毕昇在当时选择了更容易实现的胶泥方案。'
    },
    {
      p:[/为什么.*先.*冒.*再.*(?:放字|排字)|第一步.*不是.*放字|先设铁板.*顺序.*为什么/],
      a:'先在铁板上铺好可受热软化的材料，再放铁范、排字，能够让每个字印的底部进入同一固定层；随后加热、按平，就能把字印稳稳固定并保持同一高度。这个顺序体现了“先准备固定层，再排列字印”的工艺逻辑。'
    },
    {
      p:[/持就火炀之.*以手拂之.*(?:同一人|必须.*同一个人)|烘烤.*推平.*同一人/],
      a:'课文没有说这两步必须由同一个人完成，因此不能把“同一人操作”当作原文结论。可以合理理解为这些操作对火候和时机有要求，但是否由同一位熟手连续完成，属于工艺推测，回答课文题时应区分“原文明确说明”和“根据工艺作出的推想”。'
    },
    {
      p:[/只印一本.*(?:论语|书).*(?:划算|简易)|印一本.*活板.*(?:划算|合适)|若止印三二本.*(?:说明|商业|成本)/],
      a:'只印一本通常不划算。课文直接说“若止印三二本，未为简易；若印数十百千本，则极为神速”。原因是活字印刷有检字、排版、固定版面等前期工作，印量很少时这些准备成本占比高；版面排好后连续印很多本，批量优势才明显。'
    },
    {
      p:[/拆版之后.*(?:活字|字印).*(?:怎么处理|会不会乱|放哪里)|用过的.*字印.*(?:归还|收纳|分类)|每韵为一帖.*为什么/],
      a:'拆版后，字印要按韵部分类，用纸标签标明，再放进木格中储存。这样取字和归字都有固定位置，不会混乱。课文明确写的是“以纸帖之，每韵为一帖，木格贮之”；至于清洗等具体操作，原文没有展开，不宜擅自补成确定步骤。'
    },
    {
      p:[/沈括.*为什么.*写.*最后一句|最后一句.*(?:为什么|作用|能删吗)|昇死.*至今宝藏.*(?:作用|意义)/],
      a:'最后一句交代了毕昇字印的去向：毕昇去世后，字印被沈括同宗的晚辈得到并保存。它把技术记载同实物传承线索联系起来，增强了文章的史料性和可信度，也使全文收束完整。原文没有明说沈括一定“亲眼见过”，所以不宜把这一点说得过满。'
    },
    {
      p:[/活字印刷.*激光打印机.*(?:共同点|一样吗|联系)|毕昇.*打印机.*原理|古今对比.*打印/],
      a:'可以作类比，但原理并不相同。共同点是都要先形成版面信息，再把文字转移到纸上；不同点是活字印刷用可移动的实体字印接触纸张，一次排版后批量印同样内容，而激光打印机用电子成像和墨粉，每一页都能即时改变。这个类比有助于理解“排版—成像—转印”，不能说两者机械原理相同。'
    }
  ];

  function lessonIntentAnswer(text) {
    const q = (text || '').trim();
    for (const item of LESSON_INTENT_QA) {
      if (item.p.some(re => re.test(q))) return item.a;
    }
    return '';
  }

  const CONTENT_QA = [
    {
      p:[/火烧令坚.*(?:什么意思|意思|解释|翻译|怎么理解)|(?:什么意思|意思|解释|翻译|怎么理解).*火烧令坚/],
      a:'“火烧令坚”的意思是“用火烧，使它坚硬”。“火”是名词作状语，解释为“用火”；“令”读 lìng，解释为“使、让”；“坚”是坚硬。'
    },
    {
      p:[/六道工序|六个工序|工序.*(?:是什么|有哪些|哪六|顺序|流程|排序)/],
      a:'活字印刷的六道工序是：刻字 → 设板 → 排版 → 炀板 → 印刷 → 拆板。刻字是制作单个字印；设板是在铁板上铺松脂、蜡和纸灰等黏合材料；排版是把字印密布在铁范内；炀板是靠火烘烤使黏合材料稍熔，再把字面压平；印刷是上墨覆纸；拆板是再次加热并拂下字印，分类收存以便复用。'
    },
    {
      p:[/活字.*活.*(?:哪里|在哪|体现|表现|为什么)|[“\"「『]?活[”\"」』]?(?:字)?(?:体现|表现)?(?:在)?哪里|为什么叫活板|活板.*活/],
      a:'“活”不是指字会动，而是指整套技术可以灵活组合和反复使用：每字一印，单字可换；按需排版，版面可变；常用字有多个字印，数量可调；没有的生僻字可以随时刻制；两块铁板交替工作；印完后字印能拆下、分类保存并再次使用。核心就是“单字可拆、版面可组、字印可换、材料可复用”。'
    },
    {
      p:[/为什么.*两块铁板|二铁板.*作用|两块铁板.*作用|更互用之.*为什么/],
      a:'准备两块铁板，是为了让“印刷”和“排版”同时进行：一块正在印，另一块提前排好；前一块印完，后一块立即接上。这样减少等待时间，所以原文说“更互用之，瞬息可就”。'
    },
    {
      p:[/为什么.*每字.*数印|常用字.*二十余印|一个字.*多个字印|每一字皆有数印/],
      a:'因为同一版中可能多次出现同一个字。每个字预备多个字印，常用字甚至准备二十多个，排版时就不会因字印不够而停下来重刻。'
    },
    {
      p:[/为什么.*按韵|每韵为一帖.*作用|木格贮之.*作用|如何分类.*字印/],
      a:'按韵分类、贴标签并放入木格，是为了让大量字印能够快速查找和归位。这相当于建立了一套分类索引，能提高取字、排版和收字的效率。'
    },
    {
      p:[/文章.*说明顺序|说明顺序是什么|按什么顺序.*说明|写作顺序/],
      a:'文章先简述雕版印刷的发展，再介绍毕昇发明活字印刷；主体部分主要按照工艺流程说明制字、设板、排版、炀板、印刷和拆板，同时补充字印储存、生僻字制作等细节。整体是“历史概述＋工序顺序＋补充说明”。'
    },
    {
      p:[/说明方法|用了哪些说明方法|薄如钱唇.*说明方法|字平如砥.*说明方法/],
      a:'文章常用的说明方法有：打比方，如“薄如钱唇”“字平如砥”，把厚薄和平整程度写得具体；列数字，如“三二本”“数十百千本”“二十余印”，说明数量和效率；作比较，如少量印刷与大量印刷的效率对比，突出活字印刷批量印刷的优势。'
    },
    {
      p:[/文章主旨|中心意思|主要内容|课文写了什么|活板.*主旨/],
      a:'《活板》详细记录了毕昇活字印刷术的材料、工序、效率和字印管理方法，突出它灵活、高效、可拆换、可重复使用的特点，也体现了沈括重观察、重实证、记录严谨的科学精神。'
    },
    {
      p:[/活字印刷.*优点|活板.*优点|技术特点|简便.*神速|为什么高效/],
      a:'活字印刷的主要优点是：字印可拆换，排版灵活；字印能重复使用，节省材料；生僻字可以临时刻制；两块铁板交替作业，提高效率；印数越多，批量优势越明显。'
    },
    {
      p:[/雕版.*活字.*区别|活字印刷和雕版印刷|为什么比雕版灵活/],
      a:'雕版印刷是一页文字刻成一整块版，改一个字往往要重刻整版；活字印刷把文字拆成一个个独立字印，可以按内容重新排列、替换并重复使用。因此，活字印刷更适合内容变化和批量印刷。'
    },
    {
      p:[/药是什么|文中.*药.*什么|松脂.*蜡.*纸灰.*作用|黏合材料.*作用/],
      a:'文中的“药”不是药物，而是松脂、蜡和纸灰等组成的混合材料。它受热会软化，用来固定和按平字印；印刷结束后再次加热，又便于拆下字印。原文没有逐项说明三种材料各自的功能。'
    },
    {
      p:[/铁范.*作用|为什么放铁范|铁模子.*作用/],
      a:'铁范就是铁制的框。它限定排版范围，让字印能够紧密、整齐地排列在铁板上，防止版面松散或移位。'
    },
    {
      p:[/为什么.*草火|用草火烧.*为什么|旋刻之.*草火/],
      a:'生僻字临时刻好后用草火烧，是因为草火易得、起火快，适合快速把少量胶泥字印烧硬，所以原文说“瞬息可成”。'
    },
    {
      p:[/为什么.*字平如砥|平板按其面.*作用|按平.*作用/],
      a:'字印是一个个单独排进去的，高低可能不完全一致。趁黏合材料稍熔时用平板按压，可以让所有字面处在同一平面，印出来的文字才会清楚、均匀。'
    },
    {
      p:[/为什么.*印数越多|数十百千本.*神速|未为简易.*神速/],
      a:'活字印刷前期要刻字、排版，印两三本时准备工作所占时间较多；一旦版面排好，就能连续印刷，所以印几十、几百、上千本时，平均到每一本的时间大幅减少，批量优势就显现出来。'
    },
    {
      p:[/科学精神|沈括.*精神|课文.*科学性|语言特点/],
      a:'文章体现了实证、精确和有条理的科学精神：材料写得具体，步骤写得清楚，数量和效率有比较，字印的制作、使用、储存和拆卸都交代完整。语言简洁，却能让读者据此理解技术原理。'
    },
    {
      p:[/模块化|现代意义|和现代技术.*联系|活字.*模块/],
      a:'活字印刷可以理解为早期的“模块化”：每个字印是独立模块，能按需组合、替换和复用。这与现代印刷字模、机械零件、积木和程序模块的思路相通。'
    },
    {
      p:[/为什么写.*毕昇.*布衣|布衣毕昇.*作用|平民.*发明/],
      a:'写“布衣毕昇”既交代了发明者身份，也突出这项重大技术创新来自一位普通劳动者，表现了民间智慧和实践创造力。'
    },
    {
      p:[/题目为什么叫.*活板|活板还是活版|板和版/],
      a:'“活板”中的“板”在古代可通“版”，指印刷的版。题目强调的是由一个个可拆换字印组成的活字版，所以教材沿用原文写作“活板”。'
    }
  ];

  function contentAnswer(text) {
    for (const item of CONTENT_QA) {
      if (item.p.some(re => re.test(text))) return item.a;
    }
    return '';
  }


  // ===================== 人物、著作、技术与时代知识库 =====================
  // 先判断学生到底在问“谁、什么书、什么技术、什么时代”，再给对应层级的答案。
  // 顺序从具体辨析到概括介绍，避免只看到一个关键词就答一大段无关内容。
  const HISTORY_QA = [
    {
      topic:'沈括与毕昇',
      p:[/沈括.*(?:发明|创造).*活字印刷|活字印刷.*(?:是不是|是否).*沈括.*(?:发明|创造)|沈括是不是发明人/],
      a:'不是。活字印刷术的发明者是北宋平民工匠毕昇；沈括的贡献是把毕昇的泥活字制作、排版、印刷和拆版方法详细记录在《梦溪笔谈》中。可以记成：毕昇发明，沈括记录。'
    },
    {
      topic:'沈括与毕昇',
      p:[/毕昇.*沈括.*(?:关系|区别)|沈括.*毕昇.*(?:关系|区别)|毕昇和沈括.*(?:什么关系|关系是什么)|沈括和毕昇.*(?:什么关系|关系是什么)/],
      a:'毕昇是泥活字印刷术的发明者，沈括是这项技术的重要记录者。可以概括为“毕昇发明，沈括记录”。现存史料不能证明两人一定见过面，所以不能把他们说成师徒或合作伙伴。'
    },
    {
      topic:'沈括与毕昇',
      p:[/谁.*(?:记录|记载).*毕昇|毕昇.*(?:由谁|谁).*记录|谁把.*活字印刷.*记录|为什么.*知道.*毕昇|沈括.*(?:认识|见过).*毕昇|沈括和毕昇.*(?:认识|见过)|毕昇和沈括.*(?:认识|见过)/],
      a:'现存最重要的早期文字记录来自沈括《梦溪笔谈》。沈括把毕昇的技术过程写得很具体，但现有史料不能证明沈括与毕昇一定见过面，所以不能把推测当成事实。'
    },
    {
      topic:'沈括',
      p:[/沈括是谁|介绍(?:一下)?沈括|沈括.*简介|作者沈括|^作者是谁[？?。！!]*$|《?活板》?的作者是谁|《?活板》?是谁写的|谁写的《?活板》?/],
      a:'沈括（1031—1095），字存中，北宋钱塘人，是科学家、政治家，也是《梦溪笔谈》的作者。他长期关注天文、历法、数学、地理、工程和工艺技术。《活板》中关于毕昇泥活字的记录，就是他重视观察和实证的一个例子。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:哪个|什么)朝代|沈括.*(?:生活|处于|所处).*时代|沈括是.*代人/],
      a:'沈括生活在北宋，主要活动于11世纪。他与毕昇同属宋代人物，但毕昇的活字发明在庆历年间，时间早于沈括晚年编写《梦溪笔谈》。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:字什么|字是|字号|号什么|为什么叫梦溪)/],
      a:'沈括字存中，晚年常称“梦溪丈人”。“梦溪”与他晚年居住的梦溪园有关，《梦溪笔谈》的书名也由此而来。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:哪里人|哪儿人|籍贯|出生地)/],
      a:'教材通常介绍沈括为钱塘人，也就是今天浙江杭州一带。回答课内文学常识时，写“北宋钱塘人，字存中”即可。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:身份|职业|是干什么的|做什么的|当过什么官)/],
      a:'沈括既是北宋官员、政治家，也是研究范围很广的科学家。他做过地方官和中央官员，还参与天文历法、水利工程、地图测绘、军事与外交等事务。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:成就|贡献|研究领域|研究什么|擅长什么|为什么是科学家)/],
      a:'沈括的研究涉及天文历法、数学、地理地质、物理现象、医药和工程技术等。他善于从实际观察出发解释问题，例如记录磁针并非总指正南的现象，也详细保存了毕昇活字印刷的技术过程。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:作品|著作|写过什么|代表作)/],
      a:'沈括最著名的著作是《梦溪笔谈》。他还写过历法、地图、医药等方面的著作，但很多作品后来散失；中学阶段重点掌握《梦溪笔谈》即可。'
    },
    {
      topic:'沈括',
      p:[/沈括.*(?:科学精神|精神品质|治学态度)|为什么说沈括.*(?:严谨|求实|实证)/],
      a:'沈括的科学精神主要体现在：重视亲自观察，愿意记录实验和工艺细节；不只写结论，还说明材料、步骤和现象；遇到不能解释的问题，也不随意编造。《活板》的叙述就很具体、可验证。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?是什么(?:书)?|介绍(?:一下)?《?梦溪笔谈》?|梦溪笔谈.*简介/],
      a:'《梦溪笔谈》是北宋沈括撰写的综合性笔记体著作，大约成书于11世纪后期。它记录自然现象、科学技术、历史制度、文学艺术和社会见闻等内容。《活板》就是其中关于工艺技术的一则重要记录。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?.*(?:作者|谁写|谁著)|谁写.*《?梦溪笔谈》?/],
      a:'《梦溪笔谈》的作者是北宋沈括。注意：沈括是活字印刷术的记录者，不是发明者；发明泥活字的是毕昇。'
    },
    {
      topic:'梦溪笔谈',
      p:[/为什么叫《?梦溪笔谈》?|《?梦溪笔谈》?.*(?:为什么叫|为何叫|书名|名字).*(?:由来|意思|这个名字)?|梦溪.*什么意思/],
      a:'“梦溪”来自沈括晚年居住的梦溪园；“笔谈”可以理解为随笔式的记录和谈论。因此，《梦溪笔谈》就是沈括在梦溪园整理、写下的见闻与思考。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?.*(?:什么时候|哪一年|何时).*(?:写|成书|完成)|梦溪笔谈.*成书时间/],
      a:'《梦溪笔谈》大约成书于11世纪后期，常用的介绍是1088年前后。对中学生来说，更重要的是记住它是北宋沈括晚年的著作。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?.*(?:体裁|类型|属于什么|是什么体|是不是小说|是小说吗|是不是百科全书|是百科全书吗)/],
      a:'《梦溪笔谈》属于笔记体著作，不是按一个连续故事写成的小说。它由许多相对独立的条目组成，记录知识、见闻、考察和思考，具有综合性和百科性；把它称为“百科全书式著作”是形容内容广博，并不等于现代按学科编排的百科全书。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?.*(?:内容|写了什么|记录什么|包括什么|讲什么)/],
      a:'《梦溪笔谈》的内容很广，包括天文、历法、数学、地理、物理现象、医药、工程技术、历史制度、文学艺术和社会见闻等。《活板》重点记录的是毕昇的泥活字印刷术。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?.*(?:多少卷|几卷|卷数|多少篇|多少条)/],
      a:'通行本通常合计30卷，其中《笔谈》26卷、《补笔谈》3卷、《续笔谈》1卷。不同整理本的条目划分可能略有差异，所以课堂上重点记住它内容广博、以笔记条目组成。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?梦溪笔谈》?.*(?:价值|地位|为什么重要|意义)|为什么说.*梦溪笔谈.*重要/],
      a:'《梦溪笔谈》的重要价值在于，它保存了大量北宋科学技术和社会生活的具体记录。许多内容不仅告诉我们“有什么发现”，还写清材料、方法和现象，因此既是文学文化资料，也是研究中国科技史的重要文献。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?活板》?.*(?:选自|出处|哪本书|哪一卷|卷几)|梦溪笔谈.*活板.*卷/],
      a:'《活板》选自沈括《梦溪笔谈》卷十八《技艺》。课文记录的是毕昇的泥活字印刷方法。'
    },
    {
      topic:'梦溪笔谈',
      p:[/《?活板》?.*(?:原题|题目是谁加|本来就叫)|活板.*题目.*(?:原来|选录)/],
      a:'“活板”是选录时所加的题目，用来概括这则材料的核心内容。文中的“板”同“版”，指活字排成的印刷版。'
    },
    {
      topic:'毕昇',
      p:[/毕昇是谁|介绍(?:一下)?毕昇|毕昇.*简介|发明活字印刷的人是谁/],
      a:'毕昇是北宋庆历年间的平民工匠，也是泥活字印刷术的发明者。他把整版文字拆成一个个独立字印，字印可以排列、替换、拆下和重复使用。关于他的个人生平，现存可靠史料很少，主要技术记录保存在沈括《梦溪笔谈》中。'
    },
    {
      topic:'毕昇',
      p:[/毕昇.*(?:哪个|什么)朝代|毕昇.*(?:生活|所处|处于).*时代|毕昇是.*代人/],
      a:'毕昇生活在北宋。他发明泥活字的时间在宋仁宗庆历年间，也就是1041年至1048年。'
    },
    {
      topic:'毕昇',
      p:[/毕昇.*(?:身份|职业|布衣是什么意思|为什么叫布衣)|布衣毕昇.*什么意思/],
      a:'“布衣”在文中指平民，说明毕昇不是有官职的士大夫。把“布衣”写出来，既交代了身份，也突出重大技术创新来自普通劳动者的实践智慧。'
    },
    {
      topic:'毕昇',
      p:[/毕昇.*(?:生卒|出生|去世|活了多久|年龄|哪年生)/],
      a:'关于毕昇的出生、去世和详细经历，现存可靠史料很少，不同资料也可能给出不同推测。课内最稳妥的表述是：他是北宋庆历年间的平民工匠、泥活字印刷术发明者。'
    },
    {
      topic:'毕昇',
      p:[/为什么.*毕昇.*(?:资料少|记载少|不了解|信息少)|毕昇.*为什么.*(?:没有传记|资料.*少|资料.*有限|记载.*少|信息.*少)/],
      a:'毕昇是平民工匠，古代史书通常更重视帝王、官员和重大政治事件，普通工匠的生平不容易被完整保存。幸亏沈括详细记录了他的技术，毕昇的名字和发明才得以流传。'
    },
    {
      topic:'毕昇',
      p:[/毕昇.*(?:发明了什么|主要贡献|贡献是什么)|泥活字.*谁发明/],
      a:'毕昇的主要贡献是发明泥活字印刷术：把每个汉字制成独立字印，排版后印刷，用完再拆下分类保存。它把印刷从“整版固定”推进到“单字组合与复用”。'
    },
    {
      topic:'毕昇',
      p:[/毕昇.*(?:怎么|如何).*(?:制作|发明|印刷)|毕昇.*(?:材料|胶泥)|泥活字.*怎么做/],
      a:'毕昇用胶泥刻成单个字印，烧硬后排在铁板和铁范中；铁板上铺松脂、蜡和纸灰等混合物，加热使其稍熔，再压平字面进行印刷。印完重新加热，字印就能拆下并继续使用。'
    },
    {
      topic:'毕昇',
      p:[/毕昇.*(?:泥活字|陶活字).*(?:区别|是不是)|发明的是.*(?:泥活字|陶活字)|胶泥刻字.*叫什么/],
      a:'课文原文说“用胶泥刻字，火烧令坚”，所以中学教材通常称“泥活字”。胶泥烧硬后具有陶质，也有资料称“陶活字”；两种说法指的是同一套以胶泥制字并烧硬的技术。'
    },
    {
      topic:'时代背景',
      p:[/庆历(?:中|年间)?是什么意思|庆历.*(?:哪年|什么时候|哪个皇帝|什么时期)|“?庆历中”?/],
      a:'“庆历”是北宋宋仁宗的年号，庆历年间是1041年至1048年。“庆历中”就是“庆历年间”，课文用它交代毕昇发明活字印刷的时间。'
    },
    {
      topic:'时代背景',
      p:[/北宋是什么时期|北宋.*(?:起止|多少年|什么时候)|毕昇.*时代背景|活字印刷.*时代背景|他所处的时代/],
      a:'北宋从960年延续到1127年。毕昇生活的11世纪正值宋代经济、城市、教育和出版活动发展较快的时期，纸张、墨、雕版等基础技术已经较成熟，社会对书籍的需求增加，为活字印刷的出现提供了条件。'
    },
    {
      topic:'时代背景',
      p:[/为什么.*(?:宋代|北宋).*(?:科技|印刷|文化).*发展|(?:宋代|北宋).*为什么.*(?:书多|科技发展|文化繁荣)|北宋.*(?:印刷|科技|文化).*发展/],
      a:'宋代印刷和科技发展，与商品经济、城市文化、学校教育、科举和书籍需求增长有关；同时造纸、制墨、雕版等技术已有积累。活字印刷不是突然出现的，而是在这些条件上产生的进一步创新。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷术是什么|什么是活字印刷|介绍(?:一下)?活字印刷(?:术)?|活字印刷.*简介/],
      a:'活字印刷术是把文字制成一个个独立字印，按文章内容排列成版，印刷后再拆下、分类并重复使用的技术。北宋毕昇发明的是泥活字。它的核心不是某一种材料，而是“单字独立、按需组合、可以复用”。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:起源|发源|最早出现在哪里|哪国发明)|为什么叫活字印刷|为什么叫活字/],
      a:'已知最早的泥活字印刷术出现在中国北宋，由毕昇发明。它叫“活字”，是因为每个字印都能单独移动、重新排列、拆下保存并再次使用，不像雕版那样整页固定。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:原理|基本原理|核心是什么|怎么工作)|活字为什么能印书/],
      a:'它的基本原理是模块化组合：每个字印相当于一个可移动的小模块，需要什么文字就怎样排列；版面固定后上墨印刷，印完再拆开归类。换一篇文章时不必重刻整版，只要重新排字。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:什么时候|哪年|何时).*(?:发明|出现)|泥活字.*(?:什么时候|哪年)/],
      a:'毕昇的泥活字印刷术发明于北宋宋仁宗庆历年间，也就是1041年至1048年。课文用“庆历中，有布衣毕昇，又为活板”交代了时间、人物和发明。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:是不是|属于).*四大发明|四大发明.*活字|印刷术.*四大发明/],
      a:'中国古代“四大发明”中的一项是印刷术。活字印刷是印刷术发展中的重大创新；在它之前已有雕版印刷。回答时最好说“印刷术是四大发明之一，毕昇的活字印刷推动了印刷技术的发展”。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:意义|影响|价值|为什么重要|贡献)|为什么说.*活字印刷.*伟大/],
      a:'活字印刷把固定整版变成可拆分、可组合、可复用的字印系统，减少重复刻版，尤其适合较多数量的印刷。它推动了印刷技术的发展，也为书籍生产和知识传播提供了新的方法。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:缺点|局限|不足)|为什么.*活字.*没有.*取代雕版|为什么雕版还存在/],
      a:'活字印刷也有条件限制：汉字数量多，制字、检字、排版和归类管理较复杂；只印少量书时，前期准备未必比雕版省事；字印和黏合材料还要保持平整稳定。因此，活字和雕版在很长时间里并存。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:后来|发展|演变)|泥活字.*后来|木活字|金属活字/],
      a:'毕昇以后，活字材料和工艺继续发展，出现了木活字、金属活字等形式。不同地区会根据文字、材料和印刷需要选择不同技术；今天一些传统木活字技艺仍作为文化遗产传承。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:传播|传到|世界)|对世界.*影响|世界印刷史/],
      a:'活字印刷在东亚继续发展，后来出现木活字和金属活字等系统。不同文明中的印刷技术形成了各自的发展路径。讨论世界印刷史时，应区分中国早期活字、东亚金属活字和欧洲机械印刷体系，不能简单把它们混成一件事。'
    },
    {
      topic:'活字印刷',
      p:[/古腾堡|Gutenberg|毕昇.*古腾堡|谁是世界上第一个.*活字/],
      a:'毕昇在11世纪的中国发明了已知最早的泥活字印刷术。古腾堡在15世纪欧洲发展了金属活字、油墨和机械印刷机相结合的体系。两者时代和技术环境不同，不能说古腾堡是世界上最早发明活字的人。'
    },
    {
      topic:'活字印刷',
      p:[/活字印刷.*(?:现代意义|和现代.*联系|今天还有用吗)|活字.*模块化.*现代/],
      a:'活字印刷的现代意义不仅在印书，还在它体现的模块化思想：把复杂整体拆成标准单元，单元可以组合、替换和复用。现代字体排版、零件装配、积木和程序模块都有相似思路。'
    },
    {
      topic:'活板',
      p:[/为什么要学《?活板》?|《?活板》?.*(?:学习价值|重要性)|课文为什么写得这么详细/],
      a:'学习《活板》既是读文言文，也是理解一项古代技术。文章把材料、步骤、效率、分类和拆版写得很具体，让我们看到毕昇的创造力，也看到沈括严谨记录技术的科学态度。'
    }
  ];

  function directHistoryAnswer(text, remember = true) {
    const q = (text || '').trim();
    for (const item of HISTORY_QA) {
      if (item.p.some(re => re.test(q))) {
        if (remember) lastHistoryTopic = item.topic;
        return item.a;
      }
    }
    return '';
  }

  function historyAnswer(text) {
    const q = (text || '').trim();
    const direct = directHistoryAnswer(q, true);
    if (direct) return direct;

    // 让“他有哪些成就”“这本书写了什么”“它有什么局限”等追问接得上上一轮。
    if (!lastHistoryTopic) return '';
    let expanded = q;
    if (lastHistoryTopic === '沈括') {
      expanded = q.replace(/^(他|这个人|作者)/, '沈括').replace(/他的/g, '沈括的');
    } else if (lastHistoryTopic === '毕昇') {
      expanded = q.replace(/^(他|这个人|发明者)/, '毕昇').replace(/他的/g, '毕昇的');
    } else if (lastHistoryTopic === '梦溪笔谈') {
      expanded = q.replace(/^(它|这本书|这部书|这部著作)/, '《梦溪笔谈》').replace(/它的/g, '《梦溪笔谈》的');
    } else if (lastHistoryTopic === '活字印刷') {
      expanded = q.replace(/^(它|这项技术|这种技术)/, '活字印刷').replace(/它的/g, '活字印刷的');
    } else if (lastHistoryTopic === '时代背景') {
      expanded = q.replace(/^(这个时代|当时|那时)/, '北宋').replace(/它的/g, '北宋的');
    } else if (lastHistoryTopic === '沈括与毕昇') {
      expanded = q.replace(/^(他们|两人|二人)/, '沈括和毕昇').replace(/他们的/g, '沈括和毕昇的');
    }
    if (expanded !== q) return directHistoryAnswer(expanded, false);
    return '';
  }


  const QA = [
    {k:['沈括','作者','谁写','出处','梦溪笔谈'],a:'《活板》选自沈括《梦溪笔谈》卷十八《技艺》。沈括（1031—1095），字存中，北宋钱塘人，是科学家、政治家。'},
    {k:['梦溪','书童','沈括','科学精神'],a:'沈括晚年隐居润州梦溪园，编撰《梦溪笔谈》。他重视观察记录，体现实证求真精神。'},
    {k:['毕昇','发明','活板','布衣'],a:'毕昇是北宋平民，发明了泥活字印刷术，把字刻在胶泥上，火烧令坚，再排版印刷。'},
    {k:['板印','板印书籍','唐人','尚未','盛为之'],a:'板印：雕版印刷。盛：大规模。为之：做这件事。全句：用雕版印刷书籍，唐朝人还没有大规模地这样做。'},
    {k:['已后','典籍','板本'],a:'请先留意课下注释：已后，即“以后”，“已”同“以”；板本，指版印书籍，相对于抄本而言。'},
    {k:['布衣','平民','毕昇'],a:'课下注释中的“布衣”指平民。古代平民不能穿锦绣，故称“布衣”；“有布衣毕昇”交代毕昇是一位平民。'},
    {k:['钱唇','薄如','一字一印'],a:'钱唇：铜钱的边缘。毕昇用胶泥刻字，字薄得像铜钱边一样。每字制成一个字印。'},
    {k:['火烧令坚','火烧','令坚','火','令'],a:'“火烧令坚”的意思是“用火烧，使它坚硬”。“令”在这里读 lìng，解释为“使、让”；“火”是名词作状语，解释为“用火”。'},
    {k:['冒','松脂','蜡和纸灰','药'],a:'冒：覆盖。先设一铁板，在其上用松脂、蜡和纸灰之类覆盖。这种混合物即“药”，用于固定活字。'},
    {k:['铁范','铁模子','框'],a:'铁范：铁制的框子。排版时把铁范放在铁板上，在框内紧密排布活字。'},
    {k:['炀','镕','字平如砥','药稍镕'],a:'炀（yáng）：烘烤。镕（róng）：熔化。砥（dǐ）：磨刀石。把铁板靠近火烘烤，药稍熔化后，用平板按压字面，字面就平整如磨刀石。'},
    {k:['止印三二本','未为简易','神速'],a:'止：通“只”。如果只印几本，算不上简便；但印几十上百本，就极为快速。'},
    {k:['二铁板','更互','瞬息可就'],a:'常作二铁板：一块印刷，一块排字。更互：交替、轮流。瞬息可就：眨眼间就能完成。'},
    {k:['韵','帖','木格贮之','贮存'],a:'先看课下注释：“韵”指韵部，韵书中把同韵的字归为一部；“帖”是标签，在“以纸帖之”中用作动词。每个韵部做好标签，再用木格贮存。'},
    {k:['奇字','素','旋刻之','瞬息可成'],a:'奇字：生僻字。素：平时。旋：立即。平时没有备用的生僻字，立即刻制，用草火烧，很快就能完成。'},
    {k:['讫','再火','拂','殊不沾污'],a:'课下注释中，“讫”是完毕，“殊”用在“不”前表示否定程度达到极限，可译为“根本”。全句写印刷完毕后再次加热，使药熔化，再轻拂字印，字印自然脱落，根本不沾污。'},
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
    {k:['四大发明','意义','价值'],a:'中国古代四大发明之一是印刷术。活字印刷是印刷技术的重要创新：把文字制成可组合、可替换、可复用的独立字印，推动了印刷和知识传播的发展。'},
    {k:['福州','福建','非遗','连城','宁化','三坊七巷'],a:'福建印刷非遗丰富：福州三坊七巷有福建省非遗博览苑；连城四堡保留古雕版印刷技艺；宁化仍存木活字手工印刷传承。'},
    {k:['探究观点','思辨之星','观点'],a:'你可以这样表达：活字印刷的伟大在于把文字变成可组合、可复用的“模块”，改变了知识传播方式，是人类思维的一次飞跃。'},
    {k:['徽章','解锁','任务'],a:'本平台有三枚主题勋章；此外，学生完成关于“活”的深度交流并形成自己的结论后，还会在登录信息中点亮“思辨之星”。'},
    {k:['你好','梦溪','你是谁'],a:'小生梦溪，沈括身边的小书童。我可解答《活板》的字词、翻译、断句、印刷史等问题，也陪你讨论活字之“活”。'}
  ];
  const quick = ['沈括是谁？','《梦溪笔谈》是什么书？','活板印刷具体分几步？','为什么要“密布字印”？','“数印”中的“印”是什么？','“火烧令坚”和“持就火炀之”有什么不同？','“活”体现在哪里？','为什么不用木头做活字？'];

  // 快捷问题必须有确定答案，不能再经过模糊关键词评分或联网兜底。
  // 同时把引号、空格和句末标点统一去掉，避免按钮文字中的中文引号导致匹配失败。
  function normalizePresetQuestion(text) {
    return (text || '')
      .replace(/[“”「」『』《》〈〉\"'‘’]/g, '')
      .replace(/\s+/g, '')
      .replace(/[？?！!。；;：:，,、]+$/g, '')
      .trim();
  }

  const PRESET_QA = new Map([
    ['沈括是谁', '沈括（1031—1095），字存中，号梦溪丈人，北宋科学家、政治家。他在天文、数学、地理、物理、医学等方面都有研究，晚年整理成《梦溪笔谈》。《活板》正是他记录毕昇活字印刷术的文章。'],
    ['梦溪笔谈是什么书', '《梦溪笔谈》是北宋沈括晚年撰写的一部笔记体著作，内容涉及天文、数学、地理、物理、医药、工程和社会见闻等。《活板》选自其中的《技艺》篇，它保存了毕昇泥活字印刷术的重要史料。'],
    ['六道工序是什么', '活字印刷的六道工序是：刻字 → 设板 → 排版 → 炀板 → 印刷 → 拆板。刻字是制作字印；设板是在铁板上铺黏合材料；排版是把字印排入铁范；炀板是靠火烘烤并按平字面；印刷是上墨覆纸；拆板是再次加热，取下字印并分类保存。'],
    ['字平如砥为什么要平', '“砥”是细磨刀石。“字平如砥”是说排版后所有字印的上表面要像磨刀石一样平整。印刷时字面要统一着墨、覆纸并受压；如果高低不平，高处会印得过黑，低处可能模糊或缺字，所以必须按平。'],
    ['数印中的印是什么', '这里的“印”指字印、字模，不是印章，也不是印刷次数。“每一字皆有数印”就是每个字都准备几个字模；“之”“也”等常用字还要准备二十多个，避免同一版重复用字时不够。'],
    ['数印里的印是什么', '这里的“印”指字印、字模，不是印章，也不是印刷次数。“每一字皆有数印”就是每个字都准备几个字模；“之”“也”等常用字还要准备二十多个，避免同一版重复用字时不够。'],
    ['火烧令坚和持就火炀之有什么不同', '两处都用火，但目的不同。“火烧令坚”是在制字时把胶泥字烧硬，使字印成型；“持就火炀之”是在排版时把铁板靠近火烘烤，使松脂、蜡和纸灰等黏合材料稍微熔化，便于固定并按平字印。可以记成：前者烧硬字印，后者烤软黏合材料。'],
    ['为什么不用木头做活字', '课文给出两个原因：一是木材纹理有疏有密，沾水后容易高低不平；二是木字容易与松脂、蜡等黏合材料粘住，拆版时不容易取下。胶泥字烧硬后更适合这套加热固定、再加热拆版的工艺。']
  ]);

  function presetAnswer(text) {
    const key = normalizePresetQuestion(text);
    if (PRESET_QA.has(key)) return PRESET_QA.get(key);
    // 容纳学生对快捷问题的自然改写。
    if (/数印(?:中|里|里面)?的?印(?:是|指|表示)?什么/.test(key)) return PRESET_QA.get('数印中的印是什么');
    return '';
  }


  // ===================== 自然式探究对话 =====================
  // 事实型问题直接回答；“活”这一类开放性问题，先检查学生是否已经完成研学探究馆，
  // 再根据学生的表达自然追问、补充证据和给予鼓励，不显示机械的“第几步”。
  const NATURAL_INQUIRY_KEY = 'mengxiNaturalInquiryV217';
  const INQUIRY_STEP_IDS = ['制字','设板','排版','炀板','印刷','拆板'];
  let naturalInquiry = loadNaturalInquiry();

  function currentStudentForInquiry() {
    try {
      return (window.MTP2 && window.MTP2.currentStudent && window.MTP2.currentStudent())
        || JSON.parse(localStorage.getItem('currentStudent') || 'null');
    } catch (_) {
      return null;
    }
  }

  function inquiryProgressKey() {
    const st = currentStudentForInquiry();
    return st ? `inquiryProgress_${st.cls}-${st.seat}-${st.name}` : '';
  }

  function isInquiryFullyUnlocked() {
    if (window.MTP2 && window.MTP2.isTeacher && window.MTP2.isTeacher()) return true;
    const key = inquiryProgressKey();
    if (!key) return false;
    try {
      const data = JSON.parse(localStorage.getItem(key) || 'null');
      if (!data || !data.orderUnlocked || !data.inquiryUnlocked || !data.stepUnlocked) return false;
      return INQUIRY_STEP_IDS.every(id => data.stepUnlocked[id] === true);
    } catch (_) {
      return false;
    }
  }

  function loadNaturalInquiry() {
    try {
      const raw = sessionStorage.getItem(NATURAL_INQUIRY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.topic !== '活的理解') return null;
      if (Date.now() - Number(parsed.updatedAt || 0) > 2 * 60 * 60 * 1000) {
        sessionStorage.removeItem(NATURAL_INQUIRY_KEY);
        return null;
      }
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function saveNaturalInquiry() {
    try {
      if (!naturalInquiry) {
        sessionStorage.removeItem(NATURAL_INQUIRY_KEY);
        return;
      }
      naturalInquiry.updatedAt = Date.now();
      sessionStorage.setItem(NATURAL_INQUIRY_KEY, JSON.stringify(naturalInquiry));
    } catch (_) {}
  }

  function resetNaturalInquiry() {
    naturalInquiry = null;
    saveNaturalInquiry();
  }

  function isLivingInquiryTrigger(text) {
    const raw = (text || '').trim();
    if (/怎么读|读音|拼音|字音/.test(raw)) return false;
    const key = normalizePresetQuestion(raw);
    return /活(?:体现|表现)(?:在)?哪里/.test(key)
      || /活(?:体现|表现)(?:在)?哪儿/.test(key)
      || /活字印刷.*(?:活在哪里|活在哪|为什么活|怎样理解活|如何理解活)/.test(key)
      || /(?:如何|怎样|怎么)(?:理解|看待|认识).*活/.test(key)
      || /为什么叫活板/.test(key)
      || /标题.*活板.*为什么/.test(key)
      || /活板.*(?:活在哪里|活在哪|活的含义|活的意义)/.test(key)
      || /课文.*活.*(?:含义|意义|体现|表现)/.test(key);
  }

  function isIndependentFactQuestion(text) {
    const q = (text || '').trim();
    if (!/[？?]|怎么读|读什么|什么意思|翻译|是谁|是什么书|哪一年|哪些工序|六道工序|作者|字义|读音/.test(q)) return false;
    return !isLivingInquiryTrigger(q)
      && !/(每字为一印|数印|二铁板|更互|旋刻|其印自落|用讫|复用|模块|组合)/.test(q);
  }

  function weakInquiryReply(text) {
    const q = (text || '').replace(/[，。！？、\s]/g, '');
    return q.length < 4 || /^(不知道|不会|没想法|不清楚|不懂|没方向|想不到|不会答|不知道啊|是|不是|对|嗯)$/.test(q);
  }

  // 梦溪是温和、机灵的小书童：引导要有陪伴感，但不过度卖萌，也不替学生作答。
  const MENGXI_WARM_TONE = {
    start:[
      '你把目光停在这里啦，看来这句话确实藏着一点门道。',
      '咦，你也注意到这一处了？咱们顺着这条线索往下找。',
      '先把标准答案放一边，小生更想听听你的第一感觉。',
      '这页书翻得正巧，答案就藏在几个不起眼的小动作里。',
      '别急着下结论，咱们先做个小小的思想实验。',
      '你这一问，把工匠操作台上的难题带到眼前来了。',
      '来得正好，小生刚想请你留意这句原文。',
      '这可不是只能靠背诵解决的问题，咱们动手推一推。',
      '我听见你在追问“为什么”了，这一步最可贵。',
      '这处看着平常，其实正藏着毕昇的巧思。',
      '先别忙着翻答案，咱们把自己换成毕昇的学徒试试看。',
      '你的问题像一枚刚排好的字印，正好能带出下一层意思。'
    ],
    encourage:[
      '别着急呀，刚开始没头绪很正常。',
      '没关系，能说出“还没想明白”也是思考的起点。',
      '不怕，我们先把大问题缩成一个小问题。'
    ],
    praise:[
      '嗯，你已经摸到门道啦！',
      '真不错，我听见你的思路往前走了一步。',
      '你瞧，这个发现已经很有分量了。'
    ],
    redirect:[
      '这个想法很特别，小生先接住。',
      '哈哈，你的脑洞挺有意思。',
      '我明白你想表达什么了，咱们再把它轻轻拉回课文。'
    ],
    finish:[
      '真好，这个结论是你自己一步步推出来的。',
      '妙呀，你已经把零散线索串成自己的判断了。',
      '这回可不是背答案，而是你自己想明白了。'
    ],
    writing:[
      '别怕空白页，小生陪你先搭第一块积木。',
      '解说词不用一口气写完，咱们先说一句最有把握的。',
      '先别为一百五十字发愁，我们从一句真话开始。'
    ]
  };

  function nextMengxiLine(list, key='general') {
    if (!Array.isArray(list) || !list.length) return '';
    const counterKey = `mengxiLineCounter:${key}`;
    const lastKey = `mengxiLineLast:${key}`;
    let counter = Number(sessionStorage.getItem(counterKey) || 0);
    let index = counter % list.length;
    const last = Number(sessionStorage.getItem(lastKey) || -1);
    if (list.length > 1 && index === last) index = (index + 1) % list.length;
    try {
      sessionStorage.setItem(counterKey, String(counter + 1));
      sessionStorage.setItem(lastKey, String(index));
    } catch (_) {}
    return list[index];
  }

  function mengxiWarm(kind, turn=0) {
    const list = MENGXI_WARM_TONE[kind] || MENGXI_WARM_TONE.start;
    if (kind === 'start') return nextMengxiLine(list, 'start');
    const index = Math.abs(Number(turn || 0)) % list.length;
    return list[index];
  }

  function mengxiTopicOpening(topic) {
    const id = topic && topic.id ? topic.id : 'generic';
    const groups = {
      process:['process','boardOrder','alternate','reheat','fireDifference'],
      craft:['dense','material','adhesive','flatSurface','approachFire','slightMelt','yang'],
      words:['imprintMeaning','boardPrint','ending','livingEye','deadBlock'],
      compare:['oneType','multipleTypes','batchScale','modern','rare','rhymeStorage']
    };
    const group = Object.entries(groups).find(([,ids]) => ids.includes(id));
    const openers = {
      process:[
        '先把工序卡片放一放，咱们到毕昇的操作台前看看。',
        '这一步若顺序放错，后面可就忙乱了。咱们从操作现场推一推。',
        '小生先不报步骤，想请你做一回掌管工序的小师傅。'
      ],
      craft:[
        '你盯上的正是工匠最费心的一处，小生也想听听你的推测。',
        '这一问很像在摸材料的脾气，咱们看看它受热、受压时会怎样。',
        '别小看这个细节，它可能直接决定一版字印得清不清楚。'
      ],
      words:[
        '你连这个小词都没有放过，眼睛真亮。咱们把它放回原句试试。',
        '古人的一个字，往往牵着一整道工序。咱们先看它在句中做了什么。',
        '这处不必急着查答案，换一换词、删一删字，意思就会自己显出来。'
      ],
      compare:[
        '你已经不只是在读古文，而是在追问这项技术为什么聪明。',
        '咱们把雕版和活字摆在同一张桌上，比一比就清楚了。',
        '这条线索能从北宋一直牵到今天，先从一个具体场景说起吧。'
      ],
      generic:MENGXI_WARM_TONE.start
    };
    const key = group ? group[0] : 'generic';
    return nextMengxiLine(openers[key] || openers.generic, `topic:${key}`);
  }

  const LIVING_DIMENSIONS = {
    movable: {
      label:'单个字印可以独立移动、替换和重新组合',
      patterns:['每字为一印','单个字','一个个字','独立字印','可移动','能移动','可替换','换字','重新排列','重新组合','不是整版','拆成字','字是活的','像积木','搭积木','模块'],
      praise:'你一下就抓住“字是活的”啦！沈括写“每字为一印”，正好说明文字不再被刻死在整版上，而是变成可以单独移动、替换和重新组合的字印。'
    },
    supply: {
      label:'字印数量和字库可以按实际需要增补',
      patterns:['每一字皆有数印','数印','二十余印','多个字印','多备','备用','常用字','奇字','生僻字','旋刻','临时刻','随时刻','不够再刻','补刻','按需'],
      praise:'你连字库里的小门道也看见了，真细心！“每一字皆有数印”和“有奇字素无备者，旋刻之”说明字库不是固定死的：常用字可以多备，缺少的生僻字还能临时补刻。'
    },
    workflow: {
      label:'两块铁板可以一印一排、交替衔接',
      patterns:['二铁板','两块铁板','一板印刷','一块印','另一块排','一块排字','已自布字','更互用之','更互','交替','轮流','一边印一边排','同时进行','减少等待','提高效率','瞬息可就'],
      praise:'你又往前想了一层，连效率上的“活”也看出来了！沈括说“一板印刷，一板已自布字，更互用之”，一块在印，另一块同时排字，工序能连续衔接。'
    },
    reuse: {
      label:'印完以后可以拆版、归类并重复使用',
      patterns:['其印自落','自落','拆下','取下','拂下','再用','复用','重复使用','重新使用','分类保存','木格贮之','归类','不是一次性','拆版'],
      praise:'真不错，你注意到了“其印自落”这个细节。字印不是一次性粘死在版上，印完可以拆下、归类保存，再次排版时继续使用。'
    }
  };

  function detectLivingDimensions(text) {
    const q = text || '';
    return Object.entries(LIVING_DIMENSIONS)
      .filter(([, item]) => item.patterns.some(word => q.includes(word)))
      .map(([key]) => key);
  }

  function firstMissingLivingDimension(found) {
    return ['movable','supply','workflow','reuse'].find(key => !found.includes(key)) || '';
  }

  function naturalFollowupFor(key) {
    const prompts = {
      movable:'咱们再靠近原文一点。沈括为什么特意强调“每字为一印”？和雕版的“整版一体”相比，最大的变化会是什么呢？',
      supply:'你瞧，“每一字皆有数印”和“有奇字素无备者，旋刻之”正在悄悄递线索：遇到重复字或字库里没有的字时，工匠可以怎样处理呢？',
      workflow:'还有一处很有意思：沈括写“常作二铁板……更互用之”。一块铁板正在印刷时，另一块在做什么？这份不停歇的配合，为什么也算“活”呢？',
      reuse:'最后咱们看看“用讫再火令药镕，以手拂之，其印自落”。字印轻轻落下来以后，它们的故事就结束了吗？还能做什么呢？'
    };
    return prompts[key] || '小生再递你一盏灯：能不能找一句原文，为你的判断补上一条证据？';
  }

  function awardThinkingStar() {
    let dispatched = false;
    if (window.MTP2 && typeof window.MTP2.unlockThinkingStar === 'function') {
      dispatched = window.MTP2.unlockThinkingStar() === true;
    } else {
      const st = currentStudentForInquiry();
      if (st) {
        localStorage.setItem(`thinkingStar:${st.cls}-${st.seat}-${st.name}`, 'unlocked');
        dispatched = false;
      }
    }
    try {
      if (typeof window.saveProgress === 'function') {
        window.saveProgress('梦溪探究对话', {action:'完成“活”的思辨交流', reward:'思辨之星'});
      }
    } catch (_) {}
    try { if (typeof window.renderStudentPass === 'function') window.renderStudentPass(); } catch (_) {}
    if (!dispatched) document.dispatchEvent(new CustomEvent('mengxiThinkingStarUnlocked'));
  }

  function incompleteInquiryMessage() {
    const hasStudent = !!currentStudentForInquiry();
    return hasStudent
      ? '这个问题很值得慢慢聊。不过小生刚看了一眼，你的研学探究馆还没有完全解锁。先去完成工序排序、六个工序视频和活字探究任务吧。等你带着自己的发现回来，我就陪你一条线索一条线索地想，绝不会把答案硬塞给你。<br><a href="inquiry.html" style="color:#7a4b21;font-weight:700;">前往研学探究馆 →</a>'
      : '这个问题很值得慢慢聊。你还没有登录学生身份呢。先登录，再完成研学探究馆的工序排序、六个工序视频和活字探究任务。等你回来，小生就在这里陪你继续琢磨。<br><a href="index.html" style="color:#7a4b21;font-weight:700;">先去登录 →</a>';
  }

  function startNaturalLivingDialogue() {
    if (!isInquiryFullyUnlocked()) {
      resetNaturalInquiry();
      return incompleteInquiryMessage();
    }
    naturalInquiry = {
      topic:'活的理解',
      found:[],
      turns:0,
      awaitingSummary:false,
      updatedAt:Date.now()
    };
    saveNaturalInquiry();
    const livingOpeners = [
      '呀，你已经把研学探究馆走完啦！这回咱们可以坐下来，慢慢聊聊这个“活”。',
      '工序都解锁了，正好把那些零散发现排成一块完整的“思想版”。',
      '你带着探究馆里的发现回来了，小生可一直等着听你的判断呢。',
      '六道工序已经走过一遍，现在该问问：它们为什么能共同撑起一个“活”字？'
    ];
    return `${nextMengxiLine(livingOpeners, 'living:start')}先别管标准答案，只说你的第一感觉：沈括写“每字为一印”，它和雕版把整页刻在一块木板上，有什么不一样？哪怕只说出一点，小生也愿意听。`;
  }

  function completeNaturalInquiryIfReady(text, currentDimensions) {
    if (!naturalInquiry) return '';
    const clean = (text || '').replace(/\s/g, '');
    const totalFound = Array.from(new Set([...(naturalInquiry.found || []), ...currentDimensions]));
    const hasReasoningWords = /因为|所以|说明|体现|可见|不仅|而且|相比|从而|这样/.test(text || '');
    const currentIsComplete = currentDimensions.length >= 3 && clean.length >= 18;
    const summaryIsComplete = naturalInquiry.awaitingSummary
      && clean.length >= 18
      && currentDimensions.length >= 2
      && hasReasoningWords;
    if (!currentIsComplete && !summaryIsComplete) return '';

    const evidenceCount = ['每字为一印','每一字皆有数印','旋刻之','更互用之','其印自落'].filter(x => (text || '').includes(x)).length;
    const warmTurn = naturalInquiry.turns || 0;
    awardThinkingStar();
    resetNaturalInquiry();
    return `${mengxiWarm('finish', warmTurn)}你已经不再停留在“活字很灵活”这句空话上，而是从字印可移动和组合、工序可交替、印后可拆下复用等具体做法中说明了“活”。${evidenceCount ? '你还请原文来作证，回答一下子就站稳了。' : '若要写进作业，再请一句原文来作证，就更圆满了。'}小生替你点亮了<strong>“思辨之星”</strong>，快去登录信息里看看吧。`;
  }

  function handleNaturalLivingDialogue(text) {
    const q = (text || '').trim();

    if (isLivingInquiryTrigger(q)) return startNaturalLivingDialogue();
    if (!naturalInquiry || naturalInquiry.topic !== '活的理解') return '';

    if (/^(退出探究|结束探究|结束讨论|取消探究|重新开始|重来)[。！!\s]*$/.test(q)) {
      const restart = /重新开始|重来/.test(q);
      resetNaturalInquiry();
      return restart ? startNaturalLivingDialogue() : '好呀，咱们先把书页合到这里。哪天你又冒出新想法，随时来问小生“活体现在哪里”。';
    }

    if (!isInquiryFullyUnlocked()) {
      resetNaturalInquiry();
      return incompleteInquiryMessage();
    }

    // 讨论过程中临时问字音、字义等明确事实题，先正常回答，不打断探究进度。
    if (isIndependentFactQuestion(q)) return '';

    if (/直接.*(?:告诉|给).*(?:答案|结论)|正确答案是什么|标准答案是什么/.test(q)) {
      const missing = firstMissingLivingDimension(naturalInquiry.found || []);
      return `小生当然可以递线索，但不能替你把结论写好。${naturalFollowupFor(missing)}你先说一句自己的话，哪怕不完整，我也会好好接住。`;
    }

    if (weakInquiryReply(q)) {
      const missing = firstMissingLivingDimension(naturalInquiry.found || []);
      return `${mengxiWarm('encourage', naturalInquiry.turns || 0)}咱们把问题缩小一点：${naturalFollowupFor(missing)}`;
    }

    naturalInquiry.turns = Number(naturalInquiry.turns || 0) + 1;
    const currentDimensions = detectLivingDimensions(q);
    const oldFound = naturalInquiry.found || [];
    const newDimensions = currentDimensions.filter(x => !oldFound.includes(x));
    naturalInquiry.found = Array.from(new Set([...oldFound, ...currentDimensions]));

    const completed = completeNaturalInquiryIfReady(q, currentDimensions);
    if (completed) return completed;

    if (!currentDimensions.length) {
      saveNaturalInquiry();
      if (/灵活|方便|很快|先进|厉害/.test(q)) {
        return `${mengxiWarm('praise', naturalInquiry.turns)}“活”确实和灵活、方便有关。咱们再给这个想法添上一根课文里的“柱子”：${naturalFollowupFor(firstMissingLivingDimension(naturalInquiry.found))}`;
      }
      return `${mengxiWarm('redirect', naturalInquiry.turns)}我还想听得更具体一点：${naturalFollowupFor(firstMissingLivingDimension(naturalInquiry.found))}`;
    }

    let response = '';
    if (newDimensions.length) {
      response += LIVING_DIMENSIONS[newDimensions[0]].praise;
      if (newDimensions.includes('movable') && /积木|模块/.test(q)) {
        response += ' 你用“搭积木”或“模块”来比喻尤其贴切。补充资料也能印证：后来王祯改进木活字和转轮排字盘，仍然延续了“拆分—组合—检索—复用”的思路。';
      }
    } else {
      response += `${mengxiWarm('praise', naturalInquiry.turns)}这句话和你前面的判断能互相照应，思路已经越来越清楚了。`;
    }

    if (naturalInquiry.found.length >= 3) {
      naturalInquiry.awaitingSummary = true;
      saveNaturalInquiry();
      const labels = naturalInquiry.found.map(k => LIVING_DIMENSIONS[k].label);
      return `${response}<br>你已经找到了${labels.slice(0,3).join('、')}等证据，像把几枚散落的字印排成了版。现在试着把它们连成<strong>两三句话</strong>，完整回答一次“活体现在哪里”吧。可以用“因为……所以……”或“它不仅……还……”把观点和证据轻轻扣在一起。`;
    }

    const missing = firstMissingLivingDimension(naturalInquiry.found);
    saveNaturalInquiry();
    return `${response}<br>${naturalFollowupFor(missing)}`;
  }

  function cleanSearchText(text) {
    return (text || '')
      .replace(/[“”「」『』]/g, '')
      .replace(/^(请问|请解释|我想知道|梦溪|小助手)[，,:：\s]*/,'')
      .replace(/[？?！!。]+$/,'')
      .trim();
  }

  function wikiSearchQuery(text) {
    const q = cleanSearchText(text);
    if (/沈括/.test(q) && !/梦溪笔谈/.test(q)) return `沈括 梦溪笔谈 ${q}`;
    if (/梦溪笔谈/.test(q) && !/沈括/.test(q)) return `沈括 梦溪笔谈 ${q}`;
    if (/(活字|活板|毕昇|印刷)/.test(q) && !/活字印刷/.test(q)) return `活字印刷 毕昇 ${q}`;
    if (/(北宋|庆历)/.test(q)) return `北宋 庆历 ${q}`;
    return q;
  }

  function usefulExtract(extract) {
    return (extract || '')
      .replace(/\[[^\]]{1,20}\]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/（[^）]*(?:消歧义|可能指)[^）]*）/g, '')
      .trim();
  }

  function shortenExtract(text, maxLength = 280) {
    if (!text) return '';
    const sentences = text.split(/(?<=[。！？])/).filter(Boolean);
    let out = '';
    for (const sentence of sentences) {
      if ((out + sentence).length > maxLength && out) break;
      out += sentence;
      if (out.length >= maxLength) break;
    }
    if (!out) out = text.slice(0, maxLength);
    return out.length < text.length && !/[。！？]$/.test(out) ? out + '……' : out;
  }

  async function queryMediaWiki(host, query) {
    const params = new URLSearchParams({
      action:'query',
      generator:'search',
      gsrsearch:query,
      gsrlimit:'3',
      gsrnamespace:'0',
      prop:'extracts',
      exintro:'1',
      explaintext:'1',
      exsentences:'5',
      redirects:'1',
      format:'json',
      origin:'*'
    });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(`https://${host}/w/api.php?${params.toString()}`, {
        method:'GET',
        mode:'cors',
        credentials:'omit',
        signal:controller.signal,
        headers:{'Accept':'application/json'}
      });
      if (!response.ok) return null;
      const data = await response.json();
      const pages = Object.values(data?.query?.pages || {})
        .sort((a,b) => (a.index || 999) - (b.index || 999));
      for (const page of pages) {
        const extract = usefulExtract(page.extract);
        if (!extract || /可能指|消歧义/.test(extract.slice(0,80))) continue;
        return {title:page.title || query, extract};
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async function onlineAnswer(question) {
    if (!navigator.onLine || typeof fetch !== 'function') return '';
    const lexical = isLexicalIntent(question);
    const target = lexical ? extractLookupTarget(question) : '';
    const query = target || wikiSearchQuery(question);
    if (!query) return '';
    const hosts = lexical
      ? ['zh.wiktionary.org','zh.wikipedia.org']
      : ['zh.wikipedia.org','zh.wiktionary.org'];
    for (const host of hosts) {
      try {
        const result = await queryMediaWiki(host, query);
        if (result) {
          const summary = shortenExtract(result.extract);
          return `我查到的公开资料中，“${result.title}”的相关说明是：${summary}`;
        }
      } catch (_) {
        // 当前来源不可用时自动换下一个来源，不让学生跳出页面。
      }
    }
    return '';
  }



  // ===================== V2.22 全课自然引导与解说词写作教练 =====================
  // 设计原则：事实题直接答；内容理解题先接住学生，再用原文、情境和比较引导；
  // 解说词任务只帮学生拆任务、查遗漏、理顺连接，不代写成品。
  const GUIDED_DIALOGUE_KEY = 'mengxiGuidedDialogueV222';
  let guidedDialogue = loadGuidedDialogue();

  function guidedStudentKey() {
    const st = currentStudentForInquiry();
    return st ? `${st.cls}-${st.seat}-${st.name}` : 'guest';
  }

  function loadGuidedDialogue() {
    try {
      const raw = sessionStorage.getItem(GUIDED_DIALOGUE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || Date.now() - Number(data.updatedAt || 0) > 2 * 60 * 60 * 1000) {
        sessionStorage.removeItem(GUIDED_DIALOGUE_KEY);
        return null;
      }
      return data;
    } catch (_) { return null; }
  }

  function saveGuidedDialogue() {
    try {
      if (!guidedDialogue) {
        sessionStorage.removeItem(GUIDED_DIALOGUE_KEY);
        return;
      }
      guidedDialogue.updatedAt = Date.now();
      sessionStorage.setItem(GUIDED_DIALOGUE_KEY, JSON.stringify(guidedDialogue));
    } catch (_) {}
  }

  function resetGuidedDialogue() {
    guidedDialogue = null;
    saveGuidedDialogue();
  }

  function guideProgress(percent, label) {
    const p = Math.max(8, Math.min(100, Math.round(percent || 0)));
    return `<div class="mx-guide-progress" aria-label="${label || '思考进度'} ${p}%"><div class="mx-guide-label"><span>${label || '思考正在展开'}</span><b>${p}%</b></div><div class="mx-guide-track"><i style="width:${p}%"></i></div></div>`;
  }

  function isSpeechHallPage() {
    return /(?:^|\/)speech(?:\.html)?$/i.test(location.pathname) || /活字解说馆/.test(document.body?.innerText || '');
  }

  function isClearFactQuestion(text) {
    const q = (text || '').trim();
    if (/怎么读|读音|拼音|读什么|注音/.test(q)) return true;
    if (/^(?:请问)?[^？?]{0,16}(?:是谁|哪一年|什么朝代|哪本书|作者是谁|出处是什么)[？?。！!]*$/.test(q)) return true;
    if (/翻译|译成现代汉语|这句话什么意思/.test(q) && !/为什么|作用|体现|好处|区别/.test(q)) return true;
    return false;
  }

  function isWeakStudentAnswer(text) {
    const q = (text || '').replace(/[，。！？、\s]/g,'');
    return q.length < 3 || /^(不知道|不会|不懂|没想法|想不到|随便|没有|不知道啊|嗯|哦|是|不是|对)$/.test(q);
  }

  function asksForReadyMadeAnswer(text) {
    return /直接.*(?:告诉|给).*(?:答案|结论)|标准答案|正确答案|帮我写|替我写|给我一段|给个范文|完整范文|直接生成|照抄/.test(text || '');
  }

  function looksLikeBareQuotation(text) {
    const q = (text || '').trim();
    const sourceHits = ['每字为一印','火烧令坚','先设一铁板','密布字印','持就火炀之','字平如砥','更互用之','每一字皆有数印','旋刻之','其印自落','木格贮之'].filter(x=>q.includes(x)).length;
    return sourceHits >= 1 && q.length < 40 && !/因为|所以|说明|可见|我觉得|我认为|这表明|意味着|可以|能够|便于|用来|从而|分类|保存|再用|复用/.test(q);
  }

  function softRedirect(text, topic) {
    const q = text || '';
    if (topic === 'deadBlock' && /木板.*(?:死|没有生命)|因为.*没有生命/.test(q)) {
      return '这个拟人化很有趣！不过我们讨论的“死”是信息能不能变化。假如整版只错一个字，你能只换掉那个字吗，还是要动到整块版？';
    }
    if (topic === 'oneType' && /有钱|刻得起|钱多/.test(q)) {
      return '哈哈，如果只是有钱，为什么不把所有字都刻几百个？再看“有奇字素无备者，旋刻之”：毕昇是在无限囤字，还是按使用频率和实际需要管理字库？';
    }
    if (topic === 'alternate' && /接力赛/.test(q)) {
      return '“接力赛”这个比喻抓住了交替，但还差一点：这里更像并行流水作业——一块在印，另一块已经开始布字。这样省掉的是哪一段等待时间？';
    }
    if (topic === 'rhymeStorage' && /诗人|押韵|喜欢韵/.test(q)) {
      return '这个解释很文艺！不过先把自己放进字库管理现场：几千枚字印混在一起时，按韵分类首先解决的是审美问题，还是快速检索和归还问题？';
    }
    if (topic === 'reheat' && /铲|硬撬|直接取/.test(q)) {
      return '这个办法够痛快，但先替泥字边缘担心一下：硬铲时细小笔画会不会崩裂？再看“再火令药镕”，毕昇是在用蛮力，还是利用材料受热软化？';
    }
    if (topic === 'livingEye' && /字能动|像活的生物|会活动/.test(q) && !/组合|替换|复用|交替/.test(q)) {
      return '“字能动”是起点，但还太笼统。对比雕版想三个小问题：错字能不能只换一个？印完能不能拆下重排？两块板能不能交替工作？先挑一个回答。';
    }
    if (/激光|电脑|打印机|人工智能|机器人|3D打印/.test(q) && topic !== 'modern') {
      return '你这个设想很有未来感，简直让毕昇提前跨越了一千年！不过我们先把条件锁定在北宋：手边只有胶泥、木材、铁板、松脂和火。回到这个条件下，你会怎样解决眼前的问题？';
    }
    if (/工匠精神|很酷|厉害|聪明|伟大/.test(q) && !/因为|所以|具体|原文/.test(q)) {
      return '这个概括有情感，也有方向。现在把它落到操作台上：究竟是哪一个动作、哪一种材料或哪一句原文，让你看出这种精神？';
    }
    if (/先刷墨.*(?:加热|炀)|墨.*(?:烤|烧).*(?:粘|牢)/.test(q)) {
      return '你的顺序很有画面感，不过先做个生活实验：铁板已经烧热时再刷墨，墨会不会先干在版面或刷子上？回到原文，把“炀”之后、真正印刷之前的动作再找一遍。';
    }
    if (/因为今天下雨|因为我喜欢|因为好看|因为比较酷/.test(q)) {
      return '你这句把我逗笑了，不过它还没有落到课文证据上。我们换个小问题：这项工艺中，哪一个动作如果做错顺序，整版最容易散掉或印不清？';
    }
    return '';
  }

  const GUIDED_TOPICS = [
    {
      id:'process',
      triggers:[/活板.*(?:分几步|具体步骤|工艺流程)|活字印刷.*(?:分几步|步骤|流程)|六道工序.*(?:什么|哪些|怎么排)|工序.*顺序/],
      intro:'步骤确实不少，我先不替你报答案。请把自己当成毕昇的学徒：手边有胶泥字印、铁板和松脂等材料。你准备真正排一版书时，第一件要安置的东西是什么？为什么不能先把字印随便排在桌面上？',
      clues:[
        {words:['铁板','底座','先设','设板'],praise:'你抓住了“先有底座”这个前提。原文用“先设一铁板”把起点写得很清楚。'},
        {words:['松脂','蜡','纸灰','药','覆盖','冒之'],praise:'很好，你又注意到固定字印所需的材料层。'},
        {words:['排版','布字','铁范','密布'],praise:'对，字印要进入铁范并按内容排列，版面才真正形成。'},
        {words:['炀','加热','烘烤','熔化','按平','平板'],praise:'你把“加热—按平”的连续关系看出来了。'},
        {words:['印刷','上墨','覆纸','拆版','取下','归类'],praise:'你已经把印刷和拆版复用也接到了流程末端。'}
      ],
      summary:'现在别背原文，请用“先……接着……然后……最后……”把你刚才找到的动作串成一条因果清楚的流程。再补一句：其中哪一步最不能颠倒？为什么？',
      done:'你的流程已经能说明“为什么这样排”，不只是机械背顺序了。若写进作业，可再核对课文中的动词：设、冒、布、炀、按、印、拂。'
    },
    {
      id:'batchScale',
      triggers:[/若止印三二本.*(?:为什么|怎么理解)|三二本.*未为简易|数十百千本.*极为神速|为什么.*(?:印得多|印很多).*(?:更快|神速|划算)|只印一本.*(?:划算|简易)/],
      intro:'先把一次印刷拆成“准备时间”和“连续印刷时间”。无论只印两本还是印两百本，检字、排版、固定版面这些准备工作是不是都要先做？',
      clues:[
        {words:['排版','检字','准备','前期','固定','耗时'],praise:'对，活字印刷有一笔相对固定的前期准备成本。'},
        {words:['两三本','少量','平均','不划算','手抄'],praise:'很好，印量少时，准备时间分摊到每一本上仍然很高，所以未必简易。'},
        {words:['几十','几百','上千','批量','连续','平均成本','神速','印得多','分摊','划算'],praise:'你把规模效应看出来了：版面一旦准备好，连续印得越多，前期成本越能被摊薄。'}
      ],
      summary:'请用“固定准备成本＋批量分摊”解释“三二本”和“数十百千本”的差别。不要简单说“印得越多机器越快”。',
      done:'你的解释已经从课文数字推到了生产逻辑：活字的优势有条件，批量越大越明显。'
    },
    {
      id:'dense',
      triggers:[/为什么.*密布字印|密布字印.*(?:为什么|作用|好处)|字印.*排得密/],
      intro:'你观察得很细！做个思想实验：如果字印之间空隙很大、排得松松垮垮，刷墨、覆纸并按压时，字印可能发生什么？先说一个你最担心的结果。',
      clues:[
        {words:['歪','移动','散','松','不稳'],praise:'对，版面不稳定，受力时字印就可能移动或歪斜。'},
        {words:['深浅','不均','印不清','缺字','模糊'],praise:'你又想到印迹深浅不一的问题，这和版面受力是否均匀有关。'},
        {words:['铁范','限制','固定','整体'],praise:'很好，铁范和紧密排列共同把许多独立字印约束成一个稳定版面。'}
      ],
      summary:'把你的发现压缩成一句“因为……所以……”：为什么独立的字印必须在铁范里密布，才能像一整版那样稳定工作？',
      done:'说得很扎实。你已经从“字印可拆”继续推到了“排版时又必须临时组成稳定整体”，这正是活字系统既活又稳的关键。'
    },
    {
      id:'material',
      triggers:[/为什么.*(?:用|选择).*(?:胶泥|泥字)|为什么.*不用.*(?:木头|木活字|金属|铁|铜)|胶泥.*(?:木头|金属).*(?:为什么|区别)|不以木为之.*为什么/],
      intro:'这个问题要先分清“课文明说”和“我们推测”。请先回到“不以木为之者”后面，找出沈括明确写出的两个原因。一个和木材纹理、遇水有关，另一个和拆版时的黏连有关。你先说出其中一个。',
      clues:[
        {words:['木理','疏密','纹理','沾水','高下不平','膨胀'],praise:'找得准！木材纹理有疏密，遇水后字面容易高低不平，这是课文明确写出的原因。'},
        {words:['与药相粘','粘住','不可取','拆不下来','黏合'],praise:'对，木字还容易和黏合材料粘连，拆版时难以完整取下。'},
        {words:['火烧令坚','胶泥','烧硬','易刻','便宜','拆版'],praise:'你开始把泥字的特点和整套工艺联系起来了。胶泥易刻，烧硬后能进入“加热固定—再加热拆版”的循环。'}
      ],
      summary:'现在请把结论分成两层：第一层只说课文对“为什么不用木头”的直接证据；第二层再说你对胶泥选择的合理推断。不要把推测说成沈括原话。',
      done:'这就严谨了：既能依据原文回答，又能分清文本事实和材料推断。至于金属，课文没有直接解释，后世也确实出现了金属活字，因此不能简单说金属“不能用”。'
    },
    {
      id:'oneType',
      triggers:[/为什么.*每字为一印|每字为一印.*(?:为什么|进步|意义)|单字.*独立.*(?:好处|进步)/],
      intro:'先别急着说“省字”。“每字为一印”的关键不是一页里重复十次的“之”只刻一个——同一版同时出现十次，仍需要十个字印。真正的变化是：一整页被拆成了独立单字。你觉得刻错一个字时，雕版和活字分别要改动多大范围？',
      clues:[
        {words:['一个字','只换','局部','不用整版','改错'],praise:'你抓住了局部替换：错一个字，只处理一个字印，不必把整页重新雕刻。'},
        {words:['重排','组合','不同文章','复用','重复使用','模块'],praise:'很好，独立字印还能换顺序、换组合，用在不同版面里。'},
        {words:['二十余印','常用字','多个','同时出现'],praise:'你也发现了一个重要限制：同一版重复出现的字必须准备多个，所以常用字要多备。'}
      ],
      summary:'请用“它并不是……而是……”总结：每字独立的进步到底在哪里？再说明为什么课文还要写“之、也”等字有二十余印。',
      done:'你的回答已经兼顾了优势和实际限制：独立模块便于替换、重排、复用，但同页高频字仍需多枚字印。这比简单说“一个字只刻一次”准确得多。'
    },
    {
      id:'modern',
      triggers:[/为什么.*(?:现在|今天).*(?:不用|少用).*活字|活字.*为什么.*(?:不用了|淘汰|失传|没有取代雕版)|为什么.*活字.*没有.*全面取代|现代.*(?:活字|模块化)|激光照排.*活/],
      intro:'好问题！先别把“器物不用了”等同于“思想消失了”。今天电脑排版时，单个字符能不能被替换、移动、复制和重新组合？这和毕昇把整版拆成单字，有什么相似之处？',
      clues:[
        {words:['字符','字体','替换','复制','移动','组合'],praise:'你看到了数字排版中的可编辑、可组合。物理泥字消失了，单元化处理文字的逻辑仍在。'},
        {words:['模块','组件','代码','积木','复用'],praise:'这个迁移很精彩！“拆分—组合—替换—复用”已经超出印刷，成为现代设计和程序开发中的模块化思维。'},
        {words:['速度','自动','电子','激光','每页变化'],praise:'对，现代技术把物理拣字和排版变成电子信息处理，效率和变化能力进一步提升。'}
      ],
      summary:'现在请区分两句话：①传统泥活字为什么不再是主流工具；②活字的哪一种思维仍活在今天。你更愿意强调哪一句？',
      done:'你的看法已经从“技术被淘汰”推进到“具体工具更新、核心思维迁移”，这正是古今对照的价值。'
    },
    {
      id:'rare',
      triggers:[/生僻字.*(?:怎么办|没有|缺)|奇字.*(?:怎么办|素无备)|没有提前刻.*字|旋刻之.*(?:为什么|说明)/],
      intro:'你抓住了活字字库的难点。原文说“有奇字素无备者，旋刻之”。先看“素”和“旋”：一个说明平时没准备，一个说明发现后怎样处理。你觉得这两个字共同表现了怎样的应急能力？',
      clues:[
        {words:['平时','没有准备','素'],praise:'对，“素无备”说明字库不可能事先囊括所有生僻字。'},
        {words:['立即','马上','临时','旋刻'],praise:'很好，“旋刻之”说明遇到缺字可以临时快速补刻。'},
        {words:['草火','烧','很快','顷刻'],praise:'你还注意到新字需要尽快烧硬，才能马上进入排版。'}
      ],
      summary:'请代入一次真实订单：上午发现缺字、下午要交书。你会怎样利用“旋刻之”解决问题？这和雕版发现缺字后重刻整版相比，有什么不同？',
      done:'你的推演把“旋”读活了：它不是一个孤立词义，而是整套活字系统能够按需扩充的证据。'
    },
    {
      id:'fireDifference',
      triggers:[/火烧令坚.*持就火炀之.*(?:不同|区别)|两个火.*(?:区别|作用)|烧硬.*烤化/],
      intro:'两处都有火，但处理的对象不同。请先找主语：第一次被火处理的是胶泥字，第二次被加热的是排好字的铁板和“药”。你猜，两次加热分别想改变什么？',
      clues:[
        {words:['泥字','字印','烧硬','坚固','成型'],praise:'对，第一次是让胶泥字印烧硬成型，属于制字阶段。'},
        {words:['松脂','蜡','药','稍镕','熔化','固定','按平'],praise:'很好，第二次是让黏合材料稍微熔化，便于固定并按平字印。'}
      ],
      summary:'请用“前者……后者……”作一次对照，特别说清处理对象、目的和所在工序。',
      done:'区分得很清楚：前者“烧硬字印”，后者“烤软黏合材料”。同样用火，工艺目的完全不同。'
    },
    {
      id:'yang',
      triggers:[/持就火炀之.*炀.*(?:意思|为什么)|炀.*(?:什么意思|为什么不用烧|火候)|为什么.*炀.*不写烧/],
      intro:'“炀”在这里指用火烘烤。接下来别只停在字典义上：如果把“炀”理解成大火猛烧，和后文“药稍镕”的“稍”能不能配得上？你觉得毕昇需要怎样的火候？',
      clues:[
        {words:['温和','控制','慢','稍微','不能太猛','小火'],praise:'你的判断和“稍镕”吻合：需要受控加热，使材料软化，而不是把它烧毁。'},
        {words:['松脂','蜡','药','熔化','流散','字歪'],praise:'对，火候过猛会让黏合材料过度流动，版面稳定性就可能受影响。'}
      ],
      summary:'现在请把“炀”的词义和它在工序中的作用连起来：为什么这个字比笼统的“烧”更能提醒我们注意加热目的？',
      done:'你已经从字义推到了工艺控制：理解文言词，不只是换一个现代词，还要看它在动作链中承担什么作用。'
    },

    {
      id:'flatSurface',
      triggers:[/字平如砥.*(?:砥.*(?:是什么|什么意思)|为什么.*平|怎么理解)/,/砥.*(?:到底|究竟).*(?:是什么|为什么.*平)/,/为什么.*(?:平板按其面|字面.*平|按平)/],
      intro:'“砥”是细磨刀石，这个词义可以先确定。但沈括为什么偏要写“平如砥”？请想象一排字印有的高、有的低：刷上同样的墨、覆上同一张纸，高处和低处会分别印成什么样？',
      clues:[
        {words:['高','低','深','浅','黑','淡','模糊','印不出','不均匀'],praise:'你已经从印刷结果反推出“平”的必要性：高处受压重，低处可能接触不到纸，字迹就会深浅不一。'},
        {words:['药稍镕','稍镕','稍熔','软化','趁热','按平','平板'],praise:'很好，你又看到了按平的时机：固定材料稍微软化时，字印还能调整高度，冷却后才稳稳固定。'},
        {words:['精密','准确','工艺','质量','清楚','整齐'],praise:'对，“字平如砥”不只是比喻好看，还说明毕昇对版面精度和印刷质量有严格控制。'}
      ],
      summary:'现在请用“如果不平……所以要趁……按平……”把原因、时机和结果连起来。最后再说一句：“字平如砥”体现了这项工艺怎样的精密性？',
      done:'你已经把“砥”的词义、按平的物理原因和工艺精度连起来了。这样的回答不只是解释一个字，而是真正读懂了这一句为什么必须存在。'
    },
    {
      id:'livingEye',
      triggers:[/活.*(?:文眼|全文核心)|为什么说.*活.*(?:文眼|核心)|活.*(?:体现|表现|在哪里|在哪儿)|为什么叫活板|如何.*(?:理解|看待).*活/],
      intro:'这个问题值得慢慢聊。我先不列“标准答案”。如果雕版像一张刻死的整页，沈括写“每字为一印”后，文字最先获得了哪一种自由？请先说你看到的一点。',
      clues:[
        {words:['每字为一印','单字','独立','可移动','替换','组合','积木','模块'],praise:'你说得太对啦！你抓住了“字印活”：文字从整版中拆出来，可以移动、替换和重新组合。'},
        {words:['数印','二十余印','旋刻','奇字','按需','多备'],praise:'这个发现很细！字印的数量和字库也能按需要补充，不是固定死的。'},
        {words:['二铁板','两块铁板','更互','交替','一板印刷','另一板排字'],praise:'你把工序上的“活”看出来了：一板在印，另一板布字，交替衔接，减少等待。'},
        {words:['其印自落','拆版','复用','重复使用','木格贮之','归类'],praise:'非常好！印完后字印能拆下、归类、再用，版面结束了，字印的生命还没有结束。'}
      ],
      summary:'你已经找到几条证据了。请用两三句话完成一次自己的结论：先说“活”的核心，再引用至少两处原文或工艺事实作证。可以用“它不仅……还……”来连接。',
      done:'妙啊！你的结论已经有观点、有理由，也有课文证据。你不是在背“活”，而是在解释为什么它活。',
      awardStar:true
    },
    {
      id:'deadBlock',
      triggers:[/为什么说.*雕版.*死|雕版.*(?:死板|死在哪里|为什么死)/],
      intro:'“死”当然不是说木板没有生命。我们只看信息能否变化：一页文字已经整版雕好后，如果换文章、换顺序或改一个字，原版能做到什么，做不到什么？',
      clues:[
        {words:['不能改','整版','重刻','固定','不能重排'],praise:'对，“整版一体”意味着内容被固定，变化往往牵动整版。'},
        {words:['活字','替换','单字','重排','复用'],praise:'很好，你已经用活字的局部替换和重新组合反衬出雕版的“死”。'}
      ],
      summary:'请不要只说“雕版不灵活”。用一个具体场景说明：发现一个错字，或要印另一页时，两种技术分别要怎么做？',
      done:'这个对比具体多了。“死”是信息结构固定，不是价值判断；雕版在大量印同一内容时仍有优势。'
    },
    {
      id:'boardPrint',
      triggers:[/板印书籍.*(?:为什么|不直接写印刷)|为什么.*板印.*不写印刷/],
      intro:'先把“板印”拆开看：“板”指出工具和方式，“印”指出动作。如果删掉“板”，读者还知道这里说的是手抄、拓印，还是雕版印刷吗？',
      clues:[
        {words:['工具','木板','雕版','方式','限定'],praise:'对，“板”把印刷方式限定为使用雕版，不只是泛泛的“印”。'},
        {words:['背景','对比','活板','铺垫'],praise:'很好，这个词还为后面“活板”出现作了技术背景和对比铺垫。'}
      ],
      summary:'请用一句话说明：“板印”比“印刷”多交代了哪一层信息？它与下文“活板”有什么关系？',
      done:'你已经把一个词放回全文结构中理解了：它既说明旧技术，也为新技术登场作铺垫。'
    },
    {
      id:'adhesive',
      triggers:[/松脂.*蜡.*纸灰.*(?:作用|为什么|干什么|混在一起)|为什么.*覆以.*松脂|药.*(?:作用|材料)|为什么不用胶水|只放蜡.*(?:行不行|可以吗)|纸灰.*(?:作用|为什么)|三样材料.*(?:为什么|作用)/],
      intro:'你已经注意到它像一种“可逆黏合层”。先找两个相反动作：排版时要让字印固定，拆版时又要让字印脱落。哪两句原文分别对应“粘住”和“拆开”？',
      clues:[
        {words:['药稍镕','炀','加热','固定','按平'],praise:'对，加热使材料软化，字印能够被调整并固定成平整版面。'},
        {words:['再火','其印自落','拂','拆版','熔化'],praise:'很好，再次加热后字印能脱落，说明这种固定不是永久粘死。'},
        {words:['可逆','热塑','反复','复用'],praise:'你已经概括出“受热可软化、冷却可固定、再热可拆”的循环特征。'}
      ],
      summary:'现在用“既要……又要……”解释为什么这里需要的不是永久胶水，而是一种能随温度变化、便于固定和拆解的材料。',
      done:'你的解释抓住了材料选择与工艺目标的匹配。至于松脂、蜡、纸灰各自承担的精确化学作用，课文并未逐项说明，回答时不要把推测冒充原文。'
    },
    {
      id:'boardOrder',
      triggers:[/为什么先.*设.*铁板|先设一铁板.*(?:为什么|作用)|为什么.*先设板.*再.*布字|为什么第一步不是.*(?:放字|布字)|为什么先.*冒.*再.*(?:布字|放字)/],
      intro:'把操作倒过来想：如果先在桌面或地面排好几百个独立字印，再把铁板扣过去，版面最可能发生什么？',
      clues:[
        {words:['散','乱','移位','翻倒','不平'],praise:'对，独立字印很容易在搬动和翻扣时散乱、移位。'},
        {words:['底座','铁范','稳定','药','固定'],praise:'很好，先准备铁板、黏合层和铁范，后续布字才有稳定边界和固定基础。'}
      ],
      summary:'请用“先准备承载与固定条件，再排列字印”概括这一步的程序逻辑，并说明顺序为什么不能反。',
      done:'你已经把“先”读成了程序逻辑，而不是一个可有可无的时间词。'
    },
    {
      id:'approachFire',
      triggers:[/持就火炀之.*就.*(?:意思|作用)|就火.*(?:什么意思|为什么)|为什么.*持就火/],
      intro:'“就”在这里是“靠近”。但词义知道了还不够：端着一块已经排满字印的铁板靠近火源，最怕什么？这个动作为什么必须平稳、受控？',
      clues:[
        {words:['撒','掉','移位','歪','烫','安全','平稳'],praise:'你把操作风险想出来了：既要防止版面移动，也要控制人与火的安全距离。'},
        {words:['药稍镕','加热','火候','靠近','控制'],praise:'对，“就火”不是把版面扔进火里，而是靠近火源控制加热，使“药”达到稍镕状态。'}
      ],
      summary:'请把“就”的方向意义和工艺要求连起来：为什么“靠近火烘烤”比“投入火中猛烧”更符合后文？',
      done:'你已经能用上下文验证词义，而不是只背注释。'
    },
    {
      id:'alternate',
      triggers:[/更互用之.*(?:怎么理解|为什么|作用)|为什么.*(?:二铁板|两块铁板)|二铁板.*(?:好处|作用)|一板印刷.*一板.*布字/],
      intro:'把印刷拆成两个耗时环节：一块版正在印时，下一块版还需要布字和准备。如果只有一块铁板，印完一版后必须停下来等什么？',
      clues:[
        {words:['排字','布字','等待','停工','下一版'],praise:'对，只有一块板时，印刷和下一版排字只能串行进行，等待时间会增加。'},
        {words:['同时','一边印一边排','交替','流水','更互'],praise:'很好，两块板让“印刷”和“下一版布字”并行衔接，形成类似流水作业的节奏。'},
        {words:['效率','神速','瞬息可就'],praise:'你把动作安排和效率结果联系起来了。'}
      ],
      summary:'请用“一块……另一块……”说明两板如何配合，再解释“更互”为什么不是简单轮流，而是减少工序空档。',
      done:'你的解释已经把“更互用之”从词义翻译推进到了生产组织方式。'
    },

    {
      id:'imprintMeaning',
      triggers:[/数印.*(?:中的?|里的?).*印.*(?:是什么|什么意思|指什么)/,/每一字皆有数印.*(?:印.*(?:是什么|什么意思)|怎么理解)/,/每字为一印.*印.*(?:是什么|什么意思)/],
      intro:'先别急着查注释。把三个候选词义放回原句试一试：<strong>“印章”“印刷次数”“字模”</strong>。原文还说“之、也等字，每字有二十余印”，哪一个最通顺？另外两个为什么说不通？',
      clues:[
        {words:['字模','字印','活字','不是印章','不是次数'],praise:'判断得很准！这里的“印”是一个个实体字模，不是印章，也不是印刷的次数。'},
        {words:['二十余印','二十多个','同一页','同一版','重复','同时'],praise:'你又用“二十余印”验证了词义：同一版里常用字可能同时出现很多次，因此要准备多个相同字模。'},
        {words:['常用字','之','也','不够','多备','排版'],praise:'对，常用字多备是为了解决排版时同字重复、字模不够的问题。'}
      ],
      summary:'请用一句完整的话回答：这里的“印”是什么？为什么“之”“也”等常用字要有二十余印？不要只报词义，还要把上下文依据说出来。',
      done:'你已经用上下文自己判定了词义：“印”指字印、字模；常用字准备多个，是因为同一版可能同时重复出现，不能靠一个字模来回搬。'
    },
    {
      id:'multipleTypes',
      triggers:[/为什么.*每一字皆有数印|数印.*(?:为什么|作用)|为什么.*二十余印|常用字.*多刻/],
      intro:'先想一页文章里同时出现十个“之”的情况。排版完成前，那十个位置能共用同一个字印吗？为什么？',
      clues:[
        {words:['不能','同时','十个','多个位置','占着'],praise:'对，同一版上的多个位置同时需要字印，不能把一个“之”来回搬。'},
        {words:['常用字','之','也','二十余印','高频'],praise:'很好，出现频率越高的字，越需要多准备，避免排版时缺字。'},
        {words:['备用','损坏','提高效率','不用等'],praise:'你还想到备用和减少等待，这也是多备字印的实际价值。'}
      ],
      summary:'请用一个具体例子解释“数印”：它解决的是同一版重复用字的什么问题？为什么常用字要比生僻字准备得更多？',
      done:'这就解释清楚了：“数印”不是印刷次数，而是为同版重复字准备多个字模。'
    },
    {
      id:'reheat',
      triggers:[/再火令药镕.*(?:为什么|必要)|拆版.*(?:为什么再加热|直接取|铲)|其印自落.*为什么/],
      intro:'如果不再加热，直接用铲子把烧硬的泥字从冷却后的黏合层里硬撬出来，最可能损伤字印的哪个部位？',
      clues:[
        {words:['边缘','崩','裂','坏','破'],praise:'对，硬撬容易损伤细小笔画和字印边缘，影响下次印刷。'},
        {words:['再火','药镕','软化','其印自落','轻拂'],praise:'很好，再加热让黏合材料软化，字印可以轻轻脱落。'},
        {words:['无损','复用','重复使用'],praise:'你已经把拆版方式和字印复用联系起来了。'}
      ],
      summary:'用“利用材料变化，而不是依靠蛮力”概括这一步。它为什么体现了工艺设计的聪明？',
      done:'你的解释抓住了可逆拆解：加热不是多此一举，而是保护字印、实现复用的条件。'
    },
    {
      id:'rhymeStorage',
      triggers:[/木格贮之.*(?:为什么|怎么理解)|为什么.*按韵.*(?:分类|贮存)|每韵为一帖.*(?:作用|为什么)|按韵检字/],
      intro:'想象两千枚字印全部倒在一个箱子里。下次需要找“东”字时，你愿意逐个翻，还是先缩小到同一韵部的格子？“按韵”在这里解决的其实是什么问题？',
      clues:[
        {words:['查找','检索','快','分类','缩小范围'],praise:'对，按韵分类的核心是提高检字和归还效率。'},
        {words:['标签','帖','木格','位置'],praise:'很好，标签和木格把字库变成有规则、可定位的存储系统。'},
        {words:['归还','不会乱','管理','复用'],praise:'你又看到了“用后归位”，这保证字印能够长期反复使用。'}
      ],
      summary:'请把它和今天的文件夹、索引或搜索系统作一个谨慎类比：相似的是哪种管理思路，不同的又是什么？',
      done:'你的类比落在“分类—定位—取用—归还”上，很准确；不必硬说它等同于现代电脑搜索。'
    },
    {
      id:'slightMelt',
      triggers:[/药稍镕.*稍.*(?:作用|能去掉|什么意思)|为什么.*稍镕|稍.*火候/],
      intro:'试着把“稍”删掉，变成“药镕”。读起来好像还能通，但工艺控制少了什么信息？如果黏合材料剧烈熔化、四处流动，字印可能怎样？',
      clues:[
        {words:['稍微','适度','程度','火候','控制'],praise:'对，“稍”限制了熔化程度，写出了火候需要受控。'},
        {words:['流动','移位','下沉','歪','不平'],praise:'很好，过度熔化会使字印失去稳定，甚至影响字面平整。'}
      ],
      summary:'请用一句话回答：“稍”为什么不能轻易删？它体现了沈括记录技术时怎样的精确性？',
      done:'你已经从一个程度副词读出了火候控制，也看见了科技说明语言的准确性。'
    },
    {
      id:'ending',
      triggers:[/最后一句.*(?:为什么|作用|能删)|为什么.*结尾.*毕昇|结尾.*(?:提到|写).*毕昇|昇死.*(?:为什么|作用)|其印为.*群从.*(?:作用|说明)|至今.*(?:保藏|宝藏).*(?:为什么|作用)/],
      intro:'如果文章在拆版工艺后立刻结束，我们知道的是“技术怎么做”。结尾再交代毕昇死后字印的去向，又多提供了哪一类信息：评价、传说，还是实物线索？',
      clues:[
        {words:['实物','去向','保存','保藏','证据','线索'],praise:'对，它交代了字印的后续去向，为这项技术记录增加了实物线索和可信度。'},
        {words:['毕昇','群从','传承','后人'],praise:'很好，这一句还把发明者、收藏者和技术记忆连接起来。'},
        {words:['史料','真实','可信','收束'],praise:'你已经看到它既有史料价值，也承担全文收束作用。'}
      ],
      summary:'请避免夸大成“沈括一定亲眼做过实验”。用“交代去向、增强可信、收束全文”三个角度，选两个写成自己的判断。',
      done:'你的分析很稳妥：结尾不是闲笔，而是给技术记录补上来源与去向，使文章更像可追溯的史料。'
    }
  ];

  function findGuidedTopic(text) {
    for (const topic of GUIDED_TOPICS) {
      if (topic.triggers.some(r => r.test(text || ''))) return topic;
    }
    return null;
  }

  function isGeneralHuobanUnderstanding(text) {
    const q = text || '';
    if (isClearFactQuestion(q)) return false;
    const marker = /为什么|如何|怎么理解|怎样理解|如何看待|作用|意义|好处|特点|体现|说明|区别|关系|顺序|流程|原因|能不能删|能否删|必要吗|文眼|主旨|中心|说明方法|说明顺序|现代意义|模块化|高效|神速|简易/.test(q);
    const context = /活板|活字|毕昇|沈括|胶泥|铁板|字印|雕版|松脂|蜡|纸灰|铁范|更互|旋刻|木格|药稍镕|字平如砥/.test(q);
    return marker && context;
  }

  function dynamicGenericIntro(text) {
    const q = text || '';
    if (/说明顺序|结构|行文/.test(q)) return '先不要背“时间顺序”或“程序顺序”。请把文章分成两块看：开头先交代什么历史背景，主体又连续写了哪些操作动词？你觉得哪一部分按时间，哪一部分按工序？';
    if (/说明方法/.test(q)) return '先从原文里抓三类明显标记：带“如”的句子、带具体数量的句子、把少量和大量印刷放在一起的句子。它们分别可能属于什么说明方法？先找一例。';
    if (/主旨|中心|主要内容/.test(q)) return '先看篇幅分配：文章花最多笔墨写人物生平，还是写材料、步骤、效率和字印管理？你从这个重点判断，作者最想保存和突出什么？';
    if (/优点|高效|神速|简易/.test(q)) return '请把两组原文放在一起：“三二本”与“数十百千本”，“一板印刷”与“一板已自布字”。这两组比较分别说明了什么条件下活字才真正显出效率？';
    if (/雕版.*活字|区别|比较/.test(q)) return '先设一个具体任务：发现一个错字，或者下一页内容完全不同。整版雕刻和单字组合分别需要改动什么？从“改、排、存、再用”四个动作中选两个比较。';
    return '这个问题值得从原文中推出来。我先不替你下结论：你觉得与这个问题最相关的是哪一句原文、哪一个动作，或者哪一种材料？先指出一个，我们从那里往下追。';
  }

  function startGuidedTopic(topic) {
    if (topic && topic.awardStar && !isInquiryFullyUnlocked()) {
      resetGuidedDialogue();
      return incompleteInquiryMessage();
    }
    guidedDialogue = {
      mode:'huoban', topicId:topic.id, matched:[], turns:0, awaitingSummary:false,
      studentKey:guidedStudentKey(), updatedAt:Date.now()
    };
    saveGuidedDialogue();
    return `${mengxiTopicOpening(topic)}<br>${topic.intro}${guideProgress(18,'思考刚刚起步')}`;
  }

  function startGenericGuidance(text) {
    guidedDialogue = {
      mode:'generic', topicId:'generic', originalQuestion:text, turns:0, evidence:false, keyWord:false,
      studentKey:guidedStudentKey(), updatedAt:Date.now()
    };
    saveGuidedDialogue();
    return `${mengxiTopicOpening(null)}<br>${dynamicGenericIntro(text)}${guideProgress(18,'先找到文本抓手')}`;
  }

  function guidedTopicById(id) {
    return GUIDED_TOPICS.find(t => t.id === id) || null;
  }

  function handleTopicTurn(text, topic) {
    const q = (text || '').trim();
    if (/^(退出引导|结束讨论|结束探究|取消|重新开始|重来)[。！!\s]*$/.test(q)) {
      const again = /重新开始|重来/.test(q);
      resetGuidedDialogue();
      return again ? startGuidedTopic(topic) : '好呀，咱们先歇一歇。等你在原文里又发现了什么，回来喊一声“梦溪”，小生接着陪你想。';
    }
    if (isClearFactQuestion(q)) return '';
    if (asksForReadyMadeAnswer(q)) {
      const next = topic.clues.find((_,i)=>!(guidedDialogue.matched || []).includes(i));
      return `小生可以扶着梯子，却不能替你登到终点呀。${next ? '咱们先答一个小问题：' + (topic.intro.split('？')[0] + '？') : topic.summary}你先留下自己的判断，我会陪你把它说完整。${guideProgress(28 + (guidedDialogue.matched || []).length * 12,'先说出自己的判断')}`;
    }
    const redirect = softRedirect(q, topic.id);
    if (redirect) {
      guidedDialogue.turns += 1;
      saveGuidedDialogue();
      return `${mengxiWarm('redirect', guidedDialogue.turns)}${redirect}${guideProgress(24 + guidedDialogue.turns * 5,'把想法拉回文本')}`;
    }
    if (isWeakStudentAnswer(q)) {
      guidedDialogue.turns += 1;
      saveGuidedDialogue();
      const nextIndex = topic.clues.findIndex((_,i)=>!(guidedDialogue.matched || []).includes(i));
      const clue = nextIndex >= 0 ? topic.clues[nextIndex] : null;
      return `${mengxiWarm('encourage', guidedDialogue.turns)}咱们把问题缩小：${clue ? '请在原文里找一个和“' + clue.words[0] + '”有关的句子，再用大白话告诉小生它做了什么。' : topic.summary}${guideProgress(25 + guidedDialogue.turns * 4,'问题已经缩小')}`;
    }
    if (looksLikeBareQuotation(q)) {
      guidedDialogue.turns += 1;
      saveGuidedDialogue();
      return `原文找得很准，这是好本事。只是小生更想听见你的声音：请把它讲成三年级同学也能听懂的大白话，再用“因为……所以……”把道理连起来。${guideProgress(32 + guidedDialogue.turns * 5,'从引用走向解释')}`;
    }

    guidedDialogue.turns += 1;
    const matched = new Set(guidedDialogue.matched || []);
    const newHits = [];
    topic.clues.forEach((clue,i)=>{
      if (clue.words.some(w=>q.includes(w))) {
        if (!matched.has(i)) newHits.push(i);
        matched.add(i);
      }
    });
    guidedDialogue.matched = [...matched];
    const reasoning = /因为|所以|说明|体现|可见|意味着|如果|相比|这样|从而|不是.*而是/.test(q);
    const enough = matched.size >= Math.min(2, topic.clues.length);
    const summaryReady = guidedDialogue.awaitingSummary && q.replace(/\s/g,'').length >= 18 && reasoning;

    if (summaryReady || (matched.size >= Math.min(3, topic.clues.length) && q.length >= 24 && reasoning)) {
      const award = topic.awardStar && matched.size >= 3;
      const warmTurn = guidedDialogue.turns || 0;
      if (award) awardThinkingStar();
      resetGuidedDialogue();
      return `${mengxiWarm('finish', warmTurn)}${topic.done}${award ? ' 小生已经为你点亮了<strong>“思辨之星”</strong>，快去登录信息里瞧瞧吧。' : ''}${guideProgress(100,'形成自己的结论')}`;
    }

    let response = '';
    if (newHits.length) {
      response = `${mengxiWarm('praise', guidedDialogue.turns)}${topic.clues[newHits[0]].praise}`;
      if (newHits.length > 1) response += ' 而且你一下连起了不止一条证据，像把散字排成了一块清清楚楚的版。';
    } else if (matched.size) {
      response = `${mengxiWarm('praise', guidedDialogue.turns)}这句话和前面的发现能互相照应。咱们再向前走半步：别只说现象，也说说它为什么会带来这个结果。`;
    } else {
      response = `${mengxiWarm('redirect', guidedDialogue.turns)}小生还没完全跟上，你能把它和课文里的一个具体动词、材料或步骤连起来吗？`;
    }

    if (enough) {
      guidedDialogue.awaitingSummary = true;
      saveGuidedDialogue();
      return `${response}<br>你手里的证据已经够用了。${topic.summary}别急着写漂亮，先把自己的道理说完整。${guideProgress(82,'证据已够，正在组织结论')}`;
    }

    const nextIndex = topic.clues.findIndex((_,i)=>!matched.has(i));
    const next = nextIndex >= 0 ? topic.clues[nextIndex] : null;
    saveGuidedDialogue();
    const follow = next
      ? `小生再替你翻开一页：原文或你的推理里，有没有和“${next.words.slice(0,2).join(' / ')}”有关的证据？它能补上哪一层原因呢？`
      : topic.summary;
    const pct = 28 + matched.size / Math.max(1,topic.clues.length) * 48;
    return `${response}<br>${follow}${guideProgress(pct,'观点正在长出证据')}`;
  }

  function handleGenericTurn(text) {
    const q = (text || '').trim();
    if (isClearFactQuestion(q)) return '';
    if (asksForReadyMadeAnswer(q)) {
      return `小生可以帮你找方向，不过这类理解题，最好先留下你自己的脚印。先从原文里挑一句最相关的话发给我，我陪你追问，不替你写结论。${guideProgress(25,'等待你的文本证据')}`;
    }
    if (isWeakStudentAnswer(q)) {
      return `${mengxiWarm('encourage', guidedDialogue.turns || 0)}${dynamicGenericIntro(guidedDialogue.originalQuestion || '')}${guideProgress(24,'把问题再缩小一点')}`;
    }
    guidedDialogue.turns = Number(guidedDialogue.turns || 0) + 1;
    if (!guidedDialogue.evidence) {
      guidedDialogue.evidence = looksLikeBareQuotation(q) || /原文|写道|说|每字|铁板|字印|胶泥|雕版|更互|旋刻|自落/.test(q);
      saveGuidedDialogue();
      if (guidedDialogue.evidence) return `${mengxiWarm('praise', guidedDialogue.turns)}你已经找到文本抓手了。咱们别停在引用上：这句话中哪个动词或限制词最关键？若删掉或换掉它，工艺逻辑会发生什么变化呢？${guideProgress(55,'证据已找到，正在解释关键词')}`;
      return `${mengxiWarm('redirect', guidedDialogue.turns)}这个想法还差一根课文里的支柱。请找一句能支持它的原文，或者指出一个具体工艺动作。${guideProgress(38,'需要补上一条证据')}`;
    }
    if (!guidedDialogue.keyWord) {
      guidedDialogue.keyWord = q.length >= 4;
      saveGuidedDialogue();
      return `${mengxiWarm('praise', guidedDialogue.turns)}你已经抓到关键词了。最后一步，用“因为……所以……”把原文证据和自己的结论连成两句话吧。不必追求标准句，先让道理顺顺当当。${guideProgress(82,'正在形成结论')}`;
    }
    if (q.length >= 16 && /因为|所以|说明|体现|可见|意味着|不是.*而是/.test(q)) {
      const warmTurn = guidedDialogue.turns || 0;
      resetGuidedDialogue();
      return `${mengxiWarm('finish', warmTurn)}你的回答已经形成“观点—理由—文本证据”的完整链条。若要交作业，再看看原词引用得准不准，就很稳当了。${guideProgress(100,'结论由你自己完成')}`;
    }
    saveGuidedDialogue();
    return `已经很接近啦，只差最后一小步：请明确写出“这句原文说明了什么”，再补一句“为什么会产生这个结果”。小生等你把最后一枚字印放稳。${guideProgress(88,'只差因果连接')}`;
  }

  const SPEECH_GUIDE_KEY = 'mengxiSpeechCoachV222';
  let speechCoach = loadSpeechCoach();

  function loadSpeechCoach() {
    try {
      const raw = sessionStorage.getItem(SPEECH_GUIDE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || Date.now() - Number(data.updatedAt || 0) > 2*60*60*1000) return null;
      return data;
    } catch (_) { return null; }
  }

  function saveSpeechCoach() {
    try {
      if (!speechCoach) return sessionStorage.removeItem(SPEECH_GUIDE_KEY);
      speechCoach.updatedAt = Date.now();
      sessionStorage.setItem(SPEECH_GUIDE_KEY, JSON.stringify(speechCoach));
    } catch (_) {}
  }

  function resetSpeechCoach() { speechCoach = null; saveSpeechCoach(); }

  function isSpeechWritingTrigger(text) {
    if (!isSpeechHallPage()) return false;
    return /解说词|怎么写|写什么|不会写|开头|结尾|帮我写|范文|框架|150字|字数|任务要求|工序.*串|技术之活|设计之活|思维之活/.test(text || '');
  }

  function speechDraftStats(text) {
    const clean = (text || '').replace(/\s/g,'');
    const count = clean.length;
    const hasProcess = /设板|布字|炀版|炀板|平版|印刷|拆版/.test(text);
    const hasLiving = /技术之活|设计之活|思维之活|灵活|模块|组合|交替|复用/.test(text);
    const hasSpirit = /毕昇|创新|敢想|实践|创造|精神|智慧/.test(text);
    return {count,hasProcess,hasLiving,hasSpirit};
  }

  function currentSpeechDraft() {
    try {
      const box = document.querySelector && document.querySelector('#speechInput');
      return box && typeof box.value === 'string' ? box.value.trim() : '';
    } catch (_) { return ''; }
  }

  function evaluateSpeechDraft(draft) {
    const stats = speechDraftStats(draft);
    const missing=[];
    if(!stats.hasProcess) missing.push('工序还原');
    if(!stats.hasLiving) missing.push('“活”的阐释');
    if(!stats.hasSpirit) missing.push('毕昇创新精神评价');
    if (!missing.length) {
      return `真不错，你的输入框里已经有约${stats.count}字，三个任务要素都找得到。先自己用1、2、3标出“工序—活—评价”分别在哪一句，再轻声读一遍，听听连接是否自然。小生不替你重写全文，但会陪你看看哪一处还像课文翻译。${guideProgress(100,'骨架已由你完成')}`;
    }
    return `你已经写下约${stats.count}字啦，手里并不是空的。对照任务要求，还缺：<strong>${missing.join('、')}</strong>。咱们先补一项就好，不必把整段推倒重来。${guideProgress(68,'正在补齐任务要素')}`;
  }

  function startSpeechCoach() {
    speechCoach = {stage:0, process:'', living:'', award:'', studentKey:guidedStudentKey(), updatedAt:Date.now()};
    saveSpeechCoach();
    return `${mengxiWarm('writing', 0)}整个活字印刷流程里，你最熟悉的是哪一步？先用自己的一句话说说它在做什么，不用担心顺序，也不用怕说得不漂亮。${guideProgress(18,'先说出最熟悉的一步')}`;
  }

  function handleSpeechCoach(text) {
    if (!isSpeechHallPage()) return '';
    const q = (text || '').trim();
    const currentKey = guidedStudentKey();
    if (speechCoach && speechCoach.studentKey && speechCoach.studentKey !== currentKey) resetSpeechCoach();
    const triggered = isSpeechWritingTrigger(q);
    if (!triggered && !speechCoach) return '';
    if (isClearFactQuestion(q) && !triggered) return '';
    if (/^(退出写作引导|结束写作|取消|重新开始|重来)[。！!\s]*$/.test(q)) {
      const again=/重新开始|重来/.test(q); resetSpeechCoach();
      return again ? startSpeechCoach() : '好呀，咱们先把笔搁一搁。你的文字要由你自己写出来；等你准备好了，小生再陪你继续搭。';
    }

    if (!speechCoach) {
      if (asksForReadyMadeAnswer(q)) return `这篇解说词里，最珍贵的就是你的声音呀。小生不能把成品塞给你，却可以把大任务拆成小步，陪你一块写出来。${startSpeechCoach()}`;
      return startSpeechCoach();
    }

    const pageDraft = currentSpeechDraft();
    if (pageDraft && /写完|帮我看|检查|看看|多少字|字数|漏了什么|任务要求/.test(q)) {
      return evaluateSpeechDraft(pageDraft);
    }

    if (/设板.*布字.*(?:谁先|顺序)|不确定.*设板.*布字/.test(q)) {
      return `来，咱们借毕昇的眼睛看一看：如果还没有稳定的铁板和边界，会把几百个字印先堆在地上吗？先准备底座，再排字，哪一种更不容易散架？把你的判断说成一句话就好。${guideProgress(34,'正在理顺工序')}`;
    }
    if (/平版.*(?:干什么|作用|为什么)/.test(q)) {
      return `你先在脑海里看一眼：字印顶部有高有低，直接刷墨覆纸后，高处和低处会印出同样深浅吗？“平版”到底是在替印刷解决什么麻烦呢？${guideProgress(34,'从结果反推动作')}`;
    }
    if (/三个.*活.*(?:差不多|分不清)|技术之活.*设计之活.*思维之活/.test(q)) {
      return `这三个“活”挤在一起，确实容易混。你来当个小裁判：技术之活看“怎么操作”，设计之活看“怎样安排字印和字库”，思维之活看“怎样把整版拆成单字模块”。先挑一个最有话说的，其他两个先放在一旁。${guideProgress(48,'先选一个最有把握的角度')}`;
    }
    if (/什么叫.*思维之活|思维之活.*什么意思/.test(q)) {
      return `你瞧，雕版工匠想的是“在一块板上刻完一页”，毕昇想的是“把一页拆成一个个字再组合”。这有点像整幅画和可以重排的马赛克。哪一种更容易改动、复用？用一句自己的话说出这层突破吧。${guideProgress(50,'用对比理解思维突破')}`;
    }
    if (/毕昇.*(?:什么精神|有什么精神|不就是发明)/.test(q)) {
      return `“创新精神”四个字很大，咱们先把它落到手上。在大家都习惯整版雕刻时，毕昇却把文字拆成单字，还要反复试材料、火候和拆版。你觉得他最难跨出的第一步是什么？${guideProgress(55,'把精神落到行动')}`;
    }
    if (/150字|多少字|字数/.test(q)) {
      return `别被150字吓到呀，把它看成三小块：工序约60字，“活”的解释约50字，毕昇评价约40字。先写三句话，不够再慢慢展开。把已有文字发来，小生只帮你数一数、找缺项，不会替你补成品。${guideProgress(42,'把字数拆成内容任务')}`;
    }
    if (/像课文翻译|不像解说词/.test(q)) {
      return `把眼前的读者想成一位第一次听《活板》的游客。挑一句，把“密布字印”换成更好懂的说法，比如“把字模一个挨一个排进铁框”。先只改这一句，发给小生听听。${guideProgress(56,'把书面翻译改成口语讲解')}`;
    }
    if (/懒得写/.test(q)) {
      return `那咱们先不写，先说。点击麦克风，用30秒讲“一个工序＋一个活＋一句评价”，再把识别出来的文字慢慢整理。先从第一句开口，小生听着呢。${guideProgress(26,'先开口，再整理')}`;
    }
    if (/不会.*开头|开头.*怎么写/.test(q)) {
      return `开头不用穿得很华丽，只要让游客知道“要看什么”就好。可以从“各位游客，今天我们一起看看……”起步。现在你来补上后半句，先写这一句，不急着写全文。${guideProgress(30,'先完成一句开场')}`;
    }

    const stats = speechDraftStats(q);
    if (stats.count >= 35) {
      const missing=[];
      if(!stats.hasProcess) missing.push('工序还原');
      if(!stats.hasLiving) missing.push('“活”的阐释');
      if(!stats.hasSpirit) missing.push('毕昇创新精神评价');
      if (!missing.length) {
        resetSpeechCoach();
        return `${mengxiWarm('finish', 2)}你已经写了约${stats.count}字，三个任务要素都找得到。先用1、2、3标出“工序—活—评价”分别在哪一句，再读一遍听听连接是否自然。小生不替你改写全文，但会陪你看看哪一句最值得展开。${guideProgress(100,'骨架已由你完成')}`;
      }
      return `你目前已经写了约${stats.count}字，手里有不少好材料啦。对照任务要求，还缺：<strong>${missing.join('、')}</strong>。先补其中一项就好，别辛苦地把全文推倒重来。${guideProgress(68,'正在补齐任务要素')}`;
    }

    if (asksForReadyMadeAnswer(q)) {
      return `小生可以替你看看有没有漏项，却不能替你把空白填满。先给我一句你自己的话，哪怕只有十几个字；咱们从你的句子往下走，不从我的范文起步。${guideProgress(24,'等待你的第一块积木')}`;
    }

    if (speechCoach.stage === 0) {
      if (/设板|布字|排版|炀|平版|印刷|拆版|刻字|制字/.test(q)) {
        speechCoach.process=q; speechCoach.stage=1; saveSpeechCoach();
        return `${mengxiWarm('praise', 1)}第一块“工序积木”已经放稳了。现在从三个角度选一个：技术之活看操作如何提速；设计之活看字印怎样准备和管理；思维之活看整版怎样被拆成单字。你最想讲哪一个？为什么？${guideProgress(42,'已有工序，开始选择“活”')}`;
      }
      return `我听见你的想法了，只是那道具体工序还藏着呢。请从设板、布字、炀版、平版、印刷、拆版中挑一个，用一句大白话说它做了什么。${guideProgress(24,'先落到一个具体动作')}`;
    }

    if (speechCoach.stage === 1) {
      if (/技术|操作|交替|速度|设计|字库|数印|按韵|思维|拆分|模块|组合|复用|活/.test(q)) {
        speechCoach.living=q; speechCoach.stage=2; saveSpeechCoach();
        return `${mengxiWarm('praise', 2)}这个角度已经有内容了。接下来只写一句“颁奖词”：若给毕昇发一个奖，你会给他什么奖？别只写“创新奖”，还要用一句理由说明他打破了什么旧做法。${guideProgress(64,'已有“活”，正在形成评价')}`;
      }
      return `咱们先做一个小小的选择：操作上的灵活、安排上的巧妙、想法上的突破——三选一。选完只解释一句，不用写得漂亮，真实就好。${guideProgress(46,'把抽象概念缩成一个角度')}`;
    }

    if (speechCoach.stage === 2) {
      if (q.length >= 8) {
        speechCoach.award=q; speechCoach.stage=3; saveSpeechCoach();
        return `你手上的三块积木已经齐啦：①工序；②你选的“活”；③对毕昇的评价。按“工序→活在哪里→为什么值得敬佩”的顺序，用“先、接着、因此、这体现了”等词把它们拼成一段。一定要由你自己来拼，拼完发给小生看看有没有漏项。${guideProgress(82,'三块积木已齐，开始自己组合')}`;
      }
      return `颁奖词不用一开口就很宏大。可以从“最懂拆解”“最会让字重复使用”“最敢打破整版思路”里找一点灵感，不过奖名和理由，得由你亲手写。${guideProgress(66,'把评价落到具体创新')}`;
    }

    return `已经走到组合这一步啦。把现有内容都发来，小生会帮你数文字、检查三个任务要素和工序顺序，但会把最后的表达权留给你。${guideProgress(86,'等待你的完整初稿')}`;
  }

  function handleHuobanGuidance(text) {
    const q=(text||'').trim();
    const currentKey = guidedStudentKey();
    if (guidedDialogue && guidedDialogue.studentKey && guidedDialogue.studentKey !== currentKey) resetGuidedDialogue();
    const freshTopic = findGuidedTopic(q);
    const explicitSpeechRequest = isSpeechWritingTrigger(q);
    // 在解说词写作过程中，学生若临时提出明确的《活板》理解题，先暂停写作教练，正常进入课文引导。
    if (freshTopic && !explicitSpeechRequest && (!guidedDialogue || guidedDialogue.topicId !== freshTopic.id)) {
      resetGuidedDialogue();
      return startGuidedTopic(freshTopic);
    }

    const speech = handleSpeechCoach(q);
    if (speech) return speech;

    if (freshTopic && (!guidedDialogue || guidedDialogue.topicId !== freshTopic.id)) {
      resetGuidedDialogue();
      return startGuidedTopic(freshTopic);
    }

    if (guidedDialogue && guidedDialogue.mode === 'huoban') {
      const topic=guidedTopicById(guidedDialogue.topicId);
      if (topic) return handleTopicTurn(q,topic);
      resetGuidedDialogue();
    }
    if (guidedDialogue && guidedDialogue.mode === 'generic') return handleGenericTurn(q);

    if (freshTopic) return startGuidedTopic(freshTopic);
    if (isGeneralHuobanUnderstanding(q)) return startGenericGuidance(q);
    return '';
  }
  async function answer(q) {
    const text = (q || '').trim();
    if (!text) return '你可以问我课文内容、工序原理、句子翻译，也可以问字音和字义。';

    // V2.28：课下注释词先引导学生回看注释，同时直接给出准确释义。
    const noteAnswer = textbookNoteAnswer(text);
    if (noteAnswer) return noteAnswer;

    // V2.22：所有《活板》内容理解题优先进入自然引导；解说词任务进入写作教练。
    const fullLessonGuidance = handleHuobanGuidance(text);
    if (fullLessonGuidance) return fullLessonGuidance;

    // 旧版“活”的自然探究仅作为兼容兜底。
    const guidedInquiry = handleNaturalLivingDialogue(text);
    if (guidedInquiry) return guidedInquiry;

    // 页面上其余预设的快捷问题走确定映射，保证每个按钮点击后必定答中问题。
    const preset = presetAnswer(text);
    if (preset) return preset;

    if (lastKnowledgeTopic === '令的其他读音' && /^(想|要|好|好的|可以|想知道|讲讲|说说|请讲|请说|是的)[呀啊吧嘛吗！。？?\s]*$/.test(text)) {
      lastKnowledgeTopic = '';
      return '“令”读 lìng 时最常见，可表示命令、使让，也用于“县令”“令尊”等词；读 líng 时常见于复姓“令狐”；读 lǐng 时可作纸张的量词，如“一令纸”。在《活板》“火烧令坚”中必须读 lìng。';
    }

    // 先处理指向非常明确的课文精读题：问什么答什么，避免被句中其他关键词带偏。
    const lessonSpecific = lessonIntentAnswer(text);
    if (lessonSpecific) return lessonSpecific;

    // 明确问“怎么读”时，读音意图优先于普通关键词联想，防止把“松脂”误答成“冒”。
    if (isPronunciationIntent(text)) {
      const target = extractPronunciationTarget(text) || extractLookupTarget(text);
      if (target) lastPronunciationTarget = target;
      const exact = preciseAnswer(text);
      if (exact) return exact;
    }

    // 上一轮问了某字读音，下一轮只补发原文时，把它当作语境补充，而不是另猜一个问题。
    if (!isLexicalIntent(text) && lastPronunciationTarget && text.includes(lastPronunciationTarget)) {
      const contextualFollowup = contextualFollowupForTarget(lastPronunciationTarget, text);
      if (contextualFollowup) return contextualFollowup;
    }

    // 再判断课文内容与理解类问题，避免把“六道工序是什么”误当成逐字注音。
    const content = contentAnswer(text);
    if (content) return content;

    // 人物、著作、技术史与时代背景问题进入结构化知识库；支持‘他/这本书/它’等追问。
    const history = historyAnswer(text);
    if (history) return history;

    // 字义、课文出处、成语等词汇意图进入字词库。
    if (isLexicalIntent(text)) {
      const target = extractLookupTarget(text);
      if (target) lastPronunciationTarget = target;
      const exact = preciseAnswer(text);
      if (exact) return exact;
    }

    // 单独粘贴一小段原文而没有问法时，不凭一个关键词擅自回答别的问题。
    if (isBareSourcePhrase(text)) {
      return '你发来的是课文原句。你想问这句话的读音、翻译，还是其中某个字的读音或意思？请直接点明，例如“脂怎么读”或“这句话是什么意思”。';
    }

    let best = null, score = 0;
    QA.forEach(item => {
      let s = 0;
      item.k.forEach(w => {
        if (w.length === 1 && text.length > 4) return;
        if (text.includes(w)) s += Math.max(2, Math.min(8, w.length * 2));
      });
      if (s > score) { score = s; best = item; }
    });
    if (score >= 4 && best) return best.a;

    if (text.length >= 12 && /(我认为|我觉得|因为|所以|活字|印刷|发明|传播|文化|模块)/.test(text)) {
      return '你的观点很有意思。你可以再补一条课文或资料证据，让“观点—理由—证据”连得更紧。';
    }

    const searched = await onlineAnswer(text);
    if (searched) return searched;

    return '我暂时没有找到足够可靠的答案。请把问题说得更具体一些，或把相关课文句子一起发给我。';
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function addMsg(chat, who, msg) {
    const row = el('div', 'mx-msg ' + who);
    const b = el('div', 'mx-bubble', msg);
    row.appendChild(b);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
    return row;
  }

  function plainText(html) {
    const box = document.createElement('div');
    box.innerHTML = html || '';
    // 思考进度条只用于视觉反馈，不纳入梦溪的语音朗读内容。
    box.querySelectorAll('.mx-guide-progress').forEach(node => node.remove());
    return (box.textContent || box.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function init() {
    const panel = el('section', 'mengxi-panel');
    panel.setAttribute('aria-label', '梦溪语音与文字对话');
    panel.innerHTML = `
      <div class="mx-panel-head">
        <div class="mx-title-wrap">
          <div class="mx-head-img"><img src="assets/mengxi-ip.png" alt="梦溪"></div>
          <div>
            <h3>沈括书童 · 梦溪</h3>
            <span>事实题准确答 · 理解题陪你想</span>
          </div>
        </div>
        <button class="mx-close" type="button" title="关闭对话" aria-label="关闭对话">&times;</button>
      </div>
      <div class="mx-chat" aria-live="polite"></div>
      <div class="mx-chips"></div>
      <div class="mx-voice-status"><span class="mx-voice-hint">点击麦克风后把问题完整说完，停顿约 4 秒再提交</span></div>
      <div class="mx-input">
        <input aria-label="输入问题" placeholder="输入问题，或点击麦克风说话……">
        <button class="mx-mic" type="button" title="开始语音提问" aria-label="开始语音提问">🎙</button>
        <button class="mx-speaker" type="button" title="关闭语音回答" aria-label="关闭语音回答">🔊</button>
        <button class="mx-send" type="button">发送</button>
      </div>
    `;
    document.body.appendChild(panel);

    const float = el('div', 'mengxi-float');
    float.setAttribute('role', 'button');
    float.setAttribute('tabindex', '0');
    float.setAttribute('aria-label', '点击梦溪开始交流');
    float.innerHTML = `
      <div class="mengxi-avatar-wrap" title="点击梦溪，开始交流">
        <div class="mengxi-callout" aria-hidden="true">
          <span class="mx-call-icon"><svg viewBox="0 0 24 24"><path d="M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-7l-4.2 3v-3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"></path><path d="M8 10h8"></path><path d="M8 13h5"></path></svg></span>
          <span class="mx-call-copy"><strong class="mx-call-main">点我交流</strong><small class="mx-call-sub">文字 · 语音都可以</small></span>
        </div>
        <div class="mengxi-avatar"><img src="assets/mengxi-ip.png" alt="梦溪数字助教"></div>
      </div>
    `;
    document.body.appendChild(float);

    const chat = panel.querySelector('.mx-chat');
    const chips = panel.querySelector('.mx-chips');
    const input = panel.querySelector('input');
    const sendBtn = panel.querySelector('.mx-send');
    const micBtn = panel.querySelector('.mx-mic');
    const speakerBtn = panel.querySelector('.mx-speaker');
    const voiceStatus = panel.querySelector('.mx-voice-status');

    let voiceReplyEnabled = localStorage.getItem('mengxiVoiceReply') !== 'off';
    let listening = false;
    let finalTranscript = '';
    let recognition = null;
    let speechVoice = null;
    let cancelVoiceSession = () => {};

    function updateSpeakerButton() {
      speakerBtn.classList.toggle('muted', !voiceReplyEnabled);
      speakerBtn.textContent = voiceReplyEnabled ? '🔊' : '🔇';
      speakerBtn.title = voiceReplyEnabled ? '关闭语音回答' : '开启语音回答';
      speakerBtn.setAttribute('aria-label', speakerBtn.title);
    }

    function setVoiceStatus(text, isListening) {
      voiceStatus.querySelector('.mx-voice-hint').textContent = text;
      voiceStatus.classList.toggle('listening', !!isListening);
      micBtn.classList.toggle('listening', !!isListening);
      micBtn.textContent = isListening ? '■' : '🎙';
      micBtn.title = isListening ? '停止聆听' : '开始语音提问';
      micBtn.setAttribute('aria-label', micBtn.title);
    }

    // 梦溪是小男孩书童：优先选择设备中的中文少年/男声音色。
    // 浏览器系统语音由设备提供，名称并不统一，因此采用“男声加分、女声避让”的评分方式。
    const SPEECH_SETTINGS = {
      rate: .92,
      pitch: .80,
      malePrefer: /yunxi|yunyang|yunjian|yunfeng|yunhao|yunze|yunxia|kangkang|云希|云扬|云健|云枫|云皓|云泽|云夏|康康|male|man|boy|young\s*male|男声|男性|男孩|少年|童声男/i,
      femaleAvoid: /xiaoxiao|xiaoyi|xiaohan|xiaomeng|xiaomo|xiaorui|xiaoshuang|xiaoxuan|xiaoyan|xiaoyou|huihui|yaoyao|ting[-\s]?ting|meijia|sinji|晓晓|晓伊|晓涵|晓梦|晓墨|晓睿|晓双|晓萱|晓颜|晓悠|慧慧|瑶瑶|婷婷|美佳|female|woman|girl|女声|女性|女孩/i
    };

    function chineseVoices() {
      if (!('speechSynthesis' in window)) return [];
      const all = window.speechSynthesis.getVoices() || [];
      const chinese = all.filter(v => /^zh(?:-|_)/i.test(v.lang || ''));
      return chinese.length ? chinese : all;
    }

    function voiceScore(voice) {
      const label = `${voice.name || ''} ${voice.voiceURI || ''}`;
      const lang = (voice.lang || '').replace('_', '-').toLowerCase();
      let score = 0;

      if (SPEECH_SETTINGS.malePrefer.test(label)) score += 140;
      if (SPEECH_SETTINGS.femaleAvoid.test(label)) score -= 180;
      if (lang === 'zh-cn') score += 35;
      else if (lang.startsWith('zh-')) score += 20;
      if (/mandarin|普通话|中文/i.test(label)) score += 12;
      if (voice.localService) score += 4;
      if (voice.default) score += 1;

      return score;
    }

    function refreshVoices() {
      if (!('speechSynthesis' in window)) return;
      const voices = chineseVoices();
      speechVoice = voices
        .map((voice, index) => ({ voice, index, score: voiceScore(voice) }))
        .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.voice || null;
    }

    function speechText(text) {
      let content = plainText(text);
      if (!content) return '';
      // 屏幕保留拼音；朗读时把重点读音改写成可被系统语音稳定读出的现代汉语同音提示。
      return content
        // 屏幕显示规范拼音；语音播报改用现代普通话词语作提示，避免把拼音字母或古文多音字念错。
        .replace(/“令”是多音字，常见读音有 lìng、líng、lǐng。/g, '命令的令，是多音字。常见读音包括：命令的令、令狐的令、纸张量词一令纸的令。')
        .replace(/“火烧令坚”读作：huǒ shāo lìng jiān。/g, '这句话按照现代普通话朗读。这里的令，是命令的令。')
        .replace(/“用讫再火令药镕”读作：yòng qì zài huǒ lìng yào róng。/g, '这句话按照现代普通话朗读。这里的令，是命令的令。')
        .replace(/lìng、líng、lǐng/g, '命令的令、令狐的令、纸张量词一令纸的令')
        .replace(/读 lìng/g, '读命令的令')
        .replace(/读 líng/g, '读令狐的令')
        .replace(/读 lǐng/g, '读纸张量词一令纸的令')
        .replace(/本文“火烧令坚”中的“令”/g, '本文原句中的令')
        .replace(/“?火烧令坚”?/g, '用火烧，使它坚硬')
        .replace(/“?用讫再火令药镕”?/g, '印刷完毕后，再用火烘烤，使黏合材料熔化')
        .replace(/令（lìng）/g, '令，读作命令的令')
        .replace(/令（líng）/g, '令，读作令狐的令')
        .replace(/令（lǐng）/g, '令，读作纸张量词一令纸的令')
        .replace(/炀（yáng）/g, '炀，读作阳')
        .replace(/镕（róng）/g, '镕，读作荣')
        .replace(/砥（dǐ）/g, '砥，读作底')
        .replace(/瀛（yíng）/g, '瀛，读作迎')
        .replace(/拂（fú）/g, '拂，读作福')
        .replace(/讫（qì）/g, '讫，读作气')
        .replace(/贮（zhù）/g, '贮，读作住')
        .replace(/昇（shēng）/g, '昇，读作升')
        .replace(/砺（lì）/g, '砺，读作力')
        .replace(/脂（zhī）/g, '脂，读作树脂的脂')
        .replace(/松脂（sōng zhī）/g, '松脂，松树的松，树脂的脂')
        .replace(/更互用之/g, '轮流交替使用')
        .replace(/“和”读作 huò，混合。这里读 huò，不读 hé。/g, '和，这里读作货物的货，意思是混合，不读和平的和。')
        .replace(/“讫”读作 qì，完毕。/g, '讫，读作空气的气，意思是完毕。')
        .replace(/这里的“和”读 huò/g, '这里的和，读作货物的货')
        .replace(/这里读 huò，不读 hé/g, '这里读作货物的货，不读和平的和')
        .replace(/“讫”读作 qì/g, '讫，读作空气的气')
        .replace(/“讫”读 qì/g, '讫，读作空气的气')
        .replace(/“更”读 gēng(?:（一声）)?/g, '更，读作耕')
        .replace(/“和”读 huò/g, '和，读作货物的货')
        .replace(/“和”读作 huò/g, '和，读作货物的货')
        .replace(/“更互”读作 gēng hù/g, '更互，读作耕互')
        .replace(/“帖”读作 tiè/g, '帖，读作字帖的帖')
        .replace(/“宝藏”读作 bǎo cáng/g, '课文中的宝藏，读作珍藏的藏')
        .replace(/蜡和纸灰/g, '蜡混合纸灰')
        .replace(/以纸帖之/g, '用纸标签标记它')
        .replace(/每韵为一帖/g, '每个韵部做一个标签')
        .replace(/“帖”都读 tiè/g, '帖，都读作字帖的帖')
        .replace(/([一-龥㐀-䶿]+)（[a-zA-Züǖǘǚǜāáǎàēéěèīíǐìōóǒòūúǔùńňǹḿ\s/]+）/g, '$1')
        .replace(/[a-zA-Züǖǘǚǜāáǎàēéěèīíǐìōóǒòūúǔùńňǹḿ]+(?:\s+[a-zA-Züǖǘǚǜāáǎàēéěèīíǐìōóǒòūúǔùńňǹḿ]+)*/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function speak(text, forcePreview) {
      if ((!voiceReplyEnabled && !forcePreview) || !('speechSynthesis' in window)) return;
      const content = speechText(text);
      if (!content) return;
      refreshVoices();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'zh-CN';
      utterance.rate = SPEECH_SETTINGS.rate;
      utterance.pitch = SPEECH_SETTINGS.pitch;
      utterance.volume = 1;
      if (speechVoice) utterance.voice = speechVoice;
      utterance.onstart = () => setVoiceStatus('梦溪正在回答……', false);
      utterance.onend = () => setVoiceStatus('可以继续输入问题，或点击麦克风说话。', false);
      utterance.onerror = () => setVoiceStatus('语音播放没有成功，文字答案仍可正常查看。', false);
      window.speechSynthesis.speak(utterance);
    }

    function openPanel(focusInput) {
      panel.classList.add('open');
      if (focusInput) setTimeout(() => input.focus(), 80);
    }

    addMsg(chat, 'bot', '同学你好呀，我是沈括身边的小书童梦溪。你有读不准的字、想不明白的句子，都可以来找我。遇到《活板》的理解题，我不会急着把答案递给你，而会陪你翻原文、找线索、慢慢想明白；到了活字解说馆，我也会陪你搭句子，但把最珍贵的表达留给你自己。');

    quick.forEach(q => {
      const chip = el('button', 'mx-chip', q);
      chip.type = 'button';
      chip.onclick = () => { input.value = q; send(false); };
      chips.appendChild(chip);
    });

    async function replyTo(q, fromVoice) {
      setVoiceStatus('梦溪正在理解问题；需要时会联网检索并整理答案……', false);
      const response = await answer(q);
      addMsg(chat, 'bot', response);
      setVoiceStatus('可以继续输入问题，或点击麦克风说话。', false);
      if (fromVoice || voiceReplyEnabled) speak(response);
    }

    function send(fromVoice) {
      const q = input.value.trim();
      if (!q) return;
      openPanel(false);
      addMsg(chat, 'user', q);
      input.value = '';
      setVoiceStatus(fromVoice ? '已识别你的问题，梦溪正在回答……' : '可继续输入，或点击麦克风说话。', false);
      replyTo(q, !!fromVoice);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let voiceSessionActive = false;
      let voiceSessionStartedAt = 0;
      let lastVoiceActivityAt = 0;
      let silenceSubmitTimer = null;
      let maximumListenTimer = null;
      let shouldSubmitOnEnd = false;
      let restartingRecognition = false;

      const MIN_LISTEN_MS = 1800;
      const SILENCE_SUBMIT_MS = 4000;
      const MAX_LISTEN_MS = 60000;

      function clearVoiceTimers() {
        if (silenceSubmitTimer) clearTimeout(silenceSubmitTimer);
        if (maximumListenTimer) clearTimeout(maximumListenTimer);
        silenceSubmitTimer = null;
        maximumListenTimer = null;
      }

      function currentTranscript() {
        return (input.value || finalTranscript || '').trim();
      }

      function scheduleSilenceSubmit() {
        if (silenceSubmitTimer) clearTimeout(silenceSubmitTimer);
        const elapsed = Date.now() - voiceSessionStartedAt;
        const wait = Math.max(SILENCE_SUBMIT_MS, MIN_LISTEN_MS - elapsed);
        silenceSubmitTimer = setTimeout(() => {
          if (!voiceSessionActive || !currentTranscript()) return;
          const quietFor = Date.now() - lastVoiceActivityAt;
          if (quietFor < SILENCE_SUBMIT_MS - 120) {
            scheduleSilenceSubmit();
            return;
          }
          shouldSubmitOnEnd = true;
          voiceSessionActive = false;
          setVoiceStatus('已听完，正在整理你的完整问题……', false);
          try { recognition.stop(); } catch (_) {
            const q = currentTranscript();
            if (q) {
              input.value = q;
              send(true);
            }
          }
        }, wait);
      }

      function beginVoiceSession() {
        clearVoiceTimers();
        voiceSessionActive = true;
        shouldSubmitOnEnd = false;
        restartingRecognition = false;
        voiceSessionStartedAt = Date.now();
        lastVoiceActivityAt = voiceSessionStartedAt;
        finalTranscript = '';
        input.value = '';

        maximumListenTimer = setTimeout(() => {
          if (!voiceSessionActive) return;
          shouldSubmitOnEnd = !!currentTranscript();
          voiceSessionActive = false;
          setVoiceStatus(
            shouldSubmitOnEnd ? '已达到单次提问时长，正在整理问题……' : '没有听到有效内容，请再试一次。',
            false
          );
          try { recognition.stop(); } catch (_) {}
        }, MAX_LISTEN_MS);

        try {
          recognition.start();
        } catch (_) {
          voiceSessionActive = false;
          clearVoiceTimers();
          setVoiceStatus('麦克风正在启动，请稍候再试。', false);
        }
      }

      cancelVoiceSession = () => {
        voiceSessionActive = false;
        shouldSubmitOnEnd = false;
        restartingRecognition = false;
        clearVoiceTimers();
        try { recognition.abort(); } catch (_) {
          try { recognition.stop(); } catch (__) {}
        }
      };

      recognition.onstart = () => {
        listening = true;
        restartingRecognition = false;
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        openPanel(false);
        setVoiceStatus('正在聆听。请把问题完整说完，停顿约 4 秒后我再回答；也可点击方块结束。', true);
      };

      recognition.onresult = event => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const phrase = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += phrase;
          else interim += phrase;
        }
        input.value = (finalTranscript + interim).trim();
        lastVoiceActivityAt = Date.now();
        setVoiceStatus(
          interim ? `正在听：${interim}` : '已听到这部分，请继续说；停顿约 4 秒后提交。',
          true
        );
        scheduleSilenceSubmit();
      };

      recognition.onerror = event => {
        // Chrome 在自动重启连续识别时偶尔会抛出 aborted，不作为真正错误提示。
        if (event.error === 'aborted') return;
        const messages = {
          'not-allowed': '未获得麦克风权限，请在浏览器地址栏允许使用麦克风。',
          'service-not-allowed': '浏览器禁止了语音识别服务，请检查网站权限。',
          'no-speech': '暂时没有听到声音；我会继续等你说完整问题。',
          'audio-capture': '没有检测到可用麦克风。',
          'network': '语音识别服务暂时无法连接，请稍后再试。'
        };
        if (event.error === 'no-speech' && voiceSessionActive) {
          setVoiceStatus('我还在听，请继续说；停顿约 4 秒后才会提交。', true);
          return;
        }
        voiceSessionActive = false;
        shouldSubmitOnEnd = false;
        clearVoiceTimers();
        setVoiceStatus(messages[event.error] || '语音识别未成功，请再试一次或改用文字输入。', false);
      };

      recognition.onend = () => {
        listening = false;
        micBtn.classList.remove('listening');

        const q = currentTranscript();
        if (shouldSubmitOnEnd) {
          clearVoiceTimers();
          shouldSubmitOnEnd = false;
          if (q) {
            input.value = q;
            send(true);
          } else {
            setVoiceStatus('没有听到有效内容，请再试一次。', false);
          }
          return;
        }

        // 浏览器可能在一句话中途自行结束识别；会话仍有效时自动续听，不立即提交。
        if (voiceSessionActive) {
          const elapsed = Date.now() - voiceSessionStartedAt;
          if (elapsed < MAX_LISTEN_MS) {
            restartingRecognition = true;
            setTimeout(() => {
              if (!voiceSessionActive) return;
              try {
                recognition.start();
              } catch (_) {
                setTimeout(() => {
                  if (!voiceSessionActive) return;
                  try { recognition.start(); } catch (__) {}
                }, 350);
              }
            }, 180);
            return;
          }
        }

        clearVoiceTimers();
        if (!voiceStatus.textContent.includes('权限') && !voiceStatus.textContent.includes('麦克风')) {
          setVoiceStatus('点击麦克风即可说话，梦溪会等你把问题说完整。', false);
        }
      };

      micBtn.onclick = () => {
        openPanel(false);
        if (voiceSessionActive || listening || restartingRecognition) {
          shouldSubmitOnEnd = !!currentTranscript();
          voiceSessionActive = false;
          clearVoiceTimers();
          setVoiceStatus(
            shouldSubmitOnEnd ? '已停止聆听，正在整理你的问题……' : '已停止聆听。',
            false
          );
          try { recognition.stop(); } catch (_) {
            if (shouldSubmitOnEnd) {
              const q = currentTranscript();
              shouldSubmitOnEnd = false;
              if (q) {
                input.value = q;
                send(true);
              }
            }
          }
          return;
        }
        beginVoiceSession();
      };
    } else {
      micBtn.disabled = true;
      micBtn.title = '当前浏览器不支持语音识别';
      setVoiceStatus('当前浏览器不支持语音识别，建议使用最新版 Chrome 或 Edge；文字交流仍可正常使用。', false);
    }

    if ('speechSynthesis' in window) {
      refreshVoices();
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    } else {
      voiceReplyEnabled = false;
      speakerBtn.disabled = true;
      speakerBtn.title = '当前浏览器不支持语音播报';
    }
    refreshVoices();
    updateSpeakerButton();
    setVoiceStatus('点击麦克风后把问题完整说完，停顿约 4 秒再提交。', false);

    speakerBtn.onclick = () => {
      voiceReplyEnabled = !voiceReplyEnabled;
      localStorage.setItem('mengxiVoiceReply', voiceReplyEnabled ? 'on' : 'off');
      if (!voiceReplyEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      updateSpeakerButton();
      setVoiceStatus(voiceReplyEnabled ? '语音回答已开启。' : '语音回答已关闭，仍可使用文字交流。', false);
      if (voiceReplyEnabled) speak('语音回答已开启。');
    };

    const togglePanel = () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) input.focus();
    };
    float.onclick = togglePanel;
    float.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      }
    });
    panel.querySelector('.mx-close').onclick = () => {
      panel.classList.remove('open');
      if (recognition) cancelVoiceSession();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
    sendBtn.onclick = () => send(false);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(false); });

    document.addEventListener('mengxiThinkingStarUnlocked', () => {
      panel.classList.add('mx-think-unlocked');
      try { if (typeof window.renderStudentPass === 'function') window.renderStudentPass(); } catch (_) {}
      setTimeout(() => panel.classList.remove('mx-think-unlocked'), 1800);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
