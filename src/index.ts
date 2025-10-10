import OverlayManager from "./base/OverlayManager";

const overlayManager = new OverlayManager();
overlayManager.init({
    overlayType: 'Formula 1',
    provider: 'Saweria',
    parentHtmlElement: document.querySelector('#overlay'),
    sourceOverlayUrl: 'https://saweria.co/widgets/alert?streamKey=a4cb06bb44033504e163d68c0d66f1e3'
});