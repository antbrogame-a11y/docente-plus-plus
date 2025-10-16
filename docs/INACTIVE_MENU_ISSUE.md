# 🔒 Menu Inattivo - Esempio e Risoluzione

## Problema: Menu Inattivo dopo Onboarding Incompleto

Questo documento descrive il problema del menu inattivo che può verificarsi in Docente++ e le soluzioni implementate nella versione 1.2.1.

## Screenshot del Problema

![Menu Inattivo](https://github.com/user-attachments/assets/31e68e53-2452-487e-adb3-152a011635b5)

**Figura 1**: Menu inattivo con voci disabilitate (mostrano icona lucchetto 🔒). Solo Home e Impostazioni sono accessibili.

## Descrizione del Problema

Quando l'onboarding non è completo o i dati del profilo sono corrotti, le voci di menu vengono automaticamente disabilitate per impedire l'accesso a funzionalità che richiedono un profilo completo.

### Sintomi

- ❌ Le voci di menu sono **opache** (ridotta opacità)
- ❌ Mostrano un'**icona lucchetto** 🔒
- ❌ Hanno l'attributo `aria-disabled="true"` per l'accessibilità
- ❌ Il tooltip mostra: "Completa il profilo per accedere a questa funzionalità"
- ❌ Click sul menu non produce alcun effetto

### Voci Sempre Accessibili

Anche con profilo incompleto, queste voci rimangono sempre accessibili:

- ✅ **Home**: Pagina principale con panoramica
- ✅ **Impostazioni**: Per completare/modificare il profilo

## Cause del Problema

Il menu può diventare inattivo in questi scenari:

### 1. Onboarding Non Completato
```javascript
// localStorage.getItem('onboardingComplete') !== 'true'
{
  reason: 'not_started',
  needsOnboarding: true,
  needsProfileCompletion: false
}
```

**Cosa succede**: 
- Modal di onboarding mostrato
- Menu disabilitato eccetto Home e Impostazioni

### 2. Dati Profilo Corrotti
```javascript
// onboardingComplete === true, ma teacherName mancante
{
  reason: 'corrupted_profile',
  needsOnboarding: false,
  needsProfileCompletion: true
}
```

**Cosa succede**:
- Banner arancione mostrato in alto
- Menu disabilitato eccetto Home e Impostazioni
- Toast di avviso: "⚠️ Profilo incompleto rilevato..."

### 3. localStorage Non Disponibile
```javascript
// checkStorageHealth() restituisce false
```

**Cosa succede**:
- Messaggio di errore critico
- App potrebbe non funzionare correttamente

## Soluzioni Implementate (v1.2.1)

### 1. Recupero Automatico dello Stato

La funzione `recoverOnboardingState()` identifica lo stato corrente:

```javascript
export function recoverOnboardingState() {
    const onboardingComplete = isOnboardingComplete();
    const profileComplete = isProfileComplete();
    
    // Caso 1: Stato corrotto
    if (onboardingComplete && !profileComplete) {
        return {
            needsOnboarding: false,
            needsProfileCompletion: true,
            reason: 'corrupted_profile'
        };
    }
    
    // Caso 2: Onboarding non iniziato
    if (!onboardingComplete) {
        return {
            needsOnboarding: true,
            needsProfileCompletion: false,
            reason: 'not_started'
        };
    }
    
    // Caso 3: Tutto OK
    return {
        needsOnboarding: false,
        needsProfileCompletion: false,
        reason: 'complete'
    };
}
```

### 2. Banner di Guida

Un banner persistente guida l'utente alla soluzione:

```html
<div id="onboarding-incomplete-banner" class="onboarding-banner">
    <div class="onboarding-banner-content">
        <span class="material-symbols-outlined">info</span>
        <div class="onboarding-banner-text">
            <strong>Configurazione incompleta</strong>
            <p>Completa il tuo profilo per accedere a tutte le funzionalità</p>
        </div>
        <button id="complete-onboarding-btn" class="btn btn-primary btn-sm">
            <span class="material-symbols-outlined">person</span>
            Completa Profilo
        </button>
    </div>
</div>
```

### 3. Gestione Menu Intelligente

Le funzioni `disableMenuItems()` e `enableAllMenuItems()` gestiscono lo stato:

```javascript
export function disableMenuItems(enabledItems = ['home', 'settings']) {
    document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
        const tab = button.dataset.tab;
        if (!enabledItems.includes(tab)) {
            button.classList.add('disabled');
            button.setAttribute('aria-disabled', 'true');
            button.setAttribute('title', 'Completa il profilo per accedere a questa funzionalità');
        }
    });
}

export function enableAllMenuItems() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
        button.classList.remove('disabled');
        button.removeAttribute('aria-disabled');
        button.setAttribute('title', button.querySelector('.nav-label')?.textContent || '');
    });
}
```

### 4. Validazione e Correzione Automatica

```javascript
export function validateAndFixOnboardingState() {
    try {
        const recovery = recoverOnboardingState();
        
        if (recovery.reason === 'corrupted_profile') {
            // Tenta di recuperare i dati del profilo
            if (state.settings.teacherName && state.settings.teacherName.trim() !== '') {
                console.log('✅ Dati profilo recuperati');
                return true;
            } else {
                // Reset del flag onboarding per forzare ri-completamento
                console.warn('⚠️ Impossibile recuperare. Reset onboarding flag.');
                localStorage.removeItem('onboardingComplete');
                return false;
            }
        }
        
        return recovery.reason === 'complete';
    } catch (error) {
        console.error('❌ Errore validazione stato:', error);
        return false;
    }
}
```

## Come Risolvere il Problema

### Per l'Utente

1. **Vedere il banner arancione** in alto con "Configurazione incompleta"
2. **Cliccare su "Completa Profilo"** oppure andare in Impostazioni
3. **Compilare almeno il campo Nome** nel form
4. **Salvare** - Il menu si abiliterà automaticamente
5. **Ricaricare la pagina** se necessario

### Per lo Sviluppatore

#### Verifica Stato Corrente
```javascript
// In console browser
localStorage.getItem('onboardingComplete')  // Dovrebbe essere 'true'
localStorage.getItem('settings')             // Dovrebbe contenere teacherName

// Oppure usa le funzioni
import { recoverOnboardingState } from './js/data.js';
console.log(recoverOnboardingState());
```

#### Reset Manuale (per testing)
```javascript
// Reset completo
localStorage.clear();
location.reload();

// Reset solo onboarding
localStorage.removeItem('onboardingComplete');
location.reload();

// Imposta profilo corrotto (per test)
localStorage.setItem('onboardingComplete', 'true');
localStorage.setItem('settings', JSON.stringify({}));
location.reload();
```

#### Debug Mode
```javascript
// In app.js, dopo init()
console.log('Onboarding state:', recoverOnboardingState());
console.log('Profile complete:', isProfileComplete());
console.log('Settings:', state.settings);
```

## Test Automatici

I test in `tests/unit/onboarding.test.js` coprono tutti gli scenari:

```bash
# Esegui test onboarding
npm run test:onboarding

# Test specifici
npm test -- -t "should detect corrupted profile state"
npm test -- -t "should disable menu items when onboarding incomplete"
npm test -- -t "should enable all menu items when onboarding complete"
```

## Accessibilità

La gestione del menu inattivo è completamente accessibile:

### ARIA Attributes
```html
<button class="nav-item disabled" 
        data-tab="lessons" 
        aria-disabled="true"
        title="Completa il profilo per accedere a questa funzionalità">
    <span class="material-symbols-outlined">menu_book</span>
    <span class="nav-label">Lezioni</span>
</button>
```

### Screen Reader
- Voci disabilitate annunciate come "disabilitato"
- Tooltip letto quando il focus è sull'elemento
- Banner guida annunciato con ruolo `region`

### Keyboard Navigation
- Tab salta le voci disabilitate
- Enter/Space non attivano voci disabilitate
- Focus visibile su elementi abilitati

## Best Practices

### Durante lo Sviluppo

1. **Sempre testare con profilo incompleto**
   ```javascript
   localStorage.clear(); // Prima di ogni test
   ```

2. **Verificare tutti gli stati**
   - Onboarding non iniziato
   - Onboarding in corso
   - Profilo incompleto
   - Profilo completo
   - Dati corrotti

3. **Non saltare mai l'onboarding in produzione**
   ```javascript
   // ❌ NON FARE QUESTO
   localStorage.setItem('onboardingComplete', 'true'); // Senza dati
   
   // ✅ FARE QUESTO
   completeOnboarding({ teacherName: 'Mario', ... });
   ```

### Durante il Deployment

1. **Migrazioni dati** se si cambiano i campi richiesti
2. **Logging** per monitorare stati corrotti
3. **Backup** dei dati utente prima di aggiornamenti maggiori

## FAQ

### Q: Perché il menu è ancora disabilitato dopo aver compilato il profilo?

**A**: Prova a:
1. Ricaricare la pagina (F5)
2. Verificare che il campo Nome non sia vuoto
3. Controllare la console per errori
4. Cancellare cache e localStorage (Ctrl+Shift+Delete)

### Q: Come posso testare il menu inattivo senza compromettere i miei dati?

**A**: Usa il profilo Incognito del browser:
1. Apri una finestra Incognito
2. Vai all'app
3. Non completare l'onboarding
4. Osserva il menu disabilitato

### Q: Il menu si riabilita da solo dopo un po'?

**A**: No, è necessario l'intervento dell'utente. Il menu rimane disabilitato finché:
- L'onboarding non è completato, o
- Il profilo non è completato nelle Impostazioni

### Q: Cosa succede se localStorage è disabilitato?

**A**: L'app mostra un messaggio di errore critico e non funziona. È necessario abilitare localStorage nelle impostazioni del browser.

## Riferimenti

- **Codice**: `js/data.js`, `js/ui.js`, `app.js`
- **Test**: `tests/unit/onboarding.test.js`
- **Documentazione**: 
  - [ONBOARDING_FLOW_GUIDE.md](./ONBOARDING_FLOW_GUIDE.md)
  - [NAVIGATION_GUIDE.md](./NAVIGATION_GUIDE.md)
  - [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

---

**Versione**: 1.2.1  
**Ultimo Aggiornamento**: Ottobre 2025  
**Autore**: Docente++ Team
