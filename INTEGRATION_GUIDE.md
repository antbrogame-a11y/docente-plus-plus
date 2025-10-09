# 📖 Guida all'Integrazione - UI Post-Login con Material UI

## Panoramica

Questa guida spiega come utilizzare e integrare la nuova interfaccia utente post-login basata su Material UI in Docente++.

## 🎯 Caratteristiche Implementate

### 1. Layout a Tre Sezioni

L'interfaccia è organizzata in tre sezioni principali accessibili tramite **BottomNavigation**:

#### **Orario Giornaliero** 📅
- Visualizza l'orario delle lezioni del giorno
- Mostra materia, classe, orario e aula
- Include chip per la classe
- Design responsive con card interattive

#### **Impegni Giornalieri** 📋
- Gestisce le attività e impegni quotidiani
- Tracking dello stato (pending, in-progress, completed)
- Livelli di priorità (high, medium, low)
- Barre di progresso per attività in corso

#### **Altro** ⚙️
- **Ordinamento dinamico basato sull'uso**
- 8 funzionalità secondarie:
  - Impostazioni
  - Storico
  - Statistiche
  - Assistenza
  - Profilo
  - Backup
  - Notifiche
  - Info App

### 2. Ordinamento Basato sull'Uso (Sezione Altro)

#### Come Funziona

1. **Tracciamento Automatico**: Ogni click su una funzionalità incrementa il contatore d'uso
2. **Persistenza**: I contatori sono salvati in `localStorage` con chiave `altroUsage`
3. **Riordinamento Real-time**: Le funzionalità si riordinano automaticamente (più usate in alto)
4. **Indicatori Visivi**: Chip mostrano il numero di utilizzi

#### Schema localStorage

```json
{
  "altroUsage": {
    "stats": 3,
    "support": 1,
    "settings": 0,
    "history": 0
  }
}
```

#### Estensione per Backend

Il codice include placeholder pronti per la sincronizzazione backend:

```javascript
// In src/components/Altro.jsx

// Sincronizza i dati d'uso al backend
const syncUsageDataToBackend = async (usageData) => {
  // POST /api/user/feature-usage
  // Vedi codice completo nel file
};

// Recupera dati d'uso dal backend
const fetchUsageDataFromBackend = async () => {
  // GET /api/user/feature-usage?userId=xxx
  // Vedi codice completo nel file
};
```

## 🚀 Come Utilizzare l'App React

### Metodo 1: Accesso Diretto (Consigliato per Test)

1. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

2. **Apri il browser** all'URL mostrato (default: `http://localhost:5173/app-react.html`)

3. **L'app si aprirà** mostrando l'interfaccia Material UI

### Metodo 2: Build di Produzione

1. **Compila l'app**:
   ```bash
   npm run build
   ```

2. **Serve la cartella dist**:
   ```bash
   npx serve dist
   # oppure
   cd dist && python3 -m http.server 8080
   ```

3. **Apri** `http://localhost:8080/app-react.html`

### Metodo 3: Integrazione con App Esistente

Per integrare l'interfaccia React nell'app esistente:

```javascript
// In app.js, dopo il login utente

function redirectToReactUI() {
  // Reindirizza alla nuova UI
  window.location.href = '/app-react.html';
}

// Oppure monta React in un container esistente
import ReactDOM from 'react-dom/client';
import MainScreen from './src/components/MainScreen';

const root = ReactDOM.createRoot(document.getElementById('react-container'));
root.render(<MainScreen />);
```

## 📱 Design Mobile-First

### Caratteristiche Responsive

- ✅ **BottomNavigation** per accesso rapido su mobile
- ✅ **Container Material UI** che si adatta alla viewport
- ✅ **Touch-friendly**: Pulsanti min 44px (standard iOS)
- ✅ **Layout flessibile** che scala da mobile a desktop

### Breakpoint Testati

- **Mobile** (375px): iPhone SE, iPhone 12/13/14
- **Tablet** (768px): iPad
- **Desktop** (1280px+): Schermi grandi

## 🎨 Personalizzazione del Tema

Il tema Material UI è configurato in `src/components/MainScreen.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2',  // Blu
    },
    secondary: {
      main: '#f39c12',  // Arancione
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", ...',
  },
});
```

### Modificare i Colori

Edita il file `src/components/MainScreen.jsx` e modifica i valori del tema:

```javascript
palette: {
  primary: { main: '#TUO_COLORE' },
  secondary: { main: '#TUO_COLORE' },
}
```

## 🔌 Integrazione Dati Reali

Attualmente l'app usa dati placeholder. Per integrare dati reali:

### Opzione 1: Props

```jsx
// In MainScreen.jsx o componente parent
<OrarioGiornaliero lessons={app.lessons} />
<ImpegniGiornalieri tasks={app.activities} />
```

### Opzione 2: Context API (Consigliato)

```jsx
// Crea AppContext.jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  return (
    <AppContext.Provider value={{ lessons, tasks, setLessons, setTasks }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

// In MainScreen.jsx
import { AppProvider } from './AppContext';

<AppProvider>
  <MainScreen />
</AppProvider>

// Nei componenti
const { lessons } = useApp();
```

### Opzione 3: API Backend

```jsx
// In OrarioGiornaliero.jsx
import { useEffect, useState } from 'react';

export default function OrarioGiornaliero() {
  const [lessons, setLessons] = useState([]);
  
  useEffect(() => {
    fetch('/api/schedule/today')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error('Error fetching lessons:', err));
  }, []);
  
  // Render con lessons reali...
}
```

## 🔧 Estensioni Future

### 1. Sincronizzazione Backend (Altro.jsx)

Il componente Altro è già preparato per la sincronizzazione backend:

1. Configura `BACKEND_API_ENDPOINT` in `Altro.jsx`
2. Implementa autenticazione (token JWT/session)
3. Decomenta le funzioni `syncUsageDataToBackend` e `fetchUsageDataFromBackend`

### 2. Drag & Drop per Riordinamento Manuale

Per aggiungere drag & drop:

```bash
npm install react-beautiful-dnd
# oppure
npm install @dnd-kit/core @dnd-kit/sortable
```

Vedi esempi completi in `src/components/README.md`.

### 3. Funzionalità Aggiuntive

- **Dark Mode**: Aggiungi toggle per tema scuro
- **Notifiche Push**: Integra service worker con notifiche
- **Offline Sync**: Cache locale con sincronizzazione differita
- **Multi-lingua**: Aggiungi supporto i18n

## 📊 Testing

### Test Manuale

1. ✅ Navigazione tra le 3 sezioni
2. ✅ Visualizzazione dati placeholder
3. ✅ Ordinamento automatico in Altro
4. ✅ Persistenza usage counters (refresh pagina)
5. ✅ Responsive su mobile/tablet/desktop

### Test Usage-Based Ordering

```javascript
// Apri DevTools Console

// Pulisci dati d'uso
localStorage.removeItem('altroUsage');

// Ricarica pagina e vai su "Altro"
// Clicca varie funzionalità

// Verifica dati salvati
JSON.parse(localStorage.getItem('altroUsage'));

// Ricarica pagina per verificare persistenza
```

## 🐛 Troubleshooting

### Problema: App non si carica

**Soluzione**: Verifica che tutte le dipendenze siano installate:
```bash
npm install
```

### Problema: Errori durante il build

**Soluzione**: Pulisci la cache e ricompila:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problema: Service Worker 404

**Soluzione**: Il service worker è configurato per l'app vanilla JS principale. Per l'app React standalone, puoi:
1. Ignorare l'errore (non critico per sviluppo)
2. Creare un service worker dedicato per app-react.html

### Problema: Le funzionalità in Altro non si riordinano

**Soluzione**: 
1. Verifica che localStorage non sia disabilitato
2. Controlla console per errori JavaScript
3. Verifica che i click siano registrati: controlla console per log "Feature clicked: xxx"

## 📚 Riferimenti

- **Material UI**: https://mui.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

## 📝 File Creati/Modificati

### Nuovi File
- `app-react.html` - Entry point standalone per app React
- `INTEGRATION_GUIDE.md` - Questa guida

### File Modificati
- `vite.config.js` - Aggiunto entry point per app-react.html

### File Esistenti (già presenti)
- `src/index.jsx` - Entry point React
- `src/components/MainScreen.jsx` - Container principale
- `src/components/OrarioGiornaliero.jsx` - Sezione Orario
- `src/components/ImpegniGiornalieri.jsx` - Sezione Impegni
- `src/components/Altro.jsx` - Sezione Altro con usage-based ordering
- `src/components/README.md` - Documentazione completa componenti
- `src/components/checklist.md` - Checklist integrazione
- `src/components/QUICK_START.md` - Guida rapida

## 💡 Best Practice

1. **Mobile-First**: Testa sempre su mobile prima
2. **Accessibilità**: Usa ARIA labels dove necessario
3. **Performance**: Usa React.memo per componenti pesanti
4. **Sicurezza**: Valida input utente, sanitizza HTML
5. **UX**: Aggiungi loading states e error handling

## 🎓 Conclusione

L'interfaccia Material UI post-login è pronta all'uso con:
- ✅ Layout a 3 sezioni con BottomNavigation
- ✅ Ordinamento dinamico basato sull'uso (sezione Altro)
- ✅ Persistenza localStorage
- ✅ Design responsive mobile-first
- ✅ Codice modulare e estendibile
- ✅ Documentazione completa

Per ulteriori dettagli tecnici, consulta `src/components/README.md`.

---

**Versione**: 1.0.0  
**Data**: Gennaio 2025  
**Autore**: Docente++ Development Team
