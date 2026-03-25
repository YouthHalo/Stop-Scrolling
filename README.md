# Stop-Scrolling

A Chrome/Chromium extension that blocks short-form media and addictive feed surfaces, so you can focus.

## What It Blocks

- YouTube Shorts routes (for example, `/shorts/...` and `/feed/shorts` if they ever change it)
- Instagram Reels routes (for example, `/reels/...` and `/reel/...` if they ever change it)
- TikTok pages (entire site. You do not need it. Lock in)
- X/Twitter timeline, replies, explore, and everything outside direct messages

## What Still Works

- Regular YouTube videos (`/watch?v=...`)
- Instagram feed/posts
- Instagram messaging and singular reels sent in messages. No scrolling
- X/Twitter direct messages (`/i/chat`)

## How It Works

- Intercepts navigation and clicks to blocked short-form routes.
- Redirects blocked YouTube Shorts and Instagram Reels URLs to each site's home page.
- Redirects blocked X/Twitter routes to DMs.
- Replaces TikTok pages with a local block screen.
- Hides common Shorts/Reels entry points from page UI where possible.

## Install Locally

1. Open Chrome and go to `chrome://extensions`. (Or a similar page on other chromium browsers)
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked**.
4. Select this project folder (`Stop-Scrolling`).

Steps are similar for respective chromium browsers. (Hopefully, I haven't used any other than Brave...)

## Test URLs

- https://www.youtube.com/shorts
- https://www.instagram.com/reels
- https://www.tiktok.com
- https://x.com/home
- https://x.com/i/chat

These should be blocked, while normal YouTube and Instagram pages should continue working and X DMs should remain accessible. You don't need TikTok at all.
