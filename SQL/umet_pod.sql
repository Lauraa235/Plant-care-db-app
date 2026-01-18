INSERT INTO biljka (ime, lokacija, datum_nabave, opis) VALUES
('Monstera', 'Dnevni boravak - pored prozora', '2025-09-12', 'Srednje velika, voli indirektno svjetlo.'),
('Bosiljak', 'Kuhinja - prozor', '2026-01-05', 'Za kuhanje, treba češće zalijevanje.'),
('Aloe vera', 'Balkon', '2024-06-20', 'Ne zalijevati često, voli sunce.');



INSERT INTO tip_dogadjaja (naziv, opis) VALUES
('Zalijevanje', 'Zalijevanje biljke vodom (po potrebi ml/količina u napomeni)'),
('Gnojidba', 'Dodavanje gnojiva (vrsta i doza u napomeni)'),
('Presađivanje', 'Presađivanje u novu zemlju/teglu'),
('Prskanje', 'Prskanje listova / povećanje vlage');




INSERT INTO dogadaj (fk_biljke, fk_tipa, vrijeme, napomena)
VALUES
(
  (SELECT id_biljka FROM biljka WHERE ime='Monstera'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Zalijevanje'),
  '2026-01-10 18:30',
  'Zaliveno ~300 ml. Zemlja suha 2 cm na vrhu.'
);


INSERT INTO dogadaj (fk_biljke, fk_tipa, vrijeme, napomena)
VALUES
(
  (SELECT id_biljka FROM biljka WHERE ime='Bosiljak'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Zalijevanje'),
  '2026-01-15 09:00',
  'Zaliveno ~150 ml. Zemlja blago suha.'
),
(
  (SELECT id_biljka FROM biljka WHERE ime='Bosiljak'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Prskanje'),
  '2026-01-15 09:05',
  'Lagano poprskano po listovima.'
);


INSERT INTO dogadaj (fk_biljke, fk_tipa, vrijeme, napomena)
VALUES
(
  (SELECT id_biljka FROM biljka WHERE ime='Aloe vera'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Gnojidba'),
  '2026-01-08 14:20',
  'Listovi čvrsti, bez promjena.'
);



INSERT INTO podsjetnik (fk_biljka, fk_tipa, naslov, rok, aktivno, ponavdani)
VALUES
(
  (SELECT id_biljka FROM biljka WHERE ime='Monstera'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Zalijevanje'),
  'Zaliti Monsteru',
  '2026-01-17 18:00',
  TRUE,
  7
),
(
  (SELECT id_biljka FROM biljka WHERE ime='Bosiljak'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Zalijevanje'),
  'Zaliti bosiljak',
  '2026-01-18 09:00',
  TRUE,
  2
),
(
  (SELECT id_biljka FROM biljka WHERE ime='Aloe vera'),
  (SELECT id_tipa FROM tip_dogadjaja WHERE naziv='Zalijevanje'),
  'Provjeriti aloe (po potrebi malo zaliti)',
  '2026-01-25 12:00',
  TRUE,
  21
);



INSERT INTO podsjetnik (fk_biljka, fk_tipa, naslov, rok, aktivno, ponavdani)
VALUES
(
  (SELECT id_biljka FROM biljka WHERE ime='Monstera'),
  NULL,
  'Okrenuti teglu (da raste ravnomjerno)',
  '2026-01-20 10:00',
  TRUE,
  14
);



INSERT INTO log_podsjetnika (fk_podsjetnik, akcija, vrijeme, opis)
VALUES
(
  (SELECT id_podsjetnika
   FROM podsjetnik p
   JOIN biljka b ON b.id_biljka = p.fk_biljka
   WHERE b.ime='Monstera' AND p.naslov='Zaliti Monsteru'),
  'GOTOVO',
  '2026-01-17 18:10',
  'Zaliveno nakon podsjetnika.'
);


INSERT INTO log_podsjetnika (fk_podsjetnik, akcija, vrijeme, opis)
VALUES
(
  (SELECT id_podsjetnika
   FROM podsjetnik p
   JOIN biljka b ON b.id_biljka = p.fk_biljka
   WHERE b.ime='Bosiljak' AND p.naslov='Zaliti bosiljak'),
  'KASNIJE',
  '2026-01-18 09:00',
  'Odgođeno za kasnije danas.'
);





