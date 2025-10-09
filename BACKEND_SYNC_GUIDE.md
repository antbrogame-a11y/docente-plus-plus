# 🔄 Backend Sync - Guida per Sviluppatori

## Panoramica

Questa guida fornisce esempi e best practice per implementare la sincronizzazione backend dei dati dell'app Docente++, con particolare focus sulla funzionalità di ordinamento basato sull'uso della sezione "Altro".

## 📊 Dati da Sincronizzare

### 1. Usage Data (Sezione Altro)

#### Struttura Dati Frontend (localStorage)

```json
{
  "altroUsage": {
    "settings": 10,
    "stats": 7,
    "history": 5,
    "support": 2,
    "profile": 1,
    "backup": 0,
    "notifications": 0,
    "about": 0
  }
}
```

#### Schema Database Proposto

```sql
CREATE TABLE user_feature_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    feature_key VARCHAR(50) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, feature_key)
);

-- Indice per query veloci
CREATE INDEX idx_user_feature_usage_user_id ON user_feature_usage(user_id);
```

### 2. Lezioni (Orario Giornaliero)

```sql
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    class_name VARCHAR(50),
    room VARCHAR(50),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Attività (Impegni Giornalieri)

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in-progress, completed
    priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
    progress INTEGER DEFAULT 0, -- 0-100
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🌐 API Endpoints

### Usage Data Endpoints

#### POST /api/user/feature-usage

Sincronizza i dati d'uso dal frontend al backend.

**Request:**
```json
{
  "userId": 123,
  "usageData": {
    "settings": 10,
    "stats": 7,
    "history": 5
  },
  "timestamp": "2025-01-09T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usage data synced successfully",
  "updated": ["settings", "stats", "history"]
}
```

**Implementazione Backend (Node.js/Express):**

```javascript
// backend/routes/featureUsage.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/api/user/feature-usage', async (req, res) => {
  const { userId, usageData, timestamp } = req.body;
  
  // Verifica autenticazione
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    const updated = [];
    
    // Aggiorna o inserisci per ogni feature
    for (const [featureKey, count] of Object.entries(usageData)) {
      await db.query(`
        INSERT INTO user_feature_usage (user_id, feature_key, usage_count, last_used_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, feature_key)
        DO UPDATE SET 
          usage_count = $3,
          last_used_at = $4,
          updated_at = NOW()
      `, [userId, featureKey, count, timestamp]);
      
      updated.push(featureKey);
    }
    
    res.json({
      success: true,
      message: 'Usage data synced successfully',
      updated
    });
  } catch (error) {
    console.error('Error syncing usage data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

#### GET /api/user/feature-usage

Recupera i dati d'uso dell'utente.

**Request:**
```
GET /api/user/feature-usage?userId=123
```

**Response:**
```json
{
  "success": true,
  "usageData": {
    "settings": 10,
    "stats": 7,
    "history": 5,
    "support": 2
  }
}
```

**Implementazione Backend:**

```javascript
router.get('/api/user/feature-usage', async (req, res) => {
  const { userId } = req.query;
  
  // Verifica autenticazione
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    const result = await db.query(
      'SELECT feature_key, usage_count FROM user_feature_usage WHERE user_id = $1',
      [userId]
    );
    
    // Trasforma in oggetto chiave-valore
    const usageData = {};
    result.rows.forEach(row => {
      usageData[row.feature_key] = row.usage_count;
    });
    
    res.json({
      success: true,
      usageData
    });
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Lessons Endpoints

#### GET /api/schedule/today

Recupera le lezioni di oggi.

**Response:**
```json
{
  "success": true,
  "lessons": [
    {
      "id": 1,
      "title": "Matematica",
      "subject": "Matematica",
      "class": "3A",
      "room": "Aula 12",
      "startTime": "08:00",
      "endTime": "09:00",
      "date": "2025-01-09"
    }
  ]
}
```

### Tasks Endpoints

#### GET /api/tasks

Recupera le attività dell'utente.

**Query Parameters:**
- `status`: filtra per stato (pending, in-progress, completed)
- `priority`: filtra per priorità (high, medium, low)
- `date`: filtra per data (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "title": "Correzione verifiche 3A",
      "status": "in-progress",
      "priority": "high",
      "progress": 60,
      "dueDate": "2025-01-09T18:00:00Z"
    }
  ]
}
```

## 🔐 Autenticazione

### JWT Authentication (Consigliato)

```javascript
// Middleware di autenticazione
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Applicalo alle route
router.post('/api/user/feature-usage', authenticateToken, async (req, res) => {
  // ...
});
```

### Frontend Integration (Altro.jsx)

```javascript
// In src/components/Altro.jsx

const syncUsageDataToBackend = async (usageData) => {
  try {
    // Recupera token JWT (esempio)
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('/api/user/feature-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: getCurrentUserId(), // Implementa questa funzione
        usageData: usageData,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Usage data synced successfully:', result);
    return result;
  } catch (error) {
    console.error('Error syncing usage data to backend:', error);
    // Fallback a localStorage se sync fallisce
    return null;
  }
};

// Attiva sync dopo ogni update
const handleFeatureClick = async (key) => {
  const newUsageData = { ...usageData, [key]: (usageData[key] || 0) + 1 };
  
  // Aggiorna stato locale
  setUsageData(newUsageData);
  saveUsageData(newUsageData);
  
  // Sync al backend (decommentare quando pronto)
  await syncUsageDataToBackend(newUsageData);
};
```

## 🔄 Strategie di Sincronizzazione

### 1. Sync Immediato (Real-time)

Ogni azione sincronizza immediatamente al backend.

**Pro:**
- Dati sempre aggiornati
- Sincronizzazione multi-device immediata

**Contro:**
- Più richieste HTTP
- Richiede connessione costante

**Implementazione:**
```javascript
const handleFeatureClick = async (key) => {
  const newUsageData = { ...usageData, [key]: (usageData[key] || 0) + 1 };
  setUsageData(newUsageData);
  saveUsageData(newUsageData);
  
  // Sync immediato
  await syncUsageDataToBackend(newUsageData);
};
```

### 2. Sync Batch (Consigliato)

Raccoglie modifiche e sincronizza periodicamente.

**Pro:**
- Meno richieste HTTP
- Migliore performance
- Funziona offline

**Contro:**
- Leggero ritardo nella sincronizzazione

**Implementazione:**
```javascript
// Sync ogni 30 secondi o quando la pagina si chiude
useEffect(() => {
  const syncInterval = setInterval(() => {
    syncUsageDataToBackend(usageData);
  }, 30000); // 30 secondi
  
  // Sync prima di chiudere
  const handleBeforeUnload = () => {
    syncUsageDataToBackend(usageData);
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    clearInterval(syncInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [usageData]);
```

### 3. Sync Offline-First (PWA)

Usa Service Worker per gestire richieste offline.

**Implementazione:**
```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/user/feature-usage')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Se offline, salva in IndexedDB
        return saveToIndexedDB(event.request);
      })
    );
  }
});

// Quando torna online, sincronizza
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-usage-data') {
    event.waitUntil(syncPendingData());
  }
});
```

## 🧪 Testing

### Test API con curl

```bash
# Login e ottieni token
TOKEN=$(curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.token')

# Sync usage data
curl -X POST http://localhost:3000/api/user/feature-usage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": 1,
    "usageData": {"settings": 5, "stats": 3},
    "timestamp": "2025-01-09T12:00:00Z"
  }'

# Fetch usage data
curl -X GET "http://localhost:3000/api/user/feature-usage?userId=1" \
  -H "Authorization: Bearer $TOKEN"
```

## 🔒 Sicurezza

### Best Practice

1. **Validazione Input**: Valida sempre i dati ricevuti
   ```javascript
   if (typeof usageData !== 'object' || Array.isArray(usageData)) {
     return res.status(400).json({ error: 'Invalid usage data format' });
   }
   ```

2. **Rate Limiting**: Limita richieste per utente
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minuti
     max: 100 // max 100 richieste
   });
   
   app.use('/api/', limiter);
   ```

3. **CSRF Protection**: Usa token CSRF per POST/PUT/DELETE

4. **HTTPS Only**: Forza HTTPS in produzione

## 📊 Monitoraggio

### Metriche da Tracciare

1. **Frequenza sync**: Quante volte al giorno per utente
2. **Errori sync**: Tasso di fallimento
3. **Latency**: Tempo medio di risposta
4. **Storage size**: Dimensione dati per utente

### Esempio Logger

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// In route handler
logger.info('Usage data synced', {
  userId: req.user.id,
  features: Object.keys(usageData),
  timestamp: new Date()
});
```

## 🚀 Deploy

### Environment Variables

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/docente_db
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
PORT=3000
```

### Docker Setup (Opzionale)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 📚 Risorse

- **PostgreSQL**: https://www.postgresql.org/docs/
- **Express.js**: https://expressjs.com/
- **JWT**: https://jwt.io/
- **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

**Nota**: Questo è un esempio di riferimento. Adatta l'implementazione alle tue esigenze specifiche e alla tua architettura backend.
