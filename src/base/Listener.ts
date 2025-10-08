import Queue from "./Queue";
import Adapter from "./Adapter";

export default class Listener {
    private queue: Queue;
    private socket: WebSocket;
    private adapter: Adapter;

    private handleMessage = (msg: MessageEvent) => this.adapter.socketMessageHandler(msg, this.queue, this.socket);
    private handleOpen = () => this.adapter.socketOpenHandler(this.socket);
    private handleClose = () => this.adapter.socketCloseHandler(this);

    constructor(queue: Queue, adapter: Adapter) {
        this.queue = queue;
        this.adapter = adapter;
    }

    public listen() {
        this.socket = new WebSocket(this.adapter.webSocketUrl);
        this.socket.addEventListener("open", this.handleOpen, { once: true });
        this.socket.addEventListener("message", this.handleMessage);
        this.socket.addEventListener("close", this.handleClose, { once: true });
    }

    public cleanup() {
        this.socket.removeEventListener("open", this.handleOpen);
        this.socket.removeEventListener("message", this.handleMessage);
        this.socket.removeEventListener("close", this.handleClose);
    }
}
