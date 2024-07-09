document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('AllVidsDownload').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "AllVidsDownload1" });
    });

    document.getElementById('addCurrentTabUrl').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "addCurrentTabUrl1" });
    });

    document.getElementById('clearStorage').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "clearStorage1" });
    });

    document.getElementById('DownloadList').addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: "DownloadList1" });
    });

});