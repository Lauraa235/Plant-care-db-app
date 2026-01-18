CREATE TRIGGER dogadaj_vrijeme_validacija
BEFORE INSERT OR UPDATE ON dogadaj
FOR EACH ROW
EXECUTE PROCEDURE trg_dogadaj_vrijeme_validacija();


CREATE TRIGGER tr_log_podsjetnika_ai
AFTER INSERT ON log_podsjetnika
FOR EACH ROW
EXECUTE FUNCTION trg_obradi_log_podsjetnika();

