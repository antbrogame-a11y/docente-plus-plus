
const setupSuggestions = async () => {

    // --- CONTROLLO FUNZIONI GLOBALI ---
    if (typeof loadData !== 'function' || !window.model) {
        console.error('Funzioni globali (loadData) o modello AI (window.model) non trovati.');
        document.getElementById('suggestions-result-container').innerHTML = 
            '<p class="error-message">Errore: Impossibile inizializzare il modulo Suggerimenti. L\'assistente AI non è disponibile.</p>';
        return;
    }

    // --- ELEMENTI DEL DOM ---
    const form = document.getElementById('suggestions-generator-form');
    const classSelect = document.getElementById('suggestions-class-select');
    const typeSelect = document.getElementById('suggestions-type-select');
    const generateBtn = document.getElementById('generate-suggestions-btn');
    const resultContainer = document.getElementById('suggestions-result-container');
    const resultPlaceholder = document.getElementById('suggestions-result-placeholder');
    const resultContent = document.getElementById('suggestions-result-content');
    const resultLoader = document.getElementById('suggestions-result-loader');

    // --- DATI ---
    const classes = await loadData('classes', []);
    const students = await loadData('students', []);
    const evaluations = await loadData('evaluations', []);

    // --- FUNZIONI ---

    const populateClasses = () => {
        classSelect.innerHTML = '<option value="">-- Prima seleziona una classe --</option>';
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            classSelect.appendChild(option);
        });
    };

    const handleGeneration = async (e) => {
        e.preventDefault();
        
        const classId = classSelect.value;
        const type = typeSelect.value;

        if (!classId) {
            alert("Per favore, seleziona una classe da analizzare.");
            return;
        }

        // Mostra il loader e nascondi il resto
        resultPlaceholder.style.display = 'none';
        resultContent.style.display = 'none';
        resultLoader.style.display = 'block';
        generateBtn.disabled = true;

        // 1. Raccogli i dati pertinenti
        const selectedClass = classes.find(c => c.id === Number(classId));
        const studentsInClass = students.filter(s => s.classId === Number(classId));
        const studentIds = studentsInClass.map(s => s.id);
        const relevantEvaluations = evaluations.filter(ev => studentIds.includes(ev.studentId));

        // Prepara un riassunto dei dati per l'IA
        const dataSummary = studentsInClass.map(student => {
            const studentEvals = relevantEvaluations.filter(ev => ev.studentId === student.id);
            const grades = studentEvals.map(ev => ev.grade).filter(g => !isNaN(g));
            const average = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length) : 'N/A';
            return { name: `${student.surname} ${student.name}`, average: average, gradeCount: grades.length };
        });
        
        // 2. Costruisci il prompt per Gemini
        const analysisType = document.querySelector(`#suggestions-type-select option[value="${type}"]`).textContent;
        let prompt = `Agisci come un esperto di pedagogia e didattica per un insegnante di scuola secondaria. Analizza i seguenti dati di una classe e fornisci suggerimenti concreti e attuabili.\n\n`;
        prompt += `**Classe:** ${selectedClass.name}\n`;
        prompt += `**Tipo di Analisi Richiesta:** ${analysisType}\n\n`;
        prompt += `**Dati di Rendimento:**\n`;
        prompt += JSON.stringify(dataSummary, null, 2);
        prompt += `\n\n**Richiesta:**\n`;
        prompt += `Basandoti sui dati, ${getPromptInstructions(type)}. Fornisci una risposta chiara, ben strutturata in Markdown, con suggerimenti pratici che l'insegnante può applicare direttamente.`;

        try {
            const result = await window.model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            let html = text
                .replace(/\*\*\*(.*?)\*\*\*/g, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<h2>$1</h2>')
                .replace(/^\*\s(.*?)$/gm, '<li>$1</li>')
                .replace(/(\<li>.*?<\/li>)/gs, '<ul>$1</ul>')
                .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            resultContent.innerHTML = html;
            resultContent.style.display = 'block';

        } catch (error) {
            console.error("Errore durante la generazione dei suggerimenti:", error);
            resultContent.innerHTML = '<p class="error-message">Si è verificato un errore durante l'analisi. Riprova.</p>';
            resultContent.style.display = 'block';
        } finally {
            resultLoader.style.display = 'none';
            generateBtn.disabled = false;
        }
    };
    
    const getPromptInstructions = (type) => {
        switch(type) {
            case 'identify_struggling':
                return "individua gli studenti che mostrano segni di difficoltà (basse medie, poche valutazioni). Per ciascuno, suggerisci possibili cause e strategie di recupero personalizzate (es. lezioni individuali, materiale di supporto, approccio didattico alternativo).";
            case 'identify_top_performers':
                return "individua gli studenti con le migliori performance. Per ciascuno, suggerisci attività di potenziamento e arricchimento per mantenere alta la loro motivazione e stimolare ulteriormente le loro capacità (es. progetti di ricerca, letture avanzate, ruolo di tutor tra pari).";
            case 'class_overview':
                return "fornisci una panoramica generale del rendimento della classe. Evidenzia i punti di forza e di debolezza del gruppo. Suggerisci strategie didattiche a livello di classe per migliorare le aree carenti e consolidare quelle positive (es. lavori di gruppo su argomenti specifici, ripasso generale, uso di strumenti visivi).";
            default: 
                return "";
        }
    }

    // --- EVENT LISTENERS ---
    form.addEventListener('submit', handleGeneration);

    // --- INIZIALIZZAZIONE ---
    populateClasses();
};
