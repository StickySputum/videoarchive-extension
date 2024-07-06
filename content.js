chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "executeContentScript") {
        function displayUrlsFromStorage() {
            chrome.storage.local.get({ urlList: [] }, function(data) {
                var urlList = data.urlList;
                var urlListContainer = document.getElementById('urlListContainer');
                
                // Clear the container before adding new URLs
                urlListContainer.innerHTML = '';
                
                // Add each URL to the list
                urlList.forEach(function(url) {
                    var urlItem = document.createElement('div');
                    urlItem.textContent = url;
                    urlListContainer.appendChild(urlItem);
                });
            });
        }
        
        // Call the function to display the list of URLs when the page loads
        displayUrlsFromStorage();
        // Send a message to background.js to add the current tab's URL to storage
        chrome.runtime.sendMessage({ action: "addTabUrlToStorage" });
    }
});
