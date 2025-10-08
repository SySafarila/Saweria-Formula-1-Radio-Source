import {SaweriaMessage} from "../adapters/saweria/dto/saweria_dto";
import Donation from "./Donation";
import queryString from "query-string";
import Queue from "./Queue";
import Listener from "./Listener";

export interface IAdapter<T> {
    sourceOverlayUrl: string;
    webSocketUrl: string;

    toDonation(msg: MessageEvent): Donation[];

    parseWebsocketUrl(): void

    init(): T
}

export default class Adapter<T = void> implements IAdapter<T> {
    sourceOverlayUrl: string;
    webSocketUrl: string;

    constructor(sourceOverlayUrl: string) {
        this.sourceOverlayUrl = sourceOverlayUrl;
    }

    init(): T {
        this.parseWebsocketUrl();
        return;
    }

    toDonation(msg: MessageEvent): Donation[] {
        const donation_json: SaweriaMessage = JSON.parse(msg.data);
        const donations = donation_json.data;

        return donations
            .filter((donation) => {
                const media = donation.media as any;
                // cuma ambil yang alert donation, bukan media share / soundboard
                return media == null || media.tag === "picture";
            })
            .map((donation) => {
                return new Donation({
                    message: donation.message,
                    amount: donation.amount,
                    currency: "IDR",
                    donatorName: donation.donator,
                    textToSpeeches: donation.tts
                });
            });
    }

    parseWebsocketUrl(): void {
        try {
            const url = new URL(this.sourceOverlayUrl);
            const parsed = queryString.parse(url.search) as {
                streamKey?: string;
            };

            if (!parsed.streamKey) throw new Error("Stream Key not provided!");

            this.webSocketUrl = `wss://events.saweria.co/stream?streamKey=${parsed.streamKey}`;
        } catch (error: any) {
            throw new Error(error.message ?? "Invalid source overlay URL");
        }
    }

    socketOpenHandler = (socket: WebSocket) => {
        console.log("Connected to notification server");
        socket.send("PING!");
    }

    socketCloseHandler = (listener: Listener) => {
        console.log("Disconnected from notification server");
        listener.cleanup();
        console.log("Reconnecting to notification server...");
        listener.listen();
    }

    socketMessageHandler = async (msg: MessageEvent, queue: Queue) => {
        const donations = this.toDonation(msg);

        for (const donation of donations) {
            await queue.addDonationToQueue(donation);
        }
    }

}
