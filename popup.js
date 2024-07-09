document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('runContentScript1').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "executeContentScript1" });
    });
});