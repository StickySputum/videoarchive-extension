chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "addCurrentTabUrl1") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content.js' });
        });
    } else if (message.action === "AllVidsDownload1") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content1.js' });
        });
    }
});