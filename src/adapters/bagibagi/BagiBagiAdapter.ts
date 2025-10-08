import Adapter from "../../base/Adapter";
import Donation from "../../base/Donation";
import axios from 'axios'
import Queue from "../../base/Queue";

export default class BagiBagiAdapter extends Adapter<Promise<void>> {
    toDonation(msg: MessageEvent): Donation[] {
        const parsedData = JSON.parse(msg.data.split("\u001E")[0]) as {
            type: number;
            target: "UserDonated";
            arguments: {
                amount: number;
                message: string;
                preferedName: string;
                mediaShare: string;
            }[];
        };

        // if (parsedData.type == 6) {
        //     socket.send(e.data);
        // }

        if (
            parsedData.type != 1 ||
            parsedData.arguments[0].mediaShare != "" ||
            parsedData.target != "UserDonated"
        ) {
            return [];
        }

        // TODO: parsing TTS

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

    socketMessageHandler = async (msg: MessageEvent, queue: Queue) => {
        const donations = this.toDonation(msg);

        for (const donation of donations) {
            await queue.addDonationToQueue(donation);
        }
    }
}