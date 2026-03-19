(() => {
  const SITE_RULES = {
    youtube: {
      hostPattern: /(^|\.)youtube\.com$/i,
      redirectTarget: "https://www.youtube.com/",
      blockedPathPatterns: [
        /^\/shorts(\/|$)/i,
        /^\/feed\/shorts(\/|$)/i,
        /\/shorts(\/|$)/i
      ],
      hideSelectors: [
        'a[href*="/shorts"]',
        'a#endpoint[title="Shorts"]',
        'ytd-guide-entry-renderer:has(a[href*="/shorts"])',
        'ytd-guide-entry-renderer:has(a#endpoint[title="Shorts"])',
        'ytd-mini-guide-entry-renderer:has(a[href*="/shorts"])',
        'ytd-pivot-bar-item-renderer:has(a[href*="/shorts"])',
        "ytd-reel-shelf-renderer",
        "ytd-rich-shelf-renderer[is-shorts]"
      ],
      message: "YouTube Shorts is blocked by Stop Scrolling."
    },
    instagram: {
      hostPattern: /(^|\.)instagram\.com$/i,
      redirectTarget: "https://www.instagram.com/",
      blockedPathPatterns: [/^\/reels(\/|$)/i, /^\/reel\//i],
      hideSelectors: ['a[href^="/reels"]', 'a[href^="/reel/"]'],
      message: "Instagram Reels is blocked by Stop Scrolling. You can still view reels sent in messages, but you cannot scroll. Lock in."
    },
    tiktok: {
      hostPattern: /(^|\.)tiktok\.com$/i,
      redirectTarget: null,
      blockedPathPatterns: [/^\//i],
      hideSelectors: [],
      message: "TikTok is blocked by Stop Scrolling."
    }
  };

  const STYLE_ID = "stop-scrolling-style";
  const BLOCK_ID = "stop-scrolling-block";

  function getCurrentRule(urlString = window.location.href) {
    try {
      const url = new URL(urlString);
      return Object.values(SITE_RULES).find((rule) => rule.hostPattern.test(url.hostname)) || null;
    } catch {
      return null;
    }
  }

  function pathIsBlocked(urlString = window.location.href) {
    try {
      const url = new URL(urlString);
      const rule = getCurrentRule(url.href);

      if (!rule) {
        return false;
      }

      return rule.blockedPathPatterns.some((pattern) => pattern.test(url.pathname));
    } catch {
      return false;
    }
  }

  function blockableLinkHref(href) {
    try {
      const parsed = new URL(href, window.location.origin);
      return pathIsBlocked(parsed.href);
    } catch {
      return false;
    }
  }

  function stopMediaPlayback() {
    const media = document.querySelectorAll("video, audio");
    media.forEach((item) => {
      try {
        item.pause();
        item.currentTime = 0;
      } catch {
        // Ignore if it doesn't work
      }
    });
  }

  function injectHideStyles(rule) {
    if (!rule || !rule.hideSelectors.length) {
      return;
    }

    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `${rule.hideSelectors.join(", ")} { display: none !important; }`;
    (document.head || document.documentElement).appendChild(style);
  }

  function hideYouTubeShortsGuideEntries() {
    if (!SITE_RULES.youtube.hostPattern.test(window.location.hostname)) {
      return;
    }

    const endpointSelector =
      'ytd-guide-entry-renderer a#endpoint[title="Shorts"], ytd-mini-guide-entry-renderer a#endpoint[title="Shorts"]';

    const endpoints = document.querySelectorAll(endpointSelector);
    endpoints.forEach((endpoint) => {
      const container = endpoint.closest("ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer");
      if (!(container instanceof HTMLElement)) {
        return;
      }

      container.style.setProperty("display", "none", "important");
    });
  }

  function renderBlockScreen(message) {
    stopMediaPlayback();

    const doRender = () => {
      if (document.getElementById(BLOCK_ID)) {
        return;
      }

      const root = document.body || document.documentElement;
      if (!root) {
        return;
      }

      const blocker = document.createElement("div");
      blocker.id = BLOCK_ID;
      blocker.innerHTML = `
        <div class="stop-scrolling-card">
          <h1>Short-form content blocked</h1>
          <p>${message}</p>
          <p>You can still use regular YouTube videos, Instagram posts, and messages.</p>
        </div>
      `;

      const blockStyle = document.createElement("style");
      blockStyle.textContent = `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #0f172a !important;
          color: #e2e8f0 !important;
          min-height: 100vh !important;
        }

        body > *:not(#${BLOCK_ID}) {
          display: none !important;
        }

        #${BLOCK_ID} {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at top, #1e293b, #020617 60%);
          font-family: Segoe UI, Tahoma, sans-serif;
          padding: 24px;
          box-sizing: border-box;
        }

        .stop-scrolling-card {
          width: min(560px, 100%);
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(4px);
          box-shadow: 0 20px 45px rgba(2, 6, 23, 0.45);
          text-align: center;
        }

        .stop-scrolling-card h1 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.2;
          color: #f8fafc;
        }

        .stop-scrolling-card p {
          margin: 8px 0;
          line-height: 1.5;
          font-size: 16px;
        }
      `;

      if (document.head) {
        document.head.appendChild(blockStyle);
      } else {
        document.documentElement.appendChild(blockStyle);
      }

      root.appendChild(blocker);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", doRender, { once: true });
    } else {
      doRender();
    }
  }

  function enforceCurrentLocation() {
    const rule = getCurrentRule();
    if (!rule) {
      return;
    }

    injectHideStyles(rule);
    hideYouTubeShortsGuideEntries();

    if (!pathIsBlocked()) {
      return;
    }

    stopMediaPlayback();

    if (rule.redirectTarget && window.location.href !== rule.redirectTarget) {
      window.location.replace(rule.redirectTarget);
      return;
    }

    renderBlockScreen(rule.message);
  }

  function setupLinkInterception() {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        const link = target.closest("a[href]");
        if (!link) {
          return;
        }

        const href = link.getAttribute("href") || "";
        if (!href || !blockableLinkHref(href)) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const currentRule = getCurrentRule(link.href);
        if (currentRule && currentRule.redirectTarget) {
          window.location.assign(currentRule.redirectTarget);
        }
      },
      true
    );
  }

  function watchRouteChanges() {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function patchedPushState(...args) {
      const result = pushState.apply(this, args);
      enforceCurrentLocation();
      return result;
    };

    history.replaceState = function patchedReplaceState(...args) {
      const result = replaceState.apply(this, args);
      enforceCurrentLocation();
      return result;
    };

    window.addEventListener("popstate", enforceCurrentLocation);
    window.addEventListener("hashchange", enforceCurrentLocation);

    const observer = new MutationObserver(() => {
      injectHideStyles(getCurrentRule());
      hideYouTubeShortsGuideEntries();

      if (pathIsBlocked()) {
        stopMediaPlayback();
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true
    });
  }

  setupLinkInterception();
  watchRouteChanges();
  enforceCurrentLocation();
})();
