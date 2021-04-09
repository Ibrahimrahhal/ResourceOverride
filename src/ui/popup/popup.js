chrome.runtime.sendMessage({action: "getSiteReport"},
    function (response) {
        document.getElementsByTagName("h1")[0].innerHTML = JSON.stringify(response);
    }
);


function buildUI() {
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
}


