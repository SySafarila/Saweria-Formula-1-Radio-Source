import Queue from "./Queue";
import Adapter from "./Adapter";

export default class Listener {
    private queue: Queue;
    private socket: WebSocket;
    private adapter: Adapter;

    constructor(queue: Queue, adapter: Adapter) {
        this.queue = queue;
        this.adapter = adapter;
    }

    public listen() {
        this.socket = new WebSocket(this.adapter.webSocketUrl);
        this.socket.addEventListener("open", this.socketOpenHandler, {
            once: true,
        });
        this.socket.addEventListener("message", this.socketMessageHandler);
        this.socket.addEventListener("close", this.socketCloseHandler, {
            once: true,
        });
    }

    private socketOpenHandler = () => {
        console.log("Connected to notification server");
        this.socket.send("PING!");
    }

    private socketCloseHandler = () => {
        console.log("Disconnected from notification server");
        this.socket.removeEventListener("message", this.socketMessageHandler, true);
        console.log("Reconnecting to notification server");
        this.listen()
    }

    private socketMessageHandler = async (msg: MessageEvent) => {
        const donations = this.adapter.toDonation(msg);

        for (const donation of donations) {
            await this.queue.addDonationToQueue(donation);
        }
    }
}