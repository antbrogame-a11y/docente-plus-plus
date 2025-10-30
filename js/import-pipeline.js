// js/import-pipeline.js

/**
 * @module import-pipeline
 * Gestisce l'importazione e l'analisi intelligente di documenti.
 */

import { showToast } from './ui.js';
import { createLesson, createActivity } from './crud.js';

/**
 * Gestisce il caricamento di un file, lo analizza e propone l'importazione.
 * @param {Event} event - L'evento 'change' dell'input file.
 */
export async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        showToast('Nessun file selezionato.', 'error');
        return;
    }

    showToast(`Caricamento di ${file.name}...`, 'info');
    const feedbackContainer = document.getElementById('import-feedback');
    if (feedbackContainer) feedbackContainer.innerHTML = '<div class="spinner"></div>';

    try {
        const textContent = await readFileAsText(file);
        const fileType = classifyDocument(file.name, textContent);
        showToast(`File classificato come: ${fileType}. Analisi del contenuto in corso...`, 'info');

        const analysisResult = analyzeDocumentContent(textContent, fileType);

        if (analysisResult.lessons.length === 0 && analysisResult.activities.length === 0) {
            showToast('Analisi completata. Nessun elemento importabile trovato nel documento.', 'warning');
            if (feedbackContainer) feedbackContainer.innerHTML = '';
            return;
        }

        renderImportPreview(analysisResult, feedbackContainer);

    } catch (error) {
        console.error(`Errore durante l'importazione del file: ${error}`);
        showToast(`Errore: ${error.message}`, 'error');
        if (feedbackContainer) feedbackContainer.innerHTML = `<p class="error">Analisi fallita. Controlla la console per i dettagli.</p>`;
    } finally {
        event.target.value = '';
    }
}

/**
 * // TODO(AI): Questa è ancora una simulazione basata su regole. 
 * In futuro, questa funzione utilizzerà un modello LLM per un'analisi semantica.
 * 
 * Analizza il contenuto testuale di un documento per estrarre lezioni e attività.
 * @param {string} textContent - Il contenuto del documento.
 * @param {string} fileType - Il tipo di file classificato.
 * @returns {{lessons: Array, activities: Array}}
 */
export function analyzeDocumentContent(textContent, fileType) { // <-- ESPORTATA
    const lessons = [];
    const activities = [];
    if (!textContent) return { lessons, activities };

    const lines = textContent.split(/\r?\n/);
    let currentUnit = 'Generica';

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.match(/^Unità \d+:/i)) {
            currentUnit = trimmedLine.replace(/:/g, '');
        }

        const lessonMatch = trimmedLine.match(/- Lezione: (.*)/i);
        if (lessonMatch) {
            lessons.push({ 
                title: lessonMatch[1].trim(), 
                description: `Lezione dall'${currentUnit}`,
                date: new Date().toISOString().split('T')[0],
                subject: 'Materia da Definire' // FIX: Aggiunto campo obbligatorio
            });
        }

        const activityMatch = trimmedLine.match(/- (Esercitazione|Laboratorio|Progetto|Verifica): (.*)/i);
        if (activityMatch) {
            activities.push({ 
                title: activityMatch[2].trim(),
                type: activityMatch[1].trim(),
                description: `Attività dall'${currentUnit}`,
                date: new Date().toISOString().split('T')[0]
            });
        }
    });

    return { lessons, activities };
}

/**
 * Mostra un'anteprima degli elementi estratti e un pulsante per confermare l'importazione.
 * @param {{lessons: Array, activities: Array}} analysisResult - I dati estratti.
 * @param {HTMLElement} container - L'elemento del DOM in cui renderizzare l'anteprima.
 */
function renderImportPreview(analysisResult, container) {
    if (!container) return;

    const { lessons, activities } = analysisResult;
    let previewHtml = `<h4><span class="material-icons">preview</span> Anteprima Importazione</h4>`;
    previewHtml += `<p>Abbiamo trovato ${lessons.length} lezioni e ${activities.length} attività. Controlla e conferma.</p>`;

    if (lessons.length > 0) {
        previewHtml += '<h5>Lezioni da Importare:</h5><ul>';
        lessons.forEach(l => { previewHtml += `<li>${l.title}</li>`; });
        previewHtml += '</ul>';
    }

    if (activities.length > 0) {
        previewHtml += '<h5>Attività da Importare:</h5><ul>';
        activities.forEach(a => { previewHtml += `<li><strong>${a.type}:</strong> ${a.title}</li>`; });
        previewHtml += '</ul>';
    }

    previewHtml += `
        <div class="form-actions" style="margin-top: 24px;">
            <button id="confirm-import-btn" class="btn btn-primary">
                <span class="material-icons">done_all</span> Conferma e Importa Tutto
            </button>
            <button id="cancel-import-btn" class="btn btn-secondary">
                <span class="material-icons">cancel</span> Annulla
            </button>
        </div>
    `;

    container.innerHTML = previewHtml;

    document.getElementById('confirm-import-btn').addEventListener('click', () => {
        let importCount = 0;
        lessons.forEach(lessonData => {
            createLesson(lessonData);
            importCount++;
        });
        activities.forEach(activityData => {
            createActivity(activityData);
            importCount++;
        });
        showToast(`${importCount} elementi importati con successo!`, 'success');
        container.innerHTML = '';
    });

    document.getElementById('cancel-import-btn').addEventListener('click', () => {
        container.innerHTML = '';
        showToast('Importazione annullata.', 'info');
    });
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(new Error(`Errore durante la lettura del file: ${error.message}`));
        reader.readAsText(file);
    });
}

function classifyDocument(fileName, textContent) {
    const lowerContent = textContent.toLowerCase();
    const lowerFileName = fileName.toLowerCase();
    if (lowerContent.includes('orario')) return 'orario';
    if (lowerContent.includes('piano didattico') || lowerContent.includes('programma')) return 'programma_didattico';
    if (lowerFileName.includes('appunti')) return 'appunti';
    return 'generico';
}
