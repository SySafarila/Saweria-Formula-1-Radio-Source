import { dom, socket, sound, startF1Notif } from "..";
import { SaweriaAlertGif, SaweriaDonation, SaweriaMessage } from "../types";
import startDelay from "./delay";
import SettingClass from "./SettingClass";

export default class SaweriaQueue {
  private setting: SettingClass;
  private isPlaying: boolean = false;
  private queue: SaweriaDonation[] = [];
  private customSaweriaNotifUrl: string | undefined = undefined;

  constructor(setting: SettingClass) {
    this.setting = setting;
    console.log("Saweria Queue Init");
  }

  private messageProcessor(message: string): string {
    let msg = ``;
    if (message[0] == `"`) {
      msg += message;
    } else {
      msg += `"${message}`;
    }

    if (message[message.length - 1] != `"`) {
      msg += `"`;
    }

    return msg;
  }

  private numberFormat(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  private getDonation(): SaweriaDonation {
    return this.queue[0];
  }

  addQueue(donation: SaweriaDonation): void {
    this.queue.push(donation);
    if (this.isPlaying === false) {
      this.startQueue();
    }
  }

  private setCustomSaweriaNotif(): void {
    const customSaweriaNotifObject = this.getDonation().sound;
    if (
      customSaweriaNotifObject &&
      typeof customSaweriaNotifObject === "object"
    ) {
      const soundKeys = Object.keys(customSaweriaNotifObject);
      soundKeys.forEach((key) => {
        const soundUrl: string = customSaweriaNotifObject[key];
        this.customSaweriaNotifUrl = soundUrl;
      });
    }
  }

  private displayRadio() {
    const donation = this.getDonation();
    const radioEl = document.getElementById("radio");
    if (radioEl) {
      if (radioEl.classList.contains("hidden")) {
        const msg = radioEl.querySelector("#message");
        const dnt = radioEl.querySelector("#donation");
        if (msg) {
          msg.innerHTML = this.messageProcessor(donation.message) ?? "-";
        }
        if (dnt) {
          dnt.innerHTML =
            this.messageProcessor(
              `${donation.donator} ${
                donation.currency == "IDR" ? "Rp " : donation.currency
              } ${this.numberFormat(donation.amount)}`
            ) ?? "-";
        }
        radioEl.classList.remove("hidden");
      } else {
        const msg = radioEl.querySelector("#message");
        const dnt = radioEl.querySelector("#donation");
        if (msg) {
          msg.innerHTML = this.messageProcessor(donation.message) ?? "-";
        }
        if (dnt) {
          dnt.innerHTML =
            this.messageProcessor(
              `${donation.donator} ${
                donation.currency == "IDR" ? "Rp " : donation.currency
              } ${this.numberFormat(donation.amount)}`
            ) ?? "-";
        }
      }
    }
  }

  private hideRadio() {
    const radioEl = document.getElementById("radio");
    if (radioEl && !radioEl.classList.contains("hidden")) {
      radioEl.classList.add("hidden");
    }
  }

  private async playNotif() {
    if (this.customSaweriaNotifUrl) {
      await sound.playCustomSaweriaNotif(this.customSaweriaNotifUrl);
    } else {
      await sound.playCashRegister();
    }
  }

  private async playOpeningRadio() {
    if (this.setting.openingRadioSound == "on") {
      await sound.playOpeningRadio();
    }
  }

  private async ttsHandler() {
    const { tts } = this.getDonation();

    await this.playNotif();
    if (tts[0]) {
      await sound.playTtsFrom(`data:audio/wav;base64,${tts[0]}`);
    }
    dom.startAudioVisual();
    await this.playOpeningRadio();
    if (tts[1]) {
      await sound.playTtsMessage(`data:audio/wav;base64,${tts[1]}`);
    }
    dom.stopAudioVisual();
    await startDelay(this.setting.showMessageTime);
    this.hideRadio();
    await startDelay(1000); // delay 1 detik
  }

  private async nonTtsHandler() {
    await this.playNotif();
    dom.startAudioVisual();
    await this.playOpeningRadio();
    await startDelay(this.setting.showMessageTime);
    dom.stopAudioVisual();
    await startDelay(1000); // delay 1 detik
    this.hideRadio();
    await startDelay(1000); // delay 1 detik
  }

  private async startQueue() {
    console.log(`Showing donation from ${this.getDonation().donator}`);
    const { tts } = this.getDonation();

    this.isPlaying = true;
    this.setCustomSaweriaNotif();
    this.displayRadio();

    if (tts) {
      await this.ttsHandler();
    } else {
      await this.nonTtsHandler();
    }

    this.deletePlayedQueue();

    if (this.queue.length >= 1) {
      this.startQueue();
    }
  }

  private deletePlayedQueue(): void {
    if (this.queue.length >= 1) {
      this.isPlaying = false;
      this.queue.splice(0, 1);
    }
  }

  // use arrow function for callback
  onOpen = (): void => {
    console.log("Socket open");
    socket.send("PING!");
  };

  // use arrow function for callback
  onMessage = (e: { data: any }): void => {
    const donation_json: SaweriaMessage = JSON.parse(e.data);
    const donations = donation_json.data;

    donations.forEach((donation) => {
      const media = donation.media as SaweriaAlertGif | null;

      // only accept alert donation, not media share or sound board
      if (media == null || media.tag == "picture") {
        this.addQueue(donation);
      }
    });
  };

  // use arrow function for callback
  onClose = (): void => {
    console.log("Socket close");

    socket.removeEventListener("message", this.onMessage, true);

    startF1Notif();
  };
}
