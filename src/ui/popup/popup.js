
const availableOption = {
    styles: {
        name: "Styles",
        apply: (resleasedAssetsUrl, styleguideUrl, product) => {
            return { 
                from: `${resleasedAssetsUrl}/css/build*.css`, 
                to:`${styleguideUrl}/spec/products/${product}/releasedAssets/css/build.css`,
            }
        }
    },
    scripts: {
        name: "Scripts",
        apply: (resleasedAssetsUrl, styleguideUrl, product) => {
            return { 
                from: `${resleasedAssetsUrl}/js/main*.js`, 
                to: `${styleguideUrl}/spec/products/${product}/releasedAssets/js/main.bundle.js`,
            }
        }
    }
}


window.onload = () => {
    chrome.runtime.sendMessage({action: "getSiteReport"},
    function (response) {
        document.getElementsByTagName("h1")[0].innerHTML = JSON.stringify(response);
        window["infoAtypon"] = response.isAtyponSite;
        window["currentConfig"] = response.domains || { rules: []};
        setIntialUI(response.domains);
    }
);

document.getElementsByTagName("button")[0].addEventListener("click", (e)=>{
    e.target.classList.toggle("active");
    reApplyConfigs("shit", infoAtypon.releasedAssets, infoAtypon.product, infoAtypon.host, currentConfig);
})
}

function setIntialUI(currentConfig) {
    currentConfig.rules.forEach((rule) => {
        document.querySelector(`[data-type="${rule.resourceType}"]`).classList.toggle("active");
    });
}
function reApplyConfigs(sg, assetsurl, prod, url, currentConfig) {
    const rules = Array.from(document.querySelectorAll("button.active")).map((button) => {
        const type = button.getAttribute("data-type");
        return buildRule(type, sg, assetsurl, prod);
    });
    const config = buildSiteConfig(rules, url);
    chrome.runtime.sendMessage({action: "deleteDomain", id: currentConfig.id});
    chrome.runtime.sendMessage({action: "saveDomain", data: config}, () => {
        window["currentConfig"] = config;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    });
}
function buildRule(type, sg, assetsurl, prod) {
    const transformedLinks = availableOption[type].apply(assetsurl, sg, prod);
    return {
        type: "normalOverride",
        match: transformedLinks.from,
        replace: "https://www.facebook.com" || transformedLinks.to,
        on: true,
        resourceType: type
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

