import { API, setStatus } from "./app.js";
import { ucitajLog } from "./log.js";

let podsjetniciCache = [];

function razvrstPodsjet(podsjet, now = new Date()) {
    const due = new Date(podsjet.rok);

    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const endSoon = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8);

    if (!podsjet.aktivno) return "neaktivni";
    if (due < startToday) return "kasni";
    if (due >= startToday && due < endToday) return "danas";
    if (due >= endToday && due < endSoon) return "uskoro";
    return "svi";
}

function brojPodsjet(podsjetnici) {
    const elKasni = document.querySelector("#Kasni");
    const elDanas = document.querySelector("#Danas");
    const elUskoro = document.querySelector("#Uskoro");
    if (!elKasni || !elDanas || !elUskoro) return;

    let kasni = 0, danas = 0, uskoro = 0;

    for (const p of podsjetnici) {
        const st = razvrstPodsjet(p);
        if (st === "kasni") kasni++;
        else if (st === "danas") danas++;
        else if (st === "uskoro") uskoro++;
    }

    elKasni.textContent = kasni;
    elDanas.textContent = danas;
    elUskoro.textContent = uskoro;
}

function prikazPodsjet(podsjetnici) {
    const tbody = document.querySelector("#listaPodsjetnika");
    if (!tbody) return;

    tbody.innerHTML = "";

    podsjetnici.forEach(p => {
        const status = razvrstPodsjet(p);

        const oznkClass =
            status === "kasni" ? "oznk oznk-kasni" :
                status === "danas" ? "oznk oznk-dns" :
                    status === "uskoro" ? "oznk oznk-usk" :
                        "oznk oznk-neaktiv";

        const oznkTekst =
            status === "kasni" ? "Kasni" :
                status === "danas" ? "Danas" :
                    status === "uskoro" ? "Uskoro" :
                        "Neaktivan";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.biljka}</td>
            <td>${p.tip}</td>
            <td>${new Date(p.rok).toLocaleString()}</td>
            <td>${p.ponavdani ?? "-"}</td>
            <td><span class="${oznkClass}">${oznkTekst}</span></td>
            <td class="akcija">
                <button data-akcj="GOTOVO" data-id="${p.id_podsjetnika}">GOTOVO</button>
                <button data-akcj="KASNIJE" data-id="${p.id_podsjetnika}" class="gumb-kas">KASNIJE</button>
                <button data-akcj="PRESKOCI" data-id="${p.id_podsjetnika}" class="gumb-pres">PRESKOCI</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

export async function ucitajPodsjet() {
    const tbody = document.querySelector("#listaPodsjetnika");
    if (!tbody) return;

    const odg = await fetch(`${API}/podsjetnici`);
    if (!odg.ok) return;

    podsjetniciCache = await odg.json();
    prikazPodsjet(podsjetniciCache);
    brojPodsjet(podsjetniciCache);
}

export function stvorPodsjetnik() {
    const formaPodsjetnik = document.querySelector("#formaDodajDogadaj");
    if (formaPodsjetnik) {
        formaPodsjetnik.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fk_biljka_el = document.querySelector("#odabirBiljke");
            const fk_tipa_el = document.querySelector("#tipDogadaja");
            if (!fk_biljka_el || !fk_tipa_el) return;

            const fk_biljka = Number(fk_biljka_el.value);
            const fk_tipa = Number(fk_tipa_el.value);

            const naslov = document.querySelector("#naslovPodsjetnika")?.value.trim() ?? "";
            const rok = document.querySelector("#rokDogadaja")?.value ?? "";
            const ponavljanje = document.querySelector("#ponavljanje")?.value ?? "";
            const ponavdani = ponavljanje ? Number(ponavljanje) : null;

            const odg = await fetch(`${API}/podsjetnici`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fk_biljka, fk_tipa, naslov, rok, ponavdani })
            });

            if (!odg.ok) {
                const poruka = await odg.text();
                console.error(poruka);
                setStatus("Greska kod spremanja podsjetnika.");
                return;
            }

            e.target.reset();
            setStatus("Podsjetnik dodan.");
            await ucitajPodsjet();
        });
    }

    const listaPodsjetnika = document.querySelector("#listaPodsjetnika");
    if (listaPodsjetnika) {
        listaPodsjetnika.addEventListener("click", async (e) => {
            const gumb = e.target.closest("button");
            if (!gumb) return;

            const id = gumb.dataset.id;
            const akcija = gumb.dataset.akcj;
            if (!id || !akcija) return;

            const odg = await fetch(`${API}/podsjetnici/${id}/akcija`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ akcija })
            });

            if (!odg.ok) {
                const poruka = await odg.text();
                console.error(poruka);
                setStatus("Greska kod spremanja akcije.");
                return;
            }

            setStatus(`Akcija "${akcija}" spremljena.`);
            await ucitajPodsjet();
            await ucitajLog();
        });
    }
    document.querySelector("#btnOsvjeziPodsjetnike")?.addEventListener("click", ucitajPodsjet);
}
