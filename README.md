# Stop-Scrolling

A Chrome/Chromium extension that prevents short-form media from playing.

## What It Blocks

- YouTube Shorts routes (for example, `/shorts/...` and `/feed/shorts`)
- Instagram Reels routes (for example, `/reels/...` and `/reel/...`)
- TikTok pages (entire site)

## What Still Works

- Regular YouTube videos (`/watch?v=...`)
- Instagram feed/posts
- Instagram messaging

## How It Works

- Intercepts navigation and clicks to blocked short-form routes.
- Redirects blocked YouTube Shorts and Instagram Reels URLs to each site's home page.
- Replaces TikTok pages with a local block screen.
- Hides common Shorts/Reels entry points from page UI where possible.

## Install Locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder (`Stop-Scrolling`).

## Test URLs

- https://www.youtube.com/shorts
- https://www.instagram.com/reels/

These should be blocked, while normal YouTube and Instagram pages should continue working.
