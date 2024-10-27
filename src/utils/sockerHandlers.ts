import { isPlaying, queues, socket, startF1Notif, startQueue } from "..";
import { SaweriaAlertGif, SaweriaMessage } from "../types";

export const socketOpenHandler = () => {
  console.log("Socket opened");
};

export const socketMessageHandler = (e: { data: any }) => {
  const donation_json: SaweriaMessage = JSON.parse(e.data);
  const donations = donation_json.data;

  donations.forEach((donation) => {
    const media = donation.media as SaweriaAlertGif | null;

    // only accept alert donation, not media share or sound board
    if (media == null || media.tag == "picture") {
      queues.push(donation);

      if (!isPlaying) {
        startQueue();
      }
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
