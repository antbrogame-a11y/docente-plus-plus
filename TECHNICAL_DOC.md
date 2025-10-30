# 📘 Docente++ - Documentazione Tecnica v1.2

## Panoramica Architettura

Docente++ v1.2 introduce una base intelligente modulare con focus su automazione e assistenza AI per docenti.

### Nuovi Moduli Implementati

#### 1. Import Pipeline (`js/import-pipeline.js`)
#### 2. Smart Planner (`js/planner.js`)
#### 3. Notification System (`js/notifications.js`)
#### 4. Advanced Dashboard (`js/dashboard.js`)

---

## 📂 Modulo 1: Import Pipeline

### Classe: `ImportPipeline`

Pipeline intelligente per importazione e gestione documenti didattici.

#### Caratteristiche Principali

- **Multi-formato**: Supporta PDF, Excel, CSV, TXT
- **Classificazione AI**: Pattern matching con predisposizione per AI futura
- **Estrazione strutturata**: Dati curriculum, attività, orario, studenti
- **Preview & Confirm**: UI di verifica prima dell'import definitivo
- **Gestione duplicati**: Merge intelligente per evitare doppioni

#### API Pubblica

```javascript
// Singleton instance
import { importPipeline } from './js/import-pipeline.js';

// Handle document upload
const result = await importPipeline.handleDocumentUpload(file);
// Returns: { file, classification, extractedData, timestamp }

// Generate preview HTML
const previewHTML = importPipeline.generatePreviewHTML(importData);

// Confirm and execute import
await importPipeline.confirmImport();

// Cancel import
importPipeline.cancelImport();
```

#### Tipi di Documento Supportati

| Tipo | Identificatore | Pattern Matching | Status |
|------|----------------|------------------|--------|
| Curriculum | `curriculum` | syllabus, programma, competenze | ✅ Basic |
| Attività | `activities` | verifica, compito, laboratorio | ✅ Basic |
| Orario | `schedule` | orario, lunedì, 08:00 | ✅ Basic |
| Studenti | `students` | nome, email, classe | ✅ Complete |

#### TODO per Integrazione AI

```javascript
// TODO(AI): In classifyDocument()
// - Integrate OpenRouter API for intelligent classification
// - Improve confidence scoring
// - Multi-language support

// TODO(AI): In extractStructuredData()
// - Use AI for curriculum parsing (competencies, units)
// - Extract activity dates and types automatically
// - Parse schedule grids intelligently
```

#### Esempio d'Uso

```javascript
// User uploads file
const fileInput = document.getElementById('file-upload');
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const importData = await importPipeline.handleDocumentUpload(file);
    
    if (importData) {
        // Show preview
        const previewContainer = document.getElementById('preview');
        previewContainer.innerHTML = importPipeline.generatePreviewHTML(importData);
    }
});

// User confirms import
document.getElementById('confirm-btn').addEventListener('click', () => {
    importPipeline.confirmImport();
});
```

---

## 🗓️ Modulo 2: Smart Planner

### Classe: `SmartPlanner`

Pianificatore intelligente con validazione regole e suggerimenti contestuali.

#### Regole di Scheduling

```javascript
{
    hoursPerDay: 5,           // Massimo 5 ore/giorno
    startHour: 8,             // Inizio ore 8:00
    endHour: 14,              // Fine ore 14:00 (13:00 inclusa)
    workDays: [1,2,3,4,5],   // Lunedì-Venerdì
    timeSlots: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00']
}
```

#### API Pubblica

```javascript
import { smartPlanner } from './js/planner.js';

// Validate time slot
const validation = smartPlanner.validateSlot(date, time);
// Returns: { valid: boolean, errors: string[] }

// Check daily limit
const dailyCheck = smartPlanner.checkDailyLimit(date);
// Returns: { current, limit, remaining, exceeded }

// Get available slots
const available = smartPlanner.getAvailableSlots(date);
// Returns: string[] of available times

// Suggest optimal time slots
const suggestions = await smartPlanner.suggestTimeSlots(classId, activityType, date);
// Returns: { suggestions: [{time, score, reason}], message, aiPowered }

// Suggest activities for slot
const activities = await smartPlanner.suggestActivities(classId, date, time);
// Returns: { suggestions: [{activity, score, reason}], message, aiPowered }

// Validate entire schedule
const validation = smartPlanner.validateSchedule();
// Returns: { valid, issues: [{type, date, message, severity}], summary }

// Get statistics
const stats = smartPlanner.getScheduleStats(startDate, endDate);
// Returns: { totalSlots, occupiedSlots, byClass, byActivityType, utilizationRate }
```

#### Algoritmi di Suggerimento

##### Time Slot Suggestions (Heuristic-Based)

```javascript
// Activity type preferences
const preferences = {
    'theory': { preferredHours: [8, 9, 10], priority: 'morning' },
    'lab': { preferredHours: [10, 11, 12], priority: 'midday' },
    'drawing': { preferredHours: [11, 12, 13], priority: 'afternoon' }
};

// Scoring: preferred hours = 10, others = 5
// TODO(AI): Replace with ML-based suggestions
```

##### Activity Suggestions (Context-Aware)

```javascript
// Boost score for:
// - Tests between 9:00-10:00 (+5)
// - Labs between 10:00-12:00 (+5)
// - In-progress activities (+3)
// - Activities due within 3 days (+variable)

// TODO(AI): Integrate historical data and student performance
```

#### TODO per Integrazione AI

```javascript
// TODO(AI): In suggestTimeSlots()
// - Analyze historical effectiveness of time slots
// - Consider class energy levels by time
// - Factor in previous lesson outcomes

// TODO(AI): In suggestActivities()
// - Predict activity duration
// - Suggest based on curriculum progression
// - Consider student performance patterns

// TODO(AI): In autoSchedule()
// - Implement constraint satisfaction solver
// - Optimize for multiple objectives (variety, balance, effectiveness)
// - Handle conflicts intelligently
```

---

## 🔔 Modulo 3: Notification System

### Classe: `NotificationSystem`

Sistema di notifiche proattive per reminder e impegni istituzionali.

#### Tipi di Notifica

| Tipo | Priorità | Trigger | Frequenza |
|------|----------|---------|-----------|
| `day_after` | Medium | Giorno dopo lezione | Una volta |
| `institutional` | High/Critical | N giorni prima impegno | Una volta |
| `activity_deadline` | Low/Medium/High/Critical | 3/1/0 giorni prima | Multipla |
| `reminder` | Variable | Custom | Custom |

#### API Pubblica

```javascript
import { notificationSystem } from './js/notifications.js';

// Start auto-check (chiamato automaticamente all'init)
notificationSystem.startAutoCheck();

// Force check (manuale)
await notificationSystem.checkAndGenerateNotifications();

// Add custom institutional commitment
notificationSystem.addInstitutionalCommitment({
    name: 'Colloqui Famiglie',
    month: 11,
    dayStart: 10,
    dayEnd: 20,
    priority: 'high',
    daysBeforeNotify: 7
});

// Get active notifications
const notifications = notificationSystem.getActiveNotifications();

// Get unread count
const count = notificationSystem.getUnreadCount();

// Mark as read
notificationSystem.markAsRead(notificationId);

// Dismiss notification
notificationSystem.dismissNotification(notificationId);

// Handle action
await notificationSystem.handleAction(notificationId, action);

// Generate HTML for UI
const html = notificationSystem.generateNotificationHTML();
```

#### Impegni Istituzionali Predefiniti

```javascript
const defaultCommitments = [
    {
        name: 'Scrutini Primo Quadrimestre',
        month: 1, // Febbraio
        dayStart: 1,
        dayEnd: 15,
        priority: 'high'
    },
    {
        name: 'Scrutini Finali',
        month: 5, // Giugno
        dayStart: 1,
        dayEnd: 15,
        priority: 'critical'
    },
    // ... altri impegni
];
```

#### Livelli di Priorità

- **Critical** 🔴: Urgente, richiede azione immediata (toast notification)
- **High** 🟠: Importante, necessita attenzione presto (toast notification)
- **Medium** 🟡: Normale, da considerare
- **Low** 🟢: Informativo, bassa urgenza

#### Auto-Check System

```javascript
// Frequency: Every 1 hour
setInterval(() => {
    checkAndGenerateNotifications();
}, 60 * 60 * 1000);

// Checks:
// 1. Day-after reminders for yesterday's lessons
// 2. Institutional commitments (monthly calendar)
// 3. Activity deadlines (3 days, 1 day, today)
// 4. Clean old notifications (>30 days)
```

#### TODO per Estensioni Future

```javascript
// TODO(Feature): Smart notification scheduling
// - Don't disturb hours (evening, night)
// - Group similar notifications
// - Adaptive frequency based on user behavior

// TODO(AI): Predictive notifications
// - Suggest actions before problems arise
// - Learn from notification interactions
// - Personalize notification types and timing

// TODO(Integration): 
// - Browser notifications API
// - Email notifications (opt-in)
// - Calendar integration (export to Google Calendar)
```

---

## 📊 Modulo 4: Advanced Dashboard

### Classe: `AdvancedDashboard`

Dashboard potenziato con filtri, ricerca e stato real-time classi.

#### Filtri Disponibili

```javascript
filters = {
    dateRange: 'all' | 'today' | 'week' | 'month' | 'custom',
    classId: 'all' | string,
    subject: 'all' | string,
    status: 'all' | 'planned' | 'in-progress' | 'completed',
    customStartDate: string | null,
    customEndDate: string | null
}
```

#### API Pubblica

```javascript
import { dashboard } from './js/dashboard.js';

// Apply filters to data
const filtered = dashboard.applyFilters(data, type);
// type: 'lessons' | 'activities' | 'students' | etc.

// Set filter
dashboard.setFilter('dateRange', 'week');
dashboard.setFilter('classId', 'class-123');

// Set search
dashboard.setSearch('matematica');

// Set sorting
dashboard.setSorting('date', 'desc');

// Reset all filters
dashboard.resetFilters();

// Get class status
const status = dashboard.getClassStatus(classId);
// Returns: { studentCount, lessonCount, activityCount, upcomingActivities, 
//            overdueActivities, avgGrade, recentActivity, health }

// Get all class statuses
const allStatuses = dashboard.getAllClassStatuses();

// Global search
const results = dashboard.globalSearch('query');
// Returns: { classes[], students[], lessons[], activities[], evaluations[] }

// Generate filter HTML
const filterHTML = dashboard.generateFilterHTML('lessons');

// Generate search bar HTML
const searchHTML = dashboard.generateSearchHTML();

// Generate class status cards HTML
const statusHTML = dashboard.generateClassStatusHTML();
```

#### Class Health Score

Algoritmo per calcolare salute di una classe:

```javascript
calculateClassHealth(studentCount, overdueActivities, recentLessons) {
    let score = 100;
    
    // Penalità per attività in ritardo
    score -= overdueActivities * 10;
    
    // Penalità per mancanza attività recente
    if (recentLessons === 0) score -= 20;
    
    // Penalità per assenza studenti
    if (studentCount === 0) score -= 30;
    
    score = clamp(score, 0, 100);
    
    // Levels:
    // 80-100: Excellent 🟢
    // 60-79: Good 🟡
    // 40-59: Warning 🟠
    // 0-39: Critical 🔴
}
```

#### Ricerca Globale

Cerca attraverso:
- Nome/descrizione classi
- Nome/email/note studenti
- Titolo/materia/descrizione lezioni
- Titolo/descrizione attività
- Note valutazioni

```javascript
// Debounced search (300ms)
handleSearch(query) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
        // Re-render filtered results
        window.app.renderAllTabs();
    }, 300);
}
```

#### TODO per Miglioramenti

```javascript
// TODO(UI): Advanced filter UI
// - Multi-select for classes
// - Date range picker visual
// - Quick filter presets
// - Save filter combinations

// TODO(Analytics): Visual analytics
// - Chart.js integration
// - Trend graphs (grades over time)
// - Comparative class performance
// - Activity completion rates

// TODO(Export): Export filtered data
// - Export to CSV/Excel with current filters
// - Generate PDF reports
// - Email reports
```

---

## 🔗 Integrazione tra Moduli

### Data Flow

```
User Action
    ↓
App.js (Orchestrator)
    ↓
┌───────────────────────────────────────┐
│ Import Pipeline → Smart Planner       │
│        ↓              ↓                │
│   Data Store ← Notifications          │
│        ↓              ↓                │
│   Dashboard  ←  Rendering             │
└───────────────────────────────────────┘
```

### Esempio: Importazione → Pianificazione

```javascript
// 1. User uploads activities document
const importData = await importPipeline.handleDocumentUpload(file);

// 2. Activities extracted
const activities = importData.extractedData.items;

// 3. Auto-schedule with smart planner
const scheduling = await smartPlanner.autoSchedule(
    activities,
    startDate,
    endDate,
    classId
);

// 4. Generate notifications for scheduled activities
scheduling.scheduled.forEach(item => {
    notificationSystem.createNotification({
        title: 'Attività Programmata',
        message: `${item.activity.title} il ${item.date}`,
        type: 'activity_scheduled'
    });
});

// 5. Dashboard shows new activities with filters
dashboard.setFilter('classId', classId);
dashboard.setFilter('dateRange', 'month');
```

---

## 🎯 Guide d'Uso per Developer

### Estendere Import Pipeline

#### Aggiungere Nuovo Tipo Documento

```javascript
// 1. In import-pipeline.js, aggiungi al supportedTypes
supportedTypes: {
    myNewType: {
        name: 'Tipo Nuovo',
        extensions: ['.ext'],
        icon: '📄'
    }
}

// 2. Aggiungi pattern matching in classifyDocument()
if (this.matchesPattern(fileName, text, 'myNewType')) {
    return { type: 'myNewType', label: 'Tipo Nuovo', confidence: 0.8 };
}

// 3. Implementa extractMyNewTypeData()
async extractMyNewTypeData(content) {
    // Your extraction logic
    return {
        type: 'myNewType',
        items: [...],
        message: 'Success message',
        needsReview: true
    };
}

// 4. Aggiungi case in extractStructuredData()
case 'myNewType':
    return await this.extractMyNewTypeData(content);
```

### Aggiungere Nuovo Tipo Notifica

```javascript
// 1. In notifications.js, aggiungi check in checkAndGenerateNotifications()
async checkMyNewNotifications() {
    // Your logic to determine when to notify
    
    this.createNotification({
        title: 'Titolo',
        message: 'Messaggio',
        type: 'my_new_type',
        priority: 'medium',
        actions: [
            { label: 'Azione', action: 'my_action' }
        ]
    });
}

// 2. Aggiungi handler in handleAction()
case 'my_action':
    // Handle the action
    break;

// 3. Aggiungi icona in generateNotificationHTML()
const iconMap = {
    // ...
    'my_new_type': '🆕'
};
```

### Creare Nuovo Filtro Dashboard

```javascript
// 1. In dashboard.js, aggiungi proprietà al filters object
this.filters = {
    // ...existing
    myNewFilter: 'all'
};

// 2. Implementa logica in applyFilters()
if (this.filters.myNewFilter !== 'all') {
    filtered = filtered.filter(item => 
        item.myProperty === this.filters.myNewFilter
    );
}

// 3. Aggiungi UI in generateFilterHTML()
<div class="filter-group">
    <label>Mio Filtro:</label>
    <select onchange="window.dashboard.handleFilterChange('myNewFilter', this.value)">
        <option value="all">Tutti</option>
        <option value="option1">Opzione 1</option>
    </select>
</div>
```

---

## 🧪 Testing Guidelines

### Unit Testing (Future)

```javascript
// test/import-pipeline.test.js
describe('ImportPipeline', () => {
    test('classifyDocument correctly identifies student roster', async () => {
        const file = new File(['nome,email\nMario,mario@test.it'], 'studenti.csv');
        const content = await importPipeline.readFileContent(file);
        const classification = await importPipeline.classifyDocument(file, content);
        
        expect(classification.type).toBe('students');
        expect(classification.confidence).toBeGreaterThan(0.7);
    });
});
```

### Integration Testing

```javascript
// test/integration.test.js
describe('Import to Schedule Flow', () => {
    test('imports activities and auto-schedules them', async () => {
        // 1. Upload activities file
        const importData = await importPipeline.handleDocumentUpload(activitiesFile);
        await importPipeline.confirmImport();
        
        // 2. Auto-schedule
        const scheduling = await smartPlanner.autoSchedule(
            state.activities,
            startDate,
            endDate,
            classId
        );
        
        // 3. Verify schedule
        expect(scheduling.scheduled.length).toBeGreaterThan(0);
        
        // 4. Verify notifications created
        const notifications = notificationSystem.getNotificationsByType('activity_scheduled');
        expect(notifications.length).toBeGreaterThan(0);
    });
});
```

---

## 📝 Contributing Guidelines

### Code Style

```javascript
// Use descriptive names
✅ const extractedStudents = parseStudentData(data);
❌ const x = parse(d);

// Add TODO comments for AI integration
// TODO(AI): Integrate OpenRouter API here
// TODO(Performance): Optimize large dataset handling
// TODO(Feature): Add batch import support

// Modular exports
export class ClassName { }
export function functionName() { }
export const constantName = value;
```

### Documentation

Ogni nuovo modulo deve includere:
- JSDoc comments per classi e metodi pubblici
- README sezione nel TECHNICAL_DOC.md
- Esempi d'uso pratici
- Lista TODO per future implementazioni

### Pull Request Template

```markdown
## Descrizione
[Breve descrizione della feature/fix]

## Tipo di cambiamento
- [ ] Bug fix
- [ ] Nuova feature
- [ ] Breaking change
- [ ] Documentazione

## Checklist
- [ ] Codice segue style guide
- [ ] Commenti TODO aggiunti dove appropriato
- [ ] Documentazione aggiornata
- [ ] Testing manuale completato
- [ ] No breaking changes (o documentati)

## Screenshot (se UI)
[Aggiungi screenshot]
```

---

## 🔮 Future Roadmap

### v1.3 - AI Integration (Q2 2025)

- [ ] OpenRouter API integration reale
- [ ] Document classification con AI
- [ ] Activity suggestions basate su ML
- [ ] Schedule optimization con AI

### v1.4 - Advanced Features (Q3 2025)

- [ ] Batch import documenti
- [ ] Analytics dashboard avanzato
- [ ] Collaborative features
- [ ] Calendar integrations

### v2.0 - Next Generation (Q4 2025+)

- [ ] Multi-modal AI (audio, images)
- [ ] Predictive analytics
- [ ] Cloud sync (opt-in)
- [ ] Mobile native apps

---

## 📞 Support & Resources

- **GitHub**: [antbrogame-a11y/docente-plus-plus](https://github.com/antbrogame-a11y/docente-plus-plus)
- **Docs**: `/docs` directory
- **Issues**: GitHub Issues
- **Vision**: VISION.md
- **Technical**: TECHNICAL_DOC.md (questo file)

---

*Documento versione 1.0 - 2025-01-15*
*Prossimo aggiornamento previsto: post v1.3 release*
