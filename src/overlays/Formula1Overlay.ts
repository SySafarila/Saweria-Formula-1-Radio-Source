import Overlay, {ShowOverlayOptions} from "../base/Overlay";
import startDelay from "../utils/delay";

export default class Formula1Overlay extends Overlay {
    private intervals: NodeJS.Timeout[] = [];

    initTemplate() {
        this.htmlParent.innerHTML = `<div class="ferrari" id="radio">
      <div class="bg-driver">
        <div class="flex flex-col items-end w-full p-4 gap-2">
          <span
            class="uppercase font-f1-bold font-bold text-4xl italic break-words text-right leading-none"
            id="driver-name"
            >Syahrul</span
          >
          <div class="flex items-center gap-x-2 w-full justify-end">
            <img
              src="./images/ferrari-ges.svg"
              alt="Ferrari"
              id="constructor"
              data-constructor="ferrari"
            />
            <span
              class="uppercase text-white font-f1-bold font-bold -mt-[6px] text-4xl italic text-right break-words leading-none"
              id="driver-radio"
              >Radio</span
            >
          </div>
        </div>
        <div
          class="audio-visual flex justify-between pb-2 px-4 items-end gap-[.3rem] md:gap-4"
          id="audio-visual"
        >
          <div class="transition-all max-h-[50%]" id="h-1"></div>
          <div class="transition-all max-h-[60%]" id="h-2"></div>
          <div class="transition-all max-h-[70%]" id="h-3"></div>
          <div class="transition-all max-h-[80%]" id="h-4"></div>
          <div class="transition-all max-h-[90%]" id="h-5"></div>
          <div class="transition-all max-h-full" id="h-6"></div>
          <div class="transition-all max-h-full" id="h-7"></div>
          <div class="transition-all max-h-full" id="h-8"></div>
          <div class="transition-all max-h-[90%]" id="h-9"></div>
          <div class="transition-all max-h-[80%]" id="h-10"></div>
          <div class="transition-all max-h-[70%]" id="h-11"></div>
          <div class="transition-all max-h-[60%]" id="h-12"></div>
          <div class="transition-all max-h-[50%]" id="h-13"></div>
        </div>
        <hr class="border-t-2 pb-2" />
      </div>
      <div class="bg-message flex flex-col gap-4">
        <p
          class="uppercase text-left text-white text-xl italic p-4 pb-0 font-semibold break-words w-[95%] mr-auto leading-none"
          id="donation"
        >
          "<span id="donatorName">Donator Name</span> <span id="amount"></span>"
        </p>
        <p
          class="uppercase text-right text-xl italic p-4 pt-0 font-semibold break-words w-[95%] ml-auto leading-none"
          id="message"
        >
          "Man, the aplhatauri is such an idiot"
        </p>
      </div>
    </div>`
    }

    startAudioVisual() {
        const audioVisuals =
            document.querySelectorAll("#audio-visual div");

        audioVisuals.forEach((el) => {
            const intervalId = setInterval(() => {
                el.setAttribute("style", `height: ${Math.random() * 100}%`);
            }, 150);
            this.intervals.push(intervalId);
        });
    }

    stopAudioVisual() {
        const audioVisuals =
            document.querySelectorAll("#audio-visual div");

        audioVisuals.forEach((el) => {
            el.setAttribute("style", "height: 5%");
        });

        this.intervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.intervals = [];
    }

    async showOverlay(options: ShowOverlayOptions): Promise<void> {
        // set donation data
        this.donatorName.innerHTML = options.donation.donatorName
        this.amount.innerHTML = options.donation.amount.toString()
        this.message.innerHTML = options.donation.message

        // delays before overlay displayed
        await startDelay(options.delayToDisplay);
        console.info("Display overlay")

        // play cash register sound
        this.playNotification();

        // display overlay
        this.htmlParent.classList.remove('hidden');

        // start audio visual
        this.startAudioVisual();

        // delay before stop audio visual
        await startDelay(5000)

        // stop audio visual
        this.stopAudioVisual();

        // delay before hide overlay
        await startDelay(options.delayToHide)

        // hide overlay
        this.hideOverlay();
    }
}