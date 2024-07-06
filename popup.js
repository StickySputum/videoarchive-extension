document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('runContentScript').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "executeContentScript" });
    });

    document.getElementById('runContentScript1').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "executeContentScript1" });
    });

    document.getElementById('addCurrentTabUrl').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "addTabUrlToStorage" });
    });

    // Add event listener for the clear storage button
    document.getElementById('clearStorage').addEventListener('click', function() {
        chrome.storage.local.clear(function() {
            console.log('Storage and list cleared successfully.');
            // After clearing, update the displayed list to be empty
            displayUrlList([]);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addCurrentTabUrl').addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            let url = activeTab.url;
            chrome.storage.local.get({ urlList: [] }, function(data) {
                var urlList = data.urlList;
                urlList.push(url);
                chrome.storage.local.set({ urlList: urlList }, function() {
                    console.log('URL successfully added to the list.');
                    displayUrlList(urlList);
                });
            });
        });
    });

    chrome.storage.local.get({ urlList: [] }, function(data) {
        var urlList = data.urlList;
        displayUrlList(urlList);
    });
});

function displayUrlList(urlList) {
    var urlListContainer = document.getElementById('urlListContainer');
    urlListContainer.innerHTML = '';
    urlList.forEach(function(url) {
        var urlItem = document.createElement('div');
        urlItem.textContent = url;
        urlListContainer.appendChild(urlItem);
    });
}
