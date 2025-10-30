
// js/files.js

import { showToast } from './ui.js';
import { createLessonFromText, createActivitiesFromText } from './ai.js';

export let selectedFile = null;
export let extractedText = null;

export function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        showToast('Per favore, seleziona un file PDF.', 'error');
        return;
    }

    selectedFile = file;
    extractedText = null; // Reset on new file upload

    const feedbackEl = document.getElementById('pdf-upload-feedback');
    const optionsEl = document.getElementById('pdf-import-options');
    const outputEl = document.getElementById('pdf-processing-output');

    if (feedbackEl) feedbackEl.innerHTML = `<p>File selezionato: <strong>${file.name}</strong></p><p>Estrazione del testo in corso...</p>`;
    if (optionsEl) optionsEl.style.display = 'none';
    if (outputEl) outputEl.innerHTML = '';
    showToast('Estrazione del testo dal PDF...', 'info');

    const reader = new FileReader();
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);
        
        const loadingTask = pdfjsLib.getDocument(typedarray);
        loadingTask.promise.then(function(pdf) {
            let fullText = '';
            const numPages = pdf.numPages;
            let pagesProcessed = 0;

            for (let i = 1; i <= numPages; i++) {
                pdf.getPage(i).then(function(page) {
                    page.getTextContent().then(function(textContent) {
                        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
                        pagesProcessed++;
                        if (pagesProcessed === numPages) {
                            extractedText = fullText;
                            if (feedbackEl) feedbackEl.innerHTML = `<p>File <strong>${file.name}</strong> elaborato con successo.</p>`;
                            if (outputEl) {
                                outputEl.innerHTML = `
                                    <h4>Analisi Preliminare Completata</h4>
                                    <p>Testo estratto! Pronto per essere trasformato in una lezione o per cercare attività.</p>
                                    <p><i>Primi 200 caratteri: "${extractedText.substring(0, 200)}..."</i></p>
                                `;
                            }
                            if (optionsEl) optionsEl.style.display = 'block';
                            showToast('Testo estratto! Ora puoi procedere.', 'success');
                        }
                    });
                });
            }
        }).catch(err => {
            console.error('Error parsing PDF:', err);
            showToast('Errore durante l\'analisi del PDF.', 'error');
            if (feedbackEl) feedbackEl.innerHTML = `<p>Errore durante l'analisi del file.</p>`;
        });
    };
    reader.readAsArrayBuffer(file);
}

export function processPdfForLessons() {
    if (!extractedText) {
        showToast('Nessun testo estratto. Carica prima un file PDF valido.', 'error');
        return;
    }
    createLessonFromText(extractedText);
    if (typeof window.app.switchTab === 'function') {
        window.app.switchTab('lessons');
    }
}

export function processPdfForActivities() {
    if (!extractedText) {
        showToast('Nessun testo estratto. Carica prima un file PDF valido.', 'error');
        return;
    }
    const count = createActivitiesFromText(extractedText);
    if (count > 0 && typeof window.app.switchTab === 'function') {
        window.app.switchTab('activities');
    }
}
