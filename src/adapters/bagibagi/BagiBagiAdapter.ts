import Adapter from "../../base/Adapter";
import Donation from "../../base/Donation";
import axios from 'axios'
import Queue from "../../base/Queue";
import {BagiBagiDonation} from "./dto/bagibagi_dto";
import Listener from "../../base/Listener";

export default class BagiBagiAdapter extends Adapter<Promise<void>> {
    toDonation(msg: MessageEvent): Donation[] {
        const parsedData = JSON.parse(msg.data.split("\u001E")[0]) as BagiBagiDonation;

        if (
            parsedData.type != 1 ||
            parsedData.arguments[0].mediaShare != "" ||
            parsedData.target != "UserDonated"
        ) {
            return [];
        }

        return parsedData.arguments
            .map((donation) => {
                return new Donation({
                    message: donation.message,
                    amount: donation.amount,
                    currency: "IDR",
                    donatorName: donation.preferedName,
                    textToSpeeches: []
                });
            });

    }

    async parseWebsocketUrl() {
        try {
            const split = this.sourceOverlayUrl.split("/");
            const streamKey = split[split.length - 1];
            if (streamKey == "") {
                throw new Error("Invalid URL");
            }

            const token = await axios.post(
                `https://ws.bagibagi.co/ws/overlay/negotiate?streamkey=${streamKey}&negotiateVersion=1`
            );
            const data = token.data as { connectionToken: string };

            this.webSocketUrl = `wss://ws.bagibagi.co/ws/overlay?streamkey=${streamKey}&id=${data.connectionToken}`;
        } catch (error: any) {
            throw new Error(error.message ?? "Invalid URL");
        }
    }

    async init(): Promise<void> {
        await this.parseWebsocketUrl();
    }

    socketOpenHandler = (socket: WebSocket) => {
        console.log("Connected to notification server");
        socket.send(
            JSON.stringify({
                protocol: "json",
                version: 1,
            }) + "\u001E"
        );
    }

    socketMessageHandler = async (msg: MessageEvent, queue: Queue, socket: WebSocket) => {
        const parsedData = JSON.parse(msg.data.split("\u001E")[0]) as BagiBagiDonation

        if (parsedData.type == 6) {
            socket.send(msg.data);
        }
        const donations = this.toDonation(msg);

        for (const donation of donations) {
            await queue.addDonationToQueue(donation);
        }
    }

    socketCloseHandler = (listener: Listener, socket: WebSocket) => {
        console.log("Disconnected from notification server");
        listener.cleanup();
        console.log("Reconnecting to notification server...");
        this.init().then(() => listener.listen()).catch((e) => console.error(e));
    };
}