import { loadBiljke, initBiljkeUI } from "./biljke.js";
import { ucitBiljkeSelect, ucitTipoviSelect } from "./selectovi.js";
import { ucitajPodsjet, stvorPodsjetnik } from "./podsjetnici.js";
import { ucitajLog, inicijLog } from "./log.js";
export const API = "http://localhost:3000/api";

export function setStatus(poruka = "") {
    const el = document.querySelector("#statusPoruka");
    if (el) el.textContent = poruka;
}

document.addEventListener("DOMContentLoaded", () => {
    initBiljkeUI();
    stvorPodsjetnik();
    inicijLog();

    loadBiljke();
    ucitBiljkeSelect();
    ucitTipoviSelect();
    ucitajPodsjet();
    ucitajLog();
});

