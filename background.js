chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "executeContentScript") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content.js' });
        });
    } else if (message.action === "executeContentScript1") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content1.js' });
        });
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "debugMessage") {
        console.log('[Debug message from content.js]: ' + message.message);
    } else if (message.action === 'logMessage') {
        console.log('[Debug message from content1.js]: ' + message.message);
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "addTabUrlToStorage") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            let url = activeTab.url;
            chrome.storage.local.get({ urlList: [] }, function(data) {
                var urlList = data.urlList;
                urlList.push(url);
                chrome.storage.local.set({ urlList: urlList }, function() {
                    console.log('URL successfully added to the list.');
                });
            });
        });
    }
});
