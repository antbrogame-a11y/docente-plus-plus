
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Importa la funzione da testare. L'export è stato aggiunto in precedenza.
import { analyzeDocumentContent } from '../../js/import-pipeline.js';

// Percorso del file di test
const filePath = path.join(process.cwd(), 'docs', 'test-piano-didattico.txt');

describe('Logica di Analisi del Documento (analyzeDocumentContent)', () => {

    let testContent;

    // Carica il contenuto del file di test prima di eseguire i test
    beforeAll(() => {
        try {
            testContent = fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error("Errore catastrofico: impossibile leggere il file di test per l'analisi del documento.", error);
            throw new Error('File di test non trovato o illeggibile.');
        }
    });

    test('dovrebbe estrarre correttamente lezioni e attività da un piano didattico ben formato', () => {
        // Esegue l'analisi sul contenuto del file caricato
        const result = analyzeDocumentContent(testContent, 'programma_didattico');

        // Asserzioni sulle lezioni estratte
        expect(result.lessons).toHaveLength(2);
        expect(result.lessons[0].title).toBe('Introduzione alla Biologia Molecolare');
        expect(result.lessons[0].description).toContain('Unità 1');
        expect(result.lessons[1].title).toBe('Le Basi della Genetica');

        // Asserzioni sulle attività estratte
        expect(result.activities).toHaveLength(3);
        expect(result.activities[0].title).toBe('Replicazione del DNA');
        expect(result.activities[0].type).toBe('Laboratorio');
        expect(result.activities[0].description).toContain('Unità 1');

        expect(result.activities[1].title).toBe('Leggi di Mendel');
        expect(result.activities[1].type).toBe('Esercitazione');
        
        expect(result.activities[2].title).toBe('Ereditarietà');
        expect(result.activities[2].type).toBe('Verifica');
        expect(result.activities[2].description).toContain('Unità 2');
    });

    test('dovrebbe restituire un risultato vuoto se il contenuto è nullo o vuoto', () => {
        const resultNull = analyzeDocumentContent(null);
        const resultEmpty = analyzeDocumentContent('');

        expect(resultNull.lessons).toHaveLength(0);
        expect(resultNull.activities).toHaveLength(0);
        expect(resultEmpty.lessons).toHaveLength(0);
        expect(resultEmpty.activities).toHaveLength(0);
    });

    test('dovrebbe gestire correttamente un file senza elementi importabili', () => {
        const content = 'Questo è un file di testo semplice.\nSenza lezioni o attività da importare.';
        const result = analyzeDocumentContent(content, 'generico');

        expect(result.lessons).toHaveLength(0);
        expect(result.activities).toHaveLength(0);
    });
});
