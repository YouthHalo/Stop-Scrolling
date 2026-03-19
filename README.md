# Stop-Scrolling

A Chrome/Chromium extension that prevents short-form media from playing, so you can focus.

## What It Blocks

- YouTube Shorts routes (for example, `/shorts/...` and `/feed/shorts` if they ever change it)
- Instagram Reels routes (for example, `/reels/...` and `/reel/...` if they ever change it)
- TikTok pages (entire site. You do not need it. Lock in)

## What Still Works

- Regular YouTube videos (`/watch?v=...`)
- Instagram feed/posts
- Instagram messaging and singular reels sent in messages. No scrolling

## How It Works

- Intercepts navigation and clicks to blocked short-form routes.
- Redirects blocked YouTube Shorts and Instagram Reels URLs to each site's home page.
- Replaces TikTok pages with a local block screen.
- Hides common Shorts/Reels entry points from page UI where possible.

## Install Locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked**.
4. Select this project folder (`Stop-Scrolling`).

Steps are similar for respective chromium browsers. (Hopefully, I haven't used any other than Brave...)

## Test URLs

- https://www.youtube.com/shorts
- https://www.instagram.com/reels
- https://www.tiktok.com

These should be blocked, while normal YouTube and Instagram pages should continue working. You don't need Tiktok at all.
