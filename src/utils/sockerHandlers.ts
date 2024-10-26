import { isPlaying, queues, socket, startF1Notif, startQueue } from "..";
import { SaweriaMessage } from "../types";

export const socketOpenHandler = () => {
  console.log("Socket opened");
};

export const socketMessageHandler = (e: { data: any }) => {
  const donation_json: SaweriaMessage = JSON.parse(e.data);
  const donations = donation_json.data;

  donations.forEach((donation) => {
    queues.push(donation);

    if (!isPlaying) {
      startQueue();
    }
  });
};

export const socketCloseHandler = () => {
  console.log("Socket closed");

  socket.removeEventListener("open", socketOpenHandler, true);
  socket.removeEventListener("message", socketMessageHandler, true);
  socket.removeEventListener("close", socketCloseHandler, true);

  startF1Notif();
};
