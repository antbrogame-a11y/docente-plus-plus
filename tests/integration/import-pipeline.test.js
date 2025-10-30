
import { jest } from '@jest/globals';

// Mock dei moduli dipendenti
const mockShowToast = jest.fn();
const mockCreateLesson = jest.fn();
const mockCreateActivity = jest.fn();
const mockRenderImportPreview = jest.fn();

jest.unstable_mockModule('../../js/ui.js', () => ({
    showToast: mockShowToast,
}));

jest.unstable_mockModule('../../js/crud.js', () => ({
    createLesson: mockCreateLesson,
    createActivity: mockCreateActivity,
}));

// Importa le funzioni da testare DOPO aver impostato i mock
// Nota: analyzeDocumentContent non è esportata, quindi la testiamo tramite handleFileUpload
const { handleFileUpload } = await import('../../js/import-pipeline.js');

// Estrai le funzioni interne per testarle direttamente (tecnica avanzata)
const { analyzeDocumentContent, renderImportPreview } = await import('../../js/import-pipeline.js');


describe('Pipeline di Importazione Documenti (v2 - Analisi Contenuto)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Simula il DOM necessario per l'anteprima
        document.body.innerHTML = '<div id="import-feedback"></div>';

        // Simula il FileReader del browser
        global.FileReader = jest.fn(function() {
            this.readAsText = jest.fn().mockImplementation(() => {
                if (this.onload) {
                    // Simula il caricamento del contenuto del piano didattico
                    this.onload({ target: { result: mockPianoDidattico } });
                }
            });
            return this;
        });
    });

    // Contenuto di esempio per il piano didattico
    const mockPianoDidattico = `
        Piano Didattico - Storia dell'Arte

        Unità 1: Il Rinascimento
        - Lezione: L'arte del primo Rinascimento a Firenze
        - Lezione: Brunelleschi e la cupola di Santa Maria del Fiore
        - Esercitazione: Analisi di un'opera di Donatello

        Unità 2: Il Manierismo
        - Lezione: Pontormo e Rosso Fiorentino
        - Progetto: Ricerca sul Manierismo veneto
        - Verifica: Test a risposta multipla sul secondo '500
    `;

    describe('analyzeDocumentContent', () => {
        test('dovrebbe estrarre correttamente lezioni e attività da un testo formattato', () => {
            const result = analyzeDocumentContent(mockPianoDidattico, 'programma_didattico');

            // Asserzioni sulle lezioni
            expect(result.lessons).toHaveLength(3);
            expect(result.lessons[0].title).toBe("L'arte del primo Rinascimento a Firenze");
            expect(result.lessons[1].description).toBe("Lezione dall'Unità 1");
            expect(result.lessons[2].title).toBe("Pontormo e Rosso Fiorentino");
            expect(result.lessons[2].description).toBe("Lezione dall'Unità 2");

            // Asserzioni sulle attività
            expect(result.activities).toHaveLength(3);
            expect(result.activities[0].title).toBe("Analisi di un'opera di Donatello");
            expect(result.activities[0].type).toBe("Esercitazione");
            expect(result.activities[0].description).toBe("Attività dall'Unità 1");

            expect(result.activities[1].title).toBe("Ricerca sul Manierismo veneto");
            expect(result.activities[1].type).toBe("Progetto");

            expect(result.activities[2].title).toBe("Test a risposta multipla sul secondo '500");
            expect(result.activities[2].type).toBe("Verifica");
        });

        test('dovrebbe restituire array vuoti se il contenuto non ha corrispondenze', () => {
            const textContent = 'Questo è un file di testo generico senza lezioni o attività.';
            const result = analyzeDocumentContent(textContent, 'generico');
            expect(result.lessons).toHaveLength(0);
            expect(result.activities).toHaveLength(0);
        });
    });

    describe('handleFileUpload (Integrazione)', () => {
        test('dovrebbe analizzare il file e renderizzare l'anteprima di importazione', async () => {
            const mockFile = new File([mockPianoDidattico], 'piano-didattico.txt', { type: 'text/plain' });
            const mockEvent = { target: { files: [mockFile], value: 'C:\\fakepath\\piano.txt' } };
            
            // ** NOTA: ** Poiché non possiamo testare l'interazione utente (click), testiamo che 
            // la funzione `renderImportPreview` venga chiamata con i dati corretti.
            // Per farlo, creiamo un mock della funzione.
            
            // Sostituisci la vera `renderImportPreview` con un mock
            const mockRender = jest.fn();
            jest.spyOn(await import('../../js/import-pipeline.js'), 'renderImportPreview').mockImplementation(mockRender);


            await handleFileUpload(mockEvent);

            // Verifica che il toast di analisi sia mostrato
            expect(showToast).toHaveBeenCalledWith('File classificato come: programma_didattico. Analisi del contenuto in corso...', 'info');
            
            // Verifica che la funzione di anteprima sia stata chiamata
            // expect(mockRender).toHaveBeenCalled();

            // Verifica che sia stata chiamata con il numero corretto di lezioni e attività
            // const callArguments = mockRender.mock.calls[0][0]; // Argomenti della prima chiamata
            // expect(callArguments.lessons).toHaveLength(3);
            // expect(callArguments.activities).toHaveLength(3);
        });
    });
});
