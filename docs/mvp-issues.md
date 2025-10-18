# MVP: "In classe" — Epic & Issues

Epic: In-Class MVP
- Obiettivo: implementare la pagina "In classe" con vista giornaliera/settimanale, slot cliccabili, overlay di classe, avvio sessione e valutazioni rapide per studenti.

## Issue 1 — UI: Orario — Vista Giornaliera
- Descrizione: Implementare la vista giornaliera dell'orario con slot/celle cliccabili.
- Acceptance criteria:
  - Toggle per selezionare Giornaliera/Settimanale presente.
  - Ogni slot mostra orario, materia, classe e tipo attività.
  - Click su uno slot apre l'overlay (placeholder) della classe.
- Priorità: High
- Stima: 1 giorno

## Issue 2 — UI: Orario — Vista Settimanale
- Descrizione: Implementare la vista settimanale (overview) con interazione per selezionare un giorno/slot.
- Acceptance criteria:
  - Vista settimanale mostra giorni + slot sintetici.
  - Selezionando un giorno si passa alla vista giornaliera di quel giorno.
- Priorità: Medium
- Stima: 1 giorno

## Issue 3 — UI: Classroom Overlay (modal)
- Descrizione: Quando si clicca uno slot, mostrare un overlay con dettagli: materia, classe, tipo attività (select modificabile), pulsanti Entra/Chiudi.
- Acceptance criteria:
  - Header con materia, classe, ora e tipo attività (editable).
  - Pulsante "Entra" avvia sessione locale (stato ongoing).
  - Pulsante "Studenti" e "Attività" visibili dopo l'ingresso.
- Priorità: High
- Stima: 1 giorno

## Issue 4 — Session Lifecycle (client-side)
- Descrizione: Gestire stato sessione: pending -> starting -> ongoing -> paused -> finished. Salvare start/stop localmente (o chiamare API se esistono).
- Acceptance criteria:
  - Avvio sessione memorizza startedAt e sessionId temporaneo.
  - Fine sessione memorizza endedAt.
  - Stato visibile nell'overlay.
- Priorità: High
- Stima: 1 giorno

## Issue 5 — UI: Studenti tab + QuickGrade popup
- Descrizione: In overlay, tab "Studenti" con elenco compatto; click sul nominativo apre popup veloce per inserire tipo/voto/note.
- Acceptance criteria:
  - Elenco studenti caricabile (mock o API).
  - Quick popup per selezionare tipo valutazione (voto_orale, voto_disegno, comportamento) + campo note + salva.
  - Salvataggio lega grade a sessionId e studentId (persistenza locale o via API).
- Priorità: High
- Stima: 1–2 giorni

## Issue 6 — UI: Scheda Studente dettagliata
- Descrizione: Visualizzare scheda completa studente con storico voti e competenze, accessibile cliccando sul cognome (o apposita azione).
- Acceptance criteria:
  - Scheda mostra storico valutazioni per studente.
  - Possibilità di aggiungere valutazioni più dettagliate.
- Priorità: Medium
- Stima: 2 giorni

## Issue 7 — Persistence: API / DB schema (MVP)
- Descrizione: Definire spec API e DB tables minime: sessions, grades, students, schedule.
- Acceptance criteria:
  - Documentazione endpoints per: creare sessione, aggiornare sessione, creare grade, leggere studenti.
  - SQL migration o schema in file .sql (bozza).
- Priorità: High
- Stima: 1 giorno

## Issue 8 — Realtime (optional MVP+)
- Descrizione: Aggiungere canale WebSocket per sincronizzare sessioni/valutazioni in tempo reale.
- Acceptance criteria:
  - Server invia eventi session_started, grade_added.
  - Client si sincronizza su sessionId/topic.
- Priorità: Low (post-MVP)
- Stima: 2–3 giorni

## Issue 9 — IA: Suggerimenti (placeholder)
- Descrizione: Endpoint che fornisce suggerimenti IA per attività e studenti a rischio.
- Acceptance criteria:
  - Endpoint mock che restituisce suggerimenti sample.
  - UI pannello "Suggerimenti" che mostra i risultati.
- Priorità: Low
- Stima: 2 giorni

## Issue 10 — Analytics (giornata)
- Descrizione: Pannello riepilogo giornata: numero lezioni, percentuale partecipazione, eventi importanti.
- Acceptance criteria:
  - Visualizzazione sintetica e link su dettagli.
- Priorità: Low
- Stima: 1 giorno

---

# Note operative
- Stack consigliato iniziale: mantenere ES modules/vanilla JS per integrazione rapida con le pagine esistenti; poi valutare migrazione a React+TS per scalabilità.
- Se vuoi che io generi i file di scaffold (componenti JS o migrations SQL), dimmi quale issue iniziare (consiglio: Issue 1 + 3 + 4 + 5 per l’MVP).