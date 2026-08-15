// ── Canlıya alırken burayı güncelle ──────────────────────────────────
const BACKEND_BASE = "https://yarim-hatirla-backend.vercel.app";
// ──────────────────────────────────────────────────────────────────────
const SEARCH_URL = `${BACKEND_BASE}/api/search`;
const LYRICS_URL = `${BACKEND_BASE}/api/lyrics`;

const I18N = {
  tr:{
    siteName:"Yarım Hatırla",
    eyebrow:"o şarkı var ya...",
    heroLine1:"Adını unuttun,",
    heroLine2:"ama <em>hissini</em> hatırlıyorsun.",
    heroSub:"Tek bir dizeyi, hatta yanlış hatırladığın birkaç kelimeyi yaz. Genius'un devasa söz arşivinde arayalım.",
    searchLabel:"hatırladığın kadarını yaz",
    placeholder:"örneğin: you were looking so beautiful",
    hint:"kelimeler eksik veya yanlış olabilir, sorun değil",
    searchButton:"Şarkımı bul",
    searching:"aranıyor...",
    backendNote:"gerçek sonuçlar için backend'in çalışıyor olması gerekir: <code>python app.py</code> (bkz. backend/README.md)",
    footerLine:"“Adını bilmiyorsan sorun değil, hatırladığın kadarı yeter.”",
    footerNote:"arama sonuçları Genius'un söz arşivinden geliyor",
    resultsHeading:"en yakın sonuçlar",
    resultsSub:"Genius arama sonuçlarına göre sıralandı",
    notThis:"bu değil",
    viewLyrics:"Genius'ta sözleri gör",
    showLyrics:"sözleri göster",
    hideLyrics:"sözleri gizle",
    loadingLyrics:"sözler getiriliyor...",
    lyricsUnavailable:"tam sözler burada bulunamadı — Genius'ta görebilirsin",
    lyricsSource:"kaynak: lyrics.ovh",
    foundQ:"buldun mu? 👀",
    yesBtn:"evet! 🎉",
    noBtn:"hayır ❌",
    celebrate:"harika! iyi ki hatırlamışsın 🎶",
    empty:"bu dizeyle eşleşen bir şey bulamadım. bir kaç kelime daha dener misin?",
    noMore:"başka eşleşme kalmadı",
    typeHint:"aramak için en az birkaç kelime yaz",
    errBackend:"backend'e ulaşılamadı. terminalde backend klasöründe \"python app.py\" çalıştırdığından emin ol.",
    errKey:"backend çalışıyor ama Genius API key'i eksik. app.py içindeki GENIUS_ACCESS_TOKEN satırını doldur.",
    errGeneric:"bir şeyler ters gitti, birazdan tekrar dene."
  },
  en:{
    siteName:"Half Remembered",
    eyebrow:"you know the one...",
    heroLine1:"Forgot the title,",
    heroLine2:"still remember <em>how it felt</em>.",
    heroSub:"Type one line, even a few words you're not sure about. We'll search Genius's lyric archive.",
    searchLabel:"type what you remember",
    placeholder:"e.g. you were looking so beautiful",
    hint:"words can be missing or wrong, that's fine",
    searchButton:"Find my song",
    searching:"searching...",
    backendNote:"real results need the backend running: <code>python app.py</code> (see backend/README.md)",
    footerLine:"“If you don't know the title, that's fine. What you remember is enough.”",
    footerNote:"results come from Genius's lyric archive",
    resultsHeading:"closest matches",
    resultsSub:"ranked by Genius search relevance",
    notThis:"not this",
    viewLyrics:"view lyrics on Genius",
    showLyrics:"show lyrics",
    hideLyrics:"hide lyrics",
    loadingLyrics:"fetching lyrics...",
    lyricsUnavailable:"full lyrics not found here — you can view them on Genius",
    lyricsSource:"source: lyrics.ovh",
    foundQ:"found it? 👀",
    yesBtn:"yes! 🎉",
    noBtn:"no ❌",
    celebrate:"nice! glad you remembered it 🎶",
    empty:"couldn't match that line to anything. try a few different words?",
    noMore:"no more matches left",
    typeHint:"type at least a few words to search",
    errBackend:"couldn't reach the backend. make sure you ran \"python app.py\" in the backend folder.",
    errKey:"backend is running but the Genius API key is missing. fill in GENIUS_ACCESS_TOKEN in app.py.",
    errGeneric:"something went wrong, try again in a moment."
  },
  ru:{
    siteName:"Наполовину помню",
    eyebrow:"ну та песня...",
    heroLine1:"Забыл название,",
    heroLine2:"но помнишь <em>ощущение</em>.",
    heroSub:"Напиши одну строчку, даже неточную. Мы поищем в архиве текстов Genius.",
    searchLabel:"напиши, что помнишь",
    placeholder:"например: you were looking so beautiful",
    hint:"слова могут быть неточными — это нормально",
    searchButton:"Найти песню",
    searching:"ищем...",
    backendNote:"для реальных результатов backend должен быть запущен: <code>python app.py</code> (см. backend/README.md)",
    footerLine:"«Не помнишь название? Ничего страшного. Хватит и того, что помнишь».",
    footerNote:"результаты поиска берутся из архива текстов Genius",
    resultsHeading:"ближайшие совпадения",
    resultsSub:"отсортировано по релевантности поиска Genius",
    notThis:"не то",
    viewLyrics:"посмотреть текст на Genius",
    showLyrics:"показать текст",
    hideLyrics:"скрыть текст",
    loadingLyrics:"загружаем текст...",
    lyricsUnavailable:"полный текст здесь не найден — посмотри на Genius",
    lyricsSource:"источник: lyrics.ovh",
    foundQ:"нашли? 👀",
    yesBtn:"да! 🎉",
    noBtn:"нет ❌",
    celebrate:"отлично! рад, что вспомнили 🎶",
    empty:"ничего похожего не нашлось. попробуй другие слова?",
    noMore:"больше совпадений нет",
    typeHint:"напиши хотя бы несколько слов",
    errBackend:"не удалось подключиться к backend. убедись, что в папке backend запущен \"python app.py\".",
    errKey:"backend работает, но не задан ключ Genius API. заполни GENIUS_ACCESS_TOKEN в app.py.",
    errGeneric:"что-то пошло не так, попробуй ещё раз."
  }
};

let currentLang = "tr";
let allResults = [];
let shownCount = 0;
let slots = [];

function t(key){ return I18N[currentLang][key] || key; }

function applyI18n(){
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(I18N[currentLang][key]!==undefined) el.innerHTML = I18N[currentLang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const key = el.getAttribute("data-i18n-placeholder");
    if(I18N[currentLang][key]!==undefined) el.setAttribute("placeholder", I18N[currentLang][key]);
  });
  document.querySelectorAll(".lang-switch button").forEach(b=>{
    b.classList.toggle("active", b.dataset.lang===currentLang);
  });
  if(document.getElementById("results").dataset.hasResults==="1"){
    renderResults();
  }
}

document.querySelectorAll(".lang-switch button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    currentLang = btn.dataset.lang;
    applyI18n();
  });
});

document.getElementById("themeToggle").addEventListener("click", ()=>{
  const body = document.body;
  const isDark = body.getAttribute("data-theme")==="dark";
  body.setAttribute("data-theme", isDark ? "light" : "dark");
  document.getElementById("themeToggle").textContent = isDark ? "☀" : "☾";
});

async function search(query){
  const resultsEl = document.getElementById("results");
  const trimmed = query.trim();
  if(trimmed.split(/\s+/).filter(Boolean).length < 2){
    resultsEl.dataset.hasResults = "1";
    allResults = [];
    resultsEl.innerHTML = `<div class="empty-state">${t("typeHint")}</div>`;
    return;
  }

  resultsEl.dataset.hasResults = "1";
  resultsEl.innerHTML = `<div class="empty-state"><div class="spinner"></div>${t("searching")}</div>`;

  const searchBtn = document.getElementById("searchBtn");
  searchBtn.disabled = true;

  try{
    const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(trimmed)}`);
    if(!res.ok){
      const body = await res.json().catch(()=>({}));
      if(body.error === "missing_api_key"){
        resultsEl.innerHTML = `<div class="empty-state error">${t("errKey")}</div>`;
      } else {
        resultsEl.innerHTML = `<div class="empty-state error">${t("errGeneric")}</div>`;
      }
      return;
    }
    const data = await res.json();
    allResults = data.results || [];
    shownCount = Math.min(3, allResults.length);
    slots = allResults.slice(0, shownCount);
    renderResults();
  } catch(err){
    resultsEl.innerHTML = `<div class="empty-state error">${t("errBackend")}</div>`;
  } finally {
    searchBtn.disabled = false;
  }
}

function cardHTML(song, slotIdx){
  if(!song){
    return `<div class="empty-state">${t("noMore")}</div>`;
  }
  const thumb = song.thumbnail
    ? `<img class="thumb" src="${song.thumbnail}" alt="">`
    : `<div class="thumb"></div>`;
  return `
  <div>
    <div class="card" data-slot="${slotIdx}">
      ${thumb}
      <div class="card-body">
        <p class="card-title">🎵 ${song.title}</p>
        <div class="card-meta">
          <span>🎤 ${song.artist}</span>
          ${song.url ? `<a href="${song.url}" target="_blank" rel="noopener">${t("viewLyrics")}</a>` : ""}
        </div>
      </div>
      <div class="card-actions">
        <button class="show-lyrics" data-slot="${slotIdx}">${t("showLyrics")}</button>
        <button class="not-this" data-slot="${slotIdx}">${t("notThis")}</button>
      </div>
    </div>
    <div class="lyrics-panel" id="lyricsPanel-${slotIdx}" style="display:none;"></div>
  </div>`;
}

async function toggleLyrics(slotIdx, song, btn){
  const panel = document.getElementById(`lyricsPanel-${slotIdx}`);
  const isOpen = panel.style.display !== "none";

  if(isOpen){
    panel.style.display = "none";
    btn.textContent = t("showLyrics");
    return;
  }

  panel.style.display = "block";
  btn.textContent = t("hideLyrics");

  if(panel.dataset.loaded === "1") return;
  panel.textContent = t("loadingLyrics");

  try{
    const res = await fetch(`${LYRICS_URL}?artist=${encodeURIComponent(song.artist)}&title=${encodeURIComponent(song.title)}`);
    const data = await res.json();
    if(data.found){
      panel.innerHTML = "";
      const pre = document.createElement("div");
      pre.textContent = data.lyrics;
      panel.appendChild(pre);
      const src = document.createElement("span");
      src.className = "lyrics-src";
      src.textContent = t("lyricsSource");
      panel.appendChild(src);
    } else {
      panel.innerHTML = `<span>${t("lyricsUnavailable")}</span>` +
        (song.url ? ` <a href="${song.url}" target="_blank" rel="noopener" style="color:var(--amber-soft);">${t("viewLyrics")}</a>` : "");
    }
    panel.dataset.loaded = "1";
  } catch(err){
    panel.innerHTML = `<span>${t("lyricsUnavailable")}</span>`;
  }
}

function renderResults(){
  const resultsEl = document.getElementById("results");
  if(allResults.length===0 && resultsEl.dataset.hasResults==="1" && slots.length===0 && resultsEl.querySelector(".spinner")===null){
    if(resultsEl.querySelector(".empty-state")) return;
  }
  const hasAny = slots.some(s=>s);
  if(!hasAny){
    resultsEl.innerHTML = `<div class="empty-state">${t("empty")}</div>`;
    return;
  }
  let html = `<p class="results-heading">🔎 ${t("resultsHeading")}</p><p class="results-sub">${t("resultsSub")}</p>`;
  slots.forEach((song, idx)=>{ html += cardHTML(song, idx); });
  html += `
    <div class="found-q">
      <p>🤔 ${t("foundQ")}</p>
      <div class="found-btns">
        <button class="yes-btn" id="yesBtn">${t("yesBtn")}</button>
        <button class="no-btn" id="noBtn">${t("noBtn")}</button>
      </div>
      <div class="celebrate" id="celebrate">${t("celebrate")}</div>
    </div>`;
  resultsEl.innerHTML = html;

  resultsEl.querySelectorAll(".not-this").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const idx = parseInt(btn.dataset.slot,10);
      slots[idx] = allResults[shownCount] || null;
      if(allResults[shownCount]) shownCount++;
      renderResults();
    });
  });

  resultsEl.querySelectorAll(".show-lyrics").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const idx = parseInt(btn.dataset.slot,10);
      toggleLyrics(idx, slots[idx], btn);
    });
  });

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  if(yesBtn){
    yesBtn.addEventListener("click", ()=>{
      document.getElementById("celebrate").classList.add("show");
    });
  }
  if(noBtn){
    noBtn.addEventListener("click", ()=>{
      slots = slots.map(()=>{
        const next = allResults[shownCount];
        if(next) shownCount++;
        return next || null;
      });
      renderResults();
    });
  }
}

document.getElementById("searchBtn").addEventListener("click", ()=>{
  search(document.getElementById("lyricInput").value);
  document.getElementById("results").scrollIntoView({behavior:"smooth", block:"start"});
});
document.getElementById("lyricInput").addEventListener("keydown", (e)=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    search(document.getElementById("lyricInput").value);
    document.getElementById("results").scrollIntoView({behavior:"smooth", block:"start"});
  }
});

applyI18n();