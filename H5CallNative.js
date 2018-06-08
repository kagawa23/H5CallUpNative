

const CONFIG = {
    // 唤起失败时的跳转链接
    FAILBACK: {
        ANDROID: 'https://www.shejijia.com/static/app/download2.html',
        IOS: 'https://oia.shejijia.com/AppHome',
    },
    CALLAPP: {
        ANDROID: '',
        IOS: '',
        DESKTOP: '',
        WX: '',
    },
    // 唤起超时时间，超时则跳转到下载页面
    LOAD_WAITING: 3000,
};

const getBrowser = () => ({
    isAndroid: () => !!navigator.userAgent.match(/Android/i),
    isIOS: () => !!navigator.userAgent.match(/iPhone|iPad|iPod/i),
    isWx: () => !!navigator.userAgent.match(/micromessenger/i),
});

export default class CallNative {
    constructor() {
        this.config = CONFIG;
        this.browser = getBrowser();
    }

    _mixinConfig(config) {
        if (!config) {
            return;
        }
        let { config: AppConfig } = this;

        this.config.LOAD_WAITING = config.loadWaiting || AppConfig.LOAD_WAITING;

        this.config.CALLAPP = config.callApp;
    }

    openApp(config) {
        this._mixinConfig(config);
        const { ANDROID, IOS, DESKTOP, WX } = this.config.CALLAPP;
        if (this.browser.isWx()) {
            // wexin要再浏览器打开新的页面
            window.location.href = WX;
        } else if (this.browser.isAndroid()) {
            // android
            let start = Date.now();
            setTimeout(() => {
                // 如果app启动，浏览器最小化进入后台，则计时器存在推迟或者变慢的问题
                // 那么代码执行到此处时，时间间隔必然大于设置的定时时间
                if (Date.now() - start <= this.config.LOAD_WAITING + 200) {
                    window.location.href = this.config.FAILBACK.ANDROID;
                }
            }, this.config.LOAD_WAITING);
            window.location.href = ANDROID;
        } else if (this.browser.isIOS()) {
            // on ios
            window.location = IOS;
        } else {
            window.location = DESKTOP;
        }
    }
}
