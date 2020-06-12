chrome.tabs.onSelectionChanged.addListener(function (tabId, selectInfo) {
  chrome.tabs.get(tabId, function (tab) {
    if (tab.url) {
      if (tab.url.includes("notion.so")) {
        chrome.pageAction.show(tabId);
      } else {
        chrome.pageAction.hide(tabId);
      }
    }
  });
});

chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request) {
    if (request.message) {
      if (request.message == "version") {
        sendResponse({ version: 1.0 });
      }
    }
  }
  return true;
});

chrome.pageAction.onClicked.addListener(function (tab) {
  let url = new URL(tab.url).origin;
  let token = "";
  let tableName = [];

  if (url.includes("notion.so")) {
    chrome.cookies.get({ url: url, name: "token_v2" }, function (cookie) {
      token = cookie.value;

      chrome.cookies.set({
        url: "https://chart-nerd.now.sh",
        name: "token",
        value: token,
      });
    });

    chrome.tabs.executeScript(tab.id, {
      file: "contentScript.js",
    });

    chrome.storage.sync.get(["tableName"], function (items) {
      tableName = items["tableName"];
    });

    setTimeout(function () {
      chrome.tabs.create({
        url: `https://chart-nerd.now.sh/build?url=${tab.url}&tableName=${tableName}`,
      });
    }, 500);
  }
});
