chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let activeTab = tabs[0];
        let urlToDuplicate = activeTab.url;

        if (urlToDuplicate.includes("youtube.com/watch")) {
            let newUrl = urlToDuplicate.replace("www.", "www.ss");

            chrome.tabs.create({ url: newUrl }, function(newTab) {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
                    if (tabId === newTab.id && changeInfo.status === 'complete') {
                        let finalUrl = updatedTab.url;
                        console.log("Окончательный URL вкладки: " + finalUrl);

                        chrome.tabs.sendMessage(newTab.id, { action: "executeContentScript", finalUrl: finalUrl });

                        chrome.tabs.onUpdated.removeListener(listener);
                    }
                });
            });
        } else if (/youtube\.com\/@[^/]+\/videos/.test(urlToDuplicate)) {
            console.log("This is YouTube channel " + activeTab.id);
            chrome.tabs.executeScript(activeTab.id, { file: 'content1.js' });
        }
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "debugMessage") {
        console.log('[Debug message from content.js]: ' + message.message);
    }
    else if (message.action === 'logMessage') {
        console.log('[Debug message from content1.js]: ' + message.message);
    }
});
