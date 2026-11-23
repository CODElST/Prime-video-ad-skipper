const DEFAULTS = { jump: true, speed: true };
const keys = Object.keys(DEFAULTS);
const statusEl = document.getElementById('status');

function updateStatus(state) {
  if (!state.jump && !state.speed) {
    statusEl.textContent = 'Both off: ads play normally.';
  } else if (state.jump && state.speed) {
    statusEl.textContent = 'Ads are muted, jumped and sped up.';
  } else if (state.jump) {
    statusEl.textContent = 'Ads are muted and jumped to the end.';
  } else {
    statusEl.textContent = 'Ads are muted and played at 16x.';
  }
}

function currentState() {
  const state = {};
  keys.forEach((k) => { state[k] = document.getElementById(k).checked; });
  return state;
}

chrome.storage.local.get(DEFAULTS, (stored) => {
  const state = { ...DEFAULTS, ...stored };
  keys.forEach((k) => { document.getElementById(k).checked = !!state[k]; });
  updateStatus(state);
});

keys.forEach((k) => {
  document.getElementById(k).addEventListener('change', () => {
    const state = currentState();
    chrome.storage.local.set(state);
    updateStatus(state);
  });
});
