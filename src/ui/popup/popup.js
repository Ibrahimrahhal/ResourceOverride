
const availableOptions = {
    styles: {
        name: "Styles",
        description: "Main bundle css file",
        apply: (resleasedAssetsUrl, styleguideUrl, product) => {
            return { 
                from: `${resleasedAssetsUrl}/css/build*.css`, 
                to:`${styleguideUrl}/specs/products/${product}/releasedAssets/css/build.css`,
            }
        }
    },
    scripts: {
        name: "Scripts",
        description: "Main bundle javascript file",
        apply: (resleasedAssetsUrl, styleguideUrl, product) => {
            return { 
                from: `${resleasedAssetsUrl}/js/main*.js`, 
                to: `${styleguideUrl}/specs/products/${product}/releasedAssets/js/main.bundle.js`,
            }
        }
    }
}


window.onload = () => {
    chrome.runtime.sendMessage({action: "getSiteReport"}, function (response) {
        window["infoAtypon"] = response.siteReport;
        window["currentConfig"] = response.domains || { rules: []};
        
        if(infoAtypon.isAtyponSite) {
            const uiWrapper = buildUI(buildUIConfig());
            hideLoading();
            setUI(uiWrapper);
            initFormController();
        } else {
            hideLoading();
            showNotAvailable();
        }
    }
);
}

function buildUIConfig(){
    return {
        productName: infoAtypon.product,
        siteEnv: getEnvType(infoAtypon.host),
        availableOptions: Object.keys(availableOptions).map((type) => {
            return {
                type,
                ...availableOptions[type],
                checked: currentConfig.rules.find(rule=>rule.resourceType===availableOptions[type].name)
            };
        })
    }
}

function initFormController() {
    [...document.getElementsByTagName("input")].map(elm => elm.addEventListener("click", (e)=>{
        reApplyConfigs(null, infoAtypon.releasedAssets, infoAtypon.product, infoAtypon.host, currentConfig, availableOptions).then((config) => {
            window["currentConfig"] = config;
        });
    }));;
}

function getEnvType(host) {
    try {
        if(host.includes("literatumonline")) {
            return host.split(".")[0].split("-")[1];
        }
    } finally { }
    return "prod";
}

