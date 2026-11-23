// Prime Video Ad Control v1.0
//
// Two independent features, each toggled from the toolbar popup:
//   jump  - read the remaining time from the "Ad 1:33" badge and seek the video
//           to just before the ad ends
//   speed - play the ad at 16x
// While an ad plays and at least one feature is on, the video is also muted.
// Muted state and playback speed are restored when the ad ends or when the
// features are switched off.
//
// Badge markup (confirmed from the live page):
//   <div aria-label="Ad playing. Content resumes in 1 minutes and 33 seconds.">
//     <span>Ad</span>
//     <span class="atvwebplayersdk-ad-timer-remaining-time">1:33</span>
//   </div>
// The page has two <video> elements; the real one has a blob: src.

const DEFAULTS = { jump: true, speed: true };
let settings = { ...DEFAULTS };

function loadSettings() {
  try {
    chrome.storage.local.get(DEFAULTS, (s) => {
      settings = { ...DEFAULTS, ...s };
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      for (const key of Object.keys(changes)) {
        if (key in DEFAULTS) settings[key] = changes[key].newValue;
      }
    });
  } catch (e) {
    // Extension was reloaded/removed; keep defaults.
  }
}

const AD_SELECTORS = [
  '[aria-label^="Ad playing"]',
  '.atvwebplayersdk-ad-timer-remaining-time',
  '[class*="ad-timer-remaining-time"]'
];
const TIMER_SELECTOR = '[class*="ad-timer-remaining-time"]';

const AD_SPEED = 16;
const LEAVE_SECONDS = 0.5;   // stop this far before the ad end
const MIN_REMAINING = 2;     // don't bother jumping for tiny remainders
const CHECK_AFTER_MS = 2000; // how long after a jump we log whether it stuck

const saved = new Map();     // video -> { muted, rate }
let inAd = false;
let attempted = false;
let jumpInfo = null;

function scope() {
  return document.getElementById('dv-web-player') || document;
}

function isVisible(el) {
  return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
}

function adBadge() {
  const root = scope();
  for (const sel of AD_SELECTORS) {
    const el = root.querySelector(sel);
    if (el && isVisible(el)) return el;
  }
  return null;
}

// Seconds remaining in the ad, or null if it can't be read.
function remainingSeconds() {
  const root = scope();

  const timer = root.querySelector(TIMER_SELECTOR);
  if (timer) {
    const m = (timer.textContent || '').trim().match(/^(\d+):(\d{2})$/);
    if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  const labelEl = root.querySelector('[aria-label^="Ad playing"]');
  if (labelEl) {
    const label = labelEl.getAttribute('aria-label') || '';
    const min = label.match(/(\d+)\s*minute/i);
    const sec = label.match(/(\d+)\s*second/i);
    if (min || sec) {
      return (min ? parseInt(min[1], 10) * 60 : 0) + (sec ? parseInt(sec[1], 10) : 0);
    }
  }
  return null;
}

// The real video: has a source and some data loaded.
function mainVideo() {
  const vids = Array.from(document.querySelectorAll('video'));
  return (
    vids.find((v) => (v.currentSrc || v.src) && v.readyState >= 2) ||
    vids.find((v) => v.duration > 0) ||
    null
  );
}

function tryJump() {
  const v = mainVideo();
  if (!v) return;                       // not ready yet; try again next tick
  const remaining = remainingSeconds();
  if (remaining === null) return;       // can't read it yet; try again next tick

  attempted = true;
  if (remaining <= MIN_REMAINING) {
    console.log('[PV Ad Control] only ' + remaining + 's left, skipping the jump');
    return;
  }

  const from = v.currentTime;
  const target = from + remaining - LEAVE_SECONDS;
  console.log('[PV Ad Control] jumping: remaining=' + remaining + 's, currentTime ' +
    from.toFixed(1) + ' -> ' + target.toFixed(1));
  try {
    v.currentTime = target;
    jumpInfo = { video: v, from, remaining, at: Date.now(), checked: false };
  } catch (e) {
    console.log('[PV Ad Control] seek failed:', e);
  }
}

function reportJump() {
  if (!jumpInfo || jumpInfo.checked) return;
  if (Date.now() - jumpInfo.at < CHECK_AFTER_MS) return;
  jumpInfo.checked = true;
  const v = jumpInfo.video;
  const stuck = v.currentTime > jumpInfo.from + jumpInfo.remaining * 0.5;
  console.log('[PV Ad Control] ' +
    (stuck ? 'jump seems to have worked' : 'jump did NOT stick (player snapped back?)') +
    ' | currentTime=' + v.currentTime.toFixed(1) +
    ', ad remaining now=' + remainingSeconds() + 's');
}

function restoreAll(videos) {
  videos.forEach((v) => {
    const s = saved.get(v);
    v.muted = s ? s.muted : false;
    v.playbackRate = s ? s.rate : 1;
  });
  saved.clear();
}

function tick() {
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  const active = settings.jump || settings.speed;

  if (active && adBadge()) {
    if (!inAd) {
      inAd = true;
      attempted = false;
      jumpInfo = null;
      console.log('[PV Ad Control] ad detected (jump=' + settings.jump +
        ', speed=' + settings.speed + ')');
    }

    videos.forEach((v) => {
      if (!saved.has(v)) saved.set(v, { muted: v.muted, rate: v.playbackRate || 1 });
      v.muted = true;
      const s = saved.get(v);
      if (settings.speed) {
        if (v.playbackRate !== AD_SPEED) v.playbackRate = AD_SPEED;
      } else if (v.playbackRate !== s.rate) {
        v.playbackRate = s.rate;        // speed switched off mid-ad
      }
    });

    if (settings.jump && !attempted) tryJump();
    reportJump();
  } else if (inAd) {
    inAd = false;
    restoreAll(videos);
    console.log('[PV Ad Control] ad finished or features off, settings restored');
  }
}

loadSettings();
setInterval(tick, 100);
