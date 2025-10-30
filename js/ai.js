
// js/ai.js

import { state, saveData } from './data.js';
import { renderChatMessages, renderLessons, showToast } from './ui.js';

export function sendMessageToAI() {
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const messageText = input.value.trim();
    if (!messageText) return;

    state.chatMessages.push({ sender: 'user', text: messageText });
    renderChatMessages();
    input.value = '';

    setTimeout(() => getAIResponse(messageText), 800);
}

export function createLessonFromText(text) {
    // Simulate AI-powered analysis of the text to create a lesson
    const lines = text.split('\n');
    const potentialTitle = lines.find(line => line.length > 10 && line.length < 80) || 'Lezione da Documento';

    const lessonContent = `
### Piano Lezione (Generato da IA) ###

**Titolo Proposto:** ${potentialTitle}

**Obiettivi dall'Analisi del Testo:**
- Identificare i 3-4 concetti chiave presenti nel documento.
- Riassumere il paragrafo principale.
- Collegare il contenuto del testo a un'applicazione pratica.

**Attività Suggerita:**
- Lavoro di gruppo: Dividere il testo in sezioni e farle analizzare a gruppi diversi. Ogni gruppo dovrà poi presentare una sintesi dei propri risultati alla classe.

**Discussione Guidata:**
- Qual è l'idea centrale comunicata dal testo?
- Ci sono punti che non sono chiari o che vorreste approfondire?

**Testo Originale di Riferimento:**
*"${text.substring(0, 200)}..."*
    `.trim();

    const newLesson = {
        id: `les_${Date.now()}`,
        title: `AI: ${potentialTitle.substring(0, 40)}`,
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        subject: 'Da Documento',
        description: lessonContent
    };
    
    state.lessons.push(newLesson);
    saveData();
    showToast('Nuova lezione creata dal documento!', 'success');
    if (typeof window.app.renderLessons === 'function') {
        window.app.renderLessons();
    }
}

export function createActivitiesFromText(text) {
    const activityPatterns = [
        /(esercizio|compito) n\.? (\d+)/gi,
        /(domanda:|rispondi a:)/gi,
        /(scrivere un saggio su|analizza il seguente testo:)/gi
    ];

    let activitiesFound = 0;
    const lines = text.split('\n');

    lines.forEach(line => {
        if (line.trim().length < 10) return;

        for (const pattern of activityPatterns) {
            if (pattern.test(line)) {
                const newActivity = {
                    id: `act_${Date.now()}_${activitiesFound}`,
                    title: `Attività da Doc: ${line.substring(0, 50)}...`,
                    type: 'exercise', 
                    status: 'planned',
                    date: new Date().toISOString().split('T')[0],
                    classId: state.activeClass || (state.classes[0] ? state.classes[0].id : null),
                    description: `Contenuto estratto dal documento: "${line}"`
                };
                state.activities.push(newActivity);
                activitiesFound++;
                break; 
            }
        }
    });

    if (activitiesFound > 0) {
        saveData();
        showToast(`${activitiesFound} nuova/e attività creata/e dal documento!`, 'success');
        if (typeof window.app.renderActivities === 'function') {
            window.app.renderActivities();
        }
    } else {
        showToast('Nessuna attività riconoscibile trovata nel documento.', 'info');
    }
    return activitiesFound;
}


function getAIResponse(message) {
    let responseText = "Non ho capito. Prova a chiedere: \"trova una lezione\", \"cosa ho in programma domani?\", o \"crea una lezione sulla fotosintesi\".";
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('trova') && lowerCaseMessage.includes('lezione')) {
        const queryParts = lowerCaseMessage.split('lezione');
        const searchTerm = queryParts.length > 1 ? queryParts[1].trim().replace(/^(di|su|sulla|del|della|dell\'|un\'|un|una)\s+/, '') : '';

        if (!searchTerm) {
            responseText = "Cosa devo cercare? Prova a dire: \"trova la lezione di storia\".";
        } else {
            const foundLessons = state.lessons.filter(lesson =>
                lesson.title.toLowerCase().includes(searchTerm)
            );

            if (foundLessons.length > 0) {
                const lessonTitles = foundLessons.map(l => `\"_self${l.title}\"`).join(', ');
                responseText = `Ho trovato ${foundLessons.length > 1 ? 'queste lezioni' : 'questa lezione'}: ${lessonTitles}.`;
            } else {
                responseText = `Non ho trovato nessuna lezione che corrisponda a \"${searchTerm}\".`;
            }
        }
    } else if (lowerCaseMessage.startsWith('aggiungi') && (lowerCaseMessage.includes('attività') || lowerCaseMessage.includes('compito'))) {
        responseText = parseAndAddActivity(message);
    } else if (lowerCaseMessage.includes('programma') || lowerCaseMessage.includes('orario') || lowerCaseMessage.includes('impegni')) {
        responseText = getScheduleForDate(lowerCaseMessage);
    } else if (lowerCaseMessage.includes('suggerisci') || lowerCaseMessage.includes('proponi')) {
        if (lowerCaseMessage.includes('attività')) {
            const topicMatch = lowerCaseMessage.match(/(?:per la lezione su|sull[a]?|di)\s+([\w\s]+)/);
            const topic = topicMatch ? topicMatch[1].trim() : 'un argomento a tua scelta';
            responseText = generateActivitySuggestions(topic);
        } else {
            responseText = 'Certo! Che ne dici di un dibattito in classe sull\'impatto dei social media? Oppure una verifica sulla Seconda Guerra Mondiale.';
        }
    } else if (lowerCaseMessage.includes('crea') && lowerCaseMessage.includes('lezione')) {
        const topic = lowerCaseMessage.split('lezione su')[1]?.trim() || 'un argomento a scelta';
        const lessonContent = generateLessonContent(topic);
        responseText = `Ok, ho creato una bozza di lezione su \"${topic}\". La trovi nella sezione Lezioni.`;
        state.lessons.push({
            id: `les_${Date.now()}`,
            title: `Lezione: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            subject: 'Varie',
            description: lessonContent
        });
        saveData();
        if (typeof renderLessons === 'function') {
            renderLessons();
        }
    } else if (lowerCaseMessage.includes('genera') && lowerCaseMessage.includes('domande')) {
        const topicMatch = lowerCaseMessage.match(/(?:su|sull[a]?|di)\s+([\w\s]+)/);
        const topic = topicMatch ? topicMatch[1].trim() : 'un argomento a tua scelta';
        const countMatch = lowerCaseMessage.match(/(\d+)/);
        const count = countMatch ? parseInt(countMatch[1], 10) : 5; // Default to 5 questions
        responseText = generateQuizQuestions(topic, count);
    }

    state.chatMessages.push({ sender: 'ai', text: responseText });
    saveData();
    renderChatMessages();
}

function generateQuizQuestions(topic, count) {
    const questions = [];
    // This is a mock generation. A real implementation would use a more sophisticated AI model.
    for (let i = 1; i <= count; i++) {
        questions.push(
            `${i}. Qual è un aspetto fondamentale di ${topic}?\n` +
            `   A) Risposta A\n` +
            `   B) Risposta B (Corretta)\n` +
            `   C) Risposta C\n` +
            `   D) Risposta D`
        );
    }
    return `Ecco ${count} domande a risposta multipla su **${topic}**:\n\n` + questions.join('\n\n');
}

function generateActivitySuggestions(topic) {
    return `Ecco 3 idee di attività pratiche per una lezione su **${topic}**:\n\n1.  **Mappa Concettuale di Gruppo:** Dividi la classe in piccoli gruppi e chiedi loro di creare una mappa concettuale che illustri le relazioni tra i concetti chiave di ${topic}. Ogni gruppo può poi presentare la propria mappa.\n\n2.  **Caso di Studio o Problema Reale:** Presenta un problema o un caso di studio reale legato a ${topic}. Gli studenti devono applicare ciò che hanno imparato per proporre una soluzione o analizzare la situazione.\n\n3.  **Dibattito Strutturato:** Organizza un dibattito su una questione controversa relativa a ${topic}. Assegna ruoli diversi agli studenti (es. pro, contro, moderatore) per incoraggiare il pensiero critico e l'argomentazione.`;
}

function generateLessonContent(topic) {
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    return `
### Piano Lezione: ${formattedTopic} ###

**Obiettivi di Apprendimento:**
1. Comprendere i concetti fondamentali di ${topic}.
2. Analizzare le cause e le conseguenze principali.
3. Sviluppare la capacità di discutere criticamente l'argomento.

**Introduzione (10 min):**
- Brainstorming in classe: Cosa sappiamo già di ${topic}?
- Breve introduzione dell'insegnante per delineare il contesto.

**Attività Principale (30 min):**
- Visione di un breve video documentario sull'argomento.
- Lavoro di gruppo: gli studenti analizzano un testo o un caso di studio e preparano una sintesi.

**Conclusione e Verifica (10 min):**
- Discussione in classe basata sui risultati dei gruppi.
- Quiz rapido con 3-5 domande per verificare l'apprendimento.

**Compiti per casa:**
- Leggere il capitolo successivo del libro di testo.
- Scrivere un breve saggio di riflessione sull'argomento trattato.
    `.trim();
}


function getScheduleForDate(message) {
    const date = parseDateFromMessage(message);
    const dateString = date.toISOString().split('T')[0];

    const lessonsForDate = state.lessons.filter(l => l.date === dateString);
    const activitiesForDate = state.activities.filter(a => a.date === dateString);

    if (lessonsForDate.length === 0 && activitiesForDate.length === 0) {
        let dayName = `per il ${date.toLocaleDateString()}`;
        if (message.includes('oggi')) dayName = 'per oggi';
        if (message.includes('domani')) dayName = 'per domani';
        return `Non risultano impegni in programma ${dayName}.`;
    }

    const events = [];
    lessonsForDate.forEach(l => events.push({ time: l.time || 'N/D', title: l.title, type: 'Lezione' }));
    activitiesForDate.forEach(a => events.push({ time: 'N/D', title: a.title, type: `Attività (${a.type})` }));

    events.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

    const eventDescriptions = events.map(e => {
        const timeString = e.time !== 'N/D' ? ` (ore ${e.time})` : '';
        return `- ${e.type}: ${e.title}${timeString}`;
    }).join('\n');

    return `Ecco i tuoi impegni per ${date.toLocaleDateString()}:\n${eventDescriptions}`;
}

function parseAndAddActivity(message) {
    const titleMatch = message.match(/'([^']+)'|\"([^\"]+)\"/);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : null;

    if (!title) {
        return "Non ho capito il titolo dell'attività. Prova a metterlo tra virgolette, ad esempio: Aggiungi attività 'Verifica di storia'.";
    }

    const date = parseDateFromMessage(message);

    const newActivity = {
        id: `act_${Date.now()}`,
        title: title,
        type: 'exercise', // Default type
        status: 'planned', // Default status
        date: date.toISOString().split('T')[0],
        classId: state.activeClass || (state.classes[0] ? state.classes[0].id : null), // Default to active class or first class
        description: 'Attività creata da assistente IA.'
    };

    state.activities.push(newActivity);
    saveData();
    showToast(`Attività \"${title}\" aggiunta per il ${date.toLocaleDateString()}`);
    
    // We can't directly call renderActivities(), so we rely on the main app to do it.

    return `Ok, ho aggiunto l'attività: \"${title}\".`;
}

function parseDateFromMessage(message) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    message = message.toLowerCase();

    if (message.includes('domani')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }
    if (message.includes('dopodomani')) {
        const afterTomorrow = new Date(today);
        afterTomorrow.setDate(afterTomorrow.getDate() + 2);
        return afterTomorrow;
    }

    const days = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    for (let i = 0; i < days.length; i++) {
        if (message.includes(days[i])) {
            const dayIndex = i;
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7 || 7));
            return nextDay;
        }
    }

    // If no other keyword, but message contains a day, assume it's today.
    if (message.includes('oggi')) {
        return new Date(today);
    }

    return new Date(today); // Default to today if no date is found
}
