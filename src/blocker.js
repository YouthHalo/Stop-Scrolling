(() => {
  const SITE_RULES = {
    youtube: {
      hostPattern: /(^|\.)youtube\.com$/i,
      redirectTarget: "https://www.youtube.com/",
      blockedPathPatterns: [
        /^\/shorts(\/|$)/i,
        /^\/feed\/shorts(\/|$)/i,
        /\/shorts(\/|$)/i,
      ],
      hideSelectors: [
        'a[href*="/shorts"]',
        'a#endpoint[title="Shorts"]',
        'ytd-guide-entry-renderer:has(a[href*="/shorts"])',
        'ytd-guide-entry-renderer:has(a#endpoint[title="Shorts"])',
        'ytd-mini-guide-entry-renderer:has(a[href*="/shorts"])',
        'ytd-pivot-bar-item-renderer:has(a[href*="/shorts"])',
        "ytd-reel-shelf-renderer",
        "ytd-rich-shelf-renderer[is-shorts]",
<<<<<<< HEAD
      ], // Should rarely be seen due to redirect, but in case it is:
=======
      ],
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      message: "YouTube Shorts is blocked by Stop Scrolling.",
    },
    instagram: {
      hostPattern: /(^|\.)instagram\.com$/i,
      redirectTarget: "https://www.instagram.com/",
      blockedPathPatterns: [/^\/reels(\/|$)/i, /^\/reel\//i],
<<<<<<< HEAD
      hideSelectors: [
        'a[href^="/reels"]',
        'a[href^="/reel/"]',
        'a[href^="/explore/"]',
        'a[href="/explore/"]',
      ],
      // Should rarely be seen due to redirect, but in case it is:
=======
      hideSelectors: ['a[href^="/reels"]', 'a[href^="/reel/"]'],
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      message:
        "Instagram Reels is blocked by Stop Scrolling. You can still view reels sent in messages, but you cannot scroll. Lock in.",
    },
    tiktok: {
      hostPattern: /(^|\.)tiktok\.com$/i,
      redirectTarget: null,
      blockedPathPatterns: [/^\//i],
      hideSelectors: [],
<<<<<<< HEAD
      message: "TikTok is blocked by Stop Scrolling.", // This is always seen
=======
      message: "TikTok is blocked by Stop Scrolling.",
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
    },
  };

  const STYLE_ID = "stop-scrolling-style";
  const BLOCK_ID = "stop-scrolling-block";
  const INSTAGRAM_CAUGHT_UP_MARKERS = [
    "all caught up",
    "seen all new posts from the past",
  ];
<<<<<<< HEAD
  const INSTAGRAM_BOUNDARY_STORAGE_KEY =
    "stopScrollingInstagramBoundaryReached";
  const INSTAGRAM_BLOCK_UNTIL_KEY = "stopScrollingInstagramBlockUntil";
  const INSTAGRAM_BLOCK_WINDOW_MS = 2 * 60 * 1000;
=======
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
  const INSTAGRAM_FEED_BOUNDARY_STATE = {
    reached: false,
  };
  const INSTAGRAM_NETWORK_HOST_PATTERN =
    /(^|\.)instagram\.com$|(^|\.)cdninstagram\.com$|(^|\.)fbcdn\.net$/i;

  function normalizeText(value) {
    return (value || "")
      .toLowerCase()
      .replace(/[\u2018\u2019']/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

<<<<<<< HEAD
  function readInstagramBoundaryState() {
    try {
      return sessionStorage.getItem(INSTAGRAM_BOUNDARY_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  }

  function setInstagramBoundaryState(value) {
    INSTAGRAM_FEED_BOUNDARY_STATE.reached = value;
    try {
      if (value) {
        sessionStorage.setItem(INSTAGRAM_BOUNDARY_STORAGE_KEY, "1");
      } else {
        sessionStorage.removeItem(INSTAGRAM_BOUNDARY_STORAGE_KEY);
      }
    } catch {
      // Ignore storage failures.
    }
  }

  function readInstagramBlockUntil() {
    try {
      const raw = sessionStorage.getItem(INSTAGRAM_BLOCK_UNTIL_KEY);
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : 0;
    } catch {
      return 0;
    }
  }

  function setInstagramBlockUntil(timestamp) {
    try {
      sessionStorage.setItem(INSTAGRAM_BLOCK_UNTIL_KEY, String(timestamp));
    } catch {
      // Ignore storage failures.
    }
  }

  function markInstagramBoundaryReached() {
    setInstagramBoundaryState(true);
    setInstagramBlockUntil(Date.now() + INSTAGRAM_BLOCK_WINDOW_MS);
  }

  function isInstagramHomePath() {
    return window.location.pathname === "/" || window.location.pathname === "";
  }

  function hydrateInstagramBoundaryState() {
    if (INSTAGRAM_FEED_BOUNDARY_STATE.reached) {
      return true;
    }

    const persisted = readInstagramBoundaryState();
    if (persisted) {
      INSTAGRAM_FEED_BOUNDARY_STATE.reached = true;
      return true;
    }

    return false;
  }

  function shouldEnforceInstagramBoundaryNow() {
    if (!SITE_RULES.instagram.hostPattern.test(window.location.hostname)) {
      return false;
    }

    if (!isInstagramHomePath()) {
      return false;
    }

    if (hydrateInstagramBoundaryState()) {
      return true;
    }

    return Date.now() < readInstagramBlockUntil();
  }

=======
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
  function isInstagramNetworkHost(hostname) {
    return INSTAGRAM_NETWORK_HOST_PATTERN.test(hostname || "");
  }

  function isMediaStreamPath(pathname) {
    const path = (pathname || "").toLowerCase();
    return (
      /\.(mp4|m4s|m3u8|mpd)(\?|$)/i.test(path) ||
      path.includes("/video/") ||
      path.includes("/dash/")
    );
  }

  function getCurrentRule(urlString = window.location.href) {
    try {
      const url = new URL(urlString);
      return (
        Object.values(SITE_RULES).find((rule) =>
          rule.hostPattern.test(url.hostname),
        ) || null
      );
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

      return rule.blockedPathPatterns.some((pattern) =>
        pattern.test(url.pathname),
      );
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
      const container = endpoint.closest(
        "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer",
      );
      if (!(container instanceof HTMLElement)) {
        return;
      }

      container.style.setProperty("display", "none", "important");
    });
  }

<<<<<<< HEAD
  function hideInstagramExploreEntries() {
    if (!SITE_RULES.instagram.hostPattern.test(window.location.hostname)) {
      return;
    }

    const directExploreLinks = document.querySelectorAll(
      'a[href^="/explore/"], a[href="/explore/"]',
    );
    directExploreLinks.forEach((link) => {
      const container = link.closest(
        'li, div, span, nav a[href^="/explore/"]',
      );

      if (container instanceof HTMLElement) {
        container.style.setProperty("display", "none", "important");
        return;
      }

      if (link instanceof HTMLElement) {
        link.style.setProperty("display", "none", "important");
      }
    });

    const labelTargets = document.querySelectorAll(
      'a[aria-label], svg[aria-label], title',
    );
    labelTargets.forEach((node) => {
      const text = normalizeText(
        node.getAttribute && typeof node.getAttribute === "function"
          ? node.getAttribute("aria-label") || node.textContent || ""
          : node.textContent || "",
      );

      if (!text.includes("explore")) {
        return;
      }

      const container = node.closest("a, li, div, span");
      if (container instanceof HTMLElement) {
        container.style.setProperty("display", "none", "important");
      }
    });
  }

  function hideInstagramSuggestedPosts() {
    if (!SITE_RULES.instagram.hostPattern.test(window.location.hostname)) {
      setInstagramBoundaryState(false);
      return;
    }

    if (!INSTAGRAM_FEED_BOUNDARY_STATE.reached) {
      INSTAGRAM_FEED_BOUNDARY_STATE.reached = readInstagramBoundaryState();
    }

    if (!isInstagramHomePath()) {
=======
  function hideInstagramSuggestedPosts() {
    if (!SITE_RULES.instagram.hostPattern.test(window.location.hostname)) {
      INSTAGRAM_FEED_BOUNDARY_STATE.reached = false;
      return;
    }

    if (window.location.pathname !== "/") {
      INSTAGRAM_FEED_BOUNDARY_STATE.reached = false;
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      return;
    }

    const candidateNodes = document.querySelectorAll("span, div, h3");
    let caughtUpNode = null;
    let suggestedHeaderNode = null;

    candidateNodes.forEach((node) => {
      if (caughtUpNode && suggestedHeaderNode) {
        return;
      }

      const text = normalizeText(node.textContent || "");
      if (!caughtUpNode) {
        const isCaughtUpNode = INSTAGRAM_CAUGHT_UP_MARKERS.some((marker) =>
          text.includes(marker),
        );
        if (isCaughtUpNode) {
          caughtUpNode = node;
        }
      }

      if (!suggestedHeaderNode && text.includes("suggested posts")) {
        suggestedHeaderNode = node;
      }
    });

    if (caughtUpNode || suggestedHeaderNode) {
<<<<<<< HEAD
      markInstagramBoundaryReached();
=======
      INSTAGRAM_FEED_BOUNDARY_STATE.reached = true;
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
    }

    if (!INSTAGRAM_FEED_BOUNDARY_STATE.reached) {
      return;
    }

    const anchorNode = caughtUpNode || suggestedHeaderNode;
    if (!anchorNode) {
      return;
    }

    const caughtUpRect = anchorNode.getBoundingClientRect();
    const caughtUpBottomInDocument = caughtUpRect.bottom + window.scrollY;

    const allPosts = document.querySelectorAll("article");
    allPosts.forEach((post) => {
      if (!(post instanceof HTMLElement)) {
        return;
      }

      const postRect = post.getBoundingClientRect();
      const postTop = postRect.top + window.scrollY;
      if (postTop <= caughtUpBottomInDocument) {
        return;
      }

      post.style.setProperty("display", "none", "important");
    });

    const suggestedHeaders = document.querySelectorAll("h3, span");
    suggestedHeaders.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const text = normalizeText(node.textContent || "");
      if (!text.includes("suggested posts")) {
        return;
      }

      const container = node.closest("div");
      if (!(container instanceof HTMLElement)) {
        return;
      }

      container.style.setProperty("display", "none", "important");
    });

    const loadingIndicators = document.querySelectorAll(
      '[data-visualcompletion="loading-state"][role="progressbar"]',
    );
    loadingIndicators.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

<<<<<<< HEAD
      const indicatorRect = node.getBoundingClientRect();
      const indicatorTop = indicatorRect.top + window.scrollY;
      if (indicatorTop <= caughtUpBottomInDocument) {
        return;
      }

      if (node.closest('[role="dialog"], [aria-label="Search input"]')) {
        return;
      }

      let host = node.parentElement || node;
      const hostHasSearchInput =
        host instanceof HTMLElement &&
        host.querySelector(
          'input[aria-label="Search input"], input[placeholder="Search"]',
        );
      if (hostHasSearchInput) {
        return;
=======
      let host = node.parentElement || node;
      if (host.clientWidth < 120 && host.parentElement) {
        host = host.parentElement;
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      }

      if (host.dataset.stopScrollingReplacement === "1") {
        return;
      }

      host.dataset.stopScrollingReplacement = "1";
      host.innerHTML = "";
      host.style.cssText =
        "display:flex;justify-content:center;align-items:center;width:100%;padding:12px 16px;box-sizing:border-box;";

      const message = document.createElement("div");
      message.textContent = "Posts from other users blocked by Stop Scrolling";
      message.style.cssText =
        "width:min(560px,100%);padding:12px 16px;border:1px solid rgba(255,255,255,0.22);border-radius:12px;background:rgba(255,255,255,0.08);color:#f5f5f5;font-weight:600;text-align:center;font-size:14px;line-height:1.4;";

      host.appendChild(message);
    });
  }

  function shouldBlockInstagramFeedRequest(rawUrl, bodyText) {
<<<<<<< HEAD
    if (!shouldEnforceInstagramBoundaryNow()) {
=======
    if (!SITE_RULES.instagram.hostPattern.test(window.location.hostname)) {
      return false;
    }

    if (window.location.pathname !== "/") {
      return false;
    }

    if (!INSTAGRAM_FEED_BOUNDARY_STATE.reached) {
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      return false;
    }

    let parsed;
    try {
      parsed = new URL(rawUrl, window.location.origin);
    } catch {
      return false;
    }

    if (!isInstagramNetworkHost(parsed.hostname)) {
      return false;
    }

    const path = parsed.pathname.toLowerCase();
    if (
      path.includes("/api/v1/feed/") ||
      path.includes("/api/v1/discover/") ||
      path.includes("/api/v1/reels/") ||
      path.includes("/api/v1/clips/") ||
      path.includes("/api/v1/media/")
    ) {
      return true;
    }

    if (isMediaStreamPath(path)) {
      return true;
    }

    if (!path.includes("/graphql/query") && !path.includes("/api/graphql")) {
      return false;
    }

    const body = normalizeText(bodyText || "");
    const query = normalizeText(parsed.search || "");
    const signal = `${query} ${body}`;
    return (
      signal.includes("max_id") ||
      signal.includes("suggested") ||
      signal.includes("timeline_feed") ||
      signal.includes("chaining") ||
      signal.includes("reels") ||
      signal.includes("feed")
    );
  }

<<<<<<< HEAD
  function shouldBlockInstagramMediaRequest(requestLike, rawUrl, headerBag) {
    if (!shouldEnforceInstagramBoundaryNow()) {
=======
  function shouldBlockInstagramMediaRequest(requestLike, rawUrl) {
    if (!SITE_RULES.instagram.hostPattern.test(window.location.hostname)) {
      return false;
    }

    if (window.location.pathname !== "/") {
      return false;
    }

    if (!INSTAGRAM_FEED_BOUNDARY_STATE.reached) {
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      return false;
    }

    let parsed;
    try {
      parsed = new URL(rawUrl, window.location.origin);
    } catch {
      return false;
    }

    if (!isInstagramNetworkHost(parsed.hostname)) {
      return false;
    }

    if (isMediaStreamPath(parsed.pathname)) {
      return true;
    }

    const destination = (
      requestLike && requestLike.destination ? requestLike.destination : ""
    ).toLowerCase();
    if (destination === "video" || destination === "audio") {
      return true;
    }

<<<<<<< HEAD
    const requestAcceptHeader =
      requestLike &&
      requestLike.headers &&
      typeof requestLike.headers.get === "function"
        ? requestLike.headers.get("accept") || ""
        : "";

    const acceptHeader = normalizeText(
      requestAcceptHeader ||
        (headerBag && headerBag.accept ? headerBag.accept : ""),
=======
    const acceptHeader = normalizeText(
      requestLike &&
        requestLike.headers &&
        typeof requestLike.headers.get === "function"
        ? requestLike.headers.get("accept") || ""
        : "",
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
    );

    return (
      acceptHeader.includes("video") ||
      acceptHeader.includes("audio") ||
      acceptHeader.includes("application/vnd.apple.mpegurl")
    );
  }

  function getRequestBodyText(body) {
    if (!body) {
      return "";
    }

    if (typeof body === "string") {
      return body;
    }

    if (body instanceof URLSearchParams) {
      return body.toString();
    }

    if (body instanceof FormData) {
      const params = new URLSearchParams();
      for (const [key, value] of body.entries()) {
        params.append(key, typeof value === "string" ? value : "[binary]");
      }
      return params.toString();
    }

    return "";
  }

  function installInstagramFeedBoundaryNetworkBlock() {
    if (window.__stopScrollingInstagramNetworkPatched) {
      return;
    }

    window.__stopScrollingInstagramNetworkPatched = true;

    const nativeFetch = window.fetch;
    window.fetch = function patchedFetch(input, init) {
      const request = input instanceof Request ? input : null;
      const url = request ? request.url : String(input);
      const body = getRequestBodyText(
        (init && init.body) || (request && request.body),
      );

      if (
        shouldBlockInstagramFeedRequest(url, body) ||
        shouldBlockInstagramMediaRequest(request, url)
      ) {
        let path = "";
        try {
          path = new URL(url, window.location.origin).pathname;
        } catch {
          path = "";
        }

        if (isMediaStreamPath(path)) {
          return Promise.resolve(
            new Response("", {
              status: 204,
              headers: { "Content-Type": "text/plain" },
            }),
          );
        }

        const payload = JSON.stringify({
          status: "ok",
          items: [],
          feed_items: [],
          more_available: false,
          next_max_id: null,
        });

        return Promise.resolve(
          new Response(payload, {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }

      return nativeFetch.call(this, input, init);
    };

    const nativeXHROpen = XMLHttpRequest.prototype.open;
    const nativeXHRSend = XMLHttpRequest.prototype.send;
<<<<<<< HEAD
    const nativeXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
=======
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)

    XMLHttpRequest.prototype.open = function patchedOpen(method, url, ...rest) {
      this.__stopScrollingMethod = method;
      this.__stopScrollingUrl = url;
<<<<<<< HEAD
      this.__stopScrollingHeaders = {};
      return nativeXHROpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.setRequestHeader =
      function patchedSetRequestHeader(name, value) {
        try {
          const key = String(name || "").toLowerCase();
          if (key) {
            this.__stopScrollingHeaders = this.__stopScrollingHeaders || {};
            this.__stopScrollingHeaders[key] = String(value || "");
          }
        } catch {
          // Ignore header tracking issues.
        }

        return nativeXHRSetRequestHeader.call(this, name, value);
      };

    XMLHttpRequest.prototype.send = function patchedSend(body) {
      const url = this.__stopScrollingUrl || "";
      const bodyText = getRequestBodyText(body);
      if (
        shouldBlockInstagramFeedRequest(url, bodyText) ||
        shouldBlockInstagramMediaRequest(
          null,
          url,
          this.__stopScrollingHeaders || {},
        )
      ) {
        this.abort();
        return;
=======
      return nativeXHROpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function patchedSend(body) {
      const url = this.__stopScrollingUrl || "";
      const bodyText = getRequestBodyText(body);
      if (shouldBlockInstagramFeedRequest(url, bodyText)) {
        let path = "";
        try {
          path = new URL(url, window.location.origin).pathname;
        } catch {
          path = "";
        }

        const isMedia = isMediaStreamPath(path);
        const blockedDataUrl = isMedia
          ? "data:text/plain,"
          : "data:application/json,%7B%22status%22%3A%22ok%22%2C%22items%22%3A%5B%5D%2C%22feed_items%22%3A%5B%5D%2C%22more_available%22%3Afalse%2C%22next_max_id%22%3Anull%7D";

        nativeXHROpen.call(this, "GET", blockedDataUrl, true);
        return nativeXHRSend.call(this);
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      }

      return nativeXHRSend.call(this, body);
    };
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
<<<<<<< HEAD
    hideInstagramExploreEntries();
=======
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
    hideInstagramSuggestedPosts();

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
      true,
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
    window.addEventListener("pageshow", enforceCurrentLocation);
    window.addEventListener("focus", enforceCurrentLocation);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        enforceCurrentLocation();
      }
    });

    const observer = new MutationObserver(() => {
      injectHideStyles(getCurrentRule());
      hideYouTubeShortsGuideEntries();
<<<<<<< HEAD
      hideInstagramExploreEntries();
=======
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
      hideInstagramSuggestedPosts();

      if (pathIsBlocked()) {
        stopMediaPlayback();
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
    });
  }

<<<<<<< HEAD
  hydrateInstagramBoundaryState();
=======
>>>>>>> 836c875 (Prevent reels from loading in instagram homepage from non-following accounts.)
  installInstagramFeedBoundaryNetworkBlock();
  setupLinkInterception();
  watchRouteChanges();
  enforceCurrentLocation();
})();
