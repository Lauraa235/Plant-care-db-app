CREATE TABLE biljka (
    id_biljka      SERIAL PRIMARY KEY,
    ime            TEXT NOT NULL,
    lokacija       TEXT,
    datum_nabave   DATE,
    opis          TEXT
);
 
CREATE TABLE tip_dogadjaja (
    id_tipa        SERIAL PRIMARY KEY,
    naziv      TEXT NOT NULL,
    opis          TEXT
);

CREATE TABLE dogadaj (
    id_dogadjaja   SERIAL PRIMARY KEY,
    fk_biljke      INT NOT NULL REFERENCES biljka(id_biljka) ON DELETE CASCADE,
    fk_tipa        INT NOT NULL REFERENCES tip_dogadjaja(id_tipa) ON DELETE RESTRICT,
    vrijeme        TIMESTAMP NOT NULL,
    napomena       TEXT, 
    stvoreno     TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TABLE podsjetnik (
    id_podsjetnika SERIAL PRIMARY KEY,
    fk_biljka      INT NOT NULL REFERENCES biljka(id_biljka) ON DELETE CASCADE,
    fk_tipa        INT REFERENCES tip_dogadjaja(id_tipa) ON DELETE SET NULL,
	naslov         TEXT NOT NULL,
    rok         TIMESTAMP NOT NULL,
    aktivno      BOOLEAN NOT NULL DEFAULT TRUE,
    ponavDani    INTEGER CHECK (ponavDani IS NULL OR ponavDani > 0),
    stvoreno     TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TABLE log_podsjetnika (
    id_log         SERIAL PRIMARY KEY,
    fk_podsjetnik  INT NOT NULL REFERENCES podsjetnik(id_podsjetnika) ON DELETE CASCADE,
    akcija         TEXT NOT NULL,
    vrijeme        TIMESTAMP NOT NULL DEFAULT now(),
    opis          TEXT
);