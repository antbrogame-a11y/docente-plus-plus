
// js/import-pipeline.js
// Enhanced document import pipeline with AI-powered extraction

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Document Import Pipeline
 * Handles structured data extraction from educational documents
 */

export class ImportPipeline {
    constructor() {
        this.supportedTypes = {
            curriculum: {
                name: 'Curriculum/Programma',
                extensions: ['.pdf', '.doc', '.docx', '.txt'],
                icon: '📚'
            },
            activities: {
                name: 'Piano Attività',
                extensions: ['.pdf', '.xlsx', '.csv', '.txt'],
                icon: '📋'
            },
            schedule: {
                name: 'Orario Scolastico',
                extensions: ['.pdf', '.xlsx', '.csv', '.txt'],
                icon: '🗓️'
            },
            students: {
                name: 'Anagrafica Studenti',
                extensions: ['.xlsx', '.csv', '.txt'],
                icon: '👥'
            }
        };
        
        this.currentImport = null;
        this.previewData = null;
    }

    /**
     * Main entry point for document upload
     */
    async handleDocumentUpload(file) {
        if (!file) {
            showToast('Nessun file selezionato', 'warning');
            return null;
        }

        try {
            showToast('Analisi documento in corso...', 'info');
            
            // Step 1: Read file content
            const content = await this.readFileContent(file);
            
            // Step 2: Classify document type (with AI or pattern matching)
            const classification = await this.classifyDocument(file, content);
            
            // Step 3: Extract structured data based on type
            const extractedData = await this.extractStructuredData(content, classification.type, file);
            
            // Step 4: Store for preview
            this.currentImport = {
                file: file,
                classification: classification,
                extractedData: extractedData,
                timestamp: new Date().toISOString()
            };
            
            showToast(`Documento classificato: ${classification.label}`, 'success');
            
            return this.currentImport;
            
        } catch (error) {
            console.error('Import error:', error);
            showToast('Errore durante l\'importazione: ' + error.message, 'error');
            return null;
        }
    }

    /**
     * Read file content based on type
     */
    async readFileContent(file) {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (extension === '.pdf') {
            return await this.readPDF(file);
        } else if (['.xlsx', '.xls'].includes(extension)) {
            return await this.readExcel(file);
        } else if (extension === '.csv') {
            return await this.readCSV(file);
        } else if (['.txt', '.doc', '.docx'].includes(extension)) {
            return await this.readText(file);
        } else {
            throw new Error('Formato file non supportato');
        }
    }

    async readPDF(file) {
        // TODO(AI): Integrate PDF.js for full text extraction
        // For now, return file metadata
        return {
            type: 'pdf',
            name: file.name,
            size: file.size,
            // Placeholder: In real implementation, extract text with PDF.js
            text: `[Contenuto PDF da estrarre: ${file.name}]`
        };
    }

    async readExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                    
                    resolve({
                        type: 'excel',
                        name: file.name,
                        sheets: workbook.SheetNames,
                        data: jsonData
                    });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async readCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                Papa.parse(csv, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve({
                            type: 'csv',
                            name: file.name,
                            data: results.data,
                            meta: results.meta
                        });
                    },
                    error: reject
                });
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    async readText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                let text = e.target.result;
                
                // For .docx files, we'd need a library like mammoth.js
                // For now, treat .doc/.docx as plain text (user should save as .txt or .pdf)
                if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
                    text = `[Documento Word: ${file.name}]\n\n` + 
                           `Per una migliore estrazione, salva il documento come PDF o TXT.\n\n` +
                           `Contenuto estratto (limitato):\n${text.substring(0, 1000)}`;
                }
                
                resolve({
                    type: 'text',
                    name: file.name,
                    text: text
                });
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Classify document type using AI or pattern matching
     */
    async classifyDocument(file, content) {
        // TODO(AI): Integrate OpenRouter API for intelligent classification
        // For now, use pattern matching and filename heuristics
        
        const fileName = file.name.toLowerCase();
        const text = this.getTextContent(content);
        
        // Pattern matching
        if (this.matchesPattern(fileName, text, 'curriculum')) {
            return { type: 'curriculum', label: 'Curriculum/Programma', confidence: 0.8 };
        } else if (this.matchesPattern(fileName, text, 'activities')) {
            return { type: 'activities', label: 'Piano Attività', confidence: 0.75 };
        } else if (this.matchesPattern(fileName, text, 'schedule')) {
            return { type: 'schedule', label: 'Orario Scolastico', confidence: 0.7 };
        } else if (this.matchesPattern(fileName, text, 'students')) {
            return { type: 'students', label: 'Anagrafica Studenti', confidence: 0.85 };
        } else {
            return { type: 'unknown', label: 'Tipo Sconosciuto', confidence: 0.3 };
        }
    }

    getTextContent(content) {
        if (typeof content === 'string') return content.toLowerCase();
        if (content.text) return content.text.toLowerCase();
        if (content.data && Array.isArray(content.data)) {
            return JSON.stringify(content.data).toLowerCase();
        }
        return '';
    }

    matchesPattern(fileName, text, type) {
        const patterns = {
            curriculum: {
                fileName: ['curriculum', 'programma', 'syllabus', 'piano didattico'],
                content: ['competenze', 'obiettivi', 'traguardi', 'unità di apprendimento']
            },
            activities: {
                fileName: ['attività', 'piano', 'calendario', 'programmazione'],
                content: ['verifica', 'compito', 'laboratorio', 'progetto', 'esercitazione']
            },
            schedule: {
                fileName: ['orario', 'schedule', 'timetable'],
                content: ['lunedì', 'martedì', 'mercoledì', '08:00', '09:00']
            },
            students: {
                fileName: ['studenti', 'alunni', 'anagrafica', 'elenco', 'roster'],
                content: ['nome', 'cognome', 'email', 'classe', 'data di nascita']
            }
        };

        const pattern = patterns[type];
        if (!pattern) return false;

        // Check filename
        const fileNameMatch = pattern.fileName.some(p => fileName.includes(p));
        
        // Check content
        const contentMatch = pattern.content.some(p => text.includes(p));

        return fileNameMatch || contentMatch;
    }

    /**
     * Extract structured data based on document type
     */
    async extractStructuredData(content, type, file) {
        switch (type) {
            case 'curriculum':
                return await this.extractCurriculumData(content);
            case 'activities':
                return await this.extractActivitiesData(content);
            case 'schedule':
                return await this.extractScheduleData(content);
            case 'students':
                return await this.extractStudentsData(content);
            default:
                return { items: [], message: 'Tipo documento non riconosciuto' };
        }
    }

    /**
     * Extract curriculum/syllabus data
     */
    async extractCurriculumData(content) {
        // TODO(AI): Use AI to extract structured curriculum data
        // For now, return structured placeholder
        
        return {
            type: 'curriculum',
            items: [
                {
                    subject: 'Da definire',
                    grade: 'Da definire',
                    units: [],
                    objectives: [],
                    competencies: []
                }
            ],
            message: '⚠️ Estrazione curriculum richiede integrazione IA. Placeholder generato.',
            needsReview: true
        };
    }

    /**
     * Extract activities from document
     */
    async extractActivitiesData(content) {
        // Enhanced extraction with better pattern matching
        const activities = [];
        
        // Simple pattern matching for common activity structures
        const text = this.getTextContent(content);
        
        // Extract structured data if it's from CSV/Excel
        if (content.type === 'csv' || content.type === 'excel') {
            return this.extractActivitiesFromTabular(content);
        }
        
        // Text-based extraction
        const activityPatterns = [
            // Match "- Lezione: title" or "• Lezione: title"
            /[-•]\s*(Lezione|Compito|Verifica|Laboratorio|Progetto|Esercitazione):\s*(.+?)(?:\n|$)/gi,
            // Match numbered lists "1. title"
            /\d+\.\s*([^:\n]+?)(?:\s*-\s*(.+?))?(?:\n|$)/gi
        ];
        
        activityPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const type = match[1] ? this.mapActivityTypeFromItalian(match[1]) : 'lesson';
                const title = match[2] || match[1];
                
                if (title && title.length > 5 && title.length < 200) {
                    activities.push({
                        type: 'lezione',
                        title: title.trim(),
                        date: new Date().toISOString().split('T')[0],
                        startTime: '09:00',
                        endTime: '10:00',
                        notes: `Estratto da: ${content.name || 'documento'}`,
                        source: 'document_import',
                        needsReview: true
                    });
                }
            }
        });

        // Try to extract dates if present
        this.enrichActivitiesWithDates(activities, text);

        return {
            type: 'activities',
            items: activities,
            message: activities.length > 0 
                ? `${activities.length} attività estratte. Rivedi e modifica prima dell'importazione.`
                : '⚠️ Nessuna attività riconosciuta. Considera importazione manuale.',
            needsReview: true
        };
    }

    /**
     * Extract activities from tabular data (CSV/Excel)
     */
    extractActivitiesFromTabular(content) {
        const activities = [];
        const data = content.data;
        
        if (!data || data.length === 0) return { type: 'activities', items: [], message: 'Nessun dato trovato', needsReview: true };
        
        // Determine if first row is header
        const hasHeader = this.detectHeader(data);
        const rows = hasHeader ? (Array.isArray(data[0]) ? data.slice(1) : data) : data;
        
        rows.forEach((row, index) => {
            if (!row || (Array.isArray(row) && row.filter(cell => cell).length === 0)) return;
            
            const activity = {
                type: 'lezione',
                title: this.extractFieldFromRow(row, ['titolo', 'title', 'attività', 'nome']) || `Attività ${index + 1}`,
                date: this.extractFieldFromRow(row, ['data', 'date', 'giorno']) || new Date().toISOString().split('T')[0],
                startTime: this.extractFieldFromRow(row, ['ora inizio', 'inizio', 'start', 'ora']) || '09:00',
                endTime: this.extractFieldFromRow(row, ['ora fine', 'fine', 'end']) || '10:00',
                notes: this.extractFieldFromRow(row, ['note', 'notes', 'descrizione', 'description']) || '',
                source: 'document_import',
                needsReview: true
            };
            
            // Try to detect activity type from title or dedicated column
            const typeField = this.extractFieldFromRow(row, ['tipo', 'type', 'categoria']);
            if (typeField) {
                activity.type = this.mapActivityTypeFromItalian(typeField);
            } else {
                activity.type = this.detectActivityTypeFromTitle(activity.title);
            }
            
            activities.push(activity);
        });
        
        return {
            type: 'activities',
            items: activities,
            message: `${activities.length} attività estratte da tabella. Rivedi i dati.`,
            needsReview: true
        };
    }

    /**
     * Detect if first row is a header
     */
    detectHeader(data) {
        if (!data || data.length === 0) return false;
        
        const firstRow = data[0];
        if (!firstRow) return false;
        
        // Check if it's an object (parsed CSV with header) or array
        if (typeof firstRow === 'object' && !Array.isArray(firstRow)) {
            return true; // Already parsed with headers
        }
        
        // For arrays, check if first row looks like headers
        if (Array.isArray(firstRow)) {
            const headerKeywords = ['titolo', 'data', 'ora', 'tipo', 'nome', 'title', 'date', 'time', 'type', 'name'];
            const matches = firstRow.filter(cell => {
                if (!cell || typeof cell !== 'string') return false;
                return headerKeywords.some(keyword => cell.toLowerCase().includes(keyword));
            });
            return matches.length >= 2;
        }
        
        return false;
    }

    /**
     * Extract field from row (supports both object and array format)
     */
    extractFieldFromRow(row, fieldNames) {
        if (typeof row === 'object' && !Array.isArray(row)) {
            // Object format - search by key
            for (const fieldName of fieldNames) {
                const keys = Object.keys(row);
                const matchingKey = keys.find(key => key.toLowerCase().includes(fieldName.toLowerCase()));
                if (matchingKey && row[matchingKey]) {
                    return String(row[matchingKey]).trim();
                }
            }
        } else if (Array.isArray(row)) {
            // Array format - return first non-empty cell (simplified)
            // In real implementation, we'd need column mapping
            return row.find(cell => cell && String(cell).trim()) || '';
        }
        return '';
    }

    /**
     * Map Italian activity type to internal format
     */
    mapActivityTypeFromItalian(italianType) {
        const mapping = {
            'lezione': 'lezione',
            'compito': 'compito',
            'verifica': 'verifica',
            'test': 'verifica',
            'laboratorio': 'laboratorio',
            'progetto': 'progetto',
            'esercitazione': 'esercitazione',
            'evento': 'evento',
            'riunione': 'riunione',
            'gita': 'gita'
        };
        const normalized = italianType.toLowerCase().trim();
        return mapping[normalized] || 'lezione';
    }

    /**
     * Detect activity type from title
     */
    detectActivityTypeFromTitle(title) {
        const lowerTitle = title.toLowerCase();
        
        if (lowerTitle.match(/\b(verifica|test|esame|valutazione)\b/)) return 'verifica';
        if (lowerTitle.match(/\b(compito|compiti|homework)\b/)) return 'compito';
        if (lowerTitle.match(/\b(laboratorio|lab|pratica|esperimento)\b/)) return 'laboratorio';
        if (lowerTitle.match(/\b(progetto|elaborato)\b/)) return 'progetto';
        if (lowerTitle.match(/\b(esercitazione|esercizi)\b/)) return 'esercitazione';
        if (lowerTitle.match(/\b(riunione|meeting|incontro)\b/)) return 'riunione';
        if (lowerTitle.match(/\b(gita|uscita|visita)\b/)) return 'gita';
        
        return 'lezione';
    }

    /**
     * Try to extract and associate dates with activities
     */
    enrichActivitiesWithDates(activities, text) {
        // Look for date patterns in the text
        const datePatterns = [
            /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g,  // DD/MM/YYYY or DD-MM-YYYY
            /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g     // YYYY-MM-DD
        ];
        
        const dates = [];
        datePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                try {
                    // Parse date
                    let dateStr;
                    if (match[1].length === 4) {
                        // YYYY-MM-DD format
                        dateStr = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
                    } else {
                        // DD/MM/YYYY format - convert to YYYY-MM-DD
                        const year = match[3].length === 2 ? `20${match[3]}` : match[3];
                        dateStr = `${year}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
                    }
                    dates.push(dateStr);
                } catch (e) {
                    // Invalid date, skip
                }
            }
        });
        
        // Assign dates to activities if we found any
        if (dates.length > 0) {
            activities.forEach((activity, index) => {
                if (index < dates.length) {
                    activity.date = dates[index];
                }
            });
        }
    }

    /**
     * Extract schedule data
     */
    async extractScheduleData(content) {
        // TODO(AI): AI-powered schedule extraction
        const slots = [];
        
        // Pattern matching for time slots
        const timePattern = /(\d{1,2}):(\d{2})/g;
        const text = this.getTextContent(content);
        const matches = text.match(timePattern);
        
        if (matches && matches.length > 0) {
            // Basic extraction
            return {
                type: 'schedule',
                items: [{
                    message: `Trovati ${matches.length} riferimenti orari`,
                    slots: matches.slice(0, 6), // First 6 time references
                    needsReview: true
                }],
                message: '⚠️ Estrazione orario richiede integrazione IA completa.',
                needsReview: true
            };
        }

        return {
            type: 'schedule',
            items: [],
            message: '⚠️ Nessun orario riconosciuto. Importazione manuale consigliata.',
            needsReview: true
        };
    }

    /**
     * Extract student roster data
     */
    async extractStudentsData(content) {
        // Reuse existing student extraction logic from app.js
        // This function can delegate to the existing extractStudentsFromTabularData
        
        if (content.type === 'csv' || content.type === 'excel') {
            const data = content.data;
            if (!data || data.length === 0) {
                return {
                    type: 'students',
                    items: [],
                    message: 'File vuoto o formato non valido',
                    needsReview: true
                };
            }

            // Extract headers and data
            const students = this.parseStudentData(data);
            
            return {
                type: 'students',
                items: students,
                message: `${students.length} studenti estratti. Verifica dati prima dell'importazione.`,
                needsReview: true
            };
        }

        return {
            type: 'students',
            items: [],
            message: 'Formato non supportato per anagrafica studenti. Usa CSV o Excel.',
            needsReview: true
        };
    }

    parseStudentData(data) {
        // Simplified student parsing - integrate with existing app.js logic
        const students = [];
        
        // Skip header row if present
        const rows = Array.isArray(data[0]) ? data.slice(1) : data;
        
        rows.forEach((row, index) => {
            if (!row || (Array.isArray(row) && row.length === 0)) return;
            
            const student = {
                id: `imported_${Date.now()}_${index}`,
                name: this.extractField(row, ['nome', 'name', 'cognome e nome']) || `Studente ${index + 1}`,
                email: this.extractField(row, ['email', 'e-mail', 'mail']) || '',
                class: this.extractField(row, ['classe', 'class', 'sezione']) || '',
                birthdate: this.extractField(row, ['data di nascita', 'birthdate', 'nascita']) || '',
                notes: this.extractField(row, ['note', 'notes']) || '',
                needsReview: true
            };
            
            students.push(student);
        });

        return students;
    }

    extractField(row, fieldNames) {
        // Extract field from row based on possible field names
        if (Array.isArray(row)) {
            // Array format (from CSV)
            return row[0] || ''; // Simplified
        } else if (typeof row === 'object') {
            // Object format (from parsed CSV with headers)
            for (const fieldName of fieldNames) {
                const value = row[fieldName] || row[fieldName.toLowerCase()] || row[fieldName.toUpperCase()];
                if (value) return value;
            }
        }
        return '';
    }

    /**
     * Generate preview UI for extracted data with editable fields
     */
    generatePreviewHTML(importData) {
        if (!importData || !importData.extractedData) {
            return '<p class="error">Nessun dato da visualizzare</p>';
        }

        const { classification, extractedData } = importData;
        const icon = this.supportedTypes[classification.type]?.icon || '📄';
        
        let html = `
            <div class="import-preview">
                <div class="import-preview-header">
                    <h3>${icon} ${classification.label}</h3>
                    <div class="confidence-badge" style="background-color: ${this.getConfidenceColor(classification.confidence)}">
                        Confidenza: ${Math.round(classification.confidence * 100)}%
                    </div>
                </div>
                <div class="import-preview-message ${extractedData.needsReview ? 'warning' : 'success'}">
                    ${extractedData.message}
                </div>
                <div class="import-preview-instructions">
                    <p><strong>💡 Istruzioni:</strong> Puoi modificare, aggiungere o rimuovere dati prima dell'importazione. Usa i pulsanti di azione su ogni elemento.</p>
                </div>
        `;

        // Type-specific preview with editing capabilities
        if (extractedData.type === 'students' && extractedData.items.length > 0) {
            html += this.generateStudentsPreview(extractedData.items);
        } else if (extractedData.type === 'activities' && extractedData.items.length > 0) {
            html += this.generateActivitiesPreview(extractedData.items);
        } else if (extractedData.type === 'schedule') {
            html += this.generateSchedulePreview(extractedData.items);
        } else if (extractedData.type === 'curriculum') {
            html += this.generateCurriculumPreview(extractedData.items);
        } else {
            html += '<p class="info">Nessun dato estratto. Considera importazione manuale.</p>';
        }

        html += `
                <div class="import-preview-actions">
                    <button class="btn btn-primary" onclick="window.importPipeline.confirmImport()">
                        <span class="material-symbols-outlined">check_circle</span>
                        Conferma e Importa
                    </button>
                    <button class="btn btn-secondary" onclick="window.importPipeline.cancelImport()">
                        <span class="material-symbols-outlined">cancel</span>
                        Annulla
                    </button>
                    ${extractedData.needsReview ? '<button class="btn btn-accent" onclick="window.importPipeline.refineWithAI()"><span class="material-symbols-outlined">psychology</span> Affina con IA</button>' : ''}
                </div>
            </div>
        `;

        return html;
    }

    generateStudentsPreview(students) {
        let html = '<div class="preview-table-wrapper">';
        html += '<div class="preview-table-header"><h4>Anteprima Studenti</h4>';
        html += '<button class="btn btn-sm btn-secondary" onclick="window.importPipeline.addNewStudent()"><span class="material-symbols-outlined">person_add</span> Aggiungi Studente</button></div>';
        html += '<table class="preview-table editable-table"><thead><tr>';
        html += '<th>Nome</th><th>Email</th><th>Classe</th><th>Data Nascita</th><th>Note</th><th>Azioni</th>';
        html += '</tr></thead><tbody id="students-preview-tbody">';
        
        students.forEach((student, index) => {
            html += `<tr data-index="${index}">
                <td><input type="text" class="editable-field" value="${student.name || ''}" data-field="name" data-index="${index}"></td>
                <td><input type="email" class="editable-field" value="${student.email || ''}" data-field="email" data-index="${index}"></td>
                <td><input type="text" class="editable-field" value="${student.class || ''}" data-field="class" data-index="${index}"></td>
                <td><input type="date" class="editable-field" value="${student.birthdate || ''}" data-field="birthdate" data-index="${index}"></td>
                <td><input type="text" class="editable-field" value="${student.notes || ''}" data-field="notes" data-index="${index}"></td>
                <td>
                    <button class="btn-icon btn-danger" onclick="window.importPipeline.removeItem('students', ${index})" title="Rimuovi">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        html += `<p class="table-note">Totale: ${students.length} studenti</p>`;
        html += '</div>';
        return html;
    }

    generateActivitiesPreview(activities) {
        let html = '<div class="preview-list">';
        html += '<div class="preview-list-header"><h4>Anteprima Attività</h4>';
        html += '<button class="btn btn-sm btn-secondary" onclick="window.importPipeline.addNewActivity()"><span class="material-symbols-outlined">add_task</span> Aggiungi Attività</button></div>';
        html += '<div id="activities-preview-list">';
        
        activities.forEach((activity, index) => {
            const typeOptions = ['lesson', 'homework', 'test', 'lab', 'project', 'exercise', 'other'];
            const typeLabels = {
                'lesson': 'Lezione',
                'homework': 'Compito',
                'test': 'Verifica',
                'lab': 'Laboratorio',
                'project': 'Progetto',
                'exercise': 'Esercitazione',
                'other': 'Altro'
            };
            
            html += `
                <div class="preview-item editable-item" data-index="${index}">
                    <div class="preview-item-header">
                        <input type="text" class="editable-field field-title" value="${activity.title || ''}" data-field="title" data-index="${index}" placeholder="Titolo attività">
                        <button class="btn-icon btn-danger" onclick="window.importPipeline.removeItem('activities', ${index})" title="Rimuovi">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                    <div class="preview-item-fields">
                        <div class="field-group">
                            <label>Tipo:</label>
                            <select class="editable-field" data-field="type" data-index="${index}">
                                ${typeOptions.map(opt => `<option value="${opt}" ${activity.type === opt ? 'selected' : ''}>${typeLabels[opt]}</option>`).join('')}
                            </select>
                        </div>
                        <div class="field-group">
                            <label>Data:</label>
                            <input type="date" class="editable-field" value="${activity.date || ''}" data-field="date" data-index="${index}">
                        </div>
                        <div class="field-group">
                            <label>Ora Inizio:</label>
                            <input type="time" class="editable-field" value="${activity.startTime || ''}" data-field="startTime" data-index="${index}">
                        </div>
                        <div class="field-group">
                            <label>Ora Fine:</label>
                            <input type="time" class="editable-field" value="${activity.endTime || ''}" data-field="endTime" data-index="${index}">
                        </div>
                    </div>
                    <div class="field-group field-full">
                        <label>Descrizione:</label>
                        <textarea class="editable-field" data-field="description" data-index="${index}" rows="2">${activity.description || ''}</textarea>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        html += `<p class="table-note">Totale: ${activities.length} attività</p>`;
        html += '</div>';
        return html;
    }

    generateSchedulePreview(items) {
        let html = '<div class="preview-info">';
        
        if (items.length > 0 && items[0].slots) {
            html += '<p><strong>Slot orari trovati:</strong></p><ul>';
            items[0].slots.forEach(slot => {
                html += `<li>${slot}</li>`;
            });
            html += '</ul>';
        } else {
            html += '<p>Nessuno slot orario estratto automaticamente.</p>';
        }
        
        html += '</div>';
        return html;
    }

    generateCurriculumPreview(items) {
        return '<div class="preview-info"><p>Preview curriculum non ancora implementata. Integrazione IA necessaria.</p></div>';
    }

    getConfidenceColor(confidence) {
        if (confidence >= 0.8) return '#27ae60';
        if (confidence >= 0.6) return '#f39c12';
        return '#e74c3c';
    }

    /**
     * Confirm and execute import
     */
    async confirmImport() {
        if (!this.currentImport || !this.currentImport.extractedData) {
            showToast('Nessun dato da importare', 'warning');
            return;
        }

        const { extractedData } = this.currentImport;
        let imported = 0;

        try {
            if (extractedData.type === 'students') {
                imported = await this.importStudents(extractedData.items);
                showToast(`${imported} studenti importati con successo! Vai alla sezione Studenti per vederli.`, 'success', 5000);
            } else if (extractedData.type === 'activities') {
                imported = await this.importActivities(extractedData.items);
                showToast(`${imported} attività importate nell'agenda con successo! Vai alla sezione Agenda per vederle.`, 'success', 5000);
            } else if (extractedData.type === 'schedule') {
                showToast('Importazione orario richiede configurazione manuale nella sezione Orario', 'info', 5000);
            } else if (extractedData.type === 'curriculum') {
                showToast('Importazione curriculum richiede integrazione IA avanzata', 'info', 5000);
            }

            // Record import in history
            this.recordImport(extractedData.type, imported);

            // Clear current import
            this.currentImport = null;
            
            // Clear preview UI
            const previewContainer = document.getElementById('import-preview-container');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div class="import-success-message">
                        <span class="material-symbols-outlined" style="font-size: 64px; color: #27ae60;">check_circle</span>
                        <h3>Importazione completata!</h3>
                        <p>I dati sono stati importati correttamente. Naviga nelle sezioni appropriate per visualizzarli.</p>
                    </div>
                `;
            }
            
            // Refresh UI
            if (window.app) {
                window.app.renderAllTabs();
            }

        } catch (error) {
            console.error('Import error:', error);
            showToast('Errore durante l\'importazione: ' + error.message, 'error');
        }
    }

    async importStudents(students) {
        let count = 0;
        students.forEach(student => {
            // Check for duplicates
            const exists = state.students.find(s => 
                s.name === student.name || 
                (s.email && student.email && s.email === student.email)
            );

            if (!exists) {
                state.students.push({
                    id: `student_${Date.now()}_${count}`,
                    name: student.name,
                    email: student.email,
                    class: student.class,
                    birthdate: student.birthdate,
                    notes: student.notes
                });
                count++;
            }
        });

        saveData();
        return count;
    }

    async importActivities(activities) {
        let count = 0;
        activities.forEach(activity => {
            // Import as event in agenda (compatible with the new event structure)
            const event = {
                id: `event_${Date.now()}_${count}`,
                title: activity.title,
                type: activity.type || 'lezione',
                startDate: activity.date,
                startTime: activity.startTime || '09:00',
                endDate: activity.date,
                endTime: activity.endTime || '10:00',
                note: activity.notes || activity.description || '',
                classId: activity.classId || null,
                linkedToOrario: false,
                source: activity.source || 'document_import'
            };
            
            state.events.push(event);
            count++;
        });

        saveData();
        return count;
    }

    recordImport(type, count) {
        // TODO: Implement import history tracking
        console.log(`Import recorded: ${type}, ${count} items`);
    }

    /**
     * Cancel current import
     */
    cancelImport() {
        this.currentImport = null;
        this.previewData = null;
        showToast('Importazione annullata', 'info');
        
        // Clear preview UI
        const previewContainer = document.getElementById('import-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    }

    /**
     * Refine data with AI (future feature)
     */
    async refineWithAI() {
        // TODO(AI): Integrate AI refinement
        showToast('Affinamento IA in arrivo! Per ora, rivedi manualmente i dati.', 'info');
    }

    /**
     * Add new student to preview
     */
    addNewStudent() {
        if (!this.currentImport || !this.currentImport.extractedData) return;
        
        const newStudent = {
            name: '',
            email: '',
            class: '',
            birthdate: '',
            notes: '',
            needsReview: true
        };
        
        this.currentImport.extractedData.items.push(newStudent);
        this.updatePreview();
        showToast('Nuovo studente aggiunto. Compila i campi.', 'info');
    }

    /**
     * Add new activity to preview
     */
    addNewActivity() {
        if (!this.currentImport || !this.currentImport.extractedData) return;
        
        const newActivity = {
            title: '',
            type: 'lesson',
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '10:00',
            description: '',
            needsReview: true
        };
        
        this.currentImport.extractedData.items.push(newActivity);
        this.updatePreview();
        showToast('Nuova attività aggiunta. Compila i campi.', 'info');
    }

    /**
     * Remove item from preview
     */
    removeItem(type, index) {
        if (!this.currentImport || !this.currentImport.extractedData) return;
        
        this.currentImport.extractedData.items.splice(index, 1);
        this.updatePreview();
        showToast('Elemento rimosso', 'info');
    }

    /**
     * Update preview UI with current data
     */
    updatePreview() {
        const previewContainer = document.getElementById('import-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = this.generatePreviewHTML(this.currentImport);
            this.attachFieldListeners();
        }
    }

    /**
     * Attach event listeners to editable fields
     */
    attachFieldListeners() {
        const editableFields = document.querySelectorAll('.editable-field');
        editableFields.forEach(field => {
            field.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                const fieldName = e.target.dataset.field;
                const value = e.target.value;
                
                if (this.currentImport && this.currentImport.extractedData.items[index]) {
                    this.currentImport.extractedData.items[index][fieldName] = value;
                }
            });
        });
    }
}

// Create singleton instance
export const importPipeline = new ImportPipeline();

// Make available globally for onclick handlers
if (typeof window !== 'undefined') {
    window.importPipeline = importPipeline;
}
