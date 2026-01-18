CREATE OR REPLACE FUNCTION fn_dodaj_biljku(
  p_ime TEXT,
  p_lokacija TEXT DEFAULT NULL,
  p_datum_nabave DATE DEFAULT NULL,
  p_opis TEXT DEFAULT NULL
)
RETURNS INT
AS $$
DECLARE
  v_id INT;
BEGIN
  IF p_ime IS NULL OR length(trim(p_ime)) = 0 THEN
    RAISE EXCEPTION 'Ime biljke je obavezno.';
  END IF;

  INSERT INTO biljka(ime, lokacija, datum_nabave, opis)
  VALUES (trim(p_ime), p_lokacija, p_datum_nabave, p_opis)
  RETURNING id_biljka INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_dodaj_dogadaj(
  p_fk_biljke INT,
  p_fk_tipa INT,
  p_vrijeme TIMESTAMPTZ DEFAULT NULL,
  p_napomena TEXT DEFAULT NULL
) 
RETURNS INT
AS $$
DECLARE
  v_id INT;
BEGIN
  IF p_fk_biljke IS NULL THEN
    RAISE EXCEPTION 'fk_biljke je obavezan.';
  END IF;

  IF p_fk_tipa IS NULL THEN
    RAISE EXCEPTION 'fk_tipa je obavezan.';
  END IF;

  INSERT INTO dogadaj(fk_biljke, fk_tipa, vrijeme, napomena)
  VALUES (p_fk_biljke, p_fk_tipa, COALESCE(p_vrijeme, now()), p_napomena)
  RETURNING id_dogadjaja INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION trg_obradi_log_podsjetnika()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_rok TIMESTAMP;
  v_rep INT;
BEGIN
  SELECT rok, ponavdani
    INTO v_rok, v_rep
  FROM podsjetnik
  WHERE id_podsjetnika = NEW.fk_podsjetnik
  FOR UPDATE;

  IF NEW.akcija = 'KASNIJE' THEN
    UPDATE podsjetnik
       SET rok = v_rok + INTERVAL '1 day',
           aktivno = TRUE
     WHERE id_podsjetnika = NEW.fk_podsjetnik;

  ELSIF NEW.akcija IN ('GOTOVO','PRESKOCI') THEN
    IF COALESCE(v_rep, 0) > 0 THEN
      UPDATE podsjetnik
         SET rok = v_rok + make_interval(days => v_rep),
             aktivno = TRUE
       WHERE id_podsjetnika = NEW.fk_podsjetnik;
    ELSE
      UPDATE podsjetnik
         SET aktivno = FALSE
       WHERE id_podsjetnika = NEW.fk_podsjetnik;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION fn_obrisi_biljku(p_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM log_podsjetnika
  WHERE fk_podsjetnik IN (
    SELECT id_podsjetnika FROM podsjetnik WHERE fk_biljka = p_id
  );

  DELETE FROM podsjetnik WHERE fk_biljka = p_id;

  DELETE FROM biljka WHERE id_biljka = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Biljka % ne postoji', p_id;
  END IF;
END;
$$;






