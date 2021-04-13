

function reApplyConfigs(styleGuideLink, releasedAssetsLink, productName, tabUrl, currentConfig, availableOptions) {
    const rules = Array.from(document.querySelectorAll("input:checked")).map((button) => {
        const name = button.getAttribute("name");
        return buildRule(name, styleGuideLink, releasedAssetsLink, productName, availableOptions);
    });
    const config = buildSiteConfig(rules, tabUrl);
    chrome.runtime.sendMessage({action: "deleteDomain", id: currentConfig.id});
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action: "saveDomain", data: config}, () => {
            resolve(config);
            setTimeout(()=> {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
                });
            }, 10);
        });
    })

}
function buildRule(optionName, styleGuideLink, releasedAssetsLink, productName, availableOptions) {
    const transformedLinks = Object.entries(availableOptions).map(([key, value]) => value).find(option=>option.name == optionName).apply(releasedAssetsLink, styleGuideLink || "http://localhost:8080", productName);
    return {
        type: "normalOverride",
        match: transformedLinks.from,
        replace: transformedLinks.to,
        on: true,
        resourceType: optionName
    };
}
function buildSiteConfig(rules, url) {
    return {
        id: Date.now().toString(),
        matchUrl: `*${url}/*`,
        rules: rules,
        on: true
    };
}