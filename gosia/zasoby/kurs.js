(function(){
'use strict';
var BAZA = (window.BAZA_CWICZEN || '').trim();
if (BAZA && BAZA.slice(-1) !== '/') BAZA += '/';

function linkDla(el){
  if (el.dataset.abs) return el.dataset.abs;
  var rel = el.dataset.rel;                       // ../cwiczenia/slug.html
  if (BAZA) return BAZA + rel.split('/').pop();
  return new URL(rel, location.href).href;
}
document.querySelectorAll('.link-uczestnicy__url').forEach(function(el){ el.textContent = linkDla(el); });
var uw = document.getElementById('uwaga-file');
if (uw && !BAZA && /^(file:|http:\/\/localhost|http:\/\/127\.)/.test(location.href)) uw.hidden = false;

function zapas(tekst){
  var ta = document.createElement('textarea'); ta.value = tekst; ta.setAttribute('readonly','');
  ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
}
function kopiuj(tekst, btn){
  var t = btn.textContent;
  var gotowe = function(){
    btn.textContent = 'Skopiowano'; btn.classList.add('skopiowano');
    setTimeout(function(){ btn.textContent = t; btn.classList.remove('skopiowano'); }, 1800);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(tekst).then(gotowe, function(){ zapas(tekst); gotowe(); });
  } else { zapas(tekst); gotowe(); }
}
document.addEventListener('click', function(e){
  var b = e.target.closest('.btn-kopiuj');
  if (b) { kopiuj(linkDla(b.parentElement.querySelector('.link-uczestnicy__url')), b); return; }
  var w = e.target.closest('[data-wszystkie]');
  if (w) document.querySelectorAll('details.sekcja').forEach(function(d){ d.open = w.dataset.wszystkie === '1'; });
});

// otwarta sekcja po przejściu z okruszków (#sekcja-N)
function otworzZHasha(){
  var d = location.hash && document.querySelector(location.hash);
  if (d && d.tagName === 'DETAILS') { d.open = true; d.scrollIntoView(); }
}
otworzZHasha(); window.addEventListener('hashchange', otworzZHasha);

// wielkość tekstu do rzutnika
var KLUCZ = 'mk-na-zywo-skala', skala = 1;
try { skala = parseFloat(localStorage.getItem(KLUCZ)) || 1; } catch(e) {}
function ustaw(){ document.documentElement.style.setProperty('--skala', skala); }
ustaw();
document.querySelectorAll('[data-skala]').forEach(function(b){
  b.addEventListener('click', function(){
    skala = Math.min(1.8, Math.max(0.8, Math.round((skala + 0.1 * Number(b.dataset.skala)) * 10) / 10));
    ustaw();
    try { localStorage.setItem(KLUCZ, skala); } catch(e) {}
  });
});
})();
