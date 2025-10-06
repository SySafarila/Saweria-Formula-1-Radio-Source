import Overlay from "./Overlay";
import Queue from "./Queue";
import Listener from "./Listener";
import Adapter from "./Adapter";

export default class OverlayManager {
    init() {
        console.info("Connecting...")
        const htmlElement = document.querySelector('#overlay')
        if (!htmlElement) throw new Error("No overlay element found");

        const sourceOverlayUrl: string = "https://saweria.co/widgets/alert?streamKey=a4cb06bb44033504e163d68c0d66f1e3";

        const adapter = new Adapter(sourceOverlayUrl);
        const overlay = new Overlay(htmlElement)
        const queue = new Queue(overlay)
        const listener = new Listener(queue, adapter)
        listener.listen()
    }
}