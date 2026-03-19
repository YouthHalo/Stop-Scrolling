function getCaseMessage(urlString) {
  try {
    const hostname = new URL(urlString).hostname.toLowerCase();

    if (hostname === "instagram.com" || hostname.endsWith(".instagram.com")) {
      return "No reels for you :P";
    }

    if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
      return "No shorts for you :P";
    }

    if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) {
      return "No tiktoks for you :P";
    }

    return "Good job, you're not scrolling!";
  } catch {
    return "Good job, you're not scrolling!";
  }
}

async function setPopupMessage() {
  const messageElement = document.getElementById("case-message");
  if (!messageElement) {
    return;
  }

  let tabUrl = "";
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tabUrl = tabs[0]?.url || "";
  } catch {
    tabUrl = "";
  }

  messageElement.textContent = getCaseMessage(tabUrl);
}

setPopupMessage();
