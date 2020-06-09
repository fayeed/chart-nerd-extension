chrome.browserAction.onClicked.addListener(function (tab) {
  let url = new URL(tab.url).origin;
  let token = "";
  let tableName = [];

  if (url.includes("notion.so")) {
    chrome.cookies.get({ url: url, name: "token_v2" }, function (cookie) {
      token = cookie.value;
    });

    chrome.tabs.executeScript(tab.id, {
      file: "contentScript.js",
    });

    chrome.storage.sync.get(["tableName"], function (items) {
      tableName = items["tableName"];
    });

    setTimeout(() => {
      chrome.tabs.create(
        {
          url: `https://chart-nerd.now.sh/build?url=${url}&tableName=${tableName}`,
        },
        function (tab) {
          chrome.tabs.executeScript(tab.id, {
            code: `localStorage.setItem("token", "${token}");`,
          });
        }
      );
    }, 1000);
  } else {
    alert("This extension only works on notion.so");
  }
});
