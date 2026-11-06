(function () {
var w = window, d = document;
function init() {
if (w.__ibInit) return; w.__ibInit = true;
var de = d.documentElement, g = w.gsap, ST = w.ScrollTrigger, SP = w.SplitText;
function done() { de.classList.add('ib-ready'); }
if (!g || !ST || w.matchMedia('(prefers-reduced-motion: reduce)').matches) { de.classList.add('ib-noloader'); done(); return; }
g.registerPlugin(ST); if (SP) g.registerPlugin(SP);
var $ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
var E = 'expo.out', num = function (el, a, def) { var v = parseFloat(el.getAttribute(a)); return isNaN(v) ? def : v; };
if (w.Lenis && !w.__ibLenis) {
var lenis = w.__ibLenis = new w.Lenis({ lerp: 0.085 });
lenis.on('scroll', ST.update); g.ticker.add(function (t) { lenis.raf(t * 1000); }); g.ticker.lagSmoothing(0);
}
var loader = d.querySelector('[data-anim="loader"]');
if (loader && getComputedStyle(loader).display !== 'none') {
if (w.__ibLenis) w.__ibLenis.stop();
var parts = $('[data-logo-part]', loader).sort(function (a, b) { return a.getBBox().x - b.getBBox().x; });
var mark = loader.querySelector('.loader_brand') || loader.querySelector('.loader_logo'), country = loader.querySelector('.loader_country');
var lt = g.timeline({ defaults: { ease: 'expo.out' } });
g.set(parts, { y: 1300 }); if (country) g.set(country, { autoAlpha: 0, y: 8 });
g.set(mark, { opacity: 1 });
lt.set(loader, { clipPath: 'inset(0% 0% 0% 0%)' })
.to(parts, { y: 0, duration: 1.1, stagger: 0.07 }, 0.15)
.to(country || {}, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.75)
.from(mark, { scale: 0.92, duration: 1.6 }, 0.15)
.to(mark, { y: -24, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 1.35)
.to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 1.55)
.add(function () { rest(); }, 1.75)
.add(function () { loader.style.display = 'none'; if (w.__ibLenis) w.__ibLenis.start(); de.classList.add('ib-noloader'); });
} else rest();
function rest() {
$('[data-anim="nav"]').forEach(function (n) {
var hidden = false;
ST.create({ start: 0, end: 'max', onUpdate: function (s) { var h = s.scroll() > 200 && s.direction === 1; if (h !== hidden) { hidden = h; g.to(n, { yPercent: h ? -140 : 0, duration: 0.6, ease: 'power3.out' }); } } });
});
(function () {
var panels = $('[data-anim="mega"]'), triggers = $('[data-anim="mega-trigger"]'); if (!panels.length) return;
var cur = null, timer;
function panelFor(t) { var id = t.getAttribute('data-mega-target'); return id ? d.querySelector('[data-anim="mega"][data-mega-id="' + id + '"]') : panels[0]; }
function caret(t, on) { var c = t && t.querySelector('[data-anim-caret]'); if (c) g.to(c, { rotate: on ? 180 : 0, duration: 0.3 }); }
function close(p, t) { g.to(p, { autoAlpha: 0, y: -6, duration: 0.22, onComplete: function () { if (cur !== p) p.style.display = 'none'; } }); caret(t, false); }
function open(t) {
if (w.innerWidth < 992) return;
clearTimeout(timer); var p = panelFor(t); if (!p || cur === p) return;
var prev = cur, prevT = cur && cur.__t; cur = p; p.__t = t;
if (prev) close(prev, prevT);
p.style.display = 'grid';
g.fromTo(p, { autoAlpha: 0, y: prev ? 0 : -10 }, { autoAlpha: 1, y: 0, duration: prev ? 0.3 : 0.45, ease: E });
g.fromTo(p.querySelectorAll('[data-anim-mega-item]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: E, stagger: 0.03, delay: 0.04 });
caret(t, true);
triggers.forEach(function (x) { x.setAttribute('aria-expanded', x === t ? 'true' : 'false'); });
}
function hideSoon() { clearTimeout(timer); timer = setTimeout(function () { if (cur) { var p = cur; cur = null; close(p, p.__t); triggers.forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); } }, 140); }
triggers.forEach(function (t) {
t.setAttribute('aria-haspopup', 'true'); t.setAttribute('aria-expanded', 'false');
t.addEventListener('mouseenter', function () { open(t); }); t.addEventListener('mouseleave', hideSoon);
t.addEventListener('focus', function () { open(t); });
});
$('.navbar_link:not([data-anim="mega-trigger"]), .navbar_actions a').forEach(function (x) { x.addEventListener('mouseenter', hideSoon); x.addEventListener('focus', hideSoon); });
panels.forEach(function (p) {
p.addEventListener('mouseenter', function () { clearTimeout(timer); }); p.addEventListener('mouseleave', hideSoon);
var f = p.querySelector('.mega_feature'), fi = f && f.querySelector('.mega_feature-image');
if (f && fi) { f.addEventListener('mouseenter', function () { g.to(fi, { scale: 1.06, duration: 0.9, ease: E }); }); f.addEventListener('mouseleave', function () { g.to(fi, { scale: 1, duration: 0.9, ease: E }); }); }
});
d.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideSoon(); });
})();
$('[data-anim="menu-toggle"]').forEach(function (b) {
var m = d.querySelector('[data-anim="menu"]'); if (!m) return; var open = false;
function set(o) {
open = o;
if (o) { m.style.cssText = 'display:flex;position:fixed;top:4.25rem;left:0;right:0;height:calc(100vh - 4.25rem);flex-direction:column;align-items:flex-start;padding:2rem 1.25rem;background-color:#ffffff;overflow:auto'; g.from(m.children, { y: 24, autoAlpha: 0, duration: 0.6, ease: E, stagger: 0.05 }); if (w.__ibLenis) w.__ibLenis.stop(); }
else { m.style.cssText = ''; if (w.__ibLenis) w.__ibLenis.start(); }
}
b.addEventListener('click', function () { set(!open); });
w.addEventListener('resize', function () { if (open && w.innerWidth > 991) set(false); });
});
$('[data-anim="split"]').forEach(function (el) {
if (!SP) return;
var load = el.getAttribute('data-anim-trigger') === 'load', delay = num(el, 'data-anim-delay', 0);
SP.create(el, { type: 'lines', mask: 'lines', linesClass: 'ib-line', autoSplit: true, onSplit: function (s) {
g.set(el, { visibility: 'visible' });
var v = { yPercent: 110, duration: 1.3, ease: E, stagger: 0.1, delay: delay };
if (!load) v.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
return g.from(s.lines, v);
} });
});
$('[data-anim="scrub-words"]').forEach(function (el) {
if (!SP) return;
SP.create(el, { type: 'words', autoSplit: true, onSplit: function (s) {
return g.fromTo(s.words, { opacity: 0.12 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } });
} });
});
$('.page-wrapper img').forEach(function (img) {
if (de.classList.contains('ib-noimgfade') || img.closest('[data-anim="loader"]') || img.closest('[data-anim="rs-tabs"]') || img.closest('[data-anim="hero-slider"]') || img.hasAttribute('data-chapter-image') || img.getAttribute('loading') === 'eager') return;
if (img.complete && img.naturalWidth) return;
var target = parseFloat(getComputedStyle(img).opacity); if (isNaN(target)) target = 1;
var show = function () { g.to(img, { opacity: target, duration: 1.4, ease: 'power2.out', clearProps: 'opacity' }); };
g.set(img, { opacity: 0 });
img.addEventListener('load', show, { once: true });
img.addEventListener('error', show, { once: true });
});
$('.learn-row_media, .eco_sticky, .cta_visual').forEach(function (el) {
g.from(el, { autoAlpha: 0, y: 40, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
});
$('[data-anim="faq"]').forEach(function (list) {
$('.faq_item', list).forEach(function (it) {
var q = it.querySelector('.faq_question'), ans = it.querySelector('.faq_answer'), ic = it.querySelector('.faq_icon'), open = false;
if (!q || !ans) return;
q.setAttribute('role', 'button'); q.setAttribute('tabindex', '0'); q.setAttribute('aria-expanded', 'false');
function set(o) { open = o; q.setAttribute('aria-expanded', o ? 'true' : 'false'); g.to(ans, { height: o ? 'auto' : 0, duration: 0.6, ease: 'power3.inOut' }); if (ic) g.to(ic, { rotate: o ? 45 : 0, duration: 0.4 }); }
q.addEventListener('click', function () { set(!open); });
q.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!open); } });
});
});
$('[data-anim="gallery"]').forEach(function (gal) {
var main = gal.querySelector('[data-gallery-main]'), th = $('[data-gallery-thumb]', gal);
th.forEach(function (t) { t.addEventListener('click', function () {
var src = t.querySelector('img'); if (!main || !src) return;
th.forEach(function (x) { x.classList.toggle('is-active', x === t); });
g.to(main, { autoAlpha: 0, y: 12, duration: 0.3, ease: 'power2.in', onComplete: function () { main.src = src.currentSrc || src.src; main.alt = src.alt; main.removeAttribute('srcset'); g.to(main, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }); } });
}); });
});
var ibJump = function (t) {
var sn = d.querySelector('[data-anim="subnav"]');
var stuck = sn ? (parseFloat(getComputedStyle(sn).top) || 0) + sn.offsetHeight : 96;
var ps = t.querySelector('.padding-section-large'), pad = ps ? parseFloat(getComputedStyle(ps).paddingTop) || 0 : 0;
var top = t.getBoundingClientRect().top + w.scrollY + pad - stuck - 40;
if (w.__ibLenis) w.__ibLenis.scrollTo(top, { duration: 1.2, lock: true, force: true });
else w.scrollTo({ top: top, behavior: 'smooth' });
};
d.addEventListener('click', function (e) {
var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
var h = a.getAttribute('href'); if (h.length < 2) return;
var t = null; try { t = d.querySelector(h); } catch (er) { }
if (!t) return;
e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
if (history.replaceState) history.replaceState(null, '', h);
ibJump(t);
}, true);
$('[data-anim="subnav"]').forEach(function (nav) {
var links = $('a[href^="#"]', nav);
var setActive = function (l) { links.forEach(function (x) { x.classList.toggle('is-active', x === l); }); };
links.forEach(function (l) {
var t = null; try { t = d.querySelector(l.getAttribute('href')); } catch (er) { }
if (!t) return;
l.addEventListener('click', function () { setActive(l); });
ST.create({ trigger: t, start: 'top 40%', end: 'bottom 40%', onToggle: function (s) { if (s.isActive) setActive(l); } });
});
});
if (location.hash.length > 1) { var ht = null; try { ht = d.querySelector(location.hash); } catch (er) { } if (ht) setTimeout(function () { ibJump(ht); }, 400); }
$('[data-anim="tabs"]').forEach(function (tb) {
var tabs = $('[data-tab]', tb.parentNode), field = tb.parentNode.querySelector('[data-tab-value]');
tabs.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); tabs.forEach(function (x) { x.classList.toggle('is-active', x === t); }); if (field) field.value = t.getAttribute('data-tab'); var vis = tb.parentNode.querySelector('select[name="istek"]'); if (vis) { var map = { 'İletişim': 'Ürün hakkında bilgi talebi', 'Teklif': 'Fiyat teklif talebi', 'Broşür': 'Broşür talebi', 'Teknik destek': 'Teknik yardım talebi' }; vis.value = map[t.getAttribute('data-tab')] || ''; } }); });
});
$('[data-anim="hotspots"]').forEach(function (root) {
var spots = $('.hotspot', root), open = null;
function close() { if (open) { g.to(open.querySelector('.hotspot_card'), { autoAlpha: 0, y: 8, duration: 0.25 }); open.style.zIndex = 2; open = null; } }
spots.forEach(function (s, i) {
var dot = s.querySelector('.hotspot_dot'), card = s.querySelector('.hotspot_card'), pulse = s.querySelector('.hotspot_pulse');
if (pulse) g.fromTo(pulse, { scale: 1, opacity: 0.7 }, { scale: 2.4, opacity: 0, duration: 2, ease: 'power2.out', repeat: -1, delay: i * 0.25 });
g.from(dot, { scale: 0, duration: 0.7, ease: 'back.out(2)', delay: i * 0.08, scrollTrigger: { trigger: root, start: 'top 75%', once: true } });
if (!dot || !card) return;
dot.setAttribute('role', 'button'); dot.setAttribute('tabindex', '0');
function toggle(e) { e.stopPropagation(); if (open === s) return close(); close(); open = s; s.style.zIndex = 5; g.fromTo(card, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }); }
dot.addEventListener('click', toggle);
dot.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
if (w.matchMedia('(hover: hover)').matches) { s.addEventListener('mouseenter', function (e) { if (open !== s) toggle(e); }); s.addEventListener('mouseleave', close); }
});
d.addEventListener('click', close);
});
$('[data-anim="rs-tabs"]').forEach(function (root) {
var tabs = $('.rs_tab', root), sheets = $('.rs_sheet', root), cur = 0, stage = root.querySelector('.rs_stage');
sheets.forEach(function (s0) { var el = s0.parentElement; while (el && el !== stage && el !== root) { el.style.display = 'grid'; el.style.gridArea = '1 / 1'; el.style.justifyItems = 'center'; el = el.parentElement; } s0.style.gridArea = '1 / 1'; });
tabs.forEach(function (t, i) { if (i >= sheets.length) t.style.display = 'none'; });
if (!tabs.length && stage && sheets.length > 1) { stage.style.cursor = 'pointer'; stage.addEventListener('click', function () { var a0 = sheets[cur], n = (cur + 1) % sheets.length, b0 = sheets[n]; g.to(a0, { autoAlpha: 0, y: -16, rotate: -1.5, duration: 0.4, ease: 'power2.in' }); g.fromTo(b0, { autoAlpha: 0, y: 24, rotate: 1.5 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9, ease: E, delay: 0.15 }); cur = n; }); }
sheets.forEach(function (s0, i) { g.set(s0, { autoAlpha: i ? 0 : 1 }); });
tabs.forEach(function (t, i) { t.setAttribute('role', 'tab'); t.setAttribute('tabindex', '0'); function go() { if (i === cur) return; var a0 = sheets[cur], b0 = sheets[i]; tabs.forEach(function (x, j) { x.classList.toggle('is-active', j === i); }); sheets.forEach(function (x, j) { x.classList.toggle('is-active', j === i); }); if (a0) g.to(a0, { autoAlpha: 0, y: -16, rotate: -1.5, duration: 0.4, ease: 'power2.in' }); if (b0) g.fromTo(b0, { autoAlpha: 0, y: 24, rotate: 1.5 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9, ease: E, delay: 0.15 }); cur = i; } t.addEventListener('click', go); t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
});
$('[data-youtube]').forEach(function (c) {
c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0');
var raw = c.getAttribute('data-youtube') || '', ytm = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/), yid = ytm ? ytm[1] : raw.trim();
if (!yid) { c.style.display = 'none'; return; }
if (ytm) { var th = c.querySelector('.video_thumb'); if (th) { th.removeAttribute('srcset'); th.src = 'https://i.ytimg.com/vi/' + yid + '/hqdefault.jpg'; } }
function play() { var id = yid; if (!id || c.querySelector('iframe')) return; var f = d.createElement('iframe'); f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'; f.title = c.getAttribute('aria-label') || 'Video'; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0'; c.appendChild(f); }
c.addEventListener('click', play); c.addEventListener('keydown', function (e) { if (e.key === 'Enter') play(); });
var t = c.querySelector('.video_thumb'), p = c.querySelector('.video_play');
c.addEventListener('mouseenter', function () { if (t) g.to(t, { scale: 1.05, opacity: 1, duration: 0.8, ease: E }); if (p) g.to(p, { scale: 1.08, duration: 0.4 }); });
c.addEventListener('mouseleave', function () { if (t) g.to(t, { scale: 1, opacity: 0.85, duration: 0.8, ease: E }); if (p) g.to(p, { scale: 1, duration: 0.4 }); });
});
$('[data-anim="toc"]').forEach(function (toc) {
var body = d.querySelector('[data-anim="article"]'); if (!body) return;
var hs = $('h2', body); toc.innerHTML = '';
hs.forEach(function (h, i) { if (!h.id) h.id = 'bolum-' + (i + 1); var a0 = d.createElement('a'); a0.href = '#' + h.id; a0.className = 'article_toc-link'; a0.textContent = h.textContent; toc.appendChild(a0);
a0.addEventListener('click', function (e) { e.preventDefault(); if (w.__ibLenis) w.__ibLenis.scrollTo(h, { offset: -120 }); else w.scrollTo({ top: h.getBoundingClientRect().top + w.scrollY - 120, behavior: 'smooth' }); });
ST.create({ trigger: h, start: 'top 40%', endTrigger: hs[i + 1] || body, end: hs[i + 1] ? 'top 40%' : 'bottom 40%', onToggle: function (s) { if (s.isActive) $('a', toc).forEach(function (x, j) { x.classList.toggle('is-active', j === i); }); } });
});
});
$('[data-anim="awards"]').forEach(function (bar) {
var items = Array.prototype.slice.call(bar.children);
var inView = bar.getBoundingClientRect().top < w.innerHeight;
var tl = g.timeline({ paused: true, delay: inView ? 1.3 : 0 });
items.forEach(function (it, i) {
var at = i * 0.18, stems = $('[data-stem]', it), leaves = $('[data-leaf]', it), txt = it.querySelector('.hero_award-text');
stems.forEach(function (p) { var L = p.getTotalLength(); g.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
tl.from(it, { autoAlpha: 0, y: 24, duration: 1.2, ease: 'power3.out' }, at)
.to(stems, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, at + 0.2)
.from(leaves, { scale: 0, transformOrigin: '100% 50%', duration: 0.7, ease: 'back.out(2.2)', stagger: { each: 0.11, from: 'start' } }, at + 0.35);
if (txt) tl.from(txt, { autoAlpha: 0, y: 8, duration: 1, ease: 'power3.out' }, at + 0.3);
});
ST.create({ trigger: bar, start: 'top 95%', once: true, onEnter: function () { tl.play(); } });
});
$('[data-anim="reveal"]').forEach(function (el) {
var isLoad = el.getAttribute('data-anim-trigger') === 'load';
var v = isLoad ? { autoAlpha: 0, y: 24, duration: 1.5, ease: 'power3.out', delay: num(el, 'data-anim-delay', 0) } : { autoAlpha: 0, y: 36, duration: 1.2, ease: E, delay: num(el, 'data-anim-delay', 0) };
if (!isLoad) v.scrollTrigger = { trigger: el, start: 'top 92%', once: true };
g.from(el, v);
});
$('[data-anim-stagger]').forEach(function (el) {
var v = { autoAlpha: 0, y: 48, duration: 1.2, ease: E, stagger: num(el, 'data-anim-stagger', 0.1), delay: num(el, 'data-anim-delay', 0) };
if (el.getAttribute('data-anim-trigger') !== 'load') v.scrollTrigger = { trigger: el, start: 'top 90%', once: true };
g.from(el.children, v);
});
$('[data-anim="hero-image"]').forEach(function (el) {
var sec = el.closest('section') || el;
g.fromTo(el, { scale: 1.14, yPercent: 4 }, { scale: 1, yPercent: 0, duration: 2.8, ease: E });
g.to(el.parentElement, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
});
$('[data-anim="hero-fade"]').forEach(function (el) {
g.to(el, { yPercent: -30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top top', end: '55% top', scrub: true } });
});
$('[data-anim="expand"]').forEach(function (el) {
var img = el.querySelector('[data-anim-img]');
g.fromTo(el, { scale: 0.84, borderRadius: '2rem' }, { scale: 1, borderRadius: '1.25rem', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 25%', scrub: true } });
if (img) g.fromTo(img, { scale: 1.25 }, { scale: 1.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
});
$('[data-anim="marquee"]').forEach(function (el) {
var tw = g.to(el, { xPercent: -50, duration: num(el, 'data-anim-speed', 40), ease: 'none', repeat: -1 });
ST.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: function (s) { s.isActive ? tw.play() : tw.pause(); } });
});
$('[data-anim="wipe"]').forEach(function (el) {
var img = el.querySelector('[data-anim-img]');
var tl = g.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: E }, 0.1);
});
$('[data-anim="parallax"]').forEach(function (el) {
var a = num(el, 'data-anim-speed', 8);
g.fromTo(el, { yPercent: -a }, { yPercent: a, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
});
$('[data-anim="skew"]').forEach(function (el) {
g.fromTo(el, { skewY: -7 }, { skewY: -3, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'top 30%', scrub: true } });
});
$('[data-anim="counter"]').forEach(function (el) {
var to = num(el, 'data-anim-to', 0), suf = el.getAttribute('data-anim-suffix') || '', pre = el.getAttribute('data-anim-prefix') || '', o = { v: 0 };
el.textContent = pre + '0' + suf;
g.to(o, { v: to, duration: 2.2, ease: E, scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = pre + Math.round(o.v).toLocaleString('tr-TR') + suf; } });
});
$('[data-anim="tabs"]').forEach(function (root) {
var tabs = $('[data-tab]', root), panels = $('[data-panel]', root), imgs = $('[data-tab-image]', root);
var dur = num(root, 'data-anim-duration', 6), cur = 0, bar;
function go(i, user) {
cur = i;
tabs.forEach(function (t, j) { t.classList.toggle('is-active', j === i); var b = t.querySelector('[data-tab-bar]'); if (b) { g.killTweensOf(b); g.set(b, { scaleX: 0 }); } });
panels.forEach(function (p, j) { p.classList.toggle('is-active', j === i); if (j === i) g.fromTo(p.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: E, stagger: 0.06 }); });
imgs.forEach(function (im, j) { im.classList.toggle('is-active', j === i); if (j === i) g.fromTo(im, { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: E }); else g.to(im, { autoAlpha: 0, duration: 0.6 }); });
bar = tabs[i].querySelector('[data-tab-bar]');
if (bar) g.to(bar, { scaleX: 1, duration: dur, ease: 'none', onComplete: function () { go((cur + 1) % tabs.length); } });
}
tabs.forEach(function (t, j) { t.addEventListener('click', function () { go(j, true); }); });
ST.create({ trigger: root, start: 'top 80%', once: true, onEnter: function () { go(0); } });
});
$('[data-anim="hero-slider"]').forEach(function (root) {
var sec = root.closest('section') || root, slides = $('[data-hero-slide]', root);
var caps = $('[data-hero-caption]', sec), tabs = $('[data-hero-tab]', sec), floor = sec.querySelector('[data-hero-floor]');
var dur = num(root, 'data-anim-interval', 5), cur = 0, timer = null, busy = false, pending = null;
var ring = function (i) { var r = tabs[i] && tabs[i].querySelector('[data-ring]'); return r; };
slides.forEach(function (s0, i) { g.set(s0, { autoAlpha: i ? 0 : 1 }); });
caps.forEach(function (c, i) { g.set(c, { autoAlpha: i ? 0 : 1 }); });
function progress(i) {
if (timer) timer.kill();
tabs.forEach(function (t, j) { var r = ring(j); if (r) g.set(r, { strokeDashoffset: 50.27 }); t.classList.toggle('is-active', j === i); });
var r = ring(i);
timer = g.to(r || {}, { strokeDashoffset: 0, duration: dur, ease: 'none', onComplete: function () { go((cur + 1) % slides.length); } });
}
function go(i) {
if (i === cur) return; if (busy) { pending = i; return; } busy = true;
var a = slides[cur], b = slides[i], ai = a.querySelector('[data-hero-img]'), bi = b.querySelector('[data-hero-img]');
var tl = g.timeline({ onComplete: function () { busy = false; if (pending !== null && pending !== cur) { var p = pending; pending = null; go(p); } else pending = null; } });
tl.to(ai, { y: -30, scale: 0.95, duration: 0.7, ease: 'power3.in' }, 0)
.to(a, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0.2)
.to(caps[cur] || {}, { autoAlpha: 0, y: -12, duration: 0.4 }, 0)
.to(floor || {}, { scaleX: 0.7, opacity: 0.4, duration: 0.6, ease: 'power2.inOut' }, 0)
.fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.6)
.fromTo(bi, { y: 80, scale: 1.04 }, { y: 0, scale: 1, duration: 1.3, ease: E }, 0.6)
.fromTo(caps[i] || {}, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: E }, 0.85)
.to(floor || {}, { scaleX: 1, opacity: 1, duration: 1, ease: E }, 0.7);
cur = i; progress(i);
}
var hover = w.matchMedia('(hover: hover)').matches;
tabs.forEach(function (t, i) {
var ar = t.querySelector('.hero_switch-arrow');
if (hover) {
t.addEventListener('mouseenter', function () { go(i); if (ar) g.to(ar, { opacity: 1, x: 3, duration: 0.3 }); });
t.addEventListener('mouseleave', function () { if (ar) g.to(ar, { opacity: 0, x: 0, duration: 0.3 }); });
} else {
t.addEventListener('click', function (e) { if (i !== cur) { e.preventDefault(); go(i); } });
}
});
g.from(slides[0].querySelector('[data-hero-img]'), { y: 60, autoAlpha: 0, scale: 0.98, duration: 2.2, ease: 'power3.out', delay: 0.35 });
if (floor) g.from(floor, { scaleX: 0.4, autoAlpha: 0, duration: 2, ease: 'power3.out', delay: 0.5 });
g.from(tabs, { autoAlpha: 0, x: 12, duration: 1.1, ease: 'power3.out', stagger: 0.05, delay: 1.0 });
g.from(caps[0], { autoAlpha: 0, y: 14, duration: 1.2, ease: 'power3.out', delay: 0.9 });
g.delayedCall(2.2, function () { progress(0); });
g.to(root, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
ST.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: function (s) { if (timer) s.isActive ? timer.resume() : timer.pause(); } });
if (w.matchMedia('(hover: hover)').matches) {
var qx = g.quickTo(root, 'x', { duration: 1.2, ease: 'power3' }), qr = g.quickTo(root, 'rotationY', { duration: 1.2, ease: 'power3' });
g.set(root, { transformPerspective: 1200 });
sec.addEventListener('mousemove', function (e) { var r = sec.getBoundingClientRect(), p = (e.clientX - r.left) / r.width - 0.5; qx(p * 24); qr(p * 6); });
sec.addEventListener('mouseleave', function () { qx(0); qr(0); });
}
});
$('[data-anim="hero-device"]').forEach(function (el) {
g.from(el, { y: 90, scale: 0.97, duration: 1.8, ease: E, delay: 0.1 });
g.to(el, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top top', end: 'bottom top', scrub: true } });
});
$('[data-anim="rise"]').forEach(function (el) { g.from(el, { y: 40, autoAlpha: 0, duration: 1.6, ease: 'power3.out', delay: 0.25 }); });
$('[data-anim="float-off"]').forEach(function (el, i) {
g.from(el, { autoAlpha: 0, y: 30, duration: 1.4, ease: E, delay: 1.1 + i * 0.15 });
g.to(el, { y: i % 2 ? 10 : -10, duration: 3.2 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.4 });
});
$('[data-anim="chapters"]').forEach(function (root) {
var imgs = $('[data-chapter-image]', root), dots = $('[data-chapter-dot]', root), chs = $('[data-chapter]', root), cur = 0;
function set(i) {
if (i === cur) return; cur = i;
imgs.forEach(function (im, j) { if (j === i) g.fromTo(im, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.1, ease: E, overwrite: true }); else g.to(im, { autoAlpha: 0, duration: 0.7, overwrite: true }); });
dots.forEach(function (d0, j) { d0.classList.toggle('is-active', j === i); });
}
chs.forEach(function (c, i) { ST.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', onToggle: function (s) { if (s.isActive) set(i); } }); });
});
g.matchMedia().add('(min-width: 992px)', function () {
$('[data-anim="sectors"]').forEach(function (root) {
var cards = $('[data-sector]', root);
function open(i) { cards.forEach(function (c, j) { g.to(c, { flexGrow: j === i ? 2.4 : 1, duration: 0.9, ease: 'power3.inOut' }); var dt = c.querySelector('[data-sector-detail]'), pl = c.querySelector('[data-sector-plus]'); if (dt) g.to(dt, { height: j === i ? 'auto' : 0, autoAlpha: j === i ? 1 : 0, duration: 0.7, ease: 'power3.inOut' }); if (pl) g.to(pl, { rotate: j === i ? 135 : 0, backgroundColor: j === i ? '#4f6f91' : '#ffffff', color: j === i ? '#ffffff' : '#14171c', duration: 0.6, ease: 'power3.out' }); var im = c.querySelector('[data-anim-img]'); if (im) g.to(im, { scale: j === i ? 1.04 : 1.12, duration: 1.4, ease: E }); var tt = c.querySelector('[data-sector-title]'); if (tt) g.to(tt, { y: j === i ? -4 : 0, duration: 0.8, ease: E }); if (dt && j === i) g.fromTo(dt.children, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: E, stagger: 0.06, delay: 0.15 }); }); }
cards.forEach(function (c, i) { var dt = c.querySelector('[data-sector-detail]'); if (dt && !c.classList.contains('is-open')) g.set(dt, { height: 0, autoAlpha: 0 }); c.addEventListener('mouseenter', function () { open(i); });
var im2 = c.querySelector('[data-anim-img]'); if (im2) { var qx = g.quickTo(im2, 'xPercent', { duration: 0.8, ease: 'power3' }), qy = g.quickTo(im2, 'yPercent', { duration: 0.8, ease: 'power3' }); c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(); qx(((e.clientX - r.left) / r.width - 0.5) * -3); qy(((e.clientY - r.top) / r.height - 0.5) * -3); }); c.addEventListener('mouseleave', function () { qx(0); qy(0); }); }
}); g.set(cards.map(function (c) { return c.querySelector('[data-anim-img]'); }).filter(Boolean), { scale: 1.12 }); g.set(cards[0].querySelector('[data-anim-img]'), { scale: 1.04 });
return function () { cards.forEach(function (c) { g.set(c, { clearProps: 'flexGrow' }); var dt = c.querySelector('[data-sector-detail]'); if (dt) g.set(dt, { clearProps: 'all' }); }); };
});
});
$('[data-anim="card"]').forEach(function (c) {
var i = c.querySelector('[data-anim-img]'); if (!i) return;
c.addEventListener('mouseenter', function () { g.to(i, { scale: 1.05, duration: 1, ease: E }); });
c.addEventListener('mouseleave', function () { g.to(i, { scale: 1, duration: 1, ease: E }); });
});
g.matchMedia().add('(min-width: 992px) and (hover: hover)', function () {
$('[data-anim="magnetic"]').forEach(function (b) {
var qx = g.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), qy = g.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.25); qy((e.clientY - r.top - r.height / 2) * 0.35); });
b.addEventListener('mouseleave', function () { qx(0); qy(0); });
});
});
done();
w.addEventListener('load', function () { ST.refresh(); });
if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { ST.refresh(); });
}
}
w.InBodyMotion = { init: init };
if (!w.__ibManual) { if (d.readyState !== 'loading') init(); else d.addEventListener('DOMContentLoaded', init); }
})();
(function () {
var w = window, d = document, KEY = 'ib_consent_v1';
function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
function apply(c) {
if (typeof w.gtag === 'function') w.gtag('consent', 'update', { analytics_storage: c.analytics ? 'granted' : 'denied', ad_storage: c.marketing ? 'granted' : 'denied', ad_user_data: c.marketing ? 'granted' : 'denied', ad_personalization: c.marketing ? 'granted' : 'denied' });
try { d.dispatchEvent(new CustomEvent('ib:consent', { detail: c })); } catch (e) {}
}
function start() {
var b = d.querySelector('[data-cookie="banner"]'); if (!b || b.__ib) return; b.__ib = true;
var prefs = b.querySelector('[data-cookie-prefs]'), save = b.querySelector('[data-cookie-save]'), settings = b.querySelector('[data-cookie-settings]');
var sw = Array.prototype.slice.call(b.querySelectorAll('[data-cookie-toggle]'));
var g = w.gsap, reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setSw(el, on) { el.classList.toggle('is-on', on); var k = el.firstElementChild; if (k) k.classList.toggle('is-on', on); el.setAttribute('aria-checked', on ? 'true' : 'false'); }
function state() { var c = { necessary: true, date: new Date().toISOString() }; sw.forEach(function (el) { c[el.getAttribute('data-cookie-toggle')] = el.classList.contains('is-on'); }); return c; }
function show(withPrefs) {
var cur = read(); sw.forEach(function (el) { setSw(el, !!(cur && cur[el.getAttribute('data-cookie-toggle')])); });
togglePrefs(!!withPrefs);
b.style.display = 'flex';
if (g && !reduce) g.fromTo(b, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' });
}
function hide() {
if (g && !reduce) g.to(b, { autoAlpha: 0, y: 16, duration: 0.35, ease: 'power2.in', onComplete: function () { b.style.display = 'none'; } });
else b.style.display = 'none';
}
function togglePrefs(on) {
prefs.style.display = on ? 'flex' : 'none';
if (save) save.style.display = on ? 'flex' : 'none';
if (settings) settings.style.display = on ? 'none' : '';
if (on && g && !reduce) g.from(prefs.children, { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power3.out', stagger: 0.05 });
}
function commit(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} apply(c); hide(); }
function on(sel, fn) { var el = b.querySelector(sel); if (el) el.addEventListener('click', function (e) { e.preventDefault(); fn(); }); }
on('[data-cookie-accept]', function () { commit({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() }); });
on('[data-cookie-reject]', function () { commit({ necessary: true, analytics: false, marketing: false, date: new Date().toISOString() }); });
on('[data-cookie-settings]', function () { togglePrefs(true); });
on('[data-cookie-save]', function () { commit(state()); });
sw.forEach(function (el) {
el.addEventListener('click', function () { setSw(el, !el.classList.contains('is-on')); });
el.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSw(el, !el.classList.contains('is-on')); } });
});
Array.prototype.forEach.call(d.querySelectorAll('[data-cookie-open]'), function (el) { el.addEventListener('click', function (e) { e.preventDefault(); show(true); }); });
var saved = read();
if (saved) apply(saved); else setTimeout(function () { show(false); }, d.querySelector('[data-anim="loader"]') ? 3200 : 800);
}
if (d.readyState !== 'loading') start(); else d.addEventListener('DOMContentLoaded', start);
w.InBodyConsent = { start: start, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})();
