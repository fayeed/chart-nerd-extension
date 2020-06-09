const data = document.querySelectorAll(
  '.notion-collection_view-block div[data-root="true"]'
);

let arr = [];

for (const d of data) {
  arr.push(d.innerHTML);
}

chrome.storage.sync.set(
  {
    tableName: arr,
  },
  function () {
    console.log("saved");
  }
);
