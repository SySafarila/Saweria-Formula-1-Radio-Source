import Overlay from "./Overlay";
import Queue from "./Queue";
import Listener from "./Listener";
import Adapter from "./Adapter";
import SaweriaAdapter from "../adapters/saweria/SaweriaAdapter";
import Formula1Overlay from "../overlays/Formula1Overlay";

type Provider = "Saweria" | "BagiBagi"
type OverlayType = "Basic" | "Formula 1"
type Options = {
    provider: Provider;
    overlayType: OverlayType;
    sourceOverlayUrl: string;
}

export default class OverlayManager {
    init(options: Options) {
        console.info("Connecting...")
        const htmlElement = document.querySelector('#overlay')
        if (!htmlElement) throw new Error("No overlay element found");

        const sourceOverlayUrl: string = options.sourceOverlayUrl;

        let adapter: Adapter;
        switch (options.provider) {
            case "Saweria":
                adapter = new SaweriaAdapter(sourceOverlayUrl)
                break;
            case "BagiBagi":
                throw new Error("Adapter for BagiBagi not implemented yet")
            default:
                throw new Error("please choose supported adapter: Saweria or BagiBagi")
        }

        let overlay: Overlay;
        switch (options.overlayType) {
            case "Basic":
                overlay = new Overlay(htmlElement);
                break;
            case "Formula 1":
                overlay = new Formula1Overlay(htmlElement);
                break;
            default:
                throw new Error("Please choose supported overlay overlay type: Basic or Formula 1");
        }

        const queue = new Queue(overlay)
        const listener = new Listener(queue, adapter)
        listener.listen()
    }
}