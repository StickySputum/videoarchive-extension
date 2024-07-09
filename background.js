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