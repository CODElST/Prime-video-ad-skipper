# Chrome Web Store listing: Ad Control for Prime Video

## Store listing tab

**Name** (taken from manifest)
Ad Control for Prime Video

**Summary** (taken from manifest `description`, max 132 characters, currently 119)
Mutes Prime Video ads and fast-forwards through them. Toggle each feature from the toolbar. Not affiliated with Amazon.

**Category**
Entertainment

**Language**
English

**Detailed description**

Ad Control for Prime Video makes ad breaks on Prime Video shorter and quieter.

When an ad starts playing, the extension mutes it and, depending on your settings, jumps ahead to the end of the ad, plays it at 16x speed, or both. When the ad is over, your volume and playback speed are put back exactly as they were.

FEATURES
• Mute ads automatically while they play
• Jump to the end of an ad (experimental): reads the time left from the ad timer and seeks ahead
• Speed up ads to 16x, the fastest speed Chrome allows
• Two separate switches in the toolbar popup, so you choose what is used
• Changes apply instantly, even while an ad is playing
• Your choices are remembered

HOW TO USE
1. Install the extension and pin it to your toolbar.
2. Open Prime Video and play something that has ads.
3. Click the toolbar icon any time to switch "Jump to end of ad" and "Speed up at 16x" on or off.

GOOD TO KNOW
• Ads are not removed or blocked. They still play, just much faster or are skipped over.
• Jumping ahead is experimental. If Prime Video does not accept it, the 16x speed-up still shortens the ad.
• Prime Video can change its player at any time, which may affect how well the extension works.
• This extension only works on Prime Video pages. It does nothing on other sites.

PRIVACY
The extension collects no personal data, makes no network requests and sends nothing anywhere. It stores only your two on/off settings, locally in your browser.

DISCLAIMER
This extension is an independent project and is not affiliated with, endorsed by or sponsored by Amazon. "Amazon" and "Prime Video" are trademarks of Amazon.com, Inc. or its affiliates. Using this extension may go against the terms of your streaming service. Ad-free viewing is available from Prime Video as a paid option.

## Graphic assets

| Asset | File / size | Notes |
|---|---|---|
| Store icon | `icons/icon128.png`, 128x128 | Already generated |
| Screenshots | 1280x800 (or 640x400), 1 to 5 | You need to capture these (see below) |
| Small promo tile | 440x280, optional | Not generated |

**Screenshot ideas**
1. Prime Video player during an ad with the extension popup open, both switches on.
2. Close-up of the popup showing the two switches and the status line.
3. (Optional) The same ad with the "Ad 1:06" badge, to show what the extension reacts to.

## Privacy practices tab

**Single purpose**
Make ads on Prime Video shorter and quieter by muting them and jumping or fast-forwarding through them.

**Permission justifications**
- `storage`: saves the user's two on/off settings (jump, speed) in the browser so they persist between sessions.
- Host access (content script on `primevideo.com` and Amazon video pages): needed to find the "Ad playing" badge in the page and to mute, seek and change the speed of the page's video element. The extension reads no other page content.

**Remote code**
No. All code is bundled in the package.

**Data usage**
Does not collect or use any user data. Tick none of the data categories.
Certify all three statements: no sale of data to third parties, no use unrelated to the single purpose, no use for creditworthiness or lending.

**Privacy policy URL**
Only needed if you handle user data, which this extension does not. If you want one anyway, `PRIVACY.md` in this repo can be linked at
https://github.com/CODElST/Prime-video-ad-skipper/blob/main/PRIVACY.md

## Uploading
Upload `ad-control-for-prime-video-store.zip`. It has `manifest.json` at the top level, as the store requires.
