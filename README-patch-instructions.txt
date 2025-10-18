Modifiche richieste e note:

- È stata soppressa l'apertura automatica del lesson-picker. Questo significa che aprendo la pagina "in classe" dalla home non verrà automaticamente selezionata alcuna lezione. La selezione deve essere fatta nella pagina in-classe tramite la tabella.

- Per ripristinare temporaneamente il comportamento legacy chiamare le funzioni originali (se presenti):
  window.__orig_showLessonPicker() or window.__orig_showLessonPickerInline()

- File modificati / aggiunti:
  - js/schedule-enhance.js (nuovo o aggiornato)
  - css/schedule.css (nuovo)
  - in-classe.html (inserita tabella statica + link CSS + script include)

Testing steps:
1. Pulire localStorage: rimuovere lastOpenedLesson e lastOpenedClassId.
2. Aprire index.html e cliccare "Entra in Classe" -> la pagina in-classe deve aprirsi senza modal che si apre automaticamente.
3. Usare la griglia per scegliere orario/lezione e premere "Entra".
4. Verificare che la selezione usi enterLessonFromSchedule quando disponibile.
