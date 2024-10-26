import { SaweriaDonation } from "../types";
import messageProcessor from "./messageProcessor";
import numberFormat from "./numberFormat";

export const showRadio = (donation: SaweriaDonation) => {
  const radioEl = document.getElementById("radio");
  if (radioEl) {
    if (radioEl.classList.contains("hidden")) {
      const msg = radioEl.querySelector("#message");
      const dnt = radioEl.querySelector("#donation");
      if (msg) {
        msg.innerHTML = messageProcessor(donation.message) ?? "-";
      }
      if (dnt) {
        dnt.innerHTML =
          messageProcessor(
            `${donation.donator} ${
              donation.currency == "IDR" ? "Rp " : donation.currency
            } ${numberFormat(donation.amount)}`
          ) ?? "-";
      }
      radioEl.classList.remove("hidden");
    } else {
      const msg = radioEl.querySelector("#message");
      const dnt = radioEl.querySelector("#donation");
      if (msg) {
        msg.innerHTML = messageProcessor(donation.message) ?? "-";
      }
      if (dnt) {
        dnt.innerHTML =
          messageProcessor(
            `${donation.donator} ${
              donation.currency == "IDR" ? "Rp " : donation.currency
            } ${numberFormat(donation.amount)}`
          ) ?? "-";
      }
    }
  }
};

export const hideRadio = () => {
  const radioEl = document.getElementById("radio");
  if (radioEl && !radioEl.classList.contains("hidden")) {
    radioEl.classList.add("hidden");
  }
};
