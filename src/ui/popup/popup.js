chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"action": "isAtyponSite"}, ({isAtyponSite}) => {
        document.getElementsByTagName('h1')[0].innerHTML = isAtyponSite;
        console.log(isAtyponSite);
    });
  })