import axios from "axios";
import { dom, queue, setting, socket, sound, startF1Notif } from "..";
import { SaweriaAlertGif, SaweriaDonation, SaweriaMessage } from "../types";
import startDelay from "./delay";
import { exampleDonation } from "./exampleDonation";

export default class SaweriaQueue {
  private isPlaying: boolean = false;
  private queue: SaweriaDonation[] = [];
  private customSaweriaNotifUrl: string | undefined = undefined;

  constructor() {
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

  private async playIncomingRadio() {
    if (setting.incomingRadio === true) {
      await sound.playIncomingRadio();
    }
  }

  private async ttsHandler() {
    const { tts } = this.getDonation();

    // cash register notif
    await this.playNotif().catch((e) => console.error(e));
    dom.startAudioVisual();
    await this.playIncomingRadio().catch((e) => console.error(e));
    if (tts[0]) {
      await sound.playTtsMessage(`${tts[0]}`).catch((e) => console.error(e));
    }
    // if (tts[1]) {
    //   await sound.playTtsMessage(`${tts[1]}`).catch(async (e) => {
    //     console.error(e);
    //     await startDelay(1000);
    //   });
    // }
    dom.stopAudioVisual();
    await startDelay(setting.donateDuration);
    this.hideRadio();
    await startDelay(1000); // delay 1 detik
  }

  private async nonTtsHandler() {
    await this.playNotif().catch((e) => console.error(e));
    dom.startAudioVisual();
    await this.playIncomingRadio().catch((e) => console.error(e));
    await startDelay(setting.donateDuration);
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

  addExampleDonate() {
    this.addQueue(exampleDonation);
  }

  // use arrow function for callback
  onOpen = (): void => {
    console.log("Socket open");
    socket.send(
      JSON.stringify({
        protocol: "json",
        version: 1,
      }) + "\u001E"
    );
  };

  // use arrow function for callback
  onMessage = async (e: { data: string }): Promise<void> => {
    const parsedData = JSON.parse(e.data.split("\u001E")[0]) as {
      type: number;
      target: "UserDonated";
      arguments: {
        amount: number;
        message: string;
        preferedName: string;
        mediaShare: string;
      }[];
    };

    if (parsedData.type == 6) {
      socket.send(e.data);
    }

    console.log(parsedData);

    if (
      parsedData.type != 1 ||
      parsedData.arguments[0].mediaShare != "" ||
      parsedData.target != "UserDonated"
    ) {
      return;
    }

    let tts: string | null = null;
    try {
      const resTts = await axios.post(
        "https://bagibagi.co/api/tts",
        {
          voiceName: "male",
          message: `${parsedData.arguments[0].preferedName} bagi bagi ${parsedData.arguments[0].amount} koin. Pesan: ${parsedData.arguments[0].message}`,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(resTts.data);
      tts = url;
    } catch (error) {
      tts = null;
    }

    const donation_json: SaweriaMessage = {
      data: [
        {
          amount: parsedData.arguments[0].amount,
          currency: "IDR",
          donator: parsedData.arguments[0].preferedName,
          is_message_flagged: false,
          is_name_flagged: false,
          is_replay: false,
          is_user: false,
          message: parsedData.arguments[0].message,
          tts: [tts],
        },
      ],
      type: "donation",
    };
    const donations = donation_json.data;
    console.log(donations);

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
