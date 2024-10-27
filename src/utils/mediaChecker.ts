import {
  SaweriaAlertGif,
  SaweriaMediaShare,
  SaweriaSoundBoard,
} from "../types";

export function isMediaShare(media: any): media is SaweriaMediaShare {
  if (media.type == "tiktok" || media.type == "yt") {
    return true;
  }
  return false;
}

export function isSoundBoard(media: any): media is SaweriaSoundBoard {
  if (media.type == "sb") {
    return true;
  }
  return false;
}

export function isAlert(media: any): media is SaweriaAlertGif {
  if (media.tag == "picture" || media == null) {
    return true;
  }
  return false;
}
