import { API } from "./app.js";

let logZapisi = [];

function prikazLog(pod) {
    const tbody = document.querySelector("#listaLoga");
    if (!tbody) return;

    tbody.innerHTML = "";
    pod.forEach(l => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(l.vrijeme).toLocaleString()}</td>
            <td>${l.biljka}</td>
            <td>${l.tip}</td>
            <td>${l.akcija}</td>
            <td>${l.opis ?? "-"}</td>
        `;
        tbody.appendChild(tr);
    });
}

function traziLog() {
    const q = (document.querySelector("#filterLog")?.value || "").trim().toLowerCase();
    let podaci = [...logZapisi];

    if (q) {
        podaci = podaci.filter(l => {
            const a = (l.akcija || "").toLowerCase();
            const o = (l.opis || "").toLowerCase();
            const b = (l.biljka || "").toLowerCase();
            const t = (l.tip || "").toLowerCase();
            return a.includes(q) || o.includes(q) || b.includes(q) || t.includes(q);
        });
    }
    prikazLog(podaci);
}

export async function ucitajLog() {
    const tbody = document.querySelector("#listaLoga");
    if (!tbody) return;

    const odg = await fetch(`${API}/log`);
    if (!odg.ok) return;

    logZapisi = await odg.json();
    traziLog();
}

export function inicijLog() {
    document.querySelector("#filterLog")?.addEventListener("input", traziLog);
    document.querySelector("#gumbOsvjeziLog")?.addEventListener("click", ucitajLog);
}
