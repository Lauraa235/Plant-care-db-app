import { API, setStatus } from "./app.js";

export async function ucitBiljkeSelect() {
    const select = document.querySelector("#odabirBiljke");
    if (!select) return;

    const odg = await fetch(`${API}/biljke`);
    if (!odg.ok) return;

    const biljke = await odg.json();

    select.innerHTML = `<option value="" disabled selected>Odaberi biljku...</option>`;
    biljke.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.id_biljka;
        opt.textContent = b.ime;
        select.appendChild(opt);
    });
}

export async function ucitTipoviSelect() {
    const select = document.querySelector("#tipDogadaja");
    if (!select) return;

    const odg = await fetch(`${API}/tipovi`);
    if (!odg.ok) {
        setStatus("Ne mogu dohvatiti tipove događaja.");
        return;
    }

    const tipovi = await odg.json();

    select.innerHTML = `<option value="" disabled selected>Odaberi tip događaja...</option>`;
    tipovi.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id_tipa;
        opt.textContent = t.naziv;
        select.appendChild(opt);
    });
}
