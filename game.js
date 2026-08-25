const rounds = [
  ['nalivan neljai na a, naulja i nu u, medani na a u ljangi', '虛詞', ['虛詞', '這個節日很快樂，收穫祭在土坂的頭目的家', '我們這個節日要很看重']],
  ['tjasane taliduwan, amasu cavilj itjumaq, itjumaq qe i tjuabar', '這個節日很快樂，收穫祭在土坂的頭目的家', ['這個是我們祖先預定的節日，後代的人要傳承下去', '這個節日很快樂，收穫祭在土坂的頭目的家', '虛詞']],
  ['linana alaucu ni i, ya vuvu lja nu tja a, kisusu u wan nanga', '這個是我們祖先預定的節日，後代的人要傳承下去', ['我們這個節日（收穫祭），當作很珍貴的儀式，要很看重', '這個是我們祖先預定的節日，後代的人要傳承下去', '這個節日很快樂，收穫祭在土坂的頭目的家']],
  ['tjasane pazang nanga, alaucu a tja a, palisiyan a nanga', '我們這個節日（收穫祭），當作很珍貴的儀式，要很看重', ['虛詞', '這個節日很快樂，收穫祭在土坂的頭目的家', '我們這個節日（收穫祭），當作很珍貴的儀式，要很看重']]
];
const verses = rounds.map(([line, meaning]) => [line, meaning]);
const fills = [
  ['nalivan neljai na a, naulja i nu u, ________', 'medani na a u ljangi', ['medani na a u ljangi', 'kisusu u wan nanga', 'palisiyan a nanga']],
  ['tjasane taliduwan, amasu cavilj itjumaq, ________', 'itjumaq qe i tjuabar', ['itjumaq qe i tjuabar', 'naulja i nu u', 'alaucu a tja a']],
  ['linana alaucu ni i, ya vuvu lja nu tja a, ________', 'kisusu u wan nanga', ['palisiyan a nanga', 'kisusu u wan nanga', 'medani na a u ljangi']],
  ['tjasane pazang nanga, alaucu a tja a, ________', 'palisiyan a nanga', ['itjumaq qe i tjuabar', 'palisiyan a nanga', 'kisusu u wan nanga']]
];
const memories = [
  ['nalivan neljai na a, naulja i nu u, medani na a u ljangi', 'nalivan neljai na a, naulja i nu u, ________', 'medani na a u ljangi', ['kisusu u wan nanga', 'medani na a u ljangi', 'palisiyan a nanga']],
  ['tjasane taliduwan, amasu cavilj itjumaq, itjumaq qe i tjuabar', 'tjasane taliduwan, ________, itjumaq qe i tjuabar', 'amasu cavilj itjumaq', ['amasu cavilj itjumaq', 'alaucu a tja a', 'ya vuvu lja nu tja a']],
  ['linana alaucu ni i, ya vuvu lja nu tja a, kisusu u wan nanga', 'linana alaucu ni i, ya vuvu lja nu tja a, ________', 'kisusu u wan nanga', ['palisiyan a nanga', 'kisusu u wan nanga', 'medani na a u ljangi']],
  ['tjasane pazang nanga, alaucu a tja a, palisiyan a nanga', 'tjasane pazang nanga, ________, palisiyan a nanga', 'alaucu a tja a', ['naulja i nu u', 'alaucu a tja a', 'itjumaq qe i tjuabar']]
];
const $ = id => document.getElementById(id);
const audio = $('audio');
const lineAudio = new Audio();
const miniCd = $('mini-cd');
const miniTip = $('mini-tip');
const scrollToStep = id => document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
let r = 0, s = 0, locked = false, fr = 0, fs = 0, fillLocked = false, mr = 0, ms = 0;

const wordLessons = [
  { phrase: 'tja sane taliduan', meaning: '我們熱鬧地過收穫祭', context: '記憶提示：先認識收穫祭熱鬧的情境。' },
  { phrase: 'a masucavilj i tjumaq', meaning: '在頭目的家', context: '記憶提示：把這句和「頭目的家」連在一起。' },
  { phrase: 'i tjumaq i tjuabar', meaning: '在土坂', context: '記憶提示：這句指出地點是土坂。' },
  { phrase: 'tja santaliduan a masuvaqu', meaning: '我們要享受收穫祭熱鬧的感覺', context: '記憶提示：把這句和「收穫祭的熱鬧」連在一起。' },
  { phrase: 'ni vuvu lja', meaning: 'vuvu 們的／祖先們的', context: '校正提示：ni vuvu lja 要放在相關語句的前面理解。' },
  { phrase: 'kisusu u wan nanga', meaning: '我們要跟隨、依循', context: '記憶提示：這裡著重的是「跟隨、依循」。' },
  { phrase: 'tja san pazangal a cua palisian anga', meaning: '我們要重視這個祭儀', context: '記憶提示：把這句和「看重祭儀」連在一起。' }
];
const wordPractice = [
  { phrase: 'kisusu u wan nanga', answer: '我們要跟隨、依循', choices: ['我們要跟隨、依循', '我們要享受收穫祭的熱鬧'] },
  { phrase: 'tja santaliduan a masuvaqu', answer: '我們要享受收穫祭熱鬧的感覺', choices: ['我們要重視這個祭儀', '我們要享受收穫祭熱鬧的感覺'] },
  { phrase: 'tja san pazangal a cua palisian anga', answer: '我們要重視這個祭儀', choices: ['我們要重視這個祭儀', '我們要跟隨、依循'] }
];
let wordIndex = 0, practiceIndex = 0, practiceScore = 0;
let meaningsVisible = false;

function installWordSchool() {
  const style = document.createElement('style');
  style.textContent = `.word-school{max-width:none;padding:clamp(3rem,8vw,6rem) max(1.5rem,calc((100vw - 800px)/2));background:#f7f2e8}.word-card{margin:1.5rem 0;padding:clamp(1.3rem,4vw,2rem);background:#fffaf0;border:1px solid #d8cdbb;box-shadow:0 12px 25px #162c2c12}.word-count{color:var(--rust);font-size:.78rem;font-weight:bold}.word-original{font-family:Georgia,"Noto Serif TC",serif;font-size:clamp(1.5rem,5vw,2.35rem);line-height:1.35;margin:.7rem 0}.word-meaning{font-size:1.1rem;line-height:1.6;margin:.7rem 0}.word-context{color:#65716d;line-height:1.55}.word-actions{display:flex;gap:.7rem;flex-wrap:wrap}.word-actions button{border:0;padding:.85rem 1.1rem;font-weight:bold}.word-actions .listen{background:var(--gold);color:var(--ink)}.word-actions .continue{background:var(--ink);color:#fff}.learning-note{font-size:.82rem;color:#65716d;line-height:1.55}.practice-box{margin-top:1.7rem;padding:1.4rem;background:#efe5d3}.practice-box h3{font-family:Georgia,"Noto Serif TC",serif;font-size:1.35rem;margin:.2rem 0 .5rem}@media(max-width:600px){.word-school{padding:3rem 1.1rem}.word-actions button{flex:1;min-height:48px}}`;
  document.head.append(style);
  const section = document.createElement('section');
  section.className = 'word-school'; section.id = 'word-school';
  section.innerHTML = `<p class="eyebrow">暖身｜詞語小教室</p><h2>先認識歌裡的關鍵短語</h2><p class="hint">不用一次背完整句。先看短語、中文情境，再到歌曲裡找出它。</p><div class="word-card"><span class="word-count" id="word-count"></span><div class="word-original" id="word-original"></div><p class="word-meaning" id="word-meaning"></p><p class="word-context" id="word-context"></p><div class="word-actions"><button class="listen" id="word-listen">▶ 聽歌曲</button><button class="continue" id="word-next">下一個短語 →</button></div></div><p class="learning-note">註：原始資料提供的是整句中文對照；此處以歌曲中的短語搭配整句情境學習，不當作逐字詞典。</p><div class="practice-box" id="word-practice" hidden><p class="eyebrow">小練習</p><h3 id="practice-prompt"></h3><p class="hint">選一個最接近的中文情境。</p><div class="choices" id="practice-choices"></div><p class="memory-result" id="practice-result"></p></div>`;
  const lyricsSection = document.querySelector('.lyrics');
  lyricsSection.after(section);
  document.querySelector('.intro').textContent = '先聽、先讀完整歌詞，再學關鍵短語，最後進入遊戲。';
  document.querySelector('.study-note p').innerHTML = '<strong>讀完歌詞了嗎？</strong><br>接著認識歌裡的關鍵短語。';
  $('start').textContent = '進入族語小教室 →';
  $('word-listen').onclick = () => audio.paused ? audio.play() : audio.pause();
  $('word-next').onclick = () => {
    if (wordIndex < wordLessons.length - 1) { wordIndex++; renderWordLesson(); return; }
    $('word-practice').hidden = false; renderWordPractice(); $('word-practice').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  renderWordLesson();
}

function installLyricPractice() {
  const style = document.createElement('style');
  style.textContent = `.lyric-tools{display:flex;gap:.7rem;flex-wrap:wrap;margin:1.4rem 0}.lyric-tools button{border:1px solid #d8cdbb;background:#fffaf0;color:var(--ink);padding:.8rem 1rem;font-weight:bold}.verse-list article.practice-line{grid-template-columns:3.3rem minmax(0,1fr);gap:.8rem;align-items:start;padding:1.35rem .4rem}.line-play{width:2.8rem;height:2.8rem;border:0;border-radius:50%;background:var(--rust);color:#fff;font-size:1.05rem}.line-copy{min-width:0}.line-copy p{font-family:Georgia,"Noto Serif TC",serif;font-weight:bold}.line-copy small{display:block;margin-top:.55rem;color:var(--leaf);line-height:1.55}.line-meaning[hidden]{display:none}.practice-line.playing{background:#fff5de}.practice-line.playing .line-play{background:var(--gold);color:var(--ink)}@media(max-width:600px){.lyric-tools button{flex:1;min-height:48px}.verse-list article.practice-line{grid-template-columns:2.9rem minmax(0,1fr)}}`;
  document.head.append(style);
  const tools = document.createElement('div');
  tools.className = 'lyric-tools';
  tools.innerHTML = '<button id="toggle-meanings" aria-expanded="false">顯示中文</button><button id="play-all-lines">▶ 全部播放</button>';
  $('verses').before(tools);
  $('toggle-meanings').onclick = () => {
    meaningsVisible = !meaningsVisible;
    document.querySelectorAll('.line-meaning').forEach(item => { item.hidden = !meaningsVisible; });
    $('toggle-meanings').textContent = meaningsVisible ? '隱藏中文' : '顯示中文';
    $('toggle-meanings').setAttribute('aria-expanded', String(meaningsVisible));
  };
  $('play-all-lines').onclick = () => { lineAudio.pause(); audio.paused ? audio.play() : audio.pause(); };
}

function renderWordLesson() {
  const item = wordLessons[wordIndex];
  $('word-count').textContent = `短語 ${wordIndex + 1} / ${wordLessons.length}`;
  $('word-original').textContent = item.phrase; $('word-meaning').textContent = item.meaning; $('word-context').textContent = item.context;
  $('word-next').textContent = wordIndex === wordLessons.length - 1 ? '做個小練習 →' : '下一個短語 →';
}

function renderWordPractice() {
  const item = wordPractice[practiceIndex];
  $('practice-prompt').textContent = item.phrase; $('practice-result').textContent = `第 ${practiceIndex + 1} / ${wordPractice.length} 題`;
  $('practice-choices').innerHTML = '';
  item.choices.forEach(choice => { const button = document.createElement('button'); button.textContent = choice; button.onclick = () => chooseWordPractice(choice, button); $('practice-choices').append(button); });
}

function chooseWordPractice(choice, button) {
  const item = wordPractice[practiceIndex];
  if (choice !== item.answer) { $('practice-result').textContent = '沒關係，再選一次。'; return; }
  button.classList.add('correct'); practiceScore++; $('practice-result').textContent = '答對了！你已經抓到這個短語的情境。';
  setTimeout(() => {
    if (practiceIndex === wordPractice.length - 1) {
      $('practice-result').textContent = `族語暖身完成！你答對 ${practiceScore} / ${wordPractice.length} 題，準備進入遊戲。`;
      miniCd.hidden = false; miniTip.hidden = false; $('game').hidden = false; render();
      requestAnimationFrame(() => $('game').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else { practiceIndex++; renderWordPractice(); }
  }, 850);
}

function lyrics() {
  const lineFiles = ['line-1.mp3', 'line-2.mp3', 'line-3.mp3', 'line-4.mp3'];
  $('verses').innerHTML = verses.map((v, index) => `<article class="practice-line" data-line="${index}"><button class="line-play" aria-label="播放第 ${index + 1} 句">▶</button><div class="line-copy"><p>${v[0]}</p><small class="line-meaning" hidden>${v[1]}</small></div></article>`).join('');
  document.querySelectorAll('.practice-line').forEach((article, index) => {
    const button = article.querySelector('.line-play');
    button.onclick = () => {
      if (lineAudio.dataset.line === String(index) && !lineAudio.paused) {
        lineAudio.pause(); article.classList.remove('playing'); button.textContent = '▶'; button.setAttribute('aria-label', `繼續播放第 ${index + 1} 句`); return;
      }
      audio.pause();
      document.querySelectorAll('.practice-line').forEach(line => line.classList.remove('playing'));
      document.querySelectorAll('.line-play').forEach((item, itemIndex) => { item.textContent = '▶'; item.setAttribute('aria-label', `播放第 ${itemIndex + 1} 句`); });
      if (lineAudio.dataset.line !== String(index) || lineAudio.ended) { lineAudio.src = lineFiles[index]; lineAudio.dataset.line = String(index); }
      article.classList.add('playing'); button.textContent = 'Ⅱ'; button.setAttribute('aria-label', `暫停第 ${index + 1} 句`); lineAudio.play();
      lineAudio.onended = () => { article.classList.remove('playing'); button.textContent = '▶'; button.setAttribute('aria-label', `播放第 ${index + 1} 句`); lineAudio.currentTime = 0; };
    };
  });
}

function render() {
  const x = rounds[r];
  $('round').textContent = `第 ${r + 1} 句`; $('prompt').textContent = x[0];
  $('bar').style.width = `${(r + 1) / rounds.length * 100}%`; $('score').textContent = `答對 ${s} / ${rounds.length} 句`;
  $('choices').innerHTML = '';
  x[2].forEach(choice => { const b = document.createElement('button'); b.textContent = choice; b.onclick = () => choose(choice, b); $('choices').append(b); });
  $('feedback').hidden = true; locked = false;
}
function choose(choice, button) {
  if (locked) return;
  $('feedback').hidden = false;
  if (choice !== rounds[r][1]) { $('message').textContent = '再試一次，選擇另一個答案。'; $('next').hidden = true; return; }
  locked = true; s++; button.classList.add('correct'); $('message').textContent = '答對了！繼續下一句。'; $('next').hidden = false;
  $('next').textContent = r === rounds.length - 1 ? '進入填空遊戲 →' : '下一句 →'; $('score').textContent = `答對 ${s} / ${rounds.length} 句`;
}
function renderFill() {
  const x = fills[fr];
  $('fill-round').textContent = `第 ${fr + 1} 句`; $('fill-prompt').textContent = x[0];
  $('fill-bar').style.width = `${(fr + 1) / fills.length * 100}%`; $('fill-score').textContent = `答對 ${fs} / ${fills.length} 句`;
  $('fill-choices').innerHTML = '';
  x[2].forEach(choice => { const b = document.createElement('button'); b.textContent = choice; b.onclick = () => chooseFill(choice, b); $('fill-choices').append(b); });
  $('fill-feedback').hidden = true; fillLocked = false;
}
function chooseFill(choice, button) {
  if (fillLocked) return;
  $('fill-feedback').hidden = false;
  if (choice !== fills[fr][1]) { $('fill-message').textContent = '再試一次，選擇另一個答案。'; $('fill-next').hidden = true; return; }
  fillLocked = true; fs++; button.classList.add('correct'); $('fill-message').textContent = '填對了，太棒了！'; $('fill-next').hidden = false;
  $('fill-next').textContent = fr === fills.length - 1 ? '從頭再玩 ↺' : '下一句 →'; $('fill-score').textContent = `答對 ${fs} / ${fills.length} 句`;
}
function renderMemory() {
  const x = memories[mr];
  $('memory-card').textContent = x[0]; $('memory-card').classList.remove('hidden-line'); $('memory-choices').hidden = true;
  $('memory-choices').innerHTML = ''; $('memory-result').textContent = `第 ${mr + 1} 句｜先記住這一句…`;
  setTimeout(() => {
    $('memory-card').textContent = x[1]; $('memory-card').classList.add('hidden-line'); $('memory-choices').hidden = false;
    x[3].forEach(choice => { const b = document.createElement('button'); b.textContent = choice; b.onclick = () => chooseMemory(choice, b); $('memory-choices').append(b); });
    $('memory-result').textContent = '哪一段應該填入空格？';
  }, 3000);
}
function chooseMemory(choice, button) {
  if ($('memory-choices').dataset.done) return;
  if (choice !== memories[mr][2]) { $('memory-result').textContent = '再想一下，還可以再選一次。'; return; }
  $('memory-choices').dataset.done = 'yes'; ms++; button.classList.add('correct');
  $('memory-result').textContent = `答對了！記憶分數：${ms} / ${memories.length}`;
  setTimeout(() => {
    $('memory-choices').dataset.done = '';
    if (mr === memories.length - 1) {
      $('memory-result').textContent = `記憶挑戰完成！答對 ${ms} / ${memories.length} 句。`;
      $('fill-game').hidden = false; $('fill-game').scrollIntoView({ behavior: 'smooth' }); renderFill();
    } else { mr++; renderMemory(); scrollToStep('memory-game'); }
  }, 1300);
}

$('start').onclick = () => { scrollToStep('word-school'); };
$('next').onclick = () => { if (r === rounds.length - 1) { $('memory-game').hidden = false; scrollToStep('memory-game'); } else { r++; render(); scrollToStep('game'); } };
$('fill-next').onclick = () => { if (fr === fills.length - 1) { fr = 0; fs = 0; renderFill(); } else { fr++; renderFill(); } scrollToStep('fill-game'); };
$('memory-start').onclick = () => { mr = 0; ms = 0; $('memory-start').hidden = true; renderMemory(); };
$('play').onclick = () => audio.paused ? audio.play() : audio.pause();
$('restart').onclick = () => { audio.currentTime = 0; audio.play(); };
miniCd.onclick = () => audio.paused ? audio.play() : audio.pause();
audio.onplay = () => { $('play').textContent = 'Ⅱ'; $('status').textContent = '正在播放'; miniCd.classList.add('playing'); miniCd.setAttribute('aria-label', '暫停錄音'); miniTip.textContent = '點擊暫停音檔'; if ($('play-all-lines')) $('play-all-lines').textContent = 'Ⅱ 全部暫停'; };
audio.onpause = () => { $('play').textContent = '▶'; $('status').textContent = '準備聆聽'; miniCd.classList.remove('playing'); miniCd.setAttribute('aria-label', '播放錄音'); miniTip.textContent = '點擊播放音檔'; if ($('play-all-lines')) $('play-all-lines').textContent = '▶ 全部播放'; };
audio.onended = () => { $('play').textContent = '▶'; $('status').textContent = '準備聆聽'; miniCd.classList.remove('playing'); miniCd.setAttribute('aria-label', '播放錄音'); miniTip.textContent = '點擊播放音檔'; if ($('play-all-lines')) $('play-all-lines').textContent = '▶ 全部播放'; audio.currentTime = 0; };
lyrics();
installLyricPractice();
installWordSchool();
