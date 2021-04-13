const popupUI = `
<div class="prod-name">
    <h1 class="prod-name__name">{prod-name}<span class="prod-name__env">{prod-env}</span></h1>
   </div>
   <div class="seperator" style="width: 80%"></div>
   <p class="info info--description">
    This extension allow the automatic detection of Atypon's websites and makes the overriding process much more faster and easier
   </p>
   <div class="seperator" style="width: 70%"></div>
   <form class="form"> 
        {options}
   </form>
`;
const formUI = `
    <div class="form__element">
    <div class="form__element__description">
        <b>{control-type}:- </b> {control-desc}
    </div>
    <label class="toggle">
        <input class="toggle-checkbox" name="{control-name}" {checked} type="checkbox">
        <div class="toggle-switch"></div>
    </label>
    </div>
`

/*
config: {
    productName: string,
    siteEnv: string,
    availableOptions: Array<{
        type: string,
        description: string,
        name: string,
        checked: boolean
    }>
}
*/
function buildUI(config) {
    const formsControls = 
    config.availableOptions.map((option) => {
        return formUI
            .replace("{control-type}", option.type)
            .replace("{control-desc}", option.description)
            .replace("{control-name}", option.name)
            .replace("{checked}", option.checked ? "checked" : "");
    });
    const readyTemplate = 
    popupUI
        .replace("{prod-name}", config.productName)
        .replace("{prod-env}", config.siteEnv)
        .replace("{options}", formsControls);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = readyTemplate;
    return wrapper;
}

lottie.loadAnimation({
    container: document.querySelector(".not-available__animation"), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'animations/not-available.json' // the path to the animation json
});

lottie.loadAnimation({
    container: document.querySelector(".thinking__animation"), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'animations/loading.json' // the path to the animation json
});

function hideLoading() {
    document.querySelector(".thinking").classList.toggle("hidden");
}
function showNotAvailable() {
    document.querySelector(".not-available").classList.toggle("hidden");
}
function setUI(elm) {
    document.querySelector("main").append(elm);
}