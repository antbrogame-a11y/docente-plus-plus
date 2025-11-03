
// Logica per la pagina di Analisi Valutazioni con IA (analysis.html)

const setupAnalysisPage = () => {

    // --- VERIFICA DIPENDENZE ---
    const firestoreDependencies = ['getEvaluationsFromFirestore', 'getGradesForEvaluation'];
    const missingDeps = firestoreDependencies.filter(dep => typeof window[dep] !== 'function');
    if (missingDeps.length > 0) {
        console.error(`Errore critico: mancano le dipendenze: ${missingDeps.join(', ')}.`);
        document.getElementById('analysis-result-container').innerHTML = `<p class="error">Errore critico.</p>`;
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const evaluationSelect = document.getElementById('analysis-evaluation-select');
    const startAnalysisBtn = document.getElementById('start-analysis-btn');
    const resultContainer = document.getElementById('analysis-result-container');

    // --- FUNZIONI ---
    const populateEvaluationsDropdown = async () => {
        try {
            const evaluations = await getEvaluationsFromFirestore();
            evaluationSelect.innerHTML = '<option value="">Seleziona una valutazione...</option>';
            if (evaluations.length === 0) {
                evaluationSelect.innerHTML = '<option value="">Nessuna valutazione trovata</option>';
                return;
            }
            evaluations.sort((a, b) => (b.date || 0) - (a.date || 0)); // Ordina per data, più recenti prima
            evaluations.forEach(e => {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = e.name || `Valutazione del ${new Date(e.date).toLocaleDateString()}`;
                option.dataset.name = e.name;
                evaluationSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Errore nel caricamento delle valutazioni: ", error);
        }
    };

    const handleStartAnalysis = async () => {
        const evaluationId = evaluationSelect.value;
        const evaluationName = evaluationSelect.options[evaluationSelect.selectedIndex].dataset.name;
        if (!evaluationId) return;

        // Verifica la presenza delle impostazioni IA
        const apiKey = localStorage.getItem('or_api_key');
        const modelName = localStorage.getItem('or_model_name');
        if (!apiKey || !modelName) {
            resultContainer.innerHTML = `
                <div class="wip-icon">
                    <span class="material-symbols-outlined">settings</span>
                    <p>Configurazione IA mancante. Per favore, <a href="#settings">vai alle impostazioni</a> per inserire la tua API key di OpenRouter e scegliere un modello.</p>
                </div>`;
            return;
        }

        startAnalysisBtn.disabled = true;
        startAnalysisBtn.innerHTML = '<span class="spinner"></span> Analisi in corso...';
        resultContainer.innerHTML = '<div class="wip-icon"><span class="material-symbols-outlined">smart_toy</span><p>L\'Assistente IA sta analizzando i dati... Potrebbe volerci un minuto.</p></div>';

        try {
            const grades = await getGradesForEvaluation(evaluationId);
            if (grades.length === 0) {
                resultContainer.innerHTML = '<div class="wip-icon"><span class="material-symbols-outlined">info</span><p>Nessun voto trovato. Impossibile analizzare.</p></div>';
                return;
            }

            const report = await generateAIReport(evaluationName, grades, apiKey, modelName);
            resultContainer.innerHTML = markdownToHtml(report);

        } catch (error) {
            console.error("Errore durante l'analisi AI: ", error);
            resultContainer.innerHTML = `<p class="error">Si è verificato un errore: ${error.message}</p>`;
        } finally {
            startAnalysisBtn.disabled = false;
            startAnalysisBtn.innerHTML = '<span class="material-symbols-outlined">psychology</span> Analizza con IA';
        }
    };

    const generateAIReport = async (evaluationName, grades, apiKey, modelName) => {
        const prompt = `
Sei un assistente pedagogico esperto per un docente di scuola superiore. 
Il docente ti fornisce i dati di una valutazione. Il tuo compito è analizzarli e produrre un report conciso, ricco di spunti e operativo in lingua ITALIANA.

Il report deve essere strutturato in Markdown e includere OBBLIGATORIAMENTE le seguenti sezioni:

1.  **Sintesi Generale:** Un paragrafo introduttivo sulla performance generale della classe.
2.  **Analisi Statistica:** Calcola e presenta le metriche chiave: media, mediana, deviazione standard e la distribuzione dei voti per fasce (es. Insufficienti 0-5.9, Sufficienti 6-7.9, Buoni/Ottimi 8-10).
3.  **Cluster di Performance:** Identifica 3 gruppi di studenti: "Studenti con ottimi risultati", "Studenti nella media", e "Studenti che necessitano di supporto". Elenca i nomi degli studenti per ogni gruppo.
4.  **Punti di Forza:** Basandoti sui dati, cosa è andato bene? Quali potrebbero essere gli argomenti compresi dalla maggioranza?
5.  **Aree di Miglioramento:** Dove si sono concentrate le maggiori difficoltà? Quali argomenti sembrano più ostici?
6.  **Azioni Consigliate:** Fornisci al docente 2-3 suggerimenti concreti e attuabili (es. "Pianificare una lezione di ripasso su X", "Assegnare esercizi di potenziamento al primo gruppo", "Creare coppie di studio tra studenti di cluster diversi").

Usa un tono professionale, basato sui dati e incoraggiante.

---
**DATI DA ANALIZZARE**

*   **Nome Valutazione:** ${evaluationName}
*   **Scala Voti:** 0-10
*   **Elenco Voti (formato JSON):**
${JSON.stringify(grades.map(g => ({ nome: g.studentName, voto: g.grade })))} 
        `;

        console.log("Invio prompt all'IA:", prompt);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: prompt }],
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`L'API di OpenRouter ha risposto con un errore: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    };

    // Semplice converter da Markdown a HTML per il report
    const markdownToHtml = (text) => {
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^\* (.*$)/gim, '<ul>\n<li>$1</li>\n</ul>')
            .replace(/^\d\. (.*$)/gim, '<ol>\n<li>$1</li>\n</ol>')
            .replace(/\n/g, '<br>');
    };


    // --- AGGANCIO EVENTI ---
    evaluationSelect.addEventListener('change', () => {
        startAnalysisBtn.disabled = !evaluationSelect.value;
    });
    startAnalysisBtn.addEventListener('click', handleStartAnalysis);

    // --- INIZIALIZZAZIONE ---
    populateEvaluationsDropdown();
    console.log("Pagina Analisi configurata.");
};
