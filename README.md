# Ad Control for Prime Video (v1.0)

One extension with two independent switches in the toolbar popup:

- **Jump to end of ad** (experimental): reads the time left from the "Ad 1:33"
  badge and seeks the video to about 0.5 s before the ad ends.
- **Speed up at 16x**: plays the ad as fast as Chrome allows.

While an ad plays and at least one switch is on, the video is also muted.
Your volume and playback speed are restored afterwards. With both switches
off, the extension does nothing. Both are on by default, and the settings are
remembered.

## Install via Web store
Chrome webstore link: https://chromewebstore.google.com/detail/ad-control-for-prime-vide/mgbippjiaabbocjnndbmejmflgiondco
## Install directly via Source code (Chrome / Edge / Brave)
1. Unzip this folder.
2. Disable or remove the older "Prime Video Ad Skipper" and
   "Prime Video Ad Jump" extensions, so they don't fight over the video.
3. Open `chrome://extensions`, enable **Developer mode**.
4. Click **Load unpacked** and select this folder.
5. Pin the extension (puzzle-piece icon > pin) to reach the switches quickly.

Changes take effect immediately, even while an ad is playing.

## Checking the result (DevTools > Console)
- `[PV Ad Control] ad detected (jump=true, speed=true)`
- `[PV Ad Control] jumping: remaining=93s, currentTime A -> B`
- about 2 s later: `jump seems to have worked` or `jump did NOT stick`
- `[PV Ad Control] ad finished or features off, settings restored`

## Limitations
- Amazon may change the player markup. If ads stop being detected, inspect the
  "Ad" badge and update `AD_SELECTORS` in `content.js`.
- Amazon may reject the seek or stall the stream; the speed switch is the
  fallback for that.
- Using this may conflict with Amazon's Terms of Service. Amazon also sells an
  ad-free add-on, which is the supported way to avoid ads.
