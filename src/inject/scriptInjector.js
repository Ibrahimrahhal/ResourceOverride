(function() {
    "use strict";

    var fileTypeToTag = {
        js: "script",
        css: "style"
    };

    var processDomain = function(domain) {
        var rules = domain.rules || [];
        rules.forEach(function(rule) {
            if (rule.on && rule.type === "fileInject") {
                var newEl = document.createElement(fileTypeToTag[rule.fileType] || "script");
                newEl.appendChild(document.createTextNode(rule.file));
                if (rule.injectLocation === "head") {
                    var firstEl = document.head.children[0];
                    if (firstEl) {
                        document.head.insertBefore(newEl, firstEl);
                    } else {
                        document.head.appendChild(newEl);
                    }
                } else {
                    if (document.body) {
                        document.body.appendChild(newEl);
                    } else {
                        document.addEventListener("DOMContentLoaded", function() {
                            document.body.appendChild(newEl);
                        });
                    }
                }
            }
        });
    };

    var isAtyponSite = function() {
        console.log(window.location.href)
        const resourcePath = Array.from(document.getElementsByTagName("link")).map(elm=>elm.href).find(path=>path.includes('releasedAssets'));
        if(!resourcePath)
            return { isAtyponSite: false };
        const releasedAssetsPath = resourcePath.split('/').reduce((prev, current) => {
            if(prev.includes('releasedAssets'))
                return prev
            if(prev === "")
                return current;
            return `${prev}/${current}`;
        }, '');
        const productName = releasedAssetsPath.split('/').reverse()[1];
        return {
            isAtyponSite: true,
            releasedAssets: releasedAssetsPath,
            product: productName,
            host: location.host
        };
    }

    chrome.runtime.sendMessage({action: "getDomains"}, function(domains) {
        domains = domains || [];
        domains.forEach(function(domain) {
            if (domain.on) {
                chrome.runtime.sendMessage({
                    action: "match",
                    domainUrl: domain.matchUrl,
                    windowUrl: location.href
                }, function(result) {
                    if (result) {
                        processDomain(domain);
                    }
                });
            }
        });
    });

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
        if (msg.action === 'log') {
            var logStyle = "color: #007182; font-weight: bold;";
            if (msg.important) {
                logStyle += "background: #AAFFFF;";
            }
            console.log("%c[Resource Override] " + msg.message, logStyle);
        } else if(msg.action === 'isAtyponSite') {
            console.log(isAtyponSite());
            sendResponse({isAtyponSite: isAtyponSite()});
        }
    });

})();
