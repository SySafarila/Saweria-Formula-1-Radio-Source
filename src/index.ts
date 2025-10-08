import OverlayManager from "./base/OverlayManager";

const overlayManager = new OverlayManager();
overlayManager.init({
    overlayType: 'Formula 1',
    provider: 'BagiBagi',
    parentHtmlElement: document.querySelector('#overlay'),
    sourceOverlayUrl: 'https://bagibagi.co/alertbox/0ZzTRCQsIE1qQ4Z3HANFdTZqTZbKoMga'
});