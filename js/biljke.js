import { API, setStatus } from "./app.js";
import { ucitBiljkeSelect } from "./selectovi.js";

export async function loadBiljke() {
    const lista = document.querySelector("#listaBiljaka");
    if (!lista) return;

    const odg = await fetch(`${API}/biljke`);
    const biljke = await odg.json();

    lista.innerHTML = "";

    biljke.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${b.ime}</td>
      <td>${b.lokacija ?? "-"}</td>
      <td>${b.datum_nabave ? new Date(b.datum_nabave).toLocaleDateString() : "-"}</td>
      <td>${b.opis ?? "-"}</td>
      <td class="akcija">
        <button data-id="${b.id_biljka}" class="obrisi">Obrisi</button>
      </td>
    `;
        lista.appendChild(tr);
    });
}

export function initBiljkeUI() {

    const formaBiljka = document.querySelector("#formaDodajBiljku");
    if (formaBiljka) {
        formaBiljka.addEventListener("submit", async (e) => {
            e.preventDefault();

            const ime = document.querySelector("#imeBiljke").value.trim();
            const lokacija = document.querySelector("#lokacijaBiljke")?.value || null;
            const datum_nabave = document.querySelector("#datumNabave")?.value || null;
            const opis = document.querySelector("#opisBiljke")?.value || null;

            const odg = await fetch(`${API}/biljke`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ime, lokacija, datum_nabave, opis })
            });

            if (!odg.ok) {
                setStatus("Greska kod dodavanja biljke.");
                return;
            }

            e.target.reset();
            setStatus("Biljka dodana.");
            await loadBiljke();
            await ucitBiljkeSelect();
        });
    }


    const listaBiljaka = document.querySelector("#listaBiljaka");
    if (listaBiljaka) {
        listaBiljaka.addEventListener("click", async (e) => {
            const btn = e.target.closest("button.obrisi");
            if (!btn) return;

            const id = btn.dataset.id;
            const odg = await fetch(`${API}/biljke/${id}`, { method: "DELETE" });

            if (!odg.ok) {
                setStatus("Greska kod brisanja biljke.");
                return;
            }

            setStatus("Biljka obrisana.");
            await loadBiljke();
            await ucitBiljkeSelect();
        });
    }
}
