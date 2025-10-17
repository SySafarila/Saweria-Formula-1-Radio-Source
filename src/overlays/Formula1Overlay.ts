import Overlay, {ShowOverlayOptions} from "../base/Overlay";
import startDelay from "../utils/delay";
import queryString from "query-string";

type TeamConstructor =
    | "ferrari"
    | "mercedes"
    | "redbull"
    | "mclaren"
    | "aston-martin"
    | "haas"
    | "rb"
    | "williams"
    | "alpine"
    | "sauber";

export default class Formula1Overlay extends Overlay {
    private intervals: NodeJS.Timeout[] = [];
    private teamConstructor: TeamConstructor = "ferrari";
    private driverName: string = "Syahrul";
    private isConfigured: boolean = false;

    private setTeamConstructor() {
        const query = queryString.parse(location.search) as {
            teamConstructor: TeamConstructor;
        }
        this.teamConstructor = query.teamConstructor ?? "ferrari";
    }

    private setDriverName() {
        const query = queryString.parse(location.search) as {
            driverName: string;
        }
        this.driverName = query.driverName ?? "Syahrul";
    }

    private checkIsConfigured() {
        const query = queryString.parse(location.search) as {
            isConfigured: "YES" | "NO";
        }
        query.isConfigured == "YES" ? this.isConfigured = true : this.isConfigured = false;
    }

    initTemplate() {
        this.setTeamConstructor();
        this.setDriverName();
        this.checkIsConfigured()

        if (!this.isConfigured) {
            this.htmlConfig.classList.remove("hidden");
            this.htmlConfig.innerHTML = `<form
      action=""
      method="get"
      id="formSetting"
      class="p-2 grid grid-cols-2 md:grid-cols-3 w-full gap-2"
    >
      <input type="hidden" name="isConfigured" value="YES" />
      <input type="hidden" name="sourceOverlay" value="${this._setting.sourceOverlayUrl}" />
      <input type="hidden" name="provider" value="${this._setting.provider}" />
      <input type="hidden" name="overlayType" value="${this._setting.overlayType}" />
      <div class="flex flex-col gap-1">
        <label for="driverNameInput">Driver Name</label>
        <input
          type="text"
          name="driverName"
          id="driverNameInput"
          class="border border-black rounded px-5 py-3"
          placeholder="Driver Name"
          value="Denaldi"
          required
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="teams">Teams</label>
        <select
          name="teamConstructor"
          id="teams"
          class="border-black border rounded px-5 py-3"
        >
          <option class="capitalize" value="ferrari">Ferrari</option>
          <option class="capitalize" value="mercedes">Mercedes</option>
          <option class="capitalize" value="redbull">Red Bull</option>
          <option class="capitalize" value="mclaren">Mclaren</option>
          <option class="capitalize" value="aston-martin">Aston Martin</option>
          <option class="uppercase" value="haas">HAAS</option>
          <option class="uppercase" value="rb">VCARB</option>
          <option class="capitalize" value="williams">Williams</option>
          <option class="capitalize" value="alpine">Alpine</option>
          <option class="capitalize" value="sauber">Kick Sauber</option>
        </select>
      </div>
      <div
        class="grid grid-cols-1 gap-2 col-span-2 md:col-span-1 md:col-start-2"
      >
        <button
          type="submit"
          class="px-5 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Finish Config
        </button>
      </div>
    </form>`
        }

        this.htmlParent.innerHTML = `<div class="${this.teamConstructor}" id="radio">
      <div class="bg-driver">
        <div class="flex flex-col items-end w-full p-4 gap-2">
          <span
            class="uppercase font-f1-bold font-bold text-4xl italic break-words text-right leading-none"
            id="driver-name"
            >${this.driverName}</span
          >
          <div class="flex items-center gap-x-2 w-full justify-end">
            <img
              src="./images/${this.teamConstructor}.svg"
              alt="${this.teamConstructor}"
              id="constructor"
              data-constructor="${this.teamConstructor}"
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

        // display overlay
        this.htmlParent.classList.remove('hidden');

        // play cash register sound
        await this.playNotification();

        // start audio visual
        this.startAudioVisual();

        await this.playTts(options.donation.textToSpeeches)

        // stop audio visual
        this.stopAudioVisual();

        // delay before stop audio visual
        await startDelay(5000)

        // delay before hide overlay
        await startDelay(options.delayToHide)

        // hide overlay
        this.hideOverlay();
    }
}