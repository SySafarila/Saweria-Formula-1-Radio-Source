import startDelay from "../utils/delay";
import Donation from "./Donation";
import Sound from "../utils/Sound";

export type ShowOverlayOptions = {
    delayToHide?: number
    delayToDisplay?: number
    donation: Donation
}

interface IOverlay {
    htmlParent: Element
    donatorName: Element;
    amount: Element;
    message: Element;

    showOverlay(options: ShowOverlayOptions): void

    hideOverlay(): void

    playNotification(): void

    playTts(textToSpeeches: string[]): void

    initTemplate(): void
}

export default class Overlay implements IOverlay {
    htmlParent: Element;
    donatorName: Element;
    amount: Element;
    message: Element;

    constructor(htmlParent: Element) {
        this.htmlParent = htmlParent;
        this.initTemplate();
        this.donatorName = htmlParent.querySelector('#donatorName');
        this.amount = htmlParent.querySelector('#amount');
        this.message = htmlParent.querySelector('#message');
    }

    initTemplate(): void {
        this.htmlParent.innerHTML = `<div class="bg-yellow-500 p-3 rounded border-2 border-yellow-700 m-2 flex flex-col items-center justify-center">
    <p><span id="donatorName" class="font-bold text-[#a600e7]">Syahru</span> <span>memberikan</span> <span id="amount" class="font-bold text-[#a600e7]">20,000</span></p>
    <p id="message">Hello world</p>
</div>`
    }

    async showOverlay(options: ShowOverlayOptions): Promise<void> {
        // set donation data
        this.donatorName.innerHTML = options.donation.donatorName
        this.amount.innerHTML = options.donation.amount.toString()
        this.message.innerHTML = options.donation.message

        // delays before overlay displayed
        await startDelay(options.delayToDisplay);
        console.info("Display overlay")

        // display overlay
        this.htmlParent.classList.remove('hidden');

        // play cash register sound
        await this.playNotification();

        // play tts
        await this.playTts(options.donation.textToSpeeches)

        // delay before hide overlay
        await startDelay(options.delayToHide)

        // hide overlay
        this.hideOverlay();
    }

    hideOverlay(): void {
        console.info("Hiding overlay");
        this.htmlParent.classList.add('hidden');
    }

    async playNotification() {
        console.info("Play notification");
        try {
            await Sound.playCashRegister();
        } catch (e) {
            console.error(e);
        }
    }

    async playTts(textToSpeeches: string[]) {
        if (textToSpeeches.length > 0) {
            for (const tts of textToSpeeches) {
                try {
                    await Sound.playTextToSpeech(tts);
                    await startDelay(500);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}