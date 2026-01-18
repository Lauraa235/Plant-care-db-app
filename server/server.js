import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";

const server = express();
server.use(cors());
server.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.static(path.join(__dirname, "../")));
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

server.get("/api/biljke", async (zaht, odg) => {
    try {
        const { rows } = await pool.query(
            "SELECT id_biljka, ime, lokacija, datum_nabave, opis FROM biljka ORDER BY id_biljka DESC"
        );
        odg.json(rows);
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod dohvacanja biljaka.");
    }
});

server.post("/api/biljke", async (zaht, odg) => {
    try {
        const { ime, lokacija, datum_nabave, opis } = zaht.body;

        const { rows } = await pool.query(
            `INSERT INTO biljka (ime, lokacija, datum_nabave, opis)
       VALUES ($1,$2,$3,$4)
       RETURNING id_biljka, ime, lokacija, datum_nabave, opis`,
            [ime, lokacija ?? null, datum_nabave ?? null, opis ?? null]
        );
        odg.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod dodavanja biljke.");
    }
});

server.delete("/api/biljke/:id", async (zaht, odg) => {
    try {
        const id = Number(zaht.params.id);
        await pool.query("SELECT fn_obrisi_biljku($1)", [id]);
        odg.status(204).send();
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod brisanja biljke.");
    }
});

server.get("/api/tipovi", async (zaht, odg) => {
    try {
        const { rows } = await pool.query(
            "SELECT id_tipa, naziv, opis FROM tip_dogadjaja ORDER BY naziv ASC"
        );
        odg.json(rows);
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod dohvacanja tipova.");
    }
});

server.get("/api/podsjetnici", async (zaht, odg) => {
    try {
        const { rows } = await pool.query(`
      SELECT p.id_podsjetnika,
             p.fk_biljka,
             b.ime AS biljka,
             p.fk_tipa,
             t.naziv AS tip,
             p.naslov,
             p.rok,
             p.ponavdani,
             p.aktivno,
             p.stvoreno
      FROM podsjetnik p
      JOIN biljka b ON b.id_biljka = p.fk_biljka
      LEFT JOIN tip_dogadjaja t ON t.id_tipa = p.fk_tipa
      WHERE p.aktivno = TRUE
      ORDER BY p.rok ASC
    `);

        odg.json(rows);
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod dohvacanja podsjetnika.");
    }
});

server.post("/api/podsjetnici", async (zaht, odg) => {
    try {
        const { fk_biljka, fk_tipa, naslov, rok, ponavdani } = zaht.body;

        const { rows } = await pool.query(
            `INSERT INTO podsjetnik (fk_biljka, fk_tipa, naslov, rok, ponavdani)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING *`,
            [
                Number(fk_biljka),
                fk_tipa ? Number(fk_tipa) : null,
                naslov,
                rok,
                ponavdani ? Number(ponavdani) : null
            ]
        );

        odg.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod dodavanja podsjetnika.");
    }
});

server.post("/api/podsjetnici/:id/akcija", async (zaht, odg) => {
    try {
        const id = Number(zaht.params.id);
        const { akcija } = zaht.body;

        await pool.query(
            "INSERT INTO log_podsjetnika (fk_podsjetnik, akcija, opis) VALUES ($1,$2,$3)",
            [id, akcija, ""]
        );

        odg.status(204).send();
    } catch (err) {
        console.error("Greska:", err);
        odg.status(500).send(err.message);
    }
});


server.get("/api/log", async (zaht, odg) => {
    try {
        const { rows } = await pool.query(`
      SELECT l.id_log,
             l.vrijeme,
             b.ime AS biljka,
             t.naziv AS tip,
             l.akcija,
             l.opis
      FROM log_podsjetnika l
      JOIN podsjetnik p ON p.id_podsjetnika = l.fk_podsjetnik
      JOIN biljka b ON b.id_biljka = p.fk_biljka
      LEFT JOIN tip_dogadjaja t ON t.id_tipa = p.fk_tipa
      ORDER BY l.vrijeme DESC
    `);
        odg.json(rows);
    } catch (err) {
        console.error(err);
        odg.status(500).send("Greska kod dohvacanja loga.");
    }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("API radi na portu", PORT));
